import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControlLabel,
  Switch,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
};

const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [defaultTaxMethod, setDefaultTaxMethod] = useState<'fifo' | 'lifo' | 'hifo' | 'acb'>(
    (user?.defaultTaxMethod as 'fifo' | 'lifo' | 'hifo' | 'acb') || 'fifo'
  );
  const [prefersDarkMode, setPrefersDarkMode] = useState(user?.prefersDarkMode || true);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !email) {
      setProfileError('Name and email are required');
      return;
    }
    
    // Clear previous messages
    setProfileError(null);
    setProfileSuccess(null);
    setIsUpdatingProfile(true);
    
    try {
      const updatedData = {
        name,
        email,
        defaultTaxMethod,
        prefersDarkMode
      };
      
      await updateProfile(updatedData);
      setProfileSuccess('Profile updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        setProfileError(error.message);
      } else {
        setProfileError('An unexpected error occurred while updating profile');
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Clear previous messages
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsChangingPassword(true);
    
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully');
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError('An unexpected error occurred while changing password');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    // The protected route component will redirect to login
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography variant="body1" color="textSecondary">{user?.email}</Typography>
          </Box>
        </Box>
        
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Profile Settings" {...a11yProps(0)} />
          <Tab label="Change Password" {...a11yProps(1)} />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          {profileError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {profileError}
            </Alert>
          )}
          
          {profileSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {profileSuccess}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleProfileSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="tax-method-label">Default Tax Method</InputLabel>
              <Select
                labelId="tax-method-label"
                id="tax-method"
                value={defaultTaxMethod}
                label="Default Tax Method"
                onChange={(e) => setDefaultTaxMethod(e.target.value as 'fifo' | 'lifo' | 'hifo' | 'acb')}
              >
                <MenuItem value="fifo">First In, First Out (FIFO)</MenuItem>
                <MenuItem value="lifo">Last In, First Out (LIFO)</MenuItem>
                <MenuItem value="hifo">Highest In, First Out (HIFO)</MenuItem>
                <MenuItem value="acb">Average Cost Basis (ACB)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={prefersDarkMode}
                  onChange={(e) => setPrefersDarkMode(e.target.checked)}
                  color="primary"
                />
              }
              label="Dark Mode"
              sx={{ mt: 2 }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mr: 1 }}
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {passwordError}
            </Alert>
          )}
          
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {passwordSuccess}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handlePasswordSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="currentPassword"
              label="Current Password"
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmNewPassword"
              label="Confirm New Password"
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? <CircularProgress size={24} /> : 'Change Password'}
            </Button>
          </Box>
        </TabPanel>
        
        <Divider sx={{ mt: 4, mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;