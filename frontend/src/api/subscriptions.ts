import { api } from './axios';

export const subscriptionsApi = {
  getAll: () => api.get('/subscriptions').then((res: any) => res.data),
  getOne: (id: string) => api.get(`/subscriptions/${id}`).then((res: any) => res.data),
  create: (data: any) => api.post('/subscriptions', data).then((res: any) => res.data),
  update: (id: string, data: any) => api.patch(`/subscriptions/${id}`, data).then((res: any) => res.data),
};
