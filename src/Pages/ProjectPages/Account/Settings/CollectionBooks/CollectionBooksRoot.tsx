import { useState } from 'react';
import { useGetCollectionBooksQuery } from "../../../../../Apis/Account/CollectionBooksApi";
import { AppContent } from '../../../../../Components';
import { FormTypes } from '../../../../../interfaces/Components';
import CollectionBooksForm from './CollectionBooksForm';
import { Box } from '@mui/material';
import Loader from '../../../../../Components/Loader';

const CollectionBooksRoot = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const { data, isLoading } = useGetCollectionBooksQuery(null);
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
            <CollectionBooksForm
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}

          {data?.result && (
            <AppContent
              tableType="table"
              data={data.result}
              title="Collection Books"
              btnName="add new"
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
};

export default CollectionBooksRoot;
