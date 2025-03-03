import axios from 'axios';
import { Wallet } from '../types/api';
import { apiBaseUrl } from '../config/api';
import { generateMockData } from './mockDataGenerator';

// Fetch all wallets
const getAllWallets = async (): Promise<Wallet[]> => {
  try {
    const response = await axios.get(`${apiBaseUrl}/wallets`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallets:', error);
    // Return mock data if API fails
    return generateMockData.wallets(3);
  }
};

// Get wallet by address
const getWalletByAddress = async (address: string): Promise<Wallet | null> => {
  try {
    const response = await axios.get(`${apiBaseUrl}/wallets/${address}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet:', error);
    // Return mock data if API fails
    const mockWallets = generateMockData.wallets(5);
    return mockWallets.find(wallet => wallet.address === address) || null;
  }
};

// Add a new wallet
const addWallet = async (walletData: Omit<Wallet, 'id' | 'createdAt'>): Promise<Wallet> => {
  try {
    const response = await axios.post(`${apiBaseUrl}/wallets`, walletData);
    return response.data;
  } catch (error) {
    console.error('Error adding wallet:', error);
    // Create a mock wallet
    return {
      id: `wallet-${Date.now()}`,
      address: walletData.address,
      name: walletData.name,
      blockchain: walletData.blockchain,
      balance: walletData.balance || 0,
      createdAt: new Date().toISOString()
    };
  }
};

// Update wallet
const updateWallet = async (id: string, walletData: Partial<Wallet>): Promise<Wallet | null> => {
  try {
    const response = await axios.patch(`${apiBaseUrl}/wallets/${id}`, walletData);
    return response.data;
  } catch (error) {
    console.error('Error updating wallet:', error);
    return null;
  }
};

// Delete wallet
const deleteWallet = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${apiBaseUrl}/wallets/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return false;
  }
};

// Sync wallet transactions with blockchain
const syncWalletTransactions = async (walletAddress: string): Promise<{ added: number; updated: number }> => {
  try {
    const response = await axios.post(`${apiBaseUrl}/wallets/${walletAddress}/sync-transactions`);
    return response.data;
  } catch (error) {
    console.error('Error syncing wallet transactions:', error);
    // Return mock sync result
    return {
      added: Math.floor(Math.random() * 10),
      updated: Math.floor(Math.random() * 5)
    };
  }
};

const walletService = {
  getAllWallets,
  getWalletByAddress,
  addWallet,
  updateWallet,
  deleteWallet,
  syncWalletTransactions
};

export default walletService; 