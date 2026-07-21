import { api } from './axios';

export const plansApi = {
  getAll: () => api.get('/plans').then((res: any) => res.data),
  getOne: (id: string) => api.get(`/plans/${id}`).then((res: any) => res.data),
  create: (data: any) => api.post('/plans', data).then((res: any) => res.data),
  update: (id: string, data: any) => api.patch(`/plans/${id}`, data).then((res: any) => res.data),
  delete: (id: string) => api.delete(`/plans/${id}`).then((res: any) => res.data),
};
