import { useEffect, useState } from 'react';
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import { AccountGuideModel } from '../../../../interfaces/ProjectInterfaces';
import { toastify } from '../../../../Helper/toastify';
import { createAccountGuide, deleteAccountGuide, getAccountGuideById, updateAccountGuide } from "../../../../Apis/Account/AccountGuidesApi"
import InputText from '../../../../Components/Inputs/InputText';
import { useTranslation } from 'react-i18next';
import { AccountGuideSchema } from '../../../../interfaces/ProjectInterfaces/Account/AccountGuides/validation-accountGuide';
import * as yup from 'yup';

const AccountGuidesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
  handleTranslate: (key: string) => string;
}> = ({ formType, id, handleCloseForm, afterAction, handleTranslate }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<AccountGuideModel>({
    id: "",
    name: "",
    nameSecondLanguage: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // const [updateGuide] = useUpdateAccountGuideMutation();
  // const [createGuide] = useCreateAccountGuideMutation();
  // const [deleteGuide] = useDeleteAccountGuideMutation();

  useEffect(() => {
    if (formType != FormTypes.Add) {
      const fetchData = async () => {
        const result = await getAccountGuideById(id);
        if (result) {
          setModel(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteAccountGuide(id);
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
      await AccountGuideSchema.validate(model, { abortEarly: false });
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
    const response = await updateAccountGuide(model.id, model);
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
    const response = await createAccountGuide(model);
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
        isModal
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
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
                <p>{t("AreYouSureDelete")} {model?.nameSecondLanguage}?</p>
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
                              ? { ...prevModel, name: value }
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
                        isRquired
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
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default AccountGuidesForm;
