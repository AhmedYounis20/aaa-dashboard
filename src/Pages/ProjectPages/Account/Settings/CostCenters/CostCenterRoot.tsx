import { useTranslation } from "react-i18next";
import Loader from "@/Components/Loader";
import { AppContent } from "@/Components";
import CostCenterForm from "./CostCenterForm";
import { CostCenterModel } from "@/interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import { NodeType } from "@/interfaces/Components/NodeType";
import { useCostCentersList, useEntityListPage } from "@/hooks/queries";

const columns = [
  { Header: "", accessor: "" },
  { Header: "Name", accessor: "name" },
  { Header: "Name (Second Language)", accessor: "nameSecondLanguage" },
];

const CostCenterRoot = () => {
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

  const { data = [], isLoading, isFetching, isError, refetch } = useCostCentersList();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      {showForm && (
        <CostCenterForm
          id={selectedId}
          parentId={parentId ?? null}
          formType={formType}
          handleCloseForm={handleCloseForm}
          afterAction={() => void refetch()}
        />
      )}
      <AppContent
        tableType="tree"
        data={data as CostCenterModel[]}
        loading={isFetching}
        isError={isError}
        onRetry={() => void refetch()}
        onRefresh={() => void refetch()}
        title={t("CostCenters")}
        btn
        addBtn
        actionBtn={openAdd}
        startIcon
        columns={columns}
        handleSelectId={handleSelectId}
        handleSelectParentId={setParentId}
        changeFormType={setFormType}
        handleShowForm={handleShowForm}
        showAddButtonIf={(row) => row.nodeType === NodeType.Category}
        defaultHiddenCols={["id", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]}
      />
    </div>
  );
};

export default CostCenterRoot;
