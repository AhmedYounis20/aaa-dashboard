import { useState, useEffect } from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { getBranches } from "../../../../../Apis/Account/BranchesApi";
import BranchesForm from "./BranchesForm";
import { useTranslation } from "react-i18next";
import Loader from "../../../../../Components/Loader";
import { AppContent } from "../../../../../Components";
import ImagePreview from '../../../../../Components/Images/ImagePreview';
import AttachmentResult from '../../../../../interfaces/BaseModels/AttachmentResult';
import { NodeType } from "../../../../../interfaces/Components/NodeType";

const columns: { Header: string; accessor: string; function?: (attachment: AttachmentResult | null | undefined) => JSX.Element | null }[] = [
  {
    Header: "Logo",
    accessor: "attachment",
    function: (attachment : AttachmentResult | null | undefined) => (
      (attachment != null && attachment != undefined)
      ?
        <ImagePreview
          src={`data:${attachment?.fileType};base64,${attachment?.fileData}`}
          alt={attachment?.fileName || "attachment"}
          height={50}
          width={50}
        />
        :
        null
    ),
  },
  {
    Header: "Code",
    accessor: "chartOfAccount.code", // accessor is the "key" in the data
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "NameSecondLanguage",
    accessor: "nameSecondLanguage",
  },
];

const BranchesRoot = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
  const [parentId, setParentId] = useState<string | null>(null);
  
  const fetchBranches = async () => {
    try {
      const response = await getBranches();
      setData(response);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    fetchBranches();
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  return (
    <div className="h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {showForm && (
            <BranchesForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
               afterAction={() => fetchBranches()}
            />
          )}
          {data?.result && (
            <AppContent
              tableType="tree"
              data={data.result}
              columns={columns}
              handleShowForm={handleShowForm}
              changeFormType={setFormType}
              handleSelectId={handleSelectId}
              handleSelectParentId={setParentId}
              title={t("Branches")}
              btn
              addBtn
              actionBtn={() => {
                setParentId(null);
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              btnName={t("New")}
              startIcon
              showAddButtonIf={(row) => row.nodeType === NodeType.Category}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BranchesRoot;
