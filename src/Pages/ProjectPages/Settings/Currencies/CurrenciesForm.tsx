import { useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { AccountGuideModel } from '../../../../interfaces/ProjectInterfaces';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import { useGetCurrenciesByIdQuery } from '../../../../Apis/CurrenciesApi';
import CurrencyModel from '../../../../interfaces/ProjectInterfaces/Currencies/CurrencyModel';


const CurrenciesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const currencyResult = useGetCurrenciesByIdQuery(id);
  const [model, setModel] = useState<CurrencyModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!currencyResult.isLoading) {
      setModel(currencyResult.data.result);
      setIsLoading(false);
    }
  }, [currencyResult.isLoading]);

  // const handleDelete = async (): Promise<boolean> => {
  //   const response: ApiResponse = await deleteChartOfAccount(id);
  //   if(response.data){

  //     return true;
  //   }
  //   else {
  //     console.log(response);

  //     response.error?.data?.errorMessages?.map((error) =>{
  //     toastify(error, "error");
  //   console.log(error);
  //     }
  //     );
  //     return false;
  //   }
  // };

  return (
    <div className="h-full">
      <BaseForm formType={formType} id={id} handleCloseForm={handleCloseForm}>
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
