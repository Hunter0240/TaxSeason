import { apiRequest } from './api';
import { Transaction } from '../types/api';

// Mock data for testing when API is not available
const generateMockTransactions = (count: number = 10): Transaction[] => {
  const blockchains = ['Arbitrum One', 'Ethereum', 'Polygon'];
  const types = ['send', 'receive', 'swap', 'other'];
  const statuses = ['completed', 'pending', 'failed'];
  const categories = ['income', 'expense', 'trade', 'transfer', 'fee', 'uncategorized'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)] as 'send' | 'receive' | 'swap' | 'other';
    const status = statuses[Math.floor(Math.random() * statuses.length)] as 'completed' | 'pending' | 'failed';
    const category = categories[Math.floor(Math.random() * categories.length)];
    const value = Math.random() * 1000;
    const fee = Math.random() * 10;
    const from = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const to = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const blockchain = blockchains[Math.floor(Math.random() * blockchains.length)];
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();
    
    return {
      id: `tx-${i + 1}`,
      hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      walletAddress: from,
      blockchain,
      timestamp,
      value,
      from,
      to,
      status,
      type,
      fee,
      category,
      notes: Math.random() > 0.7 ? `Sample note for transaction ${i + 1}` : undefined
    };
  });
};

// Cached mock data
const mockTransactions = generateMockTransactions(25);

const transactionService = {
  /**
   * Get all transactions for a specific wallet
   */
  getTransactionsByWallet: async (walletAddress: string): Promise<Transaction[]> => {
    try {
      const response = await apiRequest<Transaction[]>({
        method: 'GET',
        url: `/transactions/wallet/${walletAddress}`,
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching transactions by wallet:', error);
      // Return mock data if API endpoint is not yet implemented
      return mockTransactions.filter(tx => 
        tx.walletAddress === walletAddress || 
        tx.from === walletAddress || 
        tx.to === walletAddress
      );
    }
  },

  /**
   * Get all transactions
   */
  getAllTransactions: async (): Promise<Transaction[]> => {
    try {
      const response = await apiRequest<Transaction[]>({
        method: 'GET',
        url: '/transactions',
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      // Return mock data if API endpoint is not yet implemented
      return mockTransactions;
    }
  },

  /**
   * Get transaction details by transaction ID
   */
  getTransactionById: async (transactionId: string): Promise<Transaction | null> => {
    try {
      const response = await apiRequest<Transaction>({
        method: 'GET',
        url: `/transactions/${transactionId}`,
      });
      
      return response;
    } catch (error) {
      console.error(`Error fetching transaction with ID ${transactionId}:`, error);
      // Return mock data if API endpoint is not yet implemented
      const mockTransaction = mockTransactions.find(tx => tx.id === transactionId);
      return mockTransaction || null;
    }
  },

  /**
   * Update transaction notes
   */
  updateTransactionNotes: async (transactionId: string, notes: string): Promise<Transaction | null> => {
    try {
      const response = await apiRequest<Transaction>({
        method: 'PATCH',
        url: `/transactions/${transactionId}`,
        data: { notes }
      });
      
      return response;
    } catch (error) {
      console.error(`Error updating notes for transaction with ID ${transactionId}:`, error);
      
      // Update mock data if API endpoint is not yet implemented
      const mockTransactionIndex = mockTransactions.findIndex(tx => tx.id === transactionId);
      if (mockTransactionIndex !== -1) {
        mockTransactions[mockTransactionIndex] = {
          ...mockTransactions[mockTransactionIndex],
          notes
        };
        return mockTransactions[mockTransactionIndex];
      }
      
      return null;
    }
  }
};

export default transactionService; 