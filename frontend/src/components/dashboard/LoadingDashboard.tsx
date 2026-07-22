import React from 'react';

export const LoadingDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Skeleton KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card p-4 rounded-lg border shadow-sm flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-muted rounded-md animate-pulse"></div>
            </div>
            <div className="w-32 h-8 bg-muted rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skeleton Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg border shadow-sm p-4 h-80 flex flex-col">
          <div className="w-40 h-6 bg-muted rounded animate-pulse mb-6"></div>
          <div className="flex-1 flex items-end gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1 bg-muted/50 rounded-t-sm animate-pulse" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
            ))}
          </div>
        </div>

        {/* Skeleton Summary */}
        <div className="bg-card rounded-lg border shadow-sm p-4 h-80 flex flex-col gap-6">
          <div className="w-40 h-6 bg-muted rounded animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
