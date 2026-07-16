import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useReactToPrint } from 'react-to-print';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { invoiceApi } from '../../../api/invoices';
import { PrintPreview } from '../components/PrintPreview';

export const InvoiceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoiceApi.getOne(id!),
  });

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  if (isLoading) return <div>Loading invoice...</div>;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Invoice Details</h1>
        <div className="space-x-2">
          <button onClick={() => navigate('/app/invoices')} className="h-9 px-4 rounded-md border hover:bg-muted">Back to List</button>
          <button onClick={handlePrint} className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
            Print Receipt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Invoice Number</p>
              <p className="font-medium">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{new Date(invoice.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">{invoice.status}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <p className="font-medium">{invoice.paymentMethod}</p>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-xl font-semibold">Customer Details</h2>
          {invoice.customer ? (
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {invoice.customer.name}</p>
              <p><strong>Email:</strong> {invoice.customer.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {invoice.customer.phone || 'N/A'}</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Walk-in Customer</p>
          )}
        </div>
      </div>

      {/* Hidden Print Area */}
      <div className="hidden">
        <PrintPreview ref={componentRef} invoice={invoice} />
      </div>
    </div>
  );
};
