import React from 'react';
import { Typography, Paper, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 'calc(100vh - 200px)' 
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          textAlign: 'center', 
          maxWidth: 500, 
          width: '100%' 
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 70, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage; 