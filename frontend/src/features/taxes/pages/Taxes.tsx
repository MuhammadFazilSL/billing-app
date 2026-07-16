import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { getTaxes, createTax, deleteTax } from '../../../api/masterData';

export const Taxes: React.FC = () => {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['taxes'], queryFn: getTaxes });

  const mutation = useMutation({
    mutationFn: createTax,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['taxes'] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteTax,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['taxes'] }),
  });

  const columns = [
    { key: 'name', header: 'Tax Name' },
    { key: 'rate', header: 'Rate (%)', render: (row: any) => `${row.rate}%` },
    { key: 'isDefault', header: 'Default', render: (row: any) => row.isDefault ? 'Yes' : 'No' },
  ];

  const handleAdd = () => {
    const name = prompt('Enter tax name (e.g., GST 18%):');
    if (!name) return;
    const rateStr = prompt('Enter tax rate (e.g., 18):');
    if (rateStr) mutation.mutate({ name, rate: parseFloat(rateStr), isDefault: false });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Taxes</h1>
        <p className="text-muted-foreground mt-1">Manage tax configurations.</p>
      </div>
      <DataTable
        title="Taxes List"
        data={data}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onDelete={(row) => {
          if (confirm('Are you sure you want to delete this tax config?')) {
            deleteMut.mutate(row.id);
          }
        }}
      />
    </div>
  );
};
