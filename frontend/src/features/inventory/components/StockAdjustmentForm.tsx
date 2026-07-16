import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts } from '../../../api/masterData';
import { addAdjustment } from '../../../api/inventory';

export const StockAdjustmentForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const mutation = useMutation({
    mutationFn: addAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      reset();
      onSuccess();
      alert('Stock adjustment saved successfully');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Error saving adjustment'),
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      productId: data.productId,
      quantity: parseFloat(data.quantity),
      direction: data.direction,
      reason: data.reason,
      remarks: data.remarks,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg bg-card p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold">Stock Adjustment</h3>
      <p className="text-sm text-muted-foreground mb-4">Record damaged, lost, or manual stock corrections.</p>
      
      <div>
        <label className="block text-sm font-medium mb-1">Product</label>
        <select {...register('productId', { required: true })} className="w-full h-9 rounded-md border bg-background px-3">
          <option value="">Select Product...</option>
          {products.map((p: any) => <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Direction</label>
          <select {...register('direction', { required: true })} className="w-full h-9 rounded-md border bg-background px-3">
            <option value="OUT">Remove Stock (OUT)</option>
            <option value="IN">Add Stock (IN)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input type="number" step="0.001" {...register('quantity', { required: true })} className="w-full h-9 rounded-md border bg-background px-3" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reason</label>
        <select {...register('reason', { required: true })} className="w-full h-9 rounded-md border bg-background px-3">
          <option value="DAMAGED">Damaged</option>
          <option value="EXPIRED">Expired</option>
          <option value="MANUAL_CORRECTION">Manual Correction</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <input {...register('remarks')} className="w-full h-9 rounded-md border bg-background px-3" />
      </div>

      <button type="submit" disabled={mutation.isPending} className="w-full h-9 rounded-md bg-primary text-primary-foreground">
        {mutation.isPending ? 'Saving...' : 'Save Adjustment'}
      </button>
    </form>
  );
};
