import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private getDateFilter(dto: ReportFilterDto) {
    if (!dto.startDate && !dto.endDate) return undefined;
    const dateFilter: any = {};
    if (dto.startDate) dateFilter.gte = new Date(dto.startDate);
    if (dto.endDate) {
      const end = new Date(dto.endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }
    return dateFilter;
  }

  private getPagination(dto: ReportFilterDto) {
    const page = parseInt(dto.page || '1', 10);
    const limit = parseInt(dto.limit || '50', 10);
    return { skip: (page - 1) * limit, take: limit, page, limit };
  }

  async getDashboard(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todaySales,
      monthlySales,
      inventoryProducts,
      totalCustomers,
      totalSuppliers,
      profitMetrics
    ] = await Promise.all([
      this.prisma.invoice.aggregate({
        where: { tenantId, createdAt: { gte: today }, status: 'COMPLETED', deletedAt: null },
        _sum: { grandTotal: true, taxAmount: true }
      }),
      this.prisma.invoice.aggregate({
        where: { tenantId, createdAt: { gte: firstDayOfMonth }, status: 'COMPLETED', deletedAt: null },
        _sum: { grandTotal: true }
      }),
      this.prisma.product.findMany({
        where: { tenantId, deletedAt: null },
        select: { stock: true, purchasePrice: true, minimumStock: true }
      }),
      this.prisma.customer.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.supplier.count({ where: { tenantId, deletedAt: null } }),
      this.getProfitLoss(tenantId, {})
    ]);

    let inventoryValue = 0;
    let lowStockCount = 0;
    
    inventoryProducts.forEach(p => {
      inventoryValue += (Number(p.stock) * Number(p.purchasePrice));
      if (Number(p.stock) <= Number(p.minimumStock)) {
        lowStockCount++;
      }
    });

    return {
      todaySales: Number(todaySales._sum.grandTotal || 0),
      monthlySales: Number(monthlySales._sum.grandTotal || 0),
      taxCollectedToday: Number(todaySales._sum.taxAmount || 0),
      inventoryValue,
      lowStockCount,
      totalProducts: inventoryProducts.length,
      totalCustomers,
      totalSuppliers,
      profit: profitMetrics.netProfit
    };
  }

  async getSales(tenantId: string, filter: ReportFilterDto) {
    const dateFilter = this.getDateFilter(filter);
    const { skip, take, page, limit } = this.getPagination(filter);
    
    const where: any = { tenantId, status: 'COMPLETED', deletedAt: null };
    if (dateFilter) where.createdAt = dateFilter;
    if (filter.search) {
      where.OR = [
        { invoiceNumber: { contains: filter.search, mode: 'insensitive' } },
        { customer: { name: { contains: filter.search, mode: 'insensitive' } } }
      ];
    }

    const [data, total, summary] = await Promise.all([
      this.prisma.invoice.findMany({
        where, skip, take, orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true } } }
      }),
      this.prisma.invoice.count({ where }),
      this.prisma.invoice.aggregate({ where, _sum: { subTotal: true, taxAmount: true, discountAmount: true, grandTotal: true } })
    ]);

    return { data, total, page, limit, summary: summary._sum };
  }

  async getPurchases(tenantId: string, filter: ReportFilterDto) {
    const dateFilter = this.getDateFilter(filter);
    const { skip, take, page, limit } = this.getPagination(filter);
    
    const where: any = { tenantId, status: 'COMPLETED', deletedAt: null };
    if (dateFilter) where.createdAt = dateFilter;
    if (filter.search) {
      where.OR = [
        { purchaseNumber: { contains: filter.search, mode: 'insensitive' } },
        { supplier: { companyName: { contains: filter.search, mode: 'insensitive' } } }
      ];
    }

    const [data, total, summary] = await Promise.all([
      this.prisma.purchase.findMany({
        where, skip, take, orderBy: { createdAt: 'desc' },
        include: { supplier: { select: { companyName: true } } }
      }),
      this.prisma.purchase.count({ where }),
      this.prisma.purchase.aggregate({ where, _sum: { subTotal: true, taxAmount: true, discountAmount: true, grandTotal: true } })
    ]);

    return { data, total, page, limit, summary: summary._sum };
  }

  async getInventory(tenantId: string, filter: ReportFilterDto) {
    const { skip, take, page, limit } = this.getPagination(filter);
    const where: any = { tenantId, deletedAt: null };
    if (filter.search) {
      where.name = { contains: filter.search, mode: 'insensitive' };
    }

    const [data, total, allProducts] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({ where: { tenantId, deletedAt: null }, select: { stock: true, purchasePrice: true } })
    ]);

    const totalValue = allProducts.reduce((acc, p) => acc + (Number(p.stock) * Number(p.purchasePrice)), 0);

    return { data, total, page, limit, summary: { totalValue } };
  }

  async getCustomers(tenantId: string, filter: ReportFilterDto) {
    const { skip, take, page, limit } = this.getPagination(filter);
    const where: any = { tenantId, deletedAt: null };
    if (filter.search) {
      where.name = { contains: filter.search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where, skip, take, orderBy: { name: 'asc' },
        include: { _count: { select: { invoices: { where: { status: 'COMPLETED' } } } } }
      }),
      this.prisma.customer.count({ where })
    ]);

    return { data, total, page, limit };
  }

  async getSuppliers(tenantId: string, filter: ReportFilterDto) {
    const { skip, take, page, limit } = this.getPagination(filter);
    const where: any = { tenantId, deletedAt: null };
    if (filter.search) {
      where.companyName = { contains: filter.search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where, skip, take, orderBy: { companyName: 'asc' },
        include: { _count: { select: { purchases: { where: { status: 'COMPLETED' } } } } }
      }),
      this.prisma.supplier.count({ where })
    ]);

    return { data, total, page, limit };
  }

  async getTaxes(tenantId: string, filter: ReportFilterDto) {
    const dateFilter = this.getDateFilter(filter);
    
    // Aggregate tax collected from sales
    const salesWhere: any = { tenantId, status: 'COMPLETED', deletedAt: null };
    if (dateFilter) salesWhere.createdAt = dateFilter;
    
    // Aggregate tax paid in purchases
    const purchasesWhere: any = { tenantId, status: 'COMPLETED', deletedAt: null };
    if (dateFilter) purchasesWhere.createdAt = dateFilter;

    const [sales, purchases] = await Promise.all([
      this.prisma.invoice.aggregate({ where: salesWhere, _sum: { taxAmount: true } }),
      this.prisma.purchase.aggregate({ where: purchasesWhere, _sum: { taxAmount: true } })
    ]);

    const collected = Number(sales._sum.taxAmount || 0);
    const paid = Number(purchases._sum.taxAmount || 0);

    return { collected, paid, netPayable: collected - paid };
  }

  async getProfitLoss(tenantId: string, filter: ReportFilterDto) {
    const dateFilter = this.getDateFilter(filter);
    
    const invoiceWhere: any = { tenantId, status: 'COMPLETED', deletedAt: null };
    if (dateFilter) invoiceWhere.createdAt = dateFilter;
    
    // COGS based on invoice items for accurate profit calculation
    // Since invoice items store unitCost at time of sale
    const [sales, invoiceItems] = await Promise.all([
      this.prisma.invoice.aggregate({ where: invoiceWhere, _sum: { subTotal: true, discountAmount: true } }),
      this.prisma.invoiceItem.findMany({
        where: { tenantId, invoice: { status: 'COMPLETED', deletedAt: null, createdAt: dateFilter || undefined } },
        select: { quantity: true, unitCost: true }
      })
    ]);

    const revenue = Number(sales._sum.subTotal || 0) - Number(sales._sum.discountAmount || 0);
    
    // Cost of Goods Sold (COGS)
    let cogs = 0;
    invoiceItems.forEach(item => {
      cogs += Number(item.quantity) * Number(item.unitCost);
    });

    const netProfit = revenue - cogs;

    return { revenue, cogs, netProfit, marginPercent: revenue > 0 ? ((netProfit / revenue) * 100).toFixed(2) : 0 };
  }
}
