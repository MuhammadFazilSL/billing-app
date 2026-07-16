import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { getUnits, createUnit, deleteUnit } from '../../../api/masterData';

export const Units: React.FC = () => {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['units'], queryFn: getUnits });

  const mutation = useMutation({
    mutationFn: createUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] }),
  });

  const columns = [
    { key: 'name', header: 'Unit Name' },
    { key: 'shortName', header: 'Short Name' },
    { key: 'createdAt', header: 'Created Date', render: (row: any) => new Date(row.createdAt).toLocaleDateString() },
  ];

  const handleAdd = () => {
    const name = prompt('Enter unit name (e.g., Piece):');
    if (!name) return;
    const shortName = prompt('Enter short name (e.g., pcs):');
    if (shortName) mutation.mutate({ name, shortName });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Units</h1>
        <p className="text-muted-foreground mt-1">Manage units of measurement.</p>
      </div>
      <DataTable
        title="Units List"
        data={data}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onDelete={(row) => {
          if (confirm('Are you sure you want to delete this unit?')) {
            deleteMut.mutate(row.id);
          }
        }}
      />
    </div>
  );
};
