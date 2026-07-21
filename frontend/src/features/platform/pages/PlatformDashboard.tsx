import { useState, useEffect } from 'react';
import { platformApi } from '../../../api/platform';
import { Users, Box, CreditCard, DollarSign, Activity, AlertTriangle, FileText, ShoppingCart } from 'lucide-react';
import { StatsCard } from '../../../components/platform/StatsCard';
import { DataTable } from '../../../components/platform/DataTable';
import { StatusBadge } from '../../../components/platform/StatusBadge';
import { LoadingState } from '../../../components/platform/LoadingState';

export function PlatformDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await platformApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  const statCards = [
    { name: 'Total Tenants', value: stats?.totalTenants || 0, icon: <Users className="w-6 h-6" /> },
    { name: 'Active Tenants', value: stats?.activeTenants || 0, icon: <Activity className="w-6 h-6" /> },
    { name: 'Trial Tenants', value: stats?.trialTenants || 0, icon: <Activity className="w-6 h-6" /> },
    { name: 'Suspended Tenants', value: stats?.suspendedTenants || 0, icon: <AlertTriangle className="w-6 h-6" /> },
    { name: 'MRR', value: `$${stats?.monthlyRevenue?.toFixed(2) || '0.00'}`, icon: <DollarSign className="w-6 h-6" /> },
    { name: 'Active Subscriptions', value: stats?.activeSubscriptions || 0, icon: <CreditCard className="w-6 h-6" /> },
    { name: 'Active Plans', value: stats?.totalPlans || 0, icon: <Box className="w-6 h-6" /> },
    { name: 'Total Products', value: stats?.totalProducts || 0, icon: <ShoppingCart className="w-6 h-6" /> },
    { name: 'Total Invoices', value: stats?.totalInvoices || 0, icon: <FileText className="w-6 h-6" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <StatsCard key={stat.name} title={stat.name} value={stat.value} icon={stat.icon} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tenants</h2>
          <DataTable 
            data={stats?.recentTenants || []}
            keyExtractor={(item) => item.id}
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Plan', accessor: 'plan', render: (item) => item.plan?.name || 'None' },
              { header: 'Status', accessor: 'status', render: (item) => <StatusBadge status={item.status} /> },
            ]}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Subscriptions</h2>
          <DataTable 
            data={stats?.recentSubscriptions || []}
            keyExtractor={(item) => item.id}
            columns={[
              { header: 'Tenant', accessor: 'tenant', render: (item) => item.tenant?.name || 'Unknown' },
              { header: 'Plan', accessor: 'plan', render: (item) => item.plan?.name || 'None' },
              { header: 'Status', accessor: 'status', render: (item) => <StatusBadge status={item.status} /> },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
