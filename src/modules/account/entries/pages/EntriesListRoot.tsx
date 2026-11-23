import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContent } from "@/Components";
import Loader from "@/Components/Loader";
import { FormTypes } from "@/interfaces/Components";
import ComplexEntryForm from "../components/ComplexEntryForm";
import { getEntryKindConfig, type EntryKind } from "../entryKind";

export interface EntriesListRootProps {
  entryKind: EntryKind;
}

export default function EntriesListRoot({ entryKind }: EntriesListRootProps) {
  const { t } = useTranslation();
  const config = getEntryKindConfig(entryKind);

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const columns = [
    { Header: t("Entry Number"), accessor: "entryNumber" },
    { Header: t("Document Number"), accessor: "documentNumber" },
    { Header: t("Exchange Rate"), accessor: "exchangeRate" },
    { Header: t("Receiver Name"), accessor: "receiverName" },
    { Header: t("Entry Date"), accessor: "entryDate" },
    { Header: t("Financial Period"), accessor: "financialPeriodNumber" },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await config.list();
      if (result?.isSuccess) {
        setData(result.result);
      } else {
        setIsError(true);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when entry kind changes
  }, [entryKind]);

  const handleShowForm = () => setShowForm(true);

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedId("");
    void fetchData();
  };

  const handleSelectId = (rowId: string) => setSelectedId(rowId);

  const showInitialLoader = isLoading && data.length === 0 && !isError;

  return (
    <div className="h-full">
      {showInitialLoader ? (
        <Loader />
      ) : (
        <>
          {showForm && (
            <ComplexEntryForm
              entryKind={entryKind}
              id={selectedId}
              formType={formType}
              handleCloseForm={handleCloseForm}
              afterAction={() => void fetchData()}
            />
          )}
          <AppContent
            tableType="table"
            data={data}
            loading={isLoading}
            isError={isError}
            onRetry={() => void fetchData()}
            onRefresh={() => void fetchData()}
            title={t(config.titleKey)}
            columns={columns}
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
            defaultHiddenCols={["id", "createdAt", "createdBy", "modifiedAt", "modifiedBy"]}
          />
        </>
      )}
    </div>
  );
}
