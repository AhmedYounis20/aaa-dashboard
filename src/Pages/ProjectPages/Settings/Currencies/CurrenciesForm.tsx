import { useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { FormControl, FormControlLabel, FormHelperText, Switch, TextField } from '@mui/material';
import { useCreateCurrencyMutation, useDeleteCurrencyMutation, useGetCurrenciesByIdQuery, useUpdateCurrencyMutation } from '../../../../Apis/CurrenciesApi';
import CurrencyModel from '../../../../interfaces/ProjectInterfaces/Currencies/CurrencyModel';
import { ApiResponse } from '../../../../interfaces/ApiResponse';
import { toastify } from '../../../../Helper/toastify';
import { CurrencySchema } from '../../../../interfaces/ProjectInterfaces/Currencies/currency-validation';
import yup from 'yup';
import InputText from '../../../../Components/Inputs/InputText';


const CurrenciesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const currencyResult = useGetCurrenciesByIdQuery(id, {
    skip: formType == FormTypes.Add
  });

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
  const [updateCurrency] = useUpdateCurrencyMutation();
  const [createCurrency] = useCreateCurrencyMutation();
  const [deleteCurrency] = useDeleteCurrencyMutation();
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (formType != FormTypes.Add && !isUpdated) {
      if (!currencyResult.isLoading) {
        setModel(currencyResult?.data?.result);
        setIsLoading(false);
      }
    }
  }, [currencyResult.isLoading, currencyResult, formType, isUpdated]);

  const validate = async () => {
    try {
      await CurrencySchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as yup.ValidationError).inner.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteCurrency(id);
    if (response.data) {
      toastify(response.data.successMessage);
      return true;
    }
    else {
      console.log(response);
      response.error?.data?.errorMessages?.map((error: string) => {
        toastify(error, "error");
        console.log(error);
      }
      );
      return false;
    }
  };

  const handleUpdate = async () => {
    if (await validate() === false) return false;

    const response: ApiResponse = await updateCurrency(model);
    setIsUpdated(true);
    if (response.data) {
      toastify(response.data.successMessage);
      return true;
    } else if (response.error) {
      toastify(response.error.data.errorMessages[0], "error");
      return false;
    }
    return false;
  };

  const handleAdd = async () => {
    if (await validate() === false) return false;

    const response: ApiResponse = await createCurrency(model);
    if (response.data) {
      toastify(response.data.successMessage);
      console.log(response);
      return true;
    } else if (response.error) {
      toastify(response.error.data.errorMessages[0], "error");
      return false;
    }
    return false;

  };

  useEffect(() => {
    console.log(errors);
  }, [errors])


  return (
    <div className="h-full">
      <BaseForm
        formType={formType}
        isModal
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        handleCloseForm={handleCloseForm}
        handleUpdate={handleUpdate}
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
                <p>are you sure, you want delete {model?.nameSecondLanguage}</p>
              ) : (
                <>
                  <div className="row mb-4">
                    <div className="col col-md-6">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label="Name (required)"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(value) =>
                          setModel({ ...model, name: value })
                        }
                        error={!!errors.name}
                        helperText={errors.name}
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label="Name Second Language (required)"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.nameSecondLanguage}
                        onChange={(value) =>
                          setModel({
                            ...model,
                            nameSecondLanguage: value,
                          })
                        }
                        error={!!errors.nameSecondLanguage}
                        helperText={errors.nameSecondLanguage}
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col col-md-6">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label="Symbol (required)"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.symbol}
                        onChange={(value) =>
                          setModel((prevModel) =>
                            prevModel
                              ? { ...prevModel, symbol: value }
                              : prevModel
                          )
                        }
                        error={!!errors.symbol}
                        helperText={errors.symbol}
                      />
                    </div>
                    <div className="col col-md-6">
                      <TextField
                        type="number"
                        className="form-input form-control"
                        label="Exchange Rate (required)"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.exchangeRate}
                        onChange={(event) =>
                          setModel({
                            ...model,
                            exchangeRate: Number.parseFloat(event.target.value || '0'),
                          })
                        }
                        error={!!errors.exchangeRate}
                        helperText={errors.exchangeRate}
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
                          label="Is Default"
                        />
                        {errors.isDefault && <FormHelperText>{errors.isDefault}</FormHelperText>}
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
                          label="Is Active"
                        />
                        {errors.isActive && <FormHelperText>{errors.isActive}</FormHelperText>}
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