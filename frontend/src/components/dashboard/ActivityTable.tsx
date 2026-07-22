import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { FileText, ShoppingBag, Users, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityTableProps {
  recentActivity: {
    invoices: any[];
    purchases: any[];
    customers: any[];
    returns: any[];
  };
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ recentActivity }) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'purchases' | 'customers' | 'returns'>('invoices');
  const navigate = useNavigate();

  const tabs = [
    { id: 'invoices', label: 'Invoices', icon: FileText, data: recentActivity.invoices },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag, data: recentActivity.purchases },
    { id: 'customers', label: 'Customers', icon: Users, data: recentActivity.customers },
    { id: 'returns', label: 'Returns', icon: RotateCcw, data: recentActivity.returns },
  ] as const;

  const currentTab = tabs.find(t => t.id === activeTab)!;

  return (
    <DashboardCard title="Recent Activity" className="h-full">
      <div className="flex space-x-2 border-b border-border pb-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground font-medium' 
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        {currentTab.data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No recent {currentTab.label.toLowerCase()} found.
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground bg-muted/30">
              <tr>
                {activeTab === 'invoices' && (
                  <>
                    <th className="px-4 py-2 font-medium rounded-l-md">Invoice #</th>
                    <th className="px-4 py-2 font-medium">Customer</th>
                    <th className="px-4 py-2 font-medium text-right">Amount</th>
                    <th className="px-4 py-2 font-medium text-right rounded-r-md">Date</th>
                  </>
                )}
                {activeTab === 'purchases' && (
                  <>
                    <th className="px-4 py-2 font-medium rounded-l-md">Purchase #</th>
                    <th className="px-4 py-2 font-medium">Supplier</th>
                    <th className="px-4 py-2 font-medium text-right">Amount</th>
                    <th className="px-4 py-2 font-medium text-right rounded-r-md">Date</th>
                  </>
                )}
                {activeTab === 'customers' && (
                  <>
                    <th className="px-4 py-2 font-medium rounded-l-md">Name</th>
                    <th className="px-4 py-2 font-medium">Phone</th>
                    <th className="px-4 py-2 font-medium text-right rounded-r-md">Joined</th>
                  </>
                )}
                {activeTab === 'returns' && (
                  <>
                    <th className="px-4 py-2 font-medium rounded-l-md">Return #</th>
                    <th className="px-4 py-2 font-medium">Customer</th>
                    <th className="px-4 py-2 font-medium text-right">Amount</th>
                    <th className="px-4 py-2 font-medium text-right rounded-r-md">Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {currentTab.data.map((item, i) => (
                <tr 
                  key={item.id} 
                  className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => {
                    if (activeTab === 'invoices') navigate(`/app/invoices/${item.id}`);
                    if (activeTab === 'purchases') navigate(`/app/purchases`);
                    if (activeTab === 'customers') navigate(`/app/customers`);
                    if (activeTab === 'returns') navigate(`/app/returns`);
                  }}
                >
                  {activeTab === 'invoices' && (
                    <>
                      <td className="px-4 py-3 font-medium text-primary">{item.invoiceNumber}</td>
                      <td className="px-4 py-3">{item.customer?.name || 'Walk-in'}</td>
                      <td className="px-4 py-3 text-right font-medium">${Number(item.grandTotal).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </>
                  )}
                  {activeTab === 'purchases' && (
                    <>
                      <td className="px-4 py-3 font-medium text-primary">{item.purchaseNumber}</td>
                      <td className="px-4 py-3">{item.supplier?.companyName || 'N/A'}</td>
                      <td className="px-4 py-3 text-right font-medium">${Number(item.grandTotal).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </>
                  )}
                  {activeTab === 'customers' && (
                    <>
                      <td className="px-4 py-3 font-medium text-primary">{item.name}</td>
                      <td className="px-4 py-3">{item.phone || '-'}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </>
                  )}
                  {activeTab === 'returns' && (
                    <>
                      <td className="px-4 py-3 font-medium text-primary">{item.returnNumber}</td>
                      <td className="px-4 py-3">{item.customer?.name || 'Walk-in'}</td>
                      <td className="px-4 py-3 text-right font-medium">${Number(item.totalRefund).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardCard>
  );
};
