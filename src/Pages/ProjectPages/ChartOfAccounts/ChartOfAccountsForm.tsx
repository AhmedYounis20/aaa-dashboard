import { useEffect, useState } from 'react';
import { useCreateChartOfAccountMutation, useDeleteChartOfAcountByIdMutation, useGetChartOfAccountsByIdQuery, useGetDefaultChartOfAccountQuery, useUpdateChartOfAccountMutation } from '../../../Apis/ChartOfAccountsApi';
import BaseForm from '../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../interfaces/ApiResponse';
import { toastify } from '../../../Helper/toastify';
import { AccountNatureOptions, ChartOfAccountModel } from '../../../interfaces/ProjectInterfaces';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import InputSelect from '../../../Components/Inputs/InputSelect';
import InputAutoComplete from '../../../Components/Inputs/InputAutoCompelete';
import { useGetAccountGuidesQuery } from '../../../Apis/AccountGuidesApi';
import { AccountNature } from '../../../interfaces/ProjectInterfaces/ChartOfAccount/AccountNature';
import Loader from '../../../Components/Loader';
import updateModel from '../../../Helper/updateModelHelper';

const ChartOfAccountsForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
}> = ({formType,id,parentId,handleCloseForm}) => {
  const [deleteChartOfAccount] = useDeleteChartOfAcountByIdMutation();
  const [updateChartOfAccount] = useUpdateChartOfAccountMutation();
  const [createChartOfAccount] = useCreateChartOfAccountMutation();
  const accountGuidesResult = useGetAccountGuidesQuery(null,{
    skip : formType == FormTypes.Delete
  });
  const [model,setModel] = useState<ChartOfAccountModel>({
    accountGuidId:"",
    accountNature: AccountNature.Debit,
    id:"",
    code:"",
    isActiveAccount:false,
    isDepreciable:false,
    isStopDealing:false,
    isPostedAccount:false,
    name:"",
    nameSecondLanguage:"",
    parentId:"",
    description:""
  });
  const chartOfAccountResult = useGetChartOfAccountsByIdQuery(id,{
    skip:formType == FormTypes.Add
  });
  const defaultChartOfAccountResult = useGetDefaultChartOfAccountQuery(parentId, {
      skip: formType != FormTypes.Add,
    });
  const [isLoading,setIsLoading] = useState<boolean>(true);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);

  useEffect(() => {
    if(formType == FormTypes.Add){

      if (!defaultChartOfAccountResult.isLoading) {
        setModel(defaultChartOfAccountResult.data.result);
        setIsLoading(false);
      }
    }
     else if (!isUpdated){
          if (!chartOfAccountResult.isLoading) {
            setModel(chartOfAccountResult.data.result);
            setIsLoading(false);
          }
        }

  }, [chartOfAccountResult?.isLoading, chartOfAccountResult?.data?.result,defaultChartOfAccountResult?.isLoading,defaultChartOfAccountResult?.data?.result,formType,isUpdated]);

     const handleAdd = async () => {
       const response: ApiResponse = await createChartOfAccount(model);
       if (response.data) {
         toastify(response.data.successMessage);
         return true;
       } else if (response.error) {
         toastify(response.error.data.errorMessages[0], "error");
         return false;
       }
       return false;
     };
        const handleUpdate = async () => {
          const response: ApiResponse = await updateChartOfAccount(model);
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
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
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
                        defaultValue={model?.accountNature}
                        disabled={formType === FormTypes.Details}
                        multiple={false}
                        onChange={({
                          target,
                        }: {
                          target: { value: AccountNature };
                        }) => {
                          updateModel(setModel, "accountNature", target.value);
                        }}
                      
                        name={"AccountNature"}
                        onBlur={null}
                        error={undefined}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      {accountGuidesResult.isLoading ? (
                        <Loader />
                      ) : (
                        <InputAutoComplete
                          size="medium"
                          error={undefined}
                          helperText={undefined}
                          options={accountGuidesResult?.data?.result?.map(
                            (item: { name: string; id: string }) => ({
                              label: item.name,
                              value: item.id,
                            })
                          )}
                          label={"Account Guide"}
                          value={model?.accountGuidId}
                          disabled={formType === FormTypes.Details}
                          onChange={(value: string | undefined) =>
                            updateModel(setModel, "accountGuidId", value)
                          }
                          multiple={false}
                          name={"AccountGuide"}
                          handleBlur={null}
                        />
                      )}
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
                              updateModel(
                                setModel,
                                "isPostedAccount",
                                target.checked
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
                              updateModel(
                                setModel,
                                "isActiveAccount",
                                target.checked
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
                              updateModel(
                                setModel,
                                "isStopDealing",
                                target.checked
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
                              updateModel(
                                setModel,
                                "isDepreciable",
                                target.checked
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
