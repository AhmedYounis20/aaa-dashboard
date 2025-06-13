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
import {
  useCreateBranchMutation,
  useDeleteBranchByIdMutation,
  useGetBranchesByIdQuery,
  useGetDefaultModelDataQuery,
  useUpdateBranchMutation,
} from "../../../../../Apis/Account/BranchesApi";
import BranchModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import InputFile from "../../../../../Components/Inputs/InputFile";
import AttachmentModel from "../../../../../interfaces/BaseModels/AttachmentModel";
import InputText from "../../../../../Components/Inputs/InputText";
import { useTranslation } from "react-i18next";

const BranchesForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
}> = ({ formType, id, parentId, handleCloseForm }) => {
  const [deleteFunc] = useDeleteBranchByIdMutation();
  const [model, setModel] = useState<BranchModel>({
    name: "",
    nameSecondLanguage: "",
    id: "",
    parentId: parentId,
    nodeType: NodeType.Category,
    address: "",
    phone: "",
    code: "",
    notes: "",
    logo: null
  });
  const modelDefaultDataResult = useGetDefaultModelDataQuery(parentId, {
    skip: formType != FormTypes.Add,
  });
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const bankResult = useGetBranchesByIdQuery(id, {
    skip: formType == FormTypes.Add,
  });
  const [update] = useUpdateBranchMutation();
  const [create] = useCreateBranchMutation();
  const {t} = useTranslation();
  useEffect(() => {
    if (formType != FormTypes.Add && !isUpdated) {
      if (!bankResult.isLoading) {
        setModel(bankResult.data.result);
        console.log(bankResult.data.result);
        if (bankResult.data?.result.nodeType === 0) {
          setModel((prevModel) =>
            prevModel
              ? {
                  ...prevModel,
                  code: bankResult.data.result.chartOfAccount.code,
                  logo: bankResult.data.result.attachment ? {
                    fileContent: bankResult.data.result.attachment.fileData,
                    contentType:
                      bankResult.data.result.attachment.fileContentType,
                    fileName:
                       bankResult.data.result.attachment.fileName ,
                    attachmentId : bankResult.data.result.fileName.attachmentId
                  } : null,
                }
              : prevModel
          );
        }
        setIsLoading(false);
      }
    }
  }, [bankResult.isLoading, bankResult, formType,isUpdated]);
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

  const handleLogoSelect = (selectedAttachments :  AttachmentModel[]) => {
    console.log(selectedAttachments);
    if(selectedAttachments.length > 0){
      const file : AttachmentModel  = selectedAttachments[0];
            console.log("data:" + file.contentType + ";" + file.fileContent);

      setModel((prevModel)=> prevModel ? {...prevModel,logo:file} : prevModel)
    }
    else {
            setModel((prevModel) =>
              prevModel ? { ...prevModel, logo: null } : prevModel
            );

    }
  }
  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteFunc(id);
    if (response.data) {
      toastify(response.data.successMessage);
      return true;
    } else {
      console.log(response);
      response.error?.data?.errorMessages?.map((error: string) => {
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
                <p>are you sure, you want delete {model?.nameSecondLanguage}</p>
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
                        onBlur={null}
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
                      </div>
                      <div className="row mb-4">
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

                        <div className="col col-md-6">
                          <TextareaAutosize
                            className="form-input form-control"
                            disabled={formType === FormTypes.Details}
                            value={model?.notes}
                            aria-label="notes"
                            placeholder={t("Notes")+"..."}
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

                      <div className="row mb-3">
                        <div className="col col-md-8">
                          <label className="form-label"> {t("Logo")}</label>
                          <InputFile
                            value={model.logo ? [model.logo] : []}
                            onFilesChange={handleLogoSelect}
                            disabled={formType === FormTypes.Details}
                            multiSelect = {false}
                            allowedTypes={[]}
                            onlySelectedTypes={false}                            
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

export default BranchesForm;
