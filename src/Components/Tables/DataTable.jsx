import React, { useState, useEffect, useContext } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  Paper, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Checkbox, 
  ListItemText,
  IconButton,
  useTheme
} from '@mui/material';
import { EditNote, Delete, Visibility } from '@mui/icons-material';
import { FormTypes } from '../../interfaces/Components/FormType';
import { useTranslation } from "react-i18next";
import { appContext } from '../../layout/DefaultLayout';

const DataTable = ({
  data = [],
  defaultHiddenColumns = [],
  defaultColumns,
  changeFormType,
  handleSelectId,
  handleShowForm,
  showedit = true,
  showdelete = true,
  showEditButtonIf = (e)=> true,
  showDeleteButtonIf = (e)=> true
}) => {
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const {t} = useTranslation();
  const { isSidebarOpen, isMobile} = useContext(appContext);
  const theme = useTheme();

  const getValueByAccessor = (obj, accessor) => {
    if (!accessor) return undefined;
    return accessor.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  };

  useEffect(() => {
    if (data.length > 0) {
      let initialColumns;
      if (Array.isArray(defaultColumns) && defaultColumns.length > 0) {
        initialColumns = (defaultColumns).map((col) => ({
          ...col,
          field: col.accessor || col.Header || col.field,
          headerName: t(col.Header || col.headerName || col.field),
          hide: defaultHiddenColumns.includes(col.accessor || col.field),
          flex: 1,
          minWidth: 120,
          groupable: true,
          headerClassName: 'custom-header',
          cellClassName: 'custom-cell',
          valueGetter: col.accessor && col.accessor.includes('.')
            ? (params) => getValueByAccessor(params.row, col.accessor)
            : undefined,
        }));
      } else {
        initialColumns = Object.keys(data[0]).map((field) => ({
          field: field,
          headerName: t(field.charAt(0).toUpperCase() + field.slice(1)),
          hide: defaultHiddenColumns.includes(field),
          flex: 1,
          minWidth: 120,
          groupable: true,
          headerClassName: 'custom-header',
          cellClassName: 'custom-cell',
        }));
      }

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
            {(showedit && showEditButtonIf(params.row)) && (
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.primary.contrastText,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 2px 8px rgba(${theme.palette.primary.main}, 0.3)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    color: theme.palette.primary.contrastText,
                    transform: 'scale(1.1)',
                    boxShadow: `0 4px 12px rgba(${theme.palette.primary.main}, 0.4)`,
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            {showdelete  && showDeleteButtonIf(params.row) && (
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.error.contrastText,
                  background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                  boxShadow: `0 2px 8px rgba(${theme.palette.error.main}, 0.3)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                    color: theme.palette.error.contrastText,
                    transform: 'scale(1.1)',
                    boxShadow: `0 4px 12px rgba(${theme.palette.error.main}, 0.4)`,
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                color: theme.palette.success.contrastText,
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                boxShadow: `0 2px 8px rgba(${theme.palette.success.main}, 0.3)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                  color: theme.palette.success.contrastText,
                  transform: 'scale(1.1)',
                  boxShadow: `0 4px 12px rgba(${theme.palette.success.main}, 0.4)`,
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
  }, [data, defaultHiddenColumns, showedit, showdelete, theme]);

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
      elevation={0}
      sx={{
        borderRadius: 0,
        overflow: 'hidden',
        border: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
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
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {selected.length} {t("columns selected")}
              </Typography>
            )}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
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
            backgroundColor: theme.palette.background.paper,
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${theme.palette.divider}`,
              paddingTop: '14px', // Make top and bottom padding equal
              paddingBottom: '14px',
              paddingLeft: '16px',
              paddingRight: '16px',
              fontSize: '0.875rem',
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.primary.main || '#1976d2',
              color: theme.palette.mode === 'dark' ? '#fff' : '#111',
              fontSize: '0.875rem',
              fontWeight: 600,
              borderBottom: `2px solid ${theme.palette.primary.dark || '#115293'}`,
              textShadow: '0 1px 2px rgba(0,0,0,0.08)',
            },
            '& .MuiDataGrid-columnHeader': {
              borderBottom: `1px solid ${theme.palette.primary.dark}`,
            },
            '& .MuiDataGrid-row': {
              minHeight: '56px', // Use MUI default row height for better padding
              maxHeight: 'none',
              '& > .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                paddingTop: '16px',
                paddingBottom: '16px',
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              },
            },
            '& .MuiDataGrid-toolbarContainer': {
              backgroundColor: theme.palette.background.default,
              borderBottom: `1px solid ${theme.palette.divider}`,
              padding: '8px 16px',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: theme.palette.background.default,
              borderTop: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default DataTable;
