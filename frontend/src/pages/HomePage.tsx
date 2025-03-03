import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Box, CircularProgress, Alert } from '@mui/material';
import dashboardService from '../services/dashboardService';
import walletService from '../services/walletService';
import { DashboardSummary } from '../types/api';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardSummary>({
    walletCount: 0,
    transactionCount: 0,
    totalValue: 0
  });

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Welcome to TaxSeason. View your blockchain tax reporting summary.
      </Typography>
      
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
      
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
              {stats.walletCount > 0 
                ? 'Loading recent transactions...' 
                : 'Connect a wallet to view your recent blockchain activity.'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage; 