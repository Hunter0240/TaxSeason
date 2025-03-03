import mongoose, { Schema, Document } from 'mongoose';
import { IWallet } from './Wallet';

export interface ITransaction extends Document {
  txHash: string;
  walletId: mongoose.Types.ObjectId | IWallet;
  blockNumber: number;
  timestamp: Date;
  from: string;
  to: string;
  value: string; // Using string for large numbers
  gasUsed: string;
  gasPrice: string;
  method: string;
  status: boolean;
  asset: string;
  type: string; // 'send', 'receive', 'swap', etc.
  category: string; // For tax purposes: 'income', 'expense', 'trade', etc.
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  txHash: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  walletId: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  from: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  value: {
    type: String,
    required: true
  },
  gasUsed: {
    type: String,
    required: true
  },
  gasPrice: {
    type: String,
    required: true
  },
  method: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: true
  },
  asset: {
    type: String,
    required: true,
    default: 'ETH'
  },
  type: {
    type: String,
    enum: ['send', 'receive', 'swap', 'approval', 'contract_interaction', 'other'],
    default: 'other'
  },
  category: {
    type: String,
    enum: ['income', 'expense', 'trade', 'transfer', 'fee', 'uncategorized'],
    default: 'uncategorized'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create compound index for faster querying
TransactionSchema.index({ walletId: 1, timestamp: -1 });
TransactionSchema.index({ txHash: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema); 