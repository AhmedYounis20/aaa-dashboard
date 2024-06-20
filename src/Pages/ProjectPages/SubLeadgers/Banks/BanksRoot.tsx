import { useGetBanksQuery } from '../../../../Apis/BanksApi';
import DataTreeTable from '../../../../Components/Tables/DataTreeTable';
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
        <div
          className="d-flex flex-row align-items-center justify-content-center"
          style={{ height: "60vh" }}
        >
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          {data?.result && (
            <>
              <h2 className="mb-3">Banks</h2>
              <button className="btn btn-primary mb-2">new</button>
              <DataTreeTable columns={columns} data={data.result} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default BanksRoot;
