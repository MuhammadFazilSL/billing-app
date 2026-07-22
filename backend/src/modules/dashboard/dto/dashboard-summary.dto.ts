import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto {
  @ApiProperty()
  kpis: {
    todaySales: number;
    todayOrders: number;
    monthlySales: number;
    monthlyPurchases: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    totalEmployees: number;
    inventoryValue: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    activeOffers: number;
    loyaltyCustomers: number;
    netProfit: number;
  };

  @ApiProperty()
  salesAnalytics: {
    daily: { date: string; amount: number }[];
    weekly: { date: string; amount: number }[];
    monthly: { date: string; amount: number }[];
  };

  @ApiProperty()
  financialSummary: {
    revenue: number;
    expenses: number;
    netProfit: number;
    gstCollected: number;
    gstPaid: number;
  };

  @ApiProperty()
  inventorySummary: {
    inventoryValue: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    recentlyAddedProducts: any[];
  };

  @ApiProperty()
  recentActivity: {
    invoices: any[];
    purchases: any[];
    customers: any[];
    returns: any[];
  };
}
