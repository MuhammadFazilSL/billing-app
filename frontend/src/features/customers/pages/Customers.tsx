import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { customerApi } from '../../../api/customers';

export const Customers: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data = {}, isLoading } = useQuery({ queryKey: ['customers'], queryFn: () => customerApi.getAll() });

  const deleteMut = useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  });

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'outstandingBalance', header: 'Balance', render: (row: any) => `$${row.outstandingBalance}` },
    { key: 'loyaltyPoints', header: 'Points' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-1">Manage your customers and their balances.</p>
      </div>
      <DataTable
        title="Customers List"
        data={data.data || []}
        columns={columns}
        isLoading={isLoading}
        onAdd={() => navigate('/app/customers/new')}
        onEdit={(row) => navigate(`/app/customers/${row.id}/edit`)}
        onDelete={(row) => {
          if (confirm(`Are you sure you want to delete ${row.name}?`)) {
            deleteMut.mutate(row.id);
          }
        }}
      />
    </div>
  );
};
