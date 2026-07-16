import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';

@Injectable()
export class TaxesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createTaxDto: CreateTaxDto) {
    if (createTaxDto.isDefault) {
      await this.clearDefaults(tenantId);
    }
    return this.prisma.tax.create({
      data: {
        ...createTaxDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.tax.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  async findOne(id: string, tenantId: string) {
    const tax = await this.prisma.tax.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!tax) throw new NotFoundException('Tax not found');
    return tax;
  }

  async update(id: string, tenantId: string, updateTaxDto: UpdateTaxDto) {
    await this.findOne(id, tenantId);
    
    if (updateTaxDto.isDefault) {
      await this.clearDefaults(tenantId);
    }
    
    return this.prisma.tax.update({
      where: { id },
      data: updateTaxDto,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.tax.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async clearDefaults(tenantId: string) {
    await this.prisma.tax.updateMany({
      where: { tenantId, isDefault: true, deletedAt: null },
      data: { isDefault: false },
    });
  }
}
