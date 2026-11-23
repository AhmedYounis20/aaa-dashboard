import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormTypes } from "@/interfaces/Components";
import TaxesForm from "./TaxesForm";
import { AppContent } from "@/Components";
import { NodeType } from "@/interfaces/Components/NodeType";
import { TaxModel } from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Taxes/TaxModel";
import { useTaxesList } from "@/hooks/queries";
import Loader from "@/Components/Loader";

const columns = [
  { Header: "Code", accessor: "chartOfAccount.code" },
  { Header: "Name", accessor: "name" },
  { Header: "NameSecondLanguage", accessor: "nameSecondLanguage" },
];

const TaxesRoot = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [parentId, setParentId] = useState<string | null>(null);

  const { data = [], isLoading, isFetching, isError, refetch } = useTaxesList();

  const handleShowForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      {showForm && (
        <TaxesForm
          id={selectedId ?? ""}
          handleCloseForm={handleCloseForm}
          formType={formType}
          parentId={parentId}
        />
      )}
      <AppContent
        tableType="tree"
        title={t("Taxes")}
        btn
        addBtn
        actionBtn={() => {
          setParentId(null);
          setFormType(FormTypes.Add);
          handleShowForm();
        }}
        columns={columns}
        data={data as TaxModel[]}
        loading={isFetching}
        isError={isError}
        onRetry={() => void refetch()}
        onRefresh={() => void refetch()}
        handleShowForm={handleShowForm}
        changeFormType={setFormType}
        handleSelectId={handleSelectId}
        handleSelectParentId={setParentId}
        showAddButtonIf={(row) => row.nodeType === NodeType.Category}
      />
    </div>
  );
};

export default TaxesRoot;
