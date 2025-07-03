import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import { ApiResponse } from "../../../../../interfaces/ApiResponse";
import { toastify } from "../../../../../Helper/toastify";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import {
  NodeType,
  NodeTypeOptions,
} from "../../../../../interfaces/Components/NodeType";
import {  TextareaAutosize } from "@mui/material";
import BankModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Banks/BankModel";
import {
  useCreateBankMutation,
  useDeleteBankByIdMutation,
  useGetBanksByIdQuery,
  useGetDefaultModelDataQuery,
  useUpdateBankMutation,
} from "../../../../../Apis/Account/BanksApi";
import { useTranslation } from "react-i18next";
import InputText from "../../../../../Components/Inputs/InputText";

const BanksForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
}> = ({ formType, id, parentId, handleCloseForm }) => {
  const { t } = useTranslation();
  const [deleteFunc] = useDeleteBankByIdMutation();
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
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const bankResult = useGetBanksByIdQuery(id, {
    skip: formType == FormTypes.Add,
  });
  const modelDefaultDataResult = useGetDefaultModelDataQuery(parentId, {
    skip: formType != FormTypes.Add,
  });
  const [update] = useUpdateBankMutation();
  const [create] = useCreateBankMutation();

  useEffect(() => {
    if (formType != FormTypes.Add && !isUpdated) {
      if (!bankResult.isLoading) {
        setModel(bankResult.data.result);
        if (bankResult.data?.result.nodeType === 0) {
          setModel((prevModel) =>
            prevModel
              ? {
                  ...prevModel,
                  code: bankResult.data.result.chartOfAccount.code,
                }
              : prevModel
          );
        }
        setIsLoading(false);
      }
    }
  }, [bankResult.isLoading, bankResult, formType, isUpdated]);
  useEffect(() => {
    if (formType == FormTypes.Add) {
      if (!modelDefaultDataResult.isLoading) {
        setModel((prevModel) =>
          prevModel
            ? {
                ...prevModel,
                code: modelDefaultDataResult?.data?.result?.code,
              }
            : prevModel
        );
      }
    }
  }, [
    model?.nodeType,
    formType,
    modelDefaultDataResult,
    modelDefaultDataResult.isLoading,
  ]);
  const handleUpdate = async () => {
    if (model) {
      const response: ApiResponse = await update(model);
      setIsUpdated(true);
      if (response.data) {
        toastify(response.data.successMessage);
        return true;
      } else if (response.error) {
        response.error?.data?.errorMessages?.map((error: string) => {
          toastify(error, "error");
        });
        return false;
      }
    }
    return false;
  };
  const handleAdd = async () => {
    if (model) {
      const response: ApiResponse = await create(model);
      if (response.data) {
        toastify(response.data.successMessage);
        return true;
      } else if (response.error) {
        response.error?.data?.errorMessages?.map((error: string) => {
          toastify(error, "error");
        });
        return false;
      }
    }
    return false;
  };
  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteFunc(id);
    if (response.data) {
      toastify(response.data.successMessage);
      return true;
    } else {
      response.error?.data?.errorMessages?.map((error: string) => {
        toastify(error, "error");
      });
      return false;
    }
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
