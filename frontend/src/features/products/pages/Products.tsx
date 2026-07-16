import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { getProducts, deleteProduct } from '../../../api/masterData';

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const columns = [
    { key: 'name', header: 'Product Name' },
    { key: 'sku', header: 'SKU' },
    { key: 'category', header: 'Category', render: (row: any) => row.category?.name || '-' },
    { key: 'brand', header: 'Brand', render: (row: any) => row.brand?.name || '-' },
    { key: 'sellingPrice', header: 'Price', render: (row: any) => `$${row.sellingPrice}` },
    { key: 'stock', header: 'Stock', render: (row: any) => `${row.stock} ${row.unit?.shortName || ''}` },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-1">Manage your product catalog.</p>
      </div>
      <DataTable
        title="Products List"
        data={data}
        columns={columns}
        isLoading={isLoading}
        onAdd={() => navigate('/app/products/new')}
        onEdit={(row) => navigate(`/app/products/${row.id}/edit`)}
        onDelete={(row) => {
          if (confirm(`Are you sure you want to delete ${row.name}?`)) {
            deleteMut.mutate(row.id);
          }
        }}
      />
    </div>
  );
};
