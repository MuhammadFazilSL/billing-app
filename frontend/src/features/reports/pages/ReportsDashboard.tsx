import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { reportApi } from '../../../api/reports';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { StatCard } from '../../../components/reports/StatCard';
import { ChartCard } from '../../../components/reports/ChartCard';
import { DollarSign, Package, Users, Truck, AlertCircle, Percent } from 'lucide-react';

export const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data = {}, isLoading } = useQuery({ queryKey: ['reports-dashboard'], queryFn: () => reportApi.getDashboard() });

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Overview of your business performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cursor-pointer" onClick={() => navigate('/app/reports/sales')}>
          <StatCard title="Today's Sales" value={`$${data.todaySales || 0}`} icon={<DollarSign className="w-5 h-5" />} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/app/reports/profit-loss')}>
          <StatCard title="Monthly Profit" value={`$${data.profit || 0}`} icon={<DollarSign className="w-5 h-5" />} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/app/reports/inventory')}>
          <StatCard title="Inventory Value" value={`$${data.inventoryValue || 0}`} icon={<Package className="w-5 h-5" />} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/app/reports/inventory')}>
          <StatCard title="Low Stock Items" value={data.lowStockCount || 0} icon={<AlertCircle className="w-5 h-5" />} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/app/reports/customers')}>
          <StatCard title="Total Customers" value={data.totalCustomers || 0} icon={<Users className="w-5 h-5" />} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/app/reports/suppliers')}>
          <StatCard title="Total Suppliers" value={data.totalSuppliers || 0} icon={<Truck className="w-5 h-5" />} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/app/reports/taxes')}>
          <StatCard title="Tax Collected (Today)" value={`$${data.taxCollectedToday || 0}`} icon={<Percent className="w-5 h-5" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales Trend">
          {/* Placeholder for chart */}
          <div className="flex items-end h-full w-full gap-2 px-4 pb-4 border-b border-l">
            {[40, 70, 30, 80, 50, 90, 60].map((h, i) => (
              <div key={i} className="bg-primary/80 hover:bg-primary transition-colors flex-1 rounded-t" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Revenue vs Expenses">
          <div className="flex items-end h-full w-full gap-4 px-4 pb-4 border-b border-l">
            <div className="bg-green-500 w-1/2 rounded-t" style={{ height: '80%' }}></div>
            <div className="bg-red-500 w-1/2 rounded-t" style={{ height: '40%' }}></div>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <button onClick={() => navigate('/app/reports/sales')} className="p-4 text-sm font-medium border rounded hover:bg-muted">Sales Report</button>
        <button onClick={() => navigate('/app/reports/purchases')} className="p-4 text-sm font-medium border rounded hover:bg-muted">Purchases Report</button>
        <button onClick={() => navigate('/app/reports/inventory')} className="p-4 text-sm font-medium border rounded hover:bg-muted">Inventory Report</button>
        <button onClick={() => navigate('/app/reports/profit-loss')} className="p-4 text-sm font-medium border rounded hover:bg-muted">Profit & Loss</button>
      </div>
    </div>
  );
};
