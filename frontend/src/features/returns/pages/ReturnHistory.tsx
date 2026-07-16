import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { returnApi } from '../../../api/returns';

export const ReturnHistory: React.FC = () => {
  const { data = {}, isLoading } = useQuery({ queryKey: ['returns'], queryFn: () => returnApi.getAll() });

  const columns = [
    { key: 'returnNumber', header: 'Return #' },
    { key: 'returnType', header: 'Type' },
    { key: 'createdAt', header: 'Date', render: (row: any) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'grandTotal', header: 'Amount', render: (row: any) => `$${row.grandTotal}` },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Return History</h1>
          <p className="text-muted-foreground mt-1">View all Sales and Purchase returns.</p>
        </div>
      </div>
      <DataTable
        title="Returns"
        data={data.data || []}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};
