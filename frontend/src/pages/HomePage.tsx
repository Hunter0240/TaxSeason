import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    walletCount: 0,
    transactionCount: 0,
    totalValue: 0
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
      // In a real app, we would fetch this data from our backend
      setStats({
        walletCount: 2,
        transactionCount: 156,
        totalValue: 1250.75
      });
    }, 1000);
    
    // In the future, we can fetch real data:
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:4000/api/dashboard');
    //     setStats(response.data);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //     setLoading(false);
    //   }
    // };
    // fetchData();
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
              Connect a wallet to view your recent blockchain activity.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage; 