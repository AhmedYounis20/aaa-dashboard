import type { ReactNode } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import type { TFunction } from "i18next";
import type { TableColumnDef } from "./types";
import { getValueByAccessor } from "./types";

type BuildColumnsArgs = {
  sourceColumns: TableColumnDef[];
  defaultHiddenColumns: string[];
  t: TFunction;
  textColor: string;
  actionsPinned: "left" | "right";
  ActionsRenderer: (params: ICellRendererParams) => ReactNode;
};

/** Maps app column defs (+ operations column) into AG Grid ColDefs. */
export function buildDataTableColumns({
  sourceColumns,
  defaultHiddenColumns,
  t,
  textColor,
  actionsPinned,
  ActionsRenderer,
}: BuildColumnsArgs): ColDef[] {
  const initialColumns: ColDef[] = sourceColumns.map((col) => {
    const field = col.accessor || col.field;
    const headerName = t(col.Header || col.headerName || col.field || field || "");
    const isHidden = field ? defaultHiddenColumns.includes(field) : false;

    const hasCustomRenderer = !!col.renderCell || !!col.cellRenderer;
    const cellRenderer = col.renderCell
      ? (params: ICellRendererParams) =>
          col.renderCell!({
            ...params,
            value:
              params.value !== undefined ? params.value : getValueByAccessor(params.data, field),
          })
      : col.cellRenderer;

    return {
      field,
      headerName,
      hide: isHidden,
      flex: 1,
      minWidth: 120,
      filter: true,
      sortable: true,
      resizable: true,
      unSortIcon: true,
      cellStyle: { color: textColor },
      valueGetter: (params) => {
        if (col.valueGetter) return col.valueGetter(params);
        if (col.accessor && col.accessor.includes(".")) {
          return getValueByAccessor(params.data, col.accessor);
        }
        if (!field || !params.data) return undefined;
        return (params.data as Record<string, unknown>)[field];
      },
      ...(hasCustomRenderer && cellRenderer ? { cellRenderer } : {}),
    };
  });

  const actionsCol: ColDef = {
    field: "operations",
    headerName: t("Operations"),
    cellRenderer: ActionsRenderer,
    width: 140,
    pinned: actionsPinned,
    lockPosition: true,
    suppressMovable: true,
    lockPinned: true,
    sortable: false,
    filter: false,
    resizable: false,
    suppressSizeToFit: true,
    headerClass: "actions-header",
    cellStyle: {
      display: "flex",
      justifyContent: "center",
      border: "unset",
    },
  };

  return [...initialColumns, actionsCol];
}

export function columnsFromRowKeys(row: Record<string, unknown> | undefined): TableColumnDef[] {
  return Object.keys(row || {}).map((key) => ({
    field: key,
    headerName: key,
  }));
}

type ColumnMetaSource = {
  field?: string;
  hide?: boolean | null;
  headerName?: string;
};

/** Derive visible-column map / labels from current ColDefs (excludes operations). */
export function deriveColumnMeta(colDefs: ColumnMetaSource[]) {
  const visibleColumns: Record<string, boolean> = {};
  const fieldLabels: Record<string, string> = {};

  colDefs
    .filter((col) => col.field !== "operations")
    .forEach((col) => {
      if (!col.field) return;
      visibleColumns[col.field] = !col.hide;
      fieldLabels[col.field] = col.headerName ?? col.field;
    });

  return { visibleColumns, fieldLabels };
}
