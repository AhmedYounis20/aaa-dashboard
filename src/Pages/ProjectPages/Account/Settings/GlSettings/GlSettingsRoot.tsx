import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import GlSettingsModel from "../../../../../interfaces/ProjectInterfaces/Account/GlSettings/GlSettingsModel";
import { DecimalDigitsNumberOptions } from "../../../../../interfaces/ProjectInterfaces/Account/GlSettings/DecimalDigitsNumber";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import DepreciationApplication, {
  DepreciationApplicationOptions,
} from "../../../../../interfaces/ProjectInterfaces/Account/GlSettings/DepreciationApplication";
import Loader from "../../../../../Components/Loader";
import { ErrorState } from "../../../../../Components/feedback";
import { GLSettingsSchema } from "../../../../../interfaces/ProjectInterfaces/Account/GlSettings/validation-GLSettings";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import { useTranslation } from "react-i18next";
import { handleValidationErrors } from "../../../../../Helper/validationHelper";
import { useGlSettings, useGlSettingsMutation } from "../../../../../hooks/queries";

const GlSettingsRoot: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [model, setModel] = useState<GlSettingsModel>();
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useGlSettings();
  const updateMutation = useGlSettingsMutation();

  useEffect(() => {
    if (data) setModel(data);
  }, [data]);

  const validate = async () => {
    try {
      await GLSettingsSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      setErrors(handleValidationErrors(validationErrors));
      return false;
    }
  };

  const handleUpdate = async () => {
    if (isError || !model) return false;
    if ((await validate()) === false) return false;
    try {
      const payload = await updateMutation.mutateAsync(model);
      setModel(payload.data);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="h-full">
      <BaseForm
        formType={FormTypes.Edit}
        isModal={false}
        handleUpdate={isError ? undefined : handleUpdate}
        handleAdd={undefined}
        handleDelete={undefined}
        handleCloseForm={() => void refetch()}
      >
        <div>
          <Typography variant="h2" mb={3}>
            {" "}
            {t("GlSettings")}
          </Typography>
          <div>
            {isLoading ? (
              <Loader />
            ) : isError ? (
              <ErrorState onRetry={() => void refetch()} />
            ) : (
              <div>
                <Stack spacing={2}>
                  <div>
                    <InputSelect
                      options={DecimalDigitsNumberOptions}
                      label={t("DecimalDigitsNumber")}
                      defaultValue={model?.decimalDigitsNumber}
                      multiple={false}
                      onChange={({ target }: { target: { value: number } }) => {
                        setModel((prevModel) =>
                          prevModel
                            ? {
                                ...prevModel,
                                decimalDigitsNumber: target.value,
                              }
                            : undefined
                        );
                      }}
                      name={"DecimalDigitsNumber"}
                      onBlur={undefined}
                      error={errors.decimalDigitsNumber}
                      //helperText={t(errors.decimalDigitsNumber)}
                    />
                  </div>
                  <div>
                    <div>
                      <InputSelect
                        options={DepreciationApplicationOptions.map((e) => ({
                          ...e,
                          label: t(e.label),
                        }))}
                        label={t("DepreciationApplication")}
                        defaultValue={model?.depreciationApplication}
                        multiple={false}
                        onChange={({ target }: { target: { value: DepreciationApplication } }) => {
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  depreciationApplication: target.value,
                                }
                              : undefined
                          );
                        }}
                        name={"DepreciationApplication"}
                        onBlur={undefined}
                        error={!!errors.depreciationApplication}
                        // helperText={errors.depreciationApplication}
                      />
                    </div>
                    {/* <div className="col col-md-6"></div> */}
                  </div>
                  {model?.depreciationApplication == DepreciationApplication.Monthly && (
                    <div>
                      <InputNumber
                        className="form-input form-control"
                        label={t("MonthDays")}
                        variant="outlined"
                        isRequired
                        fullWidth
                        value={model?.monthDays}
                        onChange={(value) =>
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  monthDays: Number.parseInt(value.toString()),
                                }
                              : prevModel
                          )
                        }
                        error={!!errors.monthDays}
                        helperText={t(errors.monthDays)}
                      />
                    </div>
                  )}
                </Stack>
                <div>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={model?.isAllowingEditVoucher}
                          onChange={({ target }: { target: { checked: boolean } }) =>
                            setModel((prevModel) =>
                              prevModel
                                ? {
                                    ...prevModel,
                                    isAllowingEditVoucher: target.checked,
                                  }
                                : prevModel
                            )
                          }
                        />
                      }
                      label={t("IsAllowingEditVoucher")}
                    />
                  </div>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={model?.isAllowingNegativeBalances}
                          onChange={({ target }: { target: { checked: boolean } }) =>
                            setModel((prevModel) =>
                              prevModel
                                ? {
                                    ...prevModel,
                                    isAllowingNegativeBalances: target.checked,
                                  }
                                : prevModel
                            )
                          }
                        />
                      }
                      label={t("IsAllowingNegativeBalances")}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={model?.isAllowingDeleteVoucher}
                          onChange={({ target }: { target: { checked: boolean } }) =>
                            setModel((prevModel) =>
                              prevModel
                                ? {
                                    ...prevModel,
                                    isAllowingDeleteVoucher: target.checked,
                                  }
                                : prevModel
                            )
                          }
                        />
                      }
                      label={t("IsAllowingDeleteVoucher")}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </BaseForm>
    </div>
  );
};

export default GlSettingsRoot;
