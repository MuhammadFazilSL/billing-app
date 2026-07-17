import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalTenants = await this.prisma.tenant.count();
    const activeTenants = await this.prisma.tenant.count({ where: { status: 'ACTIVE' } });
    const totalPlans = await this.prisma.plan.count({ where: { isActive: true } });
    
    // Revenue for current month based on TenantSubscriptions (simplified)
    const activeSubscriptions = await this.prisma.tenantSubscription.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true },
    });

    const monthlyRevenue = activeSubscriptions.reduce((acc, sub) => {
      const price = sub.billingCycle === 'MONTHLY' ? Number(sub.plan.monthlyPrice || 0) : Number(sub.plan.yearlyPrice || 0) / 12;
      return acc + price;
    }, 0);

    return {
      totalTenants,
      activeTenants,
      totalPlans,
      monthlyRevenue,
    };
  }

  async getTenants() {
    return this.prisma.tenant.findMany({
      include: {
        plan: true,
        usageMetric: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTenantStatus(id: string, status: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    return this.prisma.tenant.update({
      where: { id },
      data: { status },
    });
  }
}
