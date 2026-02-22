import {
  alpha,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 as uuid } from "uuid";
import { getAttributeDefinitions } from "../../../../../Apis/Inventory/AttributeDefinitionsApi";
import { getAttributeValues } from "../../../../../Apis/Inventory/AttributeValuesApi";

// import { AttributeDefinitionDto } from '../../../../../interfaces/ProjectInterfaces/Inventory/Attributes/AttributeDefinitionDto';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import AttributeDefinitionModel from "../../../../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel";
import AttributeValueModel from "../../../../../interfaces/ProjectInterfaces/Inventory/AttributeValues/AttributeValueModel";
import ProductAttributeDefinitionModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductAttributeDefinitionModel";

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
  selectedAttributeValues?: Record<string, string[]>;
  onSelectedAttributeValuesChange?: (v: Record<string, string[]>) => void;
}

const VariantCombinationBuilder: React.FC<Props> = ({
  combinations,
  onChange,
  productApplyChanges,
  handleTranslate,
  formType,
  productName,
  productAttributeDefinitions,
  selectedAttributeValues: selectedAttributeValuesProp = {},
  onSelectedAttributeValuesChange,
}) => {
  const [attributeDefinitions, setAttributeDefinitions] = useState<
    AttributeDefinitionModel[]
  >([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValueModel[]>(
    [],
  );
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string[];
  }>({});
  const theme = useTheme();

  const selectedAttributeValues =
    onSelectedAttributeValuesChange != null
      ? selectedAttributeValuesProp
      : selectedAttributes;

  const prevAttributesRef = useRef<{ [key: string]: string[] }>({});
  const didInit = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attributeDefinitionNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    attributeDefinitions.forEach((def) => {
      map[def.id] = def.name;
    });
    return map;
  }, [attributeDefinitions]);

  const attributeValueNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    attributeValues.forEach((val) => {
      if (val.id) {
        map[val.id] = val.name;
      }
    });
    return map;
  }, [attributeValues]);

  const attributeValuesByDefinition = useMemo(() => {
    const map: Record<string, AttributeValueModel[]> = {};
    attributeValues.forEach((val) => {
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
      combinations.forEach((combo) => {
        Object.keys(combo.attributeValues).forEach((attrDefId) => {
          if (!usedAttributes[attrDefId]) {
            usedAttributes[attrDefId] = [];
          }
          if (
            !usedAttributes[attrDefId].includes(
              combo.attributeValues[attrDefId],
            )
          ) {
            usedAttributes[attrDefId].push(combo.attributeValues[attrDefId]);
          }
        });
      });
      if (onSelectedAttributeValuesChange) {
        onSelectedAttributeValuesChange(usedAttributes);
      } else {
        setSelectedAttributes(usedAttributes);
      }
      prevAttributesRef.current = usedAttributes;
      didInit.current = true;
    }
    // eslint-disable-next-line
  }, [combinations]);

  const handleAttributeSelectionChange = (
    attributeDefinitionId: string,
    newValueIds: string[],
  ) => {
    // Update selected attributes first
    const updatedSelectedAttributes = {
      ...selectedAttributes,
      [attributeDefinitionId]: newValueIds,
    };
    setSelectedAttributes(updatedSelectedAttributes);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const newCombinations = buildCombinations(
        updatedSelectedAttributes,
        combinations,
      );
      onChange(newCombinations);
    }, 300);
  };

  const getVariantAttributeDefinitionIds = () => {
    return productAttributeDefinitions
      .filter((pad) => pad.isVariant)
      .map((pad) => pad.attributeDefinitionId);
  };

  useEffect(() => {
    const variantIds = getVariantAttributeDefinitionIds();
    const selectionsReady = Object.keys(selectedAttributeValues).length > 0;

    // If combinations are already loaded (update flow) but selections aren't initialized yet,
    // avoid rebuilding/clearing until the combinations-based init runs.
    if (combinations.length > 0 && !selectionsReady) {
      return;
    }

    // Remove selections for attribute definitions that are no longer variants
    const nextSelectedAttributes: { [key: string]: string[] } = {};
    Object.entries(selectedAttributeValues).forEach(([attrDefId, valueIds]) => {
      if (variantIds.includes(attrDefId)) {
        nextSelectedAttributes[attrDefId] = valueIds;
      }
    });

    const selectionChanged =
      onSelectedAttributeValuesChange == null &&
      (Object.keys(nextSelectedAttributes).length !==
        Object.keys(selectedAttributes).length ||
        Object.keys(nextSelectedAttributes).some(
          (key) =>
            (selectedAttributes[key] || []).length !==
            (nextSelectedAttributes[key] || []).length,
        ));

    if (selectionChanged) {
      setSelectedAttributes(nextSelectedAttributes);
    }

    // Rebuild combinations based on current (filtered) selections.
    // Only include attributes that have at least one value selected, so adding or
    // changing an attribute does not clear existing combinations until values are chosen.
    if (variantIds.length === 0) {
      if (combinations.length > 0) {
        if (!didInit.current) {
          return;
        }
        onChange([]);
      }
      return;
    }

    const attributesWithValues = Object.fromEntries(
      Object.entries(nextSelectedAttributes).filter(
        ([, ids]) => (ids?.length ?? 0) > 0,
      ),
    );
    const nextCombinations = buildCombinations(
      attributesWithValues,
      combinations,
    );
    const shouldUpdate =
      nextCombinations.length !== combinations.length ||
      nextCombinations.some((combo, idx) => {
        const existing = combinations[idx];
        if (!existing) return true;
        const existingKeys = Object.keys(existing.attributeValues);
        const nextKeys = Object.keys(combo.attributeValues);
        if (existingKeys.length !== nextKeys.length) return true;
        return nextKeys.some(
          (key) => existing.attributeValues[key] !== combo.attributeValues[key],
        );
      });

    if (shouldUpdate) {
      onChange(nextCombinations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productAttributeDefinitions, selectedAttributeValues]);

  const getCombinationKey = useCallback(
    (attributeValuesMap: { [key: string]: string }) => {
      const sortedKeys = Object.keys(attributeValuesMap).sort();
      return sortedKeys
        .map((key) => `${key}=${attributeValuesMap[key]}`)
        .join("|");
    },
    [],
  );

  const generateVariantName = useCallback(
    (attributeValuesMap: { [key: string]: string }) => {
      const valueNames: string[] = [];
      Object.entries(attributeValuesMap).forEach(([attrDefId, valueId]) => {
        const defName = attributeDefinitionNameMap[attrDefId];
        const valueName = attributeValueNameMap[valueId];
        if (defName && valueName) {
          valueNames.push(`${defName}: ${valueName}`);
        }
      });
      return `${productName} - ${valueNames.join(", ")}`;
    },
    [attributeDefinitionNameMap, attributeValueNameMap, productName],
  );

  const generateAllCombinations = useCallback(
    (attributes: { [key: string]: string[] }) => {
      const combinations: VariantCombination[] = [];
      const attributeIds = Object.keys(attributes);

      if (attributeIds.length === 0) {
        return combinations;
      }

      // Generate cartesian product of all selected attribute values
      const cartesianProduct = generateCartesianProduct(
        attributeIds,
        attributes,
      );

      cartesianProduct.forEach((combo) => {
        const name = generateVariantName(combo);
        combinations.push({
          id: uuid(),
          name,
          attributeValues: combo,
          applyProductChanges: productApplyChanges,
        });
      });

      return combinations;
    },
    [generateVariantName, getCombinationKey, productApplyChanges],
  );

  const buildCombinations = useCallback(
    (
      attributes: { [key: string]: string[] },
      existing: VariantCombination[],
    ) => {
      const existingMap = new Map<string, VariantCombination>();
      existing.forEach((combo) => {
        existingMap.set(getCombinationKey(combo.attributeValues), combo);
      });

      return generateAllCombinations(attributes).map((combo) => {
        const key = getCombinationKey(combo.attributeValues);
        const existingCombo = existingMap.get(key);
        if (existingCombo) {
          return {
            ...combo,
            id: existingCombo.id,
            applyProductChanges: existingCombo.applyProductChanges,
            isExisting: existingCombo.isExisting,
          };
        }
        return combo;
      });
    },
    [generateAllCombinations, getCombinationKey],
  );

  const generateCartesianProduct = (
    attributeIds: string[],
    attributes: { [key: string]: string[] },
  ) => {
    if (attributeIds.length === 0) return [{}];

    const firstId = attributeIds[0];
    const restIds = attributeIds.slice(1);
    const restCombinations = generateCartesianProduct(restIds, attributes);

    const combinations: { [key: string]: string }[] = [];
    attributes[firstId]?.forEach((valueId) => {
      restCombinations.forEach((restCombo) => {
        combinations.push({ ...restCombo, [firstId]: valueId });
      });
    });

    return combinations;
  };

  const getVariantAttributeDefinitions = useMemo(() => {
    const variantAttributeDefinitionIds = getVariantAttributeDefinitionIds();
    return attributeDefinitions.filter((ad) =>
      variantAttributeDefinitionIds.includes(ad.id),
    );
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
        const models = result.result; //.map(convertDtoToModel);
        // const models = result.result.map(convertDtoToModel);
        setAttributeDefinitions(models);
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

  const getAttributeValuesForDefinition = (attributeDefinitionId: string) => {
    return attributeValuesByDefinition[attributeDefinitionId] || [];
  };

  const handleToggleApply = useCallback(
    (comboKey: string, checked: boolean) => {
      const next = combinations.map((combo) =>
        getCombinationKey(combo.attributeValues) === comboKey
          ? { ...combo, applyProductChanges: checked }
          : combo,
      );
      onChange(next);
    },
    [combinations, getCombinationKey, onChange],
  );

  const handleDeleteCombination = useCallback(
    (comboKey: string) => {
      onChange(
        combinations.filter(
          (combo) => getCombinationKey(combo.attributeValues) !== comboKey,
        ),
      );
    },
    [combinations, getCombinationKey, onChange],
  );

  const variantDisplayName = (attributeValuesMap: {
    [key: string]: string;
  }) => {
    const parts = Object.entries(attributeValuesMap).map(
      ([, valueId]) => attributeValueNameMap[valueId] || "Unknown",
    );
    return parts.join(" / ");
  };

  const ROW_HEIGHT_PX = 76;
  const CONTAINER_MAX_HEIGHT = 500;
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: combinations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();

  /* --------------------------- render ------------------------------ */
  return (
    <Card
      variant='outlined'
      sx={{
        borderRadius: 1.5,
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        mt: 3,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: 3,
            pb: 1,
          }}
        >
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
            {handleTranslate("AttributeCombinations")}
          </Typography>

          {combinations.length > 0 && (
            <Typography
              variant='body2'
              sx={{ mt: 1 }}
              color='primary'
              fontWeight={600}
              fontSize={"0.575rem"}
            >
              {handleTranslate("Generated")} {combinations.length}{" "}
              {handleTranslate("variant(s)")}
            </Typography>
          )}
        </Box>

        {combinations.length > 0 ? (
          <Box sx={{ px: 3 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1.5,
                boxShadow: "none",
                border: `1px solid ${theme.palette.divider}`,
                overflow: "hidden",
                backgroundColor: "transparent",
              }}
            >
              <Box
                ref={parentRef}
                sx={{
                  maxHeight: CONTAINER_MAX_HEIGHT,
                  overflow: "auto",
                  overflowX: "auto",
                }}
              >
                <Box sx={{ minHeight: totalHeight }}>
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
                          {handleTranslate("#")}
                        </TableCell>
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
                          {handleTranslate("Variant")}
                        </TableCell>
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
                      {virtualItems.length > 0 && virtualItems[0].start > 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={formType !== FormTypes.Details ? 4 : 3}
                            sx={{
                              height: virtualItems[0].start,
                              padding: 0,
                              border: "none",
                              lineHeight: 0,
                              verticalAlign: "top",
                            }}
                          />
                        </TableRow>
                      )}
                      {virtualItems.map((virtualRow: VirtualItem) => {
                        const combo = combinations[virtualRow.index];
                        if (!combo) return null;
                        const comboKey = getCombinationKey(
                          combo.attributeValues,
                        );
                        return (
                          <TableRow
                            key={combo.id}
                            data-index={virtualRow.index}
                            sx={{
                              "& td, & th": {
                                borderBottom: `1px solid ${theme.palette.divider}`,
                              },
                              opacity: !combo.applyProductChanges ? 0.5 : 1,
                            }}
                          >
                            <TableCell
                              align='center'
                              sx={{
                                minWidth: 20,
                                verticalAlign: "center",
                                height: ROW_HEIGHT_PX,
                              }}
                            >
                              <Chip
                                label={virtualRow.index + 1}
                                size='small'
                                color='primary'
                                variant='outlined'
                                sx={{
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.1,
                                  ),
                                  color: theme.palette.primary.main,
                                  border: "none",
                                  width: 32,
                                  height: 32,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                minWidth: 850,
                                verticalAlign: "top",
                                height: ROW_HEIGHT_PX,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Typography variant='body2' fontWeight={500}>
                                  {variantDisplayName(combo.attributeValues)}
                                </Typography>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: combo.applyProductChanges
                                      ? "success.main"
                                      : "transparent",
                                  }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                  mt: 0.5,
                                }}
                              >
                                {Object.entries(combo.attributeValues).map(
                                  ([, valueId]) => (
                                    <Chip
                                      key={valueId}
                                      label={
                                        attributeValueNameMap[valueId] ||
                                        "Unknown"
                                      }
                                      size='small'
                                      variant='outlined'
                                      color='primary'
                                      sx={{
                                        fontSize: "0.75rem",
                                        borderRadius: ".325rem",
                                        backgroundColor: alpha(
                                          theme.palette.primary.main,
                                          0.1,
                                        ),
                                        color: theme.palette.primary.main,
                                      }}
                                    />
                                  ),
                                )}
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                minWidth: 100,
                                verticalAlign: "top",
                                height: ROW_HEIGHT_PX,
                              }}
                            >
                              <Checkbox
                                size='small'
                                checked={!!combo.applyProductChanges}
                                onChange={(e) =>
                                  handleToggleApply(comboKey, e.target.checked)
                                }
                                disabled={formType === FormTypes.Details}
                                color='primary'
                              />
                            </TableCell>
                            {formType !== FormTypes.Details && (
                              <TableCell
                                align='center'
                                sx={{
                                  minWidth: 72,
                                  verticalAlign: "center",
                                  height: ROW_HEIGHT_PX,
                                }}
                              >
                                <IconButton
                                  size='small'
                                  color='error'
                                  onClick={() =>
                                    handleDeleteCombination(comboKey)
                                  }
                                  sx={{
                                    borderRadius: ".325rem",
                                    color: theme.palette.error.main,
                                    "&:hover": {
                                      color: theme.palette.error.main,
                                    },
                                  }}
                                >
                                  <RiDeleteBin6Line fontSize='medium' />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                      {virtualItems.length > 0 &&
                        (() => {
                          const last = virtualItems[virtualItems.length - 1];
                          const tail = totalHeight - last.end;
                          if (tail <= 0) return null;
                          return (
                            <TableRow>
                              <TableCell
                                colSpan={formType !== FormTypes.Details ? 4 : 3}
                                sx={{
                                  height: tail,
                                  padding: 0,
                                  border: "none",
                                  lineHeight: 0,
                                  verticalAlign: "top",
                                }}
                              />
                            </TableRow>
                          );
                        })()}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Paper>
          </Box>
        ) : null}

        {getVariantAttributeDefinitions.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              {handleTranslate("NoVariantAttributesConfigured")}
            </Typography>
          </Box>
        )}
        {getVariantAttributeDefinitions.length > 0 &&
          Object.keys(selectedAttributeValues).length > 0 &&
          combinations.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
              <Typography variant='body2' color='text.secondary'>
                {handleTranslate(
                  "SelectAtLeastOneValuePerVariantAttributeToGenerateCombinations",
                )}
              </Typography>
            </Box>
          )}
        {getVariantAttributeDefinitions.length > 0 &&
          Object.keys(selectedAttributeValues).length === 0 &&
          combinations.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
              <Typography variant='body2' color='text.secondary'>
                {handleTranslate(
                  "SelectAttributeValuesToGenerateVariantCombinations",
                )}
              </Typography>
            </Box>
          )}
      </CardContent>
    </Card>
  );
};

export default VariantCombinationBuilder;
