import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
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

  @Patch('tenants/:id/status')
  @ApiOperation({ summary: 'Update Tenant Status' })
  updateTenantStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.platformService.updateTenantStatus(id, status);
  }
}
