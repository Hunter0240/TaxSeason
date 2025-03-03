import api from './api';

// Tax calculation methods
export enum TaxCalculationMethod {
  FIFO = 'fifo', // First In, First Out
  LIFO = 'lifo', // Last In, First Out
  HIFO = 'hifo', // Highest In, First Out
}

// Tax report interface
export interface TaxReport {
  walletId: string;
  startDate: Date;
  endDate: Date;
  method: TaxCalculationMethod;
  shortTermGains: number;
  longTermGains: number;
  totalGains: number;
  transactions: {
    trades: any[];
    gains: any[];
  };
}

/**
 * Generate a tax report for a wallet
 */
export const generateTaxReport = async (
  walletId: string,
  startDate: Date,
  endDate: Date,
  method: TaxCalculationMethod = TaxCalculationMethod.FIFO
): Promise<TaxReport> => {
  const response = await api.post(`/wallets/${walletId}/tax-report`, {
    startDate,
    endDate,
    method
  });
  return response.data;
};

/**
 * Generate and download a CSV export of a tax report
 */
export const downloadTaxReportCSV = async (
  walletId: string,
  startDate: Date,
  endDate: Date,
  method: TaxCalculationMethod = TaxCalculationMethod.FIFO
): Promise<void> => {
  try {
    // Request CSV with blob response type
    const response = await api.post(`/wallets/${walletId}/tax-report/csv`, {
      startDate,
      endDate,
      method
    }, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Create file name
    const fileName = `tax_report_${walletId}_${method}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    
    // Append to html document
    document.body.appendChild(link);
    
    // Start download
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    link.remove();
  } catch (error) {
    console.error('Error downloading tax report CSV:', error);
    throw error;
  }
};

export default {
  generateTaxReport,
  downloadTaxReportCSV,
  TaxCalculationMethod
}; 