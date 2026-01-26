import React, { useEffect, useState } from "react";
import { IconButton, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { InventoryThresholdScope } from "../../../../../interfaces/ProjectInterfaces/Inventory/InventoryThresholdScope";
import { InventoryThresholdModel } from "../../../../../interfaces/ProjectInterfaces/Inventory/InventoryThresholdModel";
import BranchModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import { Add, Delete } from "@mui/icons-material";

const MAX_THRESHOLD_ROWS = 5;

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
  const [branchesOptions, setBranchesOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (branches?.length) {
      setBranchesOptions(
        branches.map((b) => ({ label: b.name ?? b.id, value: b.id }))
      );
    }
  }, [branches]);

  const scopeOptions = [
    { value: InventoryThresholdScope.All, label: handleTranslate("All") },
    { value: InventoryThresholdScope.Branch, label: handleTranslate("Branch") },
  ];

  const sortedThresholds = [...(thresholds ?? [])].sort((a, b) => a.level - b.level);

  const canAddRow = sortedThresholds.length < MAX_THRESHOLD_ROWS;

  const handleAddRow = () => {
    if (!canAddRow) return;
    const nextLevel = sortedThresholds.length + 1;
    const newRow: InventoryThresholdModel = {
      level: nextLevel,
      minQuantity: 0,
      maxQuantity: 0,
      enableNotification: false,
    };
    onThresholdsChange([...sortedThresholds, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    const removed = sortedThresholds.filter((_, i) => i !== index);
    // Re-level 1-based
    const releveled = removed.map((row, i) => ({ ...row, level: i + 1 }));
    onThresholdsChange(releveled);
  };

  const handleThresholdChange = (
    index: number,
    field: keyof InventoryThresholdModel,
    value: number | boolean
  ) => {
    const updated = sortedThresholds.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    onThresholdsChange(updated);
  };

  return (
    <div className="card card-body">
      <h6 className="mb-3">{handleTranslate("Inventory Thresholds")}</h6>

      <div className="row mb-3">
        <div className="col col-md-6">
          <FormControl fullWidth size="small">
            <InputLabel>{handleTranslate("Inventory Threshold Scope")}</InputLabel>
            <Select
              value={scope ?? InventoryThresholdScope.All}
              label={handleTranslate("Inventory Threshold Scope")}
              onChange={(e) => onScopeChange(Number(e.target.value) as InventoryThresholdScope)}
              disabled={formType === FormTypes.Details}
            >
              {scopeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {scope === InventoryThresholdScope.Branch && (
          <div className="col col-md-6">
            <InputAutoComplete
              size="small"
              options={branchesOptions}
              label={handleTranslate("Branch")}
              value={branchId ?? null}
              disabled={formType === FormTypes.Details}
              onChange={(value: string | null) => onBranchChange(value)}
              multiple={false}
              handleBlur={null}
              error={!!errors.inventoryThresholdBranchId}
              helperText={handleTranslate(errors.inventoryThresholdBranchId ?? "")}
            />
          </div>
        )}
      </div>

      <TableContainer component={Paper} variant="outlined" className="mb-2">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{handleTranslate("Level")}</TableCell>
              <TableCell>{handleTranslate("Quantity From")}</TableCell>
              <TableCell>{handleTranslate("Quantity To")}</TableCell>
              <TableCell>{handleTranslate("Enable Notification")}</TableCell>
              {formType !== FormTypes.Details && (
                <TableCell align="right">{handleTranslate("Actions")}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedThresholds.map((row, index) => (
              <TableRow key={`${row.level}-${index}`}>
                <TableCell>{row.level}</TableCell>
                <TableCell>
                  <InputNumber
                    size="small"
                    value={row.minQuantity ?? 0}
                    onChange={(v) => handleThresholdChange(index, "minQuantity", v)}
                    disabled={formType === FormTypes.Details}
                    error={!!errors[`inventoryThresholds[${index}].minQuantity`]}
                    helperText={handleTranslate(errors[`inventoryThresholds[${index}].minQuantity`] ?? "")}
                  />
                </TableCell>
                <TableCell>
                  <InputNumber
                    size="small"
                    value={row.maxQuantity ?? 0}
                    onChange={(v) => handleThresholdChange(index, "maxQuantity", v)}
                    disabled={formType === FormTypes.Details}
                    error={!!errors[`inventoryThresholds[${index}].maxQuantity`]}
                    helperText={handleTranslate(errors[`inventoryThresholds[${index}].maxQuantity`] ?? "")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={!!row.enableNotification}
                    onChange={(e) =>
                      handleThresholdChange(index, "enableNotification", e.target.checked)
                    }
                    disabled={formType === FormTypes.Details}
                  />
                </TableCell>
                {formType !== FormTypes.Details && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleDeleteRow(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {formType !== FormTypes.Details && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={handleAddRow}
          disabled={!canAddRow}
        >
          {handleTranslate("Add Row")}
        </Button>
      )}
    </div>
  );
};

export default InventoryThresholdsInput;
