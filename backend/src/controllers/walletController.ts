import { Request, Response } from 'express';
import Wallet, { IWallet } from '../models/Wallet';
import GraphQLService from '../services/GraphQLService';

/**
 * Controller for wallet-related operations
 */
export const walletController = {
  /**
   * Get all wallets
   * @param req Express request
   * @param res Express response
   */
  getWallets: async (req: Request, res: Response) => {
    try {
      const wallets = await Wallet.find();
      res.status(200).json(wallets);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      res.status(500).json({ message: 'Error fetching wallets', error });
    }
  },

  /**
   * Get a specific wallet by ID
   * @param req Express request
   * @param res Express response
   */
  getWalletById: async (req: Request, res: Response) => {
    try {
      const wallet = await Wallet.findById(req.params.id);
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      res.status(200).json(wallet);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      res.status(500).json({ message: 'Error fetching wallet', error });
    }
  },

  /**
   * Add a new wallet
   * @param req Express request
   * @param res Express response
   */
  addWallet: async (req: Request, res: Response) => {
    try {
      const { address, label, network } = req.body;
      
      // Validate input
      if (!address || !label) {
        return res.status(400).json({ message: 'Address and label are required' });
      }
      
      // Check if wallet already exists
      const existingWallet = await Wallet.findOne({ address: address.toLowerCase() });
      if (existingWallet) {
        return res.status(400).json({ message: 'Wallet already exists' });
      }
      
      // Create new wallet
      const wallet = new Wallet({
        address: address.toLowerCase(),
        label,
        network: network || 'arbitrum-one'
      });
      
      const savedWallet = await wallet.save();
      res.status(201).json(savedWallet);
    } catch (error) {
      console.error('Error adding wallet:', error);
      res.status(500).json({ message: 'Error adding wallet', error });
    }
  },

  /**
   * Update a wallet
   * @param req Express request
   * @param res Express response
   */
  updateWallet: async (req: Request, res: Response) => {
    try {
      const { label, network } = req.body;
      
      const updatedWallet = await Wallet.findByIdAndUpdate(
        req.params.id,
        { label, network },
        { new: true }
      );
      
      if (!updatedWallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      
      res.status(200).json(updatedWallet);
    } catch (error) {
      console.error('Error updating wallet:', error);
      res.status(500).json({ message: 'Error updating wallet', error });
    }
  },

  /**
   * Delete a wallet
   * @param req Express request
   * @param res Express response
   */
  deleteWallet: async (req: Request, res: Response) => {
    try {
      const deletedWallet = await Wallet.findByIdAndDelete(req.params.id);
      
      if (!deletedWallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      
      res.status(200).json({ message: 'Wallet deleted successfully' });
    } catch (error) {
      console.error('Error deleting wallet:', error);
      res.status(500).json({ message: 'Error deleting wallet', error });
    }
  },

  /**
   * Get transactions for a specific wallet
   * @param req Express request
   * @param res Express response
   */
  getWalletTransactions: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { limit = 100, skip = 0 } = req.query;
      
      // Find wallet
      const wallet = await Wallet.findById(id);
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      
      // Fetch transactions from The Graph
      const transactions = await GraphQLService.getWalletTransactions(
        wallet.address,
        Number(limit),
        Number(skip)
      );
      
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      res.status(500).json({ message: 'Error fetching wallet transactions', error });
    }
  }
};

export default walletController; 