import React from 'react';
import { DashboardCard } from './DashboardCard';

interface SummaryCardProps {
  financialSummary: {
    revenue: number;
    expenses: number;
    netProfit: number;
    gstCollected: number;
    gstPaid: number;
  };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ financialSummary }) => {
  return (
    <DashboardCard title="Financial Summary">
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-muted-foreground">Revenue</span>
          <span className="font-semibold">${financialSummary.revenue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-muted-foreground">Expenses (COGS)</span>
          <span className="font-semibold text-red-600">-${financialSummary.expenses.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-muted-foreground font-medium">Net Profit</span>
          <span className="font-bold text-lg text-green-600">${financialSummary.netProfit.toFixed(2)}</span>
        </div>
        <div className="pt-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Tax Overview</h4>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-muted-foreground">GST Collected</span>
            <span>${financialSummary.gstCollected.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">GST Paid</span>
            <span>${financialSummary.gstPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm font-medium pt-2 border-t">
            <span>Net Tax Payable</span>
            <span>${(financialSummary.gstCollected - financialSummary.gstPaid).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
