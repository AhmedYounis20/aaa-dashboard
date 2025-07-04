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
}) => {
  const [openRows, setOpenRows] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
  const {t} = useTranslation();
  
  const handleToggle = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBackgroundColor = (depth) => {
    const colors = [
      '#f8f9fa', 
      '#e9ecef', 
      '#dee2e6', 
      '#ced4da', 
      '#adb5bd'
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

    if (column.accessor === "chartOfAccount.code" && row.chartOfAccount) {
      value = row["chartOfAccount"]["code"];
    } else {
      value = typeof column.function == "function"
        ? column.function(row[column.accessor])
        : row[column.accessor];
    }
  
    return (
      <TableCell 
        key={column.accessor}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          padding: '12px 16px',
          fontSize: '0.875rem',
          color: '#424242',
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
              ? '#f0f8ff' 
              : getBackgroundColor(depth),
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: '#f0f8ff',
            },
          }}
          onMouseEnter={() => handleMouseEnter(row.id)}
          onMouseLeave={handleMouseLeave}
        >
          <TableCell 
            sx={{ 
              paddingLeft: depth * 20 + 16,
              borderBottom: '1px solid #e0e0e0',
              width: '50px',
            }}
          >
            {data?.filter((e) => e.parentId === row.id) &&
              data?.find((e) => e.parentId === row.id) && (
                <IconButton 
                  size="small" 
                  onClick={() => handleToggle(row.id)}
                  sx={{
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    },
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
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            {row.nodeType == 1 ? (
              <IconButton 
                size="small" 
                onClick={() => handleToggle(row.id)}
                sx={{
                  color: '#ff9800',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  },
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
              borderBottom: '1px solid #e0e0e0',
              padding: '8px 16px',
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {showadd && (
                <IconButton
                  size="small"
                  sx={{
                    color: '#2e7d32',
                    '&:hover': {
                      backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    },
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
                    handleSelectId(row["id"]);
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
                  color: '#7b1fa2',
                  '&:hover': {
                    backgroundColor: 'rgba(123, 31, 162, 0.1)',
                  },
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
        {data.filter((e) => e.parentId == row.id) && (
          <TableRow>
            <TableCell 
              sx={{ padding: 0 }} 
              colSpan={columns.length + 3}
            >
              <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                <Box sx={{ backgroundColor: '#fafafa' }}>
                  <Table size="small">
                    <TableBody>
                      {renderRows(
                        data.filter((e) => e["parentId"] === row.id),
                        depth + 1
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ));
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
      <TableContainer
        sx={{
          maxHeight: "72vh",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell 
                sx={{ 
                  width: '50px',
                  borderBottom: '2px solid #e0e0e0',
                  backgroundColor: '#f5f5f5',
                }}
              />
              <TableCell 
                sx={{ 
                  width: '50px',
                  borderBottom: '2px solid #e0e0e0',
                  backgroundColor: '#f5f5f5',
                }}
              />
              {columns.map((column, index) => (
                <TableCell 
                  key={index}
                  sx={{
                    borderBottom: '2px solid #e0e0e0',
                    backgroundColor: '#f5f5f5',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#424242',
                    padding: '16px',
                  }}
                >
                  {t(column.Header)}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  borderBottom: '2px solid #e0e0e0',
                  backgroundColor: '#f5f5f5',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#424242',
                  padding: '16px',
                }}
              >
                {t("Operations")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              renderRows(data.filter((e) => !e.parentId))
            ) : (
              <TableRow sx={{ backgroundColor: getBackgroundColor(1) }}>
                <TableCell
                  colSpan={columns.length + 3}
                  sx={{ 
                    textAlign: "center",
                    padding: '40px 16px',
                    color: '#666',
                    fontSize: '1rem',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color="text.secondary">
                      {t("NoData")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("NoDataAvailable")}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTreeTable;
