import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormTypes } from '../../../../../interfaces/Components';
import TaxesForm from './TaxesForm';
import Loader from '../../../../../Components/Loader';
import { AppContent } from '../../../../../Components';
import { getTaxes } from "../../../../../Apis/Account/TaxesApi";
import { NodeType } from '../../../../../interfaces/Components/NodeType';

const columns = [
  {
    Header: "Code",
    accessor: "chartOfAccount.code",
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

const TaxesRoot = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const result = await getTaxes();
    if (result && result.isSuccess) {
      setData(result.result);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleSelectId: (id: string) => void = (id) =>
    setSelectedId(id);
  return (
    <div className="h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {showForm && (
            <TaxesForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
              afterAction={() => fetchData()}
            />
          )}
          {data && (
            <AppContent
              tableType="tree"
              title={t("Taxes")}
              btn
              addBtn
              actionBtn={() => {
                setParentId(null);
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
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
}

export default TaxesRoot;
