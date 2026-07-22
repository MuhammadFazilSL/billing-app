import React from 'react';

export const SubscriptionActions: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-5">Quick Actions</h3>
      
      <div className="grid grid-cols-1 gap-3">
        <button 
          className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          onClick={() => alert('Plan upgrades will be available in the next release!')}
        >
          Upgrade Plan
        </button>
        
        <button 
          className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Download Latest Invoice
        </button>
        
        <button 
          className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Billing History
        </button>
        
        <button 
          className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Contact Administrator
        </button>
      </div>
    </div>
  );
};
