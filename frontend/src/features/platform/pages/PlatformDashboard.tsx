import { useState, useEffect } from 'react';
import { platformApi } from '../../../api/platform';
import { Users, Box, CreditCard, DollarSign, Activity } from 'lucide-react';

export function PlatformDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await platformApi.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  const statCards = [
    { name: 'Total Tenants', value: stats?.totalTenants || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Tenants', value: stats?.activeTenants || 0, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Active Plans', value: stats?.totalPlans || 0, icon: Box, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'MRR', value: `$${stats?.monthlyRevenue || 0}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome to SaaS Platform Admin</h2>
        <p className="text-gray-600">
          This portal allows you to manage tenants, subscription plans, and monitor platform usage. 
          Navigate using the sidebar to explore the platform capabilities.
        </p>
      </div>
    </div>
  );
}
