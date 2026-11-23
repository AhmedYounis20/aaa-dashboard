import { useState } from "react";
import { AppContent } from "../../../../Components";
import { FormTypes } from "../../../../interfaces/Components";
import PackingUnitsForm from "./PackingUnitsForm";
import { Box } from "@mui/material";
import Loader from "../../../../Components/Loader";
import { useTranslation } from "react-i18next";
import { usePackingUnitsList } from "../../../../hooks/queries";

const PackingUnitsRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const { t } = useTranslation();

  const { data = [], isLoading, isFetching, isError, refetch } = usePackingUnitsList();

  const handleShowForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  const columns = [
    { Header: t("Name"), accessor: "name" },
    { Header: t("NameSecondLanguage"), accessor: "nameSecondLanguage" },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <Box>
        {showForm && (
          <PackingUnitsForm id={selectedId} handleCloseForm={handleCloseForm} formType={formType} />
        )}

        <AppContent
          tableType="table"
          data={data}
          loading={isFetching}
          isError={isError}
          onRetry={() => void refetch()}
          onRefresh={() => void refetch()}
          title="PackingUnits"
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
          emptyMessage={t("EmptyMasterDataHint")}
          defaultHiddenCols={["id", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]}
        />
      </Box>
    </div>
  );
};

export default PackingUnitsRoot;
