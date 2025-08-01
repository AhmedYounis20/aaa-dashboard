import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import ExpandableCard from '../../../../../Components/UI/ExpandableCard';
import InputAutoComplete from '../../../../../Components/Inputs/InputAutoCompelete';

import { getColors } from '../../../../../Apis/Inventory/ColorsApi';
import { getSizes } from '../../../../../Apis/Inventory/SizesApi';

import { ColorSizeCombinationModel } from '../../../../../interfaces/ProjectInterfaces/Inventory/Items/ColorSizeCombinationModel';
import ColorModel from '../../../../../interfaces/ProjectInterfaces/Inventory/Colors/ColorModel';
import SizeModel from '../../../../../interfaces/ProjectInterfaces/Inventory/Sizes/SizeModel';
import { FormTypes } from '../../../../../interfaces/Components/FormType';

interface Props {
  combinations: ColorSizeCombinationModel[];
  onChange: (combinations: ColorSizeCombinationModel[]) => void;
  onItemApplyChanges: (val: boolean) => void;
  handleTranslate: (key: string) => string;
  formType: FormTypes;
  itemApplyChanges: boolean;
}

const SubDomainCombinationBuilder: React.FC<Props> = ({
  combinations,
  onChange,
  onItemApplyChanges,
  itemApplyChanges,
  handleTranslate,
  formType
}) => {
  /* ----------------------------- state ----------------------------- */
  const [colors, setColors] = useState<ColorModel[]>([]);
  const [sizes, setSizes] = useState<SizeModel[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const prevColorsRef = useRef<string[]>([]);
  const prevSizesRef = useRef<string[]>([]);
  const didInit = useRef(false);

  /* --------------------------- effects ----------------------------- */
  useEffect(() => {
    fetchColorsAndSizes();
  }, []);

  // When combinations change (e.g., on update), set selected colors/sizes to those used in combinations, but only on first mount
  useEffect(() => {
    if (!didInit.current) {
      const usedColors = Array.from(new Set(combinations.map(c => c.colorId)));
      const usedSizes = Array.from(new Set(combinations.map(c => c.sizeId)));
      setSelectedColors(usedColors);
      setSelectedSizes(usedSizes);
      prevColorsRef.current = usedColors;
      prevSizesRef.current = usedSizes;
      didInit.current = true;
    }
    // eslint-disable-next-line
  }, [combinations]);

  const handleSelectionChange = (newColors: string[], newSizes: string[]) => {
    const prevColors = prevColorsRef.current;
    const prevSizes = prevSizesRef.current;
    let updated = [...combinations];

    // Colors: find added and removed
    const addedColors = newColors.filter(c => !prevColors.includes(c));
    const removedColors = prevColors.filter(c => !newColors.includes(c));
    // Sizes: find added and removed
    const addedSizes = newSizes.filter(s => !prevSizes.includes(s));
    const removedSizes = prevSizes.filter(s => !newSizes.includes(s));

    // Add combinations for newly added colors
    addedColors.forEach(colorId => {
      newSizes.forEach(sizeId => {
        if (!updated.some(c => c.colorId === colorId && c.sizeId === sizeId)) {
          updated.push({ colorId, sizeId, applyDomainChanges: itemApplyChanges});
        }
      });
    });
    // Add combinations for newly added sizes
    addedSizes.forEach(sizeId => {
      newColors.forEach(colorId => {
        if (!updated.some(c => c.colorId === colorId && c.sizeId === sizeId)) {
          updated.push({ colorId, sizeId, applyDomainChanges: itemApplyChanges });
        }
      });
    });
    // Remove combinations for removed colors
    if (removedColors.length > 0) {
      updated = updated.filter(c => !removedColors.includes(c.colorId));
    }
    // Remove combinations for removed sizes
    if (removedSizes.length > 0) {
      updated = updated.filter(c => !removedSizes.includes(c.sizeId));
    }

    setSelectedColors(newColors);
    setSelectedSizes(newSizes);
    prevColorsRef.current = newColors;
    prevSizesRef.current = newSizes;
    onChange(updated);
  };

  useEffect(() => {
    // Remove combinations if their color/size is no longer selected
    const stillValid = combinations.filter(
      c => selectedColors.includes(c.colorId) && selectedSizes.includes(c.sizeId)
    );
    if (stillValid.length !== combinations.length) onChange(stillValid);
    // eslint-disable-next-line
  }, [selectedColors, selectedSizes]);

  /* ------------------------ data helpers --------------------------- */
  const fetchColorsAndSizes = async () => {
    try {
      const [colorsResult, sizesResult] = await Promise.all([getColors(), getSizes()]);
      if (colorsResult?.isSuccess) setColors(colorsResult.result);
      if (sizesResult?.isSuccess) setSizes(sizesResult.result);
    } catch (err) {
      console.error('Error fetching colors/sizes', err);
    }
  };

  const colorMap = Object.fromEntries(colors.map(c => [c.id, c]));
  const sizeMap = Object.fromEntries(sizes.map(s => [s.id, s]));

  /* --------------------------- render ------------------------------ */
  return (
    <ExpandableCard
      title={handleTranslate('SubDomain Combination Builder')}
      icon={<SettingsIcon color="primary" />}
      defaultExpanded={false}
    >
      {/* --- selectors & switch --- */}
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} md={6}>
          <InputAutoComplete
            options={colors.map(c => ({
              label: `${c.name} (${c.code})`,
              value: c.id
            }))}
            label={handleTranslate('Colors')}
            value={selectedColors}
            onChange={(v: string[] | null) => handleSelectionChange(v ?? [], selectedSizes)}
            multiple
            handleBlur={null}
            disabled={formType === FormTypes.Details}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputAutoComplete
            options={sizes.map(s => ({
              label: `${s.name} (${s.code})`,
              value: s.id
            }))}
            label={handleTranslate('Sizes')}
            value={selectedSizes}
            onChange={(v: string[] | null) => handleSelectionChange(selectedColors, v ?? [])}
            multiple
            handleBlur={null}
            disabled={formType === FormTypes.Details}
          />
        </Grid>
      </Grid>

      <FormControlLabel
        sx={{ mb: 2 }}
        control={
          <Switch
            checked={itemApplyChanges ?? true}
            onChange={e => onItemApplyChanges(e.target.checked)}
            disabled={formType === FormTypes.Details}
          />
        }
        label={handleTranslate('Apply Domain Changes to New Combinations')}
      />

      {/* Add button */}
      {formType !== FormTypes.Details && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          {/* ... add button code ... */}
        </Box>
      )}

      {/* --- combinations table --- */}
      {combinations.length > 0 && (
        <Box mt={4}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="subtitle1" color="primary" fontWeight={600}>
              {handleTranslate('Generated Combinations')} ({combinations.length})
            </Typography>

            <Chip
              label={`${selectedColors.length} × ${selectedSizes.length} = ${
                selectedColors.length * selectedSizes.length
              }`}
              color="info"
              variant="outlined"
            />
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 360 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['#', 'Color', 'Size', 'Code', 'Apply', ''].map(col => (
                    <TableCell
                      key={col}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 700
                      }}
                      align={col === '' ? 'center' : 'left'}
                    >
                      {handleTranslate(col)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {combinations.map((c, i) => {
                  const color = colorMap[c.colorId];
                  const size = sizeMap[c.sizeId];
                  return (
                    <TableRow key={i} hover>
                      <TableCell>{i + 1}</TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              border: 1,
                              borderColor: 'divider',
                              bgcolor: color?.colorValue ?? '#ccc'
                            }}
                          />
                          <span>
                            {color?.name} ({color?.code})
                          </span>
                        </Box>
                      </TableCell>

                      <TableCell>
                        {size?.name} ({size?.code})
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`${color?.code}-${size?.code}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>

                      <TableCell>
                        <Switch
                          checked={c.applyDomainChanges}
                          onChange={e => {
                            const next = [...combinations];
                            next[i].applyDomainChanges = e.target.checked;
                            onChange(next);
                          }}
                          size="small"
                          color="primary"
                          disabled={formType === FormTypes.Details}
                        />
                      </TableCell>

                      <TableCell align="center">
                        {(!c.isExisting && formType !== FormTypes.Details) && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              onChange(combinations.filter((_, idx) => idx !== i))
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* --- empty states --- */}
      {selectedColors.length > 0 && selectedSizes.length > 0 && combinations.length === 0 && (
        <Typography align="center" sx={{ py: 4 }} variant="body2" color="text.secondary">
          {handleTranslate('Select colors and sizes above to generate combinations')}
        </Typography>
      )}
      {selectedColors.length === 0 && selectedSizes.length === 0 && (
        <Typography align="center" sx={{ py: 4 }} variant="body2" color="text.secondary">
          {handleTranslate('No colors or sizes selected')}
        </Typography>
      )}
    </ExpandableCard>
  );
};

export default SubDomainCombinationBuilder;
