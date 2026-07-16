import { api } from './axios';

export const roleApi = {
  getAll: () => 
    api.get('/roles').then(res => res.data),
  
  getUserRoles: (userId: string) => 
    api.get(`/roles/user/${userId}`).then(res => res.data),
  
  assign: (userId: string, roleId: string) => 
    api.post('/roles/assign', { userId, roleId }).then(res => res.data),
  
  unassign: (userId: string, roleId: string) => 
    api.delete('/roles/unassign', { data: { userId, roleId } }).then(res => res.data),
};
