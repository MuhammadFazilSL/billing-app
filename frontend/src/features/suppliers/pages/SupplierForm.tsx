import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { supplierApi } from '../../../api/suppliers';

export const SupplierForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { register, handleSubmit, reset } = useForm();

  const { data: supplier } = useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => supplierApi.getOne(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (supplier) {
      reset(supplier);
    }
  }, [supplier, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? supplierApi.update({ id: id!, data }) : supplierApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      navigate('/app/suppliers');
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit Supplier' : 'Add New Supplier'}</h1>
      </div>
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input {...register('companyName', { required: true })} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Person</label>
              <input {...register('contactName')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" {...register('email')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input {...register('phone')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea {...register('address')} className="w-full rounded-md border bg-background px-3 py-2" rows={3}></textarea>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => navigate('/app/suppliers')} className="h-9 px-4 rounded-md border hover:bg-muted">Cancel</button>
            <button type="submit" className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              {mutation.isPending ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
