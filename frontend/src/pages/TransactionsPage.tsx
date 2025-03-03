import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Box,
  CircularProgress,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment
} from '@mui/material';
import { 
  InfoOutlined as InfoIcon,
  ArrowUpward as SendIcon,
  ArrowDownward as ReceiveIcon,
  SwapHoriz as SwapIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import transactionService from '../services/transactionService';
import { Transaction } from '../types/api';

// Available transaction types
const transactionTypes = ['all', 'send', 'receive', 'swap', 'other'];

// Available statuses
const transactionStatuses = ['all', 'completed', 'pending', 'failed'];

// Available blockchains
const blockchains = ['all', 'Arbitrum One', 'Ethereum', 'Polygon'];

// Available categories
const categories = ['all', 'income', 'expense', 'trade', 'transfer', 'fee', 'uncategorized'];

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [blockchainFilter, setBlockchainFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getAllTransactions();
        setTransactions(data);
        setFilteredTransactions(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...transactions];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx => 
        tx.hash.toLowerCase().includes(term) ||
        tx.from.toLowerCase().includes(term) ||
        tx.to.toLowerCase().includes(term) ||
        (tx.notes && tx.notes.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(tx => tx.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(tx => tx.status === statusFilter);
    }
    
    // Apply blockchain filter
    if (blockchainFilter !== 'all') {
      result = result.filter(tx => tx.blockchain === blockchainFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(tx => tx.category === categoryFilter);
    }
    
    setFilteredTransactions(result);
    setPage(0); // Reset to first page when filters change
  }, [searchTerm, typeFilter, statusFilter, blockchainFilter, categoryFilter, transactions]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewTransaction = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleBlockchainFilterChange = (event: SelectChangeEvent) => {
    setBlockchainFilter(event.target.value);
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <SendIcon fontSize="small" />;
      case 'receive':
        return <ReceiveIcon fontSize="small" />;
      case 'swap':
        return <SwapIcon fontSize="small" />;
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
        Transactions
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        View and manage your blockchain transactions.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {transactions.length === 0 && !loading && !error ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No transactions found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Connect a wallet to start tracking your transactions.
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search"
                  placeholder="Search by hash, address or notes"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={1.6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    label="Type"
                  >
                    {transactionTypes.map(type => (
                      <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
                        {type === 'all' ? 'All Types' : type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={1.6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    label="Status"
                  >
                    {transactionStatuses.map(status => (
                      <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                        {status === 'all' ? 'All Statuses' : status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={1.6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Blockchain</InputLabel>
                  <Select
                    value={blockchainFilter}
                    onChange={handleBlockchainFilterChange}
                    label="Blockchain"
                  >
                    {blockchains.map(blockchain => (
                      <MenuItem key={blockchain} value={blockchain}>
                        {blockchain === 'all' ? 'All Blockchains' : blockchain}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={1.6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                    label="Category"
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category} sx={{ textTransform: 'capitalize' }}>
                        {category === 'all' ? 'All Categories' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={3}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>From/To</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Blockchain</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="textSecondary">
                          No transactions match your filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((transaction) => (
                        <TableRow 
                          key={transaction.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleViewTransaction(transaction.id)}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getTransactionTypeIcon(transaction.type)}
                              <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                                {transaction.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {format(new Date(transaction.timestamp), 'MMM d, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            {transaction.type === 'send' 
                              ? `To: ${transaction.to.substring(0, 8)}...` 
                              : `From: ${transaction.from.substring(0, 8)}...`
                            }
                          </TableCell>
                          <TableCell>
                            ${transaction.value.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {transaction.blockchain}
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ 
                              textTransform: 'capitalize',
                              color: transaction.category ? 
                                transaction.category === 'income' ? '#00A389' :
                                transaction.category === 'expense' ? '#FF4842' :
                                transaction.category === 'trade' ? '#7635dc' :
                                transaction.category === 'transfer' ? '#2196F3' :
                                transaction.category === 'fee' ? '#FFC107' : '#919EAB'
                              : '#919EAB'
                            }}>
                              {transaction.category || 'uncategorized'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={transaction.status} 
                              size="small"
                              color={getStatusColor(transaction.status) as any}
                            />
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewTransaction(transaction.id);
                                }}
                              >
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      )}
    </div>
  );
};

export default TransactionsPage; 