import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

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

    const assignment = await this.prisma.userRole.create({
      data: {
        userId: assignRoleDto.userId,
        roleId: assignRoleDto.roleId,
      }
    });
    
    await this.notificationsService.emitNotification({
      tenantId,
      module: 'Platform',
      type: 'INFO',
      title: 'Role Assigned',
      message: `Role ${role.name} was assigned to user.`,
      referenceId: user.id,
      referenceType: 'Employee',
    });
    
    return assignment;
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

  async getRolePermissions(roleId: string, tenantId: string) {
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, tenantId },
      include: {
        rolePermissions: {
          include: { permission: true }
        }
      }
    });
    if (!role) throw new NotFoundException('Role not found');
    return role.rolePermissions.map(rp => rp.permission.code);
  }

  async updateRolePermissions(roleId: string, tenantId: string, permissionCodes: string[]) {
    const role = await this.prisma.role.findFirst({ where: { id: roleId, tenantId } });
    if (!role) throw new NotFoundException('Role not found');

    if (role.name === 'Owner' || role.name === 'Admin') {
      if (permissionCodes.length === 0) {
        throw new BadRequestException('Cannot remove all permissions from Owner/Admin role');
      }
    }

    // Fetch all permission IDs for the provided codes
    const permissions = await this.prisma.permission.findMany({
      where: { code: { in: permissionCodes } }
    });

    // Run in transaction
    await this.prisma.$transaction(async (tx) => {
      // Delete existing
      await tx.rolePermission.deleteMany({
        where: { roleId }
      });

      // Insert new
      if (permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: permissions.map(p => ({
            roleId,
            permissionId: p.id
          }))
        });
      }
    });

    return { success: true };
  }

  async cloneRole(roleId: string, tenantId: string, newName: string, newDescription?: string) {
    const sourceRole = await this.prisma.role.findFirst({
      where: { id: roleId, tenantId },
      include: { rolePermissions: true }
    });
    if (!sourceRole) throw new NotFoundException('Source role not found');

    const existingRole = await this.prisma.role.findFirst({
      where: { tenantId, name: newName }
    });
    if (existingRole) throw new BadRequestException(`Role with name ${newName} already exists`);

    return this.prisma.$transaction(async (tx) => {
      const newRole = await tx.role.create({
        data: {
          tenantId,
          name: newName,
          description: newDescription || `Cloned from ${sourceRole.name}`,
          isSystemRole: false
        }
      });

      if (sourceRole.rolePermissions.length > 0) {
        await tx.rolePermission.createMany({
          data: sourceRole.rolePermissions.map(rp => ({
            roleId: newRole.id,
            permissionId: rp.permissionId
          }))
        });
      }

      return newRole;
    });
  }
}
