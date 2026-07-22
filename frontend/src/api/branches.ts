import { api } from './axios';

export const branchesApi = {
  getBranches: () => api.get('/branches').then(res => res.data),
  getBranch: (id: string) => api.get(`/branches/${id}`).then(res => res.data),
  createBranch: (data: any) => api.post('/branches', data).then(res => res.data),
  updateBranch: (id: string, data: any) => api.patch(`/branches/${id}`, data).then(res => res.data),
  deleteBranch: (id: string) => api.delete(`/branches/${id}`).then(res => res.data),
};
