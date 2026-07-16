import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { roleApi } from '../../../api/roles';
import { employeeApi } from '../../../api/employees';

export const Roles: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const { data: roles = [], isLoading } = useQuery({ queryKey: ['roles'], queryFn: () => roleApi.getAll() });
  const { data: employeesData = {} } = useQuery({ queryKey: ['employees', 'all'], queryFn: () => employeeApi.getAll(1, 100) });
  const employees = employeesData.data || [];

  const assignMut = useMutation({
    mutationFn: () => roleApi.assign(selectedUser, selectedRole),
    onSuccess: () => {
      alert('Role assigned successfully');
      setSelectedUser('');
      setSelectedRole('');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to assign role');
    }
  });

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedRole) return;
    assignMut.mutate();
  };

  const columns = [
    { key: 'name', header: 'Role Name' },
    { key: 'description', header: 'Description' },
    { key: 'isSystemRole', header: 'System Role', render: (row: any) => row.isSystemRole ? 'Yes' : 'No' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground mt-1">Manage system roles and assign them to employees.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border rounded-lg bg-card text-card-foreground">
          <DataTable
            title="Roles List"
            data={roles}
            columns={columns}
            isLoading={isLoading}
            // onAdd={() => alert('Custom role creation coming soon!')}
          />
        </div>

        <div className="border rounded-lg bg-card text-card-foreground p-4">
          <h2 className="font-semibold text-lg mb-4">Assign Role</h2>
          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select 
                value={selectedUser} 
                onChange={e => setSelectedUser(e.target.value)}
                className="w-full h-9 rounded-md border bg-background px-3"
                required
              >
                <option value="">Select an employee...</option>
                {employees.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select 
                value={selectedRole} 
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full h-9 rounded-md border bg-background px-3"
                required
              >
                <option value="">Select a role...</option>
                {roles.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={assignMut.isPending}
            >
              {assignMut.isPending ? 'Assigning...' : 'Assign Role'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
