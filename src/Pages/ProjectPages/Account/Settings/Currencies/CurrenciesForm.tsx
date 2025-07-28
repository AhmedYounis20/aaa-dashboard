import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import BaseForm from '../../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../../interfaces/Components/FormType';
import { FormControl, FormControlLabel, FormHelperText, Switch } from '@mui/material';
import CurrencyModel from '../../../../../interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel';
import { CurrencySchema } from '../../../../../interfaces/ProjectInterfaces/Account/Currencies/currency-validation';
import InputText from '../../../../../Components/Inputs/InputText';
import InputNumber from '../../../../../Components/Inputs/InputNumber';
import { getCurrencyById, createCurrency, updateCurrency, deleteCurrency } from '../../../../../Apis/Account/CurrenciesApi';

const CurrenciesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<CurrencyModel>({
    id: id,
    name: "",
    nameSecondLanguage: "",
    exchangeRate: 0,
    isActive: true,
    isDefault: false,
    symbol: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
  const [isUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (formType !== FormTypes.Add && !isUpdated) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await getCurrencyById(id);
        if (result && result.result) {
          setModel(result.result);
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [formType, id, isUpdated]);

  const validate = async () => {
    try {
      await CurrencySchema.validate(model, { abortEarly: false });
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
    const response = await updateCurrency(model.id, model);
    if (response && response.isSuccess) {
      if (afterAction) afterAction();
      return true;
    }
    return false;
  };
  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createCurrency(model);
    if (response && response.isSuccess) {
      if (afterAction) afterAction();
      return true;
    }
    return false;
  };
  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteCurrency(id);
    if (response && response.isSuccess) {
      if (afterAction) afterAction();
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
                <p>{t("AreYouSureDelete")} {model?.nameSecondLanguage}</p>
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
                        onChange={(value) => setModel((prevModel) => ({ ...prevModel, name: value }))}
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
                        onChange={(value) => setModel((prevModel) => ({ ...prevModel, nameSecondLanguage: value }))}
                        error={!!errors.nameSecondLanguage}
                        helperText={errors.nameSecondLanguage ? t(errors.nameSecondLanguage) : undefined}
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
                        onChange={(value) => setModel((prevModel) => ({ ...prevModel, symbol: value }))}
                        error={!!errors.symbol}
                        helperText={errors.symbol ? t(errors.symbol) : undefined}
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputNumber
                        className="form-input form-control"
                        label={t("ExchangeRate")}
                        isRquired
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.exchangeRate}
                        onChange={(value) => setModel((prevModel) => ({ ...prevModel, exchangeRate: value }))}
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
                              disabled={formType == FormTypes.Details}
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
                              disabled={formType == FormTypes.Details}
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
