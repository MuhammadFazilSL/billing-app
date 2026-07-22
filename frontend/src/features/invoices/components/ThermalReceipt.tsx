import React, { forwardRef } from 'react';
import { InvoiceQRCode } from './InvoiceQRCode';

interface ThermalReceiptProps {
  invoice: any;
}

export const ThermalReceipt = forwardRef<HTMLDivElement, ThermalReceiptProps>(({ invoice }, ref) => {
  const companyProfile = invoice.tenant?.companyProfile || {};
  const branch = invoice.tenant?.branches?.[0] || null;

  const profileName = companyProfile.legalName || companyProfile.companyName || 'SaaS Billing';
  const address = branch?.address || companyProfile.address;
  const phone = branch?.phone || companyProfile.phone;
  const gst = companyProfile.gstNumber;

  const dateStr = new Date(invoice.createdAt).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div 
      ref={ref} 
      className="bg-white text-black p-4 mx-auto print:m-0 print:p-2"
      style={{
        width: '80mm',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: '1.2'
      }}
    >
      <div className="text-center mb-4">
        {companyProfile.logo && (
          <img src={companyProfile.logo} alt="Logo" className="h-10 w-auto mx-auto mb-2 grayscale" />
        )}
        <h2 className="font-bold text-lg uppercase">{profileName}</h2>
        {address && <p>{address}</p>}
        {phone && <p>Ph: {phone}</p>}
        {gst && <p>GSTIN: {gst}</p>}
      </div>

      <div className="border-t border-b border-dashed border-black py-2 mb-2">
        <p>Inv No: {invoice.invoiceNumber}</p>
        <p>Date: {dateStr}</p>
        <p>Customer: {invoice.customer?.name || 'Walk-in'}</p>
      </div>

      <table className="w-full mb-2 text-left">
        <thead>
          <tr className="border-b border-dashed border-black">
            <th className="py-1">Item</th>
            <th className="py-1 text-right">Qty</th>
            <th className="py-1 text-right">Amt</th>
          </tr>
        </thead>
        <tbody>
          {(invoice.invoiceItems || []).map((item: any) => (
            <tr key={item.id}>
              <td className="py-1 align-top pr-1">{item.productName}</td>
              <td className="py-1 align-top text-right pr-1">{Number(item.quantity)}</td>
              <td className="py-1 align-top text-right">{Number(item.totalAmount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-black pt-2 mb-4 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{Number(invoice.subTotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>{Number(invoice.taxAmount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm">
          <span>Total:</span>
          <span>{Number(invoice.grandTotal).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <InvoiceQRCode 
          invoiceNumber={invoice.invoiceNumber}
          date={invoice.createdAt}
          companyName={profileName}
          customerName={invoice.customer?.name}
          grandTotal={Number(invoice.grandTotal)}
        />
      </div>

      <div className="text-center text-xs">
        <p>Thank you for shopping!</p>
        <p>Please visit again.</p>
      </div>
    </div>
  );
});

ThermalReceipt.displayName = 'ThermalReceipt';
