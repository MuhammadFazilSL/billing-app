import { api } from './axios';

export const invoiceApi = {
  create: (data: any) => 
    api.post('/invoices', data).then(res => res.data),
    
  getAll: (page = 1, limit = 50, search = '') => 
    api.get('/invoices', { params: { page, limit, search } }).then(res => res.data),
    
  getOne: (id: string) => 
    api.get(`/invoices/${id}`).then(res => res.data),
};
