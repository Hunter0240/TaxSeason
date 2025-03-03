import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Typography, Box, Paper, CircularProgress, useTheme } from '@mui/material';
import walletService from '../../services/walletService';
import { Wallet } from '../../types/api';

interface WalletBalanceChartProps {
  // Optional props for future customization
}

const WalletBalanceChart: React.FC<WalletBalanceChartProps> = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  
  const COLORS = [
    theme.palette.primary.main, 
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main
  ];

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await walletService.getAllWallets();
        setWallets(data);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWallets();
  }, []);
  
  const getWalletBalanceData = () => {
    return wallets
      .filter(wallet => wallet.balance && wallet.balance > 0)
      .map(wallet => ({
        name: wallet.name || wallet.address.substring(0, 8) + '...',
        value: wallet.balance || 0
      }));
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Paper>
    );
  }
  
  if (wallets.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" align="center" sx={{ py: 3 }}>
          No wallet data available. Add wallets to see balance distribution.
        </Typography>
      </Paper>
    );
  }
  
  const balanceData = getWalletBalanceData();
  
  if (balanceData.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" align="center" sx={{ py: 3 }}>
          No balance data available for your wallets.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Wallet Balance Distribution
      </Typography>
      
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={balanceData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {balanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Balance']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default WalletBalanceChart; 