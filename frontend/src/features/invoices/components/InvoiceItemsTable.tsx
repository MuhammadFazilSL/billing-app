import React from 'react';

interface InvoiceItemsTableProps {
  items: any[];
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ items }) => {
  return (
    <table className="w-full text-sm mb-4">
      <thead>
        <tr className="border-y-2 border-black">
          <th className="py-2 text-left font-semibold">#</th>
          <th className="py-2 text-left font-semibold">Item</th>
          <th className="py-2 text-left font-semibold">HSN</th>
          <th className="py-2 text-right font-semibold">Qty</th>
          <th className="py-2 text-right font-semibold">Rate</th>
          <th className="py-2 text-right font-semibold">Disc%</th>
          <th className="py-2 text-right font-semibold">Tax%</th>
          <th className="py-2 text-right font-semibold">Amount</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          // Calculate percentage discount for display
          const grossAmount = item.quantity * item.unitPrice;
          const discPct = grossAmount > 0 ? ((item.discountAmount / grossAmount) * 100).toFixed(0) : '0';
          
          return (
            <tr key={item.id || index} className="border-b border-gray-200 last:border-b-2 last:border-black">
              <td className="py-2">{index + 1}</td>
              <td className="py-2">{item.productName}</td>
              <td className="py-2 text-gray-500">0001</td> {/* Placeholder HSN, as it might not be in DB yet */}
              <td className="py-2 text-right">{Number(item.quantity).toString()}</td>
              <td className="py-2 text-right">₹{Number(item.unitPrice).toFixed(2)}</td>
              <td className="py-2 text-right">{discPct}%</td>
              <td className="py-2 text-right">{Number(item.taxRate).toFixed(0)}%</td>
              <td className="py-2 text-right font-medium">₹{Number(item.totalAmount).toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
