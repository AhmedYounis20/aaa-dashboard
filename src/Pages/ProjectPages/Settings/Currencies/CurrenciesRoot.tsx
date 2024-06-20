import { useState } from 'react';
import { useGetCurrenciesQuery } from "../../../../Apis/CurrenciesApi";
import { DataTable } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import CurrenciesForm from './CurrenciesForm';



const CurrenciesRoot = () => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
    const [selectedId, setSelectedId] = useState<string>();
    const { data, isLoading } = useGetCurrenciesQuery(null);
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
            <CurrenciesForm
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}
          {data?.result && (
            <>
              <h3 className="mb-3"> Currencies</h3>
              <button className="btn btn-primary mb-2">new</button>
              <DataTable
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

export default CurrenciesRoot;
