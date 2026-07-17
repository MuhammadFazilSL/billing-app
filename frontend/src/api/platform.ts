import { api } from './axios';

export const platformApi = {
  // Auth
  login: (data: any) => api.post('/platform/login', data).then(res => res.data),
  
  // Dashboard
  getDashboard: () => api.get('/platform/dashboard').then(res => res.data),
  
  // Tenants
  getTenants: () => api.get('/platform/tenants').then(res => res.data),
  updateTenantStatus: (id: string, status: string) => api.patch(`/platform/tenants/${id}/status`, { status }).then(res => res.data),
  
  // Plans
  getPlans: () => api.get('/plans').then(res => res.data),
  createPlan: (data: any) => api.post('/plans', data).then(res => res.data),
  updatePlan: (id: string, data: any) => api.patch(`/plans/${id}`, data).then(res => res.data),
  deletePlan: (id: string) => api.delete(`/plans/${id}`).then(res => res.data),
  
  // Subscriptions
  getSubscriptions: () => api.get('/subscriptions').then(res => res.data),
  createSubscription: (data: any) => api.post('/subscriptions', data).then(res => res.data),
  
  // Usage
  getTenantUsage: (tenantId: string) => api.get(`/usage/${tenantId}`).then(res => res.data),
};
