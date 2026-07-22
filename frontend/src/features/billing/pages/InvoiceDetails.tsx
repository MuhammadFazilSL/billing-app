import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { invoiceApi } from '../../../api/invoices';
import { InvoicePreview } from '../../invoices/components/InvoicePreview';

export const InvoiceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoices', id],
    queryFn: () => invoiceApi.getOne(id!),
  });

  if (isLoading) return <div className="p-8">Loading invoice preview...</div>;
  if (!invoice) return <div className="p-8">Invoice not found</div>;

  return (
    <InvoicePreview 
      invoice={invoice} 
      onClose={() => navigate('/app/invoices')} 
    />
  );
};

