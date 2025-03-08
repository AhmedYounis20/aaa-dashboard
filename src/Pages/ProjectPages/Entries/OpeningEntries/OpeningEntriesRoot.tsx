import { useState } from 'react';
import { FormTypes } from '../../../../interfaces/Components';

import Loader from '../../../../Components/Loader';
import { AppContent } from '../../../../Components';
import { useGetEntriesQuery } from '../../../../Apis/EntriesApi';
import EntriesForm from './OpeningEntriesForm';

const OpeningEntriesRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const { data, isLoading } = useGetEntriesQuery(null);
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
        <Loader />
      ) : (
        <>
          {showForm && (
            <EntriesForm
              id={selectedId}
              formType={formType}
              handleCloseForm={handleCloseForm}
            />
          )}
          {data?.result && (
            <AppContent
              tableType="table"
              data={data.result}
              title="Opening Entries"
              btnName="new"
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

export default OpeningEntriesRoot;