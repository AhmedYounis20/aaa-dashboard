import { useEffect, useState } from 'react';
import { AppContent } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import AccountGuidesForm from './AccountGuidesForm';
import { Box } from '@mui/material';
import Loader from '../../../../Components/Loader';
import { getAccountGuides } from "../../../../Apis/Account/AccountGuidesApi";
import { AccountGuideModel } from '../../../../interfaces/ProjectInterfaces';
import { useTranslation } from 'react-i18next';

const AccountGuidesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<AccountGuideModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const fetchData = async () => {
    const result = await getAccountGuides();
    if (result && result.isSuccess) {
      setData(result.result);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);
  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          {showForm && (
            <AccountGuidesForm
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
              afterAction={() => fetchData()}
              handleTranslate ={(key: string) => t(key)}
            />
          )}

          {!isLoading && (
            <AppContent
              tableType="table"
              data={data}
              title={t("AccountGuides")}
              addBtn
              btn
              startIcon
              actionBtn={() => {
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

export default AccountGuidesRoot
