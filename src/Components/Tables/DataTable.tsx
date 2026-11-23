import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

type GridApi = NonNullable<Parameters<NonNullable<AgGridReactProps["onGridReady"]>>[0]>["api"];
type ColumnDefs = NonNullable<AgGridReactProps["columnDefs"]>;
type FlatColDef = Extract<NonNullable<ColumnDefs>[number], { field?: string }>;

import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  Search,
} from "@mui/icons-material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Typography,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaRegEdit } from "react-icons/fa";
import { FaInfo } from "react-icons/fa6";
import { FiFilter } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbLayoutColumns } from "react-icons/tb";
import { FormTypes } from "@/interfaces/Components/FormType";
import { ErrorState } from "@/Components/feedback";
import ThemedTooltip from "../UI/ThemedTooltip";
import { AdvancedFilterDropdown } from "./AdvancedFilterDropdown";
import { getAgGridLocaleText } from "./agGridLocale";
import {
  buildDataTableColumns,
  columnsFromRowKeys,
  deriveColumnMeta,
} from "./buildDataTableColumns";
import { ColumnVisibilityDropdown } from "./ColumnVisibilityDropdown";
import { mapServerFetchResult } from "./serverFetch";
import { resolveShowFlags, type DataTableProps, type TableColumnDef } from "./types";

/** Stable defaults — inline `() => true` in params recreates every render and loops setColDefs. */
const alwaysShowButton = () => true;

function DataTable<T extends { id?: string } = Record<string, unknown> & { id?: string }>({
  defaultHiddenColumns = [],
  defaultColumns,
  changeFormType,
  handleSelectId,
  handleShowForm,
  showedit,
  showdelete,
  showEdit,
  showDelete,
  showEditButtonIf = alwaysShowButton,
  showDeleteButtonIf = alwaysShowButton,
  data: dataProp,
  loading: clientLoading = false,
  onRefresh,
  reloadKey,
  serverSidePagination = false,
  onFetchData,
}: DataTableProps<T>) {
  const { showEdit: editEnabled, showDelete: deleteEnabled } = resolveShowFlags({
    showEdit,
    showDelete,
    showedit,
    showdelete,
  });

  const { t } = useTranslation();
  const theme = useTheme();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [colDefs, setColDefs] = useState<ColumnDefs>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const columnSelectorRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const [data, setData] = useState<T[]>([]);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const applyServerPage = useCallback((mapped: ReturnType<typeof mapServerFetchResult<T>>) => {
    setData(mapped.items);
    setTotalCount(mapped.totalCount);
    setTotalPages(mapped.totalPages);
    setHasNextPage(mapped.hasNextPage);
    setHasPreviousPage(mapped.hasPreviousPage);
    setServerError(mapped.error);
  }, []);

  const loadData = useCallback(
    async (pageNumber: number, size: number) => {
      if (!serverSidePagination || !onFetchData) return;

      setServerLoading(true);
      setServerError(false);
      try {
        const result = await onFetchData({
          pageNumber,
          pageSize: size,
        });
        applyServerPage(mapServerFetchResult<T>(result));
      } catch {
        applyServerPage(mapServerFetchResult<T>(null));
      } finally {
        setServerLoading(false);
      }
    },
    [serverSidePagination, onFetchData, applyServerPage]
  );

  useEffect(() => {
    if (serverSidePagination && onFetchData) {
      loadData(page, pageSize);
    }
    // Intentionally mirrors legacy deps (reloadKey forces refetch).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSidePagination, onFetchData, page, pageSize, reloadKey]);

  const rowData = serverSidePagination ? data : (dataProp ?? data);
  const gridLoading = serverSidePagination ? serverLoading : clientLoading;

  const ActionsRenderer = useCallback(
    (params: ICellRendererParams<T>) => {
      const row = params.data;
      if (!row) return null;

      return (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            height: "100%",
          }}
        >
          {editEnabled && showEditButtonIf(row) && (
            <ThemedTooltip title={t("Edit")}>
              <IconButton
                size="small"
                onClick={() => {
                  changeFormType?.(FormTypes.Edit);
                  handleSelectId?.(row.id as string);
                  handleShowForm?.();
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
                changeFormType?.(FormTypes.Details);
                handleSelectId?.(row.id as string);
                handleShowForm?.();
              }}
              sx={{
                borderRadius: ".25rem",
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              <FaInfo fontSize="medium" />
            </IconButton>
          </ThemedTooltip>

          {deleteEnabled && showDeleteButtonIf(row) && (
            <ThemedTooltip title={t("Delete")}>
              <IconButton
                size="small"
                onClick={() => {
                  changeFormType?.(FormTypes.Delete);
                  handleSelectId?.(row.id as string);
                  handleShowForm?.();
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
    },
    [
      editEnabled,
      deleteEnabled,
      showEditButtonIf,
      showDeleteButtonIf,
      changeFormType,
      handleSelectId,
      handleShowForm,
      t,
      theme.palette.info.main,
      theme.palette.primary.main,
      theme.palette.error.main,
    ]
  );

  // Keep a stable cell renderer identity so column rebuilds are not tied to ActionsRenderer churn.
  const actionsRendererRef = useRef(ActionsRenderer);
  actionsRendererRef.current = ActionsRenderer;
  const stableActionsRenderer = useCallback(
    (params: ICellRendererParams) => actionsRendererRef.current(params as ICellRendererParams<T>),
    []
  );

  useEffect(() => {
    const effectiveData = serverSidePagination ? data : (dataProp ?? data);
    if (effectiveData.length > 0 || (defaultColumns && defaultColumns.length > 0)) {
      const sourceColumns: TableColumnDef[] =
        defaultColumns && defaultColumns.length > 0
          ? defaultColumns
          : columnsFromRowKeys(effectiveData[0] as Record<string, unknown> | undefined);

      setColDefs(
        buildDataTableColumns({
          sourceColumns,
          defaultHiddenColumns,
          t,
          textColor: theme.palette.text.primary,
          actionsPinned: theme.direction === "rtl" ? "left" : "right",
          ActionsRenderer: stableActionsRenderer as (params: ICellRendererParams) => ReactNode,
        }) as ColumnDefs
      );
    }
  }, [
    data,
    dataProp,
    serverSidePagination,
    defaultColumns,
    defaultHiddenColumns,
    t,
    editEnabled,
    deleteEnabled,
    theme.palette.text.primary,
    theme.direction,
    stableActionsRenderer,
  ]);

  // Client-side totals must not depend solely on grid events (grid may fail to init).
  useEffect(() => {
    if (serverSidePagination) return;
    const rows = dataProp ?? data;
    const count = Array.isArray(rows) ? rows.length : 0;
    setTotalCount(count);
    setTotalPages(count > 0 ? Math.ceil(count / pageSize) : 0);
  }, [serverSidePagination, dataProp, data, pageSize]);

  const onGridReady: NonNullable<AgGridReactProps["onGridReady"]> = (params) => {
    setGridApi(params.api);
  };

  const onPaginationChanged = useCallback(() => {
    if (serverSidePagination) return;

    if (gridApi) {
      const currentPage = gridApi.paginationGetCurrentPage() + 1;
      setPage(currentPage);
      setTotalPages(gridApi.paginationGetTotalPages());
      setTotalCount(gridApi.getDisplayedRowCount());
    }
  }, [gridApi, serverSidePagination]);

  const toggleColumnVisibility = useCallback(
    (columnField: string) => {
      if (!gridApi) return;

      const col = gridApi.getColumnDef(columnField);
      if (!col) return;
      const newHide = !col.hide;

      const newColDefs = (colDefs ?? []).map((c) =>
        c && "field" in c && c.field === columnField ? { ...c, hide: newHide } : c
      );

      setColDefs(newColDefs);
    },
    [gridApi, colDefs]
  );

  const onBtnExport = () => {
    if (!gridApi) return;
    const selectedRows = gridApi.getSelectedRows();
    const domainName = window.location.pathname.split("/").pop();
    gridApi.exportDataAsCsv({
      fileName: `${domainName}_${new Date().toLocaleDateString()}.csv`,
      onlySelected: selectedRows.length > 0,
      columnKeys: (colDefs ?? [])
        .filter(
          (col): col is { field: string } =>
            !!col && "field" in col && typeof col.field === "string" && col.field !== "operations"
        )
        .map((col) => col.field),
    });
  };

  const onSyncData = async () => {
    if (serverSidePagination && onFetchData) {
      await loadData(page, pageSize);
    }

    if (!serverSidePagination && onRefresh) {
      onRefresh();
    }
  };

  const { visibleColumns, fieldLabels } = useMemo(() => {
    const flat = (colDefs ?? []).filter(
      (col): col is FlatColDef => !!col && !("children" in (col as object))
    );
    return deriveColumnMeta(flat);
  }, [colDefs]);

  const localeText = useMemo(() => getAgGridLocaleText(t), [t]);

  const defaultColDef = useMemo(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
      headerClass: "custom-header",
    }),
    []
  );

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    if (serverSidePagination && onFetchData) {
      setPage(value);
      loadData(value, pageSize);
    } else if (gridApi) {
      gridApi.paginationGoToPage(value - 1);
    }
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
    if (serverSidePagination && onFetchData) {
      setPage(1);
      loadData(1, newSize);
    } else if (gridApi) {
      gridApi.setGridOption("paginationPageSize", newSize);
    }
  };

  const startRow = totalCount > 0 ? (page - 1) * pageSize + 1 : 0;
  const endRow = Math.min(page * pageSize, totalCount);

  if (serverSidePagination && serverError && !serverLoading) {
    return (
      <Box
        sx={{
          minHeight: 320,
          width: "100%",
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ErrorState onRetry={() => loadData(page, pageSize)} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 600,
        width: "100%",
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: showSearch ? theme.palette.action.hover : "transparent",
                borderRadius: 1,
                pl: showSearch ? 1 : 0,
                transition: "all 0.3s ease",
                width: showSearch ? 200 : 32,
                overflow: "hidden",
              }}
            >
              <InputBase
                inputRef={searchInputRef}
                placeholder={`${t("Search")}...`}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: "0.875rem",
                  opacity: showSearch ? 1 : 0,
                  transform: showSearch ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  pointerEvents: showSearch ? "auto" : "none",
                  "& input": {
                    p: 0.5,
                  },
                }}
              />

              <IconButton
                size="small"
                onClick={() => {
                  setShowSearch((prev) => !prev);
                  setTimeout(() => {
                    searchInputRef.current?.focus();
                  }, 100);
                }}
              >
                <Search fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ThemedTooltip title={t("Sync data")}>
              <span>
                <IconButton size="small" onClick={onSyncData} disabled={gridLoading}>
                  <SyncIcon
                    fontSize="small"
                    sx={{
                      animation: gridLoading ? "spin 2s linear infinite" : "none",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(0deg)",
                        },
                        "100%": {
                          transform: "rotate(360deg)",
                        },
                      },
                    }}
                  />
                </IconButton>
              </span>
            </ThemedTooltip>
          </Box>
        </Box>
      </Box>
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
            boxShadow: theme.direction === "rtl" ? "none" : "-4px 0 20px rgba(0, 0, 0, 0.08)",
            zIndex: 1,
          },
          "& .ag-pinned-left-header": {
            border: "none",
            boxShadow: theme.direction === "rtl" ? "4px 0 20px rgba(0, 0, 0, 0.08)" : "none",
            zIndex: 1,
          },
          "& .ag-pinned-right-cols-container": {
            boxShadow: theme.direction === "rtl" ? "none" : "-4px 0 20px rgba(0, 0, 0, 0.08)",
            zIndex: 1,
          },
          "& .ag-pinned-left-cols-container": {
            boxShadow: theme.direction === "rtl" ? "4px 0 20px rgba(0, 0, 0, 0.08)" : "none",
            zIndex: 1,
          },
          "& .actions-header .ag-header-cell-label": {
            justifyContent: "center",
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
          "& .ag-overlay-loading-wrapper": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "color-mix(in srgb, transparent, #000 66%)"
                : "color-mix(in srgb, transparent, #fff 66%)",
          },
          "& .ag-overlay-loading-center": {
            backgroundColor: theme.palette.mode === "dark" ? "#000" : "#fff",
            color: theme.palette.text.primary,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 0 10px rgba(0, 0, 0, 0.1)"
                : "0 0 10px rgba(0, 0, 0, 0.1)",
          },
          "& .ag-icon-loading": {
            color: theme.palette.primary.main,
          },
          "& .ag-overlay-no-matching-rows-center": {
            color: theme.palette.text.primary,
          },
        }}
      >
        <AgGridReact
          theme="legacy"
          columnDefs={colDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          rowSelection={{
            mode: "multiRow",
          }}
          icons={{
            filter: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${theme.palette.text.secondary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
            sortAscending: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15 15" fill="currentColor"><path d="M4 9h7L7.5 4.5 4 9z"/></svg>`,
            sortDescending: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15 15" fill="currentColor"><path d="M4 6h7l-3.5 4.5L4 6z"/></svg>`,
            sortUnSort: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15 15" fill="currentColor"><path d="M4 6h7L7.5 2 4 6zm0 3h7l-3.5 4L4 9z"/></svg>`,
          }}
          onGridReady={onGridReady}
          pagination={!serverSidePagination}
          paginationPageSize={pageSize}
          suppressPaginationPanel={true}
          onPaginationChanged={onPaginationChanged}
          animateRows={true}
          multiSortKey={"ctrl"}
          localeText={localeText}
          enableRtl={theme.direction === "rtl"}
          loading={gridLoading}
        />
      </Box>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "center",
            sm: "center",
            md: "space-between",
          },
          alignItems: "center",
          gap: 2,
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
            {t("Showing")} {totalCount > 0 ? startRow : 0} - {endRow} {t("of")} {totalCount}
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
              disabled={
                item.disabled ||
                (serverSidePagination &&
                  ((item.type === "next" && !hasNextPage) ||
                    (item.type === "previous" && !hasPreviousPage) ||
                    (item.type === "first" && !hasPreviousPage) ||
                    (item.type === "last" && !hasNextPage)))
              }
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
    </Box>
  );
}

export default DataTable;
