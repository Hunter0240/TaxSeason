import React from 'react';
import { Typography, Paper, Box, Button, Grid } from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';

const TaxReportPage: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tax Report
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Generate and download tax reports based on your blockchain activity.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Generate Tax Report
            </Typography>
            <Typography variant="body1" paragraph>
              Select a date range and format to generate your tax report.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadOutlined />}
                disabled
              >
                Generate CSV Report
              </Button>
            </Box>
            
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
              Connect a wallet and sync transactions to enable report generation.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default TaxReportPage; 