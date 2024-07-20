import { Box, Stack, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import DataTreeTable from "../../Tables/DataTreeTable";
import DataTable from "../../Tables/DataTable";
import AddIcon from '@mui/icons-material/Add';

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
  addBtn,
  handleSelectId,
  handleSelectParentId,
  handleShowForm,
  changeFormType,
  title,
  actionBtn,
  btnName,
  btnColor,
  endIcon,
  startIcon,
  defaultHiddenCols,
  showdelete,
  showedit,
  showadd,
  btn = false,
}: AppContentProps) {
  return (
    <Box width={"100%"} display={"flex"} flexDirection={"column"}>
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
            size="medium"
            color={btnColor || "info"}
            endIcon={endIcon && addBtn ? <AddIcon /> : endIcon}
            startIcon={startIcon && addBtn ? <AddIcon /> : startIcon}
            sx={{
              my: 2,
            }}
          >
            <Typography variant="h6" textTransform={"capitalize"}>
              {btnName}
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
          showadd = {showadd}
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


