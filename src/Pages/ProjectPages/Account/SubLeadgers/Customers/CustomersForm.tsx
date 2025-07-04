import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { toastify } from "../../../../../Helper/toastify";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import {
  NodeType,
  NodeTypeOptions,
} from "../../../../../interfaces/Components/NodeType";
import { TextareaAutosize } from "@mui/material";
import CustomerType, {
  CustomerTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Customers/CustomerType";
import {
  getCustomerById,
  getDefaultCustomer,
  updateCustomer,
  createCustomer,
  deleteCustomer,
} from "../../../../../Apis/Account/CustomersApi";
import CustomerModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Customers/CustomerModel";
import { useTranslation } from "react-i18next";
import InputText from "../../../../../Components/Inputs/InputText";
import { CustomerSchema } from '../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Customers/validation-customer';
import * as yup from 'yup';

const CustomersForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, parentId, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<CustomerModel>({
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
    customerType: CustomerType.Consumer,
    mobile: "",
    taxNumber: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formType !== FormTypes.Add) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await getCustomerById(id);
        if (result && result.result) {
          setModel(result.result);
        }
        setIsLoading(false);
      };
      fetchData();
    } else {
      const fetchDefault = async () => {
        setIsLoading(true);
        const result = await getDefaultCustomer(parentId);
        if (result && result.result) {
          setModel((prevModel) => ({
            ...prevModel,
            code: result.result.code,
          }));
        }
        setIsLoading(false);
      };
      fetchDefault();
    }
  }, [formType, id, parentId, isUpdated]);

  const validate = async () => {
    try {
      await CustomerSchema.validate(model, { abortEarly: false });
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
    const response = await updateCustomer(model.id, model);
    setIsUpdated(true);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      if (afterAction) {
        afterAction();
      }
      return true;
    } else if (response && response.errorMessages) {
      toastify(response.errorMessages[0], "error");
      return false;
    }
    return false;
  };
  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createCustomer(model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      if (afterAction) {
        afterAction();
      }
      return true;
    } else if (response && response.errorMessages) {
      response.errorMessages.map((error: string) => {
        toastify(error, "error");
      });
      return false;
    }
    return false;
  };
  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteCustomer(id);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      if (afterAction) {
        afterAction();
      }
      return true;
    } else if (response && response.errorMessages) {
      response.errorMessages.map((error: string) => {
        toastify(error, "error");
      });
      return false;
    }
    return false;
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
                        isRquired
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
                        name="NodeType"
                        onBlur={undefined}
                      />
                    </div>
                  </div>
                  {model?.nodeType === NodeType.Domain && (
                    <div className="card p-4 mx-0 m-2 mt-4">
                      <p>{t("BasicInfo")}</p>
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
                          <InputSelect
                            error={undefined}
                            options={CustomerTypeOptions.map((e) => ({
                              ...e,
                              label: t(e.label),
                            }))}
                            label={t("CustomerType")}
                            defaultValue={model?.customerType}
                            disabled={formType !== FormTypes.Add}
                            multiple={false}
                            onChange={({
                              target,
                            }: {
                              target: { value: CustomerType };
                            }) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      customerType: target.value,
                                    }
                                  : prevModel
                              );
                            }}
                            name={"CustomerType"}
                            onBlur={undefined}
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
                            onChange={(val) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      phone: val,
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
                            label={t("TaxNumber")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.taxNumber}
                            onChange={(val) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      taxNumber: val,
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
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Email")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.email}
                            onChange={(val) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      email: val,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <label className="form-label"> {t("Notes")}</label>
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

export default CustomersForm;
