import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInventorySummary, getLowStock } from '../../../api/inventory';
import { Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { DataTable } from '../../../components/common/DataTable';

export const InventoryDashboard: React.FC = () => {
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['inventory', 'summary'],
    queryFn: getInventorySummary,
  });

  const { data: lowStock = [], isLoading: isLowStockLoading } = useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: getLowStock,
  });

  const lowStockColumns = [
    { key: 'name', header: 'Product' },
    { key: 'sku', header: 'SKU' },
    { key: 'stock', header: 'Current Stock', render: (row: any) => <span className="text-red-500 font-bold">{row.stock}</span> },
    { key: 'minimumStock', header: 'Min Level' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total SKUs</p>
              <h3 className="text-2xl font-bold">{isSummaryLoading ? '-' : summary?.totalSKUs}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <TrendingDown className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Items in Stock</p>
              <h3 className="text-2xl font-bold">{isSummaryLoading ? '-' : summary?.totalItems}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
              <h3 className="text-2xl font-bold">{isSummaryLoading ? '-' : `$${summary?.totalValue?.toFixed(2)}`}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <DataTable
          title="Low Stock Alerts"
          data={lowStock}
          columns={lowStockColumns}
          isLoading={isLowStockLoading}
          searchPlaceholder="Search low stock items..."
        />
      </div>
    </div>
  );
};
