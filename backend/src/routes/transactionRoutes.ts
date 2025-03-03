import express from 'express';
import {
  getWalletTransactions,
  getTransaction,
  syncWalletTransactions,
  updateTransactionCategory,
  updateTransactionNotes
} from '../controllers/transactionController';

const router = express.Router();

// Get transactions for a specific wallet
router.get('/wallets/:walletId/transactions', getWalletTransactions);

// Sync transactions for a wallet
router.post('/wallets/:walletId/transactions/sync', syncWalletTransactions);

// Get a specific transaction
router.get('/transactions/:id', getTransaction);

// Update transaction category
router.patch('/transactions/:id/category', updateTransactionCategory);

// Update transaction notes
router.patch('/transactions/:id/notes', updateTransactionNotes);

export default router; 