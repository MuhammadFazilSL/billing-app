import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../../../api/reports';
import { loyaltyApi } from '../../../api/loyalty';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { Award, Search } from 'lucide-react';

export const Loyalty: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Reusing report customer query to find customers
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({ 
    queryKey: ['report-customers', 1, searchTerm], 
    queryFn: () => reportApi.getCustomers({ page: 1, limit: 10, search: searchTerm }) 
  });

  const { data: loyaltyData, isLoading: isLoadingLoyalty } = useQuery({
    queryKey: ['loyalty', selectedCustomerId],
    queryFn: () => loyaltyApi.getCustomerLoyalty(selectedCustomerId!),
    enabled: !!selectedCustomerId
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Loyalty</h1>
        <p className="text-muted-foreground mt-1">View customer loyalty points and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card shadow-sm border rounded-lg p-6 flex flex-col space-y-4 col-span-1">
          <h3 className="font-semibold text-lg">Search Customer</h3>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 mt-4">
            {isLoadingCustomers ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : customersData?.data?.length === 0 ? (
              <div className="text-sm text-muted-foreground">No customers found.</div>
            ) : (
              customersData?.data?.map((customer: any) => (
                <div 
                  key={customer.id} 
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className={`p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${selectedCustomerId === customer.id ? 'border-primary bg-primary/5' : ''}`}
                >
                  <div className="font-medium text-sm">{customer.name}</div>
                  <div className="text-xs text-muted-foreground">{customer.phone}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card shadow-sm border rounded-lg p-6 col-span-2">
          {!selectedCustomerId ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
              <Award className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a customer to view their loyalty details.</p>
            </div>
          ) : isLoadingLoyalty ? (
            <div className="h-full flex items-center justify-center min-h-[300px]">Loading...</div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-primary/10 p-6 rounded-lg border border-primary/20">
                <div>
                  <p className="text-sm text-primary font-medium mb-1">Available Balance</p>
                  <h2 className="text-4xl font-bold text-primary">{loyaltyData?.balance || 0} pts</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-xl font-medium">${(loyaltyData?.balance || 0).toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Transaction History</h3>
                {loyaltyData?.history?.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No loyalty transactions found.</p>
                ) : (
                  <div className="space-y-3">
                    {loyaltyData?.history?.map((tx: any) => (
                      <div key={tx.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="text-sm font-medium">{tx.type} <span className="text-muted-foreground font-normal ml-2">{tx.remarks}</span></p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</p>
                        </div>
                        <div className={`font-bold ${tx.type === 'EARN' ? 'text-green-600' : 'text-red-500'}`}>
                          {tx.type === 'EARN' ? '+' : '-'}{tx.points}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
