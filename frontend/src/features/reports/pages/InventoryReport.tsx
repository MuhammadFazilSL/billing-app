import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../../api/reports';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { ReportTable } from '../../../components/reports/ReportTable';
import { FilterBar } from '../../../components/reports/FilterBar';
import { ExportButtons } from '../../../components/reports/ExportButtons';
import { StatCard } from '../../../components/reports/StatCard';

export const InventoryReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['report-inventory', page, activeSearch],
    queryFn: () => reportApi.getInventory({ page, limit: 50, search: activeSearch })
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setPage(1);
  };

  const columns = [
    { key: 'name', header: 'Product Name' },
    { key: 'sku', header: 'SKU' },
    { key: 'category', header: 'Category', render: (row: any) => row.categoryId ? 'Categorized' : 'None' },
    { key: 'stock', header: 'Current Stock', render: (row: any) => (
        <span className={Number(row.stock) <= Number(row.minimumStock) ? 'text-red-500 font-bold' : ''}>
          {row.stock}
        </span>
      )
    },
    { key: 'purchasePrice', header: 'Unit Cost', render: (row: any) => `$${row.purchasePrice}` },
    { key: 'value', header: 'Total Value', render: (row: any) => `$${(Number(row.stock) * Number(row.purchasePrice)).toFixed(2)}` },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Report</h1>
        </div>
        <ExportButtons onExportCsv={() => alert('Exporting CSV...')} onExportExcel={() => alert('Exporting Excel...')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Inventory Value" value={`$${data?.summary?.totalValue?.toFixed(2) || 0}`} />
        <StatCard title="Total Products" value={data?.total || 0} />
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm border">
        <FilterBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onSearch={handleSearch} 
          placeholder="Search Product..." 
        />
      </div>

      <ReportTable columns={columns} data={data?.data || []} isLoading={isLoading} />
    </div>
  );
};
