import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Link,
  TextField,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ContentCopy as CopyIcon,
  ArrowUpward as SendIcon,
  ArrowDownward as ReceiveIcon,
  SwapHoriz as SwapIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import transactionService from '../services/transactionService';
import { Transaction } from '../types/api';

const TransactionDetailPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState(false);
  
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!transactionId) {
        setError('Transaction ID is required');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await transactionService.getTransactionById(transactionId);
        
        if (!data) {
          setError('Transaction not found');
          setLoading(false);
          return;
        }
        
        setTransaction(data);
        setNotes(data.notes || '');
        setError(null);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        setError('Failed to load transaction details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactionDetails();
  }, [transactionId]);
  
  const handleBack = () => {
    navigate('/transactions');
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <SendIcon fontSize="large" color="primary" />;
      case 'receive':
        return <ReceiveIcon fontSize="large" color="success" />;
      case 'swap':
        return <SwapIcon fontSize="large" color="secondary" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const handleEditNotes = () => {
    setIsEditingNotes(true);
  };
  
  const handleSaveNotes = async () => {
    if (!transaction) return;
    
    try {
      setSavingNotes(true);
      // Call the API to update the notes
      const updatedTransaction = await transactionService.updateTransactionNotes(transaction.id, notes);
      
      if (updatedTransaction) {
        setTransaction(updatedTransaction);
      } else {
        // If the API request fails, update local state for now
        setTransaction({
          ...transaction,
          notes: notes
        });
      }
      
      setIsEditingNotes(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      // Update local state anyway to provide a good UX
      setTransaction({
        ...transaction,
        notes: notes
      });
      setIsEditingNotes(false);
    } finally {
      setSavingNotes(false);
    }
  };
  
  const handleCancelEditNotes = () => {
    setNotes(transaction?.notes || '');
    setIsEditingNotes(false);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
        >
          Back to Transactions
        </Button>
      </Box>
    );
  }
  
  if (!transaction) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Transaction not found
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
        >
          Back to Transactions
        </Button>
      </Box>
    );
  }
  
  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">
          Transaction Details
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ mr: 2 }}>
            {getTransactionTypeIcon(transaction.type)}
          </Box>
          <Box>
            <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
              {transaction.type} Transaction
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {format(new Date(transaction.timestamp), 'PPpp')}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Chip 
              label={transaction.status} 
              color={getStatusColor(transaction.status) as any}
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Transaction Hash
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 1, wordBreak: 'break-all' }}>
                {transaction.hash}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => copyToClipboard(transaction.hash)}
                aria-label="Copy hash"
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Amount
            </Typography>
            <Typography variant="h6">
              ${transaction.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              From
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 1, wordBreak: 'break-all' }}>
                {transaction.from}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => copyToClipboard(transaction.from)}
                aria-label="Copy sender address"
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              To
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 1, wordBreak: 'break-all' }}>
                {transaction.to}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => copyToClipboard(transaction.to)}
                aria-label="Copy recipient address"
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Blockchain
            </Typography>
            <Typography variant="body1">
              {transaction.blockchain}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Fee
            </Typography>
            <Typography variant="body1">
              ${transaction.fee ? transaction.fee.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Notes
            </Typography>
            {!isEditingNotes ? (
              <IconButton 
                size="small" 
                onClick={handleEditNotes}
                sx={{ ml: 1 }}
                aria-label="Edit notes"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            ) : (
              <Box sx={{ ml: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  color="primary"
                  aria-label="Save notes"
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={handleCancelEditNotes}
                  disabled={savingNotes}
                  color="error"
                  aria-label="Cancel editing"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
          
          {isEditingNotes ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add transaction notes..."
              disabled={savingNotes}
            />
          ) : (
            <Typography variant="body1">
              {transaction.notes || 'No notes added yet.'}
            </Typography>
          )}
        </Box>
      </Paper>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Blockchain Explorer
          </Typography>
          <Typography variant="body2" paragraph>
            View this transaction on a blockchain explorer for more details.
          </Typography>
          <Button 
            variant="outlined" 
            component={Link} 
            href={`https://explorer.arbitrum.io/tx/${transaction.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Explorer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetailPage; 