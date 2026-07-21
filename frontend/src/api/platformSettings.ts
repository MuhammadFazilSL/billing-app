import { api } from './axios';

export const platformSettingsApi = {
  getSettings: () => api.get('/platform/settings').then((res: any) => res.data),
  updateSettings: (data: any) => api.patch('/platform/settings', data).then((res: any) => res.data),
};
