import { api } from './axios';

export const returnApi = {
  createSalesReturn: (data: any) => 
    api.post('/returns/sales', data).then(res => res.data),

  createPurchaseReturn: (data: any) => 
    api.post('/returns/purchase', data).then(res => res.data),
    
  getAll: (page = 1, limit = 50, search = '', type = '') => 
    api.get('/returns', { params: { page, limit, search, type } }).then(res => res.data),
    
  getOne: (id: string) => 
    api.get(`/returns/${id}`).then(res => res.data),
};
