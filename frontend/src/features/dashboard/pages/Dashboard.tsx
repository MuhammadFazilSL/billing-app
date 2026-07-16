import React from 'react';
import { Breadcrumb } from '../../../layouts/Breadcrumb';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store's performance.</p>
      </div>
      <div className="p-12 border border-dashed border-border rounded-lg text-center text-muted-foreground">
        Dashboard content will be implemented in a future sprint.
      </div>
    </div>
  );
};
