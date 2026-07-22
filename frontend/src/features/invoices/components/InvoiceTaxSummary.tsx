import React from 'react';

interface InvoiceTaxSummaryProps {
  items: any[];
}

export const InvoiceTaxSummary: React.FC<InvoiceTaxSummaryProps> = ({ items }) => {
  // Group taxes by tax rate
  const taxGroups = items.reduce((acc, item) => {
    const rate = Number(item.taxRate) || 0;
    if (rate === 0) return acc;
    
    if (!acc[rate]) {
      acc[rate] = { taxableAmount: 0, cgst: 0, sgst: 0, igst: 0 };
    }
    
    const taxable = Number(item.totalAmount) - Number(item.taxAmount);
    acc[rate].taxableAmount += taxable;
    
    // Split tax into CGST and SGST (Assuming Intra-state for now)
    const halfTax = Number(item.taxAmount) / 2;
    acc[rate].cgst += halfTax;
    acc[rate].sgst += halfTax;
    
    return acc;
  }, {} as Record<number, { taxableAmount: number, cgst: number, sgst: number, igst: number }>);

  const rates = Object.keys(taxGroups).map(Number).sort((a, b) => a - b);

  if (rates.length === 0) return null;

  return (
    <div className="text-sm">
      <h3 className="font-semibold mb-1 text-black">Tax Summary</h3>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-1 px-2 text-left font-semibold border-r border-gray-200">Rate</th>
            <th className="py-1 px-2 text-right font-semibold border-r border-gray-200">Taxable</th>
            <th className="py-1 px-2 text-right font-semibold border-r border-gray-200">CGST</th>
            <th className="py-1 px-2 text-right font-semibold">SGST</th>
          </tr>
        </thead>
        <tbody>
          {rates.map(rate => (
            <tr key={rate} className="border-b border-gray-200 last:border-0">
              <td className="py-1 px-2 border-r border-gray-200">{rate}%</td>
              <td className="py-1 px-2 text-right border-r border-gray-200">₹{taxGroups[rate].taxableAmount.toFixed(2)}</td>
              <td className="py-1 px-2 text-right border-r border-gray-200">₹{taxGroups[rate].cgst.toFixed(2)}</td>
              <td className="py-1 px-2 text-right">₹{taxGroups[rate].sgst.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
