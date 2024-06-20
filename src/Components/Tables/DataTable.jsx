import { useState, useEffect } from "react";
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
} from "@mui/material";
import { FormTypes } from "../../interfaces/Components";
import { Delete, EditNote, Info } from "@mui/icons-material";

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

  useEffect(() => {
    if (data.length > 0) {
      const initialColumns = Object.keys(data[0]).map((field) => ({
        field: field,
        headerName: field.charAt(0).toUpperCase() + field.slice(1),
        hide: defaultHiddenColumns.includes(field),
        flex:1,
        groupable:true
      }));

      const operationsColumn = {
        field: "operations",
        headerName: "Operations",
        width: 150,
        renderCell: (params) => (
          <div tabIndex={-1}>
            {showedit && (
              <IconButton
                size="small"
                style={{ marginInline: 2 }}
                onClick={() => {
                  changeFormType(FormTypes.Edit);
                  handleSelectId(params.row.id);
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
                  handleSelectId(params.row.id);
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
                handleSelectId(params.row.id);
                handleShowForm();
              }}
            >
              <Info titleAccess="Details" />
            </IconButton>
          </div>
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
    <Grid
      container
      style={{ padding: 10, borderRadius: 10 }}
      className="border"
    >
      <Grid item xs={12} style={{ marginBottom: 10 }}>
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel id="demo-simple-select-label"  variant="outlined">
            {"columns Visiblity"}
          </InputLabel>
          <Select
            label={"columns Visiblity"}
            title="columns Visiblity"
            variant="outlined"
            multiple
            value={selectedColumns}
            onChange={handleChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {columns
              .filter((e) => e.field !== "operations")
              .map((column) => (
                <MenuItem key={column.field} value={column.field}>
                  <Checkbox checked={!column.hide} />
                  <ListItemText primary={column.headerName} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={visibleColumns}
          pageSize={5}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          disableColumnSelector
          style={{ border: 0 }}
          sx={{
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
            ".MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "rgba(235, 235, 235, .7)",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "white",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DataTable;
