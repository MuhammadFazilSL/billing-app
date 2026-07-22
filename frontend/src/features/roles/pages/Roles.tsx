import React, { useState } from 'react';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { RoleList } from './RoleList';
import { PermissionMatrix } from './PermissionMatrix';

export const Roles: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'matrix'>('list');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const handleEditRole = (id: string) => {
    setSelectedRoleId(id);
    setActiveTab('matrix');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground mt-1">Manage system roles and configure fine-grained permissions.</p>
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => { setActiveTab('list'); setSelectedRoleId(null); }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Roles List
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'matrix'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Permission Matrix
          </button>
        </nav>
      </div>

      <div className="pt-4">
        {activeTab === 'list' ? (
          <RoleList onEditRole={handleEditRole} />
        ) : (
          <PermissionMatrix selectedRoleId={selectedRoleId} />
        )}
      </div>
    </div>
  );
};
