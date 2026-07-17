import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { offersApi } from '../../../api/offers';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { Plus, Tag } from 'lucide-react';

export const OffersList: React.FC = () => {
  const navigate = useNavigate();
  const { data: offers = [], isLoading } = useQuery({ queryKey: ['offers'], queryFn: offersApi.getAll });

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground mt-1">Manage product, category, and store-wide discounts.</p>
        </div>
        <button 
          onClick={() => navigate('/app/offers/create')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Offer
        </button>
      </div>

      <div className="bg-card shadow-sm border rounded-lg">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Tag className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No active offers</h3>
            <p className="text-muted-foreground mb-4">Create an offer to boost your sales.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 font-medium text-muted-foreground">Name</th>
                <th className="p-4 font-medium text-muted-foreground">Scope</th>
                <th className="p-4 font-medium text-muted-foreground">Value</th>
                <th className="p-4 font-medium text-muted-foreground">Valid Until</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer: any) => (
                <tr key={offer.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium">{offer.name}</td>
                  <td className="p-4">{offer.offerScope}</td>
                  <td className="p-4">
                    {offer.type === 'PERCENTAGE' ? `${offer.value}%` : `$${offer.value}`}
                  </td>
                  <td className="p-4">{offer.validTo ? new Date(offer.validTo).toLocaleDateString() : 'No expiry'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
