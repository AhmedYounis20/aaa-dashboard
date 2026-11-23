import { useTranslation } from "react-i18next";
import SuppliersForm from "./SuppliersForm";
import Loader from "@/Components/Loader";
import { AppContent } from "@/Components";
import { NodeType } from "@/interfaces/Components/NodeType";
import { useEntityListPage, useSuppliersList } from "@/hooks/queries";
import SupplierModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Suppliers/SupplierModel";

const columns = [
  { Header: "Code", accessor: "chartOfAccount.code" },
  { Header: "Name", accessor: "name" },
  { Header: "NameSecondLanguage", accessor: "nameSecondLanguage" },
];

const SuppliersRoot = () => {
  const { t } = useTranslation();
  const {
    showForm,
    formType,
    selectedId,
    parentId,
    setFormType,
    setParentId,
    handleShowForm,
    handleCloseForm,
    handleSelectId,
    openAdd,
  } = useEntityListPage({ withParent: true });

  const { data = [], isLoading, isFetching, isError, refetch } = useSuppliersList();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      {showForm && (
        <SuppliersForm
          id={selectedId}
          handleCloseForm={handleCloseForm}
          formType={formType}
          parentId={parentId ?? null}
        />
      )}
      <AppContent
        tableType="tree"
        data={data as SupplierModel[]}
        columns={columns}
        handleShowForm={handleShowForm}
        changeFormType={setFormType}
        handleSelectId={handleSelectId}
        handleSelectParentId={setParentId}
        title={t("Suppliers")}
        btn
        addBtn
        actionBtn={openAdd}
        btnName={t("New")}
        startIcon
        loading={isFetching}
        isError={isError}
        onRetry={() => void refetch()}
        onRefresh={() => void refetch()}
        showAddButtonIf={(row) => row.nodeType === NodeType.Category}
      />
    </div>
  );
};

export default SuppliersRoot;
