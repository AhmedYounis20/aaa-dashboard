import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import {
  getFinancialPeriodById,
  updateFinancialPeriod,
  createFinancialPeriod,
  getDefaultFinancialPeriodData,
  deleteFinancialPeriod,
} from "../../../../../Apis/Account/FinancialPeriodsApi";
import FinancialPeriodModel from "../../../../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel";
import dayjs from "dayjs";
import { financialPeriodOptions, FinancialPeriodType } from "../../../../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import InputDateTimePicker from "../../../../../Components/Inputs/InputDateTime";
import InputText from "../../../../../Components/Inputs/InputText";
import { useTranslation } from "react-i18next";
import { FinancialPeriodSchema } from "../../../../../interfaces/ProjectInterfaces/Account/FinancialPeriods/validation-financialPeriod";

const FinancialPeriodsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction?: () => void;
  isStartDateDisabled : boolean;
}> = ({ formType, id, handleCloseForm, afterAction,isStartDateDisabled}) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<FinancialPeriodModel | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchFinancialPeriod = async () => {
      if (formType !== FormTypes.Add) {
        setIsLoading(true);
        try {
          const response = await getFinancialPeriodById(id);
          if (response?.result) {
            setModel(response.result);
          }
        } catch (error) {
          console.error('Error fetching financial period:', error);
        } finally {
          setIsLoading(false);
        }
      }else {
        try {
          const response = await getDefaultFinancialPeriodData();
          if (response?.result) {
            setModel(response.result);
          }
          
        } catch (error) {
          console.error('Error fetching default data:', error);
        } finally{
          setIsLoading(false);
        }
      }
    };

    fetchFinancialPeriod();
  }, [formType, id]);
  useEffect(() => {
    console.log("useEffect triggered:", {
      startDate: model?.startDate,
      periodTypeByMonth: model?.periodTypeByMonth,
      hasStartDate: !!model?.startDate,
      hasPeriodType: model?.periodTypeByMonth != null
    });
    
    if (model?.startDate != null && model?.periodTypeByMonth != null) {
      console.log("Calculating end date...");
      const newEndDate = dayjs(model.startDate).add(
        model.periodTypeByMonth,
        "month"
      );
      console.log("New end date:", newEndDate.toDate());
      
      setModel((prevModel) =>
        prevModel ? { ...prevModel, endDate: newEndDate.toDate() } : undefined
      );
    } else {
      console.log("Skipping calculation - missing required values");
    }
  }, [model?.periodTypeByMonth, model?.startDate]);

  const validate = async () => {
    if (!model) return false;
    try {
      await FinancialPeriodSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as any).inner.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    if (model) {
      const response = await updateFinancialPeriod(model.id, model);
      if (response?.result) {
        afterAction && afterAction();
        return true;
      } 
    }
    return false;
  };

  const handleCreate = async () => {
    if ((await validate()) === false) return false;
    if (model) {
      const response = await createFinancialPeriod(model);
      if (response?.result) {
        afterAction && afterAction();
        return true;
      } 
    }
    return false;
  };
  
    const handleDelete = async (): Promise<boolean> => {
      const response = await deleteFinancialPeriod(id);
      if (response?.result) {
        afterAction && afterAction();
        return true;
      } else {
        return false;
      }
    };
  
  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleUpdate={handleUpdate}
        handleAdd={handleCreate}
        handleDelete={async () => await handleDelete()}
        isModal
      >
        <div>
          {isLoading ? (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "100px" }}
            >
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>{t("AreYouSureDelete")} {model?.yearNumber}?</p>
              ) : (
                <>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <InputText
                          type="text"
                          className="form-input form-control"
                          label={t("YearNumber")}
                          variant="outlined"
                          fullWidth
                          isRquired
                          disabled={formType != FormTypes.Add && !model?.isNameEditable}
                          value={model?.yearNumber ?? ""}
                          onChange={(value) =>
                            setModel((prev) =>
                              prev
                                ? { ...prev, yearNumber: value }
                                : prev
                            )
                          }
                          error={!!errors.yearNumber}
                          helperText={t(
                            errors.yearNumber
                          )}
                        />
                    </div>
                    <div className="col col-md-6">
                      <InputSelect
                        error={!!errors.periodTypeByMonth}
                        options={financialPeriodOptions.map((e) => ({
                          ...e,
                          label: t(e.label),
                        }))}
                        label={t("PeriodTypeByMonth")}
                        defaultValue={model?.periodTypeByMonth}
                        disabled={formType == FormTypes.Details}
                        multiple={false}
                        onChange={({
                          target,
                        }: {
                          target: { value: FinancialPeriodType };
                        }) => {
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  periodTypeByMonth: target.value,
                                }
                              : undefined
                          );
                        }}
                        onBlur={undefined}
                        name={"Financial Period Type In Months"}
                      />
                      {errors.periodTypeByMonth && (
                        <div className="text-danger small mt-1">{t(errors.periodTypeByMonth)}</div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <InputDateTimePicker
                        type="datetime"
                        disabled={formType !== FormTypes.Add || isStartDateDisabled}
                        label={t("StartDate")}
                        value={model?.startDate ?? null}
                        onChange={(value) => {
                          console.log("Date picker onChange:", value);
                          setModel((prevModel) =>
                            prevModel
                              ? { ...prevModel, startDate: value }
                              : prevModel
                          );
                        }}
                      required
                      />
                      {errors.startDate && (
                        <div className="text-danger small mt-1">{t(errors.startDate)}</div>
                      )}
                    </div>
                    
                    <div className="col col-md-6">
                      <InputDateTimePicker
                        label={t("EndDate")}
                        type="datetime"
                        value={model?.endDate ?? null}
                        disabled
                        required
                      />
                      {errors.endDate && (
                        <div className="text-danger small mt-1">{t(errors.endDate)}</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default FinancialPeriodsForm;
