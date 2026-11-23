import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import DataTable from "../../Tables/DataTable";
import DataTreeTable from "../../Tables/DataTreeTable";
import { FormTypes } from "@/interfaces/Components/FormType";
import { EmptyState, ErrorState, LoadingState } from "@/Components/feedback";
import type { FetchDataResult, TableColumnDef } from "@/Components/Tables/types";

export type { TableColumnDef as TableColumn };

type AppContentProps<
  T extends { id?: string; parentId?: string | null; nodeType?: number } = Record<
    string,
    unknown
  > & {
    id?: string;
    parentId?: string | null;
    nodeType?: number;
  },
> = {
  tableType: "tree" | "table";
  /** i18n key, or an already-translated label */
  title: string;
  btnName?: string;
  btn?: boolean;
  addBtn?: boolean;
  actionBtn?: () => void;
  btnColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  columns?: TableColumnDef[];
  handleShowForm?: () => void;
  changeFormType?: (formType: FormTypes) => void;
  handleSelectId?: (id: string) => void;
  handleSelectParentId?: (id: string) => void;
  defaultHiddenCols?: string[];
  showDelete?: boolean;
  showEdit?: boolean;
  showAdd?: boolean;
  /** @deprecated Use showDelete */
  showdelete?: boolean;
  /** @deprecated Use showEdit */
  showedit?: boolean;
  /** @deprecated Use showAdd */
  showadd?: boolean;
  showEditButtonIf?: (row: T) => boolean;
  showDeleteButtonIf?: (row: T) => boolean;
  showAddButtonIf?: (row: T) => boolean;
  data?: T[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onRefresh?: () => void;
  reloadKey?: number;
  serverSidePagination?: boolean;
  // Params kept broad so legacy Roots typed as `(params: unknown)` still assign.
  onFetchData?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any
  ) => Promise<FetchDataResult<T> | null | undefined>;
  emptyMessage?: string;
};

export default function AppContent<
  T extends { id?: string; parentId?: string | null; nodeType?: number } = Record<
    string,
    unknown
  > & {
    id?: string;
    parentId?: string | null;
    nodeType?: number;
  },
>({
  tableType,
  columns,
  handleSelectId,
  handleSelectParentId,
  handleShowForm,
  changeFormType,
  title,
  actionBtn,
  btnColor,
  defaultHiddenCols,
  showDelete,
  showEdit,
  showAdd,
  showdelete,
  showedit,
  showadd,
  showEditButtonIf,
  showDeleteButtonIf,
  showAddButtonIf,
  btn = false,
  data,
  loading,
  isError,
  onRetry,
  onRefresh,
  reloadKey,
  serverSidePagination = false,
  onFetchData,
  emptyMessage,
}: AppContentProps<T>) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const resolvedShowDelete = showDelete ?? showdelete;
  const resolvedShowEdit = showEdit ?? showedit;
  const resolvedShowAdd = showAdd ?? showadd;

  const displayTitle = i18n.exists(title) ? t(title) : title;
  const addLabel = t("Add");
  // Server-side lists own empty/error inside DataTable (parent often has no `data`).
  // Client lists: EmptyState only when the parent truly has zero rows — never when data exists
  // but the grid failed to mount (that is a DataTable/AG Grid bug, not an empty list).
  const isEmpty =
    !serverSidePagination && !loading && !isError && Array.isArray(data) && data.length === 0;
  // Header Add only when there is data (or still loading with rows). Empty lists use EmptyState CTA only.
  const showHeaderAdd = btn && !isEmpty;

  const defaultHiddenColumns = defaultHiddenCols || [
    "id",
    "createdAt",
    "createdBy",
    "modifiedAt",
    "modifiedBy",
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            {displayTitle}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {t("Manage")} {displayTitle}
          </Typography>
        </Box>

        {showHeaderAdd && (
          <Button
            variant="contained"
            disableElevation
            onClick={actionBtn}
            color={btnColor || "primary"}
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {addLabel}
          </Button>
        )}
      </Stack>

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {isError ? (
          <ErrorState onRetry={onRetry} />
        ) : loading && (!data || data.length === 0) ? (
          <LoadingState />
        ) : isEmpty ? (
          <EmptyState
            message={emptyMessage}
            actionLabel={btn ? addLabel : undefined}
            onAction={btn ? actionBtn : undefined}
          />
        ) : tableType === "tree" ? (
          <DataTreeTable
            columns={columns}
            data={data as (T & { id: string })[]}
            handleShowForm={handleShowForm}
            changeFormType={changeFormType}
            handleSelectId={handleSelectId}
            handleSelectParentId={handleSelectParentId}
            showAdd={resolvedShowAdd}
            showEdit={resolvedShowEdit}
            showDelete={resolvedShowDelete}
            showEditButtonIf={showEditButtonIf}
            showDeleteButtonIf={showDeleteButtonIf}
            showAddButtonIf={showAddButtonIf}
          />
        ) : (
          <DataTable
            data={data}
            loading={loading}
            onRefresh={onRefresh}
            showDelete={resolvedShowDelete}
            showEdit={resolvedShowEdit}
            handleSelectId={handleSelectId}
            changeFormType={changeFormType}
            handleShowForm={handleShowForm}
            defaultHiddenColumns={defaultHiddenColumns}
            defaultColumns={columns}
            showEditButtonIf={showEditButtonIf}
            showDeleteButtonIf={showDeleteButtonIf}
            reloadKey={reloadKey}
            serverSidePagination={serverSidePagination}
            onFetchData={onFetchData}
          />
        )}
      </Box>
    </Box>
  );
}
