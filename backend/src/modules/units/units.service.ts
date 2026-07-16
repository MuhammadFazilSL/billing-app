import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createUnitDto: CreateUnitDto) {
    return this.prisma.unit.create({
      data: {
        ...createUnitDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.unit.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  async findOne(id: string, tenantId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!unit) throw new NotFoundException('Unit not found');
    return unit;
  }

  async update(id: string, tenantId: string, updateUnitDto: UpdateUnitDto) {
    await this.findOne(id, tenantId);
    return this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.unit.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
