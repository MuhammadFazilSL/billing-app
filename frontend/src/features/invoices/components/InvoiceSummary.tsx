import React from 'react';

interface InvoiceSummaryProps {
  invoice: any;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoice }) => {
  const taxableAmount = Number(invoice.grandTotal) - Number(invoice.taxAmount);
  
  return (
    <div className="w-64 ml-auto text-sm">
      <div className="flex justify-between py-1">
        <span className="text-gray-600">Subtotal</span>
        <span>₹{Number(invoice.subTotal).toFixed(2)}</span>
      </div>
      
      {Number(invoice.discountAmount) > 0 && (
        <div className="flex justify-between py-1 text-green-600">
          <span>Discount</span>
          <span>-₹{Number(invoice.discountAmount).toFixed(2)}</span>
        </div>
      )}
      
      <div className="flex justify-between py-1">
        <span className="text-gray-600">Taxable Amount</span>
        <span>₹{taxableAmount.toFixed(2)}</span>
      </div>
      
      {Number(invoice.taxAmount) > 0 && (
        <>
          <div className="flex justify-between py-1 text-gray-600">
            <span>CGST</span>
            <span>₹{(Number(invoice.taxAmount) / 2).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-gray-600">
            <span>SGST</span>
            <span>₹{(Number(invoice.taxAmount) / 2).toFixed(2)}</span>
          </div>
        </>
      )}
      
      <div className="flex justify-between py-2 border-t border-b-2 border-black mt-1">
        <span className="font-bold text-base text-black">Grand Total</span>
        <span className="font-bold text-base text-black">₹{Number(invoice.grandTotal).toFixed(2)}</span>
      </div>
    </div>
  );
};
