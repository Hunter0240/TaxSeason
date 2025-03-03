import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Paper, 
  Box, 
  CircularProgress, 
  List, 
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import walletService, { Wallet, NewWallet } from '../services/walletService';

const WalletsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newWallet, setNewWallet] = useState<NewWallet>({
    address: '',
    label: '',
  });
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const walletData = await walletService.getAllWallets();
      setWallets(walletData);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setAlert({
        open: true,
        message: 'Failed to fetch wallets. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = () => {
    // Reset form and open dialog
    setNewWallet({ address: '', label: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitWallet = async () => {
    // Validate input
    if (!newWallet.address || !newWallet.label) {
      setAlert({
        open: true,
        message: 'Address and label are required',
        severity: 'warning'
      });
      return;
    }

    try {
      const addedWallet = await walletService.addWallet({
        address: newWallet.address,
        label: newWallet.label,
        network: 'arbitrum-one'
      });
      
      setWallets([...wallets, addedWallet]);
      setOpenDialog(false);
      setAlert({
        open: true,
        message: 'Wallet added successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding wallet:', error);
      setAlert({
        open: true,
        message: 'Failed to add wallet. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleDeleteWallet = async (id: string) => {
    try {
      await walletService.deleteWallet(id);
      setWallets(wallets.filter(wallet => wallet._id !== id));
      setAlert({
        open: true,
        message: 'Wallet deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting wallet:', error);
      setAlert({
        open: true,
        message: 'Failed to delete wallet. Please try again.',
        severity: 'error'
      });
    }
  };

  const truncateAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Wallets
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddWallet}
        >
          Add Wallet
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 0 }}>
        <List>
          {wallets.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No wallets added yet" 
                secondary="Add a wallet to start tracking your transactions"
                sx={{ textAlign: 'center', py: 3 }}
              />
            </ListItem>
          ) : (
            wallets.map((wallet, index) => (
              <React.Fragment key={wallet._id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={wallet.label}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          {truncateAddress(wallet.address)}
                        </Typography>
                        {" — "}
                        <Typography component="span" variant="body2" color="textSecondary">
                          {wallet.network}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleDeleteWallet(wallet._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Add Wallet Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Wallet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Wallet Address"
            type="text"
            fullWidth
            variant="outlined"
            value={newWallet.address}
            onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            id="label"
            label="Wallet Label"
            type="text"
            fullWidth
            variant="outlined"
            value={newWallet.label}
            onChange={(e) => setNewWallet({ ...newWallet, label: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitWallet} color="primary" variant="contained">
            Add Wallet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default WalletsPage; 