import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../../api/reports';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DateRangePicker } from '../../../components/reports/DateRangePicker';
import { ExportButtons } from '../../../components/reports/ExportButtons';
import { StatCard } from '../../../components/reports/StatCard';
import { ChartCard } from '../../../components/reports/ChartCard';

export const TaxReport: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['report-taxes', startDate, endDate],
    queryFn: () => reportApi.getTaxes({ startDate, endDate })
  });

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Report</h1>
          <p className="text-muted-foreground mt-1">Summary of taxes collected and paid.</p>
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
        <div className="p-8 text-center text-muted-foreground">Loading tax data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Tax Collected (Sales)" value={`$${data?.collected || 0}`} />
          <StatCard title="Tax Paid (Purchases)" value={`$${data?.paid || 0}`} />
          <StatCard title="Net Tax Payable" value={`$${data?.netPayable || 0}`} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Tax Comparison">
          <div className="flex items-end h-full w-full max-w-md gap-8 px-4 pb-4 border-b border-l">
             <div className="flex flex-col items-center flex-1 h-full justify-end">
               <div className="bg-blue-500 w-full rounded-t" style={{ height: `${data?.collected ? 80 : 0}%` }}></div>
               <span className="text-xs mt-2 text-muted-foreground">Collected</span>
             </div>
             <div className="flex flex-col items-center flex-1 h-full justify-end">
               <div className="bg-red-500 w-full rounded-t" style={{ height: `${data?.paid ? 40 : 0}%` }}></div>
               <span className="text-xs mt-2 text-muted-foreground">Paid</span>
             </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
