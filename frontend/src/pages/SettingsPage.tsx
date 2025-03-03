import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Button,
  Divider,
  Switch,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  
  const [taxMethod, setTaxMethod] = useState<'fifo' | 'lifo' | 'hifo' | 'acb'>(
    (user?.defaultTaxMethod as 'fifo' | 'lifo' | 'hifo' | 'acb') || 'fifo'
  );
  const [darkMode, setDarkMode] = useState(user?.prefersDarkMode || true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Update state when user data changes
  useEffect(() => {
    if (user) {
      setTaxMethod((user.defaultTaxMethod as 'fifo' | 'lifo' | 'hifo' | 'acb') || 'fifo');
      setDarkMode(user.prefersDarkMode || true);
    }
  }, [user]);
  
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        defaultTaxMethod: taxMethod,
        prefersDarkMode: darkMode
      });
      
      setSuccess('Settings saved successfully');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while saving settings');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Configure your application preferences.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tax Calculation Method
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="tax-method"
            name="tax-method"
            value={taxMethod}
            onChange={(e) => setTaxMethod(e.target.value as 'fifo' | 'lifo' | 'hifo' | 'acb')}
          >
            <FormControlLabel value="fifo" control={<Radio />} label="First In, First Out (FIFO)" />
            <FormControlLabel value="lifo" control={<Radio />} label="Last In, First Out (LIFO)" />
            <FormControlLabel value="hifo" control={<Radio />} label="Highest In, First Out (HIFO)" />
            <FormControlLabel value="acb" control={<Radio />} label="Average Cost Basis (ACB)" />
          </RadioGroup>
        </FormControl>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              color="primary"
            />
          }
          label="Dark Mode"
        />
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save Settings'}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default SettingsPage; 