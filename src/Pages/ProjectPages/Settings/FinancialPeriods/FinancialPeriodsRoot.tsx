import { useState } from 'react';
import { DataTable } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import FinancialPeriodsForm from './FinancialPeriodsForm';
import { useGetFinancialPeriodsQuery } from '../../../../Apis/FinancialPeriodsApi';
import { Box, Typography } from '@mui/material';
import Loader from '../../../../Components/Loader';

const FinancialPeriodsRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const { data, isLoading } = useGetFinancialPeriodsQuery(null);
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
        <Loader/>
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
            <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'start'}
            alignItems={'start'}
            >
            <Typography variant='h2' mb={2}> Financial Periods</Typography>
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
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default FinancialPeriodsRoot;
