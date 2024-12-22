import { useState } from 'react';
import { FormTypes } from '../../../../interfaces/Components';
import Loader from '../../../../Components/Loader';
import { AppContent } from '../../../../Components';
import { useGetBranchesQuery } from '../../../../Apis/BranchesApi';
import BranchesForm from './BranchesForm';
import ImagePreview from '../../../../Components/Images/ImagePreview';
import AttachmentResult from '../../../../interfaces/BaseModels/AttachmentResult';
const columns = [
  {
    Header: "Logo",
    accessor: "attachment",
    function: (attachment : AttachmentResult | null | undefined) => (
      (attachment != null && attachment != undefined)
      ?
        <ImagePreview
          src={`data:${attachment?.fileType};base64,${attachment?.fileData}`}
          alt={attachment?.fileName || "attachment"}
          height={50}
          width={50}
        />
        :
        null
    ),
  },
  {
    Header: "Code",
    accessor: "chartOfAccount.code", // accessor is the "key" in the data
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

const BranchesRoot = () => {
  const { data, isLoading } = useGetBranchesQuery(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
  const [parentId, setParentId] = useState<string | null>(null);
  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);


  if(!data?.result) return <div className='h-screen flex items-center justify-center'>
    <Loader />
  </div>

  return (
    <div className="h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {showForm && (
            <BranchesForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
            />
          )}
          {data?.result && (
            <AppContent
              tableType="tree"
              title="Branches"
              btn
              addBtn
              actionBtn={() => {
                setParentId(null);
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              btnName="add new"
              columns={columns}
              data={data && data?.result}
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
}

export default BranchesRoot;
