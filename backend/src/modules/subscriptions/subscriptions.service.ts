import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getCurrentSubscription(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        subscriptions: {
          include: {
            plan: true,
          }
        },
      }
    });

    if (!tenant) throw new NotFoundException('Tenant not found');

    const activeSubscription = tenant.subscriptions?.find(sub => sub.status === 'ACTIVE' || sub.status === 'TRIALING') || tenant.subscriptions?.[0];

    if (activeSubscription) {
      return activeSubscription;
    }

    if (tenant.planId) {
      const plan = await this.prisma.plan.findUnique({ where: { id: tenant.planId } });
      if (plan) {
        return {
          tenantId: tenant.id,
          planId: plan.id,
          plan: plan,
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          startsAt: tenant.createdAt,
          expiresAt: tenant.subscriptionExpiresAt || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          nextRenewalAt: tenant.subscriptionExpiresAt,
        };
      }
    }

    throw new NotFoundException('No active subscription found');
  }

  async getAll() {
    return this.prisma.tenantSubscription.findMany({
      include: {
        tenant: { select: { id: true, name: true } },
        plan: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: string) {
    const sub = await this.prisma.tenantSubscription.findUnique({
      where: { id },
      include: {
        tenant: true,
        plan: true,
      },
    });
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  async create(data: any) {
    // Basic implementation to assign a plan to a tenant
    const { tenantId, planId, billingCycle } = data;
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    const expiresAt = new Date();
    if (billingCycle === 'YEARLY') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const sub = await this.prisma.tenantSubscription.create({
      data: {
        tenantId,
        planId,
        billingCycle,
        status: 'ACTIVE',
        startsAt: new Date(),
        expiresAt,
        nextRenewalAt: expiresAt,
      }
    });

    // Update the tenant's current subscriptionId
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionId: sub.id,
        planId: plan.id, // For backwards compatibility
        subscriptionExpiresAt: expiresAt,
      }
    });

    return sub;
  }

  async update(id: string, data: any) {
    return this.prisma.tenantSubscription.update({
      where: { id },
      data,
    });
  }
}
