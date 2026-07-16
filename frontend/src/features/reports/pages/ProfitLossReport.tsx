import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../../api/reports';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DateRangePicker } from '../../../components/reports/DateRangePicker';
import { ExportButtons } from '../../../components/reports/ExportButtons';
import { StatCard } from '../../../components/reports/StatCard';
import { ChartCard } from '../../../components/reports/ChartCard';

export const ProfitLossReport: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['report-profit-loss', startDate, endDate],
    queryFn: () => reportApi.getProfitLoss({ startDate, endDate })
  });

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profit & Loss Report</h1>
          <p className="text-muted-foreground mt-1">Income statement and profitability analysis.</p>
        </div>
        <ExportButtons onExportCsv={() => alert('Exporting CSV...')} onExportExcel={() => alert('Exporting Excel...')} />
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm border inline-block">
        <DateRangePicker 
          startDate={startDate} 
          endDate={endDate} 
          onStartDateChange={setStartDate} 
          onEndDateChange={setEndDate} 
        />
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading P&L data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Revenue (Sales)" value={`$${data?.revenue || 0}`} />
            <StatCard title="Cost of Goods Sold" value={`$${data?.cogs || 0}`} />
            <StatCard title="Net Profit" value={`$${data?.netProfit || 0}`} />
            <StatCard title="Margin %" value={`${data?.marginPercent || 0}%`} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border space-y-6">
              <h3 className="font-semibold text-lg">P&L Statement</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Revenue (Sales)</span>
                  <span className="font-medium">${data?.revenue || 0}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Less: Cost of Goods Sold</span>
                  <span className="font-medium text-red-500">-${data?.cogs || 0}</span>
                </div>
                <div className="flex justify-between border-b pb-2 pt-2 text-lg">
                  <span className="font-bold">Gross / Net Profit</span>
                  <span className={`font-bold ${Number(data?.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${data?.netProfit || 0}
                  </span>
                </div>
              </div>
            </div>

            <ChartCard title="Profitability Overview">
              <div className="flex items-end h-full w-full gap-8 px-4 pb-4 border-b border-l max-w-sm mx-auto">
                 <div className="flex flex-col items-center flex-1 h-full justify-end">
                   <div className="bg-green-500 w-full rounded-t" style={{ height: '80%' }}></div>
                   <span className="text-xs mt-2 text-muted-foreground">Revenue</span>
                 </div>
                 <div className="flex flex-col items-center flex-1 h-full justify-end">
                   <div className="bg-red-500 w-full rounded-t" style={{ height: '40%' }}></div>
                   <span className="text-xs mt-2 text-muted-foreground">COGS</span>
                 </div>
                 <div className="flex flex-col items-center flex-1 h-full justify-end">
                   <div className="bg-primary w-full rounded-t" style={{ height: '50%' }}></div>
                   <span className="text-xs mt-2 text-muted-foreground">Profit</span>
                 </div>
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};
