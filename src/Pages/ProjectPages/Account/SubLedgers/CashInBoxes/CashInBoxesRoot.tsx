import { useTranslation } from "react-i18next";
import { AppContent } from "@/Components";
import Loader from "@/Components/Loader";
import CashInBoxesForm from "./CashInBoxesForm";
import { NodeType } from "@/interfaces/Components/NodeType";
import { useCashInBoxesList, useEntityListPage } from "@/hooks/queries";

const CashInBoxesRoot = () => {
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

  const { data = [], isLoading, isFetching, isError, refetch } = useCashInBoxesList();

  const columns = [
    { Header: t("Code"), accessor: "code" },
    { Header: t("Name"), accessor: "name" },
    { Header: t("NameSecondLanguage"), accessor: "nameSecondLanguage" },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      {showForm && (
        <CashInBoxesForm
          id={selectedId}
          handleCloseForm={handleCloseForm}
          formType={formType}
          parentId={parentId ?? null}
        />
      )}
      <AppContent
        tableType="tree"
        title={t("CashInBoxes")}
        loading={isFetching}
        isError={isError}
        onRetry={() => void refetch()}
        onRefresh={() => void refetch()}
        btn
        addBtn
        actionBtn={openAdd}
        btnName={t("AddNew")}
        columns={columns}
        data={data}
        handleShowForm={handleShowForm}
        changeFormType={setFormType}
        handleSelectId={handleSelectId}
        handleSelectParentId={setParentId}
        showAddButtonIf={(row) => row.nodeType === NodeType.Category}
      />
    </div>
  );
};

export default CashInBoxesRoot;
