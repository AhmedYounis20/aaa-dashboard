import { useState } from 'react';
import { useGetChartOfAccountsQuery } from '../../../Apis/ChartOfAccountsApi';
import { FormTypes } from '../../../interfaces/Components';
import ChartOfAccountsForm from './ChartOfAccountsForm';
import Loader from '../../../Components/Loader';
import { AppContent } from '../../../Components';

const columns = [
  {
    Header: "Code",
    accessor: "code",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Name (Second Language)",
    accessor: "nameSecondLanguage",
  },
];

const ChartOfAccountsRoot = () => {

  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const { data, isLoading } = useGetChartOfAccountsQuery(null);
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
            <ChartOfAccountsForm
              id={selectedId}
              parentId={parentId}
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}

          {data?.result && (
            <AppContent
              tableType="tree"
              data={data.result}
              title="chart of accounts"
              // actionBtn={() => setIsOpen(prev => !prev)}
              btn
              addBtn
              actionBtn={() => {
                setParentId("");
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              btnName="add new"
              startIcon
              columns={columns}
              showdelete={false}
              showedit={false}
              handleSelectId={handleSelectId}
              handleSelectParentId={setParentId}
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
}

export default ChartOfAccountsRoot;
