import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import {
  NodeType,
  NodeTypeOptions,
} from "../../../../../interfaces/Components/NodeType";
import { TextareaAutosize } from "@mui/material";
import { TaxInputModel } from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/TaxModel";
import {
  getTaxById,
  getDefaultTax,
  createTax,
  updateTax,
  deleteTax,
} from "../../../../../Apis/Account/TaxesApi";
import { TaxSchema } from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/validation-tax";
import { useTranslation } from "react-i18next";
import InputText from "../../../../../Components/Inputs/InputText";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import { getChartOfAccounts } from "../../../../../Apis/Account/ChartOfAccountsApi";
import { ChartOfAccountModel } from "../../../../../interfaces/ProjectInterfaces";

const TaxesForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, parentId, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<TaxInputModel>({
    name: "",
    nameSecondLanguage: "",
    id: "",
    parentId: parentId,
    nodeType: NodeType.Category,
    code: "",
    notes: "",
    percent: 0,
    chartOfAccountId: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccountModel[]>(
    [],
  );

  useEffect(() => {
    const fetchChartOfAccounts = async () => {
      const result = await getChartOfAccounts();
      if (result && result.isSuccess && result.result) {
        setChartOfAccounts(result.result);
      }
    };
    fetchChartOfAccounts();
  }, []);

  useEffect(() => {
    if (formType !== FormTypes.Add) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await getTaxById(id);
        if (result && result.result) {
          setModel({
            ...result.result,
            code: result.result.chartOfAccount?.code ?? result.result.code,
            chartOfAccountId:
              result.result.chartOfAccountId ??
              result.result.chartOfAccount?.id,
          });
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [formType, id, parentId]);

  const handleChartOfAccountSelect = async (
    chartOfAccountId: string | null,
  ) => {
    if (!chartOfAccountId) {
      setModel((prevModel) => ({
        ...prevModel,
        chartOfAccountId: undefined,
        code: "",
      }));
      return;
    }

    setModel((prevModel) => ({
      ...prevModel,
      chartOfAccountId: chartOfAccountId,
    }));
    const result = await getDefaultTax(chartOfAccountId);
    if (result && result.result) {
      setModel((prevModel) => ({
        ...prevModel,
        code: result.result.chartOfAccount?.code ?? result.result.code,
      }));
    }
  };

  const validate = async () => {
    try {
      await TaxSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as any).inner.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      console.log(validationErrorsMap);
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const response = await updateTax(model.id, model);
    if (response && response.isSuccess) {
      if (afterAction) {
        afterAction();
      }
      return true;
    }
    return false;
  };
  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createTax(model);
    if (response && response.isSuccess) {
      if (afterAction) {
        afterAction();
      }
      return true;
    }
    return false;
  };
  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteTax(id);
    if (response && response.isSuccess) {
      if (afterAction) {
        afterAction();
      }
      return true;
    }
    return false;
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleDelete={async () => await handleDelete()}
        handleUpdate={handleUpdate}
        handleAdd={handleAdd}
        isModal
      >
        <div>
          {isLoading ? (
            <div className="spinner-border text-primary" role="status"></div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>
                  {t("AreYouSureDelete")} {model?.nameSecondLanguage}
                </p>
              ) : (
                <>
                  <div className="row mb-4">
                    <div className="col col-md-6">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label={t("Name")}
                        variant="outlined"
                        fullWidth
                        isRquired
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(value) =>
                          setModel((prevModel) => ({
                            ...prevModel,
                            name: value,
                          }))
                        }
                        error={!!errors.name}
                        helperText={errors.name ? t(errors.name) : undefined}
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label={t("NameSecondLanguage")}
                        variant="outlined"
                        fullWidth
                        isRquired
                        disabled={formType === FormTypes.Details}
                        value={model?.nameSecondLanguage}
                        onChange={(value) =>
                          setModel((prevModel) => ({
                            ...prevModel,
                            nameSecondLanguage: value,
                          }))
                        }
                        error={!!errors.nameSecondLanguage}
                        helperText={
                          errors.nameSecondLanguage
                            ? t(errors.nameSecondLanguage)
                            : undefined
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col col-md-6">
                      <InputSelect
                        error={undefined}
                        options={NodeTypeOptions.map((e) => ({
                          ...e,
                          label: t(e.label),
                        }))}
                        label={t("NodeType")}
                        defaultValue={model?.nodeType}
                        disabled={formType !== FormTypes.Add}
                        multiple={false}
                        onChange={({
                          target,
                        }: {
                          target: { value: NodeType };
                        }) => {
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  nodeType: target.value,
                                }
                              : prevModel,
                          );
                          if (
                            formType === FormTypes.Add &&
                            target.value === NodeType.Category
                          ) {
                            setModel((prev) =>
                              prev
                                ? { ...prev, chartOfAccountId: undefined }
                                : prev,
                            );
                          }
                        }}
                        name={"NodeType"}
                        onBlur={undefined}
                      />
                    </div>
                  </div>
                  {model?.nodeType === NodeType.Domain && (
                    <div className="card p-4 mx-0 m-2 mt-4">
                      <p className="text-primary fw-bold mb-4">
                        {t("BasicInfo")}
                      </p>

                      <div className="row mb-4">
                        {formType === FormTypes.Add && (
                          <div className="col col-md-6">
                            <InputAutoComplete
                              options={chartOfAccounts.map((item) => ({
                                label: `${item.code} - ${item.name}`,
                                value: item.id,
                              }))}
                              label={t("ChartOfAccounts")}
                              value={model?.chartOfAccountId ?? null}
                              disabled={formType !== FormTypes.Add}
                              onChange={(value: string | null) => {
                                handleChartOfAccountSelect(value);
                              }}
                              name={"chartOfAccount"}
                              error={!!errors.chartOfAccountId}
                              helperText={
                                errors.chartOfAccountId
                                  ? t(errors.chartOfAccountId)
                                  : undefined
                              }
                            />
                          </div>
                        )}
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Code")}
                            variant="outlined"
                            fullWidth
                            disabled
                            value={model?.code}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      name: value,
                                    }
                                  : prevModel,
                              )
                            }
                          />
                        </div>
                        {formType !== FormTypes.Add && (
                          <div className="col col-md-6">
                            <InputNumber
                              label={t("Percent")}
                              value={model?.percent ?? 0}
                              onChange={(value) => {
                                setModel((prevModel) =>
                                  prevModel
                                    ? { ...prevModel, percent: value }
                                    : prevModel,
                                );
                              }}
                              inputType="percent"
                              error={!!errors.percent}
                              helperText={
                                errors.percent ? t(errors.percent) : undefined
                              }
                              disabled={formType === FormTypes.Details}
                              precision={2}
                            />
                          </div>
                        )}
                      </div>

                      <div className="row mb-4">
                        {formType === FormTypes.Add && (
                          <div className="col col-md-6">
                            <InputNumber
                              label={t("Percent")}
                              value={model?.percent ?? 0}
                              onChange={(value) => {
                                setModel((prevModel) =>
                                  prevModel
                                    ? { ...prevModel, percent: value }
                                    : prevModel,
                                );
                              }}
                              inputType="percent"
                              error={!!errors.percent}
                              helperText={
                                errors.percent ? t(errors.percent) : undefined
                              }
                            />
                          </div>
                        )}
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <label className="form-label"> {t("Notes")}</label>
                          <TextareaAutosize
                            className="form-input form-control"
                            disabled={formType === FormTypes.Details}
                            value={model?.notes}
                            aria-label={t("Notes")}
                            onChange={(event) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      notes: event.target.value,
                                    }
                                  : prevModel,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default TaxesForm;
