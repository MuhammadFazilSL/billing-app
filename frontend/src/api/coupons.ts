import { api } from './axios';

export const couponsApi = {
  getAll: () => api.get('/coupons').then((res: any) => res.data),
  create: (data: any) => api.post('/coupons', data).then((res: any) => res.data),
  validate: (code: string, purchaseAmount: number) => api.post('/coupons/validate', { code, purchaseAmount }).then((res: any) => res.data),
};
