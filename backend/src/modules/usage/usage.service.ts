import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  async getUsage(tenantId: string) {
    let usage = await this.prisma.usageMetric.findUnique({
      where: { tenantId },
    });

    if (!usage) {
      usage = await this.prisma.usageMetric.create({
        data: { tenantId },
      });
    }

    return usage;
  }

  async incrementProducts(tenantId: string, amount: number = 1) {
    await this.prisma.usageMetric.upsert({
      where: { tenantId },
      update: { productsUsed: { increment: amount } },
      create: { tenantId, productsUsed: amount },
    });
  }

  async decrementProducts(tenantId: string, amount: number = 1) {
    await this.prisma.usageMetric.updateMany({
      where: { tenantId, productsUsed: { gte: amount } },
      data: { productsUsed: { decrement: amount } },
    });
  }

  async incrementCustomers(tenantId: string, amount: number = 1) {
    await this.prisma.usageMetric.upsert({
      where: { tenantId },
      update: { customersUsed: { increment: amount } },
      create: { tenantId, customersUsed: amount },
    });
  }

  async decrementCustomers(tenantId: string, amount: number = 1) {
    await this.prisma.usageMetric.updateMany({
      where: { tenantId, customersUsed: { gte: amount } },
      data: { customersUsed: { decrement: amount } },
    });
  }

  async incrementEmployees(tenantId: string, amount: number = 1) {
    await this.prisma.usageMetric.upsert({
      where: { tenantId },
      update: { employeesUsed: { increment: amount } },
      create: { tenantId, employeesUsed: amount },
    });
  }

  async decrementEmployees(tenantId: string, amount: number = 1) {
    await this.prisma.usageMetric.updateMany({
      where: { tenantId, employeesUsed: { gte: amount } },
      data: { employeesUsed: { decrement: amount } },
    });
  }

  async incrementInvoices(tenantId: string, amount: number = 1) {
    await this.prisma.usageMetric.upsert({
      where: { tenantId },
      update: { invoicesThisMonth: { increment: amount } },
      create: { tenantId, invoicesThisMonth: amount },
    });
  }
}
