import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import { NodeType, NodeTypeOptions } from "../../../../../interfaces/Components/NodeType";
import { TextareaAutosize } from "@mui/material";
import BranchModel from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/Branches/BranchModel";
import InputFile from "../../../../../Components/Inputs/InputFile";
import AttachmentModel from "../../../../../interfaces/BaseModels/AttachmentModel";
import InputText from "../../../../../Components/Inputs/InputText";
import { useTranslation } from "react-i18next";
import { BranchSchema } from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/Branches/validation-branch";
import { localizedEntityName } from "../../../../../Helper/localizedEntityName";
import { handleValidationErrors } from "../../../../../Helper/validationHelper";
import Loader from "../../../../../Components/Loader";
import { ErrorState } from "../../../../../Components/feedback";
import { useBranchDetail, useBranchMutations } from "../../../../../hooks/queries";

const BranchesForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, parentId, handleCloseForm }) => {
  const { t, i18n } = useTranslation();
  const [model, setModel] = useState<BranchModel>({
    id: "",
    name: "",
    nameSecondLanguage: "",
    parentId: parentId,
    nodeType: NodeType.Category,
    code: "",
    phone: "",
    address: "",
    notes: "",
    logo: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: fetchedModel,
    defaultData,
    isLoading: isDetailLoading,
    isError,
    refetch,
  } = useBranchDetail(id, formType, parentId);
  const { createMutation, updateMutation, deleteMutation } = useBranchMutations();

  useEffect(() => {
    if (!fetchedModel) return;
    setModel({
      ...fetchedModel,
      logo: fetchedModel.attachment
        ? {
            fileContent: "",
            contentType:
              fetchedModel.attachment.contentType || fetchedModel.attachment.fileContentType || "",
            fileName: fetchedModel.attachment.fileName,
            attachmentId:
              fetchedModel.attachment.attachmentId || fetchedModel.attachment.id || null,
            contentUrl: fetchedModel.attachment.contentUrl,
          }
        : null,
    });
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
      await BranchSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      setErrors(handleValidationErrors(validationErrors));
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

  const handleLogoSelect = (selectedAttachments: AttachmentModel[]) => {
    if (selectedAttachments.length > 0) {
      const file: AttachmentModel = selectedAttachments[0];
      setModel((prevModel) => (prevModel ? { ...prevModel, logo: file } : prevModel));
    } else {
      setModel((prevModel) => (prevModel ? { ...prevModel, logo: null } : prevModel));
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
        handleDelete={async () => await handleDelete()}
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
                            aria-label={t("Notes")}
                            placeholder={t("Notes") + "..."}
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
                            multiSelect={false}
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
