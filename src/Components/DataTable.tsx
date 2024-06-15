import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormLabel,
} from "@mui/material";

const DataTable = ({ data, defaultHiddenColumns = [] }) => {
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const initialColumns = Object.keys(data[0]).map((field) => ({
        field: field,
        headerName: field.charAt(0).toUpperCase() + field.slice(1),
        width: 150,
        hide: defaultHiddenColumns.includes(field),
      }));
      setColumns(initialColumns);
      setVisibleColumns(initialColumns.filter((column) => !column.hide));
    }
  }, [data, defaultHiddenColumns]);

  const handleToggleColumn = (field) => {
    const updatedColumns = columns.map((column) =>
      column.field === field ? { ...column, hide: !column.hide } : column
    );
    setColumns(updatedColumns);
    setVisibleColumns(updatedColumns.filter((column) => !column.hide));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{ marginBottom: "1rem" }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Columns Visibility</FormLabel>
          <FormGroup row>
            {columns.map((column) => (
              <FormControlLabel
                key={column.field}
                control={
                  <Checkbox
                    checked={!column.hide}
                    onChange={() => handleToggleColumn(column.field)}
                    name={column.headerName}
                    color="primary"
                  />
                }
                label={column.headerName}
                style={{ marginRight: "1rem" }}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ height: 400, width: "100%" }}>
        <DataGrid rows={data} columns={visibleColumns} pageSize={5} disableColumnSelector />
      </Grid>
    </Grid>
  );
};

export default DataTable;
