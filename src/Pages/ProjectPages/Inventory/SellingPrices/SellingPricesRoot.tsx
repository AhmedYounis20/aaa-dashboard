import { useState } from "react";
import { AppContent } from "@/Components";
import { FormTypes } from "@/interfaces/Components";
import SellingPricesForm from "./SellingPricesForm";
import { Box } from "@mui/material";
import SellingPriceModel from "@/interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";
import { useTranslation } from "react-i18next";
import { useSellingPricesList } from "@/hooks/queries";
import Loader from "@/Components/Loader";

const SellingPricesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const { t } = useTranslation();

  const { data = [], isLoading, isFetching, isError, refetch } = useSellingPricesList();

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
          <SellingPricesForm
            id={selectedId}
            handleCloseForm={handleCloseForm}
            formType={formType}
          />
        )}

        <AppContent
          tableType="table"
          data={data as SellingPriceModel[]}
          loading={isFetching}
          isError={isError}
          onRetry={() => void refetch()}
          onRefresh={() => void refetch()}
          title={t("SellingPrices")}
          columns={columns}
          btnName={t("AddNew")}
          addBtn
          btn
          startIcon
          showDeleteButtonIf={(e: SellingPriceModel) => e.isDeletable ?? false}
          actionBtn={() => {
            setFormType(FormTypes.Add);
            handleShowForm();
          }}
          handleSelectId={handleSelectId}
          changeFormType={setFormType}
          handleShowForm={handleShowForm}
          defaultHiddenCols={["id", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]}
        />
      </Box>
    </div>
  );
};

export default SellingPricesRoot;
