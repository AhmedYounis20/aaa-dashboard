import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Box,
  Alert
} from '@mui/material';
import {
  Settings as SettingsIcon
} from '@mui/icons-material';

import ExpandableCard from '../../../../../Components/UI/ExpandableCard';
import InputAutoComplete from '../../../../../Components/Inputs/InputAutoCompelete';

import { getAttributeDefinitions } from '../../../../../Apis/Inventory/AttributeDefinitionsApi';
// import { AttributeDefinitionDto } from '../../../../../interfaces/ProjectInterfaces/Inventory/Attributes/AttributeDefinitionDto';
import AttributeDefinitionModel from '../../../../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel';
import ProductAttributeDefinitionModel from '../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductAttributeDefinitionModel';
import { FormTypes } from '../../../../../interfaces/Components/FormType';

interface Props {
  productAttributeDefinitions: ProductAttributeDefinitionModel[];
  onChange: (productAttributeDefinitions: ProductAttributeDefinitionModel[]) => void;
  handleTranslate: (key: string) => string;
  formType: FormTypes;
}

const ProductAttributeDefinitionsSelector: React.FC<Props> = ({
  productAttributeDefinitions,
  onChange,
  handleTranslate,
  formType
}) => {
  const [attributeDefinitions, setAttributeDefinitions] = useState<AttributeDefinitionModel[]>([]);
  const [selectedAttributeDefinitionIds, setSelectedAttributeDefinitionIds] = useState<string[]>([]);

  useEffect(() => {
    fetchAttributeDefinitions();
  }, []);

  useEffect(() => {
    // Initialize selected attributes from existing product attribute definitions
    const selectedIds = productAttributeDefinitions.map(pad => pad.attributeDefinitionId);
    setSelectedAttributeDefinitionIds(selectedIds);
  }, [productAttributeDefinitions]);

  const fetchAttributeDefinitions = async () => {
    try {
      const result = await getAttributeDefinitions();
      if (result?.isSuccess) {
        const models = result.result;
        setAttributeDefinitions(models);
      }
    } catch (err) {
      console.error('Error fetching attribute definitions', err);
    }
  };

  const handleAttributeSelectionChange = (newSelectedIds: string[]) => {
    setSelectedAttributeDefinitionIds(newSelectedIds);
    
    // Create ProductAttributeDefinitionModel objects for selected attributes
    const newProductAttributeDefinitions: ProductAttributeDefinitionModel[] = newSelectedIds.map(attributeDefinitionId => {
      // Check if this attribute definition already exists
      const existing = productAttributeDefinitions.find(pad => pad.attributeDefinitionId === attributeDefinitionId);
      
      if (existing) {
        // Keep existing settings
        return existing;
      } else {
        // Create new with default settings
        return {
          id: '00000000-0000-0000-0000-000000000000', // Guid.Empty
          productId: '00000000-0000-0000-0000-000000000000', // Guid.Empty
          attributeDefinitionId,
          attributeDefinition: attributeDefinitions.find(ad => ad.id === attributeDefinitionId),
          isVariant: true, // Default to true for variant attributes
          createdAt: '',
          modifiedAt: ''
        };
      }
    });
    
    onChange(newProductAttributeDefinitions);
  };

  const handleIsVariantChange = (attributeDefinitionId: string, isVariant: boolean) => {
    const updated = productAttributeDefinitions.map(pad => 
      pad.attributeDefinitionId === attributeDefinitionId 
        ? { ...pad, isVariant }
        : pad
    );
    onChange(updated);
  };

  const getAttributeDefinitionName = (attributeDefinitionId: string) => {
    const definition = attributeDefinitions.find(ad => ad.id === attributeDefinitionId);
    return definition?.name || 'Unknown';
  };

  // const getAttributeDefinitionCode = (attributeDefinitionId: string) => {
  //   const definition = attributeDefinitions.find(ad => ad.id === attributeDefinitionId);
  //   return definition?.code || '';
  // };

  const variantAttributes = productAttributeDefinitions.filter(pad => pad.isVariant);
  const nonVariantAttributes = productAttributeDefinitions.filter(pad => !pad.isVariant);

  return (
    <ExpandableCard
      title={handleTranslate('Product Attribute Definitions')}
      icon={<SettingsIcon color="primary" />}
      defaultExpanded={true}
    >
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>{handleTranslate('ProductAttributeDefinitionsInfo')}:</strong> {handleTranslate('ProductAttributeDefinitionsDescription')}
        </Typography>
      </Alert>

      {/* Attribute Selection */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <InputAutoComplete
            options={attributeDefinitions.map(ad => ({
              label: `${ad.name} (${ad.id.slice(0,8)})`,
              value: ad.id
            }))}
            label={handleTranslate('Select Attribute Definitions')}
            value={selectedAttributeDefinitionIds}
            onChange={(v: string[] | null) => handleAttributeSelectionChange(v ?? [])}
            multiple
            handleBlur={null}
            disabled={formType === FormTypes.Details}
          />
        </Grid>
      </Grid>

      {/* Selected Attributes Configuration */}
      {productAttributeDefinitions.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {handleTranslate('Configure Selected Attributes')}
          </Typography>
          
          <Grid container spacing={2}>
            {productAttributeDefinitions.map((pad) => (
              <Grid item xs={12} md={6} key={pad.attributeDefinitionId}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {getAttributeDefinitionName(pad.attributeDefinitionId)}
                      </Typography>
                      {/* <Chip 
                        label={getAttributeDefinitionCode(pad.attributeDefinitionId)} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      /> */}
                    </Box>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={pad.isVariant}
                          onChange={(e) => handleIsVariantChange(pad.attributeDefinitionId, e.target.checked)}
                          disabled={formType === FormTypes.Details}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2">
                            {handleTranslate('Use for Variants')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pad.isVariant 
                              ? handleTranslate('Variants will have values for this attribute')
                              : handleTranslate('This attribute applies to the product only')
                            }
                          </Typography>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Summary */}
      {productAttributeDefinitions.length > 0 && (
        <Box mt={3}>
          <Alert severity="success">
            <Typography variant="body2">
              <strong>{handleTranslate('Summary')}:</strong>
            </Typography>
            <Typography variant="body2" component="div">
              • {handleTranslate('Total Attributes')}: {productAttributeDefinitions.length}
            </Typography>
            <Typography variant="body2" component="div">
              • {handleTranslate('Variant Attributes')}: {variantAttributes.length}
            </Typography>
            <Typography variant="body2" component="div">
              • {handleTranslate('Product-only Attributes')}: {nonVariantAttributes.length}
            </Typography>
            {variantAttributes.length > 0 && (
              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                <strong>{handleTranslate('Variant Attributes')}:</strong> {variantAttributes.map(va => getAttributeDefinitionName(va.attributeDefinitionId)).join(', ')}
              </Typography>
            )}
          </Alert>
        </Box>
      )}

      {/* Empty State */}
      {productAttributeDefinitions.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {handleTranslate('No attribute definitions selected')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {handleTranslate('Select attribute definitions above to configure them for this product')}
          </Typography>
        </Box>
      )}
    </ExpandableCard>
  );
};

export default ProductAttributeDefinitionsSelector;
