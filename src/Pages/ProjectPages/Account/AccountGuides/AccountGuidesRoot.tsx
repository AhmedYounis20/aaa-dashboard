import { Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAccountGuidesPaginated } from '../../../../Apis/Account/AccountGuidesApi';
import { AppContent } from '../../../../Components';
import { FormTypes } from '../../../../interfaces/Components';
import AccountGuidesForm from './AccountGuidesForm';

const AccountGuidesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [reloadKey, setReloadKey] = useState(0);
  const {t} = useTranslation();

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  const columns: { Header: string; accessor: string }[] = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "NameSecondLanguage",
      accessor: "nameSecondLanguage",
    },
  ];

  return (
    <div className="w-full">
      <Box>
        {showForm && (
          <AccountGuidesForm
            id={selectedId}
            handleCloseForm={handleCloseForm}
            formType={formType}
            afterAction={() => setReloadKey(prev => prev + 1)}
            handleTranslate ={(key: string) => t(key)}
          />
        )}

        <AppContent
          tableType="table"
          title={t("AccountGuides")}
          columns={columns}
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
          reloadKey={reloadKey}
          serverSidePagination={true}
          onFetchData={getAccountGuidesPaginated}
        />
      </Box>
    </div>
  );
}

export default AccountGuidesRoot
