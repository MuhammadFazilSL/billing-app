import { api } from './axios';

export const purchaseApi = {
  create: (data: any) => 
    api.post('/purchases', data).then(res => res.data),
    
  getAll: (page = 1, limit = 50, search = '') => 
    api.get('/purchases', { params: { page, limit, search } }).then(res => res.data),
    
  getOne: (id: string) => 
    api.get(`/purchases/${id}`).then(res => res.data),
};
