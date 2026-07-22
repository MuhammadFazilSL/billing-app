import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from './DashboardCard';
import { PlusCircle, ShoppingCart, Truck, Users, BarChart3 } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  const actions = [
    { label: 'New Sale', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600', path: '/app/billing' },
    { label: 'Add Product', icon: PlusCircle, color: 'bg-purple-100 text-purple-600', path: '/app/inventory' },
    { label: 'New Purchase', icon: Truck, color: 'bg-emerald-100 text-emerald-600', path: '/app/purchases' },
    { label: 'Add Customer', icon: Users, color: 'bg-orange-100 text-orange-600', path: '/app/customers' },
    { label: 'View Reports', icon: BarChart3, color: 'bg-rose-100 text-rose-600', path: '/app/reports' },
  ];

  return (
    <DashboardCard title="Quick Actions">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-4 rounded-xl border hover:border-primary hover:shadow-md transition-all group"
          >
            <div className={`p-3 rounded-full mb-3 group-hover:scale-110 transition-transform ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </DashboardCard>
  );
};
