import { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import {
  NodeType,
  NodeTypeOptions,
} from "../../../../../interfaces/Components/NodeType";
import {  TextareaAutosize } from "@mui/material";
import {
  createBranch,
  deleteBranch,
  getBranchById,
  getDefaultBranchData,
  updateBranch,
} from "../../../../../Apis/Account/BranchesApi";
import BranchModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import InputFile from "../../../../../Components/Inputs/InputFile";
import AttachmentModel from "../../../../../interfaces/BaseModels/AttachmentModel";
import InputText from "../../../../../Components/Inputs/InputText";
import { useTranslation } from "react-i18next";
import { BranchSchema } from '../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/validation-branch';
import * as yup from 'yup';

const BranchesForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, parentId, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
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
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchBranchData = async () => {
       if (formType === FormTypes.Add) {
        try {
          const response = await getDefaultBranchData(parentId);
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
      else {
        setIsLoading(true);
        try {
          const response = await getBranchById(id);
          setModel({
            ...response.result,
            code: response.result.chartOfAccount?.code || response.result.code,
            logo: response.result.attachment ? {
              fileContent: response.result.attachment.fileData,
              contentType: response.result.attachment.fileContentType,
              fileName: response.result.attachment.fileName,
              attachmentId: response.result.attachment.attachmentId
            } : null
          });
        } catch (error) {
          console.error('Error fetching branch:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBranchData();
  }, [formType, id]);

  // useEffect(() => {
  //   const fetchDefaultData = async () => {
     
  //   };

  //   fetchDefaultData();
  // }, [formType, parentId, model?.nodeType]);

  const validate = async () => {
    try {
      await BranchSchema.validate(model, { abortEarly: false });
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
  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createBranch(model);
    if (response?.result) {
      afterAction && afterAction();
      return true;
    }
    return false;
  };
  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const response = await updateBranch(model.id, model);
    if (response?.result) {
      afterAction && afterAction();
      return true;
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
    const response = await deleteBranch(id);
    if (response?.result) {
      afterAction && afterAction();
      return true;
    } else {
      console.log(response);    
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
