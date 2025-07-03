import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { FormTypes } from '../../../../../interfaces/Components';
import Loader from '../../../../../Components/Loader';
import { AppContent } from '../../../../../Components';
import { useGetFixedAssetsQuery } from "../../../../../Apis/Account/FixedAssetsApi";
import FixedAssetsForm from './FixedAssetsForm';
const columns = [
  {
    Header: "Code",
    accessor: "chartOfAccount.code", // accessor is the "key" in the data
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "NameSecondLanguage",
    accessor: "nameSecondLanguage",
  },

  // Add more columns as needed
];

const FixedAssetsRoot = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetFixedAssetsQuery(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
  const [parentId, setParentId] = useState<string | null >(null);

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
            <FixedAssetsForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
            />
          )}
          {data?.result && (
            <AppContent
              tableType="tree"
              title={t("FixedAssets")}
              btn
              addBtn
              actionBtn={() => {
                setParentId(null);
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              btnName={t("AddNew")}
              columns={columns}
              data={data.result}
              handleShowForm={handleShowForm}
              changeFormType={setFormType}
              handleSelectId={handleSelectId}
              handleSelectParentId={setParentId}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FixedAssetsRoot;
