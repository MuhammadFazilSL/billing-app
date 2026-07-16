import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { returnApi } from '../../../api/returns';
import { invoiceApi } from '../../../api/invoices';
import { Breadcrumb } from '../../../layouts/Breadcrumb';

export const SalesReturn: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [returnItems, setReturnItems] = useState<any[]>([]);

  // Search invoice
  const { refetch: searchInvoice } = useQuery({
    queryKey: ['invoice-search', invoiceNumber],
    queryFn: () => invoiceApi.getAll(1, 1, invoiceNumber),
    enabled: false,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await searchInvoice();
    if (data?.data?.length > 0) {
      const inv = data.data[0];
      // Fetch full details
      const fullInv = await invoiceApi.getOne(inv.id);
      setSelectedInvoice(fullInv);
      // Initialize return quantities to 0
      setReturnItems(fullInv.invoiceItems.map((item: any) => ({
        ...item,
        returnQty: 0
      })));
    } else {
      alert('Invoice not found');
    }
  };

  const handleQtyChange = (itemId: string, qty: number) => {
    setReturnItems(prev => prev.map(item => {
      if (item.id === itemId) {
        if (qty > item.quantity) return item; // Can't return more than bought
        if (qty < 0) return item;
        return { ...item, returnQty: qty };
      }
      return item;
    }));
  };

  const returnMut = useMutation({
    mutationFn: returnApi.createSalesReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Stock updated
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      navigate('/app/returns');
    }
  });

  const handleProcessReturn = () => {
    const itemsToReturn = returnItems.filter(item => item.returnQty > 0);
    if (itemsToReturn.length === 0) return alert('No items selected for return');

    let subTotal = 0;
    let taxAmount = 0;

    const items = itemsToReturn.map(item => {
      const lineTotal = item.unitPrice * item.returnQty;
      const lineTax = (lineTotal * item.taxRate) / 100;
      subTotal += lineTotal;
      taxAmount += lineTax;

      return {
        productId: item.productId,
        productName: item.productName,
        quantity: item.returnQty,
        unitPriceOrCost: item.unitPrice,
        totalAmount: lineTotal + lineTax
      };
    });

    const payload = {
      invoiceId: selectedInvoice.id,
      subTotal,
      taxAmount,
      grandTotal: subTotal + taxAmount,
      notes: 'Customer returned items',
      items
    };

    returnMut.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <h1 className="text-3xl font-bold tracking-tight">Sales Return</h1>
      
      <div className="bg-card p-4 rounded-lg shadow-sm border max-w-md">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 h-10 rounded-md border bg-background px-3" 
            placeholder="Invoice Number (e.g. INV-...)" 
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <button type="submit" className="h-10 px-4 rounded-md bg-primary text-primary-foreground">Find Invoice</button>
        </form>
      </div>

      {selectedInvoice && (
        <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="font-semibold">Invoice: {selectedInvoice.invoiceNumber}</h3>
            <p className="text-sm text-muted-foreground">Customer: {selectedInvoice.customer?.name || 'Walk-in'}</p>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground border-b">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Purchased Qty</th>
                <th className="px-4 py-3 w-32">Return Qty</th>
              </tr>
            </thead>
            <tbody>
              {returnItems.map(item => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3">{item.productName}</td>
                  <td className="px-4 py-3">${item.unitPrice}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      min="0" 
                      max={item.quantity} 
                      value={item.returnQty} 
                      onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value) || 0)}
                      className="w-20 h-8 rounded border bg-background px-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t flex justify-end">
            <button 
              onClick={handleProcessReturn} 
              disabled={returnMut.isPending}
              className="h-10 px-6 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {returnMut.isPending ? 'Processing...' : 'Process Return'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
