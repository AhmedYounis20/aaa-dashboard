import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseForm from "../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../interfaces/Components/FormType";
import AttributeDefinitionModel from "../../../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel";
import AttributeValueModel from "../../../../interfaces/ProjectInterfaces/Inventory/AttributeValues/AttributeValueModel";
import InputText from "../../../../Components/Inputs/InputText";
import {
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { AttributeDefinitionSchema } from "../../../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinition-validation";
import EditableTable from "../../../../Components/Tables/EditableTable";
import * as yup from "yup";
import { AttributeValueSchema } from "../../../../interfaces/ProjectInterfaces/Inventory/AttributeValues/AttributeValue-validation";

import Loader from "@/Components/Loader";
import {
  useAttributeDetail,
  useAttributeMutations,
} from "@/hooks/queries";

const defaultModel: AttributeDefinitionModel = {
  id: "",
  name: "",
  nameSecondLanguage: "",
  isActive: true,
  predefinedValues: [],
};

const AttributesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<AttributeDefinitionModel>({ ...defaultModel });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rowErrors, setRowErrors] = useState<
    Record<number, Record<string, string>>
  >({});
  const theme = useTheme();

  const { data: fetchedModel, isLoading: isDetailLoading } = useAttributeDetail(
    id,
    formType
  );
  const { createMutation, updateMutation, deleteMutation } = useAttributeMutations();

  useEffect(() => {
    if (fetchedModel) {
      setModel(fetchedModel);
    }
  }, [fetchedModel]);

  useEffect(() => {
    if (formType === FormTypes.Add) {
      setModel({ ...defaultModel });
    }
  }, [formType]);

  const isLoading = formType !== FormTypes.Add && isDetailLoading;

  const handleDelete = async (): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const handleUpdate = async () => {
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

  const validate = async () => {
    try {
      await AttributeDefinitionSchema.validate(model, { abortEarly: false });
      setErrors({});

      const newRowErrors: Record<number, Record<string, string>> = {};
      let hasRowErrors = false;

      if (model.predefinedValues && model.predefinedValues.length > 0) {
        for (let i = 0; i < model.predefinedValues.length; i++) {
          const value = model.predefinedValues[i];
          try {
            await AttributeValueSchema.validate(value, { abortEarly: false });
          } catch (validationErrors) {
            const validationErrorsMap: Record<string, string> = {};
            (validationErrors as yup.ValidationError).inner.forEach(
              (error: any) => {
                if (error.path) validationErrorsMap[error.path] = error.message;
              }
            );
            newRowErrors[i] = validationErrorsMap;
            hasRowErrors = true;
          }
        }
      }

      setRowErrors(newRowErrors);
      return !hasRowErrors;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as yup.ValidationError).inner.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const updateValueAt = (
    index: number,
    partial: Partial<AttributeValueModel>
  ) => {
    setModel((prev) => {
      const values = [...(prev.predefinedValues || [])];
      values[index] = { ...values[index], ...partial } as AttributeValueModel;
      return { ...prev, predefinedValues: values };
    });

    if (rowErrors[index]) {
      setRowErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const removeAttributeValue = async (index: number) => {
    setModel((prev) => ({
      ...prev,
      predefinedValues: prev.predefinedValues?.filter((_, i) => i !== index),
    }));

    setRowErrors((prev) => {
      const newErrors: Record<number, Record<string, string>> = {};
      Object.keys(prev).forEach((key) => {
        const rowIndex = parseInt(key);
        if (rowIndex < index) {
          newErrors[rowIndex] = prev[rowIndex];
        } else if (rowIndex > index) {
          newErrors[rowIndex - 1] = prev[rowIndex];
        }
      });
      return newErrors;
    });
  };

  const handleAddValueClick = () => {
    const newValue: AttributeValueModel = {
      name: "",
      nameSecondLanguage: "",
      isActive: true,
      attributeDefinitionId: model.id,
    } as AttributeValueModel;
    setModel((prev) => ({
      ...prev,
      predefinedValues: [...(prev.predefinedValues || []), newValue],
    }));
  };

  return (
    <div className='container h-full'>
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        isModal
        size='large'
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      >
        <div>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>
                  {t("AreYouSureDelete")} {model?.nameSecondLanguage}
                </p>
              ) : (
                <>
                  <div className='row mb-3'>
                    <div className='col col-md-6 mb-2'>
                      <InputText
                        type='text'
                        className='form-input form-control'
                        label={t("Name")}
                        variant='outlined'
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(value) =>
                          setModel((prev) => ({ ...prev, name: value }))
                        }
                        error={Boolean(errors.name)}
                        helperText={errors.name ? t(errors.name) : undefined}
                      />
                    </div>
                    <div className='col col-md-6 mb-2'>
                      <InputText
                        type='text'
                        className='form-input form-control'
                        label={t("NameSecondLanguage")}
                        variant='outlined'
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.nameSecondLanguage}
                        onChange={(value) =>
                          setModel((prev) => ({
                            ...prev,
                            nameSecondLanguage: value,
                          }))
                        }
                        error={Boolean(errors.nameSecondLanguage)}
                        helperText={
                          errors.nameSecondLanguage
                            ? t(errors.nameSecondLanguage)
                            : undefined
                        }
                      />
                    </div>
                  </div>

                  <div className='row mb-3'>
                    <div className='col col-md-3'>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={model?.isActive}
                            disabled={formType === FormTypes.Details}
                            onChange={(e) =>
                              setModel((prev) => ({
                                ...prev,
                                isActive: e.target.checked,
                              }))
                            }
                          />
                        }
                        label={t("IsActive")}
                      />
                    </div>
                  </div>

                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      borderLeft: 3,
                      borderColor: theme.palette.primary.main,
                      pl: 1,
                    }}
                  >
                    <Typography variant='h6'>{t("Values")}</Typography>
                  </Box>
                  <EditableTable
                    rows={model.predefinedValues}
                    columns={[
                      { key: "name", label: t("Name"), type: "text" },
                      {
                        key: "nameSecondLanguage",
                        label: t("NameSecondLanguage"),
                        type: "text",
                      },
                      { key: "isActive", label: t("IsActive"), type: "switch" },
                    ]}
                    onChangeRow={(index, updated) =>
                      updateValueAt(index, updated)
                    }
                    addText={t("AddValue")}
                    onAddRow={handleAddValueClick}
                    disabled={formType === FormTypes.Details}
                    onDeleteRow={(index) => removeAttributeValue(index)}
                    errors={rowErrors}
                  />
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default AttributesForm;
