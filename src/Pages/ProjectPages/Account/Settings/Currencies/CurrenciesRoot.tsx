import { useState } from "react";
import { AppContent } from "../../../../../Components";
import { FormTypes } from "../../../../../interfaces/Components";
import CurrenciesForm from "./CurrenciesForm";
import { Box } from "@mui/material";
import Loader from "../../../../../Components/Loader";
import CurrencyModel from "../../../../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import { useCurrenciesList } from "../../../../../hooks/queries";

const CurrenciesRoot = () => {
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
  const handleCloseForm = () => setShowForm(false);
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <Box>
        {showForm && (
          <CurrenciesForm
            id={selectedId}
            handleCloseForm={handleCloseForm}
            formType={formType}
          />
        )}
        {!isError && (
          <AppContent
            tableType="table"
            data={data as CurrencyModel[]}
            loading={isFetching}
            onRefresh={() => void refetch()}
            title="Currencies"
            columns={columns}
            btnName="new"
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
        )}
      </Box>
    </div>
  );
};

export default CurrenciesRoot;
