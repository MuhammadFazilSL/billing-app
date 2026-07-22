import { forwardRef } from 'react';
import { InvoiceHeader } from './InvoiceHeader';
import { InvoiceItemsTable } from './InvoiceItemsTable';
import { InvoiceTaxSummary } from './InvoiceTaxSummary';
import { InvoiceSummary } from './InvoiceSummary';
import { InvoiceFooter } from './InvoiceFooter';
import { InvoiceQRCode } from './InvoiceQRCode';
import { numberToWords } from '../../../utils/numberToWords';

interface GSTInvoiceA4Props {
  invoice: any;
}

export const GSTInvoiceA4 = forwardRef<HTMLDivElement, GSTInvoiceA4Props>(({ invoice }, ref) => {
  const companyProfile = invoice.tenant?.companyProfile || {};
  const branch = invoice.tenant?.branches?.[0] || null;

  return (
    <div 
      ref={ref} 
      className="bg-white text-black p-8 mx-auto shadow-sm print:shadow-none print:m-0 print:p-4" 
      style={{ 
        width: '210mm', 
        minHeight: '297mm',
        boxSizing: 'border-box'
      }}
    >
      <InvoiceHeader invoice={invoice} companyProfile={companyProfile} branch={branch} />
      
      <InvoiceItemsTable items={invoice.invoiceItems || []} />
      
      <div className="flex justify-between items-start mt-6">
        <div className="w-1/2">
          <InvoiceTaxSummary items={invoice.invoiceItems || []} />
          
          <div className="mt-8 border border-gray-200 p-2 bg-gray-50 text-xs italic">
            <span className="font-semibold not-italic text-black">Amount in Words: </span>
            {numberToWords(Number(invoice.grandTotal))}
          </div>
        </div>
        
        <div className="w-1/3 flex flex-col items-end gap-6">
          <InvoiceSummary invoice={invoice} />
          <InvoiceQRCode 
            invoiceNumber={invoice.invoiceNumber}
            date={invoice.createdAt}
            companyName={companyProfile.legalName || companyProfile.companyName || 'Store'}
            customerName={invoice.customer?.name}
            grandTotal={Number(invoice.grandTotal)}
          />
        </div>
      </div>
      
      <InvoiceFooter user={invoice.user} companyProfile={companyProfile} />
    </div>
  );
});

GSTInvoiceA4.displayName = 'GSTInvoiceA4';
