import { useGetCustomersQuery } from '../../../../Apis/CustomersApi';
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
];

const CustomersRoot = () => {
  const { data, isLoading } = useGetCustomersQuery(null);
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
};

export default CustomersRoot;
