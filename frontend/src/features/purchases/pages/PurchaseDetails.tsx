import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { purchaseApi } from '../../../api/purchases';

export const PurchaseDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: purchase, isLoading } = useQuery({
    queryKey: ['purchases', id],
    queryFn: () => purchaseApi.getOne(id!),
  });

  if (isLoading) return <div>Loading purchase...</div>;
  if (!purchase) return <div>Purchase not found</div>;

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Details</h1>
        <button onClick={() => navigate('/app/purchases')} className="h-9 px-4 rounded-md border hover:bg-muted">Back to List</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Purchase Number</p>
              <p className="font-medium">{purchase.purchaseNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{new Date(purchase.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">{purchase.status}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <p className="font-medium">{purchase.paymentMethod}</p>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-xl font-semibold">Supplier Details</h2>
          {purchase.supplier ? (
            <div className="space-y-1 text-sm">
              <p><strong>Company:</strong> {purchase.supplier.companyName}</p>
              <p><strong>Email:</strong> {purchase.supplier.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {purchase.supplier.phone || 'N/A'}</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No Supplier Info</p>
          )}
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden mt-6">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Tax</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchase.purchaseItems?.map((item: any) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3">{item.productName}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">${item.unitCost}</td>
                <td className="px-4 py-3">${item.taxAmount}</td>
                <td className="px-4 py-3 font-medium">${item.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${purchase.subTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>${purchase.taxAmount}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Grand Total</span>
              <span>${purchase.grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
