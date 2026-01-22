import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ThemedTooltip from "../UI/ThemedTooltip";

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator?: "AND" | "OR";
}

interface AdvancedFilterDropdownProps {
  gridApi: any;
  columnLabels: Record<string, string>;
  onClose: () => void;
}

export function AdvancedFilterDropdown({
  gridApi,
  columnLabels,
  onClose,
}: AdvancedFilterDropdownProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [conditions, setConditions] = useState<FilterCondition[]>(() => [
    {
      id: "1",
      field: Object.keys(columnLabels)[0],
      operator: "contains",
      value: "",
      logicalOperator: "AND",
    },
  ]);

  useEffect(() => {
    if (!gridApi) return;

    const model = gridApi.getFilterModel();
    if (!model || Object.keys(model).length === 0) return;

    const loadedConditions: FilterCondition[] = [];

    Object.keys(model).forEach((field) => {
      const filterItem = model[field];

      if (filterItem.conditions && Array.isArray(filterItem.conditions)) {
        filterItem.conditions.forEach((cond: any, index: number) => {
          loadedConditions.push({
            id: Math.random().toString(36).slice(2, 11),
            field,
            operator: cond.type,
            value: cond.filter,
            logicalOperator: index === 0 ? "AND" : filterItem.operator || "AND",
          });
        });
      } else if (filterItem.type) {
        loadedConditions.push({
          id: Math.random().toString(36).slice(2, 11),
          field,
          operator: filterItem.type,
          value: filterItem.filter,
          logicalOperator: "AND",
        });
      }
    });

    if (loadedConditions.length > 0) {
      setConditions(loadedConditions);
    }
  }, [gridApi]);

  const availableColumns = Object.entries(columnLabels).map(
    ([field, label]) => ({
      field,
      label,
    })
  );

  const operators = [
    { value: "contains", label: t("contains") },
    { value: "notContains", label: t("notContains") },
    { value: "equals", label: t("equals") },
    { value: "notEqual", label: t("notEqual") },
    { value: "startsWith", label: t("startsWith") },
    { value: "endsWith", label: t("endsWith") },
    { value: "blank", label: t("blank") },
    { value: "notBlank", label: t("notBlank") },
  ];

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Math.random().toString(36).slice(2, 11),
        field: Object.keys(columnLabels)[0],
        operator: "contains",
        value: "",
        logicalOperator: "AND",
      },
    ]);
  };

  const handleRemoveCondition = (id: string) => {
    if (conditions.length === 1) {
      setConditions(conditions.filter((c) => c.id !== id));
    } else {
      setConditions(conditions.filter((c) => c.id !== id));
    }
  };

  const handleChange = (
    id: string,
    key: keyof FilterCondition,
    newValue: string
  ) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, [key]: newValue } : c))
    );
  };

  const handleApply = () => {
    if (!gridApi) return;

    const model: any = {};
    const grouped: Record<string, FilterCondition[]> = {};

    conditions.forEach((c) => {
      if (!c.field || c.value == null || c.value === "") return;
      if (!grouped[c.field]) grouped[c.field] = [];
      grouped[c.field].push(c);
    });

    Object.keys(grouped).forEach((field) => {
      const group = grouped[field];

      if (group.length === 1) {
        const c = group[0];
        model[field] = {
          filterType: "text",
          type: c.operator,
          filter: c.value,
        };
      } else {
        const [c1, c2] = group;

        model[field] = {
          filterType: "text",
          operator: c2.logicalOperator?.toUpperCase() === "OR" ? "OR" : "AND",
          conditions: [
            {
              filterType: "text",
              type: c1.operator,
              filter: c1.value,
            },
            {
              filterType: "text",
              type: c2.operator,
              filter: c2.value,
            },
          ],
        };
      }
    });

    gridApi.setFilterModel(model);
    gridApi.onFilterChanged();
    onClose();
  };

  const handleClear = () => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
    setConditions([
      {
        id: Math.random().toString(36).slice(2, 11),
        field: "",
        operator: "contains",
        value: "",
      },
    ]);
    onClose();
  };

  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        top: "100%",
        right: 0,
        left: 0,
        mt: 1,
        width: 400,
        zIndex: 100,
        p: 2,
        borderRadius: 2,
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h6' sx={{ fontSize: "1rem", fontWeight: 600 }}>
          {t("Advanced Filter")}
        </Typography>
        <IconButton size='small' onClick={onClose}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {conditions.length === 0 && (
          <Typography
            variant='body2'
            color='text.secondary'
            align='center'
            sx={{ py: 2 }}
          >
            {t("No filters applied")}
          </Typography>
        )}
        {conditions.map((condition, index) => (
          <Fragment key={condition.id}>
            {index > 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                {conditions[index].field === conditions[index - 1].field ? (
                  <RadioGroup
                    row
                    value={condition.logicalOperator || "AND"}
                    onChange={(e) =>
                      handleChange(
                        condition.id,
                        "logicalOperator",
                        e.target.value
                      )
                    }
                  >
                    <FormControlLabel
                      value='AND'
                      control={<Radio size='small' />}
                      label={t("AND")}
                    />
                    <FormControlLabel
                      value='OR'
                      control={<Radio size='small' />}
                      label={t("OR")}
                    />
                  </RadioGroup>
                ) : (
                  <Typography variant='caption' color='text.secondary'>
                    {t("AND")}
                  </Typography>
                )}
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                p: 1,
                borderRadius: 1,
                bgcolor: theme.palette.action.hover,
              }}
            >
              <FormControl size='small' sx={{ flex: 1, minWidth: 100 }}>
                <Select
                  value={condition.field}
                  onChange={(e) =>
                    handleChange(condition.id, "field", e.target.value)
                  }
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected)
                      return (
                        <span style={{ color: theme.palette.text.disabled }}>
                          {t("Column")}
                        </span>
                      );
                    return columnLabels[selected] || selected;
                  }}
                >
                  {availableColumns.map((col) => (
                    <MenuItem key={col.field} value={col.field}>
                      {col.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size='small' sx={{ width: 110 }}>
                <Select
                  value={condition.operator}
                  onChange={(e) =>
                    handleChange(condition.id, "operator", e.target.value)
                  }
                >
                  {operators.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                      {t(op.label)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size='small'
                placeholder={t("Value")}
                value={condition.value}
                onChange={(e) =>
                  handleChange(condition.id, "value", e.target.value)
                }
                sx={{ flex: 1 }}
              />

              <ThemedTooltip title={t("Delete")}>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => handleRemoveCondition(condition.id)}
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </ThemedTooltip>
            </Box>
          </Fragment>
        ))}
      </Box>

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddCondition}
        size='small'
        sx={{ alignSelf: "flex-start" }}
      >
        {t("Add Condition")}
      </Button>

      <Divider />

      <Box display='flex' justifyContent='flex-end' gap={1}>
        <Button onClick={handleClear} color='error' size='small'>
          {t("Clear All")}
        </Button>
        <Button onClick={handleApply} variant='contained' size='small'>
          {t("Apply")}
        </Button>
      </Box>
    </Paper>
  );
}
