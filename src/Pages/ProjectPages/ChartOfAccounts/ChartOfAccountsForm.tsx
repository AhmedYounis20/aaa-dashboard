import { useEffect, useState } from 'react';
import { useDeleteChartOfAcountByIdMutation, useGetChartOfAccountsByIdQuery } from '../../../Apis/ChartOfAccountsApi';
import BaseForm from '../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../interfaces/ApiResponse';
import { toastify } from '../../../Helper/toastify';
import { AccountNatureOptions, ChartOfAccountModel } from '../../../interfaces/ProjectInterfaces';
import { FormControlLabel, FormGroup, Switch, TextField } from '@mui/material';
import InputSelect from '../../../Components/Inputs/InputSelect';
import InputAutoComplete from '../../../Components/Inputs/InputAutoCompelete';
import { useGetAccountGuidesQuery } from '../../../Apis/AccountGuidesApi';

const ChartOfAccountsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({formType,id,handleCloseForm}) => {
  const [deleteChartOfAccount] = useDeleteChartOfAcountByIdMutation();
  const accountGuidesResult = useGetAccountGuidesQuery(null);
  const [model,setModel] = useState<ChartOfAccountModel>();
  const chartOfAccountResult = useGetChartOfAccountsByIdQuery(id);
  const [isLoading,setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!chartOfAccountResult.isLoading)
      { 
        setModel(chartOfAccountResult.data.result);
        setIsLoading(false);
      }
  }, [chartOfAccountResult.isLoading]);

  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteChartOfAccount(id);
    if(response.data){
      
      return true;
    }
    else {
      console.log(response);

      response.error?.data?.errorMessages?.map((error) =>{
      toastify(error, "error");
    console.log(error);
      } 
      );
      return false;
    }
  }; 

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        id={id}
        handleCloseForm={handleCloseForm}
        handleAdd={handleDelete}
        handleUpdate={handleDelete}
        handleDelete={handleDelete}
        isModal ={true}

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
                <p>
                  are you sure, you want delete {data.result.nameSecondLanguage}
                </p>
              ) : (
                <>
                  <div className="row mb-3">
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
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <TextField
                        type="text"
                        className="form-input form-control"
                        label="Code"
                        variant="outlined"
                        fullWidth
                        disabled
                        value={model?.code}
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputSelect
                        options={AccountNatureOptions}
                        label={"AccountNature"}
                        defaultValue={model?.accountNature.toString()}
                        disabled={formType === FormTypes.Details}
                        multiple={false}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <InputAutoComplete
                        options={accountGuidesResult.data.result.map(
                          (item) => ({ label: item.name, value: item.id })
                        )}
                        label={"Account Guide"}
                        defaultValue={accountGuidesResult.data.result
                          .map((item) => ({
                            label: item.name,
                            value: item.id,
                          }))
                          .find((e) => e.value === model?.accountGuidId)}
                        disabled={formType === FormTypes.Details}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col col-md-6">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={model.isPostedAccount}
                              disabled={formType === FormTypes.Details}
                              onChange={({ target }) =>
                                setModel({
                                  ...model,
                                  isPostedAccount: target.checked,
                                })
                              }
                            />
                          }
                          label="isPostedAccount"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={model.isStopDealing}
                              disabled={formType === FormTypes.Details}
                              onChange={({ target }) =>
                                setModel({
                                  ...model,
                                  isStopDealing: target.checked,
                                })
                              }
                            />
                          }
                          label="IsStopDealing"
                        />
                      </FormGroup>
                    </div>
                    <div className="col col-md-6">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={model.isActiveAccount}
                              disabled={formType === FormTypes.Details}
                              onChange={({ target }) =>
                                setModel({
                                  ...model,
                                  isActiveAccount: target.checked,
                                })
                              }
                            />
                          }
                          label="isActiveAccount"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={model.isDepreciable}
                              disabled={formType === FormTypes.Details}
                              onChange={({ target }) =>
                                setModel({
                                  ...model,
                                  isDepreciable: target.checked,
                                })
                              }
                            />
                          }
                          label="isDepreciable"
                        />
                      </FormGroup>
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

export default ChartOfAccountsForm;
