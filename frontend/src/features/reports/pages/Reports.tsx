import React from 'react';
import { Breadcrumb } from '../../../layouts/Breadcrumb';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>
      <div className="p-12 border border-dashed border-border rounded-lg text-center text-muted-foreground">
        Reports module will be implemented in a future sprint.
      </div>
    </div>
  );
};
