import { api } from './axios';

export const platformApi = {
  login: (data: any) => api.post('/platform/login', data).then((res: any) => res.data),
  getDashboardStats: () => api.get('/platform/dashboard').then((res: any) => res.data),
  getTenants: () => api.get('/platform/tenants').then((res: any) => res.data),
  getTenant: (id: string) => api.get(`/platform/tenants/${id}`).then((res: any) => res.data),
  updateTenant: (id: string, data: any) => api.patch(`/platform/tenants/${id}`, data).then((res: any) => res.data),
  updateTenantStatus: (id: string, status: string) => api.patch(`/platform/tenants/${id}/status`, { status }).then((res: any) => res.data),
  deleteTenant: (id: string) => api.delete(`/platform/tenants/${id}`).then((res: any) => res.data),
};
