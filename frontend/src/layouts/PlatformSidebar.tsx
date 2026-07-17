import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Box, Activity, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

const navigation = [
  { name: 'Dashboard', to: '/platform', icon: LayoutDashboard },
  { name: 'Tenants', to: '/platform/tenants', icon: Users },
  { name: 'Plans', to: '/platform/plans', icon: Box },
  { name: 'Subscriptions', to: '/platform/subscriptions', icon: CreditCard },
  { name: 'Usage Tracking', to: '/platform/usage', icon: Activity },
  { name: 'Settings', to: '/platform/settings', icon: Settings },
];

export function PlatformSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen shrink-0 border-r border-gray-800">
      <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          SaaS Master Admin
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                end={item.to === '/platform'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-600/10 text-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
