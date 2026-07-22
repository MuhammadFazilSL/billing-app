import React from 'react';
import { Subscription } from '../../api/subscriptions';

interface PlanCardProps {
  subscription: Subscription;
}

export const PlanCard: React.FC<PlanCardProps> = ({ subscription }) => {
  const { plan, status, billingCycle, startsAt, expiresAt } = subscription;

  const getDaysRemaining = () => {
    const end = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const daysRemaining = getDaysRemaining();
  
  // Calculate percentage of time passed for a basic progress bar visual
  const start = new Date(startsAt).getTime();
  const end = new Date(expiresAt).getTime();
  const now = new Date().getTime();
  let percentage = 0;
  if (end > start) {
    percentage = ((now - start) / (end - start)) * 100;
  }
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
          <p className="text-sm text-gray-500 capitalize">{billingCycle.toLowerCase()} Plan</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === 'ACTIVE'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Days Remaining</span>
          <span className="font-semibold text-gray-900">{daysRemaining} Days</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${daysRemaining < 7 ? 'bg-red-500' : 'bg-primary-600'}`}
            style={{ width: `${100 - percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Start Date</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(startsAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(expiresAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
