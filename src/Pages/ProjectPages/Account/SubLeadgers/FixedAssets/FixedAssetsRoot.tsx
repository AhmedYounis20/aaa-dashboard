import { useState, useEffect } from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { getFixedAssets } from "../../../../../Apis/Account/FixedAssetsApi";
import FixedAssetsForm from "./FixedAssetsForm";
import { useTranslation } from "react-i18next";
import Loader from "../../../../../Components/Loader";
import { AppContent } from "../../../../../Components";
import { NodeType } from "../../../../../interfaces/Components/NodeType";

const columns: { Header: string; accessor: string }[] = [
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
  // Add more columns as needed
];

const FixedAssetsRoot = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
  const [parentId, setParentId] = useState<string | null>(null);

  const fetchFixedAssets = async () => {
    try {
      const response = await getFixedAssets();
      setData(response);
    } catch (error) {
      console.error('Error fetching fixed assets:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    fetchFixedAssets();
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
            <FixedAssetsForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
              afterAction={() => fetchFixedAssets()}
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
              title={t("FixedAssets")}
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

export default FixedAssetsRoot;
