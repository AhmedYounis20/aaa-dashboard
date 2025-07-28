import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import { NodeType, NodeTypeOptions } from "../../../../../interfaces/Components/NodeType";
import { TextareaAutosize } from "@mui/material";
import BankModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Banks/BankModel";
import { getBankById, getDefaultBank, createBank, updateBank, deleteBank } from "../../../../../Apis/Account/BanksApi";
import { BankSchema } from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Banks/validation-bank";
import { useTranslation } from "react-i18next";
import InputText from "../../../../../Components/Inputs/InputText";

const BanksForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, parentId, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<BankModel>({
    name: "",
    nameSecondLanguage: "",
    id: "",
    parentId: parentId,
    nodeType: NodeType.Category,
    bankAccount: "",
    bankAddress: "",
    code: "",
    email: "",
    notes: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formType !== FormTypes.Add) {
      const fetchData = async () => {
        setIsLoading(true);
        const result = await getBankById(id);
        if (result && result.result) {
          setModel(result.result);
        }
        setIsLoading(false);
      };
      fetchData();
    } else {
      const fetchDefault = async () => {
        setIsLoading(true);
        const result = await getDefaultBank(parentId);
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
  }, [formType, id, parentId]);

  const validate = async () => {
    try {
      await BankSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as any).inner.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const response = await updateBank(model.id, model);
    if (response && response.isSuccess) {
      if (afterAction) {
        afterAction();
      }
      return true;
    }
    return false;
  };
  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createBank(model);
    if (response && response.isSuccess) {
      if (afterAction) {
        afterAction();
      }
      return true;
    }
    return false;
  };
  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteBank(id);
    if (response && response.isSuccess) {
      if (afterAction) {
        afterAction();
      }
      return true;
    } 
    return false;
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleDelete={async () => await handleDelete()}
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
                        onChange={(value) => setModel((prevModel) => ({ ...prevModel, name: value }))}
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
                        onChange={(value) => setModel((prevModel) => ({ ...prevModel, nameSecondLanguage: value }))}
                        error={!!errors.nameSecondLanguage}
                        helperText={errors.nameSecondLanguage ? t(errors.nameSecondLanguage) : undefined}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col col-md-6">
                      <InputSelect
                        error={undefined}
                        options={NodeTypeOptions.map(e=> ({...e,label:t(e.label)}))}
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
                      </div>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("BankAccount")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.bankAccount}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      bankAccount: value,
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
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("BankAddress")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.bankAddress}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      bankAddress: value,
                                    }
                                  : prevModel
                              )
                            }
                          />
                        </div>
                        <div
                          className="col col-md-6 pt-0"
                          style={{ marginTop: -10 }}
                        ></div>
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

export default BanksForm;
