import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { getBrands, createBrand, deleteBrand } from '../../../api/masterData';

export const Brands: React.FC = () => {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['brands'], queryFn: getBrands });

  const mutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brands'] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brands'] }),
  });

  const columns = [
    { key: 'name', header: 'Brand Name' },
    { key: 'createdAt', header: 'Created Date', render: (row: any) => new Date(row.createdAt).toLocaleDateString() },
  ];

  const handleAdd = () => {
    const name = prompt('Enter new brand name:');
    if (name) mutation.mutate({ name });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
        <p className="text-muted-foreground mt-1">Manage product brands.</p>
      </div>
      <DataTable
        title="Brands List"
        data={data}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onDelete={(row) => {
          if (confirm('Are you sure you want to delete this brand?')) {
            deleteMut.mutate(row.id);
          }
        }}
      />
    </div>
  );
};
