import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  SwapHoriz as TransactionsIcon,
  Description as TaxReportIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', requiresAuth: true },
    { text: 'Wallets', icon: <WalletIcon />, path: '/wallets', requiresAuth: true },
    { text: 'Transactions', icon: <TransactionsIcon />, path: '/transactions', requiresAuth: true },
    { text: 'Tax Report', icon: <TaxReportIcon />, path: '/tax-report', requiresAuth: true },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', requiresAuth: true },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile', requiresAuth: true },
    { text: 'Login', icon: <LoginIcon />, path: '/login', requiresAuth: false, hideWhenAuth: true },
    { text: 'Register', icon: <RegisterIcon />, path: '/register', requiresAuth: false, hideWhenAuth: true },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            TaxSeason
          </Typography>
          {isAuthenticated && user && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {user.name || user.email}
            </Typography>
          )}
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => {
            // Skip items that require auth if not authenticated
            if (item.requiresAuth && !isAuthenticated) return null;
            // Skip items that should be hidden when authenticated
            if (item.hideWhenAuth && isAuthenticated) return null;
            
            return (
              <ListItem
                button
                component={Link}
                to={item.path}
                key={item.text}
                onClick={onClose}
                sx={{
                  backgroundColor: isActive(item.path)
                    ? theme.palette.action.selected
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path)
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color: isActive(item.path)
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 