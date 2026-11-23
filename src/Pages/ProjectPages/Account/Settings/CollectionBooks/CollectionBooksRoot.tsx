import CollectionBooksForm from "./CollectionBooksForm";
import { useTranslation } from "react-i18next";
import Loader from "@/Components/Loader";
import { AppContent } from "@/Components";
import { useCollectionBooksList, useEntityListPage } from "@/hooks/queries";

const columns = [
  { Header: "Name", accessor: "name" },
  { Header: "NameSecondLanguage", accessor: "nameSecondLanguage" },
];

const CollectionBooksRoot = () => {
  const { t } = useTranslation();
  const {
    showForm,
    formType,
    selectedId,
    setFormType,
    handleShowForm,
    handleCloseForm,
    handleSelectId,
    openAdd,
  } = useEntityListPage();

  const { data = [], isLoading, isFetching, isError, refetch } = useCollectionBooksList();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      {showForm && (
        <CollectionBooksForm
          id={selectedId}
          handleCloseForm={handleCloseForm}
          formType={formType}
          afterAction={() => void refetch()}
        />
      )}
      <AppContent
        tableType="table"
        data={data}
        columns={columns}
        handleShowForm={handleShowForm}
        changeFormType={setFormType}
        handleSelectId={handleSelectId}
        title={t("CollectionBooks")}
        btn
        addBtn
        actionBtn={openAdd}
        btnName={t("New")}
        startIcon
        loading={isFetching}
        isError={isError}
        onRetry={() => void refetch()}
        onRefresh={() => void refetch()}
      />
    </div>
  );
};

export default CollectionBooksRoot;
