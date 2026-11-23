import { useTranslation } from "react-i18next";
import CustomersForm from "./CustomersForm";
import Loader from "@/Components/Loader";
import { AppContent } from "@/Components";
import { NodeType } from "@/interfaces/Components/NodeType";
import { useCustomersList, useEntityListPage } from "@/hooks/queries";
import CustomerModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Customers/CustomerModel";

const columns = [
  { Header: "Code", accessor: "chartOfAccount.code" },
  { Header: "Name", accessor: "name" },
  { Header: "NameSecondLanguage", accessor: "nameSecondLanguage" },
];

const CustomersRoot = () => {
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

  const { data = [], isLoading, isFetching, isError, refetch } = useCustomersList();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      {showForm && (
        <CustomersForm
          id={selectedId}
          handleCloseForm={handleCloseForm}
          formType={formType}
          parentId={parentId ?? null}
        />
      )}
      <AppContent
        tableType="tree"
        title={t("Customers")}
        btn
        addBtn
        actionBtn={openAdd}
        startIcon
        columns={columns}
        data={data as CustomerModel[]}
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

export default CustomersRoot;
