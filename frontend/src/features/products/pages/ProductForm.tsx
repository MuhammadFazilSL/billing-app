import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { createProduct, updateProduct, getProduct, getCategories, getBrands, getUnits, getTaxes } from '../../../api/masterData';

export const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { register, handleSubmit, reset } = useForm();

  // Loaders
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  const { data: units = [] } = useQuery({ queryKey: ['units'], queryFn: getUnits });
  const { data: taxes = [] } = useQuery({ queryKey: ['taxes'], queryFn: getTaxes });

  const { data: product } = useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? updateProduct(id!, data) : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/app/products');
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      ...data,
      purchasePrice: parseFloat(data.purchasePrice),
      sellingPrice: parseFloat(data.sellingPrice),
      mrp: data.mrp ? parseFloat(data.mrp) : undefined,
      minimumStock: data.minimumStock ? parseFloat(data.minimumStock) : undefined,
      reorderLevel: data.reorderLevel ? parseFloat(data.reorderLevel) : undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input {...register('name', { required: true })} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input {...register('sku')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Barcode</label>
              <input {...register('barcode')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchase Price</label>
              <input type="number" step="0.01" {...register('purchasePrice')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Selling Price</label>
              <input type="number" step="0.01" {...register('sellingPrice')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">MRP</label>
              <input type="number" step="0.01" {...register('mrp')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            
            {/* Foreign Keys */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select {...register('categoryId')} className="w-full h-9 rounded-md border bg-background px-3">
                <option value="">None</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <select {...register('brandId')} className="w-full h-9 rounded-md border bg-background px-3">
                <option value="">None</option>
                {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select {...register('unitId')} className="w-full h-9 rounded-md border bg-background px-3">
                <option value="">None</option>
                {units.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax Config</label>
              <select {...register('taxId')} className="w-full h-9 rounded-md border bg-background px-3">
                <option value="">None</option>
                {taxes.map((t: any) => <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => navigate('/app/products')} className="h-9 px-4 rounded-md border hover:bg-muted">Cancel</button>
            <button type="submit" className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              {mutation.isPending ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
