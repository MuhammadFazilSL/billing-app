import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { employeeApi } from '../../../api/employees';

export const Employees: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data = {}, isLoading } = useQuery({ queryKey: ['employees'], queryFn: () => employeeApi.getAll() });

  const deleteMut = useMutation({
    mutationFn: employeeApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });

  const columns = [
    { key: 'employeeCode', header: 'Code' },
    { key: 'name', header: 'Name', render: (row: any) => `${row.firstName} ${row.lastName}` },
    { key: 'email', header: 'Email' },
    { key: 'designation', header: 'Designation' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <p className="text-muted-foreground mt-1">Manage staff members and internal users.</p>
      </div>
      <DataTable
        title="Employees List"
        data={data.data || []}
        columns={columns}
        isLoading={isLoading}
        onAdd={() => navigate('/app/employees/new')}
        onEdit={(row) => navigate(`/app/employees/${row.id}/edit`)}
        onDelete={(row) => {
          if (confirm(`Are you sure you want to deactivate ${row.firstName}?`)) {
            deleteMut.mutate(row.id);
          }
        }}
      />
    </div>
  );
};
