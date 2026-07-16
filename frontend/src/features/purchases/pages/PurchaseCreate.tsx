import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { purchaseApi } from '../../../api/purchases';
import { getProducts } from '../../../api/masterData';
import { supplierApi } from '../../../api/suppliers';
import { Breadcrumb } from '../../../layouts/Breadcrumb';

export const PurchaseCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [notes, setNotes] = useState('');

  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const { data: suppliersData = {} } = useQuery({ queryKey: ['suppliers'], queryFn: () => supplierApi.getAll(1, 100) });
  const suppliers = suppliersData.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    const found = products.find((p: any) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase() === searchQuery.toLowerCase() ||
      p.barcode?.toLowerCase() === searchQuery.toLowerCase()
    );

    if (found) {
      addToCart(found);
      setSearchQuery('');
    } else {
      alert('Product not found');
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => {
          if (item.productId === product.id) {
            const newQty = item.quantity + 1;
            const taxAmt = (item.unitCost * newQty * item.taxRate) / 100;
            return {
              ...item,
              quantity: newQty,
              taxAmount: taxAmt,
              totalAmount: (item.unitCost * newQty) + taxAmt,
            };
          }
          return item;
        });
      }

      const qty = 1;
      const cost = parseFloat(product.purchasePrice || 0);
      const taxRate = product.tax ? parseFloat(product.tax.rate) : 0;
      const taxAmt = (cost * qty * taxRate) / 100;

      return [...prev, {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitCost: cost,
        taxRate: taxRate,
        taxAmount: taxAmt,
        discountAmount: 0,
        totalAmount: cost + taxAmt,
      }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) return;
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const taxAmt = (item.unitCost * qty * item.taxRate) / 100;
        return {
          ...item,
          quantity: qty,
          taxAmount: taxAmt,
          totalAmount: (item.unitCost * qty) + taxAmt,
        };
      }
      return item;
    }));
  };

  const updateCost = (productId: string, cost: number) => {
    if (cost < 0) return;
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const taxAmt = (cost * item.quantity * item.taxRate) / 100;
        return {
          ...item,
          unitCost: cost,
          taxAmount: taxAmt,
          totalAmount: (cost * item.quantity) + taxAmt,
        };
      }
      return item;
    }));
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const totals = useMemo(() => {
    let subTotal = 0;
    let taxAmount = 0;
    let grandTotal = 0;

    cart.forEach(item => {
      subTotal += (item.unitCost * item.quantity);
      taxAmount += item.taxAmount;
      grandTotal += item.totalAmount;
    });

    return { subTotal, taxAmount, grandTotal };
  }, [cart]);

  const generateMut = useMutation({
    mutationFn: purchaseApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); // invalidate stock
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      navigate(`/app/purchases/${data.id}`);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to create purchase');
    }
  });

  const handleGenerate = () => {
    if (cart.length === 0) return alert('Cart is empty!');
    
    const payload = {
      supplierId: selectedSupplierId || undefined,
      subTotal: totals.subTotal,
      taxAmount: totals.taxAmount,
      grandTotal: totals.grandTotal,
      amountPaid: totals.grandTotal,
      paymentStatus: 'PAID',
      paymentMethod,
      notes,
      items: cart
    };

    generateMut.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Purchase</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 h-10 rounded-md border bg-background px-3" 
                placeholder="Search Product..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="h-10 px-4 rounded-md bg-primary text-primary-foreground">Add to Purchase</button>
            </form>
          </div>

          <div className="bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 w-32">Qty</th>
                  <th className="px-4 py-3 w-32">Cost</th>
                  <th className="px-4 py-3">Tax</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No items added</td></tr>
                ) : (
                  cart.map(item => (
                    <tr key={item.productId} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3">{item.productName}</td>
                      <td className="px-4 py-3">
                        <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)} className="w-16 h-8 rounded border bg-background px-2" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min="0" step="0.01" value={item.unitCost} onChange={(e) => updateCost(item.productId, parseFloat(e.target.value) || 0)} className="w-20 h-8 rounded border bg-background px-2" />
                      </td>
                      <td className="px-4 py-3">${item.taxAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 font-medium">${item.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => removeItem(item.productId)} className="text-red-500">Remove</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border h-fit space-y-6">
          <h2 className="text-xl font-semibold">Purchase Summary</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Supplier</label>
              <select value={selectedSupplierId} onChange={(e) => setSelectedSupplierId(e.target.value)} className="w-full h-9 rounded-md border bg-background px-3">
                <option value="">Select Supplier</option>
                {suppliers.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.companyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full h-9 rounded-md border bg-background px-3">
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CARD">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={2}></textarea>
            </div>
          </div>

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${totals.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>${totals.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
              <span>Grand Total</span>
              <span>${totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={cart.length === 0 || generateMut.isPending} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
            {generateMut.isPending ? 'Processing...' : 'Complete Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};
