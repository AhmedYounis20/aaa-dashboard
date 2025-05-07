import { useEffect, useState } from "react";
import BaseForm from "../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../interfaces/Components/FormType";
import { TextField } from "@mui/material";
import {
  useGetFinancialPeriodsByIdQuery,
  useUpdateFinancialPeriodMutation,
  useCreateFinancialPeriodMutation,
} from "../../../../Apis/FinancialPeriodsApi";
import FinancialPeriodModel from "../../../../interfaces/ProjectInterfaces/FinancialPeriods/FinancialPeriodModel";
import dayjs from "dayjs";
import { financialPeriodOptions, FinancialPeriodType } from "../../../../interfaces/ProjectInterfaces/FinancialPeriods/FinancialPeriodType";
import InputSelect from "../../../../Components/Inputs/InputSelect";
import { ApiResponse } from "../../../../interfaces/ApiResponse";
import { toastify } from "../../../../Helper/toastify";
import InputDateTimePicker from "../../../../Components/Inputs/InputDateTime";

const FinancialPeriodsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
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
                <p>Are you sure you want to delete {model?.yearNumber}?</p>
              ) : (
                <>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <TextField
                        type="text"
                        className="form-input form-control"
                        label="Year Number"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.yearNumber || ""}
                        onChange={(event) =>
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  yearNumber: event.target.value,
                                }
                              : undefined
                          )
                        }
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputSelect
                        error={undefined}
                        options={financialPeriodOptions}
                        label={"Financial Period Type In Months"}
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
                          label="Start Date"
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
                        label="End Date"
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
