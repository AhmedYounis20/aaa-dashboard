import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import ReactDOMServer from "react-dom/server";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Avatar,
  Chip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Pagination,
  PaginationItem,
  Select,
  FormControl,
} from "@mui/material";
import {
  EditNote,
  Delete,
  Visibility,
  FilterList,
  ViewColumn,
  FileDownload,
  MoreVert,
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import SyncIcon from "@mui/icons-material/Sync";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { FaInfo } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { RxCaretUp } from "react-icons/rx";
import { RxCaretDown } from "react-icons/rx";
import { RxCaretSort } from "react-icons/rx";
import { FiFilter } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbLayoutColumns } from "react-icons/tb";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { FormTypes } from "../../interfaces/Components/FormType";
import { useTranslation } from "react-i18next";
import { ColumnVisibilityDropdown } from "./ColumnVisibilityDropdown";
import { AdvancedFilterDropdown } from "./AdvancedFilterDropdown";
import ThemedTooltip from "../UI/ThemedTooltip";

const getAgGridLocaleText = (t) => ({
  contains: t("contains"),
  notContains: t("notContains"),
  equals: t("equals"),
  notEqual: t("notEqual"),
  startsWith: t("startsWith"),
  endsWith: t("endsWith"),
  blank: t("blank"),
  notBlank: t("notBlank"),
  filterOoo: t('Filter'), 
});

const DataTable = ({
  data = [],
  defaultHiddenColumns = [],
  defaultColumns,
  changeFormType,
  handleSelectId,
  handleShowForm,
  showedit = true,
  showdelete = true,
  showEditButtonIf = (e) => true,
  showDeleteButtonIf = (e) => true,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [colDefs, setColDefs] = useState([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const columnSelectorRef = useRef(null);
  const filterButtonRef = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  const ActionsRenderer = (params) => {
    return (
      <Box
        sx={{ display: "flex", gap: 0.5, alignItems: "center", height: "100%" }}
      >
        {showedit && showEditButtonIf(params.data) && (
          <ThemedTooltip title={t("Edit")}>
            <IconButton
              size="small"
              onClick={() => {
                changeFormType(FormTypes.Edit);
                handleSelectId(params.data.id);
                handleShowForm();
              }}
              sx={{
                borderRadius: ".25rem",
                "&:hover": { color: theme.palette.info.main },
              }}
            >
              <FaRegEdit fontSize="medium" />
            </IconButton>
          </ThemedTooltip>
        )}

        <ThemedTooltip title={t("View")}>
          <IconButton
            size="small"
            onClick={() => {
              changeFormType(FormTypes.Details);
              handleSelectId(params.data.id);
              handleShowForm();
            }}
            sx={{
              borderRadius: ".25rem",
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            <FaInfo fontSize="medium" />
          </IconButton>
        </ThemedTooltip>

        {showdelete && showDeleteButtonIf(params.data) && (
          <ThemedTooltip title={t("Delete")}>
            <IconButton
              size="small"
              onClick={() => {
                changeFormType(FormTypes.Delete);
                handleSelectId(params.data.id);
                handleShowForm();
              }}
              sx={{
                borderRadius: ".25rem",
                "&:hover": { color: theme.palette.error.main },
              }}
            >
              <RiDeleteBin6Line fontSize="medium" />
            </IconButton>
          </ThemedTooltip>
        )}
      </Box>
    );
  };

  const getValueByAccessor = (obj, accessor) => {
    if (!accessor) return undefined;
    return accessor
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
        obj
      );
  };

  useEffect(() => {
    if (data.length > 0 || (defaultColumns && defaultColumns.length > 0)) {
      let initialColumns = [];

      const sourceColumns =
        defaultColumns && defaultColumns.length > 0
          ? defaultColumns
          : Object.keys(data[0] || {}).map((key) => ({
            field: key,
            headerName: key,
          }));

      initialColumns = sourceColumns.map((col) => {
        const field = col.accessor || col.field;
        const headerName = t(col.Header || col.headerName || col.field);
        const isHidden = defaultHiddenColumns.includes(field);

        const hasCustomRenderer = !!col.renderCell || !!col.cellRenderer;
        const cellRenderer = col.renderCell
          ? (params) =>
              col.renderCell({
                ...params,
                value:
                  params.value !== undefined
                    ? params.value
                    : getValueByAccessor(params.data, field),
              })
          : col.cellRenderer;

        return {
          field: field,
          headerName: headerName,
          hide: isHidden,
          flex: 1,
          minWidth: 120,
          filter: true,
          sortable: true,
          resizable: true,
          unSortIcon: true,
          cellStyle: { color: theme.palette.text.primary },
          valueGetter: (params) => {
            if (col.valueGetter) return col.valueGetter(params);
            if (col.accessor && col.accessor.includes(".")) {
              return getValueByAccessor(params.data, col.accessor);
            }
            return params.data[field];
          },
          ...(hasCustomRenderer && { cellRenderer }),
        };
      });

      const actionsCol = {
        field: "operations",
        headerName: t("Operations"),
        cellRenderer: ActionsRenderer,
        width: 140,
        pinned: theme.direction === "rtl" ? "left" : "right",
        lockPosition: true,
        suppressMovable: true,
        lockPinned: true,
        sortable: false,
        filter: false,
        resizable: false,
        suppressSizeToFit: true,
        cellStyle: {
          display: "flex",
          justifyContent: "center",
          border: "unset",
        },
      };

      setColDefs([...initialColumns, actionsCol]);
    }
  }, [data, defaultColumns, defaultHiddenColumns, t, showedit, showdelete]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    setTotalRows(params.api.getDisplayedRowCount());
    setTotalPages(params.api.paginationGetTotalPages());
  };

  const onPaginationChanged = useCallback(() => {
    if (gridApi) {
      setPage(gridApi.paginationGetCurrentPage() + 1);
      setTotalPages(gridApi.paginationGetTotalPages());
      setTotalRows(gridApi.getDisplayedRowCount());
    }
  }, [gridApi]);

  const toggleColumnVisibility = useCallback(
    (columnField) => {
      if (!gridApi) return;

      const col = gridApi.getColumnDef(columnField);
      if (!col) return;
      const newHide = !col.hide;

      const newColDefs = colDefs.map((c) =>
        c.field === columnField ? { ...c, hide: newHide } : c
      );

      setColDefs(newColDefs);
    },
    [gridApi, colDefs]
  );

  const onBtnExport = () => {
    const selectedRows = gridApi.getSelectedRows();
    const domainName = window.location.pathname.split("/").pop();
    gridApi.exportDataAsCsv({
      fileName: `${domainName}_${new Date().toLocaleDateString()}.csv`,
      onlySelected: selectedRows.length > 0,
      columnKeys: colDefs
        .filter(col => col.field !== 'operations')
        .map(col => col.field),
    });
  };

  // TODO:: Implement sync data functionality
  const onSyncData = async () => { };

  const CustomToolbar = () => {
    return (
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box ref={columnSelectorRef} sx={{ position: "relative" }}>
            <Button
              variant="outlined"
              startIcon={<TbLayoutColumns />}
              size="medium"
              sx={{
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                textTransform: "none",
                fontWeight: "500",
                "&:hover": { borderColor: "inherit", boxShadow: "none" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowColumnSelector(!showColumnSelector);
              }}
            >
              {t("Columns")}
            </Button>
            {showColumnSelector && (
              <ColumnVisibilityDropdown
                visibleColumns={visibleColumns}
                onToggleColumn={toggleColumnVisibility}
                columnLabels={fieldLabels}
              />
            )}
          </Box>
          <Box ref={filterButtonRef} sx={{ position: "relative" }}>
            <Button
              variant="outlined"
              startIcon={<FiFilter />}
              size="medium"
              sx={{
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                textTransform: "none",
                fontWeight: "500",
                "&:hover": { borderColor: "inherit", boxShadow: "none" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowFilterDropdown(!showFilterDropdown);
              }}
            >
              {t("Filter")}
            </Button>
            {showFilterDropdown && (
              <AdvancedFilterDropdown
                gridApi={gridApi}
                columnLabels={fieldLabels}
                onClose={() => setShowFilterDropdown(false)}
              />
            )}
          </Box>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            size="medium"
            onClick={onBtnExport}
            sx={{
              color: "success.main",
              borderColor: "#7bf1a8",
              bgcolor: "success.lighter",
              textTransform: "none",
              fontWeight: "500",
              "&:hover": {
                bgcolor: "#f0fdf4",
                borderColor: "#7bf1a8",
                color: "black",
                boxShadow: "none",
              },
            }}
          >
            {t("Export")}
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={onSyncData}>
            <SyncIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            Updated just now
          </Typography>
        </Box>
      </Box>
    );
  };

  const CustomPagination = () => {
    const startRow = (page - 1) * pageSize + 1;
    const endRow = Math.min(page * pageSize, totalRows);

    const handlePageChange = (event, value) => {
      if (gridApi) {
        gridApi.paginationGoToPage(value - 1);
      }
    };

    const handlePageSizeChange = (event) => {
      const newSize = Number(event.target.value);
      setPageSize(newSize);
      if (gridApi) {
        gridApi.paginationSetPageSize(newSize);
      }
    };

    return (
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: theme.palette.background.paper,
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
          zIndex: 1,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t("Rows per page:")}
            </Typography>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              size="small"
              sx={{
                height: 32,
                "& .MuiSelect-select": { py: 0.5, px: 1.5 },
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
              }}
            >
              {[10, 25, 50, 100].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t("Showing")} {totalRows > 0 ? startRow : 0}-{endRow} {t("of")}{" "}
            {totalRows}
          </Typography>
        </Box>

        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              slots={{
                first: FirstPage,
                last: LastPage,
                previous: KeyboardArrowLeft,
                next: KeyboardArrowRight,
              }}
              {...item}
            />
          )}
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 1,
              mx: 0.5,
              border: `1px solid transparent`,
              "&.Mui-selected": {
                backgroundColor: "transparent",
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-selected:hover": {
                backgroundColor: "transparent",
              },
              "&:not(.Mui-selected):hover": {
                backgroundColor: theme.palette.action.hover,
              },
            },
          }}
        />
      </Box>
    );
  };

  const visibleColumns = useMemo(() => {
    const columns = {};
    colDefs
      .filter((col) => col.field !== "operations")
      .forEach((col) => {
        columns[col.field] = !col.hide;
      });
    return columns;
  }, [colDefs]);

  const fieldLabels = useMemo(() => {
    const labels = {};
    colDefs
      .filter((col) => col.field !== "operations")
      .forEach((col) => {
        labels[col.field] = col.headerName;
      });
    return labels;
  }, [colDefs]);

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      sortable: true,
      resizable: true,
      headerClass: "custom-header",
    };
  }, []);

  return (
    <Box
      sx={{
        height: 600,
        width: "100%",
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomToolbar />
      <Box
        className="ag-theme-quartz"
        sx={{
          flex: 1,
          width: "100%",
          "& .ag-root-wrapper": {
            border: "none",
            borderRadius: 0,
            backgroundColor: theme.palette.background.paper,
          },
          "& .ag-header": {
            color: theme.palette.text.primary,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
            zIndex: 1,
          },
          "& .ag-header-row": {
            fontWeight: 600,
            fontSize: "0.75rem",
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.default,
          },
          "& .ag-pinned-right-header": {
            border: "none",
            boxShadow:
              theme.direction === "rtl"
                ? "none"
                : "-4px 0 20px rgba(0, 0, 0, 0.08)",
            zIndex: 1,
          },
          "& .ag-pinned-left-header": {
            border: "none",
            boxShadow:
              theme.direction === "rtl"
                ? "4px 0 20px rgba(0, 0, 0, 0.08)"
                : "none",
            zIndex: 1,
          },
          "& .ag-pinned-right-cols-container": {
            boxShadow:
              theme.direction === "rtl"
                ? "none"
                : "-4px 0 20px rgba(0, 0, 0, 0.08)",
            zIndex: 1,
          },
          "& .ag-pinned-left-cols-container": {
            boxShadow:
              theme.direction === "rtl"
                ? "4px 0 20px rgba(0, 0, 0, 0.08)"
                : "none",
            zIndex: 1,
          },
          "& .ag-header-cell-label": {
            color: theme.palette.text.secondary,
          },
          "& .ag-header-cell-sorted-asc .ag-header-cell-label": {
            color: theme.palette.primary.main,
          },
          "& .ag-header-cell-sorted-desc .ag-header-cell-label": {
            color: theme.palette.primary.main,
          },
          "& .ag-header-cell-filter-button:hover": {
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 4px ${theme.palette.background.paper}`,
          },
          "& .ag-menu": {
            borderColor: theme.palette.background.paper,
          },
          "& .ag-filter-body-wrapper": {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
          },
          "& .ag-picker-field-wrapper": {
            color: `${theme.palette.text.primary} !important`,
            borderColor: `${theme.palette.divider} !important`,
            backgroundColor: `${theme.palette.background.paper} !important`,
          },
          "& .ag-input-field-input": {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            borderColor: `${theme.palette.divider} !important`,
          },
          "& .ag-header-cell-resize::after": {
            backgroundColor: theme.palette.text.disabled,
          },
          "& .ag-header-cell-moving": {
            backgroundColor: theme.palette.action.selected,
          },
          "& .ag-pinned-right-header .ag-header-cell-label": {
            justifyContent: "center",
          },
          "& .ag-row": {
            fontSize: "0.875rem",
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .ag-cell": {
            display: "flex",
            alignItems: "center",
            paddingTop: "8px",
            paddingBottom: "8px",
          },
          "& .ag-checkbox-input-wrapper.ag-checked::after": {
            color: theme.palette.primary.main,
          },
          "& .ag-body": {
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <AgGridReact
          theme="legacy"
          columnDefs={colDefs}
          rowData={data}
          defaultColDef={defaultColDef}
          rowSelection={{
            mode: "multiRow",
            suppressRowClickSelection: false,
          }}
          icons={{
            filter: ReactDOMServer.renderToString(
              <FiFilter
                fontSize="medium"
                color={theme.palette.text.secondary}
              />
            ),
            sortAscending: ReactDOMServer.renderToString(
              <RxCaretUp
                style={{
                  fontSize: "1.1rem",
                }}
              />
            ),
            sortDescending: ReactDOMServer.renderToString(
              <RxCaretDown
                style={{
                  fontSize: "1.1rem",
                }}
              />
            ),
            sortUnSort: ReactDOMServer.renderToString(
              <RxCaretSort
                style={{
                  fontSize: "1.1rem",
                }}
              />
            ),
          }}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={pageSize}
          suppressPaginationPanel={true}
          onPaginationChanged={onPaginationChanged}
          animateRows={true}
          multiSortKey={"ctrl"}
          localeText={useMemo(() => getAgGridLocaleText(t), [t])}
          enableRtl={theme.direction === "rtl" ? true : false}
        />
      </Box>
      <CustomPagination />
    </Box>
  );
};

export default DataTable;
