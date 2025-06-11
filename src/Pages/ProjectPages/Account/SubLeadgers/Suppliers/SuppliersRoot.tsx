import { useState } from 'react';
import { useGetSuppliersQuery } from "../../../../../Apis/Account/SuppliersApi";
import SuppliersForm from './SuppliersForm';
import { FormTypes } from '../../../../../interfaces/Components';
import Loader from '../../../../../Components/Loader';
import { AppContent } from '../../../../../Components';

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
];

const SuppliersRoot = () => {
  const { data, isLoading } = useGetSuppliersQuery(null);
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
            <SuppliersForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
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
              title="Suppliers"
              btn
              addBtn
              actionBtn={() => {
                setParentId(null);
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              btnName="new"
              startIcon
            />
          )}
        </>
      )}
    </div>
  );
};

export default SuppliersRoot;
