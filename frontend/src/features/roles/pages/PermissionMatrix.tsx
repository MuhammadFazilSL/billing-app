import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { roleApi } from '../../../api/roles';
import { permissionApi } from '../../../api/permissions';
import { PermissionGate } from '../../../components/auth/PermissionGate';
import { PERMISSIONS } from '../../../constants/permissions';

export const PermissionMatrix: React.FC<{ selectedRoleId: string | null }> = ({ selectedRoleId }) => {
  const [roleId, setRoleId] = useState<string>(selectedRoleId || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: () => roleApi.getAll() });
  const { data: modules = [] } = useQuery({ queryKey: ['permissions'], queryFn: () => permissionApi.getAllGrouped() });
  
  const { data: rolePermissions, isFetching } = useQuery({
    queryKey: ['rolePermissions', roleId],
    queryFn: () => roleApi.getPermissions(roleId),
    enabled: !!roleId
  });

  useEffect(() => {
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions);
    }
  }, [rolePermissions, roleId]);

  const updateMut = useMutation({
    mutationFn: (permissions: string[]) => roleApi.updatePermissions(roleId, permissions),
    onSuccess: () => {
      alert('Permissions updated successfully');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to update permissions');
    }
  });

  const handleSave = () => {
    if (!roleId) return;
    updateMut.mutate(selectedPermissions);
  };

  const handleTogglePermission = (code: string) => {
    setSelectedPermissions(prev => 
      prev.includes(code) ? prev.filter(p => p !== code) : [...prev, code]
    );
  };

  const handleToggleModule = (modulePermissions: any[]) => {
    const allCodes = modulePermissions.map(p => p.code);
    const hasAll = allCodes.every(c => selectedPermissions.includes(c));
    
    if (hasAll) {
      setSelectedPermissions(prev => prev.filter(p => !allCodes.includes(p)));
    } else {
      setSelectedPermissions(prev => Array.from(new Set([...prev, ...allCodes])));
    }
  };

  const handleSelectAll = () => {
    const allCodes = modules.flatMap((m: any) => m.permissions.map((p: any) => p.code));
    setSelectedPermissions(allCodes);
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-sm">
          <label className="block text-sm font-medium mb-1">Select Role</label>
          <select
            value={roleId}
            onChange={e => setRoleId(e.target.value)}
            className="w-full h-9 rounded-md border bg-background px-3"
          >
            <option value="">-- Choose a role --</option>
            {roles.map((r: any) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        
        {roleId && (
          <PermissionGate permission={PERMISSIONS.ROLES_ASSIGN_PERMISSIONS} mode="disable">
            <button
              onClick={handleSave}
              disabled={updateMut.isPending || isFetching}
              className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateMut.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </PermissionGate>
        )}
      </div>

      {roleId && (
        <div className="border rounded-lg bg-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Permission Matrix</h2>
            <div className="space-x-4 text-sm">
              <button onClick={handleSelectAll} className="text-primary hover:underline">Select All</button>
              <button onClick={handleClearAll} className="text-destructive hover:underline">Clear All</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod: any) => {
              const allSelected = mod.permissions.every((p: any) => selectedPermissions.includes(p.code));
              
              return (
                <div key={mod.module} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                    <h3 className="font-medium text-lg">{mod.module}</h3>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => handleToggleModule(mod.permissions)}
                      className="w-4 h-4 rounded border-gray-300 text-primary"
                    />
                  </div>
                  <div className="space-y-3">
                    {mod.permissions.map((perm: any) => (
                      <label key={perm.code} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.code)}
                          onChange={() => handleTogglePermission(perm.code)}
                          className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary"
                        />
                        <div>
                          <p className="text-sm font-medium">{perm.name}</p>
                          <p className="text-xs text-muted-foreground">{perm.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
