import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormTypes } from '../../../../../interfaces/Components';

import Loader from '../../../../../Components/Loader';
import { AppContent } from '../../../../../Components';
import EntriesForm from './JournalEntriesForm';
import EntryModel from '../../../../../interfaces/ProjectInterfaces/Account/Entries/Entry';
import { getJournalEntries } from "../../../../../Apis/Account/JournalEntriesApi";

const JournalEntriesRoot = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<EntryModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const result = await getJournalEntries();
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

  const columns = [
    { Header: t('Entry Number'), accessor: 'entryNumber' },
    { Header: t('Document Number'), accessor: 'documentNumber' },
    { Header: t('Exchange Rate'), accessor: 'exchangeRate' },
    { Header: t('Receiver Name'), accessor: 'receiverName' },
    { Header: t('Entry Date'), accessor: 'entryDate' },
    { Header: t('Financial Period'), accessor: 'financialPeriodNumber' },
  ];

  return (
    <div className="h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {showForm && (
            <EntriesForm
              id={selectedId}
              formType={formType}
              handleCloseForm={handleCloseForm}
              actionAfter={() => fetchData()}
            />
          )}
          {data && (
            <AppContent
              tableType="table"
              data={data}
              title={t("JournalEntries")}
              columns={columns}
              btnName={t("New")}
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
        </>
      )}
    </div>
  );
};

export default JournalEntriesRoot;
