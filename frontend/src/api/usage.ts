import { api } from './axios';

export const usageApi = {
  getMyUsage: () => api.get('/usage').then((res: any) => res.data),
  getTenantUsage: (tenantId: string) => api.get(`/usage/${tenantId}`).then((res: any) => res.data),
};
