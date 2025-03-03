import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const TransactionsPage: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        View and filter your blockchain transactions.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mt: 3, textAlign: 'center' }}>
        <Box sx={{ py: 5 }}>
          <Typography variant="h6" gutterBottom>
            No Transactions Yet
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Connect a wallet to view your transactions.
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default TransactionsPage; 