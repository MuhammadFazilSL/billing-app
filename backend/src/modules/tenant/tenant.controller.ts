import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Tenant')
@Controller('tenant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('settings')
  @ApiOperation({ summary: 'Get current tenant settings' })
  getSettings(@CurrentUser() user: any) {
    return this.tenantService.getTenantSettings(user.tenantId);
  }
}
