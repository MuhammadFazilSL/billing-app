import { useState, useEffect } from 'react';
import { plansApi } from '../../../api/plans';
import { DataTable } from '../../../components/platform/DataTable';
import { StatusBadge } from '../../../components/platform/StatusBadge';
import { LoadingState } from '../../../components/platform/LoadingState';
import { SearchBar } from '../../../components/platform/SearchBar';

export function Plans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await plansApi.getAll();
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (confirm('Are you sure you want to disable this plan?')) {
        await plansApi.delete(id);
        fetchPlans();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete plan');
    }
  };

  const filteredPlans = plans.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingState />;

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Monthly Price', accessor: 'monthlyPrice', render: (item: any) => `$${item.monthlyPrice}` },
    { header: 'Yearly Price', accessor: 'yearlyPrice', render: (item: any) => `$${item.yearlyPrice}` },
    { header: 'Status', accessor: 'isActive', render: (item: any) => <StatusBadge status={item.isActive ? 'ACTIVE' : 'INACTIVE'} /> },
    {
      header: 'Actions',
      accessor: 'id',
      render: (item: any) => (
        <div className="flex space-x-2">
          {item.isActive && (
            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Disable</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Create Plan
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="w-1/3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search plans..." />
          </div>
        </div>
        <DataTable data={filteredPlans} columns={columns} keyExtractor={(item) => item.id} />
      </div>
    </div>
  );
}
