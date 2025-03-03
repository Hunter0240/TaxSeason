import React from 'react';
import { ToggleButtonGroup, ToggleButton, Box } from '@mui/material';

interface TimeframeSelectorProps {
  value: 'week' | 'month' | 'year';
  onChange: (newValue: 'week' | 'month' | 'year') => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ value, onChange }) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: 'week' | 'month' | 'year' | null
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="timeframe"
        size="small"
      >
        <ToggleButton value="week" aria-label="week">
          Week
        </ToggleButton>
        <ToggleButton value="month" aria-label="month">
          Month
        </ToggleButton>
        <ToggleButton value="year" aria-label="year">
          Year
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default TimeframeSelector; 