import React from 'react';
import { QuickActions } from './QuickActions';

export const EmptyDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-primary/5 rounded-2xl p-8 text-center border border-primary/20">
        <h2 className="text-2xl font-bold mb-2 text-primary">Welcome to your new Business Dashboard!</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          It looks like your workspace is completely new. To see metrics, charts, and activity here, you'll need to start adding some data. Use the quick actions below to get started.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mb-8">
          <div className="bg-background p-4 rounded-xl shadow-sm border">
            <h3 className="font-semibold mb-1">1. Add Products</h3>
            <p className="text-sm text-muted-foreground">Populate your inventory to start selling. Set prices, stock levels, and taxes.</p>
          </div>
          <div className="bg-background p-4 rounded-xl shadow-sm border">
            <h3 className="font-semibold mb-1">2. Add Customers</h3>
            <p className="text-sm text-muted-foreground">Keep track of your clients, their purchases, and loyalty points.</p>
          </div>
          <div className="bg-background p-4 rounded-xl shadow-sm border border-primary/50 ring-1 ring-primary/20">
            <h3 className="font-semibold mb-1">3. Generate Invoice</h3>
            <p className="text-sm text-muted-foreground">Make your first sale! Your dashboard will immediately light up with data.</p>
          </div>
        </div>
      </div>
      
      <QuickActions />
    </div>
  );
};
