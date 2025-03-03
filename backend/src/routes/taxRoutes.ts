import express from 'express';
import { generateTaxReport, generateTaxReportCSV } from '../controllers/taxController';

const router = express.Router();

// Generate a tax report for a wallet
router.post('/wallets/:walletId/tax-report', generateTaxReport);

// Generate a CSV export of a tax report
router.post('/wallets/:walletId/tax-report/csv', generateTaxReportCSV);

export default router; 