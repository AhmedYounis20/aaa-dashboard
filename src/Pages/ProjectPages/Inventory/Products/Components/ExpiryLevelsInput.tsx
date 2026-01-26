import React from "react";
import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
} from "@mui/material";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { ExpiryLevelModel } from "../../../../../interfaces/ProjectInterfaces/Inventory/ExpiryLevelModel";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import { Add, Delete } from "@mui/icons-material";

const LEVEL_COLORS: Record<number, "success" | "info" | "warning" | "default" | "error"> = {
  1: "success",
  2: "info",
  3: "warning",
  4: "default",
  5: "error",
};

const getLevelColor = (level: number): "success" | "info" | "warning" | "default" | "error" => {
  const color = LEVEL_COLORS[level];
  return color ?? "default";
};

const ExpiryLevelsInput: React.FC<{
  formType: FormTypes;
  levels: ExpiryLevelModel[];
  onLevelsChange: (levels: ExpiryLevelModel[]) => void;
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({ formType, levels, onLevelsChange, handleTranslate, errors = {} }) => {
  const sortedLevels = [...(levels ?? [])].sort((a, b) => a.level - b.level);

  const handleAddRow = () => {
    const nextLevel = sortedLevels.length + 1;
    const newRow: ExpiryLevelModel = {
      level: nextLevel,
      daysFrom: sortedLevels.length > 0 ? (sortedLevels[sortedLevels.length - 1].daysTo ?? 0) + 1 : 0,
      daysTo: sortedLevels.length > 0 ? (sortedLevels[sortedLevels.length - 1].daysTo ?? 0) + 30 : 30,
      enableNotification: false,
    };
    onLevelsChange([...sortedLevels, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    const removed = sortedLevels.filter((_, i) => i !== index);
    const releveled = removed.map((row, i) => ({ ...row, level: i + 1 }));
    onLevelsChange(releveled);
  };

  const handleLevelChange = (
    index: number,
    field: keyof ExpiryLevelModel,
    value: number | boolean
  ) => {
    const updated = sortedLevels.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    onLevelsChange(updated);
  };

  return (
    <div className="card card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">{handleTranslate("Expiry Levels")}</h6>
        {formType !== FormTypes.Details && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={handleAddRow}
          >
            {handleTranslate("Add Row")}
          </Button>
        )}
      </div>
      {errors.expiryLevels && (
        <div className="text-danger small mb-2">{handleTranslate(errors.expiryLevels)}</div>
      )}
      <TableContainer component={Paper} variant="outlined" className="mb-2">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{handleTranslate("Level")}</TableCell>
              <TableCell>{handleTranslate("Days From")}</TableCell>
              <TableCell>{handleTranslate("Days To")}</TableCell>
              <TableCell>{handleTranslate("Notifications")}</TableCell>
              {formType !== FormTypes.Details && (
                <TableCell align="right">{handleTranslate("Actions")}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLevels.map((row, index) => (
              <TableRow key={`${row.level}-${index}`}>
                <TableCell>
                  <Chip
                    label={row.level}
                    color={getLevelColor(row.level)}
                    size="small"
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <InputNumber
                    size="small"
                    value={row.daysFrom ?? 0}
                    onChange={(v) => handleLevelChange(index, "daysFrom", v)}
                    disabled={formType === FormTypes.Details}
                    error={!!errors[`expiryLevels[${index}].daysFrom`]}
                    helperText={handleTranslate(errors[`expiryLevels[${index}].daysFrom`] ?? "")}
                  />
                </TableCell>
                <TableCell>
                  <InputNumber
                    size="small"
                    value={row.daysTo ?? 0}
                    onChange={(v) => handleLevelChange(index, "daysTo", v)}
                    disabled={formType === FormTypes.Details}
                    error={!!errors[`expiryLevels[${index}].daysTo`]}
                    helperText={handleTranslate(errors[`expiryLevels[${index}].daysTo`] ?? "")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={!!row.enableNotification}
                    onChange={(e) =>
                      handleLevelChange(index, "enableNotification", e.target.checked)
                    }
                    disabled={formType === FormTypes.Details}
                  />
                  <span className="ms-1 small text-muted">
                    {handleTranslate("Enable")}
                  </span>
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
    </div>
  );
};

export default ExpiryLevelsInput;
