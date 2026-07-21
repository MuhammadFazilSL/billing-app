import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { PlatformSettingsService } from './platform-settings.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformJwtAuthGuard } from '../admin/guards/platform-jwt-auth.guard';

@ApiTags('Platform Settings')
@Controller('platform/settings')
@UseGuards(PlatformJwtAuthGuard)
@ApiBearerAuth()
export class PlatformSettingsController {
  constructor(private readonly platformSettingsService: PlatformSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Platform Settings' })
  getSettings() {
    return this.platformSettingsService.getSettings();
  }

  @Patch()
  @ApiOperation({ summary: 'Update Platform Settings' })
  updateSettings(@Body() data: any) {
    return this.platformSettingsService.updateSettings(data);
  }
}
