import { Request, Response } from 'express';
import mongoose from 'mongoose';
import TaxCalculationService, { TaxCalculationMethod } from '../services/TaxCalculationService';

/**
 * Generate a tax report for a wallet
 */
export const generateTaxReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletId } = req.params;
    const { startDate, endDate, method = TaxCalculationMethod.FIFO } = req.body;
    
    // Validate wallet ID
    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      res.status(400).json({ error: 'Invalid wallet ID format' });
      return;
    }
    
    // Validate dates
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Start date and end date are required' });
      return;
    }
    
    // Validate method
    if (!Object.values(TaxCalculationMethod).includes(method as TaxCalculationMethod)) {
      res.status(400).json({
        error: 'Invalid tax calculation method',
        validMethods: Object.values(TaxCalculationMethod)
      });
      return;
    }
    
    // Generate the tax report
    const report = await TaxCalculationService.generateTaxReport(
      walletId,
      new Date(startDate),
      new Date(endDate),
      method as TaxCalculationMethod
    );
    
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating tax report:', error);
    res.status(500).json({ error: 'Failed to generate tax report' });
  }
};

/**
 * Generate a CSV export of a tax report
 */
export const generateTaxReportCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletId } = req.params;
    const { startDate, endDate, method = TaxCalculationMethod.FIFO } = req.body;
    
    // Validate wallet ID
    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      res.status(400).json({ error: 'Invalid wallet ID format' });
      return;
    }
    
    // Validate dates
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Start date and end date are required' });
      return;
    }
    
    // Validate method
    if (!Object.values(TaxCalculationMethod).includes(method as TaxCalculationMethod)) {
      res.status(400).json({
        error: 'Invalid tax calculation method',
        validMethods: Object.values(TaxCalculationMethod)
      });
      return;
    }
    
    // Generate the tax report
    const report = await TaxCalculationService.generateTaxReport(
      walletId,
      new Date(startDate),
      new Date(endDate),
      method as TaxCalculationMethod
    );
    
    // Generate CSV
    const csv = TaxCalculationService.generateCSV(report);
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename=tax_report_${walletId}_${method}_${new Date().toISOString().split('T')[0]}.csv`
    );
    
    // Send CSV
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error generating tax report CSV:', error);
    res.status(500).json({ error: 'Failed to generate tax report CSV' });
  }
}; 