import { useEffect, useRef, useState } from "react";
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
  FormControlLabel,
  Link,
  useTheme,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import ThemedTooltip from "../UI/ThemedTooltip";
import InputText from "../Inputs/InputText";

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
}

function EditableTable<T extends Record<string, any>>({
  rows,
  columns,
  onChangeRow,
  onDeleteRow,
  onAddRow,
  disabled = false,
  addText,
}: EditableTableProps<T>) {
  const theme = useTheme();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isAdding && rows.length > 0) {
      const lastIndex = rows.length - 1;
      const firstInput = inputRefs.current[lastIndex];
      if (firstInput) {
        firstInput.focus();
      }
      setIsAdding(false);
    }
  }, [rows.length, isAdding]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!tableRef.current?.contains(event.target as Node)) {
        if (rows.length > 0) {
          const lastIndex = rows.length - 1;
          const lastRow = rows[lastIndex];
          const firstKey = columns[0]?.key;

          if (
            firstKey &&
            (!lastRow[firstKey] || String(lastRow[firstKey]).trim() === "")
          ) {
            onDeleteRow && onDeleteRow(lastIndex);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [rows, columns, onDeleteRow]);

  return (
    <TableContainer
      ref={tableRef}
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
              {columns.map((col, colIndex) => (
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
                      inputRef={(el) => {
                        if (colIndex === 0) inputRefs.current[index] = el;
                      }}
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
                    const lastRow = rows[rows.length - 1];
                    const firstColKey = columns[0]?.key;

                    if (
                      lastRow &&
                      (!lastRow[firstColKey] ||
                        lastRow[firstColKey].trim() === "")
                    ) {
                      const lastInput = inputRefs.current[rows.length - 1];
                      if (lastInput) lastInput.focus();
                      return;
                    }

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
