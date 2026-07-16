import { api } from './axios';

export const supplierApi = {
  getAll: (page = 1, limit = 50, search = '') => 
    api.get('/suppliers', { params: { page, limit, search } }).then(res => res.data),
  
  getOne: (id: string) => 
    api.get(`/suppliers/${id}`).then(res => res.data),
  
  create: (data: any) => 
    api.post('/suppliers', data).then(res => res.data),
  
  update: ({ id, data }: { id: string; data: any }) => 
    api.patch(`/suppliers/${id}`, data).then(res => res.data),
  
  delete: (id: string) => 
    api.delete(`/suppliers/${id}`).then(res => res.data),
};
