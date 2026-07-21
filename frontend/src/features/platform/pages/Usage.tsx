import { useState, useEffect } from 'react';
import { platformApi } from '../../../api/platform';
import { ProgressCard } from '../../../components/platform/ProgressCard';
import { LoadingState } from '../../../components/platform/LoadingState';

export function Usage() {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      // Platform Admins fetch all tenants to aggregate usage
      const tenants = await platformApi.getTenants();
      
      let totalProducts = 0;
      let totalCustomers = 0;
      let totalEmployees = 0;
      let totalInvoices = 0;
      let maxProducts = 0;
      let maxCustomers = 0;
      let maxEmployees = 0;
      let maxInvoices = 0;

      tenants.forEach((t: any) => {
        if (t.usageMetric) {
          totalProducts += t.usageMetric.productsUsed || 0;
          totalCustomers += t.usageMetric.customersUsed || 0;
          totalEmployees += t.usageMetric.employeesUsed || 0;
          totalInvoices += t.usageMetric.invoicesThisMonth || 0;
        }
        if (t.plan) {
          maxProducts += t.plan.maxProducts || 0;
          maxCustomers += t.plan.maxCustomers || 0;
          maxEmployees += t.plan.maxEmployees || 0;
          maxInvoices += t.plan.maxInvoicesPerMonth || 0;
        }
      });

      setUsage({
        metrics: {
          productsCount: totalProducts,
          customersCount: totalCustomers,
          employeesCount: totalEmployees,
          invoicesCount: totalInvoices,
        },
        limits: {
          maxProducts,
          maxCustomers,
          maxEmployees,
          maxInvoicesPerMonth: maxInvoices,
        }
      });
    } catch (error) {
      console.error('Failed to fetch usage', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!usage) return <div>No usage data available</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Usage Tracking</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProgressCard title="Products" used={usage.metrics?.productsCount || 0} allowed={usage.limits?.maxProducts || 0} />
        <ProgressCard title="Customers" used={usage.metrics?.customersCount || 0} allowed={usage.limits?.maxCustomers || 0} />
        <ProgressCard title="Employees" used={usage.metrics?.employeesCount || 0} allowed={usage.limits?.maxEmployees || 0} />
        <ProgressCard title="Invoices" used={usage.metrics?.invoicesCount || 0} allowed={usage.limits?.maxInvoicesPerMonth || 0} />
        <ProgressCard title="Storage (MB)" used={usage.metrics?.storageUsedMB || 0} allowed={usage.limits?.storageLimitMB || 0} />
        <ProgressCard title="Branches" used={usage.metrics?.branchesCount || 0} allowed={usage.limits?.maxBranches || 0} />
      </div>
    </div>
  );
}
