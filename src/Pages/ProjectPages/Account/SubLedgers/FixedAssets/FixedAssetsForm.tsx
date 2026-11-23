import React, { useEffect, useState } from "react";
import BaseForm from "../../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import { NodeType, NodeTypeOptions } from "../../../../../interfaces/Components/NodeType";
import { FormControlLabel, Switch } from "@mui/material";
import FixedAssetModel from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/FixedAssets/FixedAssetModel";
import FixedAssetType, {
  FixedAssetTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/FixedAssets/FixedAssetType";
import InputNumber from "../../../../../Components/Inputs/InputNumber";
import { useTranslation } from "react-i18next";
import InputText from "../../../../../Components/Inputs/InputText";
import { FixedAssetSchema } from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/FixedAssets/validation-fixedAsset";
import { localizedEntityName } from "../../../../../Helper/localizedEntityName";
import { handleValidationErrors } from "../../../../../Helper/validationHelper";
import { useFixedAssetDetail, useFixedAssetMutations } from "../../../../../hooks/queries";
import Loader from "../../../../../Components/Loader";

import { ErrorState } from "../../../../../Components/feedback";
const FixedAssetsForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, parentId, handleCloseForm }) => {
  const { t, i18n } = useTranslation();
  const [model, setModel] = useState<FixedAssetModel>({
    accumelatedCode: "",
    assetLifeSpanByYears: 0,
    depreciationRate: 0,
    code: "",
    expensesCode: "",
    fixedAssetType: FixedAssetType.Buildings,
    id: "",
    isDepreciable: false,
    manufactureCompany: "",
    name: "",
    nameSecondLanguage: "",
    nodeType: NodeType.Category,
    notes: "",
    parentId: parentId,
    serial: "",
    version: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: fetchedModel,
    defaultData,
    isLoading: isDetailLoading,
    isError,
    refetch,
  } = useFixedAssetDetail(id, formType, parentId, model.fixedAssetType);
  const { createMutation, updateMutation, deleteMutation } = useFixedAssetMutations();

  useEffect(() => {
    if (!fetchedModel) return;
    setModel({
      ...fetchedModel,
      code: fetchedModel.chartOfAccount?.code ?? fetchedModel.code,
      accumelatedCode: fetchedModel.accumlatedAccount?.code || "",
      expensesCode: fetchedModel.expensesAccount?.code || "",
    });
  }, [fetchedModel]);

  useEffect(() => {
    if (!defaultData) return;
    setModel((prev) => ({
      ...prev,
      code: defaultData.code ?? prev.code,
      expensesCode: defaultData.expensesCode ?? prev.expensesCode,
      accumelatedCode: defaultData.accumelatedCode ?? prev.accumelatedCode,
    }));
  }, [defaultData]);

  useEffect(() => {
    setModel((prev) => ({ ...prev, parentId }));
  }, [parentId]);

  const isLoading = formType !== FormTypes.Add && isDetailLoading;
  const isDetailError = formType !== FormTypes.Add && isError;

  const validate = async () => {
    try {
      await FixedAssetSchema.validate(model, { abortEarly: false });
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
                        isRequired
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
                        helperText={
                          errors.nameSecondLanguage ? t(errors.nameSecondLanguage) : undefined
                        }
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
                            onChange={({ target }: { target: { value: FixedAssetType } }) => {
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
                            helperText={
                              errors.manufactureCompany ? t(errors.manufactureCompany) : undefined
                            }
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
                              helperText={
                                errors.assetLifeSpanByYears
                                  ? t(errors.assetLifeSpanByYears)
                                  : undefined
                              }
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
                              helperText={
                                errors.depreciationRate ? t(errors.depreciationRate) : undefined
                              }
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
