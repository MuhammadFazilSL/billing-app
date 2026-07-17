import { api } from './axios';

export const offersApi = {
  getAll: () => api.get('/offers').then((res: any) => res.data),
  create: (data: any) => api.post('/offers', data).then((res: any) => res.data),
};
