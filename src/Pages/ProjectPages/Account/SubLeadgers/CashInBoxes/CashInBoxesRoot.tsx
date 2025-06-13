import { useState } from 'react';
import { useGetCashInBoxesQuery } from "../../../../../Apis/Account/CashInBoxesApi";
import { AppContent } from '../../../../../Components';
import Loader from '../../../../../Components/Loader';
import { FormTypes } from '../../../../../interfaces/Components';
import CashInBoxesForm from './CashInBoxesForm';
const columns = [
  {
    Header: "Code",
    accessor: "code", // accessor is the "key" in the data
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

const CashInBoxesRoot = () => {
  const { data, isLoading } = useGetCashInBoxesQuery(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
  const [parentId, setParentId] = useState<string | null>(null);
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
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
            />
          )}
          {data?.result && (
            <>
              <AppContent
                tableType="tree"
                data={data.result}
                columns={columns}
                handleShowForm={handleShowForm}
                changeFormType={setFormType}
                handleSelectId={handleSelectId}
                handleSelectParentId={setParentId}
                title="CashInBoxes"
                btn
                addBtn
                actionBtn={() => {
                  setParentId(null);
                  setFormType(FormTypes.Add);
                  handleShowForm();
                }}
                startIcon
                btnName="add new"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CashInBoxesRoot;
