import { api } from './axios';

export const permissionApi = {
  getAllGrouped: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },
};
