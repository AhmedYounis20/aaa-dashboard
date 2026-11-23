import { useState } from "react";
import { AppContent } from "../../../../../Components";
import { FormTypes } from "../../../../../interfaces/Components";
import CurrenciesForm from "./CurrenciesForm";
import { Box } from "@mui/material";
import Loader from "../../../../../Components/Loader";
import CurrencyModel from "../../../../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import { useCurrenciesList } from "../../../../../hooks/queries";
import { useTranslation } from "react-i18next";

const CurrenciesRoot = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");

  const { data = [], isLoading, isFetching, isError, refetch } = useCurrenciesList();

  const columns = [
    { Header: "Symbol", accessor: "symbol" },
    { Header: "Name", accessor: "name" },
    { Header: "NameSecondLanguage", accessor: "nameSecondLanguage" },
  ];

  const handleShowForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedId("");
    void refetch();
  };
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <Box>
        {showForm && (
          <CurrenciesForm
            key={`${formType}-${selectedId}`}
            id={selectedId}
            handleCloseForm={handleCloseForm}
            formType={formType}
            title={t("Currency")}
          />
        )}
        <AppContent
          tableType="table"
          data={data as CurrencyModel[]}
          loading={isFetching}
          isError={isError}
          onRetry={() => void refetch()}
          onRefresh={() => void refetch()}
          title="Currencies"
          columns={columns}
          btnName="new"
          addBtn
          btn
          startIcon
          actionBtn={() => {
            setSelectedId("");
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

export default CurrenciesRoot;
