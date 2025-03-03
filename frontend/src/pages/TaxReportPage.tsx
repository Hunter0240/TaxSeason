import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import taxReportService, {
  TaxReportParams,
  TaxReport,
  TaxSummary,
  TaxCategoryBreakdown,
  TaxMonthlyBreakdown
} from '../services/taxReportService';
import walletService from '../services/walletService';
import { Wallet } from '../types/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Tab panel component for the tabbed interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tax-report-tabpanel-${index}`}
      aria-labelledby={`tax-report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Helper function for the tabs
const a11yProps = (index: number) => {
  return {
    id: `tax-report-tab-${index}`,
    'aria-controls': `tax-report-tabpanel-${index}`,
  };
};

// Color palette for charts
const COLORS = ['#00A389', '#FF4842', '#7635dc', '#2196F3', '#FFC107', '#919EAB'];

const TaxReportPage: React.FC = () => {
  // State for report params
  const [reportParams, setReportParams] = useState<TaxReportParams>({
    year: new Date().getFullYear(),
    country: 'United States',
    includeUnrealized: false,
    costBasisMethod: 'FIFO',
    walletAddresses: []
  });

  // State for the tax report
  const [taxReport, setTaxReport] = useState<TaxReport | null>(null);
  
  // State for the wallets
  const [wallets, setWallets] = useState<Wallet[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingWallets, setLoadingWallets] = useState(true);
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Transaction pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch wallets on component mount
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoadingWallets(true);
        const fetchedWallets = await walletService.getAllWallets();
        setWallets(fetchedWallets);
        
        // Set all wallet addresses by default
        setReportParams(prev => ({
          ...prev,
          walletAddresses: fetchedWallets.map(wallet => wallet.address)
        }));
      } catch (error) {
        console.error('Error fetching wallets:', error);
        setError('Failed to load wallets. Using sample data instead.');
      } finally {
        setLoadingWallets(false);
      }
    };

    fetchWallets();
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle input changes for the report parameters
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setReportParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle select changes for the report parameters
  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setReportParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle wallet selection
  const handleWalletSelection = (walletAddress: string) => {
    setReportParams(prev => {
      const walletAddresses = [...(prev.walletAddresses || [])];
      
      if (walletAddresses.includes(walletAddress)) {
        return {
          ...prev,
          walletAddresses: walletAddresses.filter(addr => addr !== walletAddress)
        };
      } else {
        return {
          ...prev,
          walletAddresses: [...walletAddresses, walletAddress]
        };
      }
    });
  };

  // Handle select all wallets
  const handleSelectAllWallets = (select: boolean) => {
    setReportParams(prev => ({
      ...prev,
      walletAddresses: select ? wallets.map(wallet => wallet.address) : []
    }));
  };

  // Generate tax report
  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const report = await taxReportService.getTaxReport(reportParams);
      setTaxReport(report);
      
      // Switch to the summary tab after generating the report
      setTabValue(0);
      
      setSuccessMessage('Tax report generated successfully.');
    } catch (error) {
      console.error('Error generating tax report:', error);
      setError('Failed to generate tax report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Save tax report
  const handleSaveReport = async () => {
    if (!taxReport) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const result = await taxReportService.saveTaxReport(taxReport);
      
      if (result.id) {
        setSuccessMessage(`Tax report saved successfully with ID: ${result.id}`);
      }
    } catch (error) {
      console.error('Error saving tax report:', error);
      setError('Failed to save tax report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Download tax report as PDF
  const handleDownloadPdf = async () => {
    if (!taxReport) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock ID for now since we don't have a real report ID
      const pdfBlob = await taxReportService.downloadTaxReportPdf('mock-report-id');
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax-report-${reportParams.year}-${reportParams.country}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Download tax report as CSV
  const handleDownloadCsv = async () => {
    if (!taxReport) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock ID for now since we don't have a real report ID
      const csvBlob = await taxReportService.downloadTaxReportCsv('mock-report-id');
      
      // Create a download link
      const url = window.URL.createObjectURL(csvBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax-report-${reportParams.year}-${reportParams.country}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setError('Failed to download CSV. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format currency for display
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tax Report
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Generate tax reports for your cryptocurrency transactions.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Report Parameters */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Report Parameters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Tax Year"
              type="number"
              name="year"
              value={reportParams.year}
              onChange={handleInputChange}
              inputProps={{ min: 2010, max: new Date().getFullYear() }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                name="country"
                value={reportParams.country}
                label="Country"
                onChange={handleSelectChange as any}
              >
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                <MenuItem value="Australia">Australia</MenuItem>
                <MenuItem value="Germany">Germany</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Cost Basis Method</InputLabel>
              <Select
                name="costBasisMethod"
                value={reportParams.costBasisMethod}
                label="Cost Basis Method"
                onChange={handleSelectChange as any}
              >
                <MenuItem value="FIFO">FIFO (First In, First Out)</MenuItem>
                <MenuItem value="LIFO">LIFO (Last In, First Out)</MenuItem>
                <MenuItem value="HIFO">HIFO (Highest In, First Out)</MenuItem>
                <MenuItem value="ACB">ACB (Average Cost Basis)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="includeUnrealized"
                  checked={reportParams.includeUnrealized}
                  onChange={handleInputChange}
                />
              }
              label="Include Unrealized Gains/Losses"
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
          Wallets
        </Typography>
        
        {loadingWallets ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography variant="body2">Loading wallets...</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => handleSelectAllWallets(true)}
                sx={{ mr: 1 }}
              >
                Select All
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => handleSelectAllWallets(false)}
              >
                Clear All
              </Button>
            </Box>
            <Grid container spacing={2}>
              {wallets.map(wallet => (
                <Grid item xs={12} sm={6} md={4} key={wallet.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={(reportParams.walletAddresses || []).includes(wallet.address)}
                        onChange={() => handleWalletSelection(wallet.address)}
                      />
                    }
                    label={`${wallet.name} (${wallet.blockchain})`}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateReport}
            disabled={loading || (reportParams.walletAddresses || []).length === 0}
            startIcon={loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          >
            Generate Report
          </Button>
        </Box>
      </Paper>

      {/* Tax Report Results */}
      {taxReport && (
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="tax report tabs">
              <Tab label="Summary" {...a11yProps(0)} />
              <Tab label="Breakdown by Category" {...a11yProps(1)} />
              <Tab label="Monthly Analysis" {...a11yProps(2)} />
              <Tab label="Transactions" {...a11yProps(3)} />
            </Tabs>
          </Box>

          {/* Report Actions */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #eee' }}>
            <Tooltip title="Download as PDF">
              <IconButton onClick={handleDownloadPdf} disabled={loading}>
                <PdfIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download as CSV">
              <IconButton onClick={handleDownloadCsv} disabled={loading}>
                <CsvIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Report">
              <IconButton onClick={handleSaveReport} disabled={loading}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Summary Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tax Summary
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Generated on {format(new Date(taxReport.summary.generatedDate), 'PPpp')}
                    </Typography>
                    
                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Tax Year
                          </Typography>
                          <Typography variant="body1">
                            {taxReport.summary.taxYear}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Country
                          </Typography>
                          <Typography variant="body1">
                            {taxReport.summary.country}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Total Income
                          </Typography>
                          <Typography variant="body1" color="#00A389">
                            {formatCurrency(taxReport.summary.totalIncome)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Total Expenses
                          </Typography>
                          <Typography variant="body1" color="#FF4842">
                            {formatCurrency(taxReport.summary.totalExpenses)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Total Gains
                          </Typography>
                          <Typography variant="body1" color="#00A389">
                            {formatCurrency(taxReport.summary.totalGains)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Total Losses
                          </Typography>
                          <Typography variant="body1" color="#FF4842">
                            {formatCurrency(taxReport.summary.totalLosses)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            Net Taxable Amount
                          </Typography>
                          <Typography 
                            variant="h5" 
                            color={taxReport.summary.netTaxableAmount >= 0 ? '#00A389' : '#FF4842'}
                          >
                            {formatCurrency(taxReport.summary.netTaxableAmount)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Category Distribution
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={taxReport.categoryBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="amount"
                            nameKey="category"
                            label={({ category, percentage }) => `${category}: ${percentage.toFixed(0)}%`}
                          >
                            {taxReport.categoryBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Breakdown by Category Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Transaction Volume by Category
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taxReport.categoryBreakdown}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      name="Amount"
                      fill="#8884d8"
                    >
                      {taxReport.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Category Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell align="right">Transaction Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxReport.categoryBreakdown.map((category) => (
                    <TableRow key={category.category}>
                      <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
                        {category.category}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(category.amount)}</TableCell>
                      <TableCell align="right">{category.percentage.toFixed(2)}%</TableCell>
                      <TableCell align="right">{category.transactionCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Monthly Analysis Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Net Amount
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taxReport.monthlyBreakdown}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar
                      dataKey="netAmount"
                      name="Net Amount"
                      fill="#8884d8"
                    >
                      {taxReport.monthlyBreakdown.map((entry) => (
                        <Cell 
                          key={`cell-${entry.month}`} 
                          fill={entry.netAmount >= 0 ? '#00A389' : '#FF4842'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Monthly Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Income</TableCell>
                    <TableCell align="right">Expenses</TableCell>
                    <TableCell align="right">Gains</TableCell>
                    <TableCell align="right">Losses</TableCell>
                    <TableCell align="right">Net Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxReport.monthlyBreakdown.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell component="th" scope="row">
                        {month.month}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(month.income)}</TableCell>
                      <TableCell align="right">{formatCurrency(month.expenses)}</TableCell>
                      <TableCell align="right">{formatCurrency(month.gains)}</TableCell>
                      <TableCell align="right">{formatCurrency(month.losses)}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ color: month.netAmount >= 0 ? '#00A389' : '#FF4842' }}
                      >
                        {formatCurrency(month.netAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Transactions Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Included Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxReport.transactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.timestamp), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {transaction.type}
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {transaction.category || 'uncategorized'}
                        </TableCell>
                        <TableCell>
                          {transaction.notes || 
                            `${transaction.type === 'send' ? 'To: ' : 'From: '}${
                              transaction.type === 'send' 
                                ? transaction.to.substring(0, 8) + '...' 
                                : transaction.from.substring(0, 8) + '...'
                            }`
                          }
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(transaction.value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  
                  {taxReport.transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No transactions found for the selected period and wallets.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={taxReport.transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TabPanel>
        </Paper>
      )}
    </div>
  );
};

export default TaxReportPage; 