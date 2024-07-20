import { useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import { useCreateCurrencyMutation, useDeleteCurrencyMutation, useGetCurrenciesByIdQuery, useUpdateCurrencyMutation } from '../../../../Apis/CurrenciesApi';
import CurrencyModel from '../../../../interfaces/ProjectInterfaces/Currencies/CurrencyModel';
import { ApiResponse } from '../../../../interfaces/ApiResponse';
import { toastify } from '../../../../Helper/toastify';
const CurrenciesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const currencyResult = useGetCurrenciesByIdQuery(id,{
    skip : formType == FormTypes.Add
  });

  const [model, setModel] = useState<CurrencyModel>({
    id:id,
    name:"",
    nameSecondLanguage:"",
    exchangeRate:0,
    isActive:false,
    isDefault:false,
    symbol:"$"
  });
  const [updateCurrency] = useUpdateCurrencyMutation();
  const [createCurrency] = useCreateCurrencyMutation();
  const [deleteCurrency] = useDeleteCurrencyMutation();
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
  useEffect(() => {
    if(formType != FormTypes.Add){
      if (!currencyResult.isLoading) {
        setModel(currencyResult?.data?.result);
        setIsLoading(false);
      }
    }
  }, [currencyResult.isLoading,currencyResult,formType]);
  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteCurrency(id);
    if(response.data){
      toastify(response.data.successMessage);
      return true;
    }
    else {
      console.log(response);
      response.error?.data?.errorMessages?.map((error : string) =>{
      toastify(error, "error");
    console.log(error);
      }
      );
      return false;
    }
  };
   const handleUpdate = async () => {
     const response: ApiResponse = await updateCurrency(model);
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
                      <TextField
                        type="text"
                        className="form-input form-control"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(event) =>
                          setModel({ ...model, name: event.target.value })
                        }
                      />
                    </div>
                    <div className="col col-md-6">
                      <TextField
                        type="text"
                        className="form-input form-control"
                        label="NameSecondLanguage"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.nameSecondLanguage}
                        onChange={(event) =>
                          setModel({
                            ...model,
                            nameSecondLanguage: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col col-md-6">
                      <TextField
                        type="text"
                        className="form-input form-control"
                        label="Symbol"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.symbol}
                        onChange={(event) =>
                          setModel({ ...model, symbol: event.target.value })
                        }
                      />
                    </div>
                    <div className="col col-md-6">
                      <TextField
                        type="number"
                        className="form-input form-control"
                        label="Exchange Rate"
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.exchangeRate}
                        onChange={(event) =>
                          setModel({
                            ...model,
                            exchangeRate: Number.parseFloat(event.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col col-md-6">
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
                        label="Is Default"
                      />
                    </div>
                    <div className="col col-md-6">
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
                        label="Is Active"
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

export default CurrenciesForm;