import { useEffect, useState } from 'react';
import BaseForm from '../../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../../../interfaces/ApiResponse';
import { toastify } from '../../../../../Helper/toastify';
import {
  useCreateSupplierMutation,
  useDeleteSupplierByIdMutation,
  useGetDefaultModelDataQuery,
  useGetSuppliersByIdQuery,
  useUpdateSupplierMutation,
} from "../../../../../Apis/Account/SuppliersApi";
import SupplierModel from '../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel';
import InputSelect from '../../../../../Components/Inputs/InputSelect';
import { NodeType, NodeTypeOptions } from '../../../../../interfaces/Components/NodeType';
import {   TextareaAutosize } from '@mui/material';
import InputText from '../../../../../Components/Inputs/InputText';
import { useTranslation } from 'react-i18next';

const SuppliersForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
}> = ({ formType, id,parentId, handleCloseForm }) => {
const { t } = useTranslation();
  const [deleteFunc] = useDeleteSupplierByIdMutation();
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

  const supplierResult = useGetSuppliersByIdQuery(id, {
    skip: formType == FormTypes.Add,
  });
    const modelDefaultDataResult = useGetDefaultModelDataQuery(parentId, {
      skip: formType != FormTypes.Add,
    });
  const [update] = useUpdateSupplierMutation();
  const [create] = useCreateSupplierMutation();

  useEffect(() => {
    if(formType != FormTypes.Add && !isUpdated){

      if (!supplierResult.isLoading) {
        setModel(supplierResult.data.result);
        if (supplierResult.data?.result.nodeType === 0) {
          setModel((prevModel) =>
            prevModel
              ? {
                  ...prevModel,
                  code: supplierResult.data.result.chartOfAccount.code,
                }
              : prevModel
          );
        }
        setIsLoading(false);
      }
    }
  }, [supplierResult.isLoading, supplierResult?.data?.result,formType,isUpdated]);
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
        toastify(response.error.data.errorMessages[0], "error");
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
