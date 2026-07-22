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
import { OffersList } from '../features/offers/pages/OffersList';
import { OfferCreate } from '../features/offers/pages/OfferCreate';
import { Coupons } from '../features/offers/pages/Coupons';
import { Loyalty } from '../features/offers/pages/Loyalty';
import { PlatformLayout } from '../layouts/PlatformLayout';
import { PlatformLogin } from '../features/platform/pages/PlatformLogin';
import { PlatformDashboard } from '../features/platform/pages/PlatformDashboard';
import { Tenants } from '../features/platform/pages/Tenants';
import { Plans } from '../features/platform/pages/Plans';
import { Subscriptions } from '../features/platform/pages/Subscriptions';
import { Usage } from '../features/platform/pages/Usage';
import { Settings as PlatformSettings } from '../features/platform/pages/Settings';
import { ReportsDashboard } from '../features/reports/pages/ReportsDashboard';
import { SalesReport } from '../features/reports/pages/SalesReport';
import { PurchaseReport } from '../features/reports/pages/PurchaseReport';
import { InventoryReport } from '../features/reports/pages/InventoryReport';
import { CustomerReport } from '../features/reports/pages/CustomerReport';
import { SupplierReport } from '../features/reports/pages/SupplierReport';
import { TaxReport } from '../features/reports/pages/TaxReport';
import { ProfitLossReport } from '../features/reports/pages/ProfitLossReport';
import { SettingsLayout } from '../features/settings/pages/SettingsLayout';
import { CompanySettings } from '../features/settings/pages/CompanySettings';
import { BranchSettings } from '../features/settings/pages/BranchSettings';
import { InvoiceSettings } from '../features/settings/pages/InvoiceSettings';
import { TaxSettings } from '../features/settings/pages/TaxSettings';
import { PrinterSettings } from '../features/settings/pages/PrinterSettings';
import { EmailSettings } from '../features/settings/pages/EmailSettings';
import { RegionalSettings } from '../features/settings/pages/RegionalSettings';
import { UserPreferences } from '../features/settings/pages/UserPreferences';
import { BackupSettings } from '../features/settings/pages/BackupSettings';
import { Subscription } from '../features/subscription/pages/Subscription';

// Misc Pages
import { NotFound } from '../pages/NotFound';
import { Unauthorized } from '../pages/Unauthorized';
import { PermissionRoute } from '../components/auth/PermissionRoute';
import { PERMISSIONS } from '../constants/permissions';

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
              user: response.data.user,
              role: response.data.role,
              permissions: response.data.permissions,
              accessToken,
              refreshToken: localStorage.getItem('refreshToken') || '',
            })
          );
        } catch (error) {
          // Token is likely invalid or expired (and refresh failed)
          dispatch(logout());
          window.location.href = '/auth/login';
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

      {/* Platform Routes */}
      <Route path="/platform/login" element={<PlatformLogin />} />
      <Route path="/platform" element={<PlatformLayout />}>
        <Route index element={<PlatformDashboard />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="plans" element={<Plans />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="usage" element={<Usage />} />
        <Route path="settings" element={<PlatformSettings />} />
      </Route>

      {/* Tenant Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route element={<PermissionRoute permission={PERMISSIONS.DASHBOARD_VIEW} />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          
          <Route element={<PermissionRoute permission={PERMISSIONS.PRODUCTS_VIEW} />}>
            <Route path="products" element={<Products />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.PRODUCTS_CREATE} />}>
            <Route path="products/new" element={<ProductForm />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.PRODUCTS_EDIT} />}>
            <Route path="products/:id/edit" element={<ProductForm />} />
          </Route>

          <Route element={<PermissionRoute permission={PERMISSIONS.CATEGORIES_VIEW} />}>
            <Route path="categories" element={<Categories />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.BRANDS_VIEW} />}>
            <Route path="brands" element={<Brands />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.UNITS_VIEW} />}>
            <Route path="units" element={<Units />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.TAXES_VIEW} />}>
            <Route path="taxes" element={<Taxes />} />
          </Route>

          <Route element={<PermissionRoute permission={PERMISSIONS.INVENTORY_VIEW} />}>
            <Route path="inventory" element={<Inventory />} />
          </Route>

          <Route element={<PermissionRoute permission={PERMISSIONS.CUSTOMERS_VIEW} />}>
            <Route path="customers" element={<Customers />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.CUSTOMERS_CREATE} />}>
            <Route path="customers/new" element={<CustomerForm />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.CUSTOMERS_EDIT} />}>
            <Route path="customers/:id/edit" element={<CustomerForm />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.SUPPLIERS_VIEW} />}>
            <Route path="suppliers" element={<Suppliers />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.SUPPLIERS_CREATE} />}>
            <Route path="suppliers/new" element={<SupplierForm />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.SUPPLIERS_EDIT} />}>
            <Route path="suppliers/:id/edit" element={<SupplierForm />} />
          </Route>

          <Route element={<PermissionRoute permission={PERMISSIONS.EMPLOYEES_VIEW} />}>
            <Route path="employees" element={<Employees />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.EMPLOYEES_CREATE} />}>
            <Route path="employees/new" element={<EmployeeForm />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.EMPLOYEES_EDIT} />}>
            <Route path="employees/:id/edit" element={<EmployeeForm />} />
          </Route>

          <Route element={<PermissionRoute permission={PERMISSIONS.ROLES_VIEW} />}>
            <Route path="roles" element={<Roles />} />
          </Route>

          <Route element={<PermissionRoute permission={PERMISSIONS.BILLING_VIEW} />}>
            <Route path="billing" element={<Billing />} />
            <Route path="invoices" element={<InvoiceList />} />
            <Route path="invoices/:id" element={<InvoiceDetails />} />
          </Route>
          
          <Route element={<PermissionRoute permission={PERMISSIONS.PURCHASES_VIEW} />}>
            <Route path="purchases" element={<PurchaseList />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.PURCHASES_CREATE} />}>
            <Route path="purchases/new" element={<PurchaseCreate />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.PURCHASES_VIEW} />}>
            <Route path="purchases/:id" element={<PurchaseDetails />} />
          </Route>
          
          <Route element={<PermissionRoute permission={PERMISSIONS.RETURNS_VIEW} />}>
            <Route path="returns" element={<ReturnHistory />} />
            <Route path="returns/sales" element={<SalesReturn />} />
            <Route path="returns/purchase" element={<PurchaseReturn />} />
          </Route>
          
          {/* Offers & Loyalty Routes */}
          <Route element={<PermissionRoute permission={PERMISSIONS.OFFERS_VIEW} />}>
            <Route path="offers" element={<OffersList />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.OFFERS_CREATE} />}>
            <Route path="offers/create" element={<OfferCreate />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.COUPONS_VIEW} />}>
            <Route path="coupons" element={<Coupons />} />
          </Route>
          <Route element={<PermissionRoute permission={PERMISSIONS.LOYALTY_VIEW} />}>
            <Route path="loyalty" element={<Loyalty />} />
          </Route>
          
          <Route element={<PermissionRoute permission={PERMISSIONS.REPORTS_VIEW} />}>
            <Route path="reports" element={<ReportsDashboard />} />
            <Route path="reports/sales" element={<SalesReport />} />
            <Route path="reports/inventory" element={<InventoryReport />} />
          </Route>
          <Route path="reports/inventory" element={<InventoryReport />} />
          <Route path="reports/customers" element={<CustomerReport />} />
          <Route path="reports/suppliers" element={<SupplierReport />} />
          <Route path="reports/taxes" element={<TaxReport />} />
          <Route path="reports/profit-loss" element={<ProfitLossReport />} />
          
          {/* Settings Routes */}
          <Route element={<PermissionRoute permission={PERMISSIONS.SETTINGS_VIEW} />}>
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="company" replace />} />
              <Route path="company" element={<CompanySettings />} />
              <Route path="branches" element={<BranchSettings />} />
              <Route path="invoice" element={<InvoiceSettings />} />
              <Route path="tax" element={<TaxSettings />} />
              <Route path="printers" element={<PrinterSettings />} />
              <Route path="email" element={<EmailSettings />} />
              <Route path="regional" element={<RegionalSettings />} />
              <Route path="preferences" element={<UserPreferences />} />
              <Route path="backup" element={<BackupSettings />} />
            </Route>
          </Route>

          <Route element={<PermissionRoute permission={PERMISSIONS.SUBSCRIPTIONS_VIEW} />}>
            <Route path="subscription" element={<Subscription />} />
          </Route>
        </Route>
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
