import React from 'react';
import { DashboardCard } from './DashboardCard';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LowStockTableProps {
  products: any[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ products }) => {
  const navigate = useNavigate();

  return (
    <DashboardCard title="Low Stock Alerts" className="h-full">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <p className="text-sm">All products are sufficiently stocked!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(product => (
            <div 
              key={product.id} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => navigate('/app/inventory')}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${Number(product.stock) <= 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${Number(product.stock) <= 0 ? 'text-red-600' : 'text-amber-600'}`}>
                  {Number(product.stock)} left
                </p>
                <p className="text-xs text-muted-foreground">Price: ${Number(product.sellingPrice).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <button 
            onClick={() => navigate('/app/inventory')}
            className="w-full mt-2 py-2 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
          >
            View Full Inventory
          </button>
        </div>
      )}
    </DashboardCard>
  );
};
