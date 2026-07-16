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
  Gift,
  LineChart,
  Settings
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/app/products', icon: Package },
    { name: 'Categories', path: '/app/categories', icon: Tags },
    { name: 'POS (Billing)', path: '/app/billing', icon: CreditCard },
    { name: 'Invoices', path: '/app/invoices', icon: FileText },
    { name: 'Purchases', path: '/app/purchases', icon: ShoppingCart },
    { name: 'Returns', path: '/app/returns', icon: Undo2 },
    { name: 'Inventory', path: '/app/inventory', icon: Package },
    { name: 'Customers', path: '/app/customers', icon: Users },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck },
    { name: 'Employees', path: '/app/employees', icon: Contact },
    { name: 'Roles', path: '/app/roles', icon: Users },
    { name: 'Offers', path: '/app/offers', icon: Gift },
    { name: 'Reports', path: '/app/reports', icon: LineChart },
    { name: 'Settings', path: '/app/settings', icon: Settings },
    { name: 'Subscription', path: '/app/subscription', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-background border-r border-border h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="font-bold text-lg tracking-tight">SaaS Billing</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
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
        ))}
      </nav>
    </aside>
  );
};
