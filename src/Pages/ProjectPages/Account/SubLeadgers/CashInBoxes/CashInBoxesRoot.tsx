import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { getCashInBoxes } from "../../../../../Apis/Account/CashInBoxesApi";
import { AppContent } from '../../../../../Components';
import Loader from '../../../../../Components/Loader';
import { FormTypes } from '../../../../../interfaces/Components';
import CashInBoxesForm from './CashInBoxesForm';
import { NodeType } from '../../../../../interfaces/Components/NodeType';

const CashInBoxesRoot = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const result = await getCashInBoxes();
    if (result && result.isSuccess) {
      setData(result.result);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      Header: t("Code"),
      accessor: "code", // accessor is the "key" in the data
    },
    {
      Header: t("Name"),
      accessor: "name",
    },
    {
      Header: t("NameSecondLanguage"),
      accessor: "nameSecondLanguage",
    },
    // Add more columns as needed
  ];

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
            <CashInBoxesForm
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
              afterAction={() => fetchData()}
            />
          )}
          {data && (
            <AppContent
              tableType="tree"
              title={t("CashInBoxes")}
              btn
              addBtn
              actionBtn={() => {
                setParentId(null);
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              btnName={t("AddNew")}
              columns={columns}
              data={data}
              handleShowForm={handleShowForm}
              changeFormType={setFormType}
              handleSelectId={handleSelectId}
              handleSelectParentId={setParentId}
              showAddButtonIf={(row) => row.nodeType === NodeType.Category}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CashInBoxesRoot;
