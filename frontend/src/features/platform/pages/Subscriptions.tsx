import { useState, useEffect } from 'react';
import { subscriptionsApi } from '../../../api/subscriptions';
import { DataTable } from '../../../components/platform/DataTable';
import { StatusBadge } from '../../../components/platform/StatusBadge';
import { LoadingState } from '../../../components/platform/LoadingState';
import { SearchBar } from '../../../components/platform/SearchBar';

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const data = await subscriptionsApi.getAll();
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to fetch subscriptions', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(s => 
    s.tenant?.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.plan?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingState />;

  const columns = [
    { header: 'Tenant', accessor: 'tenant', render: (item: any) => item.tenant?.name || 'Unknown' },
    { header: 'Plan', accessor: 'plan', render: (item: any) => item.plan?.name || 'Unknown' },
    { header: 'Billing Cycle', accessor: 'billingCycle' },
    { header: 'Status', accessor: 'status', render: (item: any) => <StatusBadge status={item.status} /> },
    { header: 'Next Billing', accessor: 'currentPeriodEnd', render: (item: any) => new Date(item.currentPeriodEnd).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="w-1/3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search subscriptions..." />
          </div>
        </div>
        <DataTable data={filteredSubscriptions} columns={columns} keyExtractor={(item) => item.id} />
      </div>
    </div>
  );
}
