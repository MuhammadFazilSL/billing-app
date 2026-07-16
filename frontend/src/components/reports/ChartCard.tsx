import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <div className="w-full h-64 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
