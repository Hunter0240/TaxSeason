import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { DownloadOutlined, CalculateOutlined } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import taxService, { TaxCalculationMethod, TaxReport } from '../services/taxService';
import walletService from '../services/walletService';

const TaxReportPage: React.FC = () => {
  // State for form inputs
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getFullYear(), 0, 1)); // Jan 1st of current year
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [taxMethod, setTaxMethod] = useState<TaxCalculationMethod>(TaxCalculationMethod.FIFO);
  
  // State for wallets
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for tax report
  const [report, setReport] = useState<TaxReport | null>(null);
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Fetch wallets on component mount
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        const data = await walletService.getWallets();
        setWallets(data);
        if (data.length > 0) {
          setSelectedWallet(data[0]._id);
        }
      } catch (error) {
        setError('Failed to fetch wallets. Please try again later.');
        console.error('Error fetching wallets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  // Handle tax method change
  const handleTaxMethodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTaxMethod(event.target.value as TaxCalculationMethod);
  };

  // Handle report generation
  const handleGenerateReport = async () => {
    if (!selectedWallet || !startDate || !endDate) {
      setReportError('Please select a wallet and date range.');
      return;
    }

    try {
      setReportLoading(true);
      setReportError(null);
      const result = await taxService.generateTaxReport(
        selectedWallet,
        startDate,
        endDate,
        taxMethod
      );
      setReport(result);
    } catch (error) {
      setReportError('Failed to generate tax report. Please try again later.');
      console.error('Error generating tax report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  // Handle CSV download
  const handleDownloadCSV = async () => {
    if (!selectedWallet || !startDate || !endDate) {
      setReportError('Please select a wallet and date range.');
      return;
    }

    try {
      setReportLoading(true);
      await taxService.downloadTaxReportCSV(
        selectedWallet,
        startDate,
        endDate,
        taxMethod
      );
    } catch (error) {
      setReportError('Failed to download CSV. Please try again later.');
      console.error('Error downloading CSV:', error);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tax Report
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Generate and download tax reports based on your blockchain activity.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Report Settings
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="wallet-select-label">Wallet</InputLabel>
                  <Select
                    labelId="wallet-select-label"
                    value={selectedWallet}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                    label="Wallet"
                    disabled={loading || wallets.length === 0}
                  >
                    {wallets.map((wallet) => (
                      <MenuItem key={wallet._id} value={wallet._id}>
                        {wallet.label} ({wallet.address.substring(0, 6)}...{wallet.address.substring(38)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="tax-method-select-label">Tax Calculation Method</InputLabel>
                  <Select
                    labelId="tax-method-select-label"
                    value={taxMethod}
                    onChange={(e) => setTaxMethod(e.target.value as TaxCalculationMethod)}
                    label="Tax Calculation Method"
                  >
                    <MenuItem value={TaxCalculationMethod.FIFO}>FIFO (First In, First Out)</MenuItem>
                    <MenuItem value={TaxCalculationMethod.LIFO}>LIFO (Last In, First Out)</MenuItem>
                    <MenuItem value={TaxCalculationMethod.HIFO}>HIFO (Highest In, First Out)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            
            {reportError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {reportError}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CalculateOutlined />}
                onClick={handleGenerateReport}
                disabled={reportLoading || loading || !selectedWallet || !startDate || !endDate}
              >
                {reportLoading ? <CircularProgress size={24} /> : 'Generate Report'}
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DownloadOutlined />}
                onClick={handleDownloadCSV}
                disabled={reportLoading || loading || !selectedWallet || !startDate || !endDate}
              >
                Download CSV
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {report && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Tax Report Results
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="textSecondary">Short-Term Gains</Typography>
                      <Typography variant="h4" color={report.shortTermGains >= 0 ? 'success.main' : 'error.main'}>
                        ${report.shortTermGains.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="textSecondary">Long-Term Gains</Typography>
                      <Typography variant="h4" color={report.longTermGains >= 0 ? 'success.main' : 'error.main'}>
                        ${report.longTermGains.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="textSecondary">Total Gains</Typography>
                      <Typography variant="h4" color={report.totalGains >= 0 ? 'success.main' : 'error.main'}>
                        ${report.totalGains.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Capital Gains/Losses
                </Typography>
                
                {report.transactions.gains.length > 0 ? (
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Date Sold</th>
                          <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Date Acquired</th>
                          <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Asset</th>
                          <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Amount</th>
                          <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Sale Value</th>
                          <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Cost Basis</th>
                          <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Gain/Loss</th>
                          <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>Long Term</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.transactions.gains.map((gain, index) => (
                          <tr key={index}>
                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                              {new Date(gain.timestamp).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                              {new Date(gain.acquiredAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{gain.asset}</td>
                            <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>
                              {gain.soldAmount.toFixed(8)}
                            </td>
                            <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>
                              ${gain.soldValue.toFixed(2)}
                            </td>
                            <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>
                              ${gain.costBasis.toFixed(2)}
                            </td>
                            <td style={{ 
                              textAlign: 'right', 
                              padding: '8px', 
                              borderBottom: '1px solid #ddd',
                              color: gain.gainLoss >= 0 ? 'green' : 'red'
                            }}>
                              ${gain.gainLoss.toFixed(2)}
                            </td>
                            <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                              {gain.isLongTerm ? 'Yes' : 'No'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    No capital gains or losses found for the selected period.
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadOutlined />}
                  onClick={handleDownloadCSV}
                  disabled={reportLoading}
                >
                  Download CSV Report
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default TaxReportPage; 