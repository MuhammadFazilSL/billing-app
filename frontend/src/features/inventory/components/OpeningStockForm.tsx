import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts } from '../../../api/masterData';
import { addOpeningStock } from '../../../api/inventory';

export const OpeningStockForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const mutation = useMutation({
    mutationFn: addOpeningStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      reset();
      onSuccess();
      alert('Opening stock added successfully');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Error adding opening stock'),
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      productId: data.productId,
      quantity: parseFloat(data.quantity),
      unitCost: parseFloat(data.unitCost),
      remarks: data.remarks,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg bg-card p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold">Add Opening Stock</h3>
      <p className="text-sm text-muted-foreground mb-4">Opening stock can only be added once per product.</p>
      
      <div>
        <label className="block text-sm font-medium mb-1">Product</label>
        <select {...register('productId', { required: true })} className="w-full h-9 rounded-md border bg-background px-3">
          <option value="">Select Product...</option>
          {products.map((p: any) => <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input type="number" step="0.001" {...register('quantity', { required: true })} className="w-full h-9 rounded-md border bg-background px-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit Cost</label>
          <input type="number" step="0.01" {...register('unitCost', { required: true })} className="w-full h-9 rounded-md border bg-background px-3" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <input {...register('remarks')} className="w-full h-9 rounded-md border bg-background px-3" />
      </div>

      <button type="submit" disabled={mutation.isPending} className="w-full h-9 rounded-md bg-primary text-primary-foreground">
        {mutation.isPending ? 'Saving...' : 'Save Opening Stock'}
      </button>
    </form>
  );
};
