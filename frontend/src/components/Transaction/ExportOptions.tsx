import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import ReportTemplateSelector, { taxSoftwareTemplates } from './ReportTemplateSelector';
import { TaxReportParams } from '../../services/taxReportService';

interface ExportOptionsProps {
  onExportCsv: (templateId: string) => Promise<void>;
  onExportPdf: () => Promise<void>;
  loading: boolean;
  disabled: boolean;
  reportParams: TaxReportParams;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  onExportCsv,
  onExportPdf,
  loading,
  disabled,
  reportParams
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('general');

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleExportCsv = () => {
    onExportCsv(selectedTemplate);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Export Options
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Choose your preferred tax software format and export your report.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <ReportTemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={handleTemplateChange}
          country={reportParams.country}
        />
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <CsvIcon />}
            onClick={handleExportCsv}
            disabled={disabled || loading}
          >
            Export CSV
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            startIcon={loading ? <CircularProgress size={20} /> : <PdfIcon />}
            onClick={onExportPdf}
            disabled={disabled || loading}
          >
            Export PDF
          </Button>
        </Grid>
      </Grid>
      
      {selectedTemplate !== 'general' && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="info.dark">
            <strong>Note:</strong> This export is formatted specifically for {
              taxSoftwareTemplates.find(template => template.id === selectedTemplate)?.name
            }. Follow the software's import instructions for best results.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ExportOptions; 