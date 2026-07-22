import React from 'react';

interface InvoiceHeaderProps {
  invoice: any;
  companyProfile: any;
  branch: any | null;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoice, companyProfile, branch }) => {
  const profileName = companyProfile?.legalName || companyProfile?.companyName || 'SaaS Billing';
  const logo = companyProfile?.logo;
  const address = branch?.address || companyProfile?.address;
  const phone = branch?.phone || companyProfile?.phone;
  const gst = companyProfile?.gstNumber;

  const dateStr = new Date(invoice.createdAt).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
      <div className="flex gap-4">
        {logo && (
          <img src={logo} alt="Company Logo" className="h-16 w-16 object-contain" />
        )}
        <div>
          <h2 className="text-xl font-bold text-black uppercase tracking-tight">{profileName}</h2>
          {address && <p className="text-sm text-gray-700 whitespace-pre-line">{address}</p>}
          {phone && <p className="text-sm text-gray-700">Ph: {phone}</p>}
          {gst && <p className="text-sm font-semibold text-gray-800 mt-1">GSTIN: {gst}</p>}
        </div>
      </div>
      
      <div className="text-right">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-black">Tax Invoice</h1>
        <div className="mt-2 text-sm text-gray-700 space-y-0.5">
          <p><span className="font-medium">Invoice No:</span> {invoice.invoiceNumber}</p>
          <p><span className="font-medium">Date:</span> {dateStr}</p>
          {invoice.customer ? (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="font-semibold text-black uppercase">Billed To:</p>
              <p>{invoice.customer.name}</p>
              {invoice.customer.phone && <p>Ph: {invoice.customer.phone}</p>}
              {invoice.customer.address && <p className="text-xs">{invoice.customer.address}</p>}
            </div>
          ) : (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="font-semibold text-black uppercase">Billed To:</p>
              <p>Walk-in Customer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
