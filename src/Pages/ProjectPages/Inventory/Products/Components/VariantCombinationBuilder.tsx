import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Grid,
  Switch,
  Typography,
  Chip,
  IconButton,
  Box,
  TextField
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Delete as DeleteIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import ExpandableCard from '../../../../../Components/UI/ExpandableCard';
import InputAutoComplete from '../../../../../Components/Inputs/InputAutoCompelete';
import {v4 as uuid} from 'uuid';
import { getAttributeDefinitions } from '../../../../../Apis/Inventory/AttributeDefinitionsApi';
import { getAttributeValues } from '../../../../../Apis/Inventory/AttributeValuesApi';

// import { AttributeDefinitionDto } from '../../../../../interfaces/ProjectInterfaces/Inventory/Attributes/AttributeDefinitionDto';
import AttributeDefinitionModel from '../../../../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel';
import  AttributeValueModel  from '../../../../../interfaces/ProjectInterfaces/Inventory/AttributeValues/AttributeValueModel';
import ProductAttributeDefinitionModel from '../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductAttributeDefinitionModel';
import { FormTypes } from '../../../../../interfaces/Components/FormType';

interface VariantCombination {
  id: string;
  name: string;
  attributeValues: { [attributeDefinitionId: string]: string }; // attributeDefinitionId -> attributeValueId
  applyProductChanges: boolean;
  isExisting?: boolean;
}

interface VariantCombinationRow {
  id: string;
  index: number;
  name: string;
  comboKey: string;
  attributeValues: { [attributeDefinitionId: string]: string };
  applyProductChanges: boolean;
  isExisting?: boolean;
}

interface Props {
  combinations: VariantCombination[];
  onChange: (combinations: VariantCombination[]) => void;
  onProductApplyChanges: (val: boolean) => void;
  handleTranslate: (key: string) => string;
  formType: FormTypes;
  productApplyChanges: boolean;
  productName: string;
  productAttributeDefinitions: ProductAttributeDefinitionModel[];
}

const VariantCombinationBuilder: React.FC<Props> = ({
  combinations,
  onChange,
  // onProductApplyChanges,
  productApplyChanges,
  handleTranslate,
  formType,
  productName,
  productAttributeDefinitions
}) => {
  /* ----------------------------- state ----------------------------- */
  const [attributeDefinitions, setAttributeDefinitions] = useState<AttributeDefinitionModel[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValueModel[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string[] }>({}); // attributeDefinitionId -> attributeValueIds[]
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const prevAttributesRef = useRef<{ [key: string]: string[] }>({});
  const didInit = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attributeDefinitionNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    attributeDefinitions.forEach(def => {
      map[def.id] = def.name;
    });
    return map;
  }, [attributeDefinitions]);

  const attributeValueNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    attributeValues.forEach(val => {
      if (val.id) {
        map[val.id] = val.name;
      }
    });
    return map;
  }, [attributeValues]);

  const attributeValuesByDefinition = useMemo(() => {
    const map: Record<string, AttributeValueModel[]> = {};
    attributeValues.forEach(val => {
      if (!map[val.attributeDefinitionId]) {
        map[val.attributeDefinitionId] = [];
      }
      map[val.attributeDefinitionId].push(val);
    });
    return map;
  }, [attributeValues]);

  /* --------------------------- effects ----------------------------- */
  useEffect(() => {
    fetchAttributeDefinitions();
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (attributeDefinitions.length > 0) {
      fetchAttributeValues();
    }
  }, [attributeDefinitions]);

  // When combinations change (e.g., on update), set selected attributes to those used in combinations, but only on first mount
  useEffect(() => {
    if (!didInit.current && combinations.length > 0) {
      const usedAttributes: { [key: string]: string[] } = {};
      combinations.forEach(combo => {
        Object.keys(combo.attributeValues).forEach(attrDefId => {
          if (!usedAttributes[attrDefId]) {
            usedAttributes[attrDefId] = [];
          }
          if (!usedAttributes[attrDefId].includes(combo.attributeValues[attrDefId])) {
            usedAttributes[attrDefId].push(combo.attributeValues[attrDefId]);
          }
        });
      });
      setSelectedAttributes(usedAttributes);
      prevAttributesRef.current = usedAttributes;
      didInit.current = true;
    }
    // eslint-disable-next-line
  }, [combinations]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(combinations.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [combinations.length, page, rowsPerPage]);

  const handleAttributeSelectionChange = (attributeDefinitionId: string, newValueIds: string[]) => {
    // Update selected attributes first
    const updatedSelectedAttributes = {
      ...selectedAttributes,
      [attributeDefinitionId]: newValueIds
    };
    setSelectedAttributes(updatedSelectedAttributes);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const newCombinations = buildCombinations(updatedSelectedAttributes, combinations);
      onChange(newCombinations);
    }, 300);
  };

  const getVariantAttributeDefinitionIds = () => {
    return productAttributeDefinitions
      .filter(pad => pad.isVariant)
      .map(pad => pad.attributeDefinitionId);
  };

  useEffect(() => {
    const variantIds = getVariantAttributeDefinitionIds();
    const selectionsReady = Object.keys(selectedAttributes).length > 0;

    // If combinations are already loaded (update flow) but selections aren't initialized yet,
    // avoid rebuilding/clearing until the combinations-based init runs.
    if (combinations.length > 0 && !selectionsReady) {
      return;
    }

    // Remove selections for attribute definitions that are no longer variants
    const nextSelectedAttributes: { [key: string]: string[] } = {};
    Object.entries(selectedAttributes).forEach(([attrDefId, valueIds]) => {
      if (variantIds.includes(attrDefId)) {
        nextSelectedAttributes[attrDefId] = valueIds;
      }
    });

    const selectionChanged =
      Object.keys(nextSelectedAttributes).length !== Object.keys(selectedAttributes).length ||
      Object.keys(nextSelectedAttributes).some(
        key => (selectedAttributes[key] || []).length !== (nextSelectedAttributes[key] || []).length
      );

    if (selectionChanged) {
      setSelectedAttributes(nextSelectedAttributes);
    }

    // Rebuild combinations based on current (filtered) selections
    if (variantIds.length === 0) {
      if (combinations.length > 0) {
        // Avoid clearing existing combinations during initial load before variants are known.
        if (!didInit.current) {
          return;
        }
        onChange([]);
      }
      return;
    }

    const nextCombinations = buildCombinations(nextSelectedAttributes, combinations);
    const shouldUpdate =
      nextCombinations.length !== combinations.length ||
      nextCombinations.some((combo, idx) => {
        const existing = combinations[idx];
        if (!existing) return true;
        const existingKeys = Object.keys(existing.attributeValues);
        const nextKeys = Object.keys(combo.attributeValues);
        if (existingKeys.length !== nextKeys.length) return true;
        return nextKeys.some(key => existing.attributeValues[key] !== combo.attributeValues[key]);
      });

    if (shouldUpdate) {
      onChange(nextCombinations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productAttributeDefinitions]);

  const getCombinationKey = useCallback((attributeValuesMap: { [key: string]: string }) => {
    const sortedKeys = Object.keys(attributeValuesMap).sort();
    return sortedKeys.map(key => `${key}=${attributeValuesMap[key]}`).join('|');
  }, []);

  const generateVariantName = useCallback((attributeValuesMap: { [key: string]: string }) => {
    const valueNames: string[] = [];
    Object.entries(attributeValuesMap).forEach(([attrDefId, valueId]) => {
      const defName = attributeDefinitionNameMap[attrDefId];
      const valueName = attributeValueNameMap[valueId];
      if (defName && valueName) {
        valueNames.push(`${defName}: ${valueName}`);
      }
    });
    return `${productName} - ${valueNames.join(', ')}`;
  }, [attributeDefinitionNameMap, attributeValueNameMap, productName]);

  const generateAllCombinations = useCallback((attributes: { [key: string]: string[] }) => {
    const combinations: VariantCombination[] = [];
    const attributeIds = Object.keys(attributes);
    
    if (attributeIds.length === 0) {
      return combinations;
    }
    
    // Generate cartesian product of all selected attribute values
    const cartesianProduct = generateCartesianProduct(attributeIds, attributes);
    
    cartesianProduct.forEach(combo => {
      const name = generateVariantName(combo);
      combinations.push({
        id: uuid(),
        name,
        attributeValues: combo,
        applyProductChanges: productApplyChanges
      });
    });
    
    return combinations;
  }, [generateVariantName, getCombinationKey, productApplyChanges]);

  const buildCombinations = useCallback((attributes: { [key: string]: string[] }, existing: VariantCombination[]) => {
    const existingMap = new Map<string, VariantCombination>();
    existing.forEach(combo => {
      existingMap.set(getCombinationKey(combo.attributeValues), combo);
    });

    return generateAllCombinations(attributes).map(combo => {
      const key = getCombinationKey(combo.attributeValues);
      const existingCombo = existingMap.get(key);
      if (existingCombo) {
        return {
          ...combo,
          id: existingCombo.id,
          applyProductChanges: existingCombo.applyProductChanges,
          isExisting: existingCombo.isExisting
        };
      }
      return combo;
    });
  }, [generateAllCombinations, getCombinationKey]);

  const generateCartesianProduct = (attributeIds: string[], attributes: { [key: string]: string[] }) => {
    if (attributeIds.length === 0) return [{}];
    
    const firstId = attributeIds[0];
    const restIds = attributeIds.slice(1);
    const restCombinations = generateCartesianProduct(restIds, attributes);
    
    const combinations: { [key: string]: string }[] = [];
    attributes[firstId]?.forEach(valueId => {
      restCombinations.forEach(restCombo => {
        combinations.push({ ...restCombo, [firstId]: valueId });
      });
    });
    
    return combinations;
  };

  const getVariantAttributeDefinitions = useMemo(() => {
    const variantAttributeDefinitionIds = getVariantAttributeDefinitionIds();
    return attributeDefinitions.filter(ad => variantAttributeDefinitionIds.includes(ad.id));
  }, [attributeDefinitions, productAttributeDefinitions]);

  // const isSameCombination = (combo1: VariantCombination, combo2: VariantCombination) => {
  //   const keys1 = Object.keys(combo1.attributeValues).sort();
  //   const keys2 = Object.keys(combo2.attributeValues).sort();
    
  //   if (keys1.length !== keys2.length) return false;
    
  //   return keys1.every(key => combo1.attributeValues[key] === combo2.attributeValues[key]);
  // };

  /* ------------------------ data helpers --------------------------- */
  // const convertDtoToModel = (dto: AttributeDefinitionDto): AttributeDefinitionModel => ({
  //   id: dto.id,
  //   code: dto.code,
  //   name: dto.name,
  //   nameSecondLanguage: dto.nameSecondLanguage,
  //   dataType: dto.dataType,
  //   isActive: dto.isActive,
  //   predefinedValues: dto.predefinedValues,
  //   createdAt: dto.createdAt,
  //   modifiedAt: dto.modifiedAt,
  //   createdByName: dto.createdByName,
  //   createdByNameSecondLanguage: dto.createdByNameSecondLanguage,
  //   modifiedByName: dto.modifiedByName,
  //   modifiedByNameSecondLanguage: dto.modifiedByNameSecondLanguage
  // });

  const fetchAttributeDefinitions = async () => {
    try {
      const result = await getAttributeDefinitions();
      if (result?.isSuccess) {
        const models = result.result;//.map(convertDtoToModel);
        // const models = result.result.map(convertDtoToModel);
        setAttributeDefinitions(models);
      }
    } catch (err) {
      console.error('Error fetching attribute definitions', err);
    }
  };

  const fetchAttributeValues = async () => {
    try {
      const result = await getAttributeValues();
      if (result?.isSuccess) {
        setAttributeValues(result.result);
      }
    } catch (err) {
      console.error('Error fetching attribute values', err);
    }
  };

  const getAttributeValuesForDefinition = (attributeDefinitionId: string) => {
    return attributeValuesByDefinition[attributeDefinitionId] || [];
  };

  const handleToggleApply = useCallback((comboKey: string, checked: boolean) => {
    const next = combinations.map(combo =>
      getCombinationKey(combo.attributeValues) === comboKey
        ? { ...combo, applyProductChanges: checked }
        : combo
    );
    onChange(next);
  }, [combinations, getCombinationKey, onChange]);

  const handleDeleteCombination = useCallback((comboKey: string) => {
    onChange(combinations.filter(combo => getCombinationKey(combo.attributeValues) !== comboKey));
  }, [combinations, getCombinationKey, onChange]);

  const rows = useMemo<VariantCombinationRow[]>(() => {
    return combinations.map((combo, index) => ({
      id: combo.id,
      index: index + 1,
      name: productName,
      comboKey: getCombinationKey(combo.attributeValues),
      attributeValues: combo.attributeValues,
      applyProductChanges: combo.applyProductChanges,
      isExisting: combo.isExisting
    }));
  }, [combinations, getCombinationKey, productName]);

  const columns: GridColDef<VariantCombinationRow>[] = useMemo(() => ([
    {
      field: 'index',
      headerName: handleTranslate('#'),
      width: 70,
      sortable: false,
      filterable: false
    },
    {
      field: 'name',
      headerName: handleTranslate('Name'),
      flex: 1,
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <TextField
          value={productName}
          size="small"
          fullWidth
          disabled
          variant="outlined"
        />
      )
    },
    {
      field: 'attributes',
      headerName: handleTranslate('Attributes'),
      flex: 2,
      minWidth: 260,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {Object.entries(params.row.attributeValues).map(([attrDefId, valueId]) => (
            <Chip
              key={`${attrDefId}-${valueId}`}
              label={`${attributeDefinitionNameMap[attrDefId] || 'Unknown'}: ${attributeValueNameMap[valueId] || 'Unknown'}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>
      )
    },
    {
      field: 'applyProductChanges',
      headerName: handleTranslate('Apply'),
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Switch
          checked={params.row.applyProductChanges}
          onChange={e => handleToggleApply(params.row.comboKey, e.target.checked)}
          size="small"
          color="primary"
          disabled={formType === FormTypes.Details}
        />
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 70,
      sortable: false,
      filterable: false,
      align: 'center',
      renderCell: (params) => (
        formType !== FormTypes.Details ? (
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteCombination(params.row.comboKey)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        ) : null
      )
    }
  ]), [
    attributeDefinitionNameMap,
    attributeValueNameMap,
    formType,
    handleDeleteCombination,
    handleToggleApply,
    handleTranslate,
    productName
  ]);

  /* --------------------------- render ------------------------------ */
  return (
    <ExpandableCard
      title={handleTranslate('Variant Combination Builder')}
      icon={<SettingsIcon color="primary" />}
      defaultExpanded={false}
    >
      {/* --- attribute selectors --- */}
      <Grid container spacing={3} mb={2}>
        {getVariantAttributeDefinitions.map(attrDef => (
          <Grid item xs={12} md={6} key={attrDef.id}>
            <InputAutoComplete
              options={getAttributeValuesForDefinition(attrDef.id).map(av => ({
                label: `${av.name} (${av.id?.slice(0, 8)})`,
                // label: `${av.name} (${av.code || av.id.slice(0, 8)})`,
                value: av.id
              }))}
              label={attrDef.name}
              value={selectedAttributes[attrDef.id] || []}
              onChange={(v: string[] | null) => handleAttributeSelectionChange(attrDef.id, v ?? [])}
              multiple
              handleBlur={null}
              disabled={formType === FormTypes.Details}
            />
          </Grid>
        ))}
      </Grid>

      {/* <FormControlLabel
        sx={{ mb: 2 }}
        control={
          <Switch
            checked={productApplyChanges ?? true}
            onChange={e => onProductApplyChanges(e.target.checked)}
            disabled={formType === FormTypes.Details}
          />
        }
        label={handleTranslate('Apply Product Changes to New Variants')}
      /> */}

      {/* --- combinations table --- */}
      {combinations.length > 0 && (
        <Box mt={4}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="subtitle1" color="primary" fontWeight={600}>
              {handleTranslate('Generated Variants')} ({combinations.length})
            </Typography>

            <Chip
              label={`${Object.keys(selectedAttributes).length} attributes selected`}
              color="info"
              variant="outlined"
            />
          </Box>

          <Box sx={{ height: 420, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pagination
              paginationModel={{ page, pageSize: rowsPerPage }}
              onPaginationModelChange={(model) => {
                setPage(model.page);
                setRowsPerPage(model.pageSize);
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              disableColumnResize
              getRowHeight={() => 'auto'}
              sx={(theme) => ({
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: theme.palette.grey[100],
                  color: theme.palette.text.primary,
                  fontWeight: 700
                },
                '& .MuiDataGrid-cell': {
                  py: 1
                }
              })}
            />
          </Box>
        </Box>
      )}

      {/* --- empty states --- */}
      {getVariantAttributeDefinitions.length === 0 && (
        <Typography align="center" sx={{ py: 4 }} variant="body2" color="text.secondary">
          {handleTranslate('No variant attributes configured. Please select attribute definitions and mark them as variant attributes in the Product Attribute Definitions section above.')}
        </Typography>
      )}
      {getVariantAttributeDefinitions.length > 0 && Object.keys(selectedAttributes).length > 0 && combinations.length === 0 && (
        <Typography align="center" sx={{ py: 4 }} variant="body2" color="text.secondary">
          {handleTranslate('Select attribute values above to generate variant combinations')}
        </Typography>
      )}
      {getVariantAttributeDefinitions.length > 0 && Object.keys(selectedAttributes).length === 0 && (
        <Typography align="center" sx={{ py: 4 }} variant="body2" color="text.secondary">
          {handleTranslate('No attribute values selected')}
        </Typography>
      )}
    </ExpandableCard>
  );
};

export default VariantCombinationBuilder;
