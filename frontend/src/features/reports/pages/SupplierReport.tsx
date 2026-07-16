import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../../api/reports';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { ReportTable } from '../../../components/reports/ReportTable';
import { FilterBar } from '../../../components/reports/FilterBar';
import { ExportButtons } from '../../../components/reports/ExportButtons';
import { StatCard } from '../../../components/reports/StatCard';

export const SupplierReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['report-suppliers', page, activeSearch],
    queryFn: () => reportApi.getSuppliers({ page, limit: 50, search: activeSearch })
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setPage(1);
  };

  const columns = [
    { key: 'companyName', header: 'Company Name' },
    { key: 'contactPerson', header: 'Contact Person' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'purchasesCount', header: 'Total POs', render: (row: any) => row._count?.purchases || 0 },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supplier Report</h1>
        </div>
        <ExportButtons onExportCsv={() => alert('Exporting CSV...')} onExportExcel={() => alert('Exporting Excel...')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Suppliers" value={data?.total || 0} />
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm border">
        <FilterBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onSearch={handleSearch} 
          placeholder="Search Supplier..." 
        />
      </div>

      <ReportTable columns={columns} data={data?.data || []} isLoading={isLoading} />
    </div>
  );
};
