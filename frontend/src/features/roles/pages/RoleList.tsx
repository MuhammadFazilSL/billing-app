import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../../../components/common/DataTable';
import { roleApi } from '../../../api/roles';
import { PermissionGate } from '../../../components/auth/PermissionGate';
import { PERMISSIONS } from '../../../constants/permissions';

export const RoleList: React.FC<{ onEditRole: (id: string) => void }> = ({ onEditRole }) => {
  const queryClient = useQueryClient();
  const { data: roles = [], isLoading } = useQuery({ queryKey: ['roles'], queryFn: () => roleApi.getAll() });
  
  const [isCloning, setIsCloning] = useState(false);
  const [cloneSourceId, setCloneSourceId] = useState<string | null>(null);
  const [cloneName, setCloneName] = useState('');

  const cloneMut = useMutation({
    mutationFn: (data: { id: string, name: string }) => roleApi.clone(data.id, data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsCloning(false);
      setCloneName('');
      setCloneSourceId(null);
      alert('Role cloned successfully');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to clone role');
    }
  });

  const handleClone = (e: React.FormEvent) => {
    e.preventDefault();
    if (cloneSourceId && cloneName) {
      cloneMut.mutate({ id: cloneSourceId, name: cloneName });
    }
  };

  const columns = [
    { key: 'name', header: 'Role Name' },
    { key: 'description', header: 'Description' },
    { key: 'isSystemRole', header: 'System Role', render: (row: any) => row.isSystemRole ? 'Yes' : 'No' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: any) => (
        <div className="flex gap-2">
          <PermissionGate permission={PERMISSIONS.ROLES_EDIT}>
            <button
              onClick={() => onEditRole(row.id)}
              className="text-primary hover:underline text-sm"
            >
              Edit Permissions
            </button>
          </PermissionGate>
          <PermissionGate permission={PERMISSIONS.ROLES_CREATE}>
            <button
              onClick={() => { setCloneSourceId(row.id); setIsCloning(true); }}
              className="text-secondary-foreground hover:underline text-sm ml-2"
            >
              Clone
            </button>
          </PermissionGate>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Roles List"
        data={roles}
        columns={columns}
        isLoading={isLoading}
      />

      {isCloning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Clone Role</h3>
            <form onSubmit={handleClone}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">New Role Name</label>
                <input
                  type="text"
                  value={cloneName}
                  onChange={e => setCloneName(e.target.value)}
                  className="w-full h-9 rounded-md border bg-background px-3"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCloning(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cloneMut.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                >
                  {cloneMut.isPending ? 'Cloning...' : 'Clone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
