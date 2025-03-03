import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Paper,
  Grid,
  SelectChangeEvent
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

// Define different tax software templates we support
export interface TaxSoftwareTemplate {
  id: string;
  name: string;
  description: string;
  format: string;
  supportedCountries: string[];
}

// List of supported tax software templates
export const taxSoftwareTemplates: TaxSoftwareTemplate[] = [
  {
    id: 'general',
    name: 'General Format',
    description: 'A general format compatible with most spreadsheet applications',
    format: 'CSV',
    supportedCountries: ['All Countries']
  },
  {
    id: 'turbotax',
    name: 'TurboTax',
    description: 'Compatible with Intuit TurboTax software',
    format: 'CSV',
    supportedCountries: ['USA', 'Canada']
  },
  {
    id: 'hrblock',
    name: 'H&R Block',
    description: 'Compatible with H&R Block tax software',
    format: 'CSV',
    supportedCountries: ['USA', 'Canada', 'Australia']
  },
  {
    id: 'koinly',
    name: 'Koinly',
    description: 'Compatible with Koinly crypto tax software',
    format: 'CSV',
    supportedCountries: ['All Countries']
  },
  {
    id: 'cointracker',
    name: 'CoinTracker',
    description: 'Compatible with CoinTracker crypto tax software',
    format: 'CSV',
    supportedCountries: ['All Countries']
  },
  {
    id: 'taxact',
    name: 'TaxAct',
    description: 'Compatible with TaxAct software',
    format: 'CSV',
    supportedCountries: ['USA']
  }
];

interface ReportTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  country?: string;
}

const ReportTemplateSelector: React.FC<ReportTemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  country = 'All Countries'
}) => {
  // Filter templates based on the selected country
  const availableTemplates = taxSoftwareTemplates.filter(template => 
    template.supportedCountries.includes('All Countries') || 
    template.supportedCountries.includes(country)
  );

  const handleChange = (event: SelectChangeEvent<string>) => {
    onTemplateChange(event.target.value);
  };

  // Find the currently selected template details
  const selectedTemplateDetails = taxSoftwareTemplates.find(
    template => template.id === selectedTemplate
  ) || taxSoftwareTemplates[0];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="report-template-label">Tax Software Format</InputLabel>
          <Select
            labelId="report-template-label"
            id="report-template-select"
            value={selectedTemplate}
            label="Tax Software Format"
            onChange={handleChange}
          >
            {availableTemplates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              {selectedTemplateDetails.name}
            </Typography>
            <Tooltip title="This format determines how your exported data will be structured for the selected tax software">
              <IconButton size="small" sx={{ ml: 1 }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {selectedTemplateDetails.description}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Format: {selectedTemplateDetails.format}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Supported in: {selectedTemplateDetails.supportedCountries.join(', ')}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ReportTemplateSelector; 