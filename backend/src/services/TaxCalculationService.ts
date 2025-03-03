import Transaction, { ITransaction } from '../models/Transaction';
import { Types } from 'mongoose';

// Define tax calculation methods
export enum TaxCalculationMethod {
  FIFO = 'fifo', // First In, First Out
  LIFO = 'lifo', // Last In, First Out
  HIFO = 'hifo', // Highest In, First Out
}

// Define a trade for tax calculations
interface Trade {
  txHash: string;
  timestamp: Date;
  asset: string;
  amount: number;
  value: number;
  costBasis: number;
}

// Define a capital gain/loss result
interface CapitalGain {
  txHash: string;
  timestamp: Date;
  asset: string;
  acquiredAt: Date;
  acquiredTxHash: string;
  soldAmount: number;
  soldValue: number;
  costBasis: number;
  gainLoss: number;
  isLongTerm: boolean;
}

// Define the tax report structure
export interface TaxReport {
  walletId: string;
  startDate: Date;
  endDate: Date;
  method: TaxCalculationMethod;
  shortTermGains: number;
  longTermGains: number;
  totalGains: number;
  transactions: {
    trades: Trade[];
    gains: CapitalGain[];
  };
}

class TaxCalculationService {
  /**
   * Generate a tax report for a wallet using the specified method
   */
  async generateTaxReport(
    walletId: string,
    startDate: Date,
    endDate: Date,
    method: TaxCalculationMethod = TaxCalculationMethod.FIFO
  ): Promise<TaxReport> {
    // Fetch all transactions for the wallet within the date range
    const transactions = await Transaction.find({
      walletId: new Types.ObjectId(walletId),
      timestamp: { $gte: startDate, $lte: endDate },
    }).sort({ timestamp: 1 }).exec();

    // Group transactions by asset
    const assetTransactions: { [asset: string]: ITransaction[] } = {};
    
    transactions.forEach(tx => {
      if (!assetTransactions[tx.asset]) {
        assetTransactions[tx.asset] = [];
      }
      assetTransactions[tx.asset].push(tx);
    });

    // Initialize report
    const report: TaxReport = {
      walletId,
      startDate,
      endDate,
      method,
      shortTermGains: 0,
      longTermGains: 0,
      totalGains: 0,
      transactions: {
        trades: [],
        gains: []
      }
    };

    // Process each asset
    for (const asset in assetTransactions) {
      const txs = assetTransactions[asset];
      const trades: Trade[] = [];
      const assetGains: CapitalGain[] = [];

      // Convert transactions to trades
      txs.forEach(tx => {
        // Parse values from strings to numbers
        const amount = parseFloat(tx.value) / 1e18; // Convert wei to ETH for simplicity

        // Could be more sophisticated with price API integration
        // For simplicity, we're just using a mock value
        const mockPriceUSD = 3000; // Mock ETH price in USD
        const value = amount * mockPriceUSD;

        const trade: Trade = {
          txHash: tx.txHash,
          timestamp: tx.timestamp,
          asset: tx.asset,
          amount: tx.type === 'receive' ? amount : -amount, // Positive for buys, negative for sells
          value,
          costBasis: value / amount
        };

        trades.push(trade);
        report.transactions.trades.push(trade);
      });

      // Calculate gains based on the selected method
      const gains = this.calculateGains(trades, method);
      
      // Add gains to the report
      gains.forEach(gain => {
        if (gain.isLongTerm) {
          report.longTermGains += gain.gainLoss;
        } else {
          report.shortTermGains += gain.gainLoss;
        }
        report.totalGains += gain.gainLoss;
        report.transactions.gains.push(gain);
      });
    }

    return report;
  }

  /**
   * Calculate gains based on the specified method
   */
  private calculateGains(trades: Trade[], method: TaxCalculationMethod): CapitalGain[] {
    // Sort trades by timestamp
    const sortedTrades = [...trades].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Split into buys and sells
    const buys: Trade[] = sortedTrades.filter(trade => trade.amount > 0);
    const sells: Trade[] = sortedTrades.filter(trade => trade.amount < 0);
    
    // Initialize gains array
    const gains: CapitalGain[] = [];
    
    // Process each sell
    sells.forEach(sell => {
      let remainingAmount = Math.abs(sell.amount);
      
      // Sort buys based on the selected method
      let sortedBuys: Trade[] = [];
      
      switch (method) {
        case TaxCalculationMethod.FIFO:
          // First In, First Out - oldest buys first
          sortedBuys = [...buys].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          break;
        
        case TaxCalculationMethod.LIFO:
          // Last In, First Out - newest buys first
          sortedBuys = [...buys].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          break;
        
        case TaxCalculationMethod.HIFO:
          // Highest In, First Out - highest cost basis first
          sortedBuys = [...buys].sort((a, b) => b.costBasis - a.costBasis);
          break;
      }
      
      // Match sell against buys
      for (let i = 0; i < sortedBuys.length && remainingAmount > 0; i++) {
        const buy = sortedBuys[i];
        
        // Skip if buy has been fully used
        if (buy.amount <= 0) continue;
        
        // Calculate amount to use from this buy
        const useAmount = Math.min(remainingAmount, buy.amount);
        
        // Calculate cost basis for this portion
        const costBasis = useAmount * buy.costBasis;
        
        // Calculate sale value for this portion
        const saleValue = useAmount * Math.abs(sell.value / sell.amount);
        
        // Calculate gain/loss
        const gainLoss = saleValue - costBasis;
        
        // Check if long term (held for more than a year)
        const isLongTerm = sell.timestamp.getTime() - buy.timestamp.getTime() > 365 * 24 * 60 * 60 * 1000;
        
        // Add to gains
        gains.push({
          txHash: sell.txHash,
          timestamp: sell.timestamp,
          asset: sell.asset,
          acquiredAt: buy.timestamp,
          acquiredTxHash: buy.txHash,
          soldAmount: useAmount,
          soldValue: saleValue,
          costBasis: costBasis,
          gainLoss: gainLoss,
          isLongTerm: isLongTerm
        });
        
        // Update remaining amounts
        remainingAmount -= useAmount;
        buy.amount -= useAmount;
      }
    });
    
    return gains;
  }

  /**
   * Generate a CSV export of the tax report
   */
  generateCSV(taxReport: TaxReport): string {
    // Initialize CSV string with headers
    let csv = 'Date Sold,Date Acquired,Asset,Amount,Sale Value (USD),Cost Basis (USD),Gain/Loss (USD),Long Term\n';
    
    // Sort gains by date sold
    const sortedGains = [...taxReport.transactions.gains].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    // Add each gain as a row in the CSV
    sortedGains.forEach(gain => {
      const dateSold = gain.timestamp.toISOString().split('T')[0];
      const dateAcquired = gain.acquiredAt.toISOString().split('T')[0];
      const isLongTerm = gain.isLongTerm ? 'Yes' : 'No';
      
      csv += `${dateSold},${dateAcquired},${gain.asset},${gain.soldAmount.toFixed(8)},${gain.soldValue.toFixed(2)},${gain.costBasis.toFixed(2)},${gain.gainLoss.toFixed(2)},${isLongTerm}\n`;
    });
    
    return csv;
  }
}

export default new TaxCalculationService(); 