import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInventoryLedger } from '../../../api/inventory';
import { DataTable } from '../../../components/common/DataTable';

export const TransactionHistory: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['inventory', 'ledger'], queryFn: () => getInventoryLedger(1, 100) });

  const columns = [
    { key: 'createdAt', header: 'Date', render: (row: any) => new Date(row.createdAt).toLocaleString() },
    { key: 'product', header: 'Product', render: (row: any) => row.product?.name },
    { key: 'type', header: 'Transaction Type', render: (row: any) => <span className="font-medium text-xs bg-muted px-2 py-1 rounded">{row.type}</span> },
    { key: 'direction', header: 'In / Out', render: (row: any) => (
        <span className={row.direction === 'IN' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
          {row.direction}
        </span>
      )
    },
    { key: 'quantity', header: 'Quantity' },
    { key: 'balanceAfterTransaction', header: 'Balance' },
    { key: 'remarks', header: 'Remarks' },
    { key: 'user', header: 'User', render: (row: any) => row.user?.firstName || 'System' },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        title="Inventory Ledger"
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search ledger..."
      />
    </div>
  );
};
