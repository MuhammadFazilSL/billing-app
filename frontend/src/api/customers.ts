import { api } from './axios';

export const customerApi = {
  getAll: (page = 1, limit = 50, search = '') => 
    api.get('/customers', { params: { page, limit, search } }).then(res => res.data),
  
  getOne: (id: string) => 
    api.get(`/customers/${id}`).then(res => res.data),
  
  create: (data: any) => 
    api.post('/customers', data).then(res => res.data),
  
  update: ({ id, data }: { id: string; data: any }) => 
    api.patch(`/customers/${id}`, data).then(res => res.data),
  
  delete: (id: string) => 
    api.delete(`/customers/${id}`).then(res => res.data),
};
