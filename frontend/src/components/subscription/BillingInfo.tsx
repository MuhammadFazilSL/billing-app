import React from 'react';
import { Subscription } from '../../api/subscriptions';

interface BillingInfoProps {
  subscription: Subscription;
}

export const BillingInfo: React.FC<BillingInfoProps> = ({ subscription }) => {
  const { plan, billingCycle, nextRenewalAt } = subscription;

  const currentPrice = billingCycle === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-5">Billing Information</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm">Plan Price</span>
          <span className="font-semibold text-gray-900">${Number(currentPrice).toFixed(2)} / {billingCycle.toLowerCase()}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm">Next Renewal</span>
          <span className="font-medium text-gray-900">{new Date(nextRenewalAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-500 text-sm">Auto Renewal</span>
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700">Enabled</span>
        </div>
        
        <div className="flex justify-between items-center py-3">
          <span className="text-gray-500 text-sm">Payment Status</span>
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700">Up to date</span>
        </div>
      </div>
    </div>
  );
};
