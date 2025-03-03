import Transaction, { ITransaction } from '../models/Transaction';
import Wallet, { IWallet } from '../models/Wallet';
import GraphQLService from './GraphQLService';
import mongoose from 'mongoose';

class TransactionService {
  private graphQLService: GraphQLService;

  constructor() {
    this.graphQLService = new GraphQLService();
  }

  /**
   * Fetches transactions for a specific wallet from the database
   */
  async getTransactionsForWallet(
    walletId: string,
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ): Promise<{ transactions: ITransaction[]; total: number }> {
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const query: any = { walletId: new mongoose.Types.ObjectId(walletId) };
    
    if (filters.type && filters.type.length > 0) {
      query.type = { $in: filters.type };
    }
    
    if (filters.category && filters.category.length > 0) {
      query.category = { $in: filters.category };
    }
    
    if (filters.startDate && filters.endDate) {
      query.timestamp = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }
    
    if (filters.asset) {
      query.asset = filters.asset;
    }

    // Execute query with pagination
    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
      
    const total = await Transaction.countDocuments(query);
    
    return { transactions, total };
  }

  /**
   * Fetches a single transaction by ID
   */
  async getTransactionById(id: string): Promise<ITransaction | null> {
    return Transaction.findById(id).exec();
  }

  /**
   * Fetches a transaction by transaction hash
   */
  async getTransactionByHash(txHash: string): Promise<ITransaction | null> {
    return Transaction.findOne({ txHash }).exec();
  }

  /**
   * Syncs transactions for a wallet from the blockchain
   */
  async syncTransactions(walletId: string): Promise<{ added: number; updated: number }> {
    // Get wallet from database
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Fetch transactions from The Graph
    const transactions = await this.graphQLService.fetchTransactions(wallet.address);
    
    let added = 0;
    let updated = 0;
    
    // Process each transaction
    for (const tx of transactions) {
      const existingTx = await this.getTransactionByHash(tx.id);
      
      if (!existingTx) {
        // Determine transaction type
        const type = this.determineTransactionType(tx, wallet.address);
        
        // Create new transaction record
        await Transaction.create({
          txHash: tx.id,
          walletId: wallet._id,
          blockNumber: parseInt(tx.blockNumber),
          timestamp: new Date(parseInt(tx.timestamp) * 1000),
          from: tx.from.id,
          to: tx.to ? tx.to.id : '',
          value: tx.value,
          gasUsed: tx.gasUsed,
          gasPrice: tx.gasPrice,
          method: tx.methodId || '',
          status: true,
          asset: 'ETH', // Default to ETH, can be updated for token transfers
          type,
          category: 'uncategorized'
        });
        
        added++;
      } else {
        // Update existing transaction if needed
        // This could be for updating status or other fields that might change
        updated++;
      }
    }
    
    // Update wallet's lastSync timestamp
    await Wallet.findByIdAndUpdate(walletId, { lastSync: new Date() });
    
    return { added, updated };
  }

  /**
   * Updates the category of a transaction
   */
  async updateTransactionCategory(
    id: string,
    category: string
  ): Promise<ITransaction | null> {
    return Transaction.findByIdAndUpdate(
      id,
      { category },
      { new: true }
    ).exec();
  }

  /**
   * Updates the notes of a transaction
   */
  async updateTransactionNotes(
    id: string,
    notes: string
  ): Promise<ITransaction | null> {
    return Transaction.findByIdAndUpdate(
      id,
      { notes },
      { new: true }
    ).exec();
  }

  /**
   * Determines the transaction type based on the data
   */
  private determineTransactionType(
    tx: any,
    walletAddress: string
  ): string {
    const address = walletAddress.toLowerCase();
    
    // If the transaction is from the wallet, it's a send
    if (tx.from.id.toLowerCase() === address) {
      return 'send';
    }
    
    // If the transaction is to the wallet, it's a receive
    if (tx.to && tx.to.id.toLowerCase() === address) {
      return 'receive';
    }
    
    // Could be expanded to detect swaps, approvals, etc. based on method signature
    if (tx.methodId === '0x095ea7b3') {
      return 'approval';
    }
    
    return 'other';
  }
}

export default new TransactionService(); 