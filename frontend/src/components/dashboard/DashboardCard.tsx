import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '', action }) => {
  return (
    <div className={`bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden flex flex-col ${className}`}>
      <div className="px-4 py-4 border-b flex justify-between items-center bg-muted/30">
        <h3 className="font-semibold text-lg">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  );
};
