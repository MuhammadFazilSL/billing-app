import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { supplierApi } from '../../../api/suppliers';

export const Suppliers: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data = {}, isLoading } = useQuery({ queryKey: ['suppliers'], queryFn: () => supplierApi.getAll() });

  const deleteMut = useMutation({
    mutationFn: supplierApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  });

  const columns = [
    { key: 'companyName', header: 'Company Name' },
    { key: 'contactName', header: 'Contact Person' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'outstandingBalance', header: 'Balance', render: (row: any) => `$${row.outstandingBalance}` },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        <p className="text-muted-foreground mt-1">Manage your vendors and suppliers.</p>
      </div>
      <DataTable
        title="Suppliers List"
        data={data.data || []}
        columns={columns}
        isLoading={isLoading}
        onAdd={() => navigate('/app/suppliers/new')}
        onEdit={(row) => navigate(`/app/suppliers/${row.id}/edit`)}
        onDelete={(row) => {
          if (confirm(`Are you sure you want to delete ${row.companyName}?`)) {
            deleteMut.mutate(row.id);
          }
        }}
      />
    </div>
  );
};
