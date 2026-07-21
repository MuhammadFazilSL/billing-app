import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let config = await this.prisma.platformConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await this.prisma.platformConfig.create({
        data: {
          id: 'default',
          platformName: 'Billing SaaS',
        },
      });
    }

    return config;
  }

  async updateSettings(data: any) {
    await this.getSettings();

    return this.prisma.platformConfig.update({
      where: { id: 'default' },
      data,
    });
  }
}
