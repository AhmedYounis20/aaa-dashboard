import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Paper } from '@mui/material';
import { getVariants } from '../../../../Apis/Inventory/VariantsApi';
import { getStockBalancesByBranch, StockBalanceModel } from '../../../../Apis/Inventory/StockBalanceApi';
import VariantModel from '../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantModel';
import { useTranslation } from 'react-i18next';

interface SelectItemsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (variants: VariantModel[]) => void;
  sourceBranchId: string;
  alreadySelectedIds: string[];
}

const style = {
  position: 'absolute' as const,
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

const SelectItemsModal: React.FC<SelectItemsModalProps> = ({
  open,
  onClose,
  onConfirm,
  sourceBranchId,
  alreadySelectedIds,
}) => {
  const { t } = useTranslation();
  const [variants, setVariants] = useState<VariantModel[]>([]);
  const [branchBalances, setBranchBalances] = useState<StockBalanceModel[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    getVariants().then((res) => {
      if (res.isSuccess) {
        setVariants(res.result || []);
      }
    });
  }, [open]);

  useEffect(() => {
    if (!open || !sourceBranchId) {
      setBranchBalances([]);
      return;
    }
    getStockBalancesByBranch(sourceBranchId).then((res) => {
      if (res.isSuccess) {
        setBranchBalances(res.result || []);
      }
    });
  }, [open, sourceBranchId]);

  const getAvailableBalance = (variantId: string) =>
    branchBalances
      .filter((sb) => sb.variantId === variantId)
      .reduce((sum, sb) => sum + (sb.currentBalance || 0), 0);

  const filteredVariants = variants.filter(
    (variant) =>
      (variant.name.toLowerCase().includes(search.toLowerCase()) ||
        variant.code.toLowerCase().includes(search.toLowerCase()) ||
        variant.productName?.toLowerCase().includes(search.toLowerCase())) &&
      !alreadySelectedIds.includes(variant.id)
  );

  const areAllFilteredSelected =
    filteredVariants.every((variant) => selected.includes(variant.id)) && filteredVariants.length > 0;

  const handleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (areAllFilteredSelected) {
      setSelected((prev) => prev.filter((id) => !filteredVariants.some((variant) => variant.id === id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...filteredVariants.map((variant) => variant.id)])]);
    }
  };

  const handleConfirm = () => {
    const selectedVariants = variants.filter((variant) => selected.includes(variant.id));
    onConfirm(selectedVariants);
    setSelected([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {t('Select Variants')}
        </Typography>
        {!sourceBranchId && (
          <Typography color="warning.main" variant="body2" mb={2}>
            {t('Select source branch first to see available stock')}
          </Typography>
        )}
        <TextField
          label={t('Search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                    indeterminate={
                      !areAllFilteredSelected && filteredVariants.some((variant) => selected.includes(variant.id))
                    }
                  />
                </TableCell>
                <TableCell>{t('Variant')}</TableCell>
                <TableCell>{t('Product')}</TableCell>
                <TableCell>{t('Code')}</TableCell>
                <TableCell>{t('Available Balance')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVariants.map((variant) => (
                <TableRow key={variant.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(variant.id)} onChange={() => handleSelect(variant.id)} />
                  </TableCell>
                  <TableCell>{variant.name}</TableCell>
                  <TableCell>{variant.productName}</TableCell>
                  <TableCell>{variant.code}</TableCell>
                  <TableCell>{sourceBranchId ? getAvailableBalance(variant.id) : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button variant="contained" onClick={handleConfirm} disabled={selected.length === 0}>
            {t('Confirm')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SelectItemsModal;
