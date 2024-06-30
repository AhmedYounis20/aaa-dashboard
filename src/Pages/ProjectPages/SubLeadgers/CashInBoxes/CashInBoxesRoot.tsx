import { useGetCashInBoxesQuery } from '../../../../Apis/CashInBoxesApi';
import { AppContent } from '../../../../Components';
import Loader from '../../../../Components/Loader';
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

const CashInBoxesRoot = () => {
  const { data, isLoading } = useGetCashInBoxesQuery(null);

  return (
    <div className="h-full">
      {isLoading ? (
        <Loader/>
      ) : (
        <>
          {data?.result && (
            <>
              <AppContent
                tableType='tree'
                data={data.result}
                columns={columns}
                title='cash in box'
                btn
                addBtn
                startIcon
                btnName='add new'
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CashInBoxesRoot;
