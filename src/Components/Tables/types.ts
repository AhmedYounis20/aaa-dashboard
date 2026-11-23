import type { ReactNode } from "react";
import type { FormTypes } from "@/interfaces/Components/FormType";
import type { ApiResult } from "@/interfaces/ApiResponse";
import type { PaginatedResponse } from "@/interfaces/Pagination";
import type { ColDef, ICellRendererParams, ValueGetterParams } from "ag-grid-community";

export interface TableColumnDef {
  Header?: string;
  header?: string;
  headerName?: string;
  accessor?: string;
  field?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCell?: (params: { data: any; value: unknown } & Partial<ICellRendererParams>) => ReactNode;
  cellRenderer?: (params: ICellRendererParams) => ReactNode;
  valueGetter?: (params: ValueGetterParams) => unknown;
}

export interface FetchDataParams {
  pageNumber: number;
  pageSize: number;
}

export type FetchDataResult<T = Record<string, unknown>> = ApiResult<PaginatedResponse<T>>;

export interface TableActionProps<T = Record<string, unknown>> {
  changeFormType?: (formType: FormTypes) => void;
  handleSelectId?: (id: string) => void;
  handleShowForm?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  /** @deprecated Use showEdit */
  showedit?: boolean;
  /** @deprecated Use showDelete */
  showdelete?: boolean;
  showEditButtonIf?: (row: T) => boolean;
  showDeleteButtonIf?: (row: T) => boolean;
}

export interface DataTableProps<
  T extends { id?: string } = Record<string, unknown> & { id?: string },
> extends TableActionProps<T> {
  defaultHiddenColumns?: string[];
  defaultColumns?: TableColumnDef[];
  data?: T[];
  loading?: boolean;
  onRefresh?: () => void;
  reloadKey?: number;
  serverSidePagination?: boolean;
  onFetchData?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any
  ) => Promise<FetchDataResult<T> | null | undefined>;
}

export interface DataTreeTableProps<
  T extends { id: string; parentId?: string | null; nodeType?: number } = {
    id: string;
    parentId?: string | null;
    nodeType?: number;
  },
> extends TableActionProps<T> {
  columns?: TableColumnDef[];
  data?: T[];
  handleSelectParentId?: (id: string) => void;
  showAdd?: boolean;
  /** @deprecated Use showAdd */
  showadd?: boolean;
  showAddButtonIf?: (row: T) => boolean;
}

export type AgColDef = ColDef;

export function resolveShowFlags(props: {
  showEdit?: boolean;
  showDelete?: boolean;
  showAdd?: boolean;
  showedit?: boolean;
  showdelete?: boolean;
  showadd?: boolean;
}) {
  return {
    showEdit: props.showEdit ?? props.showedit ?? true,
    showDelete: props.showDelete ?? props.showdelete ?? true,
    showAdd: props.showAdd ?? props.showadd ?? true,
  };
}

export function getValueByAccessor(obj: unknown, accessor?: string): unknown {
  if (!accessor || obj == null || typeof obj !== "object") return undefined;
  return accessor.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
