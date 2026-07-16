import { api } from './axios';

// Categories
export const getCategories = () => api.get('/categories').then(res => res.data);
export const createCategory = (data: any) => api.post('/categories', data).then(res => res.data);
export const updateCategory = (id: string, data: any) => api.patch(`/categories/${id}`, data).then(res => res.data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`).then(res => res.data);

// Brands
export const getBrands = () => api.get('/brands').then(res => res.data);
export const createBrand = (data: any) => api.post('/brands', data).then(res => res.data);
export const updateBrand = (id: string, data: any) => api.patch(`/brands/${id}`, data).then(res => res.data);
export const deleteBrand = (id: string) => api.delete(`/brands/${id}`).then(res => res.data);

// Units
export const getUnits = () => api.get('/units').then(res => res.data);
export const createUnit = (data: any) => api.post('/units', data).then(res => res.data);
export const updateUnit = (id: string, data: any) => api.patch(`/units/${id}`, data).then(res => res.data);
export const deleteUnit = (id: string) => api.delete(`/units/${id}`).then(res => res.data);

// Taxes
export const getTaxes = () => api.get('/taxes').then(res => res.data);
export const createTax = (data: any) => api.post('/taxes', data).then(res => res.data);
export const updateTax = (id: string, data: any) => api.patch(`/taxes/${id}`, data).then(res => res.data);
export const deleteTax = (id: string) => api.delete(`/taxes/${id}`).then(res => res.data);

// Products
export const getProducts = () => api.get('/products').then(res => res.data);
export const getProduct = (id: string) => api.get(`/products/${id}`).then(res => res.data);
export const createProduct = (data: any) => api.post('/products', data).then(res => res.data);
export const updateProduct = (id: string, data: any) => api.patch(`/products/${id}`, data).then(res => res.data);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`).then(res => res.data);
