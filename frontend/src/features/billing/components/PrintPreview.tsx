import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PrintPreviewProps {
  invoice: any;
}

export const PrintPreview = forwardRef<HTMLDivElement, PrintPreviewProps>(({ invoice }, ref) => {
  if (!invoice) return null;

  const upiString = `upi://pay?pa=store@upi&pn=StoreName&am=${invoice.grandTotal}&cu=INR`;

  return (
    <div ref={ref} className="p-8 max-w-[80mm] mx-auto bg-white text-black text-sm">
      <div className="text-center mb-4">
        {/* Placeholder for Logo */}
        <h1 className="text-xl font-bold uppercase">SUPER MART</h1>
        <p>123 Billing Street, Retail City</p>
        <p>GSTIN: 22AAAAA0000A1Z5</p>
        <p>Ph: +91 9876543210</p>
      </div>

      <div className="border-b border-dashed border-gray-400 mb-2 pb-2">
        <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
        <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleString()}</p>
        <p><strong>Cashier:</strong> {invoice.user?.firstName} {invoice.user?.lastName}</p>
        {invoice.customer && (
          <p><strong>Customer:</strong> {invoice.customer.name}</p>
        )}
      </div>

      <table className="w-full text-left mb-2">
        <thead>
          <tr className="border-b border-gray-400">
            <th className="pb-1">Item</th>
            <th className="pb-1 text-center">Qty</th>
            <th className="pb-1 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {invoice.invoiceItems?.map((item: any) => (
            <tr key={item.id}>
              <td className="py-1 pr-2">{item.productName}</td>
              <td className="py-1 text-center">{item.quantity}</td>
              <td className="py-1 text-right">${item.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed border-gray-400 pt-2 mb-4 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${invoice.subTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>${invoice.taxAmount}</span>
        </div>
        {Number(invoice.discountAmount) > 0 && (
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-${invoice.discountAmount}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold border-t border-gray-400 pt-1 mt-1">
          <span>Total:</span>
          <span>${invoice.grandTotal}</span>
        </div>
      </div>

      <div className="text-center space-y-2 mb-4">
        <p>Payment Method: <strong>{invoice.paymentMethod}</strong></p>
        {invoice.paymentMethod === 'UPI' && (
          <div className="flex justify-center mt-2">
            <QRCodeSVG value={upiString} size={100} />
          </div>
        )}
      </div>

      <div className="text-center text-xs mt-4">
        <p>Thank you for shopping with us!</p>
        <p>Please visit again.</p>
      </div>
    </div>
  );
});

PrintPreview.displayName = 'PrintPreview';
