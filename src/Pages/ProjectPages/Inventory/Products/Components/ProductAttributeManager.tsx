import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Checkbox,
  FormGroup,
  Paper,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import { getAttributeDefinitions } from '../../../../../Apis/Inventory/AttributeDefinitionsApi';
import { ApiResult } from '../../../../../interfaces/ApiResponse';
import AttributeDefinitionModel from '../../../../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel';

interface ProductAttributeManagerProps {
  productId?: string;
  selectedAttributes: ProductAttributeSelection[];
  onAttributesChange: (attributes: ProductAttributeSelection[]) => void;
}

export interface ProductAttributeSelection {
  attributeDefinitionId: string;
  attributeDefinition: AttributeDefinitionModel;
  isVariant: boolean;
  isSelected: boolean;
}

const ProductAttributeManager: React.FC<ProductAttributeManagerProps> = ({
  selectedAttributes,
  onAttributesChange,
}) => {
  const [availableAttributes, setAvailableAttributes] = useState<AttributeDefinitionModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableAttributes();
  }, []);

  const loadAvailableAttributes = async () => {
    try {
      setLoading(true);
      const result: ApiResult<AttributeDefinitionModel[]> = await getAttributeDefinitions();
      if (result.isSuccess && result.result) {
        setAvailableAttributes(result.result);
        
        // Initialize selected attributes if not provided
        if (selectedAttributes.length === 0) {
          const initialSelections: ProductAttributeSelection[] = result.result.map(attr => ({
            attributeDefinitionId: attr.id,
            attributeDefinition: attr,
            isVariant: false,
            isSelected: false,
          }));
          onAttributesChange(initialSelections);
        }
      }
    } catch (error) {
      console.error('Error loading available attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeSelection = (attributeId: string, isSelected: boolean) => {
    const updatedAttributes = selectedAttributes.map(attr => 
      attr.attributeDefinitionId === attributeId 
        ? { ...attr, isSelected, isVariant: isSelected ? attr.isVariant : false }
        : attr
    );
    onAttributesChange(updatedAttributes);
  };

  const handleVariantToggle = (attributeId: string, isVariant: boolean) => {
    const updatedAttributes = selectedAttributes.map(attr => 
      attr.attributeDefinitionId === attributeId 
        ? { ...attr, isVariant }
        : attr
    );
    onAttributesChange(updatedAttributes);
  };

  const getVariantAttributes = () => {
    return selectedAttributes.filter(attr => attr.isSelected && attr.isVariant);
  };

  const getSelectedAttributes = () => {
    return selectedAttributes.filter(attr => attr.isSelected);
  };

  const getVariantCombinationsCount = () => {
    const variantAttributes = getVariantAttributes();
    if (variantAttributes.length === 0) return 0;
    
    return variantAttributes.reduce((total, attr) => {
      return total * (attr.attributeDefinition.predefinedValues?.length ?? 0);
    }, 1);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>Loading attributes...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Product Attributes
      </Typography>
      
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Select which attributes apply to this product. Mark attributes as "Variant" to generate product variants automatically.
      </Typography>

      <FormGroup>
        {availableAttributes.map((attribute) => {
          const selection = selectedAttributes.find(attr => attr.attributeDefinitionId === attribute.id);
          if (!selection) return null;

          return (
            <Box key={attribute.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selection.isSelected}
                      onChange={(e) => handleAttributeSelection(attribute.id, e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {attribute.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {attribute.nameSecondLanguage} • {(attribute.predefinedValues?.length ?? 0)} values
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              {selection.isSelected && (
                <Box sx={{ ml: 4 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selection.isVariant}
                        onChange={(e) => handleVariantToggle(attribute.id, e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Generate variants for this attribute"
                  />
                  
                  {selection.isVariant && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Available values: {attribute.predefinedValues?.map(v => v.name).join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ width: '100%' }}>
          Summary:
        </Typography>
        <Chip
          label={`${getSelectedAttributes().length} attributes selected`}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`${getVariantAttributes().length} variant attributes`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          label={`${getVariantCombinationsCount()} possible variants`}
          color="success"
          variant="outlined"
        />
      </Box>

      {getVariantCombinationsCount() > 100 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Warning: This will generate {getVariantCombinationsCount()} variants. Consider reducing the number of variant attributes.
        </Alert>
      )}

      {getVariantAttributes().length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Variant Generation:</strong> The system will automatically create variants for all combinations of the selected variant attributes.
            Each variant will have a unique combination of attribute values.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default ProductAttributeManager;



