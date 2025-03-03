import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, CircularProgress, Grid, Chip } from '@mui/material';
import { ArrowUpward, ArrowDownward, SwapHoriz, More } from '@mui/icons-material';
import transactionService from '../../services/transactionService';
import { Transaction } from '../../types/api';

interface TransactionSummaryCardProps {
  walletId?: string;
  timeframe?: 'week' | 'month' | 'year';
}

const TransactionSummaryCard: React.FC<TransactionSummaryCardProps> = ({
  walletId,
  timeframe = 'month'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: Transaction[];
        
        if (walletId) {
          data = await transactionService.getTransactionsByWallet(walletId);
        } else {
          data = await transactionService.getAllTransactions();
        }
        
        // Filter transactions based on timeframe
        const now = new Date();
        let cutoffDate = new Date();
        
        if (timeframe === 'week') {
          cutoffDate.setDate(now.getDate() - 7);
        } else if (timeframe === 'month') {
          cutoffDate.setMonth(now.getMonth() - 1);
        } else if (timeframe === 'year') {
          cutoffDate.setFullYear(now.getFullYear() - 1);
        }
        
        const filteredTransactions = data.filter(tx => 
          new Date(tx.timestamp) >= cutoffDate
        );
        
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        setError('Failed to load transaction data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [walletId, timeframe]);
  
  const getTransactionTypeStats = () => {
    const stats = {
      send: 0,
      receive: 0,
      swap: 0,
      other: 0
    };
    
    transactions.forEach(tx => {
      stats[tx.type]++;
    });
    
    return stats;
  };
  
  const getTransactionValueStats = () => {
    let totalSent = 0;
    let totalReceived = 0;
    let totalFees = 0;
    
    transactions.forEach(tx => {
      if (tx.type === 'send') {
        totalSent += tx.value;
      } else if (tx.type === 'receive') {
        totalReceived += tx.value;
      }
      
      if (tx.fee) {
        totalFees += tx.fee;
      }
    });
    
    return {
      totalSent,
      totalReceived,
      totalFees,
      netFlow: totalReceived - totalSent
    };
  };
  
  const getTransactionCategoryStats = () => {
    const categoryCount = {
      income: 0,
      expense: 0,
      trade: 0,
      transfer: 0,
      fee: 0,
      uncategorized: 0
    };
    
    transactions.forEach(tx => {
      const category = tx.category || 'uncategorized';
      categoryCount[category]++;
    });
    
    return categoryCount;
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
  
  if (transactions.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" align="center" sx={{ py: 3 }}>
          No transaction data available for the selected time period.
        </Typography>
      </Paper>
    );
  }
  
  const typeStats = getTransactionTypeStats();
  const valueStats = getTransactionValueStats();
  const categoryStats = getTransactionCategoryStats();
  
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Transaction Summary
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Transactions
            </Typography>
            <Typography variant="h4">
              {transactions.length}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Net Flow
            </Typography>
            <Typography 
              variant="h4" 
              color={valueStats.netFlow >= 0 ? 'success.main' : 'error.main'}
            >
              ${valueStats.netFlow.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Received
            </Typography>
            <Typography variant="h4" color="success.main">
              ${valueStats.totalReceived.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Sent
            </Typography>
            <Typography variant="h4" color="error.main">
              ${valueStats.totalSent.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Transaction Types
      </Typography>
      
      <Grid container spacing={1} sx={{ mb: 3 }}>
        <Grid item>
          <Chip 
            icon={<ArrowUpward />} 
            label={`Sent: ${typeStats.send}`} 
            color="error" 
            variant="outlined" 
          />
        </Grid>
        <Grid item>
          <Chip 
            icon={<ArrowDownward />} 
            label={`Received: ${typeStats.receive}`} 
            color="success" 
            variant="outlined" 
          />
        </Grid>
        <Grid item>
          <Chip 
            icon={<SwapHoriz />} 
            label={`Swaps: ${typeStats.swap}`} 
            color="primary" 
            variant="outlined" 
          />
        </Grid>
        <Grid item>
          <Chip 
            icon={<More />} 
            label={`Other: ${typeStats.other}`} 
            color="secondary" 
            variant="outlined" 
          />
        </Grid>
      </Grid>
      
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Categories
      </Typography>
      
      <Grid container spacing={1}>
        {Object.entries(categoryStats).map(([category, count]) => (
          count > 0 && (
            <Grid item key={category}>
              <Chip 
                label={`${category.charAt(0).toUpperCase() + category.slice(1)}: ${count}`} 
                variant="outlined" 
              />
            </Grid>
          )
        ))}
      </Grid>
    </Paper>
  );
};

export default TransactionSummaryCard; 