import { apiRequest } from './api';

export interface Wallet {
  _id: string;
  address: string;
  label: string;
  network: string;
  createdAt: string;
  updatedAt: string;
  lastSync?: string;
}

export interface NewWallet {
  address: string;
  label: string;
  network?: string;
}

const walletService = {
  /**
   * Get all wallets
   * @returns Array of wallets
   */
  getAllWallets: async (): Promise<Wallet[]> => {
    return apiRequest<Wallet[]>({
      method: 'GET',
      url: '/wallets',
    });
  },

  /**
   * Get a wallet by ID
   * @param id Wallet ID
   * @returns Wallet object
   */
  getWalletById: async (id: string): Promise<Wallet> => {
    return apiRequest<Wallet>({
      method: 'GET',
      url: `/wallets/${id}`,
    });
  },

  /**
   * Add a new wallet
   * @param wallet New wallet data
   * @returns Created wallet object
   */
  addWallet: async (wallet: NewWallet): Promise<Wallet> => {
    return apiRequest<Wallet>({
      method: 'POST',
      url: '/wallets',
      data: wallet,
    });
  },

  /**
   * Update a wallet
   * @param id Wallet ID
   * @param updates Wallet updates
   * @returns Updated wallet object
   */
  updateWallet: async (id: string, updates: Partial<NewWallet>): Promise<Wallet> => {
    return apiRequest<Wallet>({
      method: 'PUT',
      url: `/wallets/${id}`,
      data: updates,
    });
  },

  /**
   * Delete a wallet
   * @param id Wallet ID
   * @returns Success message
   */
  deleteWallet: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>({
      method: 'DELETE',
      url: `/wallets/${id}`,
    });
  },

  /**
   * Get transactions for a wallet
   * @param id Wallet ID
   * @param limit Number of transactions to fetch
   * @param skip Number of transactions to skip
   * @returns Array of transactions
   */
  getWalletTransactions: async (id: string, limit = 100, skip = 0): Promise<any[]> => {
    return apiRequest<any[]>({
      method: 'GET',
      url: `/wallets/${id}/transactions`,
      params: { limit, skip },
    });
  },
};

export default walletService; 