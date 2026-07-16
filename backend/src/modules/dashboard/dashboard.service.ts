import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getSummary(tenantId: string) {
    // Placeholder summary logic as requested
    return {
      revenue: 0,
      activeSubscriptions: 0,
      totalCustomers: 0,
      recentActivity: []
    };
  }
}
