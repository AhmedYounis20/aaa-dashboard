import { useState } from 'react';
import { useGetCustomersQuery } from "../../../../../Apis/Account/CustomersApi";
import { FormTypes } from '../../../../../interfaces/Components';
import CustomersForm from './CustomersForm';
import Loader from '../../../../../Components/Loader';
import { AppContent } from '../../../../../Components';
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
    Header: "NameSecondLanguage",
    accessor: "nameSecondLanguage",
  },
];

const CustomersRoot = () => {
  const { data, isLoading } = useGetCustomersQuery(null);
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
            <CustomersForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
            />
          )}
          {data?.result && (
            <AppContent
              tableType="tree"
              title="Customers"
              btn
              addBtn
              actionBtn={() => {
                setParentId(null);
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              startIcon
              columns={columns}
              data={data.result}
              handleShowForm={handleShowForm}
              changeFormType={setFormType}
              handleSelectId={handleSelectId}
              handleSelectParentId={setParentId}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CustomersRoot;
