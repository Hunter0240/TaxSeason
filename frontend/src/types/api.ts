/**
 * Standard API error response
 */
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  limit?: number;
  skip?: number;
  page?: number;
}

/**
 * Standard pagination metadata in API responses
 */
export interface PaginationMeta {
  total: number;
  limit: number;
  skip: number;
  page: number;
  pages: number;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Transaction type from The Graph
 */
export interface Transaction {
  id: string;
  hash: string;
  walletAddress: string;
  blockchain: string;
  timestamp: string;
  value: number;
  from: string;
  to: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'send' | 'receive' | 'swap' | 'other';
  category?: 'income' | 'expense' | 'trade' | 'transfer' | 'fee' | 'uncategorized';
  fee?: number;
  notes?: string;
}

/**
 * Token Transfer type from The Graph
 */
export interface TokenTransfer {
  id: string;
  from: string;
  to: string;
  value: string;
  token: {
    id: string;
    symbol: string;
    name: string;
    decimals: string;
  };
  blockNumber: string;
  timestamp: string;
  transaction: {
    id: string;
    hash: string;
  };
}

/**
 * Dashboard summary data
 */
export interface DashboardSummary {
  walletCount: number;
  transactionCount: number;
  totalValue: number;
}

export interface Wallet {
  id: string;
  address: string;
  name: string;
  blockchain: string;
  balance?: number;
  createdAt?: string;
} 