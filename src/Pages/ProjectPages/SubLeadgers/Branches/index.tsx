import { useState } from 'react';
import { useGetBanksQuery } from '../../../../Apis/BanksApi';
import { FormTypes } from '../../../../interfaces/Components';
import BanksForm from './BanksForm';
import Loader from '../../../../Components/Loader';
import { AppContent } from '../../../../Components';
import { useGetBranchesQuery } from '../../../../Apis/BranchesApi';
import BranchesForm from './BranchesForm';
const columns = [
  {
    Header: "Code",
    accessor: "chartOfAccount.code", // accessor is the "key" in the data
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Name (Second Language)",
    accessor: "nameSecondLanguage",
  },

  // Add more columns as needed
];

const BranchesRoot = () => {
  const { data, isLoading } = useGetBranchesQuery(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
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
            <BranchesForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}
          {data?.result && (
            <AppContent
              tableType='tree'
              title='Branches'
              btn
              addBtn
              btnName='add new'
              columns={columns}
              data={data.result}
              handleShowForm={handleShowForm}
              changeFormType={setFormType}
              handleSelectId={handleSelectId}
            />
          )}
        </>
      )}
    </div>
  );
}

export default BranchesRoot;
