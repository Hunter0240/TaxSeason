import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  address: string;
  label: string;
  network: string;
  createdAt: Date;
  updatedAt: Date;
  lastSync?: Date;
}

const WalletSchema: Schema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  network: {
    type: String,
    required: true,
    default: 'arbitrum-one',
    enum: ['arbitrum-one'] // Can be expanded for other networks later
  },
  lastSync: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<IWallet>('Wallet', WalletSchema); 