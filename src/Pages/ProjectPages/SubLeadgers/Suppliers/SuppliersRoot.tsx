import { useGetSuppliersQuery } from '../../../../Apis/SuppliersApi';
import DataTreeTable from '../../../../Components/DataTreeTable';
interface Data {
  code: string;
  accountGuidId: string;
  name: string;
  nameSecondLanguage: string;
  id: string;
  children?: Data[];
}
const columns: { Header: string; accessor: keyof Data }[] = [
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

const SuppliersRoot = () => {
  const { data, isLoading } = useGetSuppliersQuery(null);
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

export default SuppliersRoot;
