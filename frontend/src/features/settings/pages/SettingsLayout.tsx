import React from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { Building2, MapPin, Receipt, Percent, Printer, Mail, Globe, Sliders, Database } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export const SettingsLayout: React.FC = () => {
  const location = useLocation();
  
  if (location.pathname === '/app/settings') {
    return <Navigate to="/app/settings/company" replace />;
  }

  const navItems = [
    { name: 'Company Profile', path: '/app/settings/company', icon: Building2 },
    { name: 'Branches', path: '/app/settings/branches', icon: MapPin },
    { name: 'Invoice', path: '/app/settings/invoice', icon: Receipt },
    { name: 'Tax', path: '/app/settings/tax', icon: Percent },
    { name: 'Printer', path: '/app/settings/printer', icon: Printer },
    { name: 'Email', path: '/app/settings/email', icon: Mail },
    { name: 'Regional', path: '/app/settings/regional', icon: Globe },
    { name: 'User Preferences', path: '/app/settings/preferences', icon: Sliders },
    { name: 'Backup', path: '/app/settings/backup', icon: Database },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your business settings and configurations.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-1">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
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
        
        <main className="flex-1 min-w-0 bg-card rounded-lg border border-border p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
