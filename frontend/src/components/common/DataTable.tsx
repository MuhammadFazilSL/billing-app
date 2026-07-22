import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2 } from 'lucide-react';

interface Column {
  key: string;
  header: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  isLoading: boolean;
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  searchPlaceholder?: string;
  extraActions?: React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  data,
  columns,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
  extraActions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data?.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm w-full overflow-hidden">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </button>
          )}
          {extraActions && extraActions}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : filteredData?.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredData?.map((row, idx) => (
                <tr key={row.id || idx} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 align-middle">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <button onClick={() => onEdit(row)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(row)} className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-background hover:bg-destructive hover:text-destructive-foreground text-muted-foreground">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t text-xs text-muted-foreground text-right">
        Showing {filteredData?.length || 0} records
      </div>
    </div>
  );
};
