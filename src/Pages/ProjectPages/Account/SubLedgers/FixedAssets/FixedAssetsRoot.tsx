import { useTranslation } from "react-i18next";
import FixedAssetsForm from "./FixedAssetsForm";
import Loader from "@/Components/Loader";
import { AppContent } from "@/Components";
import { NodeType } from "@/interfaces/Components/NodeType";
import { useEntityListPage, useFixedAssetsList } from "@/hooks/queries";
import FixedAssetModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/FixedAssets/FixedAssetModel";

const columns = [
  { Header: "Code", accessor: "chartOfAccount.code" },
  { Header: "Name", accessor: "name" },
  { Header: "NameSecondLanguage", accessor: "nameSecondLanguage" },
];

const FixedAssetsRoot = () => {
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

  const { data = [], isLoading, isFetching, isError, refetch } = useFixedAssetsList();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      {showForm && (
        <FixedAssetsForm
          id={selectedId}
          handleCloseForm={handleCloseForm}
          formType={formType}
          parentId={parentId ?? null}
        />
      )}
      <AppContent
        tableType="tree"
        data={data as FixedAssetModel[]}
        columns={columns}
        handleShowForm={handleShowForm}
        changeFormType={setFormType}
        handleSelectId={handleSelectId}
        handleSelectParentId={setParentId}
        title={t("FixedAssets")}
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

export default FixedAssetsRoot;
