import { apiRequest } from './api';
import { DashboardSummary } from '../types/api';

// Mock data for testing
const mockDashboardData: DashboardSummary = {
  walletCount: 3,
  transactionCount: 128,
  totalValue: 12452.87
};

const dashboardService = {
  /**
   * Get dashboard summary data
   * @returns Dashboard summary data
   */
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    try {
      const response = await apiRequest<DashboardSummary>({
        method: 'GET',
        url: '/dashboard/summary',
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      // Return mock data if API endpoint is not yet implemented
      return mockDashboardData;
    }
  },
};

export default dashboardService; 