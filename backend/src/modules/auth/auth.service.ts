import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Get or create a default plan
        let planId = dto.planId;
        if (!planId || planId === 'string') {
          const defaultPlan = await tx.plan.findFirst();
          if (defaultPlan) {
            planId = defaultPlan.id;
          } else {
            const newPlan = await tx.plan.create({
              data: {
                name: 'Default Trial Plan',
                price: 0,
                billingCycle: 'MONTHLY',
                maxProducts: 100,
                maxEmployees: 5,
                maxInvoicesPerMonth: 50,
              },
            });
            planId = newPlan.id;
          }
        }

        // 2. Create Tenant
        const slug = `${dto.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
        const tenant = await tx.tenant.create({
          data: {
            name: dto.companyName,
            slug,
            planId,
            subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
            settings: { setupCompleted: false },
          },
        });

        // 3. Create Default Roles
        const ownerRole = await tx.role.create({ data: { tenantId: tenant.id, name: 'Owner', isSystemRole: true } });
        await tx.role.create({ data: { tenantId: tenant.id, name: 'Manager', isSystemRole: true } });
        await tx.role.create({ data: { tenantId: tenant.id, name: 'Cashier', isSystemRole: true } });

        // 4. Create Owner User
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await tx.user.create({
          data: {
            email: dto.email,
            passwordHash: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            tenantId: tenant.id,
            isMasterAdmin: true,
            userRoles: {
              create: {
                roleId: ownerRole.id,
              },
            },
          },
        });

        return user;
      });

      return this.generateTokens(result.id, result.email, result.tenantId);
    } catch (error: any) {
      throw new InternalServerErrorException('Registration failed: ' + error.message);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.tenantId);
  }

  async logout(userId: string, token: string) {
    // 1. Remove refresh token from DB
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });

    // 2. Blacklist the access token in Redis (TTL: 15 minutes = 900 seconds)
    if (token) {
      await this.redisService.set(`blacklist:${token}`, 'true', 900);
    }

    return { message: 'Logged out successfully' };
  }

  async refreshTokens(dto: RefreshDto) {
    try {
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const isRefreshTokenValid = await bcrypt.compare(dto.refreshToken, user.hashedRefreshToken);
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Access Denied');
      }

      return this.generateTokens(user.id, user.email, user.tenantId);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
        userRoles: {
          include: {
            role: true,
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { passwordHash, hashedRefreshToken, ...safeUser } = user;
    return safeUser;
  }

  private async generateTokens(userId: string, email: string, tenantId: string | null) {
    const payload = { sub: userId, email, tenantId };
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '7d', // 7 days refresh token
      }),
    ]);

    // Save hashed refresh token to DB for rotation
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
