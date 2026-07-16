import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { employeeApi } from '../../../api/employees';

export const EmployeeForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { register, handleSubmit, reset } = useForm();

  const { data: employee } = useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeeApi.getOne(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (employee) {
      // Joining date might need formatting if it comes as ISO string
      const formatted = { ...employee };
      if (formatted.joiningDate) {
        formatted.joiningDate = new Date(formatted.joiningDate).toISOString().split('T')[0];
      }
      reset(formatted);
    }
  }, [employee, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? employeeApi.update({ id: id!, data }) : employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/app/employees');
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      ...data,
      salary: data.salary ? parseFloat(data.salary) : undefined,
      joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
      </div>
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input {...register('firstName', { required: true })} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input {...register('lastName', { required: true })} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" {...register('email', { required: true })} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password {isEdit && '(Leave blank to keep unchanged)'}</label>
              <input type="password" {...register('password', { required: !isEdit })} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input {...register('phone')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employee Code</label>
              <input {...register('employeeCode')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Designation</label>
              <input {...register('designation')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Joining Date</label>
              <input type="date" {...register('joiningDate')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Salary</label>
              <input type="number" step="0.01" {...register('salary')} className="w-full h-9 rounded-md border bg-background px-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select {...register('status')} className="w-full h-9 rounded-md border bg-background px-3">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea {...register('notes')} className="w-full rounded-md border bg-background px-3 py-2" rows={3}></textarea>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => navigate('/app/employees')} className="h-9 px-4 rounded-md border hover:bg-muted">Cancel</button>
            <button type="submit" className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              {mutation.isPending ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
