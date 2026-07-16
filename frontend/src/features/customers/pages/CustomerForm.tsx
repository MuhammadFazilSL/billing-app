import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { customerApi } from '../../../api/customers';

export const CustomerForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { register, handleSubmit, reset } = useForm();

  const { data: customer } = useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerApi.getOne(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (customer) {
      reset(customer);
    }
  }, [customer, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? customerApi.update({ id: id!, data }) : customerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/app/customers');
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      ...data,
      creditLimit: data.creditLimit ? parseFloat(data.creditLimit) : undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit Customer' : 'Add New Customer'}</h1>
      </div>
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input {...register('name', { required: true })} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" {...register('email')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input {...register('phone')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credit Limit</label>
              <input type="number" step="0.01" {...register('creditLimit')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea {...register('address')} className="w-full rounded-md border bg-background px-3 py-2" rows={3}></textarea>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => navigate('/app/customers')} className="h-9 px-4 rounded-md border hover:bg-muted">Cancel</button>
            <button type="submit" className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              {mutation.isPending ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
