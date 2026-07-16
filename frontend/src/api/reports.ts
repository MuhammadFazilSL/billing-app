import { api } from './axios';

export const reportApi = {
  getDashboard: () => api.get('/reports/dashboard').then(res => res.data),
  getSales: (params: any) => api.get('/reports/sales', { params }).then(res => res.data),
  getPurchases: (params: any) => api.get('/reports/purchases', { params }).then(res => res.data),
  getInventory: (params: any) => api.get('/reports/inventory', { params }).then(res => res.data),
  getCustomers: (params: any) => api.get('/reports/customers', { params }).then(res => res.data),
  getSuppliers: (params: any) => api.get('/reports/suppliers', { params }).then(res => res.data),
  getTaxes: (params: any) => api.get('/reports/taxes', { params }).then(res => res.data),
  getProfitLoss: (params: any) => api.get('/reports/profit-loss', { params }).then(res => res.data),
};
