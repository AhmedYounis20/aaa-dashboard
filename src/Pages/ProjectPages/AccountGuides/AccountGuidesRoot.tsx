import { useState } from 'react';
import { useGetAccountGuidesQuery } from '../../../Apis/AccountGuidesApi'
import { AppContent } from '../../../Components';
import { FormTypes } from '../../../interfaces/Components';
import AccountGuidesForm from './AccountGuidesForm';
import { Box } from '@mui/material';
import Loader from '../../../Components/Loader';

const AccountGuidesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const { data, isLoading } = useGetAccountGuidesQuery(null);
  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);
  return (
    <div className="w-full">
      {isLoading 
      ? ( <Loader /> ) 
      : (
        <Box>
          {showForm &&  
            <AccountGuidesForm 
                id={selectedId} 
                handleCloseForm={handleCloseForm} 
                formType={formType}
            />
          }

          {data?.result && (
            <AppContent
              tableType='table'
              data={data.result}
              title='Account Guides'
              btnName='add new'
              addBtn
              btn
              startIcon
              actionBtn={null}
              showdelete={false}
              showedit={false}
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

export default AccountGuidesRoot
