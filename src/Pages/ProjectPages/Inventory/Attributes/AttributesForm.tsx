import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseForm from "../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../interfaces/Components/FormType";
import AttributeDefinitionModel from "../../../../interfaces/ProjectInterfaces/Inventory/AttributeDefinitions/AttributeDefinitionModel";
import AttributeValueModel from "../../../../interfaces/ProjectInterfaces/Inventory/AttributeValues/AttributeValueModel";
import {
  createAttributeDefinition,
  deleteAttributeDefinition,
  getAttributeDefinitionByIdWithValues,
  updateAttributeDefinition,
} from "../../../../Apis/Inventory/AttributeDefinitionsApi";
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

const AttributesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<AttributeDefinitionModel>({
    id: "",
    name: "",
    nameSecondLanguage: "",
    isActive: true,
    predefinedValues: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const theme = useTheme();

  useEffect(() => {
    if (formType !== FormTypes.Add) {
      const fetchData = async () => {
        try {
          const response = await getAttributeDefinitionByIdWithValues(id);
          if (response && response.data) {
            setModel(response.data.result);
          }
        } catch (error) {
          console.error("Error fetching attribute definition:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [formType, id]);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteAttributeDefinition(id);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };

  const handleUpdate = async () => {
    debugger;
    if ((await validate()) === false) return false;
    const response = await updateAttributeDefinition(model.id, model);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };

  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createAttributeDefinition(model);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };

  const validate = async () => {
    try {
      await AttributeDefinitionSchema.validate(model, { abortEarly: false });
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

  const updateValueAt = (
    index: number,
    partial: Partial<AttributeValueModel>
  ) => {
    setModel((prev) => {
      const values = [...(prev.predefinedValues || [])];
      values[index] = { ...values[index], ...partial } as AttributeValueModel;
      return { ...prev, predefinedValues: values };
    });
  };

  const removeAttributeValue = async (index: number) => {
    setModel((prev) => ({
      ...prev,
      predefinedValues: prev.predefinedValues?.filter((_, i) => i !== index),
    }));
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
            <div
              className='d-flex flex-row align-items-center justify-content-center'
              style={{ height: "100px" }}
            >
              <div className='spinner-border text-primary' role='status'></div>
            </div>
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
