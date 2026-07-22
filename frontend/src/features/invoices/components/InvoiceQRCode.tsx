import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface InvoiceQRCodeProps {
  invoiceNumber: string;
  date: string;
  companyName: string;
  customerName: string;
  grandTotal: number;
}

export const InvoiceQRCode: React.FC<InvoiceQRCodeProps> = ({
  invoiceNumber,
  date,
  companyName,
  customerName,
  grandTotal
}) => {
  // Combine information into a scannable payload
  const payload = JSON.stringify({
    InvNo: invoiceNumber,
    Date: date,
    Company: companyName,
    Customer: customerName || 'Walk-in Customer',
    Total: grandTotal,
  });

  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG 
        value={payload} 
        size={80} 
        level="M" 
        includeMargin={false} 
      />
      <span className="text-[10px] text-muted-foreground mt-1 text-center">Scan to verify</span>
    </div>
  );
};
