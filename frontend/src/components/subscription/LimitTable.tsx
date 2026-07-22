import React from 'react';
import { Subscription } from '../../api/subscriptions';

interface LimitTableProps {
  subscription: Subscription;
  usage: any;
}

export const LimitTable: React.FC<LimitTableProps> = ({ subscription, usage }) => {
  const { plan } = subscription;

  const limits = [
    { label: 'Products', used: usage.productsUsed, max: plan.maxProducts },
    { label: 'Customers', used: usage.customersUsed, max: plan.maxCustomers },
    { label: 'Employees', used: usage.employeesUsed || 0, max: plan.maxEmployees },
    { label: 'Branches', used: usage.branchesUsed || 0, max: plan.maxBranches },
    { label: 'Monthly Invoices', used: usage.invoicesGenerated || 0, max: plan.maxMonthlyInvoices },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Plan Limits</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Usage
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allowed
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remaining
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {limits.map((item, idx) => {
              const isUnlimited = item.max === 0 || item.max === -1;
              const remaining = isUnlimited ? 'Unlimited' : item.max - item.used;
              const displayMax = isUnlimited ? 'Unlimited' : item.max;

              return (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.used}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {displayMax}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span
                      className={`font-medium ${
                        !isUnlimited && item.max - item.used < (item.max * 0.1)
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {remaining}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
