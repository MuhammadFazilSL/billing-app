import { api } from './axios';

export const subscriptionsApi = {
  getAll: () => api.get('/subscriptions').then((res: any) => res.data),
  getOne: (id: string) => api.get(`/subscriptions/${id}`).then((res: any) => res.data),
  create: (data: any) => api.post('/subscriptions', data).then((res: any) => res.data),
  update: (id: string, data: any) => api.patch(`/subscriptions/${id}`, data).then((res: any) => res.data),
};

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: string;
  billingCycle: string;
  startsAt: string;
  expiresAt: string;
  nextRenewalAt: string;
  createdAt: string;
  updatedAt: string;
  plan: {
    id: string;
    name: string;
    features: any;
    monthlyPrice: number;
    yearlyPrice: number;
    maxProducts: number;
    maxCustomers: number;
    maxEmployees: number;
    maxBranches: number;
    maxStorageGB: number;
    maxMonthlyInvoices: number;
  };
}

export const getSubscriptionsCurrent = async (): Promise<Subscription> => {
  const response = await api.get('/subscriptions/current');
  return response.data;
};
