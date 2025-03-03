import express from 'express';
import walletController from '../controllers/walletController';

const router = express.Router();

// GET all wallets
router.get('/', walletController.getWallets);

// GET specific wallet by ID
router.get('/:id', walletController.getWalletById);

// POST new wallet
router.post('/', walletController.addWallet);

// PUT update wallet
router.put('/:id', walletController.updateWallet);

// DELETE wallet
router.delete('/:id', walletController.deleteWallet);

// GET wallet transactions
router.get('/:id/transactions', walletController.getWalletTransactions);

export default router; 