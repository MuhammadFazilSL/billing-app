import { api } from './axios';

export const employeeApi = {
  getAll: (page = 1, limit = 50, search = '') => 
    api.get('/employees', { params: { page, limit, search } }).then(res => res.data),
  
  getOne: (id: string) => 
    api.get(`/employees/${id}`).then(res => res.data),
  
  create: (data: any) => 
    api.post('/employees', data).then(res => res.data),
  
  update: ({ id, data }: { id: string; data: any }) => 
    api.patch(`/employees/${id}`, data).then(res => res.data),
  
  delete: (id: string) => 
    api.delete(`/employees/${id}`).then(res => res.data),
};
