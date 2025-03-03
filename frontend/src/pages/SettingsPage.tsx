import React, { useState } from 'react';
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
  Switch
} from '@mui/material';

const SettingsPage: React.FC = () => {
  const [taxMethod, setTaxMethod] = useState('fifo');
  const [darkMode, setDarkMode] = useState(true);
  
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Configure your application preferences.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tax Calculation Method
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="tax-method"
            name="tax-method"
            value={taxMethod}
            onChange={(e) => setTaxMethod(e.target.value)}
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
          <Button variant="contained" color="primary">
            Save Settings
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default SettingsPage; 