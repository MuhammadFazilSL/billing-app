import React from 'react';
import { Breadcrumb } from '../../../layouts/Breadcrumb';

export const Billing: React.FC = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & POS</h1>
        <p className="text-muted-foreground">Point of sale and invoice creation.</p>
      </div>
      <div className="p-12 border border-dashed border-border rounded-lg text-center text-muted-foreground">
        Billing module will be implemented in a future sprint.
      </div>
    </div>
  );
};
