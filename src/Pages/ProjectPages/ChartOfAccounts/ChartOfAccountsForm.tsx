import { useEffect, useState } from 'react';
import { useDeleteChartOfAcountByIdMutation, useGetChartOfAccountsByIdQuery } from '../../../Apis/ChartOfAccountsApi';
import BaseForm from '../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../interfaces/ApiResponse';
import { toastify } from '../../../Helper/toastify';
import { AccountNatureOptions, ChartOfAccountModel } from '../../../interfaces/ProjectInterfaces';
import { FormControlLabel, Switch, TextField } from '@mui/material';
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
    if (!chartOfAccountResult.isLoading) {
      setModel(chartOfAccountResult.data.result);
      setIsLoading(false);
    }
  }, [chartOfAccountResult.isLoading, chartOfAccountResult?.data?.result]);

  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteChartOfAccount(id);
    if(response.data){
      
      return true;
    }
    else {
      console.log(response);

      response.error?.data?.errorMessages?.map((error :string) =>{
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
        handleCloseForm={handleCloseForm}
        handleAdd={handleDelete}
        handleUpdate={handleDelete}
        handleDelete={handleDelete}
        isModal={true}
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
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  name: event.target.value,
                                }
                              : prevModel
                          )
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
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  nameSecondLanguage: event.target.value,
                                }
                              : prevModel
                          )
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
                        onChange={() => console.log("changed AccountNature")}
                        name={"AccountNature"}
                        onBlur={null}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <InputAutoComplete
                        options={accountGuidesResult.data.result.map(
                          (item: { name: string; id: string }) => ({
                            label: item.name,
                            value: item.id,
                          })
                        )}
                        label={"Account Guide"}
                        value={
                          accountGuidesResult?.data?.result
                            ?.map((item: { name: string; id: string }) => ({
                              label: item.name,
                              value: item.id,
                            }))
                            ?.find(
                              (e: { value: string }) =>
                                e.value === model?.accountGuidId
                            ) || null
                        }
                        disabled={formType === FormTypes.Details}
                        onChange={() => console.log("idChanged")}
                        multiple={false}
                        name={"AccountGuide"}
                        handleBlur={null}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col col-md-6">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={model?.isPostedAccount}
                            disabled={formType === FormTypes.Details}
                            onChange={({ target }) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      isPostedAccount: target.checked,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        }
                        label="isPostedAccount"
                      />
                    </div>
                    <div className="col col-md-6">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={model?.isActiveAccount}
                            disabled={formType === FormTypes.Details}
                            onChange={({ target }) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      isActiveAccount: target.checked,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        }
                        label="isActiveAccount"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col col-md-6">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={model?.isStopDealing}
                            disabled={formType === FormTypes.Details}
                            onChange={({ target }) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      isStopDealing: target.checked,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        }
                        label="IsStopDealing"
                      />
                    </div>
                    <div className="col col-md-6">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={model?.isDepreciable}
                            disabled={formType === FormTypes.Details}
                            onChange={({ target }) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      isDepreciable: target.checked,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        }
                        label="isDepreciable"
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

export default ChartOfAccountsForm;
