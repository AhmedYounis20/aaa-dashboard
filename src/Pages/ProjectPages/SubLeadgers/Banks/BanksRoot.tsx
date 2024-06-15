import { useGetBanksQuery } from '../../../../Apis/BanksApi';
import DataTreeTable from '../../../../Components/DataTreeTable';
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

const BanksRoot = () => {
    const {data,isLoading}= useGetBanksQuery(null);
    
  return (
    <div className="container h-full">
      {isLoading ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : (
        <>
          {data?.result && (
            <DataTreeTable columns={columns} data={data.result} />
          )}
        </>
      )}
    </div>
  );
}

export default BanksRoot;
