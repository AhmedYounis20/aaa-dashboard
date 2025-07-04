import { Box, Stack, Typography, Button } from "@mui/material";
import DataTreeTable from "../../Tables/DataTreeTable";
import DataTable from "../../Tables/DataTable";
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from "react-i18next";

type AppContentProps = {
  tableType: "tree" | "table";
  data: any;
  title: string;
  btnName?: string;
  btn?: boolean;
  addBtn?: boolean;
  actionBtn?: any;
  btnColor?: any;
  endIcon?: any;
  startIcon?: any;
  columns?: any;
  handleShowForm?: any;
  changeFormType?: any;
  handleSelectId?: any;
  handleSelectParentId?: any;
  defaultHiddenCols?: string[];
  showdelete?: boolean;
  showedit?: boolean;
  showadd?: boolean;
};

export default function AppContent({
  tableType,
  columns,
  data,
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
  btn = false,
}: AppContentProps) {
  const {t} = useTranslation();
  
  const defaultHiddenColumns = defaultHiddenCols || ["id", "createdAt", "createdBy", "modifiedAt", "modifiedBy"];
  
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 3,
        backgroundColor: '#fafafa',
        minHeight: '100vh',
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          p: 2,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: 600,
            color: '#1976d2',
            textTransform: "capitalize",
            letterSpacing: '0.5px',
          }}
        >
          {t(title)}
        </Typography>

        {btn && (
          <Button
            variant="contained"
            onClick={actionBtn}
            color={btnColor || "primary"}
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {t("Add")}
          </Button>
        )}
      </Stack>

      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
          />
        ) : (
          <DataTable
            showdelete={showdelete}
            showedit={showedit}
            data={data}
            handleSelectId={handleSelectId}
            changeFormType={changeFormType}
            handleShowForm={handleShowForm}
            defaultHiddenColumns={defaultHiddenColumns}
          />
        )}
      </Box>
    </Box>
  );
}


