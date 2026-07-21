import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformJwtAuthGuard } from '../admin/guards/platform-jwt-auth.guard';

@ApiTags('Platform')
@Controller('platform')
@UseGuards(PlatformJwtAuthGuard)
@ApiBearerAuth()
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Platform Dashboard Stats' })
  getDashboard() {
    return this.platformService.getDashboardStats();
  }

  @Get('tenants')
  @ApiOperation({ summary: 'Get all Tenants' })
  getTenants() {
    return this.platformService.getTenants();
  }

  @Get('tenants/:id')
  @ApiOperation({ summary: 'Get a single Tenant Details' })
  getTenant(@Param('id') id: string) {
    return this.platformService.getTenant(id);
  }

  @Patch('tenants/:id')
  @ApiOperation({ summary: 'Update Tenant' })
  updateTenant(@Param('id') id: string, @Body() data: any) {
    return this.platformService.updateTenant(id, data);
  }

  @Patch('tenants/:id/status')
  @ApiOperation({ summary: 'Update Tenant Status' })
  updateTenantStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.platformService.updateTenantStatus(id, status);
  }

  @Delete('tenants/:id')
  @ApiOperation({ summary: 'Soft Delete Tenant' })
  deleteTenant(@Param('id') id: string) {
    return this.platformService.deleteTenant(id);
  }
}
