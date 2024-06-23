import { useState } from 'react';
import { DataTable } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import FinancialPeriodsForm from './FinancialPeriodsForm';
import { useGetFinancialPeriodsQuery } from '../../../../Apis/FinancialPeriodsApi';
import { Button } from '@mui/material';



const FinancialPeriodsRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
  const { data, isLoading } = useGetFinancialPeriodsQuery(null);
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
          className="flex flex-row align-items-center justify-content-center"
          style={{ height: "60vh" }}
        >
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          {showForm && (
            <FinancialPeriodsForm
            id={selectedId}
            handleCloseForm={handleCloseForm}
            formType={formType}
            />
          )}
          {data?.result && (
            <>
            <h3 className="mb-4"> Financial Periods</h3>
              {data.result.length===0 && <button className="btn btn-primary mb-5">new</button>}
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
};

export default FinancialPeriodsRoot;
