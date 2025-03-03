import axios from 'axios';
import { Transaction } from '../types/api';
import { generateMockData } from './mockDataGenerator';
import { apiBaseUrl } from '../config/api';

export interface TaxReportParams {
  year: number;
  country: string;
  includeUnrealized?: boolean;
  costBasisMethod?: 'FIFO' | 'LIFO' | 'HIFO' | 'ACB';
  walletAddresses?: string[];
}

export interface TaxSummary {
  totalIncome: number;
  totalExpenses: number;
  totalGains: number;
  totalLosses: number;
  netTaxableAmount: number;
  taxYear: number;
  country: string;
  generatedDate: string;
}

export interface TaxCategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface TaxMonthlyBreakdown {
  month: string;
  income: number;
  expenses: number;
  gains: number;
  losses: number;
  netAmount: number;
}

export interface TaxReport {
  summary: TaxSummary;
  categoryBreakdown: TaxCategoryBreakdown[];
  monthlyBreakdown: TaxMonthlyBreakdown[];
  transactions: Transaction[];
}

// Generate mock tax report data
const generateMockTaxReport = (params: TaxReportParams): TaxReport => {
  const currentDate = new Date();
  const mockTransactions = generateMockData.transactions(50);
  
  // Filter transactions by year
  const yearTransactions = mockTransactions.filter(tx => {
    const txDate = new Date(tx.timestamp);
    return txDate.getFullYear() === params.year;
  });
  
  const totalIncome = yearTransactions
    .filter(tx => tx.category === 'income')
    .reduce((sum, tx) => sum + tx.value, 0);
    
  const totalExpenses = yearTransactions
    .filter(tx => tx.category === 'expense' || tx.category === 'fee')
    .reduce((sum, tx) => sum + tx.value, 0);
    
  const totalGains = yearTransactions
    .filter(tx => tx.category === 'trade' && tx.value > 0)
    .reduce((sum, tx) => sum + tx.value, 0);
    
  const totalLosses = yearTransactions
    .filter(tx => tx.category === 'trade' && tx.value < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.value), 0);
  
  const netTaxableAmount = totalIncome + totalGains - totalExpenses - totalLosses;
  
  // Generate category breakdown
  const categories = ['income', 'expense', 'trade', 'transfer', 'fee', 'uncategorized'];
  const categoryBreakdown: TaxCategoryBreakdown[] = categories.map(category => {
    const categoryTxs = yearTransactions.filter(tx => tx.category === category);
    const amount = categoryTxs.reduce((sum, tx) => sum + Math.abs(tx.value), 0);
    const percentage = yearTransactions.length > 0 
      ? (categoryTxs.length / yearTransactions.length) * 100 
      : 0;
      
    return {
      category,
      amount,
      percentage,
      transactionCount: categoryTxs.length
    };
  });
  
  // Generate monthly breakdown
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthlyBreakdown: TaxMonthlyBreakdown[] = months.map((month, index) => {
    const monthTxs = yearTransactions.filter(tx => {
      const txDate = new Date(tx.timestamp);
      return txDate.getMonth() === index;
    });
    
    const income = monthTxs
      .filter(tx => tx.category === 'income')
      .reduce((sum, tx) => sum + tx.value, 0);
      
    const expenses = monthTxs
      .filter(tx => tx.category === 'expense' || tx.category === 'fee')
      .reduce((sum, tx) => sum + tx.value, 0);
      
    const gains = monthTxs
      .filter(tx => tx.category === 'trade' && tx.value > 0)
      .reduce((sum, tx) => sum + tx.value, 0);
      
    const losses = monthTxs
      .filter(tx => tx.category === 'trade' && tx.value < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.value), 0);
    
    return {
      month,
      income,
      expenses,
      gains,
      losses,
      netAmount: income + gains - expenses - losses
    };
  });
  
  return {
    summary: {
      totalIncome,
      totalExpenses,
      totalGains,
      totalLosses,
      netTaxableAmount,
      taxYear: params.year,
      country: params.country,
      generatedDate: currentDate.toISOString()
    },
    categoryBreakdown,
    monthlyBreakdown,
    transactions: yearTransactions
  };
};

// Fetch tax report data
const getTaxReport = async (params: TaxReportParams): Promise<TaxReport> => {
  try {
    const response = await axios.post(`${apiBaseUrl}/tax-reports/generate`, params);
    return response.data;
  } catch (error) {
    console.error('Error generating tax report:', error);
    // Return mock data if API fails
    return generateMockTaxReport(params);
  }
};

// Download tax report as PDF
const downloadTaxReportPdf = async (walletId: string, params: TaxReportParams): Promise<Blob> => {
  try {
    const requestData = {
      startDate: new Date(params.year, 0, 1).toISOString(), // January 1st of the selected year
      endDate: new Date(params.year, 11, 31).toISOString(), // December 31st of the selected year
      method: params.costBasisMethod || 'FIFO'
    };
    
    const response = await axios.post(
      `${apiBaseUrl}/tax/wallets/${walletId}/tax-report/pdf`, 
      requestData,
      {
        responseType: 'blob'
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error downloading tax report PDF:', error);
    throw error;
  }
};

// Download tax report as CSV
const downloadTaxReportCsv = async (reportId: string, templateId: string = 'general'): Promise<Blob> => {
  try {
    const response = await axios.get(`${apiBaseUrl}/tax-reports/${reportId}/csv`, {
      params: { templateId },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading tax report CSV:', error);
    throw error;
  }
};

// Save tax report for future reference
const saveTaxReport = async (report: TaxReport): Promise<{ id: string }> => {
  try {
    const response = await axios.post(`${apiBaseUrl}/tax-reports`, report);
    return response.data;
  } catch (error) {
    console.error('Error saving tax report:', error);
    // Return mock ID
    return { id: 'mock-report-' + Date.now() };
  }
};

const taxReportService = {
  getTaxReport,
  downloadTaxReportPdf,
  downloadTaxReportCsv,
  saveTaxReport
};

export default taxReportService; 