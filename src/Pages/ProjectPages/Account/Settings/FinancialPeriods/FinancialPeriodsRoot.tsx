import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AppContent } from '../../../../../Components';
import { FormTypes } from '../../../../../interfaces/Components';
import FinancialPeriodsForm from './FinancialPeriodsForm';
import { useGetFinancialPeriodsQuery } from "../../../../../Apis/Account/FinancialPeriodsApi";
import Loader from '../../../../../Components/Loader';

const FinancialPeriodsRoot = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormTypes>(FormTypes.Add);
  const [selectedId, setSelectedId] = useState<string>("");
  const { data, isLoading } = useGetFinancialPeriodsQuery(null);
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
              id={selectedId}
              handleCloseForm={handleCloseForm}
              formType={formType}
            />
          )}
          {data?.result && (
            <AppContent
              tableType="table"
              data={data.result}
              title={t("FinancialPeriods")}
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

export default FinancialPeriodsRoot;
