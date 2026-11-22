import { useState } from "react";
import { AppContent } from "@/Components";
import { FormTypes } from "@/interfaces/Components";
import { Box } from "@mui/material";
import Loader from "@/Components/Loader";
import AttributeModel from "@/interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel";
import { useTranslation } from "react-i18next";
import AttributesForm from "./AttributesForm";
import { StatusChip } from "@/Components/UI/StatusChip";
import { useAttributesList } from "@/hooks/queries";

const AttributesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const { t } = useTranslation();

  const { data = [], isLoading, isFetching, isError, refetch } = useAttributesList();

  const handleShowForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  const columns = [
    { Header: t("Name"), accessor: "name" },
    { Header: t("NameSecondLanguage"), accessor: "nameSecondLanguage" },
    {
      Header: t("Status"),
      accessor: "isActive",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderCell: (params: any) => <StatusChip value={params.value} />,
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <Box>
        {showForm && (
          <AttributesForm
            id={selectedId}
            handleCloseForm={handleCloseForm}
            formType={formType}
          />
        )}

        <AppContent
          tableType="table"
          data={data as AttributeModel[]}
          loading={isFetching}
          isError={isError}
          onRetry={() => void refetch()}
          onRefresh={() => void refetch()}
          title={t("Attributes")}
          columns={columns}
          btnName={t("AddNew")}
          addBtn
          btn
          startIcon
          actionBtn={() => {
            setFormType(FormTypes.Add);
            handleShowForm();
          }}
          handleSelectId={handleSelectId}
          changeFormType={setFormType}
          handleShowForm={handleShowForm}
          defaultHiddenCols={[
            "id",
            "createdAt",
            "createdBy",
            "modifiedAt",
            "modifiedBy",
          ]}
        />
      </Box>
    </div>
  );
};

export default AttributesRoot;
