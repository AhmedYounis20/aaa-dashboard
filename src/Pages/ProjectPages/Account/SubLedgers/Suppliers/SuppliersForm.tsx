import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import SupplierModel from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/Suppliers/SupplierModel";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import { NodeType, NodeTypeOptions } from "../../../../../interfaces/Components/NodeType";
import { TextareaAutosize } from "@mui/material";
import InputText from "../../../../../Components/Inputs/InputText";
import { useTranslation } from "react-i18next";
import { SupplierSchema } from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/Suppliers/validation-supplier";
import { localizedEntityName } from "../../../../../Helper/localizedEntityName";
import { handleValidationErrors } from "../../../../../Helper/validationHelper";
import { useSupplierDetail, useSupplierMutations } from "../../../../../hooks/queries";
import Loader from "../../../../../Components/Loader";

import { ErrorState } from "../../../../../Components/feedback";
const SuppliersForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, parentId, handleCloseForm }) => {
  const { t, i18n } = useTranslation();
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
    companyName: "",
    taxNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: fetchedModel,
    defaultData,
    isLoading: isDetailLoading,
    isError,
    refetch,
  } = useSupplierDetail(id, formType, parentId);
  const { createMutation, updateMutation, deleteMutation } = useSupplierMutations();

  useEffect(() => {
    if (fetchedModel) setModel(fetchedModel);
  }, [fetchedModel]);

  useEffect(() => {
    if (defaultData?.code) {
      setModel((prev) => ({ ...prev, code: defaultData.code }));
    }
  }, [defaultData]);

  useEffect(() => {
    setModel((prev) => ({ ...prev, parentId }));
  }, [parentId]);

  const isLoading = formType !== FormTypes.Add && isDetailLoading;
  const isDetailError = formType !== FormTypes.Add && isError;

  const validate = async () => {
    try {
      await SupplierSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      setErrors(handleValidationErrors(validationErrors));
      return false;
    }
  };
  const handleUpdate = async () => {
    if (isDetailError) return false;
    if ((await validate()) === false) return false;
    try {
      await updateMutation.mutateAsync({ id: model.id, data: model });
      return true;
    } catch {
      return false;
    }
  };
  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    try {
      await createMutation.mutateAsync(model);
      return true;
    } catch {
      return false;
    }
  };
  const handleDelete = async (): Promise<boolean> => {
    if (isDetailError) return false;
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
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
            <Loader />
          ) : isDetailError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>
                  {t("AreYouSureDelete")} {localizedEntityName(model, i18n.language)}
                </p>
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
                        isRequired
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
                        isRequired
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
                        helperText={
                          errors.nameSecondLanguage ? t(errors.nameSecondLanguage) : undefined
                        }
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
                        onChange={({ target }: { target: { value: NodeType } }) => {
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
