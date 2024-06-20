import { useState } from 'react';
import { useGetCustomersQuery } from '../../../../Apis/CustomersApi';
import DataTreeTable from '../../../../Components/Tables/DataTreeTable';
import { FormTypes } from '../../../../interfaces/Components';
import CustomersForm from './CustomersForm';
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
];

const CustomersRoot = () => {
  const { data, isLoading } = useGetCustomersQuery(null);
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
            <CustomersForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}
          {data?.result && (
            <>
              <h2 className="mb-3"> Customers</h2>
              <button className="btn btn-primary mb-2">new</button>
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

export default CustomersRoot;
