import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import {
  getFinancialPeriodById,
  updateFinancialPeriod,
  createFinancialPeriod,
} from "../../../../../Apis/Account/FinancialPeriodsApi";
import FinancialPeriodModel from "../../../../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel";
import dayjs from "dayjs";
import { financialPeriodOptions, FinancialPeriodType } from "../../../../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import { toastify } from "../../../../../Helper/toastify";
import InputDateTimePicker from "../../../../../Components/Inputs/InputDateTime";
import InputText from "../../../../../Components/Inputs/InputText";
import { useTranslation } from "react-i18next";
import { FinancialPeriodSchema } from "../../../../../interfaces/ProjectInterfaces/Account/FinancialPeriods/validation-financialPeriod";

const FinancialPeriodsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
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
      } else {
        setIsLoading(false);
      }
    };

    fetchFinancialPeriod();
  }, [formType, id]);

  useEffect(() => {
    if (model?.startDate && model?.periodTypeByMonth) {
      const newEndDate = dayjs(model.startDate).add(
        model.periodTypeByMonth,
        "month"
      );
      setModel((prevModel) =>
        prevModel ? { ...prevModel, endDate: newEndDate.toDate() } : undefined
      );
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
        toastify(response.successMessage);
        afterAction && afterAction();
        return true;
      } else if (response?.errorMessages) {
        toastify(response.errorMessages[0], "error");
        return false;
      }
    }
    return false;
  };

  const handleCreate = async () => {
    if ((await validate()) === false) return false;
    if (model) {
      const response = await createFinancialPeriod(model);
      if (response?.result) {
        toastify(response.successMessage);
        afterAction && afterAction();
        return true;
      } else if (response?.errorMessages) {
        toastify(response.errorMessages[0], "error");
        return false;
      }
    }
    return false;
  };
  
  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleUpdate={handleUpdate}
        handleAdd={handleCreate}
        handleDelete={undefined}
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
                        disabled={formType === FormTypes.Details}
                        value={model?.yearNumber || ""}
                        onChange={(value) =>
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  yearNumber: value,
                                }
                              : undefined
                          )
                        }
                        error={!!errors.yearNumber}
                        helperText={errors.yearNumber ? t(errors.yearNumber) : undefined}
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputSelect
                        error={!!errors.periodTypeByMonth}
                        options={financialPeriodOptions.map((e) => ({
                          ...e,
                          label: t(e.label),
                        }))}
                        label={t("FinancialPeriods")}
                        defaultValue={model?.periodTypeByMonth}
                        disabled={formType === FormTypes.Details}
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
                    {formType != FormTypes.Details && (
                      <div className="col col-md-6">
                        <InputDateTimePicker
                          type="datetime"
                          label={t("StartDate")}
                          value={model?.startDate ?? null}
                          onChange={(value) => {
                            if (value) {
                              setModel((prevModel) =>
                                prevModel
                                  ? { ...prevModel, startDate: value }
                                  : prevModel
                              );
                            }
                          }}
                        />
                        {errors.startDate && (
                          <div className="text-danger small mt-1">{t(errors.startDate)}</div>
                        )}
                      </div>
                    )}
                    <div className="col col-md-6">
                      <InputDateTimePicker
                        label={t("EndDate")}
                        type="datetime"
                        value={model?.endDate ?? null}
                        disabled
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
