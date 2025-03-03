import React, { useState } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { Transaction } from '../../types/api';
import transactionService from '../../services/transactionService';

interface CategorySelectorProps {
  transaction: Transaction;
  onCategoryChange: (updatedTransaction: Transaction) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ transaction, onCategoryChange }) => {
  const [editing, setEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(transaction.category || 'uncategorized');
  const [saving, setSaving] = useState(false);

  // Define available categories with labels and colors
  const categories = [
    { value: 'income', label: 'Income', color: '#00A389' },
    { value: 'expense', label: 'Expense', color: '#FF4842' },
    { value: 'trade', label: 'Trade', color: '#7635dc' },
    { value: 'transfer', label: 'Transfer', color: '#2196F3' },
    { value: 'fee', label: 'Fee', color: '#FFC107' },
    { value: 'uncategorized', label: 'Uncategorized', color: '#919EAB' }
  ];

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setSelectedCategory(transaction.category || 'uncategorized');
    setEditing(false);
  };

  const handleSaveClick = async () => {
    if (selectedCategory === transaction.category) {
      setEditing(false);
      return;
    }

    try {
      setSaving(true);
      const updatedTransaction = await transactionService.updateTransactionCategory(transaction.id, selectedCategory);
      
      if (updatedTransaction) {
        onCategoryChange(updatedTransaction);
      }
      
      setEditing(false);
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (categoryValue: string): string => {
    return categories.find(cat => cat.value === categoryValue)?.color || '#919EAB';
  };

  const getCategoryLabel = (categoryValue: string): string => {
    return categories.find(cat => cat.value === categoryValue)?.label || 'Uncategorized';
  };

  if (editing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={saving}
          >
            {categories.map((category) => (
              <MenuItem 
                key={category.value} 
                value={category.value}
                sx={{ 
                  color: category.color,
                  fontWeight: category.value === selectedCategory ? 'bold' : 'normal'
                }}
              >
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ ml: 1 }}>
          {saving ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Tooltip title="Save">
                <IconButton size="small" onClick={handleSaveClick} color="primary">
                  <SaveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton size="small" onClick={handleCancelClick} color="default">
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography 
        variant="body1" 
        sx={{ 
          color: getCategoryColor(transaction.category || 'uncategorized'),
          fontWeight: 'medium',
          textTransform: 'capitalize'
        }}
      >
        {getCategoryLabel(transaction.category || 'uncategorized')}
      </Typography>
      <Tooltip title="Edit Category">
        <IconButton 
          size="small" 
          onClick={handleEditClick}
          sx={{ ml: 1 }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CategorySelector; 