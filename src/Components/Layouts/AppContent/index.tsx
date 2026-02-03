import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import DataTable from "../../Tables/DataTable";
import DataTreeTable from "../../Tables/DataTreeTable";

type AppContentProps = {
  tableType: "tree" | "table";
  title: string;
  btnName?: string;
  btn?: boolean;
  addBtn?: boolean;
  actionBtn?: any;
  btnColor?: any;
  endIcon?: any;
  startIcon?: any;
  columns?: any[];
  handleShowForm?: any;
  changeFormType?: any;
  handleSelectId?: any;
  handleSelectParentId?: any;
  defaultHiddenCols?: string[];
  showdelete?: boolean;
  showedit?: boolean;
  showadd?: boolean;
  showEditButtonIf?: (e: any) => boolean;
  showDeleteButtonIf?: (e: any) => boolean;
  showAddButtonIf?: (e: any) => boolean;
  // Client-side pagination props
  data?: any[];
  loading?: boolean;
  onRefresh?: () => void;
  // Server-side pagination props
  reloadKey?: number;
  serverSidePagination?: boolean;
  onFetchData?: (params: any) => Promise<any>;
};

export default function AppContent({
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
  showdelete,
  showedit,
  showadd,
  showEditButtonIf,
  showDeleteButtonIf,
  showAddButtonIf,
  btn = false,
  data,
  loading,
  onRefresh,
  reloadKey,
  serverSidePagination = false,
  onFetchData,
}: AppContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();

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
        transition: "all 0.3s ease",
      }}
    >
      {/* Header Section */}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1.25,
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <Box>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              textTransform: "capitalize",
              letterSpacing: "0.5px",
              mb: 0.5,
            }}
          >
            {t(title)}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {t("Manage")} {t(title).toLowerCase()}
          </Typography>
        </Box>

        {btn && (
          <Button
            variant='contained'
            onClick={actionBtn}
            color={btnColor || "primary"}
            startIcon={<AddIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                transform: "translateY(-2px)",
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                transition: "left 0.6s",
              },
              "&:hover::before": {
                left: "100%",
              },
            }}
          >
            {t("Add")} {t(title)}
          </Button>
        )}
      </Stack>

      {/* Table Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1.25,
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {tableType === "tree" ? (
          <DataTreeTable
            columns={columns}
            data={data}
            handleShowForm={handleShowForm}
            changeFormType={changeFormType}
            handleSelectId={handleSelectId}
            handleSelectParentId={handleSelectParentId}
            showadd={showadd}
            showedit={showedit}
            showdelete={showdelete}
            showEditButtonIf={showEditButtonIf}
            showDeleteButtonIf={showDeleteButtonIf}
            showAddButtonIf={showAddButtonIf}
          />
        ) : (
          <DataTable
            data={data}
            loading={loading}
            onRefresh={onRefresh}
            showdelete={showdelete}
            showedit={showedit}
            handleSelectId={handleSelectId}
            changeFormType={changeFormType}
            handleShowForm={handleShowForm}
            defaultHiddenColumns={defaultHiddenColumns as any}
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
