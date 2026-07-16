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
import { CustomerForm } from '../features/customers/pages/CustomerForm';
import { Suppliers } from '../features/suppliers/pages/Suppliers';
import { SupplierForm } from '../features/suppliers/pages/SupplierForm';
import { Employees } from '../features/employees/pages/Employees';
import { EmployeeForm } from '../features/employees/pages/EmployeeForm';
import { Roles } from '../features/roles/pages/Roles';
import { Billing } from '../features/billing/pages/Billing';
import { InvoiceList } from '../features/billing/pages/InvoiceList';
import { InvoiceDetails } from '../features/billing/pages/InvoiceDetails';
import { PurchaseList } from '../features/purchases/pages/PurchaseList';
import { PurchaseCreate } from '../features/purchases/pages/PurchaseCreate';
import { PurchaseDetails } from '../features/purchases/pages/PurchaseDetails';
import { SalesReturn } from '../features/returns/pages/SalesReturn';
import { PurchaseReturn } from '../features/returns/pages/PurchaseReturn';
import { ReturnHistory } from '../features/returns/pages/ReturnHistory';
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
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/:id/edit" element={<CustomerForm />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/new" element={<SupplierForm />} />
          <Route path="suppliers/:id/edit" element={<SupplierForm />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/new" element={<EmployeeForm />} />
          <Route path="employees/:id/edit" element={<EmployeeForm />} />
          <Route path="roles" element={<Roles />} />
          <Route path="billing" element={<Billing />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/:id" element={<InvoiceDetails />} />
          
          <Route path="purchases" element={<PurchaseList />} />
          <Route path="purchases/new" element={<PurchaseCreate />} />
          <Route path="purchases/:id" element={<PurchaseDetails />} />
          
          <Route path="returns" element={<ReturnHistory />} />
          <Route path="returns/sales" element={<SalesReturn />} />
          <Route path="returns/purchase" element={<PurchaseReturn />} />
          
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
