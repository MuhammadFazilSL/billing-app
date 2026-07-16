import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../../api/masterData';
import { DataTable } from '../../../components/common/DataTable';

export const StockList: React.FC = () => {
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const columns = [
    { key: 'name', header: 'Product Name' },
    { key: 'sku', header: 'SKU' },
    { key: 'category', header: 'Category', render: (row: any) => row.category?.name || '-' },
    { key: 'stock', header: 'Current Stock', render: (row: any) => `${row.stock} ${row.unit?.shortName || ''}` },
    { key: 'minimumStock', header: 'Min Level' },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        title="Current Stock List"
        data={products}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};
