import { useEffect, useState } from 'react';
import BaseForm from '../../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../../interfaces/Components/FormType';
import { ApiResponse } from '../../../../../interfaces/ApiResponse';
import { toastify } from '../../../../../Helper/toastify';
import InputSelect from '../../../../../Components/Inputs/InputSelect';
import { NodeType, NodeTypeOptions } from '../../../../../interfaces/Components/NodeType';
import {  TextareaAutosize } from '@mui/material';
import CashInBoxModel from '../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/CashInBoxes/CashInBoxModel';
import {
  useCreateCashInBoxMutation,
  useDeleteCashInBoxByIdMutation,
  useGetCashInBoxesByIdQuery,
  useGetDefaultModelDataQuery,
  useUpdateCashInBoxMutation,
} from "../../../../../Apis/Account/CashInBoxesApi";
import { useTranslation } from 'react-i18next';
import InputText from '../../../../../Components/Inputs/InputText';

const CashInBoxesForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
}> = ({ formType, id,parentId, handleCloseForm }) => {
  const [deleteFunc] = useDeleteCashInBoxByIdMutation();
  const [model, setModel] = useState<CashInBoxModel>({
    name: "",
    nameSecondLanguage: "",
    id: "",
    parentId: parentId,
    nodeType: NodeType.Category,
    code: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const cashInBoxResult = useGetCashInBoxesByIdQuery(id,{
    skip : formType == FormTypes.Add
  });
    const modelDefaultDataResult = useGetDefaultModelDataQuery(parentId, {
      skip: formType != FormTypes.Add,
    });
  const [update] = useUpdateCashInBoxMutation();
  const [create] = useCreateCashInBoxMutation();
  const {t} = useTranslation();
  useEffect(() => {
    if(formType !== FormTypes.Add && !isUpdated){
      if (!cashInBoxResult.isLoading) {
        setModel(cashInBoxResult.data.result);
        if (cashInBoxResult.data?.result.nodeType === 0) {
          setModel((prevModel) =>
            prevModel
              ? {
                  ...prevModel,
                  code: cashInBoxResult.data.result.chartOfAccount.code,
                }
              : prevModel
          );
        }
        setIsLoading(false);
      }
    }
  }, [cashInBoxResult.isLoading, cashInBoxResult?.data?.result,formType,isLoading,isUpdated]);
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
        toastify(response.error.data.errorMessages[0], "error");
        return false;
      }
    }
    return false;
  };
  const handleDelete = async (): Promise<boolean> => {
    const response: ApiResponse = await deleteFunc(id);
    if (response.data) {
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
                        isRquired
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(value) =>
                          setModel((prev) =>
                            prev ? { ...prev, name: value } : prev
                          )
                        }
                        // error={!!errors.name}
                        // helperText={t(errors.name)}
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
                          setModel((prev) =>
                            prev ? { ...prev, nameSecondLanguage: value } : prev
                          )
                        }
                        // error={!!errors.name}
                        // helperText={t(errors.name)}
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
                            label={t("Name")}
                            variant="outlined"
                            fullWidth
                            isRquired
                            disabled={formType === FormTypes.Details}
                            value={model?.name}
                            onChange={(value) =>
                              setModel((prev) =>
                                prev ? { ...prev, name: value } : prev
                              )
                            }
                            // error={!!errors.name}
                            // helperText={t(errors.name)}
                          />

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
                      </div>
                      <div className="row mb-3">
                        <div className="col col-md-12">
                          <label className="form-label"> {t("Notes")}</label>
                          <TextareaAutosize
                            className="form-input form-control"
                            disabled={formType === FormTypes.Details}
                            value={model?.notes}
                            aria-label="notes"
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

export default CashInBoxesForm;
