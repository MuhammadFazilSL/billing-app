import { api } from './axios';

export const loyaltyApi = {
  getCustomerLoyalty: (customerId: string) => api.get(`/loyalty/${customerId}`).then((res: any) => res.data),
  redeemPoints: (data: any) => api.post('/loyalty/redeem', data).then((res: any) => res.data),
};
