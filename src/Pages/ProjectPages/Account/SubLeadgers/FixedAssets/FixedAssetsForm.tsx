import React,{ useEffect, useState } from 'react';
import BaseForm from '../../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../../interfaces/Components/FormType';
import { toastify } from '../../../../../Helper/toastify';
import InputSelect from '../../../../../Components/Inputs/InputSelect';
import { NodeType, NodeTypeOptions } from '../../../../../interfaces/Components/NodeType';
import { FormControlLabel, Switch } from '@mui/material';
import {
  createFixedAsset,
  deleteFixedAsset,
  getDefaultFixedAssetData,
  getFixedAssetById,
  updateFixedAsset,
} from "../../../../../Apis/Account/FixedAssetsApi";
import FixedAssetModel from '../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/FixedAssets/FixedAssetModel';
import  FixedAssetType, { FixedAssetTypeOptions } from '../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/FixedAssets/FixedAssetType';
import InputNumber from '../../../../../Components/Inputs/InputNumber';
import { useTranslation } from 'react-i18next';
import InputText from '../../../../../Components/Inputs/InputText';
import { FixedAssetSchema } from '../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/FixedAssets/validation-fixedAsset';
import * as yup from 'yup';

const FixedAssetsForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id,parentId, handleCloseForm, afterAction }) => {  
const { t } = useTranslation();
  const [model, setModel] = useState<FixedAssetModel>({
    accumelatedCode :"",
    assetLifeSpanByYears :0,
    depreciationRate :0,
    code:"",
    expensesCode:"",
    fixedAssetType : FixedAssetType.Buildings,
    id:"",
    isDepreciable:false,
    manufactureCompany:"",
    name:"",
    nameSecondLanguage:"",
    nodeType : NodeType.Category,
    notes:"",
    parentId:parentId,
    serial:"",
    version:""
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFixedAssetData = async () => {
      if (formType !== FormTypes.Add) {
        setIsLoading(true);
        try {
          const response = await getFixedAssetById(id);
          setModel(response.result);
          if (response.result.nodeType === 0 && response.result.chartOfAccount?.code) {
            setModel((prevModel) =>
              prevModel == null
                ? prevModel
                : {
                  ...prevModel,
                  code: response.result.chartOfAccount!.code,
                  accumelatedCode: response.result.accumlatedAccount?.code || "",
                  expensesCode: response.result.expensesAccount?.code || "",
                }
            );
          }
        } catch (error) {
          console.error('Error fetching fixed asset:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFixedAssetData();
  }, [formType, id]);

  useEffect(() => {
    const fetchDefaultData = async () => {
      if (formType === FormTypes.Add) {
        setModel((prevModel) =>
          prevModel == null
            ? prevModel
            : {
                ...prevModel,
                code: "Loading...",
                accumelatedCode: "Loading...",
                expensesCode: "Loading...",
              }
        );
        
        try {
          const response = await getDefaultFixedAssetData(parentId, model.fixedAssetType);
          if (response?.result) {
            setModel((prevModel) =>
              prevModel
                ? {
                    ...prevModel,
                    code: response.result?.code,
                    expensesCode: response.result?.expensesCode,
                    accumelatedCode: response.result?.accumelatedCode,
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
  }, [formType, parentId, model.fixedAssetType]);

  const validate = async () => {
    try {
      await FixedAssetSchema.validate(model, { abortEarly: false });
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
    if (model) {
      const response = await updateFixedAsset(model.id, model);
      if (response?.result) {
        toastify(response.successMessage);
        afterAction && afterAction();
        return true;
      } else if (response?.errorMessages) {
        toastify(response.errorMessages[0], "error");
        return false;
      }
    }
    return false;
  };
    const handleAdd = async () => {
      if ((await validate()) === false) return false;
      if (model) {
        const response = await createFixedAsset(model);
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
      }
      return false;
    };
  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteFixedAsset(id);
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
                        isRquired
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
                        error={!!errors.nodeType}
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
                        name={"nodeType"}
                        onBlur={undefined}
                      />
                      {errors.nodeType && (
                        <div className="text-danger small mt-1">{t(errors.nodeType)}</div>
                      )}
                    </div>
                  </div>
                  {model?.nodeType === NodeType.Domain && (
                    <div className="card p-4 mx-0 m-2 mt-4">
                      <p>{t("BasicInfo")}</p>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <InputSelect
                            error={!!errors.fixedAssetType}
                            options={FixedAssetTypeOptions.map((e) => ({
                              ...e,
                              label: t(e.label),
                            }))}
                            label={t("FixedAssetType")}
                            defaultValue={model?.fixedAssetType}
                            multiple={false}
                            disabled={formType != FormTypes.Add}
                            onChange={({
                              target,
                            }: {
                              target: { value: FixedAssetType };
                            }) => {
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      fixedAssetType: target.value,
                                    }
                                  : prevModel
                              );
                            }}
                            name={"FixedAssetType"}
                            onBlur={undefined}
                          />
                          {errors.fixedAssetType && (
                            <div className="text-danger small mt-1">{t(errors.fixedAssetType)}</div>
                          )}
                        </div>
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Code")}
                            variant="outlined"
                            fullWidth
                            disabled
                            value={model?.code}
                            error={!!errors.code}
                            helperText={errors.code ? t(errors.code) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Serial")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.serial}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      serial: value,
                                    }
                                  : prevModel
                              )
                            }
                            error={!!errors.serial}
                            helperText={errors.serial ? t(errors.serial) : undefined}
                          />
                        </div>
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("Version")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.version}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      version: value,
                                    }
                                  : prevModel
                              )
                            }
                            error={!!errors.version}
                            helperText={errors.version ? t(errors.version) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <InputText
                            type="text"
                            className="form-input form-control"
                            label={t("ManufacturerCompany")}
                            variant="outlined"
                            fullWidth
                            disabled={formType === FormTypes.Details}
                            value={model?.manufactureCompany}
                            onChange={(value) =>
                              setModel((prevModel) =>
                                prevModel
                                  ? {
                                      ...prevModel,
                                      manufactureCompany: value,
                                    }
                                  : prevModel
                              )
                            }
                            error={!!errors.manufactureCompany}
                            helperText={errors.manufactureCompany ? t(errors.manufactureCompany) : undefined}
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col col-md-6">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={model?.isDepreciable}
                                onChange={(e) =>
                                  setModel((prevModel) =>
                                    prevModel
                                      ? {
                                          ...prevModel,
                                          isDepreciable: e.target.checked,
                                        }
                                      : prevModel
                                  )
                                }
                                disabled={formType === FormTypes.Details}
                              />
                            }
                            label={t("IsDepreciable")}
                          />
                        </div>
                      </div>
                      {model?.isDepreciable && (
                        <div className="row mb-4">
                          <div className="col col-md-6">
                            <InputNumber
                              className="form-input form-control"
                              label={t("AssetLifeSpanByYears")}
                              variant="outlined"
                              fullWidth
                              disabled={formType === FormTypes.Details}
                              value={model?.assetLifeSpanByYears}
                              onChange={(value) =>
                                setModel((prevModel) =>
                                  prevModel
                                    ? {
                                        ...prevModel,
                                        assetLifeSpanByYears: value,
                                      }
                                    : prevModel
                                )
                              }
                              error={!!errors.assetLifeSpanByYears}
                              helperText={errors.assetLifeSpanByYears ? t(errors.assetLifeSpanByYears) : undefined}
                            />
                          </div>
                          <div className="col col-md-6">
                            <InputNumber
                              className="form-input form-control"
                              label={t("DepreciationRate")}
                              variant="outlined"
                              fullWidth
                              disabled={formType === FormTypes.Details}
                              value={model?.depreciationRate}
                              onChange={(value) =>
                                setModel((prevModel) =>
                                  prevModel
                                    ? {
                                        ...prevModel,
                                        depreciationRate: value,
                                      }
                                    : prevModel
                                )
                              }
                              error={!!errors.depreciationRate}
                              helperText={errors.depreciationRate ? t(errors.depreciationRate) : undefined}
                            />
                          </div>
                        </div>
                      )}
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

export default FixedAssetsForm;
