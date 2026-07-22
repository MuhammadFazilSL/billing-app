import React from 'react';

export const LoadingSubscription: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-64 lg:col-span-2"></div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-64"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-72 lg:col-span-2"></div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-72"></div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-48"></div>
    </div>
  );
};
