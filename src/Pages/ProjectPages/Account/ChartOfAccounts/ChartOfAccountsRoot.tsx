import { useEffect, useState } from 'react';
import { getChartOfAccounts } from "../../../../Apis/Account/ChartOfAccountsApi";
import { FormTypes } from '../../../../interfaces/Components';
import ChartOfAccountsForm from './ChartOfAccountsForm';
import Loader from '../../../../Components/Loader';
import { AppContent } from '../../../../Components';
import { ChartOfAccountModel } from '../../../../interfaces/ProjectInterfaces';
import { useTranslation } from 'react-i18next';

const ChartOfAccountsRoot = () => {

  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [data, setData] = useState<ChartOfAccountModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {t} = useTranslation();

  const columns = [
    {
      Header: t("Code"),
      accessor: "code",
    },
    {
      Header: t("Name"),
      accessor: "name",
    },
    {
      Header: t("NameSecondLanguage"),
      accessor: "nameSecondLanguage",
    },
  ];

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };

  const fetchData = async () => {
    const result = await getChartOfAccounts();
    if (result && result.isSuccess) {
      setData(result.result);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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
              afterAction = {()=> fetchData()}
              handleTranslate = {(key)=> t(key)}
            />
          )}

          {data && (
            <AppContent
              tableType="tree"
              data={data}
              title={t("ChartOfAccounts")}
              // actionBtn={() => setIsOpen(prev => !prev)}
              btn
              addBtn
              actionBtn={() => {
                setParentId("");
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              btnName={t("AddNew")}
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
