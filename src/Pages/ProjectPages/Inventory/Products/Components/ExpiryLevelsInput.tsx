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
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { ExpiryLevelModel } from "../../../../../interfaces/ProjectInterfaces/Inventory/ExpiryLevelModel";

const MAX_EXPIRY_LEVELS = 5;

const levelColors: Record<number, string> = {
  1: "!bg-green-100 !text-green-800",
  2: "!bg-blue-100 !text-blue-800",
  3: "!bg-yellow-100 !text-yellow-800",
  4: "!bg-orange-100 !text-orange-800",
  5: "!bg-red-100 !text-red-800",
};

const ExpiryLevelsInput: React.FC<{
  formType: FormTypes;
  levels: ExpiryLevelModel[];
  onLevelsChange: (levels: ExpiryLevelModel[]) => void;
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({ formType, levels, onLevelsChange, handleTranslate, errors = {} }) => {
  const theme = useTheme();
  const sortedLevels = [...(levels ?? [])].sort((a, b) => a.level - b.level);

  const canAddRow = sortedLevels.length < MAX_EXPIRY_LEVELS;

  const handleAddRow = () => {
    if (!canAddRow) return;
    const nextLevel = sortedLevels.length + 1;
    const newRow: ExpiryLevelModel = {
      level: nextLevel,
      daysFrom:
        sortedLevels.length > 0
          ? (sortedLevels[sortedLevels.length - 1].daysTo ?? 0) + 1
          : 0,
      daysTo:
        sortedLevels.length > 0
          ? (sortedLevels[sortedLevels.length - 1].daysTo ?? 0) + 30
          : 30,
      enableNotification: sortedLevels.length === 0,
    };
    onLevelsChange([...sortedLevels, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    const removed = sortedLevels.filter((_, i) => i !== index);
    const releveled = removed.map((row, i) => ({ ...row, level: i + 1 }));
    onLevelsChange(normalizeDaysFrom(releveled));
  };

  const normalizeDaysFrom = (rows: ExpiryLevelModel[]) =>
    rows.map((row, i) =>
      i === 0 ? row : { ...row, daysFrom: (rows[i - 1].daysTo ?? 0) + 1 },
    );

  const handleLevelChange = (
    index: number,
    field: keyof ExpiryLevelModel,
    value: number | boolean,
  ) => {
    if (field === "enableNotification" && value === true) {
      const updated = sortedLevels.map((row, i) => ({
        ...row,
        enableNotification: i === index,
      }));
      onLevelsChange(updated);
      return;
    }
    const updated = sortedLevels.map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    );
    onLevelsChange(normalizeDaysFrom(updated));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            opacity: 0.75,
            fontSize: "0.875rem",
          }}
        >
          {handleTranslate("Expiry Levels")}
        </Typography>
        {formType !== FormTypes.Details && (
          <Button
            variant='outlined'
            size='small'
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
      {errors.expiryLevels && (
        <div className='text-danger small mb-2'>
          {handleTranslate(errors.expiryLevels)}
        </div>
      )}
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
                {handleTranslate("Days From")}
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
                {handleTranslate("Days To")}
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
            {sortedLevels.map((row, index) => (
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
                    sx={{
                      borderRadius: "0.225rem",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  <InputNumber
                    size='small'
                    value={
                      index === 0
                        ? (row.daysFrom ?? 0)
                        : (sortedLevels[index - 1].daysTo ?? 0) + 1
                    }
                    onChange={(v) => handleLevelChange(index, "daysFrom", v)}
                    disabled={formType === FormTypes.Details || index > 0}
                    error={!!errors[`expiryLevels[${index}].daysFrom`]}
                    helperText={handleTranslate(
                      errors[`expiryLevels[${index}].daysFrom`] ?? "",
                    )}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  <InputNumber
                    size='small'
                    value={row.daysTo ?? 0}
                    onChange={(v) => handleLevelChange(index, "daysTo", v)}
                    disabled={formType === FormTypes.Details}
                    error={!!errors[`expiryLevels[${index}].daysTo`]}
                    helperText={handleTranslate(
                      errors[`expiryLevels[${index}].daysTo`] ?? "",
                    )}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  <Radio
                    size='small'
                    checked={row.enableNotification}
                    onChange={(e) =>
                      handleLevelChange(
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
            {sortedLevels.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  <Typography variant='body2' color='text.secondary'>
                    {handleTranslate("No expiry levels added")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExpiryLevelsInput;
