import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  permissions?: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: {
          include: {
            role: true,
          }
        }
      }
    });

    if (user) {
      if (user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User account is not active');
      }
      return { ...user, permissions: payload.permissions || [] };
    }

    // Check if it's a platform admin
    const platformAdmin = await this.prisma.platformAdmin.findUnique({
      where: { id: payload.sub }
    });

    if (platformAdmin) {
      if (!platformAdmin.isActive) {
        throw new UnauthorizedException('Platform Admin account is not active');
      }
      return { ...platformAdmin, permissions: ['*'] };
    }

    throw new UnauthorizedException('User not found or disabled');
  }
}
