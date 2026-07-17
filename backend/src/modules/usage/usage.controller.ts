import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsageService } from './usage.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformJwtAuthGuard } from '../admin/guards/platform-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Usage')
@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get(':tenantId')
  @UseGuards(PlatformJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Usage Metrics for a Tenant (Admin)' })
  getUsageForAdmin(@Param('tenantId') tenantId: string) {
    return this.usageService.getUsage(tenantId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Current Tenant Usage' })
  getMyUsage(@Request() req: any) {
    return this.usageService.getUsage(req.user.tenantId);
  }
}
