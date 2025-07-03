import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { FormTypes } from "../../../../../interfaces/Components";

import Loader from "../../../../../Components/Loader";
import { AppContent } from "../../../../../Components";
import EntriesForm from "./CompinedEntriesForm";
import { getCompinedEntries } from "../../../../../Apis/Account/CompinedEntriesApi";
import ComplexEntryModel from "../../../../../interfaces/ProjectInterfaces/Account/Entries/ComplexEntry";

const CompinedEntriesRoot = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<ComplexEntryModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const result = await getCompinedEntries();
    if (result && result.isSuccess) {
      setData(result.result);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
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
            <EntriesForm
              id={selectedId}
              formType={formType}
              handleCloseForm={handleCloseForm}
              afterAction={() => fetchData()}
            />
          )}
          {data && (
            <AppContent
              tableType="table"
              data={data}
              title={t("CompinedEntries")}
              btnName={t("New")}
              addBtn
              btn
              startIcon
              actionBtn={() => {
                setFormType(FormTypes.Add);
                handleShowForm();
              }}
              handleSelectId={handleSelectId}
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
};

export default CompinedEntriesRoot;
