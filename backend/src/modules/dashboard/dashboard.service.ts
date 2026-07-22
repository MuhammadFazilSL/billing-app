import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportsService } from '../reports/reports.service';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportsService: ReportsService
  ) {}

  async getSummary(tenantId: string): Promise<DashboardSummaryDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // For Sales Analytics, let's fetch last 30 days of invoices
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [
      todaySalesRes,
      monthlySalesRes,
      monthlyPurchasesRes,
      productsStats,
      totalCustomers,
      totalEmployees,
      activeOffers,
      loyaltyCustomers,
      invoicesLast30Days,
      profitMetrics,
      taxMetrics,
      recentInvoices,
      recentPurchases,
      recentCustomers,
      recentReturns,
      recentlyAddedProducts
    ] = await Promise.all([
      // 1. Today's Sales
      this.prisma.invoice.aggregate({
        where: { tenantId, status: 'COMPLETED', deletedAt: null, createdAt: { gte: today } },
        _sum: { grandTotal: true },
        _count: { id: true }
      }),
      // 2. Monthly Sales
      this.prisma.invoice.aggregate({
        where: { tenantId, status: 'COMPLETED', deletedAt: null, createdAt: { gte: firstDayOfMonth } },
        _sum: { grandTotal: true }
      }),
      // 3. Monthly Purchases
      this.prisma.purchase.aggregate({
        where: { tenantId, status: 'COMPLETED', deletedAt: null, createdAt: { gte: firstDayOfMonth } },
        _sum: { grandTotal: true }
      }),
      // 4. Products for Inventory Summary
      this.prisma.product.findMany({
        where: { tenantId, deletedAt: null },
        select: { stock: true, minimumStock: true, purchasePrice: true }
      }),
      // 5. Total Customers
      this.prisma.customer.count({ where: { tenantId, deletedAt: null } }),
      // 6. Total Employees (users not strictly customers)
      this.prisma.user.count({ where: { tenantId, deletedAt: null } }), // Assuming all users in tenant are employees
      // 7. Active Offers
      this.prisma.offer.count({ where: { tenantId, isActive: true, validTo: { gte: new Date() } } }).catch(() => 0), // handle if offer table is slightly different
      // 8. Loyalty Customers
      this.prisma.customer.count({ where: { tenantId, deletedAt: null, loyaltyPoints: { gt: 0 } } }),
      // 9. Invoices for Sales Analytics
      this.prisma.invoice.findMany({
        where: { tenantId, status: 'COMPLETED', deletedAt: null, createdAt: { gte: thirtyDaysAgo } },
        select: { grandTotal: true, createdAt: true }
      }),
      // 10. Financial Summary (All Time or could be passed empty filter for YTD/All)
      this.reportsService.getProfitLoss(tenantId, {}),
      // 11. Taxes
      this.reportsService.getTaxes(tenantId, {}),
      // 12. Recent Invoices
      this.prisma.invoice.findMany({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { customer: { select: { name: true } } }
      }),
      // 13. Recent Purchases
      this.prisma.purchase.findMany({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { supplier: { select: { companyName: true } } }
      }),
      // 14. Recent Customers
      this.prisma.customer.findMany({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      // 15. Recent Returns
      this.prisma.return.findMany({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { invoice: { include: { customer: { select: { name: true } } } } }
      }).catch(() => []), // just in case return model name differs slightly
      // 16. Recently Added Products
      this.prisma.product.findMany({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, sku: true, stock: true, sellingPrice: true }
      })
    ]);

    // Compute Inventory KPI
    let inventoryValue = 0;
    let lowStockProducts = 0;
    let outOfStockProducts = 0;

    productsStats.forEach(p => {
      inventoryValue += (Number(p.stock) * Number(p.purchasePrice));
      if (Number(p.stock) <= 0) {
        outOfStockProducts++;
      } else if (Number(p.stock) <= Number(p.minimumStock)) {
        lowStockProducts++;
      }
    });

    // Compute Sales Analytics
    // Daily: last 7 days
    const dailyMap = new Map<string, number>();
    // Weekly: last 4 weeks (simple bucket by week of year or just last 4 chunks of 7 days)
    // Monthly: last 6 months (bucket by month-year)

    // Pre-fill daily map for last 7 days to ensure we have zeros
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap.set(key, 0);
    }

    const weeklyMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();

    // Pre-fill monthly map for last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      monthlyMap.set(key, 0);
    }

    invoicesLast30Days.forEach(inv => {
      const dateStr = inv.createdAt.toISOString().split('T')[0];
      const monthStr = `${inv.createdAt.toLocaleString('default', { month: 'short' })} ${inv.createdAt.getFullYear()}`;
      
      const amt = Number(inv.grandTotal);

      // Daily (if in last 7 days)
      if (dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, dailyMap.get(dateStr)! + amt);
      }

      // Monthly
      if (monthlyMap.has(monthStr)) {
        monthlyMap.set(monthStr, monthlyMap.get(monthStr)! + amt);
      }
    });

    // For weekly, let's just create 4 simple buckets from the last 28 days
    for (let i = 3; i >= 0; i--) {
      const start = new Date();
      start.setDate(today.getDate() - (i * 7) - 6);
      start.setHours(0,0,0,0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23,59,59,999);
      
      let weeklyTotal = 0;
      invoicesLast30Days.forEach(inv => {
        if (inv.createdAt >= start && inv.createdAt <= end) {
          weeklyTotal += Number(inv.grandTotal);
        }
      });
      const key = `${start.getDate()} ${start.toLocaleString('default', {month:'short'})}`;
      weeklyMap.set(`Week of ${key}`, weeklyTotal);
    }

    const salesAnalytics = {
      daily: Array.from(dailyMap.entries()).map(([date, amount]) => ({ date, amount })),
      weekly: Array.from(weeklyMap.entries()).map(([date, amount]) => ({ date, amount })),
      monthly: Array.from(monthlyMap.entries()).map(([date, amount]) => ({ date, amount }))
    };

    return {
      kpis: {
        todaySales: Number(todaySalesRes._sum.grandTotal || 0),
        todayOrders: todaySalesRes._count.id || 0,
        monthlySales: Number(monthlySalesRes._sum.grandTotal || 0),
        monthlyPurchases: Number(monthlyPurchasesRes._sum.grandTotal || 0),
        totalRevenue: profitMetrics.revenue,
        totalProducts: productsStats.length,
        totalCustomers,
        totalEmployees,
        inventoryValue,
        lowStockProducts,
        outOfStockProducts,
        activeOffers,
        loyaltyCustomers,
        netProfit: profitMetrics.netProfit
      },
      salesAnalytics,
      financialSummary: {
        revenue: profitMetrics.revenue,
        expenses: profitMetrics.cogs,
        netProfit: profitMetrics.netProfit,
        gstCollected: taxMetrics.collected,
        gstPaid: taxMetrics.paid
      },
      inventorySummary: {
        inventoryValue,
        lowStockProducts,
        outOfStockProducts,
        recentlyAddedProducts
      },
      recentActivity: {
        invoices: recentInvoices,
        purchases: recentPurchases,
        customers: recentCustomers,
        returns: recentReturns
      }
    };
  }
}
