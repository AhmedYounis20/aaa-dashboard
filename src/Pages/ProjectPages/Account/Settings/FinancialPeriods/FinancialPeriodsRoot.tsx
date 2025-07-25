import { useState, useEffect } from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { getFinancialPeriods } from "../../../../../Apis/Account/FinancialPeriodsApi";
import FinancialPeriodsForm from "./FinancialPeriodsForm";
import { useTranslation } from "react-i18next";
import Loader from "../../../../../Components/Loader";
import { AppContent } from "../../../../../Components";
import FinancialPeriodModel from "../../../../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel";

const columns: { Header: string; accessor: string }[] = [
  {
    Header: "YearNumber",
    accessor: "yearNumber",
  },
  {
    Header: "PeriodTypeByMonth",
    accessor: "periodTypeByMonth",
  },
  {
    Header: "StartDate",
    accessor: "startDate",
  },
    {
    Header: "EndDate",
    accessor: "endDate",
  },
];

const FinancialPeriodsRoot = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>();

  const fetchFinancialPeriods = async () => {
    try {
      const response = await getFinancialPeriods();
      setData(response);
    } catch (error) {
      console.error('Error fetching financial periods:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    fetchFinancialPeriods();
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
            <FinancialPeriodsForm
              id={selectedId ?? ""}
              handleCloseForm={handleCloseForm}
              formType={formType}
              afterAction={() => fetchFinancialPeriods()}
              isStartDateDisabled = {data  && data.result}
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
              title={t("FinancialPeriods")}
              btn
              addBtn
              showEditButtonIf={(e : FinancialPeriodModel)=> e.isEditable?? false}
              showDeleteButtonIf={(e : FinancialPeriodModel)=> e.isDeletable?? false}
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

export default FinancialPeriodsRoot;
