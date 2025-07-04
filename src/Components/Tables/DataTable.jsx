import { useState, useEffect, useContext } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  IconButton,
  InputLabel,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { FormTypes } from "../../interfaces/Components";
import { Delete, EditNote, Info, Visibility } from "@mui/icons-material";
import { appContext } from "../../layout/DefaultLayout";
import { useTranslation } from "react-i18next";

const DataTable = ({
  data = [],
  defaultHiddenColumns = [],
  changeFormType,
  handleSelectId,
  handleShowForm,
  showedit = true,
  showdelete = true,
}) => {
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const {t} = useTranslation()
  const { isSidebarOpen, isMobile} = useContext(appContext)

  useEffect(() => {
    if (data.length > 0) {
      const initialColumns = Object.keys(data[0]).map((field) => ({
        field: field,
        headerName: t(field.charAt(0).toUpperCase() + field.slice(1)),
        hide: defaultHiddenColumns.includes(field),
        flex: 1,
        minWidth: 120,
        groupable: true,
        headerClassName: 'custom-header',
        cellClassName: 'custom-cell',
      }));

      const operationsColumn = {
        field: "operations",
        headerName: t("Operations"),
        width: 180,
        sortable: false,
        filterable: false,
        headerClassName: 'custom-header',
        cellClassName: 'custom-cell',
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {showedit && (
              <IconButton
                size="small"
                sx={{
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  },
                }}
                onClick={() => {
                  changeFormType(FormTypes.Edit);
                  handleSelectId(params.row.id);
                  handleShowForm();
                }}
              >
                <EditNote fontSize="small" />
              </IconButton>
            )}
            {showdelete && (
              <IconButton
                size="small"
                sx={{
                  color: '#d32f2f',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  },
                }}
                onClick={() => {
                  changeFormType(FormTypes.Delete);
                  handleSelectId(params.row.id);
                  handleShowForm();
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              sx={{
                color: '#2e7d32',
                '&:hover': {
                  backgroundColor: 'rgba(46, 125, 50, 0.1)',
                },
              }}
              onClick={() => {
                changeFormType(FormTypes.Details);
                handleSelectId(params.row.id);
                handleShowForm();
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Box>
        ),
      };

      setColumns([...initialColumns, operationsColumn]);
      setSelectedColumns(
        initialColumns.filter((col) => !col.hide).map((col) => col.field)
      );
      setVisibleColumns([
        ...initialColumns.filter((column) => !column.hide),
        operationsColumn,
      ]);
    }
  }, [data, defaultHiddenColumns, showedit, showdelete]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedColumns(typeof value === "string" ? value.split(",") : value);
    const updatedColumns = columns.map((column) =>
      value.includes(column.field) || column.field === "operations"
        ? { ...column, hide: false }
        : { ...column, hide: true }
    );
    setColumns(updatedColumns);
    setVisibleColumns(updatedColumns.filter((column) => !column.hide));
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
        }}
      >
        <FormControl size="small" fullWidth>
          <InputLabel id="columns-visibility-label">
            {t("Column Visibility")}
          </InputLabel>
          <Select
            labelId="columns-visibility-label"
            label={t("Column Visibility")}
            variant="outlined"
            multiple
            value={selectedColumns}
            onChange={handleChange}
            renderValue={(selected) => (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {selected.length} {t("columns selected")}
              </Typography>
            )}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
            }}
          >
            {columns
              .filter((e) => e.field !== "operations")
              .map((column) => (
                <MenuItem
                  key={column.field}
                  value={column.field}
                  sx={{ py: 0.5 }}
                >
                  <Checkbox 
                    checked={!column.hide}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <ListItemText
                    primary={column.headerName}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ height: '60vh', width: '100%' }}>
        <DataGrid
          rows={data}
          columns={visibleColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          disableColumnSelector
          sx={{
            border: 0,
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
              padding: '12px 16px',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #e0e0e0',
              '& .MuiDataGrid-columnHeader': {
                borderRight: '1px solid #e0e0e0',
                '&:last-child': {
                  borderRight: 'none',
                },
              },
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#424242',
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {
                backgroundColor: '#fafafa',
              },
              '&:nth-of-type(even)': {
                backgroundColor: '#ffffff',
              },
              '&:hover': {
                backgroundColor: '#f0f8ff',
                transition: 'background-color 0.2s ease',
              },
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: '8px 16px',
              backgroundColor: '#fafafa',
              borderBottom: '1px solid #e0e0e0',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: 'transparent',
            },
            maxWidth: isSidebarOpen && !isMobile ? "100%" : "100%",
          }}
        />
      </Box>
    </Paper>
  );
};

export default DataTable;
