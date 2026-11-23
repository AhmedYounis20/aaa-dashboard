import FinancialPeriodsForm from "./FinancialPeriodsForm";
import { useTranslation } from "react-i18next";
import Loader from "@/Components/Loader";
import { AppContent } from "@/Components";
import FinancialPeriodModel from "@/interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel";
import { FinancialPeriodType } from "@/interfaces/ProjectInterfaces/Account/Entries/financialPeriodTypes";
import { getEnumString } from "@/Helper/enumHelper";
import { useEntityListPage, useFinancialPeriodsList } from "@/hooks/queries";

const FinancialPeriodsRoot = () => {
  const { t } = useTranslation();
  const {
    showForm,
    formType,
    selectedId,
    setFormType,
    handleShowForm,
    handleCloseForm,
    handleSelectId,
    openAdd,
  } = useEntityListPage();

  const { data = [], isLoading, isFetching, isError, refetch } = useFinancialPeriodsList();

  const columns = [
    { Header: "YearNumber", accessor: "yearNumber" },
    {
      Header: "PeriodTypeByMonth",
      accessor: "periodTypeByMonth",
      Cell: ({ value }: { value: FinancialPeriodType }) =>
        getEnumString(FinancialPeriodType, value),
    },
    { Header: "StartDate", accessor: "startDate" },
    { Header: "EndDate", accessor: "endDate" },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full">
      {showForm && (
        <FinancialPeriodsForm
          id={selectedId}
          handleCloseForm={handleCloseForm}
          formType={formType}
          afterAction={() => void refetch()}
          isStartDateDisabled={data.length > 0}
        />
      )}
      <AppContent
        tableType="table"
        data={data}
        title={t("FinancialPeriods")}
        columns={columns}
        handleShowForm={handleShowForm}
        changeFormType={setFormType}
        handleSelectId={handleSelectId}
        btn
        addBtn
        showEditButtonIf={(e: FinancialPeriodModel) => e.isEditable ?? false}
        showDeleteButtonIf={(e: FinancialPeriodModel) => e.isDeletable ?? false}
        actionBtn={openAdd}
        btnName={t("New")}
        startIcon
        loading={isFetching}
        isError={isError}
        onRetry={() => void refetch()}
        onRefresh={() => void refetch()}
      />
    </div>
  );
};

export default FinancialPeriodsRoot;
