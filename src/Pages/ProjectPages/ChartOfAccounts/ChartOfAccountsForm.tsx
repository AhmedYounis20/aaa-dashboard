import { useEffect, useState } from 'react';
import { createChartOfAccount, deleteChartOfAccount, getChartOfAccountById, getDefaultChartOfAccount, updateChartOfAccount} from '../../../Apis/ChartOfAccountsApi';
import BaseForm from '../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../interfaces/Components/FormType';
import { toastify } from '../../../Helper/toastify';
import { AccountGuideModel, AccountNatureOptions, ChartOfAccountModel } from '../../../interfaces/ProjectInterfaces';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import InputSelect from '../../../Components/Inputs/InputSelect';
import InputAutoComplete from '../../../Components/Inputs/InputAutoCompelete';
import { AccountNature } from '../../../interfaces/ProjectInterfaces/ChartOfAccount/AccountNature';
import Loader from '../../../Components/Loader';
import updateModel from '../../../Helper/updateModelHelper';
import { getAccountGuides } from '../../../Apis/AccountGuidesApi';

const ChartOfAccountsForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, parentId, handleCloseForm, afterAction }) => {
  const [accountguides, setAccountGuides] = useState<AccountGuideModel[]>([]);
  useEffect(() => {
    if (formType != FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getAccountGuides();
        if (result) {
          setAccountGuides(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [formType]);

  const [model, setModel] = useState<ChartOfAccountModel>({
    accountGuidId: "",
    accountNature: AccountNature.Debit,
    id: "",
    code: "",
    isActiveAccount: false,
    isDepreciable: false,
    isStopDealing: false,
    isPostedAccount: false,
    name: "",
    nameSecondLanguage: "",
    parentId: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   else if (for) {
  //     if (!chartOfAccountResult.isLoading) {
  //       setModel(chartOfAccountResult.data.result);
  //       setIsLoading(false);
  //     }
  //   }
  // }, [
  //   chartOfAccountResult?.isLoading,
  //   chartOfAccountResult?.data?.result,
  //   defaultChartOfAccountResult?.isLoading,
  //   defaultChartOfAccountResult?.data?.result,
  //   formType,
  //   isUpdated,
  // ]);

  useEffect(() => {
    if (formType != FormTypes.Add) {
      const fetchData = async () => {
        const result = await getChartOfAccountById(id);
        if (result) {
          setModel(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      const fetchData = async () => {
        const result = await getDefaultChartOfAccount(parentId);
        if (result) {
          setModel(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [formType,id,parentId]);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteChartOfAccount(id);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response) {
      console.log(response);
      response.errorMessages?.map((error: string) => {
        toastify(error, "error");
        console.log(error);
      });
      return false;
    }
    return false;
  };
  const handleUpdate = async () => {
    const response = await updateChartOfAccount(model.id, model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response && response.errorMessages) {
      toastify(response.errorMessages[0], "error");
      return false;
    }
    return false;
  };
  const handleAdd = async () => {
    const response = await createChartOfAccount(model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      console.log(response);
      afterAction();
      return true;
    } else if (response && response.errorMessages) {
      toastify(response.errorMessages[0], "error");
      return false;
    }
    return false;
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
                      {!accountguides ? (
                        <Loader />
                      ) : (
                        <InputAutoComplete
                          size="medium"
                          error={undefined}
                          helperText={undefined}
                          options={accountguides.map((item) => ({
                            label: item.name,
                            value: item.id,
                          }))}
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
