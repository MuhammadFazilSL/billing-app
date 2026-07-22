import { api } from './axios';

export const settingsApi = {
  getCompanyProfile: () => api.get('/settings/company').then(res => res.data),
  updateCompanyProfile: (data: any) => api.patch('/settings/company', data).then(res => res.data),
  
  getTenantSettings: () => api.get('/settings').then(res => res.data),
  
  updateInvoiceSettings: (data: any) => api.patch('/settings/invoice', data).then(res => res.data),
  updateTaxSettings: (data: any) => api.patch('/settings/tax', data).then(res => res.data),
  updatePrinterSettings: (data: any) => api.patch('/settings/printer', data).then(res => res.data),
  updateEmailSettings: (data: any) => api.patch('/settings/email', data).then(res => res.data),
  updateRegionalSettings: (data: any) => api.patch('/settings/regional', data).then(res => res.data),
  updatePreferencesSettings: (data: any) => api.patch('/settings/preferences', data).then(res => res.data),
  updateBackupSettings: (data: any) => api.patch('/settings/backup', data).then(res => res.data),
};
