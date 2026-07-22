import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdateRegionalDto } from './dto/update-regional.dto';
import { UpdatePreferencesDto, UpdateBackupDto } from './dto/update-preferences.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getCompanyProfile(tenantId: string) {
    if (!tenantId) throw new Error('Tenant ID is required');
    let profile = await this.prisma.companyProfile.findUnique({ where: { tenantId } });
    if (!profile) {
      const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
      profile = await this.prisma.companyProfile.create({
        data: { tenantId, companyName: tenant?.name || 'Company Name' },
      });
    }
    return profile;
  }

  async updateCompanyProfile(tenantId: string, updateCompanyDto: UpdateCompanyDto) {
    return this.prisma.companyProfile.upsert({
      where: { tenantId },
      create: { tenantId, companyName: 'Company Name', ...updateCompanyDto },
      update: updateCompanyDto,
    });
  }

  async getTenantSettings(tenantId: string) {
    if (!tenantId) throw new Error('Tenant ID is required');
    let settings = await this.prisma.tenantSettings.findUnique({ where: { tenantId } });
    if (!settings) {
      settings = await this.prisma.tenantSettings.create({ data: { tenantId } });
    }
    return settings;
  }

  async updateSettings(tenantId: string, data: any) {
    return this.prisma.tenantSettings.upsert({
      where: { tenantId },
      create: { tenantId, ...data },
      update: data,
    });
  }
}
