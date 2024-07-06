import { useEffect, useState } from 'react';
import { useGetChartOfAccountsQuery } from '../../../Apis/ChartOfAccountsApi';
import DataTreeTable from '../../../Components/Tables/DataTreeTable';
import { FormTypes } from '../../../interfaces/Components';
import ChartOfAccountsForm from './ChartOfAccountsForm';
import Loader from '../../../Components/Loader';
import { AppContent } from '../../../Components';
import ChartForm from './ChartForm';

const columns = [
  {
    Header: "Code",
    accessor: "code", // accessor is the "key" in the data
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Name (Second Language)",
    accessor: "nameSecondLanguage",
  },

  // Add more columns as needed
];

const ChartOfAccountsRoot = () => {

  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
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
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}

          {data?.result && (
            <AppContent
              tableType='tree'
              data={data.result}
              title='chart of accounts'
              // actionBtn={() => setIsOpen(prev => !prev)}
              btn
              addBtn
              btnName='add new'
              startIcon
              columns={columns}
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
        </>
      )}
    </div>
  );
}

export default ChartOfAccountsRoot;
