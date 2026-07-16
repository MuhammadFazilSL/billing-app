import React from 'react';

interface ReportTableProps {
  columns: { key: string; header: string; render?: (row: any) => React.ReactNode }[];
  data: any[];
  isLoading?: boolean;
}

export const ReportTable: React.FC<ReportTableProps> = ({ columns, data, isLoading }) => {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading report data...</div>;
  }

  if (data.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No data found for this report.</div>;
  }

  return (
    <div className="w-full overflow-x-auto bg-card rounded-lg shadow-sm border">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground border-b">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className="border-b last:border-0 hover:bg-muted/50">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
