import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { FormControl, FormControlLabel, FormHelperText, Switch } from "@mui/material";
import CurrencyModel from "../../../../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import { CurrencySchema } from "../../../../../interfaces/ProjectInterfaces/Account/Currencies/currency-validation";
import InputText from "../../../../../Components/Inputs/InputText";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import Loader from "../../../../../Components/Loader";
import { ErrorState } from "../../../../../Components/feedback";
import { useCurrencyDetail, useCurrencyMutations } from "../../../../../hooks/queries";
import { localizedEntityName } from "../../../../../Helper/localizedEntityName";

const defaultModel: CurrencyModel = {
  id: "",
  name: "",
  nameSecondLanguage: "",
  exchangeRate: 0,
  isActive: true,
  isDefault: false,
  symbol: "",
};

const CurrenciesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  title?: string;
}> = ({ formType, id, handleCloseForm, title }) => {
  const { t, i18n } = useTranslation();
  const [model, setModel] = useState<CurrencyModel>({ ...defaultModel, id });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: fetchedModel,
    isLoading: isDetailLoading,
    isError,
    refetch,
  } = useCurrencyDetail(id, formType);
  const { createMutation, updateMutation, deleteMutation } = useCurrencyMutations();

  useEffect(() => {
    if (fetchedModel) {
      setModel(fetchedModel);
    }
  }, [fetchedModel]);

  useEffect(() => {
    if (formType === FormTypes.Add) {
      setModel({ ...defaultModel });
    }
  }, [formType]);

  const isLoading = formType !== FormTypes.Add && isDetailLoading;
  const isDetailError = formType !== FormTypes.Add && isError;

  const validate = async () => {
    try {
      await CurrencySchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as { inner: { path?: string; message: string }[] }).inner.forEach(
        (error) => {
          if (error.path) validationErrorsMap[error.path] = error.message;
        }
      );
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const handleUpdate = async () => {
    if (isDetailError) return false;
    if ((await validate()) === false) return false;
    try {
      await updateMutation.mutateAsync({ id: model.id, data: model });
      return true;
    } catch {
      return false;
    }
  };

  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    try {
      await createMutation.mutateAsync(model);
      return true;
    } catch {
      return false;
    }
  };

  const handleDelete = async (): Promise<boolean> => {
    if (isDetailError) return false;
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        handleAdd={handleAdd}
        title={title}
        isModal
      >
        <div>
          {isLoading ? (
            <Loader />
          ) : isDetailError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>
                  {t("AreYouSureDelete")} {localizedEntityName(model, i18n.language)}
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
                        isRequired
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(value) =>
                          setModel((prevModel) => ({ ...prevModel, name: value }))
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
                        isRequired
                        disabled={formType === FormTypes.Details}
                        value={model?.nameSecondLanguage}
                        onChange={(value) =>
                          setModel((prevModel) => ({ ...prevModel, nameSecondLanguage: value }))
                        }
                        error={!!errors.nameSecondLanguage}
                        helperText={
                          errors.nameSecondLanguage ? t(errors.nameSecondLanguage) : undefined
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col col-md-6">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label={t("Symbol")}
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.symbol}
                        onChange={(value) =>
                          setModel((prevModel) => ({ ...prevModel, symbol: value }))
                        }
                        error={!!errors.symbol}
                        helperText={errors.symbol ? t(errors.symbol) : undefined}
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputNumber
                        className="form-input form-control"
                        label={t("ExchangeRate")}
                        isRequired
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.exchangeRate}
                        onChange={(value) =>
                          setModel((prevModel) => ({ ...prevModel, exchangeRate: value }))
                        }
                        error={!!errors.exchangeRate}
                        helperText={errors.exchangeRate ? t(errors.exchangeRate) : undefined}
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col col-md-6">
                      <FormControl error={!!errors.isDefault}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={model?.isDefault}
                              disabled={formType === FormTypes.Details}
                              onChange={({ target }) =>
                                setModel({
                                  ...model,
                                  isDefault: target.checked,
                                })
                              }
                            />
                          }
                          label={t("IsDefault")}
                        />
                        {errors.isDefault && <FormHelperText>{t(errors.isDefault)}</FormHelperText>}
                      </FormControl>
                    </div>
                    <div className="col col-md-6">
                      <FormControl error={!!errors.isActive}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={model?.isActive}
                              disabled={formType === FormTypes.Details}
                              onChange={({ target }) =>
                                setModel({
                                  ...model,
                                  isActive: target.checked,
                                })
                              }
                            />
                          }
                          label={t("IsActive")}
                        />
                        {errors.isActive && <FormHelperText>{t(errors.isActive)}</FormHelperText>}
                      </FormControl>
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

export default CurrenciesForm;
