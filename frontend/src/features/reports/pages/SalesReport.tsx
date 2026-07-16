import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../../api/reports';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { ReportTable } from '../../../components/reports/ReportTable';
import { FilterBar } from '../../../components/reports/FilterBar';
import { DateRangePicker } from '../../../components/reports/DateRangePicker';
import { ExportButtons } from '../../../components/reports/ExportButtons';
import { StatCard } from '../../../components/reports/StatCard';

export const SalesReport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['report-sales', page, activeSearch, startDate, endDate],
    queryFn: () => reportApi.getSales({ page, limit: 50, search: activeSearch, startDate, endDate })
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setPage(1);
  };

  const columns = [
    { key: 'invoiceNumber', header: 'Invoice #' },
    { key: 'createdAt', header: 'Date', render: (row: any) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'customer', header: 'Customer', render: (row: any) => row.customer?.name || 'Walk-in' },
    { key: 'subTotal', header: 'Subtotal', render: (row: any) => `$${row.subTotal}` },
    { key: 'taxAmount', header: 'Tax', render: (row: any) => `$${row.taxAmount}` },
    { key: 'discountAmount', header: 'Discount', render: (row: any) => `$${row.discountAmount}` },
    { key: 'grandTotal', header: 'Total', render: (row: any) => `$${row.grandTotal}` },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
        </div>
        <ExportButtons onExportCsv={() => alert('Exporting CSV...')} onExportExcel={() => alert('Exporting Excel...')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${data?.summary?.grandTotal || 0}`} />
        <StatCard title="Total Tax" value={`$${data?.summary?.taxAmount || 0}`} />
        <StatCard title="Total Discounts" value={`$${data?.summary?.discountAmount || 0}`} />
        <StatCard title="Invoice Count" value={data?.total || 0} />
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm border flex flex-col md:flex-row gap-4 justify-between">
        <FilterBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onSearch={handleSearch} 
          placeholder="Search Invoice or Customer..." 
        />
        <DateRangePicker 
          startDate={startDate} 
          endDate={endDate} 
          onStartDateChange={(val) => { setStartDate(val); setPage(1); }} 
          onEndDateChange={(val) => { setEndDate(val); setPage(1); }} 
        />
      </div>

      <ReportTable columns={columns} data={data?.data || []} isLoading={isLoading} />
    </div>
  );
};
