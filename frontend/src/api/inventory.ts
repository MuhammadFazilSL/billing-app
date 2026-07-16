import { api } from './axios';

export const getInventorySummary = () => api.get('/inventory/summary').then(res => res.data);
export const getLowStock = () => api.get('/inventory/low-stock').then(res => res.data);
export const getInventoryLedger = (page = 1, limit = 50) => api.get(`/inventory/ledger?page=${page}&limit=${limit}`).then(res => res.data);
export const getProductHistory = (id: string) => api.get(`/inventory/product/${id}/history`).then(res => res.data);

export const addOpeningStock = (data: any) => api.post('/inventory/opening-stock', data).then(res => res.data);
export const addAdjustment = (data: any) => api.post('/inventory/adjustment', data).then(res => res.data);
