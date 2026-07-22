import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { DataTable } from '../../../components/common/DataTable';
import { customerApi } from '../../../api/customers';
import { ExportDialog } from '../../../components/import-export/ExportDialog';
import { ImportDialog } from '../../../components/import-export/ImportDialog';
import { Download, Upload } from 'lucide-react';

export const Customers: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data = {}, isLoading } = useQuery({ queryKey: ['customers'], queryFn: () => customerApi.getAll() });
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);

  const deleteMut = useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  });

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'outstandingBalance', header: 'Balance', render: (row: any) => `$${row.outstandingBalance}` },
    { key: 'loyaltyPoints', header: 'Points' },
  ];

  const handleImport = async (importData: any[]) => {
    let failedCount = 0;
    for (const row of importData) {
      try {
        await customerApi.create({
          name: row.name || row.Name,
          email: row.email || row.Email || undefined,
          phone: row.phone || row.Phone || undefined,
          address: row.address || row.Address || undefined,
        });
      } catch (err) {
        failedCount++;
      }
    }
    
    queryClient.invalidateQueries({ queryKey: ['customers'] });
    if (failedCount > 0) {
      throw new Error(`Imported with ${failedCount} failures.`);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-1">Manage your customers and their balances.</p>
      </div>
      <DataTable
        title="Customers List"
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
        data={data.data || []}
        columns={columns}
        isLoading={isLoading}
        onAdd={() => navigate('/app/customers/new')}
        onEdit={(row) => navigate(`/app/customers/${row.id}/edit`)}
        onDelete={(row) => {
          if (confirm(`Are you sure you want to delete ${row.name}?`)) {
            deleteMut.mutate(row.id);
          }
        }}
      />

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={data.data || []}
        moduleName="Customers"
      />

      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        moduleName="Customers"
        expectedColumns={['name']}
        onImport={handleImport}
      />
    </div>
  );
};
