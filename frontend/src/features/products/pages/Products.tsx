import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { getProducts, deleteProduct, createProduct } from '../../../api/masterData';
import { ExportDialog } from '../../../components/import-export/ExportDialog';
import { ImportDialog } from '../../../components/import-export/ImportDialog';
import { Download, Upload } from 'lucide-react';

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);

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

  const handleImport = async (importData: any[]) => {
    let failedCount = 0;
    for (const row of importData) {
      try {
        await createProduct({
          name: row.name || row.Name,
          sku: row.sku || row.SKU || '',
          barcode: row.barcode || row.Barcode || '',
          sellingPrice: Number(row.sellingPrice || row.Price || row['Selling Price']) || 0,
          purchasePrice: Number(row.purchasePrice || row['Purchase Price']) || 0,
          minimumStock: Number(row.minimumStock || row['Minimum Stock']) || 5,
        });
      } catch (err) {
        failedCount++;
      }
    }
    
    queryClient.invalidateQueries({ queryKey: ['products'] });
    if (failedCount > 0) {
      throw new Error(`Imported with ${failedCount} failures.`);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-1">Manage your product catalog.</p>
      </div>
      <DataTable
        title="Products List"
        extraActions={
          <>
            <button
              onClick={() => setIsImportOpen(true)}
              className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" /> Import
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" /> Export
            </button>
          </>
        }
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

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={data}
        moduleName="Products"
      />

      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        moduleName="Products"
        expectedColumns={['name']}
        onImport={handleImport}
      />
    </div>
  );
};
