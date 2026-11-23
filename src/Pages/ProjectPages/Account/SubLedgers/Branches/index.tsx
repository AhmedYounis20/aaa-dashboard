import { useTranslation } from "react-i18next";
import BranchesForm from "./BranchesForm";
import Loader from "@/Components/Loader";
import { AppContent } from "@/Components";
import ImagePreview from "@/Components/Images/ImagePreview";
import BranchModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Branches/BranchModel";
import { NodeType } from "@/interfaces/Components/NodeType";
import { useBranchesList, useEntityListPage } from "@/hooks/queries";

const columns = [
  {
    Header: "Logo",
    accessor: "attachment",
    renderCell: ({ value }: { value: BranchModel["attachment"] }) => {
      const src =
        value?.contentUrl ||
        (value?.fileData
          ? `data:${value.fileContentType || value.contentType || ""};base64,${value.fileData}`
          : "");
      if (!src) return null;
      return (
        <ImagePreview src={src} alt={value?.fileName || "attachment"} height={50} width={50} />
      );
    },
  },
  { Header: "Code", accessor: "chartOfAccount.code" },
  { Header: "Name", accessor: "name" },
  { Header: "NameSecondLanguage", accessor: "nameSecondLanguage" },
];

const BranchesRoot = () => {
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

  const { data = [], isLoading, isFetching, isError, refetch } = useBranchesList();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      {showForm && (
        <BranchesForm
          id={selectedId}
          handleCloseForm={handleCloseForm}
          formType={formType}
          parentId={parentId ?? null}
        />
      )}
      <AppContent
        tableType="tree"
        data={data as BranchModel[]}
        columns={columns}
        handleShowForm={handleShowForm}
        changeFormType={setFormType}
        handleSelectId={handleSelectId}
        handleSelectParentId={setParentId}
        title={t("Branches")}
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

export default BranchesRoot;
