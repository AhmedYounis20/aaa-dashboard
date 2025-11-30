import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Switch,
  Link,
  useTheme,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import ThemedTooltip from "../UI/ThemedTooltip";
import InputText from "../Inputs/InputText";
import { useTranslation } from "react-i18next";

interface Column<T> {
  key: keyof T;
  label?: string;
  type?: "text" | "switch";
}

interface EditableTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  onChangeRow: (index: number, updated: Partial<T>) => void;
  onDeleteRow?: (index: number) => void;
  onAddRow?: () => void;
  disabled?: boolean;
  addText?: string;
  errors?: Record<number, Record<string, string>>;
}

function EditableTable<T extends Record<string, any>>({
  rows,
  columns,
  onChangeRow,
  onDeleteRow,
  onAddRow,
  disabled = false,
  addText,
  errors = {},
}: EditableTableProps<T>) {
  const theme = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isAdding && rows.length > 0) {
      setIsAdding(false);
    }
  }, [rows.length, isAdding]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 1,
        boxShadow: "none",
      }}
    >
      <Table size='small'>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            {columns.map((col) => (
              <TableCell key={String(col.key)} sx={{ fontWeight: 600 }}>
                {col.label}
              </TableCell>
            ))}
            {!disabled && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              hover
              sx={{
                backgroundColor:
                  index % 2 !== 0
                    ? theme.palette.action.hover
                    : theme.palette.background.paper,
              }}
            >
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.type === "switch" ? (
                    <Switch
                      disabled={disabled}
                      checked={!!row[col.key]}
                      onChange={(e) =>
                        onChangeRow(index, {
                          [col.key]: e.target.checked,
                        } as Partial<T>)
                      }
                    />
                  ) : (
                    <InputText
                      variant='standard'
                      disabled={disabled}
                      value={row[col.key] ?? ""}
                      onChange={(v) =>
                        onChangeRow(index, { [col.key]: v } as Partial<T>)
                      }
                      error={Boolean(errors[index]?.[String(col.key)])}
                      helperText={
                        errors[index]?.[String(col.key)]
                          ? t(errors[index][String(col.key)])
                          : undefined
                      }
                    />
                  )}
                </TableCell>
              ))}

              {!disabled && (
                <TableCell>
                  <ThemedTooltip title='Delete' placement='bottom'>
                    <IconButton
                      size='small'
                      color='error'
                      onClick={() => onDeleteRow && onDeleteRow(index)}
                      sx={{
                        padding: "3px",
                        borderRadius: "5px",
                        border: "1px solid",
                        borderColor: (theme) => theme.palette.error.main,
                        color: (theme) => theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: theme.palette.error.main,
                          color: "#fff",
                        },
                      }}
                    >
                      <Delete fontSize='inherit' />
                    </IconButton>
                  </ThemedTooltip>
                </TableCell>
              )}
            </TableRow>
          ))}

          {!disabled && onAddRow && (
            <TableRow>
              <TableCell colSpan={columns.length + 1}>
                <Link
                  component='button'
                  onClick={() => {
                    setIsAdding(true);
                    onAddRow && onAddRow();
                  }}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: (theme) => theme.palette.primary.main,
                    fontWeight: 500,
                    textDecoration: "none",
                    "&:hover": {
                      color: (theme) => theme.palette.primary.light,
                    },
                    mt: 1,
                  }}
                >
                  {addText}
                </Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EditableTable;
