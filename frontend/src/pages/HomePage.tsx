import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Box, CircularProgress, Alert, Divider } from '@mui/material';
import dashboardService from '../services/dashboardService';
import walletService from '../services/walletService';
import { DashboardSummary } from '../types/api';
import TransactionActivityChart from '../components/Dashboard/TransactionActivityChart';
import WalletBalanceChart from '../components/Dashboard/WalletBalanceChart';
import TransactionSummaryCard from '../components/Dashboard/TransactionSummaryCard';
import TimeframeSelector from '../components/Dashboard/TimeframeSelector';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardSummary>({
    walletCount: 0,
    transactionCount: 0,
    totalValue: 0
  });
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from dashboard service first
        const summaryData = await dashboardService.getDashboardSummary();
        
        // If dashboard service returns default values, try to calculate from wallets
        if (summaryData.walletCount === 0) {
          try {
            const wallets = await walletService.getAllWallets();
            summaryData.walletCount = wallets.length;
          } catch (walletError) {
            console.error('Error fetching wallets:', walletError);
          }
        }
        
        setStats(summaryData);
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'year') => {
    setTimeframe(newTimeframe);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Welcome to TaxSeason. View your blockchain tax reporting summary.
          </Typography>
        </div>
        <TimeframeSelector value={timeframe} onChange={handleTimeframeChange} />
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Connected Wallets
            </Typography>
            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              {stats.walletCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Active wallets tracked
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Total Transactions
            </Typography>
            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              {stats.transactionCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Transactions processed
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Total Value
            </Typography>
            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              ${stats.totalValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              USD equivalent
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <TransactionSummaryCard timeframe={timeframe} />
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <TransactionActivityChart timeframe={timeframe} />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <WalletBalanceChart />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h5" sx={{ mb: 2 }}>
        Recent Activity
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        {stats.walletCount > 0 ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TransactionActivityChart timeframe="week" />
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" paragraph sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
            Connect a wallet to view your recent blockchain activity.
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default HomePage; 