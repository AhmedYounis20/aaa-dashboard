import { useState, useEffect } from 'react';
import { AppContent } from '../../../../../Components';
import { FormTypes } from '../../../../../interfaces/Components';
import CurrenciesForm from './CurrenciesForm';
import { Box } from '@mui/material';
import Loader from '../../../../../Components/Loader';
import { getCurrencies } from "../../../../../Apis/Account/CurrenciesApi";



const CurrenciesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const columns = [
    { Header: 'Symbol', accessor: 'symbol' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'NameSecondLanguage', accessor: 'nameSecondLanguage' },
  ];

  const fetchData = async () => {
    const result = await getCurrencies();
    if (result && result.isSuccess) {
      setData(result.result);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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
              afterAction={() => fetchData()}
            />
          )}
          {data && (
            <AppContent
              tableType='table'
              data={data}
              title='Currencies'
              columns={columns}
              btnName='new'
              addBtn
              btn
              startIcon
              actionBtn={()=>{
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
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
