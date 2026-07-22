import { api } from './axios';

export const roleApi = {
  getAll: () => 
    api.get('/roles').then(res => res.data),
  
  getUserRoles: (userId: string) => 
    api.get(`/roles/user/${userId}`).then(res => res.data),
  
  assign: async (userId: string, roleId: string) => {
    const response = await api.post('/roles/assign', { userId, roleId });
    return response.data;
  },

  unassign: async (userId: string, roleId: string) => {
    const response = await api.delete('/roles/unassign', { data: { userId, roleId } });
    return response.data;
  },

  getPermissions: async (roleId: string) => {
    const response = await api.get(`/roles/${roleId}/permissions`);
    return response.data;
  },

  updatePermissions: async (roleId: string, permissions: string[]) => {
    const response = await api.put(`/roles/${roleId}/permissions`, { permissions });
    return response.data;
  },

  clone: async (roleId: string, name: string, description?: string) => {
    const response = await api.post(`/roles/${roleId}/clone`, { name, description });
    return response.data;
  }
};
