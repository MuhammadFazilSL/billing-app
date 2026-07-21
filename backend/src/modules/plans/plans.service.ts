import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.plan.findMany({
      orderBy: { monthlyPrice: 'asc' },
    });
  }

  async getOne(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async create(data: any) {
    return this.prisma.plan.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.plan.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const activeSub = await this.prisma.tenantSubscription.findFirst({
      where: { planId: id, status: 'ACTIVE' },
    });
    if (activeSub) {
      throw new BadRequestException('Cannot delete plan with active subscriptions');
    }

    return this.prisma.plan.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
