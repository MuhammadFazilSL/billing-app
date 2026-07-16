import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.role.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async assignRole(tenantId: string, assignRoleDto: AssignRoleDto) {
    // Verify user exists in tenant
    const user = await this.prisma.user.findFirst({
      where: { id: assignRoleDto.userId, tenantId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify role exists in tenant
    const role = await this.prisma.role.findFirst({
      where: { id: assignRoleDto.roleId, tenantId, deletedAt: null },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if role is already assigned
    const existingAssignment = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: assignRoleDto.userId,
          roleId: assignRoleDto.roleId,
        }
      }
    });

    if (existingAssignment) {
      throw new BadRequestException('Role is already assigned to this user');
    }

    return this.prisma.userRole.create({
      data: {
        userId: assignRoleDto.userId,
        roleId: assignRoleDto.roleId,
      }
    });
  }
  
  async getUserRoles(userId: string, tenantId: string) {
    return this.prisma.userRole.findMany({
      where: { userId, user: { tenantId } },
      include: { role: true },
    });
  }

  async unassignRole(tenantId: string, assignRoleDto: AssignRoleDto) {
    return this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId: assignRoleDto.userId,
          roleId: assignRoleDto.roleId,
        }
      }
    });
  }
}
