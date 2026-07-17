import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { offersApi } from '../../../api/offers';
import { Breadcrumb } from '../../../layouts/Breadcrumb';

export const OfferCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    type: 'PERCENTAGE',
    value: '',
    offerScope: 'STORE',
    validFrom: '',
    validTo: '',
    isActive: true,
  });

  const mutation = useMutation({
    mutationFn: offersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      navigate('/app/offers');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      value: Number(formData.value),
      validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : undefined,
      validTo: formData.validTo ? new Date(formData.validTo).toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Offer</h1>
        <p className="text-muted-foreground mt-1">Set up a new promotional offer.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card shadow-sm border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Offer Name</label>
          <input 
            required 
            type="text" 
            className="w-full border rounded-md p-2" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            placeholder="e.g. Summer Sale" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Discount Type</label>
            <select 
              className="w-full border rounded-md p-2" 
              value={formData.type} 
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FLAT">Flat Amount ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input 
              required 
              type="number" 
              step="0.01" 
              className="w-full border rounded-md p-2" 
              value={formData.value} 
              onChange={e => setFormData({ ...formData, value: e.target.value })} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scope</label>
          <select 
            className="w-full border rounded-md p-2" 
            value={formData.offerScope} 
            onChange={e => setFormData({ ...formData, offerScope: e.target.value })}
          >
            <option value="STORE">Store-wide (All Products)</option>
            <option value="CATEGORY">Specific Category (Future)</option>
            <option value="PRODUCT">Specific Product (Future)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Valid From (Optional)</label>
            <input 
              type="date" 
              className="w-full border rounded-md p-2" 
              value={formData.validFrom} 
              onChange={e => setFormData({ ...formData, validFrom: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valid To (Optional)</label>
            <input 
              type="date" 
              className="w-full border rounded-md p-2" 
              value={formData.validTo} 
              onChange={e => setFormData({ ...formData, validTo: e.target.value })} 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-4">
          <button type="button" onClick={() => navigate('/app/offers')} className="px-4 py-2 border rounded-md">Cancel</button>
          <button type="submit" disabled={mutation.isPending} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            {mutation.isPending ? 'Saving...' : 'Create Offer'}
          </button>
        </div>
      </form>
    </div>
  );
};
