import React from 'react';
import { Subscription } from '../../api/subscriptions';

interface UsageCardProps {
  subscription: Subscription;
  usage: any; // Assuming usage comes from the existing usage endpoint
}

export const UsageCard: React.FC<UsageCardProps> = ({ subscription, usage }) => {
  const { plan } = subscription;

  const renderUsageBar = (label: string, used: number, max: number) => {
    // If max is -1 or 0, we can treat it as unlimited for display purposes, 
    // but usually in this system it's a positive number.
    const isUnlimited = max === -1 || max === 0;
    const percentage = isUnlimited ? 0 : Math.min((used / max) * 100, 100);
    const displayMax = isUnlimited ? '∞' : max;
    
    // Color logic: warning if > 85%, danger if > 95%
    let barColor = 'bg-primary-500';
    if (!isUnlimited) {
      if (percentage > 95) barColor = 'bg-red-500';
      else if (percentage > 85) barColor = 'bg-amber-500';
    }

    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-700 font-medium">{label}</span>
          <span className="text-gray-500">
            {used} / {displayMax}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${barColor}`}
            style={{ width: `${isUnlimited ? 100 : percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-5">Current Usage</h3>
      
      {renderUsageBar('Products', usage.productsUsed, plan.maxProducts)}
      {renderUsageBar('Customers', usage.customersUsed, plan.maxCustomers)}
      {renderUsageBar('Employees', usage.employeesUsed || 0, plan.maxEmployees)}
      {renderUsageBar('Branches', usage.branchesUsed || 0, plan.maxBranches)}
      {renderUsageBar('Monthly Invoices', usage.invoicesGenerated || 0, plan.maxMonthlyInvoices)}
    </div>
  );
};
