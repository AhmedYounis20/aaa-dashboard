import { useEffect, useState } from 'react';
import { createChartOfAccount, deleteChartOfAccount, getChartOfAccountById, getDefaultChartOfAccount, updateChartOfAccount} from "../../../../Apis/Account/ChartOfAccountsApi";
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { toastify } from '../../../../Helper/toastify';
import { AccountGuideModel, AccountNatureOptions, ChartOfAccountModel } from '../../../../interfaces/ProjectInterfaces';
import { FormControlLabel, Switch } from '@mui/material';
import InputSelect from '../../../../Components/Inputs/InputSelect';
import InputAutoComplete from '../../../../Components/Inputs/InputAutoCompelete';
import { AccountNature } from '../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/AccountNature';
import Loader from '../../../../Components/Loader';
import updateModel from '../../../../Helper/updateModelHelper';
import { getAccountGuides } from "../../../../Apis/Account/AccountGuidesApi";
import InputText from '../../../../Components/Inputs/InputText';
import { ChartOfAccountSchema } from '../../../../interfaces/ProjectInterfaces/Account/ChartOfAccount/validation-chartOfAccount';
import * as yup from 'yup';

const ChartOfAccountsForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction: () => void;
  handleTranslate: (key: string) => string;
}> = ({
  formType,
  id,
  parentId,
  handleCloseForm,
  afterAction,
  handleTranslate,
}) => {
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

  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  }, [formType, id, parentId]);

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

  const validate = async () => {
    try {
      await ChartOfAccountSchema.validate(model, { abortEarly: false });
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

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
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
    if ((await validate()) === false) return false;
    const response = await createChartOfAccount(model);
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
                <p>{handleTranslate("AreYouSureDelete")} {model?.nameSecondLanguage}</p>
              ) : (
                <>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label={handleTranslate("Name")}
                        variant="outlined"
                        fullWidth
                        isRquired
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(value) =>
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  name: value,
                                }
                              : prevModel
                          )
                        }
                        error={!!errors.name}
                        helperText={errors.name ? handleTranslate(errors.name) : undefined}
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label={handleTranslate("NameSecondLanguage")}
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.nameSecondLanguage}
                        onChange={(value) =>
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  nameSecondLanguage: value,
                                }
                              : prevModel
                          )
                        }
                        error={!!errors.nameSecondLanguage}
                        helperText={errors.nameSecondLanguage ? handleTranslate(errors.nameSecondLanguage) : undefined}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col col-md-6">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label={handleTranslate("Code")}
                        variant="outlined"
                        fullWidth
                        isRquired
                        disabled={formType === FormTypes.Details}
                        value={model?.code}
                        onChange={(value) =>
                          setModel((prevModel) =>
                            prevModel
                              ? { ...prevModel, code: value }
                              : prevModel
                          )
                        }
                        error={!!errors.code}
                        helperText={errors.code ? handleTranslate(errors.code) : undefined}
                      />
                    </div>
                    <div className="col col-md-6">
                      <InputSelect
                        options={AccountNatureOptions.map((e) => ({
                          ...e,
                          label: handleTranslate(e.label),
                        }))}
                        label={handleTranslate("AccountNature")}
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
                            label: item.name + " | " + item.nameSecondLanguage,
                            value: item.id,
                          }))}
                          label={handleTranslate("AccountGuide")}
                          value={model?.accountGuidId}
                          disabled={formType === FormTypes.Details}
                          onChange={(value: string | undefined) =>
                            updateModel(setModel, "accountGuidId", value)
                          }
                          multiple={false}
                          name={"AccountGuide"}
                          handleBlur={null}
                          defaultSelect
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
                        label={handleTranslate("IsPostedAccount")}
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
                        label={handleTranslate("IsActiveAccount")}
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
                        label={handleTranslate("IsStopDealing")}
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
                        label={handleTranslate("IsDepreciable")}
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
