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
} from "@mui/material";
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
  EditNote,
  Info,
  Delete,
  Folder,
  Add,
} from "@mui/icons-material";
import { FormTypes } from "../../interfaces/Components/FormType";

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

  const handleToggle = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBackgroundColor = (depth) => {
    const colors = ["#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280"];
    return colors[depth % colors.length];
  };

  const handleMouseEnter = (id) => {
    setHoveredRow(id);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const renderCell = (row, column) => {
    const value =
      column.accessor == "chartOfAccount.code" && row.chartOfAccount
        ? row["chartOfAccount"]["code"]
        : row[column.accessor];

    return <TableCell key={column.accessor}>{value}</TableCell>;
  };

  const renderRows = (rows, depth = 0) => {
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <TableRow
          style={{
            backgroundColor:
              hoveredRow === row.id ? "#f0f0f0" : getBackgroundColor(depth),
          }}
          onMouseEnter={() => handleMouseEnter(row.id)}
          onMouseLeave={handleMouseLeave}
        >
          <TableCell style={{ paddingLeft: depth * 15 }}>
            {data.filter((e) => e.parentId === row.id) &&
              data.filter((e) => e.parentId === row.id).length > 0 && (
                <IconButton size="small" onClick={() => handleToggle(row.id)}>
                  {openRows[row.id] ? (
                    <KeyboardArrowDown />
                  ) : (
                      <KeyboardArrowRight />
                  )}
                </IconButton>
              )}
          </TableCell>
          <TableCell style={{ width: 5, paddingLeft: 0 }}>
            {row.nodeType == 1 ? (
              <IconButton size="small" onClick={() => handleToggle(row.id)}>
                <Folder />
              </IconButton>
            ) : (
              <></>
            )}
          </TableCell>
          {columns.map((column) => renderCell(row, column))}
          <TableCell>
            {showadd && (
              <IconButton
                size="small"
                style={{ marginInline: 2 }}
                onClick={() => {
                  handleSelectParentId(row["id"]);
                  handleSelectId(row["id"]);
                  changeFormType(FormTypes.Add);
                  handleShowForm();
                }}
              >
                <Add titleAccess="add" />
              </IconButton>
            )}
            {showedit && (
              <IconButton
                size="small"
                style={{ marginInline: 2 }}
                onClick={() => {
                  changeFormType(FormTypes.Edit);
                  handleSelectId(row["id"]);
                  handleShowForm();
                }}
              >
                <EditNote titleAccess="edit" />
              </IconButton>
            )}
            {showdelete && (
              <IconButton
                size="small"
                style={{ marginInline: 2 }}
                onClick={() => {
                  changeFormType(FormTypes.Delete);
                  handleSelectId(row["id"]);
                  handleShowForm();
                }}
              >
                <Delete titleAccess="delete" />
              </IconButton>
            )}
            <IconButton
              size="small"
              style={{ marginInline: 2 }}
              onClick={() => {
                changeFormType(FormTypes.Details);
                handleSelectId(row["id"]);
                handleShowForm();
              }}
            >
              <Info titleAccess="Details" />
            </IconButton>{" "}
          </TableCell>
        </TableRow>
        {data.filter((e) => e.parentId == row.id) && (
          <TableRow>
            <TableCell style={{ padding: 0 }} colSpan={columns.length + 3}>
              <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                <Table size="small">
                  <TableBody>
                    {renderRows(
                      data.filter((e) => e["parentId"] === row.id),
                      depth + 1
                    )}
                  </TableBody>
                </Table>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ));
  };

  return (
    <TableContainer
      component={Paper}
      style={{ maxHeight: 700, height: "100%", overflow: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell style={{ width: 5, paddingLeft: 0 }} />
            {columns.map((column, index) => (
              <TableCell key={index}>{column.Header}</TableCell>
            ))}
            <TableCell>Operations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            renderRows(data.filter(e=>!e.parentId))
          ) : (
            <React.Fragment>
              <TableRow style={{ backgroundColor: getBackgroundColor(1) }}>
                <TableCell
                  colSpan={columns.length + 3}
                  style={{ textAlign: "center" }}
                >
                  No Data
                </TableCell>
              </TableRow>
            </React.Fragment>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTreeTable;
