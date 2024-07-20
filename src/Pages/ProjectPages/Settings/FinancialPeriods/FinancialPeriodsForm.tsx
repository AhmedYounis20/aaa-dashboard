import { useEffect, useState } from "react";
import BaseForm from "../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../interfaces/Components/FormType";
import { TextField } from "@mui/material";
import { useGetFinancialPeriodsByIdQuery, useUpdateFinancialPeriodMutation } from "../../../../Apis/FinancialPeriodsApi";
import FinancialPeriodModel from "../../../../interfaces/ProjectInterfaces/FinancialPeriods/FinancialPeriodModel";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { financialPeriodOptions, FinancialPeriodType } from "../../../../interfaces/ProjectInterfaces/FinancialPeriods/financialPeriodTypes";
import InputSelect from "../../../../Components/Inputs/InputSelect";
import { ApiResponse } from "../../../../interfaces/ApiResponse";
import { toastify } from "../../../../Helper/toastify";

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
        prevModel ? { ...prevModel, endDate: newEndDate } : undefined
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
  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleUpdate={handleUpdate}
        handleAdd={undefined}
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
                    <div className="col col-md-6">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["DateTimePicker", "DateTimePicker"]}
                        >
                          <DateTimePicker
                            label="Start Date"
                            viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                            }}
                            value={
                              model?.startDate ? dayjs(model.startDate) : null
                            }
                            onChange={(value) => {
                              if (value) {
                                setModel((prevModel) =>
                                  prevModel
                                    ? {
                                        ...prevModel,
                                        startDate: value.toDate(), // Ensure startDate is a Date
                                      }
                                    : prevModel
                                );
                              }
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                    <div className="col col-md-6">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["DateTimePicker", "DateTimePicker"]}
                        >
                          <DateTimePicker
                            label="End Date"
                            viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                            }}
                            value={model?.endDate ? dayjs(model.endDate) : null}
                            disabled
                          />
                        </DemoContainer>
                      </LocalizationProvider>
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
