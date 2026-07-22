import { Controller, Get, Body, Patch, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdateRegionalDto } from './dto/update-regional.dto';
import { UpdatePreferencesDto, UpdateBackupDto } from './dto/update-preferences.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('company')
  getCompanyProfile(@Request() req: any) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.getCompanyProfile(req.user.tenantId);
  }

  @Patch('company')
  updateCompanyProfile(@Request() req: any, @Body() updateCompanyDto: UpdateCompanyDto) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.updateCompanyProfile(req.user.tenantId, updateCompanyDto);
  }

  @Get()
  getTenantSettings(@Request() req: any) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.getTenantSettings(req.user.tenantId);
  }

  @Patch('invoice')
  updateInvoiceSettings(@Request() req: any, @Body() dto: UpdateInvoiceDto) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.updateSettings(req.user.tenantId, dto);
  }

  @Patch('tax')
  updateTaxSettings(@Request() req: any, @Body() dto: UpdateTaxDto) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.updateSettings(req.user.tenantId, dto);
  }

  @Patch('printer')
  updatePrinterSettings(@Request() req: any, @Body() dto: UpdatePrinterDto) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.updateSettings(req.user.tenantId, dto);
  }

  @Patch('email')
  updateEmailSettings(@Request() req: any, @Body() dto: UpdateEmailDto) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.updateSettings(req.user.tenantId, dto);
  }

  @Patch('regional')
  updateRegionalSettings(@Request() req: any, @Body() dto: UpdateRegionalDto) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.updateSettings(req.user.tenantId, dto);
  }

  @Patch('preferences')
  updatePreferencesSettings(@Request() req: any, @Body() dto: UpdatePreferencesDto) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.updateSettings(req.user.tenantId, dto);
  }

  @Patch('backup')
  updateBackupSettings(@Request() req: any, @Body() dto: UpdateBackupDto) {
    if (!req.user.tenantId) throw new UnauthorizedException('Tenant access required.');
    return this.settingsService.updateSettings(req.user.tenantId, dto);
  }
}
