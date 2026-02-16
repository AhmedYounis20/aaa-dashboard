import { Add } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Paper,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getPackingUnits } from "../../../../../Apis/Inventory/PackingUnitsApi";
import { getSellingPrices } from "../../../../../Apis/Inventory/SellingPricesApi";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import PackingUnitModel from "../../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel";
import ProductPackingUnitModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductPackingUnitModel";
import ProductPackingUnitSellingPriceModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductPackingUnitSellingPriceModel";
import SellingPriceModel from "../../../../../interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";

const ProductPackingUnitsInput: React.FC<{
  formType: FormTypes;
  productPackingUnits: ProductPackingUnitModel[];
  handleUpdate: (productPackingUnits: ProductPackingUnitModel[]) => void;
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({
  formType,
  productPackingUnits,
  handleUpdate,
  errors = {},
  handleTranslate,
}) => {
  const theme = useTheme();
  const [packingUnits, setPackingUnits] = useState<PackingUnitModel[]>([]);
  const [sellingPrices, setSellingPrices] = useState<SellingPriceModel[]>([]);

  useEffect(() => {
    if (formType !== FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getPackingUnits();
        if (result?.result) {
          setPackingUnits(result.result);
        }

        const sellingPricesResult = await getSellingPrices();
        if (sellingPricesResult?.result) {
          setSellingPrices(sellingPricesResult.result);
        }
      };
      fetchData();
    }
  }, [formType]);

  useEffect(() => {
    if (!sellingPrices.length) return;

    const updated = productPackingUnits.map((unit) => {
      const existing = unit.sellingPrices ?? [];
      const completedPrices = sellingPrices.map((price) => {
        const match = existing.find((sp) => sp.sellingPriceId === price.id);
        return match ?? { sellingPriceId: price.id, amount: 0 };
      });
      console.log(completedPrices);
      return { ...unit, sellingPrices: completedPrices };
    });

    if (!deepEqual(updated, productPackingUnits)) {
      handleUpdate(updated);
    }
  }, [sellingPrices, productPackingUnits]);

  const deepEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

  const handleDiscountChange = (index: number, value: number | null) => {
    const updated = productPackingUnits.map((item, i) =>
      i === index ? { ...item, partsCount: value ?? 0 } : item,
    );
    handleUpdate(updated);
  };

  const handleSellingPriceChange = (
    rowIndex: number,
    priceId: string,
    value: number | null,
  ) => {
    const updated = productPackingUnits.map((unit, i) => {
      if (i !== rowIndex) return unit;
      const newPrices = unit.sellingPrices?.map((sp) =>
        sp.sellingPriceId === priceId ? { ...sp, amount: value ?? 0 } : sp,
      );
      return { ...unit, sellingPrices: newPrices };
    });

    // If this is the default packing unit, update all other units
    const changedUnit = updated[rowIndex];
    if (changedUnit.isDefaultPackingUnit) {
      const defaultPrice = value ?? 0;

      // Update all other packing units based on the default price
      const finalUpdated = updated.map((unit, i) => {
        if (i === rowIndex) return unit; // Keep the default unit as is

        // Calculate new price: default_price / parts_count
        const newPrices = unit.sellingPrices?.map((sp) => {
          if (sp.sellingPriceId === priceId) {
            return {
              ...sp,
              amount: unit.partsCount == 0 ? 0 : defaultPrice * unit.partsCount,
            };
          }
          return sp;
        });

        return { ...unit, sellingPrices: newPrices };
      });

      handleUpdate(finalUpdated);
    } else {
      handleUpdate(updated);
    }
  };

  const createInitialSellingPrices =
    (): ProductPackingUnitSellingPriceModel[] =>
      sellingPrices.map((sp) => ({ sellingPriceId: sp.id, amount: 0 }));

  const createProductPackingUnit = (): ProductPackingUnitModel => ({
    id: "",
    productId: "",
    packingUnitId: "",
    averageCostPrice: 0,
    isDefaultPackingUnit: false,
    isDefaultPurchases: false,
    isDefaultSales: false,
    lastCostPrice: 0,
    orderNumber: productPackingUnits.length,
    partsCount: 0,
    sellingPrices: createInitialSellingPrices(),
    createdAt: "",
    modifiedAt: "",
  });

  const handleAddNewItemPackingUnit = () => {
    handleUpdate([...productPackingUnits, createProductPackingUnit()]);
  };

  const handleDeleteRow = (index: number) => {
    const updated = [...productPackingUnits];
    const removedItem = updated.splice(index, 1)[0];

    for (let i = index; i < updated.length; i++) {
      if (updated[i].orderNumber > removedItem.orderNumber) {
        updated[i].orderNumber -= 1;
      }
    }

    handleUpdate(updated);
  };

  const handleUpdateIsDefaultSales = (index: number, value: boolean) => {
    const updated = productPackingUnits.map((unit, i) => ({
      ...unit,
      isDefaultSales: i === index ? value : false,
    }));
    handleUpdate(updated);
  };

  const handleUpdateIsDefaultPurchase = (index: number, value: boolean) => {
    const updated = productPackingUnits.map((unit, i) => ({
      ...unit,
      isDefaultPurchases: i === index ? value : false,
    }));
    handleUpdate(updated);
  };

  return (
    <Box className='mt-4'>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Box>
          <Typography
            variant='h6'
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              opacity: 0.75,
              fontSize: "0.875rem",
            }}
          >
            {handleTranslate("Units")}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: "text.secondary",
              fontSize: ".75rem",
            }}
          >
            {handleTranslate("AddMultipleUnitsAndTheirPrices")}
          </Typography>
        </Box>
        {formType !== FormTypes.Details && (
          <Button
            variant='outlined'
            startIcon={<Add />}
            onClick={handleAddNewItemPackingUnit}
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
            {handleTranslate("AddUnits")}
          </Button>
        )}
      </Box>
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
                {handleTranslate("Packing")}
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
                {handleTranslate("Parts")}
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
                {handleTranslate("DefaultSales")}
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
                {handleTranslate("DefaultPurchases")}
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
                {handleTranslate("LastCost")}
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
                {handleTranslate("AvgCost")}
              </TableCell>
              {sellingPrices
                .sort((a, b) => a.id.localeCompare(b.id))
                .map((sp) => (
                  <TableCell
                    key={sp.id}
                    align='center'
                    sx={{
                      lineHeight: "normal",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      fontFamily: "'Cairo', sans-serif",
                      py: 1.5,
                    }}
                  >
                    {handleTranslate(sp.name)}
                  </TableCell>
                ))}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {productPackingUnits.map((unit, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "& .MuiTextField-root, & .MuiAutocomplete-root": {
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(0,0,0,0.03)",
                      borderRadius: "0.625rem",
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": { border: "none" },
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "0.875rem",
                      color: "text.primary",
                      py: 1,
                    },
                  },
                }}
              >
                <TableCell sx={{ minWidth: 200 }}>
                  <InputAutoComplete
                    options={packingUnits
                      .filter(
                        (e) =>
                          e.id == unit.packingUnitId ||
                          productPackingUnits.findIndex(
                            (a) => a.packingUnitId == e.id,
                          ) == -1,
                      )
                      .map((pu) => ({
                        label: pu.name,
                        value: pu.id,
                      }))}
                    label=''
                    value={unit.packingUnitId}
                    disabled={formType === FormTypes.Details}
                    onChange={(value: string) => {
                      const updated = [...productPackingUnits];
                      updated[rowIndex].packingUnitId = value ?? "";
                      handleUpdate(updated);
                    }}
                    handleBlur={null}
                    defaultSelect
                    error={!!errors[`packingUnits[${rowIndex}].packingUnitId`]}
                    helperText={handleTranslate(
                      errors[`packingUnits[${rowIndex}].packingUnitId`],
                    )}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <InputNumber
                    variant='outlined'
                    fullWidth
                    disabled={
                      formType === FormTypes.Details ||
                      unit.isDefaultPackingUnit
                    }
                    value={unit.partsCount ?? 0}
                    onChange={(value) => handleDiscountChange(rowIndex, value)}
                    error={!!errors[`packingUnits[${rowIndex}].partsCount`]}
                    helperText={handleTranslate(
                      errors[`packingUnits[${rowIndex}].partsCount`],
                    )}
                  />
                  {rowIndex !== 0 && (
                    <Typography
                      sx={{
                        fontSize: 10,
                        textAlign: "center",
                        color: theme.palette.text.disabled,
                        marginTop: 0.2,
                      }}
                    >
                      {unit.partsCount || "0"} ×{" "}
                      {packingUnits.find(
                        (e) =>
                          e.id ==
                          productPackingUnits.find(
                            (e) => e.isDefaultPackingUnit,
                          )?.packingUnitId,
                      )?.name || "unit"}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align='center'>
                  <Radio
                    size='small'
                    checked={unit.isDefaultSales}
                    onChange={(e) =>
                      handleUpdateIsDefaultSales(rowIndex, e.target.checked)
                    }
                    disabled={formType === FormTypes.Details}
                    sx={{
                      color: alpha(theme.palette.primary.main, 0.4),
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                </TableCell>
                <TableCell align='center'>
                  <Radio
                    size='small'
                    checked={unit.isDefaultPurchases}
                    onChange={(e) =>
                      handleUpdateIsDefaultPurchase(rowIndex, e.target.checked)
                    }
                    disabled={formType === FormTypes.Details}
                    sx={{
                      color: alpha(theme.palette.primary.main, 0.4),
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <InputNumber
                    variant='outlined'
                    fullWidth
                    disabled={formType === FormTypes.Details}
                    value={unit.lastCostPrice ?? 0}
                    onChange={(value) => {
                      const updated = [...productPackingUnits];
                      updated[rowIndex].lastCostPrice = value ?? 0;

                      const changedUnit = updated[rowIndex];
                      if (changedUnit.isDefaultPackingUnit) {
                        const defaultPrice = value ?? 0;
                        const finalUpdated = updated.map((unit, i) => {
                          if (i === rowIndex) return unit;
                          return {
                            ...unit,
                            lastCostPrice:
                              unit.partsCount == 0
                                ? 0
                                : defaultPrice * unit.partsCount,
                          };
                        });
                        handleUpdate(finalUpdated);
                      } else {
                        handleUpdate(updated);
                      }
                    }}
                    error={!!errors[`packingUnits[${rowIndex}].lastCostPrice`]}
                    helperText={handleTranslate(
                      errors[`packingUnits[${rowIndex}].lastCostPrice`],
                    )}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <InputNumber
                    variant='outlined'
                    fullWidth
                    disabled={formType === FormTypes.Details}
                    value={unit.averageCostPrice ?? 0}
                    onChange={(value) => {
                      const updated = [...productPackingUnits];
                      updated[rowIndex].averageCostPrice = value ?? 0;

                      const changedUnit = updated[rowIndex];
                      if (changedUnit.isDefaultPackingUnit) {
                        const defaultPrice = value ?? 0;
                        const finalUpdated = updated.map((unit, i) => {
                          if (i === rowIndex) return unit;
                          return {
                            ...unit,
                            averageCostPrice:
                              unit.partsCount == 0
                                ? 0
                                : defaultPrice * unit.partsCount,
                          };
                        });
                        handleUpdate(finalUpdated);
                      } else {
                        handleUpdate(updated);
                      }
                    }}
                    error={
                      !!errors[`packingUnits[${rowIndex}].averageCostPrice`]
                    }
                    helperText={handleTranslate(
                      errors[`packingUnits[${rowIndex}].averageCostPrice`],
                    )}
                  />
                </TableCell>
                {unit.sellingPrices?.map((sellingPrice, sellidx) => (
                  <TableCell
                    key={sellingPrice.sellingPriceId}
                    sx={{ minWidth: 120 }}
                  >
                    <InputNumber
                      variant='outlined'
                      fullWidth
                      disabled={formType === FormTypes.Details}
                      value={sellingPrice.amount ?? 0}
                      onChange={(value) =>
                        handleSellingPriceChange(
                          rowIndex,
                          sellingPrice.sellingPriceId,
                          value,
                        )
                      }
                      error={
                        !!errors[
                          `packingUnits[${rowIndex}].sellingPrices[${sellidx}].amount`
                        ]
                      }
                      helperText={handleTranslate(
                        errors[
                          `packingUnits[${rowIndex}].sellingPrices[${sellidx}].amount`
                        ],
                      )}
                    />
                  </TableCell>
                ))}
                <TableCell align='center'>
                  {!unit.isDefaultPackingUnit && (
                    <IconButton
                      size='small'
                      onClick={() => handleDeleteRow(rowIndex)}
                      disabled={formType === FormTypes.Details}
                      sx={{
                        borderRadius: ".325rem",
                        color: theme.palette.error.main,
                        "&:hover": { color: theme.palette.error.main },
                      }}
                    >
                      <RiDeleteBin6Line fontSize='medium' />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductPackingUnitsInput;
