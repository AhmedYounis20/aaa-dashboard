import { Add } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Chip,
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
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import BranchModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import { InventoryThresholdModel } from "../../../../../interfaces/ProjectInterfaces/Inventory/InventoryThresholdModel";
import { InventoryThresholdScope } from "../../../../../interfaces/ProjectInterfaces/Inventory/InventoryThresholdScope";

const MAX_THRESHOLD_ROWS = 5;

const levelColors: Record<number, string> = {
  1: "!bg-green-100 !text-green-800",
  2: "!bg-blue-100 !text-blue-800",
  3: "!bg-yellow-100 !text-yellow-800",
  4: "!bg-orange-100 !text-orange-800",
  5: "!bg-red-100 !text-red-800",
};

const InventoryThresholdsInput: React.FC<{
  formType: FormTypes;
  scope: InventoryThresholdScope | undefined;
  branchId: string | null | undefined;
  thresholds: InventoryThresholdModel[];
  onScopeChange: (scope: InventoryThresholdScope) => void;
  onBranchChange: (branchId: string | null) => void;
  onThresholdsChange: (thresholds: InventoryThresholdModel[]) => void;
  branches: BranchModel[];
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({
  formType,
  scope,
  branchId,
  thresholds,
  onScopeChange,
  onBranchChange,
  onThresholdsChange,
  branches,
  handleTranslate,
  errors = {},
}) => {
  const theme = useTheme();
  const [branchesOptions, setBranchesOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (branches?.length) {
      setBranchesOptions(
        branches.map((b) => ({ label: b.name ?? b.id, value: b.id })),
      );
    }
  }, [branches]);

  const scopeOptions = [
    { value: InventoryThresholdScope.All, label: handleTranslate("All") },
    { value: InventoryThresholdScope.Branch, label: handleTranslate("Branch") },
  ];

  const sortedThresholds = [...(thresholds ?? [])].sort(
    (a, b) => a.level - b.level,
  );

  const canAddRow = sortedThresholds.length < MAX_THRESHOLD_ROWS;

  const handleAddRow = () => {
    if (!canAddRow) return;
    const nextLevel = sortedThresholds.length + 1;
    const newRow: InventoryThresholdModel = {
      level: nextLevel,
      minQuantity:
        sortedThresholds.length > 0
          ? (sortedThresholds[sortedThresholds.length - 1].maxQuantity ?? 0) + 1
          : 0,
      maxQuantity:
        sortedThresholds.length > 0
          ? (sortedThresholds[sortedThresholds.length - 1].maxQuantity ?? 0) + 1
          : 0,
      enableNotification: sortedThresholds.length === 0,
    };
    onThresholdsChange([...sortedThresholds, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    const removed = sortedThresholds.filter((_, i) => i !== index);
    // Re-level 1-based
    const releveled = removed.map((row, i) => ({ ...row, level: i + 1 }));
    onThresholdsChange(releveled);
  };

  const normalizeDaysFrom = (rows: InventoryThresholdModel[]) =>
    rows.map((row, i) =>
      i === 0
        ? row
        : { ...row, minQuantity: (rows[i - 1].maxQuantity ?? 0) + 1 },
    );

  const handleThresholdChange = (
    index: number,
    field: keyof InventoryThresholdModel,
    value: number | boolean,
  ) => {
    if (field === "enableNotification" && value === true) {
      const updated = sortedThresholds.map((row, i) => ({
        ...row,
        enableNotification: i === index,
      }));
      onThresholdsChange(updated);
      return;
    }
    const updated = sortedThresholds.map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    );
    onThresholdsChange(normalizeDaysFrom(updated));
  };

  return (
    <Box className='row g-4'>
      <Box className='col-md-6'>
        <InputSelect
          options={scopeOptions}
          label={handleTranslate("Inventory Threshold Scope")}
          defaultValue={scope ?? InventoryThresholdScope.All}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
            onScopeChange(Number(e.target.value) as InventoryThresholdScope)
          }
          disabled={formType === FormTypes.Details}
          name='inventoryThresholdScope'
          onBlur={() => {}}
          error={!!errors.inventoryThresholdScope}
        />
      </Box>
      {scope === InventoryThresholdScope.Branch && (
        <Box className='col-md-6'>
          <InputAutoComplete
            size='small'
            options={branchesOptions}
            label={handleTranslate("Branch")}
            value={branchId ?? null}
            disabled={formType === FormTypes.Details}
            onChange={(value: string | null) => onBranchChange(value)}
            multiple={false}
            handleBlur={null}
            error={!!errors.inventoryThresholdBranchId}
            helperText={handleTranslate(
              errors.inventoryThresholdBranchId ?? "",
            )}
          />
        </Box>
      )}

      <Box className='col-md-12'>
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
              {handleTranslate("Inventory Thresholds")}
            </Typography>
          </Box>
          {formType !== FormTypes.Details && (
            <Button
              variant='outlined'
              startIcon={<Add />}
              onClick={handleAddRow}
              disabled={!canAddRow}
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
                  {handleTranslate("Level")}
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
                  {handleTranslate("Quantity From")}
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
                  {handleTranslate("Quantity To")}
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
                  {handleTranslate("Notifications")}
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
                    {handleTranslate("Actions")}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedThresholds.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    verticalAlign: "top",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell sx={{ minWidth: 200, verticalAlign: "middle" }}>
                    <Chip
                      label={row.level}
                      className={levelColors[row.level] ?? ""}
                      size='small'
                      variant='filled'
                      sx={{ borderRadius: "0.225rem" }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    <InputNumber
                      size='small'
                      value={row.minQuantity ?? 0}
                      onChange={(v) =>
                        handleThresholdChange(index, "minQuantity", v)
                      }
                      disabled={formType === FormTypes.Details || index > 0}
                      error={
                        !!errors[`inventoryThresholds[${index}].minQuantity`]
                      }
                      helperText={handleTranslate(
                        errors[`inventoryThresholds[${index}].minQuantity`] ??
                          "",
                      )}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    <InputNumber
                      size='small'
                      value={row.maxQuantity ?? 0}
                      onChange={(v) =>
                        handleThresholdChange(index, "maxQuantity", v)
                      }
                      disabled={formType === FormTypes.Details}
                      error={
                        !!errors[`inventoryThresholds[${index}].maxQuantity`]
                      }
                      helperText={handleTranslate(
                        errors[`inventoryThresholds[${index}].maxQuantity`] ??
                          "",
                      )}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Radio
                      size='small'
                      checked={row.enableNotification}
                      onChange={(e) =>
                        handleThresholdChange(
                          index,
                          "enableNotification",
                          e.target.checked,
                        )
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
                  {formType !== FormTypes.Details && (
                    <TableCell align='center' sx={{ minWidth: 200 }}>
                      <IconButton
                        size='small'
                        onClick={() => handleDeleteRow(index)}
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
              ))}
              {sortedThresholds.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    <Typography variant='body2' color='text.secondary'>
                      {handleTranslate("No inventory thresholds added")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default InventoryThresholdsInput;
