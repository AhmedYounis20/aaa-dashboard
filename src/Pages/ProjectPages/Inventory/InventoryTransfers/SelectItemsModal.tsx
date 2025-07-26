import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Paper } from '@mui/material';
import { getItemsVariants } from '../../../../Apis/Inventory/ItemsApi';
import ItemModel from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemModel';
import { useTranslation } from 'react-i18next';

interface SelectItemsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (items: ItemModel[]) => void;
  sourceBranchId: string;
  alreadySelectedIds: string[];
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  maxWidth: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};


const SelectItemsModal: React.FC<SelectItemsModalProps> = ({ open, onClose, onConfirm, sourceBranchId, alreadySelectedIds }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ItemModel[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    getItemsVariants().then(res => {
      if (res.isSuccess) {
        setItems(res.result);
      }
    });
  }, [open]);

  const getAvailableBalance = (item: ItemModel) => {
    if (!item.stockBalances) return 0;
    return item.stockBalances
      .filter(sb => sb.branchId === sourceBranchId)
      .reduce((sum, sb) => sum + (sb.currentBalance || 0), 0);
  };

  const filteredItems = items.filter(i =>
    (i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase())) &&
    !alreadySelectedIds.includes(i.id)
  );

  const areAllFilteredSelected = filteredItems.every(item => selected.includes(item.id)) && filteredItems.length > 0;

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (areAllFilteredSelected) {
      // Unselect all filtered
      setSelected(prev => prev.filter(id => !filteredItems.some(item => item.id === id)));
    } else {
      // Add all filtered that aren't already selected
      const newSelected = [...new Set([...selected, ...filteredItems.map(item => item.id)])];
      setSelected(newSelected);
    }
  };

  const handleConfirm = () => {
    const selectedItems = items.filter(i => selected.includes(i.id));
    onConfirm(selectedItems);
    setSelected([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>{t('Select Items')}</Typography>
        <TextField
          label={t('Search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={areAllFilteredSelected}
                    onChange={handleSelectAll}
                    indeterminate={!areAllFilteredSelected && filteredItems.some(item => selected.includes(item.id))}
                  />
                </TableCell>
                <TableCell>{t('Name')}</TableCell>
                <TableCell>{t('Code')}</TableCell>
                <TableCell>{t('Available Balance')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map(item => (
                <TableRow key={item.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{getAvailableBalance(item)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>{t('Cancel')}</Button>
          <Button variant="contained" onClick={handleConfirm} disabled={selected.length === 0}>{t('Confirm')}</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SelectItemsModal;
