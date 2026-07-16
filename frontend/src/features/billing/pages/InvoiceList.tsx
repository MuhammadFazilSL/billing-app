import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { invoiceApi } from '../../../api/invoices';

export const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const { data = {}, isLoading } = useQuery({ queryKey: ['invoices'], queryFn: () => invoiceApi.getAll() });

  const columns = [
    { key: 'invoiceNumber', header: 'Invoice #' },
    { key: 'createdAt', header: 'Date', render: (row: any) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'customer', header: 'Customer', render: (row: any) => row.customer?.name || 'Walk-in' },
    { key: 'grandTotal', header: 'Amount', render: (row: any) => `$${row.grandTotal}` },
    { key: 'paymentMethod', header: 'Payment' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">View and manage past sales and receipts.</p>
        </div>
      </div>
      <DataTable
        title="Invoice History"
        data={data.data || []}
        columns={columns}
        isLoading={isLoading}
        onAdd={() => navigate('/app/billing')} // Re-use the "add" button for new sale
        onEdit={(row) => navigate(`/app/invoices/${row.id}`)} // Re-use edit icon for View Details
      />
    </div>
  );
};
