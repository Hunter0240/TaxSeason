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
  Divider
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

interface Wallet {
  _id: string;
  address: string;
  label: string;
  network: string;
  createdAt: string;
}

const WalletsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newWallet, setNewWallet] = useState({
    address: '',
    label: '',
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
      // Mock data
      setWallets([
        {
          _id: '1',
          address: '0x1234567890123456789012345678901234567890',
          label: 'Main Wallet',
          network: 'arbitrum-one',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          address: '0x0987654321098765432109876543210987654321',
          label: 'Trading Wallet',
          network: 'arbitrum-one',
          createdAt: new Date().toISOString()
        }
      ]);
    }, 1000);
    
    // In the future, we can fetch real data:
    // const fetchWallets = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:4000/api/wallets');
    //     setWallets(response.data);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching wallets:', error);
    //     setLoading(false);
    //   }
    // };
    // fetchWallets();
  }, []);

  const handleAddWallet = () => {
    // Reset form and open dialog
    setNewWallet({ address: '', label: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitWallet = () => {
    // Validate input
    if (!newWallet.address || !newWallet.label) {
      return;
    }

    // Mock adding a wallet
    const mockWallet: Wallet = {
      _id: Date.now().toString(),
      address: newWallet.address,
      label: newWallet.label,
      network: 'arbitrum-one',
      createdAt: new Date().toISOString()
    };

    setWallets([...wallets, mockWallet]);
    setOpenDialog(false);

    // In a real app, we would call the API:
    // const addWallet = async () => {
    //   try {
    //     const response = await axios.post('http://localhost:4000/api/wallets', {
    //       address: newWallet.address,
    //       label: newWallet.label,
    //       network: 'arbitrum-one'
    //     });
    //     setWallets([...wallets, response.data]);
    //     setOpenDialog(false);
    //   } catch (error) {
    //     console.error('Error adding wallet:', error);
    //   }
    // };
    // addWallet();
  };

  const handleDeleteWallet = (id: string) => {
    // Mock deleting a wallet
    setWallets(wallets.filter(wallet => wallet._id !== id));

    // In a real app, we would call the API:
    // const deleteWallet = async (id: string) => {
    //   try {
    //     await axios.delete(`http://localhost:4000/api/wallets/${id}`);
    //     setWallets(wallets.filter(wallet => wallet._id !== id));
    //   } catch (error) {
    //     console.error('Error deleting wallet:', error);
    //   }
    // };
    // deleteWallet(id);
  };

  const truncateAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
    </div>
  );
};

export default WalletsPage; 