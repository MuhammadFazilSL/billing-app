import React from 'react';
import { Subscription } from '../../api/subscriptions';

interface FeatureGridProps {
  subscription: Subscription;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ subscription }) => {
  const features = subscription.plan.features || {};

  const featureList = [
    { key: 'billing', label: 'POS Billing' },
    { key: 'inventory', label: 'Inventory Management' },
    { key: 'reports', label: 'Advanced Reports' },
    { key: 'loyalty', label: 'Loyalty Program' },
    { key: 'offers', label: 'Offers & Coupons' },
    { key: 'gstInvoice', label: 'GST Invoicing' },
    { key: 'multiBranch', label: 'Multi-Branch Support' },
    { key: 'rbac', label: 'Role-Based Access (RBAC)' },
    { key: 'apiAccess', label: 'API Access' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-5">Enabled Features</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {featureList.map((feature) => {
          const isEnabled = !!features[feature.key];
          return (
            <div
              key={feature.key}
              className={`flex items-center p-3 rounded-lg border ${
                isEnabled
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  isEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isEnabled ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${isEnabled ? 'text-green-900' : 'text-gray-500'}`}>
                {feature.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
