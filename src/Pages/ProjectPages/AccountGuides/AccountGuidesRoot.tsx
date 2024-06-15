import { useGetAccountGuidesQuery } from '../../../Apis/AccountGuidesApi'
import { DataTable } from '../../../Components';



const AccountGuidesRoot = () => {
    const {data,isLoading}= useGetAccountGuidesQuery(null);
    
  return (
    <div className="container h-full">
      {isLoading ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : (
        <>
          {data?.result && (
            <DataTable
              data={data.result}
              defaultHiddenColumns={[
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

export default AccountGuidesRoot
