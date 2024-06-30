import { useState } from 'react';
import { useGetCurrenciesQuery } from "../../../../Apis/CurrenciesApi";
import { AppContent } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import CurrenciesForm from './CurrenciesForm';
import { Box } from '@mui/material';
import Loader from '../../../../Components/Loader';



const CurrenciesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
  const { data, isLoading } = useGetCurrenciesQuery(null);

  const handleShowForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);


  return (
    <div className='w-full'>
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          {showForm && (
            <CurrenciesForm
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}
          {data?.result && (
            <AppContent
              tableType='table'
              data={data.result}
              title='Currencies'
              btnName='new'
              addBtn
              startIcon
              handleSelectId={handleSelectId}
              changeFormType={setFormType}
              handleShowForm={handleShowForm}
              defaultHiddenCols={[
                "id",
                "createdAt",
                "createdBy",
                "modifiedAt",
                "modifiedBy",
              ]}
            />
          )}
        </Box>
      )}
    </div>
  );
}

export default CurrenciesRoot;
