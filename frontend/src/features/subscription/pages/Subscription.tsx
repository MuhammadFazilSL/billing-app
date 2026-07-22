
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '../../../layouts/Breadcrumb';
import { getSubscriptionsCurrent } from '../../../api/subscriptions';
import { api } from '../../../api/axios';

import { PlanCard } from '../../../components/subscription/PlanCard';
import { UsageCard } from '../../../components/subscription/UsageCard';
import { FeatureGrid } from '../../../components/subscription/FeatureGrid';
import { LimitTable } from '../../../components/subscription/LimitTable';
import { BillingInfo } from '../../../components/subscription/BillingInfo';
import { SubscriptionActions } from '../../../components/subscription/SubscriptionActions';
import { LoadingSubscription } from '../../../components/subscription/LoadingSubscription';
import { EmptySubscription } from '../../../components/subscription/EmptySubscription';

export const Subscription = () => {
  const { data: subscription, isLoading: isSubLoading, error: subError } = useQuery({
    queryKey: ['subscriptionCurrent'],
    queryFn: getSubscriptionsCurrent,
    staleTime: 60000,
  });

  const { data: usage, isLoading: isUsageLoading, error: usageError } = useQuery({
    queryKey: ['usageCurrent'],
    queryFn: async () => {
      const res = await api.get('/usage');
      return res.data;
    },
    staleTime: 60000,
  });

  if (isSubLoading || isUsageLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Breadcrumb />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your plan, check limits, and review your usage.
          </p>
        </div>
        <LoadingSubscription />
      </div>
    );
  }

  if (subError || usageError) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Breadcrumb />
        <div className="mt-8 text-red-500 bg-red-50 p-4 rounded-md border border-red-200">
          Failed to load subscription details. Please try again later.
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Breadcrumb />
        <div className="mt-8">
          <EmptySubscription />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your plan, check limits, and review your usage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlanCard subscription={subscription} />
        </div>
        <div className="lg:col-span-1">
          <UsageCard subscription={subscription} usage={usage} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          <FeatureGrid subscription={subscription} />
          <LimitTable subscription={subscription} usage={usage} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <BillingInfo subscription={subscription} />
          <SubscriptionActions />
        </div>
      </div>
    </div>
  );
};
