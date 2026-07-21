import { useState, useEffect } from 'react';
import { platformApi } from '../../../api/platform';
import { DataTable } from '../../../components/platform/DataTable';
import { StatusBadge } from '../../../components/platform/StatusBadge';
import { SearchBar } from '../../../components/platform/SearchBar';
import { LoadingState } from '../../../components/platform/LoadingState';

export function Tenants() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const data = await platformApi.getTenants();
      setTenants(data);
    } catch (error) {
      console.error('Failed to fetch tenants', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await platformApi.updateTenantStatus(id, status);
      fetchTenants();
    } catch (error) {
      alert('Failed to update tenant status');
    }
  };

  const filteredTenants = tenants.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingState />;

  const columns = [
    { header: 'Tenant Name', accessor: 'name' },
    { header: 'Subdomain', accessor: 'subdomain' },
    { header: 'Status', accessor: 'status', render: (item: any) => <StatusBadge status={item.status} /> },
    { header: 'Created', accessor: 'createdAt', render: (item: any) => new Date(item.createdAt).toLocaleDateString() },
    {
      header: 'Actions',
      accessor: 'id',
      render: (item: any) => (
        <div className="flex space-x-2">
          {item.status !== 'SUSPENDED' && (
            <button onClick={() => handleStatusChange(item.id, 'SUSPENDED')} className="text-yellow-600 hover:text-yellow-900 text-sm font-medium">Suspend</button>
          )}
          {item.status === 'SUSPENDED' && (
            <button onClick={() => handleStatusChange(item.id, 'ACTIVE')} className="text-green-600 hover:text-green-900 text-sm font-medium">Activate</button>
          )}
          <button onClick={() => handleStatusChange(item.id, 'DELETED')} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="w-1/3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search tenants..." />
          </div>
        </div>
        <DataTable data={filteredTenants} columns={columns} keyExtractor={(item) => item.id} />
      </div>
    </div>
  );
}
