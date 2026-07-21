import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalTenants,
      activeTenants,
      trialTenants,
      suspendedTenants,
      expiredTenants,
      totalPlans,
      activeSubscriptions,
      totalProducts,
      totalInvoices,
      recentTenants,
      recentSubscriptions,
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { status: 'ACTIVE' } }),
      this.prisma.tenant.count({ where: { status: 'TRIAL' } }),
      this.prisma.tenant.count({ where: { status: 'SUSPENDED' } }),
      this.prisma.tenant.count({ where: { status: 'EXPIRED' } }),
      this.prisma.plan.count({ where: { isActive: true } }),
      this.prisma.tenantSubscription.findMany({
        where: { status: 'ACTIVE' },
        include: { plan: true },
      }),
      this.prisma.product.count(),
      this.prisma.invoice.count(),
      this.prisma.tenant.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { plan: true },
      }),
      this.prisma.tenantSubscription.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { plan: true, tenant: true },
      }),
    ]);

    const monthlyRevenue = activeSubscriptions.reduce((acc, sub) => {
      const price = sub.billingCycle === 'MONTHLY' ? Number(sub.plan.monthlyPrice || 0) : Number(sub.plan.yearlyPrice || 0) / 12;
      return acc + price;
    }, 0);

    return {
      totalTenants,
      activeTenants,
      trialTenants,
      suspendedTenants,
      expiredTenants,
      totalPlans,
      activeSubscriptions: activeSubscriptions.length,
      monthlyRevenue,
      totalProducts,
      totalInvoices,
      recentTenants,
      recentSubscriptions,
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

  async getTenant(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        plan: true,
        usageMetric: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          include: { plan: true },
        },
        users: {
          where: { isMasterAdmin: true },
        }
      },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async updateTenant(id: string, data: any) {
    return this.prisma.tenant.update({
      where: { id },
      data,
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

  async deleteTenant(id: string) {
    // Soft delete
    return this.prisma.tenant.update({
      where: { id },
      data: { status: 'DELETED' },
    });
  }
}
