import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { api } from '../../../api/axios';

import { LoadingDashboard } from '../../../components/dashboard/LoadingDashboard';
import { EmptyDashboard } from '../../../components/dashboard/EmptyDashboard';
import { MetricCard } from '../../../components/dashboard/MetricCard';
import { SalesOverview } from '../../../components/dashboard/SalesOverview';
import { SummaryCard } from '../../../components/dashboard/SummaryCard';
import { ActivityTable } from '../../../components/dashboard/ActivityTable';
import { LowStockTable } from '../../../components/dashboard/LowStockTable';
import { QuickActions } from '../../../components/dashboard/QuickActions';

import { 
  DollarSign, ShoppingCart, TrendingUp, Package, 
  Users, Briefcase, Tag 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const res = await api.get('/dashboard/summary');
      return res.data;
    },
    staleTime: 60000,
    refetchInterval: 60000
  });

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store's performance.</p>
      </div>

      {isLoading ? (
        <LoadingDashboard />
      ) : error || !dashboard ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-md border border-red-200">
          Failed to load dashboard data. Please try again later.
        </div>
      ) : dashboard.kpis.totalProducts === 0 && dashboard.kpis.totalCustomers === 0 && dashboard.kpis.todayOrders === 0 ? (
        <EmptyDashboard />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Today's Sales" value={`$${dashboard.kpis.todaySales.toFixed(2)}`} icon={DollarSign} trend={`${dashboard.kpis.todayOrders} orders today`} trendDirection="neutral" />
            <MetricCard title="Monthly Sales" value={`$${dashboard.kpis.monthlySales.toFixed(2)}`} icon={TrendingUp} />
            <MetricCard title="Total Revenue" value={`$${dashboard.kpis.totalRevenue.toFixed(2)}`} icon={Briefcase} />
            <MetricCard title="Net Profit" value={`$${dashboard.kpis.netProfit.toFixed(2)}`} icon={DollarSign} trendDirection={dashboard.kpis.netProfit >= 0 ? 'up' : 'down'} />
            
            <MetricCard title="Total Customers" value={dashboard.kpis.totalCustomers} icon={Users} trend={`${dashboard.kpis.loyaltyCustomers} loyalty members`} trendDirection="neutral" />
            <MetricCard title="Total Products" value={dashboard.kpis.totalProducts} icon={Package} />
            <MetricCard title="Inventory Value" value={`$${dashboard.kpis.inventoryValue.toFixed(2)}`} icon={ShoppingCart} />
            <MetricCard title="Active Offers" value={dashboard.kpis.activeOffers} icon={Tag} />
          </div>

          <QuickActions />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-full">
              <SalesOverview salesAnalytics={dashboard.salesAnalytics} />
            </div>
            <div>
              <SummaryCard financialSummary={dashboard.financialSummary} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityTable recentActivity={dashboard.recentActivity} />
            </div>
            <div>
              <LowStockTable products={dashboard.inventorySummary.recentlyAddedProducts.filter((p: any) => Number(p.stock) <= 10)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
