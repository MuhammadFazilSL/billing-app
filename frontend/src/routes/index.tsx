import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { RootState } from '../store/store';
import { setCredentials, setLoading, logout } from '../features/auth/authSlice';
import { api } from '../api/axios';

// Auth Pages
import { Login } from '../features/auth/pages/Login';
import { Register } from '../features/auth/pages/Register';

// Feature Pages (Placeholders)
import { Dashboard } from '../features/dashboard/pages/Dashboard';
import { Products } from '../features/products/pages/Products';
import { ProductForm } from '../features/products/pages/ProductForm';
import { Categories } from '../features/categories/pages/Categories';
import { Brands } from '../features/brands/pages/Brands';
import { Units } from '../features/units/pages/Units';
import { Taxes } from '../features/taxes/pages/Taxes';
import { Inventory } from '../features/inventory/pages/Inventory';
import { Customers } from '../features/customers/pages/Customers';
import { Suppliers } from '../features/suppliers/pages/Suppliers';
import { Employees } from '../features/employees/pages/Employees';
import { Billing } from '../features/billing/pages/Billing';
import { Offers } from '../features/offers/pages/Offers';
import { Reports } from '../features/reports/pages/Reports';
import { Settings } from '../features/settings/pages/Settings';
import { Subscription } from '../features/subscription/pages/Subscription';

// Misc Pages
import { NotFound } from '../pages/NotFound';
import { Unauthorized } from '../pages/Unauthorized';

export const AppRoutes = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken) {
        try {
          // Verify token and fetch latest user info
          const response = await api.get('/auth/me');
          dispatch(
            setCredentials({
              user: response.data,
              accessToken,
              refreshToken: localStorage.getItem('refreshToken') || '',
            })
          );
        } catch (error) {
          // Token is likely invalid or expired (and refresh failed)
          dispatch(logout());
        }
      }
      dispatch(setLoading(false));
    };

    initializeAuth();
  }, [dispatch, accessToken]);

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="units" element={<Units />} />
          <Route path="taxes" element={<Taxes />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="employees" element={<Employees />} />
          <Route path="billing" element={<Billing />} />
          <Route path="offers" element={<Offers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="subscription" element={<Subscription />} />
        </Route>
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
