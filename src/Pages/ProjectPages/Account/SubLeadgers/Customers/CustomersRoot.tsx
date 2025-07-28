import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { getCustomers } from "../../../../../Apis/Account/CustomersApi";
import { FormTypes } from '../../../../../interfaces/Components';
import CustomersForm from './CustomersForm';
import Loader from '../../../../../Components/Loader';
import { AppContent } from '../../../../../Components';
import { NodeType } from '../../../../../interfaces/Components/NodeType';
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
];

const CustomersRoot = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();
  const [parentId, setParentId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getCustomers();
    setData(res);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    fetchData(); // refresh after add/edit/delete
  };
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  return (
    <div className="h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {showForm && (
            <CustomersForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              parentId={parentId}
              afterAction={() => fetchData()}
            />
          )}
          {data?.result && (
            <AppContent
              tableType="tree"
              title={t("Customers")}
              btn
              addBtn
              actionBtn={() => {
                setParentId(null);
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              startIcon
              columns={columns}
              data={data.result}
              handleShowForm={handleShowForm}
              changeFormType={setFormType}
              handleSelectId={handleSelectId}
              handleSelectParentId={setParentId}              
              showAddButtonIf={(row) => row.nodeType === NodeType.Category}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CustomersRoot;
