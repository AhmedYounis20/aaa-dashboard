import { useState } from 'react';
import { useGetSuppliersQuery } from '../../../../Apis/SuppliersApi';
import DataTreeTable from '../../../../Components/Tables/DataTreeTable';
import SuppliersForm from './SuppliersForm';
import { FormTypes } from '../../../../interfaces/Components';

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
    Header: "Name (Second Language)",
    accessor: "nameSecondLanguage",
  },
];

const SuppliersRoot = () => {
  const { data, isLoading } = useGetSuppliersQuery(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
    const [selectedId, setSelectedId] = useState<string>();
     const handleShowForm = () => {
       setShowForm(true);
     };
     const handleCloseForm = () => {
       setShowForm(false);
     };
     const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  return (
    <div className="container h-full">
      {isLoading ? (
        <div
          className="d-flex flex-row align-items-center justify-content-center"
          style={{ height: "60vh" }}
        >
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          {showForm && (
            
            <SuppliersForm
              id={selectedId || ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}
          {data?.result && (
                        <>
              <h1 className="mb-3"> Suppliers</h1>
              <button className="btn btn-primary mb-3">new</button>
            <DataTreeTable
              columns={columns}
              data={data.result}
              handleShowForm={handleShowForm}
              changeFormType={setFormType}
              handleSelectId={handleSelectId}
            />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SuppliersRoot;
