import { useState } from 'react';
import { useGetAccountGuidesQuery } from '../../../Apis/AccountGuidesApi'
import { DataTable } from '../../../Components';
import { FormTypes } from '../../../interfaces/Components';
import AccountGuidesForm from './AccountGuidesForm';



const AccountGuidesRoot = () => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
    const [selectedId, setSelectedId] = useState<string>();
    const {data,isLoading}= useGetAccountGuidesQuery(null);
      const handleShowForm = () => {
        setShowForm(true);
      };
      const handleCloseForm = () => {
        setShowForm(false);
      };
      const handleSelectId: (id: string) => void = (id) => setSelectedId(id);
  return (
    <div className="container h-full pt-0">
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
            <AccountGuidesForm
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}
          {data?.result && (
            <>
              <h3 className="mb-4"> Account Guides</h3>
              <button className="btn btn-primary mb-2">new</button>
              <DataTable
                showdelete={false}
                showedit={false}
                data={data.result}
                handleSelectId={handleSelectId}
                changeFormType={setFormType}
                handleShowForm={handleShowForm}
                defaultHiddenColumns={[
                  "id",
                  "createdAt",
                  "createdBy",
                  "modifiedAt",
                  "modifiedBy",
                ]}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AccountGuidesRoot
