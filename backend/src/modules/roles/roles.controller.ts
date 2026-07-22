import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('Owner', 'Manager')
  @ApiOperation({ summary: 'Get all roles' })
  findAll(@CurrentUser() user: any) {
    return this.rolesService.findAll(user.tenantId);
  }

  @Get('user/:userId')
  @Roles('Owner', 'Manager')
  @ApiOperation({ summary: 'Get roles assigned to a user' })
  getUserRoles(@Param('userId') userId: string, @CurrentUser() user: any) {
    return this.rolesService.getUserRoles(userId, user.tenantId);
  }

  @Post('assign')
  @Roles('Owner')
  @ApiOperation({ summary: 'Assign a role to a user (Owner only)' })
  assignRole(@CurrentUser() user: any, @Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.assignRole(user.tenantId, assignRoleDto);
  }

  @Delete('unassign')
  @Roles('Owner')
  @Permissions('Roles.AssignPermissions')
  @ApiOperation({ summary: 'Unassign a role from a user (Owner only)' })
  unassignRole(@CurrentUser() user: any, @Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.unassignRole(user.tenantId, assignRoleDto);
  }

  @Get(':id/permissions')
  @Permissions('Roles.View')
  @ApiOperation({ summary: 'Get permissions for a role' })
  getRolePermissions(@Param('id') roleId: string, @CurrentUser() user: any) {
    return this.rolesService.getRolePermissions(roleId, user.tenantId);
  }

  @Put(':id/permissions')
  @Permissions('Roles.AssignPermissions')
  @ApiOperation({ summary: 'Update permissions for a role' })
  updateRolePermissions(
    @Param('id') roleId: string, 
    @Body('permissions') permissions: string[], 
    @CurrentUser() user: any
  ) {
    return this.rolesService.updateRolePermissions(roleId, user.tenantId, permissions);
  }

  @Post(':id/clone')
  @Permissions('Roles.Create')
  @ApiOperation({ summary: 'Clone a role' })
  cloneRole(
    @Param('id') roleId: string, 
    @Body('name') name: string,
    @Body('description') description: string,
    @CurrentUser() user: any
  ) {
    return this.rolesService.cloneRole(roleId, user.tenantId, name, description);
  }
}
