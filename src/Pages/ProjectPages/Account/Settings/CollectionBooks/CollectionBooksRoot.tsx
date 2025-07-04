import { useState, useEffect } from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { getCollectionBooks } from "../../../../../Apis/Account/CollectionBooksApi";
import CollectionBooksForm from "./CollectionBooksForm";
import { useTranslation } from "react-i18next";
import Loader from "../../../../../Components/Loader";
import { AppContent } from "../../../../../Components";

const columns: { Header: string; accessor: string }[] = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "NameSecondLanguage",
    accessor: "nameSecondLanguage",
  },
];

const CollectionBooksRoot = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();

  const fetchCollectionBooks = async () => {
    try {
      const response = await getCollectionBooks();
      setData(response);
    } catch (error) {
      console.error('Error fetching collection books:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    fetchCollectionBooks();
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleSelectId: (id: string) => void = (id) => setSelectedId(id);

  return (
    <div className="h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {showForm && (
            <CollectionBooksForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              afterAction={() => fetchCollectionBooks()}
            />
          )}
          {data?.result && (
            <AppContent
              tableType="table"
              data={data.result}
              columns={columns}
              handleShowForm={handleShowForm}
              changeFormType={setFormType}
              handleSelectId={handleSelectId}
              title={t("CollectionBooks")}
              btn
              addBtn
              actionBtn={() => {
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              btnName={t("New")}
              startIcon
            />
          )}
        </>
      )}
    </div>
  );
};

export default CollectionBooksRoot;
