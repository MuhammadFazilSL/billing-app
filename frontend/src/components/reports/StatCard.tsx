import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: { value: number; label: string; positive?: boolean };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, trend }) => {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="p-3 bg-primary/10 text-primary rounded-full">{icon}</div>}
      </div>
      {trend && (
        <div className={`text-sm mt-4 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
          <span className="font-medium">{trend.positive ? '+' : '-'}{Math.abs(trend.value)}%</span>
          <span className="text-muted-foreground ml-2">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
