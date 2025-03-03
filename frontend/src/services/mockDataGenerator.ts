import { Transaction, Wallet } from '../types/api';

// Helper function to generate random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate a random blockchain
const randomBlockchain = (): string => {
  const blockchains = ['Ethereum', 'Arbitrum One', 'Polygon'];
  return blockchains[Math.floor(Math.random() * blockchains.length)];
};

// Helper function to generate a random address
const randomAddress = (): string => {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Helper function to generate a random transaction hash
const randomHash = (): string => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Helper function to generate a random transaction type
const randomTransactionType = (): 'send' | 'receive' | 'swap' | 'other' => {
  const types: ('send' | 'receive' | 'swap' | 'other')[] = ['send', 'receive', 'swap', 'other'];
  return types[Math.floor(Math.random() * types.length)];
};

// Helper function to generate a random status
const randomStatus = (): 'completed' | 'pending' | 'failed' => {
  const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'pending', 'failed'];
  const weights = [0.8, 0.15, 0.05]; // 80% completed, 15% pending, 5% failed
  
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulativeProbability += weights[i];
    if (randomValue <= cumulativeProbability) {
      return statuses[i];
    }
  }
  
  return 'completed'; // Default fallback
};

// Helper function to generate a random category
const randomCategory = (): 'income' | 'expense' | 'trade' | 'transfer' | 'fee' | 'uncategorized' => {
  const categories: ('income' | 'expense' | 'trade' | 'transfer' | 'fee' | 'uncategorized')[] = 
    ['income', 'expense', 'trade', 'transfer', 'fee', 'uncategorized'];
  const weights = [0.15, 0.25, 0.3, 0.2, 0.05, 0.05]; // Different probabilities for different categories
  
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  
  for (let i = 0; i < categories.length; i++) {
    cumulativeProbability += weights[i];
    if (randomValue <= cumulativeProbability) {
      return categories[i];
    }
  }
  
  return 'uncategorized'; // Default fallback
};

// Generate mock transactions
const generateTransactions = (count: number = 10): Transaction[] => {
  const transactions: Transaction[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setFullYear(endDate.getFullYear() - 1); // Last year's data
  
  for (let i = 0; i < count; i++) {
    const type = randomTransactionType();
    const date = randomDate(startDate, endDate);
    const value = parseFloat((Math.random() * 10000).toFixed(2));
    
    // Generate random fee (typically small)
    const fee = parseFloat((Math.random() * 50).toFixed(2));
    
    // Generate from/to addresses based on transaction type
    const walletAddress = randomAddress();
    let from = randomAddress();
    let to = randomAddress();
    
    if (type === 'send') {
      from = walletAddress;
    } else if (type === 'receive') {
      to = walletAddress;
    }
    
    const transaction: Transaction = {
      id: `tx-${i}-${Date.now()}`,
      hash: randomHash(),
      walletAddress,
      blockchain: randomBlockchain(),
      timestamp: date.toISOString(),
      value,
      from,
      to,
      status: randomStatus(),
      type,
      category: randomCategory(),
      fee,
      notes: Math.random() > 0.7 ? `Transaction notes for ${i}` : undefined
    };
    
    transactions.push(transaction);
  }
  
  return transactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Generate mock wallets
const generateWallets = (count: number = 3): Wallet[] => {
  const wallets: Wallet[] = [];
  
  for (let i = 0; i < count; i++) {
    const blockchain = randomBlockchain();
    
    const wallet: Wallet = {
      id: `wallet-${i}-${Date.now()}`,
      address: randomAddress(),
      name: `Wallet ${i + 1}`,
      blockchain,
      balance: parseFloat((Math.random() * 50000).toFixed(2)),
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString() // Random time in the last year
    };
    
    wallets.push(wallet);
  }
  
  return wallets;
};

export const generateMockData = {
  transactions: generateTransactions,
  wallets: generateWallets
}; 