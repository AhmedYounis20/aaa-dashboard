import ChartOfAccountsForm from "./ChartOfAccountsForm";
import Loader from "@/Components/Loader";
import { AppContent } from "@/Components";
import { ChartOfAccountModel } from "@/interfaces/ProjectInterfaces";
import { useTranslation } from "react-i18next";
import { useChartOfAccountsList, useEntityListPage } from "@/hooks/queries";

const ChartOfAccountsRoot = () => {
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

  const { data = [], isLoading, isFetching, isError, refetch } = useChartOfAccountsList();

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
        <ChartOfAccountsForm
          id={selectedId}
          parentId={parentId ?? ""}
          handleCloseForm={handleCloseForm}
          formType={formType}
          afterAction={() => void refetch()}
          handleTranslate={(key) => t(key)}
        />
      )}
      <AppContent
        tableType="tree"
        data={data as ChartOfAccountModel[]}
        loading={isFetching}
        isError={isError}
        onRetry={() => void refetch()}
        onRefresh={() => void refetch()}
        title={t("ChartOfAccounts")}
        btn
        addBtn
        actionBtn={openAdd}
        btnName={t("AddNew")}
        startIcon
        columns={columns}
        showDelete={true}
        showEdit={true}
        handleSelectId={handleSelectId}
        handleSelectParentId={setParentId}
        changeFormType={setFormType}
        handleShowForm={handleShowForm}
        defaultHiddenCols={["id", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]}
      />
    </div>
  );
};

export default ChartOfAccountsRoot;
