import { useEffect, useState } from 'react';
import { getItems } from "../../../../Apis/Inventory/ItemsApi";
import { FormTypes } from '../../../../interfaces/Components/FormType';
import ItemsForm from './ItemsForm';
import Loader from '../../../../Components/Loader';
import { AppContent } from '../../../../Components';
import ItemModel  from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemModel';
import { useTranslation } from 'react-i18next';

const columns = [
  {
    Header: "Code",
    accessor: "code",
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

const ItemsRoot = () => {

  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [data, setData] = useState<ItemModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {t} = useTranslation();
    const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };

  const fetchData = async () => {
    const result = await getItems();
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
          {showForm ? (
            <ItemsForm
              id={selectedId}
              parentId={parentId}
              handleCloseForm={handleCloseForm}
              formType={formType}
              afterAction={() => fetchData()}
            />
          ) : (
            <>
              {data && (
                <AppContent
                  tableType="tree"
                  data={data}
                  title={t("Items")}
                  // actionBtn={() => setIsOpen(prev => !prev)}
                  btn
                  addBtn
                  actionBtn={() => {
                    setParentId(null);
                    setFormType(FormTypes.Add);
                    handleShowForm();
                  }}
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
        </>
      )}
    </div>
  );
}

export default ItemsRoot;
