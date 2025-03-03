import { apiRequest } from './api';
import { DashboardSummary } from '../types/api';
import transactionService from './transactionService';
import walletService from './walletService';

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
      
      // If API fails, try to calculate from available services
      try {
        const wallets = await walletService.getAllWallets();
        const transactions = await transactionService.getAllTransactions();
        
        let totalValue = 0;
        wallets.forEach(wallet => {
          if (wallet.balance) {
            totalValue += wallet.balance;
          }
        });
        
        return {
          walletCount: wallets.length,
          transactionCount: transactions.length,
          totalValue
        };
      } catch (serviceError) {
        console.error('Error calculating dashboard data:', serviceError);
        // Return mock data as last resort
        return mockDashboardData;
      }
    }
  },
  
  /**
   * Get transaction activity data grouped by day for the dashboard
   * @param timeframe The time period to get data for (week, month, year)
   * @returns Transaction activity data grouped by day
   */
  getTransactionActivity: async (timeframe: 'week' | 'month' | 'year' = 'month') => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `/dashboard/activity?timeframe=${timeframe}`,
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching transaction activity:', error);
      
      // If API fails, try to calculate from transaction service
      try {
        const transactions = await transactionService.getAllTransactions();
        
        // Filter transactions based on timeframe
        const now = new Date();
        let cutoffDate = new Date();
        
        if (timeframe === 'week') {
          cutoffDate.setDate(now.getDate() - 7);
        } else if (timeframe === 'month') {
          cutoffDate.setMonth(now.getMonth() - 1);
        } else if (timeframe === 'year') {
          cutoffDate.setFullYear(now.getFullYear() - 1);
        }
        
        return transactions.filter(tx => new Date(tx.timestamp) >= cutoffDate);
      } catch (serviceError) {
        console.error('Error calculating transaction activity:', serviceError);
        return [];
      }
    }
  },
  
  /**
   * Get wallet balance distribution for the dashboard
   * @returns Wallet balance data
   */
  getWalletBalanceDistribution: async () => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/dashboard/wallet-distribution',
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching wallet balance distribution:', error);
      
      // If API fails, try to calculate from wallet service
      try {
        const wallets = await walletService.getAllWallets();
        
        return wallets
          .filter(wallet => wallet.balance && wallet.balance > 0)
          .map(wallet => ({
            name: wallet.name || wallet.address.substring(0, 8) + '...',
            value: wallet.balance || 0
          }));
      } catch (serviceError) {
        console.error('Error calculating wallet balance distribution:', serviceError);
        return [];
      }
    }
  }
};

export default dashboardService; 