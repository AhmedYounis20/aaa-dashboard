import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import {
  useGetFinancialPeriodsByIdQuery,
  useUpdateFinancialPeriodMutation,
  useCreateFinancialPeriodMutation,
} from "../../../../../Apis/Account/FinancialPeriodsApi";
import FinancialPeriodModel from "../../../../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodModel";
import dayjs from "dayjs";
import { financialPeriodOptions, FinancialPeriodType } from "../../../../../interfaces/ProjectInterfaces/Account/FinancialPeriods/FinancialPeriodType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import { ApiResponse } from "../../../../../interfaces/ApiResponse";
import { toastify } from "../../../../../Helper/toastify";
import InputDateTimePicker from "../../../../../Components/Inputs/InputDateTime";
import InputText from "../../../../../Components/Inputs/InputText";
import { useTranslation } from "react-i18next";

const FinancialPeriodsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const { t } = useTranslation();
  const accountGuidesResult = useGetFinancialPeriodsByIdQuery(id);
  const [model, setModel] = useState<FinancialPeriodModel | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [update] = useUpdateFinancialPeriodMutation();
  const [create] = useCreateFinancialPeriodMutation();
  useEffect(() => {
    if (!accountGuidesResult.isLoading) {
      setModel(accountGuidesResult.data.result);
      setIsLoading(false);
    }
  }, [accountGuidesResult.isLoading,accountGuidesResult]);

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

  const handleUpdate = async () => {
    if (model) {
      const response: ApiResponse = await update(model);
      if (response.data) {
        toastify(response.data.successMessage);
        return true;
      } else if (response.error) {
        toastify(response.error.data.errorMessages[0], "error");
        return false;
      }
    }
    return false;
  };

  const handleCreate = async () => {
    if (model) {
      const response: ApiResponse = await create(model);
      if (response.data) {
        toastify(response.data.successMessage);
        return true;
      } else if (response.error) {
        toastify(response.error.data.errorMessages[0], "error");
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
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputSelect
                        error={undefined}
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
                      </div>
                    )}
                    <div className="col col-md-6">
                      <InputDateTimePicker
                        label={t("EndDate")}
                        type="datetime"
                        value={model?.endDate ?? null}
                        disabled
                      />
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
