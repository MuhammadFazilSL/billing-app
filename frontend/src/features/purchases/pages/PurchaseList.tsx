import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { purchaseApi } from '../../../api/purchases';

export const PurchaseList: React.FC = () => {
  const navigate = useNavigate();
  const { data = {}, isLoading } = useQuery({ queryKey: ['purchases'], queryFn: () => purchaseApi.getAll() });

  const columns = [
    { key: 'purchaseNumber', header: 'Purchase #' },
    { key: 'createdAt', header: 'Date', render: (row: any) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'supplier', header: 'Supplier', render: (row: any) => row.supplier?.companyName || 'N/A' },
    { key: 'grandTotal', header: 'Amount', render: (row: any) => `$${row.grandTotal}` },
    { key: 'paymentMethod', header: 'Payment' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
          <p className="text-muted-foreground mt-1">Manage supplier purchases and restocks.</p>
        </div>
      </div>
      <DataTable
        title="Purchase History"
        data={data.data || []}
        columns={columns}
        isLoading={isLoading}
        onAdd={() => navigate('/app/purchases/new')}
        onEdit={(row) => navigate(`/app/purchases/${row.id}`)}
      />
    </div>
  );
};
