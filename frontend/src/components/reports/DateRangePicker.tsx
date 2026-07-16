import React from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col">
        <label className="text-xs text-muted-foreground mb-1">Start Date</label>
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="h-10 px-3 rounded-md border bg-background text-sm"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-muted-foreground mb-1">End Date</label>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="h-10 px-3 rounded-md border bg-background text-sm"
        />
      </div>
    </div>
  );
};
