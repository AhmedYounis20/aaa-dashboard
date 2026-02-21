import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getAttributeDefinitions } from "../../../../../Apis/Inventory/AttributeDefinitionsApi";
import { getAttributeValues } from "../../../../../Apis/Inventory/AttributeValuesApi";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import AttributeDefinitionModel from "../../../../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel";
import AttributeValueModel from "../../../../../interfaces/ProjectInterfaces/Inventory/AttributeValues/AttributeValueModel";
import ProductAttributeDefinitionModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductAttributeDefinitionModel";

interface Props {
  productAttributeDefinitions: ProductAttributeDefinitionModel[];
  onChange: (
    productAttributeDefinitions: ProductAttributeDefinitionModel[],
  ) => void;
  handleTranslate: (key: string) => string;
  formType: FormTypes;
  selectedAttributeValues?: Record<string, string[]>;
  onSelectedAttributeValuesChange?: (v: Record<string, string[]>) => void;
}

const ProductAttributeDefinitionsSelector: React.FC<Props> = ({
  productAttributeDefinitions,
  onChange,
  handleTranslate,
  formType,
  selectedAttributeValues = {},
  onSelectedAttributeValuesChange,
}) => {
  const theme = useTheme();
  const [attributeDefinitions, setAttributeDefinitions] = useState<
    AttributeDefinitionModel[]
  >([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValueModel[]>(
    [],
  );

  useEffect(() => {
    fetchAttributeDefinitions();
  }, []);

  useEffect(() => {
    if (attributeDefinitions.length > 0) {
      fetchAttributeValues();
    }
  }, [attributeDefinitions]);

  const fetchAttributeDefinitions = async () => {
    try {
      const result = await getAttributeDefinitions();
      if (result?.isSuccess) {
        setAttributeDefinitions(result.result);
      }
    } catch (err) {
      console.error("Error fetching attribute definitions", err);
    }
  };

  const fetchAttributeValues = async () => {
    try {
      const result = await getAttributeValues();
      if (result?.isSuccess) {
        setAttributeValues(result.result);
      }
    } catch (err) {
      console.error("Error fetching attribute values", err);
    }
  };

  const getValuesForDefinition = (attributeDefinitionId: string) => {
    return attributeValues.filter(
      (av) => av.attributeDefinitionId === attributeDefinitionId,
    );
  };

  const availableToAdd = attributeDefinitions.filter(
    (ad) =>
      !productAttributeDefinitions.some(
        (pad) => pad.attributeDefinitionId === ad.id,
      ),
  );

  const handleAddRow = (attributeDefinitionId?: string) => {
    const def = attributeDefinitions.find(
      (ad) => ad.id === attributeDefinitionId,
    );
    const newRow: ProductAttributeDefinitionModel = {
      attributeDefinitionId: attributeDefinitionId ?? "",
      attributeDefinition: def,
      isVariant: true,
    };
    onChange([...productAttributeDefinitions, newRow]);
  };

  const handleRemoveRow = (rowIndex: number) => {
    const pad = productAttributeDefinitions[rowIndex];
    if (pad == null) return;
    onChange(productAttributeDefinitions.filter((_, i) => i !== rowIndex));
    if (onSelectedAttributeValuesChange && pad.attributeDefinitionId) {
      const next = { ...selectedAttributeValues };
      delete next[pad.attributeDefinitionId];
      onSelectedAttributeValuesChange(next);
    }
  };

  const handleIsVariantChange = (
    attributeDefinitionId: string,
    isVariant: boolean,
  ) => {
    const updated = productAttributeDefinitions.map((pad) =>
      pad.attributeDefinitionId === attributeDefinitionId
        ? { ...pad, isVariant }
        : pad,
    );
    onChange(updated);
  };

  const handleValuesChange = (
    attributeDefinitionId: string,
    valueIds: string[],
  ) => {
    if (!onSelectedAttributeValuesChange) return;
    onSelectedAttributeValuesChange({
      ...selectedAttributeValues,
      [attributeDefinitionId]: valueIds,
    });
  };

  const handleAttributeChange = (
    rowIndex: number,
    currentAttributeDefinitionId: string,
    newAttributeDefinitionId: string | null,
  ) => {
    if (
      !newAttributeDefinitionId ||
      newAttributeDefinitionId === currentAttributeDefinitionId
    )
      return;
    const def = attributeDefinitions.find(
      (ad) => ad.id === newAttributeDefinitionId,
    );
    const updated = productAttributeDefinitions.map((pad, i) =>
      i === rowIndex
        ? {
            ...pad,
            attributeDefinitionId: newAttributeDefinitionId,
            attributeDefinition: def,
          }
        : pad,
    );
    onChange(updated);
    if (onSelectedAttributeValuesChange) {
      const next = { ...selectedAttributeValues };
      delete next[currentAttributeDefinitionId];
      next[newAttributeDefinitionId] = next[newAttributeDefinitionId] ?? [];
      onSelectedAttributeValuesChange(next);
    }
  };

  const getAttributeOptionsForRow = (currentAttributeDefinitionId: string) =>
    attributeDefinitions.filter(
      (ad) =>
        ad.id === currentAttributeDefinitionId ||
        !productAttributeDefinitions.some(
          (pad) => pad.attributeDefinitionId === ad.id,
        ),
    );

  return (
    <Card
      variant='outlined'
      sx={{
        borderRadius: 1.5,
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        mb: 1,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            p: 3,
          }}
        >
          <Box>
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "1rem",
              }}
            >
              {handleTranslate("AttributesAndVariants")}
            </Typography>
          </Box>
          {formType !== FormTypes.Details && availableToAdd.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant='outlined'
                size='small'
                startIcon={<Add />}
                onClick={() => handleAddRow()}
                sx={{
                  borderRadius: "0.5rem",
                  textTransform: "none",
                  color: "text.primary",
                  borderColor: "divider",
                  px: "0.625rem",
                  py: "0.175rem",
                  "&:hover": {
                    borderColor: "divider",
                    boxShadow: "none",
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              >
                {handleTranslate("Add Row")}
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ px: 3 }}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 1.5,
              boxShadow: "none",
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
              backgroundColor: "transparent",
              maxHeight: "500px",
              overflowX: "auto",
              overflowY: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 100,
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      lineHeight: "normal",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      py: 1.5,
                    }}
                  >
                    {handleTranslate("Attribute")}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{
                      lineHeight: "normal",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      py: 1.5,
                    }}
                  >
                    {handleTranslate("Values")}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{
                      lineHeight: "normal",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      py: 1.5,
                    }}
                  >
                    {handleTranslate("Apply")}
                  </TableCell>
                  {formType !== FormTypes.Details && (
                    <TableCell
                      align='center'
                      sx={{
                        lineHeight: "normal",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        color: "text.secondary",
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        py: 1.5,
                      }}
                    >
                      {handleTranslate("Operations")}
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {productAttributeDefinitions.map((pad, index) => {
                  const valueOptions = getValuesForDefinition(
                    pad.attributeDefinitionId,
                  );
                  const selectedIds =
                    onSelectedAttributeValuesChange &&
                    selectedAttributeValues[pad.attributeDefinitionId];
                  return (
                    <TableRow
                      key={`row-${index}-${pad.attributeDefinitionId || "new"}`}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell sx={{ minWidth: 150, verticalAlign: "top" }}>
                        <InputAutoComplete
                          size='small'
                          options={getAttributeOptionsForRow(
                            pad.attributeDefinitionId,
                          ).map((ad) => ({
                            label: ad.name,
                            value: ad.id ?? "",
                          }))}
                          label=''
                          value={pad.attributeDefinitionId}
                          onChange={(v: string | null) =>
                            handleAttributeChange(
                              index,
                              pad.attributeDefinitionId,
                              v ?? null,
                            )
                          }
                          multiple={false}
                          handleBlur={null}
                          disabled={formType === FormTypes.Details}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 400, verticalAlign: "top" }}>
                        {onSelectedAttributeValuesChange ? (
                          <InputAutoComplete
                            size='small'
                            options={valueOptions.map((av) => ({
                              label: av.name,
                              value: av.id ?? "",
                            }))}
                            label=''
                            value={
                              Array.isArray(selectedIds) ? selectedIds : []
                            }
                            onChange={(v: string[] | null) =>
                              handleValuesChange(
                                pad.attributeDefinitionId,
                                v ?? [],
                              )
                            }
                            multiple
                            handleBlur={null}
                            disabled={formType === FormTypes.Details}
                          />
                        ) : (
                          <Typography variant='body2' color='text.secondary'>
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        align='center'
                        sx={{ minWidth: 50, verticalAlign: "top" }}
                      >
                        <Checkbox
                          size='small'
                          checked={!!pad.isVariant}
                          onChange={(e) =>
                            handleIsVariantChange(
                              pad.attributeDefinitionId,
                              e.target.checked,
                            )
                          }
                          disabled={formType === FormTypes.Details}
                          color='primary'
                        />
                      </TableCell>
                      {formType !== FormTypes.Details && (
                        <TableCell
                          align='center'
                          sx={{ verticalAlign: "center", width: 50 }}
                        >
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => handleRemoveRow(index)}
                            sx={{
                              borderRadius: ".325rem",
                              color: theme.palette.error.main,
                              "&:hover": { color: theme.palette.error.main },
                            }}
                          >
                            <RiDeleteBin6Line fontSize='medium' />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {productAttributeDefinitions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align='center'>
                      <Typography variant='body2' color='text.secondary'>
                        {handleTranslate("NoAttributesAndVariantsAdded")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductAttributeDefinitionsSelector;
