import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponsApi } from '../../../api/coupons';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { Ticket } from 'lucide-react';

export const Coupons: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: coupons = [], isLoading } = useQuery({ queryKey: ['coupons'], queryFn: couponsApi.getAll });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    maxUses: '',
    isActive: true,
  });

  const mutation = useMutation({
    mutationFn: couponsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setShowForm(false);
      setFormData({ code: '', type: 'PERCENTAGE', value: '', maxUses: '', isActive: true });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      code: formData.code.toUpperCase(),
      value: Number(formData.value),
      maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground mt-1">Manage discount codes for your customers.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : 'New Coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card shadow-sm border rounded-lg p-6 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code</label>
            <input 
              required 
              type="text" 
              className="w-full border rounded-md p-2 uppercase" 
              value={formData.code} 
              onChange={e => setFormData({ ...formData, code: e.target.value })} 
              placeholder="e.g. SAVE20" 
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
            <label className="block text-sm font-medium mb-1">Max Uses (Optional)</label>
            <input 
              type="number" 
              className="w-full border rounded-md p-2" 
              value={formData.maxUses} 
              onChange={e => setFormData({ ...formData, maxUses: e.target.value })} 
              placeholder="Leave blank for unlimited"
            />
          </div>
          <button type="submit" disabled={mutation.isPending} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 w-full">
            {mutation.isPending ? 'Saving...' : 'Save Coupon'}
          </button>
        </form>
      )}

      <div className="bg-card shadow-sm border rounded-lg">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Ticket className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No coupons found</h3>
            <p className="text-muted-foreground mb-4">Create your first coupon code.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 font-medium text-muted-foreground">Code</th>
                <th className="p-4 font-medium text-muted-foreground">Value</th>
                <th className="p-4 font-medium text-muted-foreground">Uses</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon: any) => (
                <tr key={coupon.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-bold">{coupon.code}</td>
                  <td className="p-4">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `$${coupon.value}`}
                  </td>
                  <td className="p-4">{coupon.currentUses} / {coupon.maxUses || '∞'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
