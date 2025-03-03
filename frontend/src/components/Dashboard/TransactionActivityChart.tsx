import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Typography, Box, Paper, CircularProgress, Tab, Tabs, useTheme } from '@mui/material';
import transactionService from '../../services/transactionService';
import { Transaction } from '../../types/api';

interface ChartData {
  name: string;
  value: number;
}

interface TransactionActivityChartProps {
  walletId?: string;
  timeframe?: 'week' | 'month' | 'year';
}

const TransactionActivityChart: React.FC<TransactionActivityChartProps> = ({ 
  walletId, 
  timeframe = 'month' 
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tabValue, setTabValue] = useState(0);
  
  const COLORS = [
    theme.palette.primary.main, 
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main
  ];

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
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const getActivityByDay = (): { name: string; count: number }[] => {
    const dayMap = new Map<string, number>();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Initialize all days with 0 count
    daysOfWeek.forEach(day => {
      dayMap.set(day, 0);
    });
    
    // Count transactions by day
    transactions.forEach(tx => {
      const date = new Date(tx.timestamp);
      const day = daysOfWeek[date.getDay()];
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    });
    
    // Convert to array
    return daysOfWeek.map(day => ({
      name: day,
      count: dayMap.get(day) || 0
    }));
  };
  
  const getTransactionsByType = (): ChartData[] => {
    const typeMap = new Map<string, number>();
    
    transactions.forEach(tx => {
      typeMap.set(tx.type, (typeMap.get(tx.type) || 0) + 1);
    });
    
    return Array.from(typeMap.entries()).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));
  };
  
  const getTransactionsByCategory = (): ChartData[] => {
    const categoryMap = new Map<string, number>();
    
    transactions.forEach(tx => {
      const category = tx.category || 'uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count
    }));
  };
  
  const getValueOverTime = (): { date: string; value: number }[] => {
    const valueMap = new Map<string, number>();
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    sortedTransactions.forEach(tx => {
      const date = new Date(tx.timestamp).toLocaleDateString();
      const existingValue = valueMap.get(date) || 0;
      
      // Add value for receive, subtract for send
      let change = 0;
      if (tx.type === 'receive') {
        change = tx.value;
      } else if (tx.type === 'send') {
        change = -tx.value;
      }
      
      valueMap.set(date, existingValue + change);
    });
    
    return Array.from(valueMap.entries()).map(([date, value]) => ({
      date,
      value
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
  
  if (transactions.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" align="center" sx={{ py: 3 }}>
          No transaction data available for the selected time period.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Transaction Activity
      </Typography>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        centered
        sx={{ mb: 2 }}
      >
        <Tab label="Activity by Day" />
        <Tab label="By Type" />
        <Tab label="By Category" />
        <Tab label="Value Over Time" />
      </Tabs>
      
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {tabValue === 0 ? (
            <BarChart data={getActivityByDay()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={theme.palette.primary.main} name="Transactions" />
            </BarChart>
          ) : tabValue === 1 ? (
            <PieChart>
              <Pie
                data={getTransactionsByType()}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {getTransactionsByType().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : tabValue === 2 ? (
            <PieChart>
              <Pie
                data={getTransactionsByCategory()}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {getTransactionsByCategory().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <LineChart data={getValueOverTime()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Value']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={theme.palette.primary.main} 
                activeDot={{ r: 8 }} 
                name="Net Value"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TransactionActivityChart; 