import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Tags,
  FileText,
  Truck,
  CreditCard,
  ShoppingCart,
  Undo2,
  Contact,
  Settings,
  BarChart,
  Tag,
  Ticket,
  Award
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../constants/permissions';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW },
    { name: 'Products', path: '/app/products', icon: Package, permission: PERMISSIONS.PRODUCTS_VIEW },
    { name: 'Categories', path: '/app/categories', icon: Tags, permission: PERMISSIONS.CATEGORIES_VIEW },
    { name: 'POS (Billing)', path: '/app/billing', icon: CreditCard, permission: PERMISSIONS.BILLING_VIEW },
    { name: 'Invoices', path: '/app/invoices', icon: FileText, permission: PERMISSIONS.BILLING_VIEW }, // Need specific invoices view or use Billing
    { name: 'Purchases', path: '/app/purchases', icon: ShoppingCart, permission: PERMISSIONS.PURCHASES_VIEW },
    { name: 'Returns', path: '/app/returns', icon: Undo2, permission: PERMISSIONS.RETURNS_VIEW },
    { name: 'Inventory', path: '/app/inventory', icon: Package, permission: PERMISSIONS.INVENTORY_VIEW },
    { name: 'Customers', path: '/app/customers', icon: Users, permission: PERMISSIONS.CUSTOMERS_VIEW },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, permission: PERMISSIONS.SUPPLIERS_VIEW },
    { name: 'Employees', path: '/app/employees', icon: Contact, permission: PERMISSIONS.EMPLOYEES_VIEW },
    { name: 'Roles', path: '/app/roles', icon: Users, permission: PERMISSIONS.ROLES_VIEW },
    { name: 'Offers', path: '/app/offers', icon: Tag, permission: PERMISSIONS.OFFERS_VIEW },
    { name: 'Coupons', path: '/app/coupons', icon: Ticket, permission: PERMISSIONS.COUPONS_VIEW },
    { name: 'Loyalty', path: '/app/loyalty', icon: Award, permission: PERMISSIONS.LOYALTY_VIEW },
    { name: 'Reports', path: '/app/reports', icon: BarChart, permission: PERMISSIONS.REPORTS_VIEW },
    { name: 'Settings', path: '/app/settings', icon: Settings, permission: PERMISSIONS.SETTINGS_VIEW },
    { name: 'Subscription', path: '/app/subscription', icon: CreditCard, permission: PERMISSIONS.SUBSCRIPTIONS_VIEW },
  ];

  return (
    <aside className="w-64 bg-background border-r border-border h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="font-bold text-lg tracking-tight">SaaS Billing</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const hasPermission = usePermission(item.permission);
          if (!hasPermission) return null;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                twMerge(
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  )
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
