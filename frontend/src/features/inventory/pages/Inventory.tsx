import React, { useState } from 'react';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { InventoryDashboard } from '../components/InventoryDashboard';
import { StockList } from '../components/StockList';
import { TransactionHistory } from '../components/TransactionHistory';
import { OpeningStockForm } from '../components/OpeningStockForm';
import { StockAdjustmentForm } from '../components/StockAdjustmentForm';

export const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'stock', label: 'Stock List' },
    { id: 'ledger', label: 'Ledger & History' },
    { id: 'adjustment', label: 'Adjustments' },
    { id: 'opening', label: 'Opening Stock' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">Manage stock levels, ledger transactions, and adjustments.</p>
      </div>

      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-4">
        {activeTab === 'overview' && <InventoryDashboard />}
        {activeTab === 'stock' && <StockList />}
        {activeTab === 'ledger' && <TransactionHistory />}
        {activeTab === 'adjustment' && <StockAdjustmentForm onSuccess={() => setActiveTab('ledger')} />}
        {activeTab === 'opening' && <OpeningStockForm onSuccess={() => setActiveTab('ledger')} />}
      </div>
    </div>
  );
};
