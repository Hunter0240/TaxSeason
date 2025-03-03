import { Request, Response } from 'express';
import TransactionService from '../services/TransactionService';
import mongoose from 'mongoose';

/**
 * Get transactions for a specific wallet
 */
export const getWalletTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    // Parse filters from query parameters
    const filters: any = {};
    
    if (req.query.type) {
      filters.type = (req.query.type as string).split(',');
    }
    
    if (req.query.category) {
      filters.category = (req.query.category as string).split(',');
    }
    
    if (req.query.startDate) {
      filters.startDate = req.query.startDate;
    }
    
    if (req.query.endDate) {
      filters.endDate = req.query.endDate;
    }
    
    if (req.query.asset) {
      filters.asset = req.query.asset;
    }

    // Validate wallet ID
    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      res.status(400).json({ error: 'Invalid wallet ID format' });
      return;
    }

    const result = await TransactionService.getTransactionsForWallet(
      walletId,
      page,
      limit,
      filters
    );

    res.status(200).json({
      transactions: result.transactions,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

/**
 * Get a specific transaction by ID
 */
export const getTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate transaction ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid transaction ID format' });
      return;
    }

    const transaction = await TransactionService.getTransactionById(id);

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

/**
 * Sync transactions for a wallet from the blockchain
 */
export const syncWalletTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletId } = req.params;

    // Validate wallet ID
    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      res.status(400).json({ error: 'Invalid wallet ID format' });
      return;
    }

    const result = await TransactionService.syncTransactions(walletId);

    res.status(200).json({
      message: 'Wallet transactions synchronized successfully',
      added: result.added,
      updated: result.updated
    });
  } catch (error) {
    console.error('Error syncing wallet transactions:', error);
    res.status(500).json({ error: 'Failed to sync transactions' });
  }
};

/**
 * Update transaction category
 */
export const updateTransactionCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    // Validate transaction ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid transaction ID format' });
      return;
    }

    // Validate category
    const validCategories = ['income', 'expense', 'trade', 'transfer', 'fee', 'uncategorized'];
    if (!validCategories.includes(category)) {
      res.status(400).json({ 
        error: 'Invalid category',
        validCategories
      });
      return;
    }

    const updatedTransaction = await TransactionService.updateTransactionCategory(id, category);

    if (!updatedTransaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction category:', error);
    res.status(500).json({ error: 'Failed to update transaction category' });
  }
};

/**
 * Update transaction notes
 */
export const updateTransactionNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    // Validate transaction ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid transaction ID format' });
      return;
    }

    const updatedTransaction = await TransactionService.updateTransactionNotes(id, notes);

    if (!updatedTransaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction notes:', error);
    res.status(500).json({ error: 'Failed to update transaction notes' });
  }
}; 