import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend, trendDirection }) => {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="p-2 bg-primary/10 text-primary rounded-md">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className={`text-xs mt-2 font-medium ${
          trendDirection === 'up' ? 'text-green-600' : 
          trendDirection === 'down' ? 'text-red-600' : 'text-gray-500'
        }`}>
          {trend}
        </p>
      )}
    </div>
  );
};
