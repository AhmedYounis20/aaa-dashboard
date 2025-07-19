// src/Components/TreeTable.js
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Paper,
  Box,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
  EditNote,
  Info,
  Delete,
  Folder,
  Add,
  Visibility,
} from "@mui/icons-material";
import { FormTypes } from "../../interfaces/Components/FormType";
import ImagePreview from "../Images/ImagePreview";
import { useTranslation } from "react-i18next";

// Utility to get nested value by accessor string (e.g., 'a.b.c')
const getValueByAccessor = (obj, accessor) => {
  if (!accessor) return undefined;
  return accessor.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

const DataTreeTable = ({
  columns,
  data,
  handleShowForm,
  changeFormType,
  handleSelectId,
  handleSelectParentId,
  showedit = true,
  showadd = true,
  showdelete = true,
  showEditButtonIf = (e)=> true,
  showDeleteButtonIf = (e)=> true

}) => {
  const [openRows, setOpenRows] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
  const {t} = useTranslation();
  const theme = useTheme();
  
  const handleToggle = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBackgroundColor = (depth) => {
    const colors = [
      theme.palette.background.paper,
      theme.palette.action.hover,
      theme.palette.grey[50],
      theme.palette.grey[100],
      theme.palette.grey[200]
    ];
    return colors[depth % colors.length];
  };

  const handleMouseEnter = (id) => {
    setHoveredRow(id);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const renderCell = (row, column) => {
    let value;
    if (typeof column.function === 'function') {
      value = column.function(getValueByAccessor(row, column.accessor));
    } else {
      value = getValueByAccessor(row, column.accessor);
    }
    return (
      <TableCell 
        key={column.accessor}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          padding: '12px 16px',
          fontSize: '0.875rem',
          color: theme.palette.text.primary,
        }}
      >
        {value}
      </TableCell>
    );
  };

  const renderRows = (rows, depth = 0) => {
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <TableRow
          sx={{
            backgroundColor: hoveredRow === row.id 
              ? theme.palette.action.hover
              : getBackgroundColor(depth),
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
          onMouseEnter={() => handleMouseEnter(row.id)}
          onMouseLeave={handleMouseLeave}
        >
          <TableCell 
            sx={{ 
              paddingLeft: depth * 20 + 16,
              borderBottom: `1px solid ${theme.palette.divider}`,
              width: '50px',
            }}
          >
            {data?.filter((e) => e.parentId === row.id) &&
              data?.find((e) => e.parentId === row.id) && (
                <IconButton 
                  size="small" 
                  onClick={() => handleToggle(row.id)}
                  sx={{
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.light,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {openRows[row.id] ? (
                    <KeyboardArrowDown />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </IconButton>
              )}
          </TableCell>
          <TableCell 
            sx={{ 
              width: '50px', 
              paddingLeft: 8,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            {row.nodeType == 1 ? (
              <IconButton 
                size="small" 
                onClick={() => handleToggle(row.id)}
                sx={{
                  color: theme.palette.warning.main,
                  backgroundColor: theme.palette.warning.light,
                  '&:hover': {
                    backgroundColor: theme.palette.warning.main,
                    color: theme.palette.warning.contrastText,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Folder />
              </IconButton>
            ) : (
              <Box sx={{ width: 24, height: 24 }} />
            )}
          </TableCell>
          {columns.map((column) => renderCell(row, column))}
          <TableCell
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              padding: '8px 16px',
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {showadd && (
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
                    handleSelectParentId(row["id"]);
                    handleSelectId(row["id"]);
                    changeFormType(FormTypes.Add);
                    handleShowForm();
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              )}
              {showedit && showEditButtonIf(row) && (
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
                    handleSelectId(row["id"]);
                    handleShowForm();
                  }}
                >
                  <EditNote fontSize="small" />
                </IconButton>
              )}
              {showdelete && showDeleteButtonIf(row) && (
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
                    handleSelectId(row["id"]);
                    handleShowForm();
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                sx={{
                  color: theme.palette.info.contrastText,
                  background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                  boxShadow: `0 2px 8px rgba(${theme.palette.info.main}, 0.3)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`,
                    color: theme.palette.info.contrastText,
                    transform: 'scale(1.1)',
                    boxShadow: `0 4px 12px rgba(${theme.palette.info.main}, 0.4)`,
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={() => {
                  changeFormType(FormTypes.Details);
                  handleSelectId(row["id"]);
                  handleShowForm();
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {renderRows(
                      data?.filter((e) => e.parentId === row.id),
                      depth + 1
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    ));
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0,
        boxShadow: 'none',
        border: 'none',
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="tree table">
        <TableHead>
          <TableRow sx={{
            backgroundColor: theme.palette.primary.main,
            '& .MuiTableCell-head': {
              color: theme.palette.mode === 'dark' ? '#fff' : '#111',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderBottom: `1px solid ${theme.palette.primary.dark}`,
            },
          }}>
            <TableCell sx={{ width: '50px', color: theme.palette.mode === 'dark' ? '#fff' : '#111' }}></TableCell>
            <TableCell sx={{ width: '50px', color: theme.palette.mode === 'dark' ? '#fff' : '#111' }}></TableCell>
            {columns.map((column) => (
              <TableCell 
                key={column.accessor}
                sx={{
                  borderBottom: `1px solid ${theme.palette.primary.dark}`,
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: theme.palette.mode === 'dark' ? '#fff' : '#111',
                }}
              >
                {t(column.Header || column.header)}
              </TableCell>
            ))}
            <TableCell 
              sx={{
                borderBottom: `1px solid ${theme.palette.primary.dark}`,
                padding: '12px 16px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: theme.palette.mode === 'dark' ? '#fff' : '#111',
              }}
            >
              {t("Operations")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows(data?.filter((e) => !e.parentId))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTreeTable;
