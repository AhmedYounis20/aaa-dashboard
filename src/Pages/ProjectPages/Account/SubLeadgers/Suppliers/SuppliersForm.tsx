import { useEffect, useState } from 'react';
import BaseForm from '../../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../../interfaces/Components/FormType';
import { toastify } from '../../../../../Helper/toastify';
import {
  createSupplier,
  deleteSupplier,
  getDefaultSupplier,
  getSupplierById,
  updateSupplier,
} from "../../../../../Apis/Account/SuppliersApi";
import SupplierModel from '../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel';
import InputSelect from '../../../../../Components/Inputs/InputSelect';
import { NodeType, NodeTypeOptions } from '../../../../../interfaces/Components/NodeType';
import {   TextareaAutosize } from '@mui/material';
import InputText from '../../../../../Components/Inputs/InputText';
import { useTranslation } from 'react-i18next';
import { SupplierSchema } from '../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/validation-supplier';
import * as yup from 'yup';

const SuppliersForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id,parentId, handleCloseForm, afterAction }) => {
const { t } = useTranslation();
  const [model, setModel] = useState<SupplierModel>({
    name: "",
    nameSecondLanguage: "",
    id: "",
    parentId: parentId,
    nodeType: NodeType.Category,
    code: "",
    email: "",
    notes: "",
    phone: "",
    address: "",
    mobile: "",
    companyName:"",
    taxNumber: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSupplierData = async () => {
      if (formType !== FormTypes.Add && !isUpdated) {
        setIsLoading(true);
        try {
          const response = await getSupplierById(id);
          setModel(response.result);
          // Handle chartOfAccount property safely
          if (response.result.nodeType === 0 && response.result.chartOfAccount?.code) {
            setModel((prevModel) =>
              prevModel
                ? {
                    ...prevModel,
                    code: response.result.chartOfAccount!.code,
                  }
                : prevModel
            );
          }
        } catch (error) {
          console.error('Error fetching supplier:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSupplierData();
  }, [formType, id, isUpdated]);

  useEffect(() => {
    const fetchDefaultData = async () => {
      if (formType === FormTypes.Add) {
        try {
          const response = await getDefaultSupplier(parentId);
          if (response?.result) {
            setModel((prevModel) =>
              prevModel
                ? {
                    ...prevModel,
                    code: response.result?.code,
                  }
                : prevModel
            );
          }
        } catch (error) {
          console.error('Error fetching default data:', error);
        }
      }
    };

    fetchDefaultData();
  }, [formType, parentId, model?.nodeType]);

  const validate = async () => {
    try {
      await SupplierSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      if (validationErrors instanceof yup.ValidationError) {
        validationErrors.inner.forEach((error) => {
          if (error.path) validationErrorsMap[error.path] = error.message;
        });
      }
      setErrors(validationErrorsMap);
      return false;
    }
  };
  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const response = await updateSupplier(model.id, model);
    setIsUpdated(true);
    if (response?.result) {
      toastify(response.successMessage);
      afterAction && afterAction();
      return true;
    } else if (response?.errorMessages) {
      toastify(response.errorMessages[0], "error");
      return false;
    }
    return false;
  };
   const handleAdd = async () => {
     if ((await validate()) === false) return false;
     const response = await createSupplier(model);
     if (response?.result) {
       toastify(response.successMessage);
       afterAction && afterAction();
       return true;
     } else if (response?.errorMessages) {
       response.errorMessages?.map((error: string) => {
         toastify(error, "error");
       });
       return false;
     }
     return false;
   };
  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteSupplier(id);
    if (response?.result) {
      toastify(response.successMessage);
      afterAction && afterAction();
      return true;
    } else {
      console.log(response);

      response?.errorMessages?.map((error: string) => {
        toastify(error, "error");
        console.log(error);
      });
      return false;
    }
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleDelete={handleDelete}
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
                        helperText={errors.nameSecondLanguage ? t(errors.nameSecondLanguage) : undefined}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col col-md-6">
                      <InputSelect
                        error={undefined}
                        options={NodeTypeOptions.map((e) => ({
                          ...e,
                          label: t(e.label),
                        }))}
                        label={t("NodeType")}
                        defaultValue={model?.nodeType}
                        disabled={formType !== FormTypes.Add}
                        multiple={false}
                        onChange={({
                          target,
                        }: {
                          target: { value: NodeType };
                        }) => {
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  nodeType: target.value,
                                }
                              : prevModel
                          );
                        }}
                        name={"NodeType"}
                        onBlur={undefined}
                      />
                    </div>
                  </div>
                  {model?.nodeType === NodeType.Domain && (
                    <div className="card p-4 mx-0 m-2 mt-4">
                      <p>{t("BasicInfo")}"</p>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Code")}
                            variant="outlined"
                            fullWidth
                            disabled
                            value={model?.code}
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
                          />
                        </div>
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("CompanyName")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.companyName ?? ""}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      companyName: value,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Phone")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.phone}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      phone: value,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Mobile")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.mobile}
                            onChange={(val) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      mobile: val,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Email")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.email}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      email: value,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("TaxNumber")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.taxNumber}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      taxNumber: value,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Address")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.address}
                            onChange={(val) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      address: val,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <label className="form-label">{t("Notes")}</label>
                          <TextareaAutosize
                            className="form-input form-control"
                            disabled={formType === FormTypes.Details}
                            value={model?.notes}
                            aria-label={t("Notes")}
                            onChange={(event) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      notes: event.target.value,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default SuppliersForm;
