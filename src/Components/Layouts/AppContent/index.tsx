import { Box, Stack, Typography } from "@mui/material";
import Button from '@mui/material/Button';
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
  defaultHiddenCols?: Array<string>;
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
  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      paddingBottom={0}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h2" mb={2} textTransform={"capitalize"}>
          {title}
        </Typography>

        {btn && (
          <Button
            variant="contained"
            onClick={actionBtn}
            color={btnColor || "info"}
            endIcon={<AddIcon />}
            sx={{
              my: 2,
              gap:1
            }}
          >
            <Typography variant="h6" textTransform={"capitalize"}>
              {t("Add")}
            </Typography>
          </Button>
        )}
      </Stack>

      {tableType === "tree" ? (
        <DataTreeTable
          columns={columns}
          data={data}
          handleShowForm={handleShowForm}
          changeFormType={changeFormType}
          handleSelectId={handleSelectId}
          handleSelectParentId={handleSelectParentId}
          showadd={showadd}
        />
      ) : (
        <DataTable
          showdelete={showdelete}
          showedit={showedit}
          data={data}
          handleSelectId={handleSelectId}
          changeFormType={changeFormType}
          handleShowForm={handleShowForm}
          defaultHiddenColumns={
            defaultHiddenCols || [
              "id",
              "createdAt",
              "createdBy",
              "modifiedAt",
              "modifiedBy",
            ]
          }
        />
      )}
    </Box>
  );
}


