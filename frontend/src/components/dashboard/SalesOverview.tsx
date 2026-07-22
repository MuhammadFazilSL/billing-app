import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';

interface DataPoint {
  date: string;
  amount: number;
}

interface SalesOverviewProps {
  salesAnalytics: {
    daily: DataPoint[];
    weekly: DataPoint[];
    monthly: DataPoint[];
  };
}

export const SalesOverview: React.FC<SalesOverviewProps> = ({ salesAnalytics }) => {
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const data = salesAnalytics[view];
  
  // Find max value to calculate bar heights
  const maxAmount = Math.max(...data.map(d => d.amount), 100); // minimum 100 to avoid 0 division

  return (
    <DashboardCard 
      title="Sales Overview" 
      action={
        <select 
          value={view} 
          onChange={(e) => setView(e.target.value as any)}
          className="text-sm border rounded p-1 bg-background"
        >
          <option value="daily">Last 7 Days</option>
          <option value="weekly">Last 4 Weeks</option>
          <option value="monthly">Last 6 Months</option>
        </select>
      }
    >
      <div className="h-64 flex items-end gap-2 pt-8 relative w-full">
        {/* Y Axis Guides */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          <div className="border-b border-dashed border-border w-full flex-1"></div>
          <div className="border-b border-dashed border-border w-full flex-1"></div>
          <div className="border-b border-dashed border-border w-full flex-1"></div>
          <div className="border-b border-border w-full h-0"></div>
        </div>

        {/* Bars */}
        <div className="relative z-10 flex w-full h-full items-end justify-between pb-6 gap-2">
          {data.map((item, index) => {
            const heightPercent = (item.amount / maxAmount) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div 
                  className="w-full bg-primary/80 hover:bg-primary rounded-t-sm transition-all relative"
                  style={{ height: `${heightPercent}%`, minHeight: heightPercent > 0 ? '4px' : '0' }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity">
                    ${item.amount.toFixed(2)}
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground truncate w-full text-center">
                  {item.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
};
