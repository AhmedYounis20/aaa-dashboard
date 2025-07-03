import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import ColorModel from "../../../../interfaces/ProjectInterfaces/Inventory/Colors/ColorModel";
import { toastify } from '../../../../Helper/toastify';
import {
  createColor,
  deleteColor,
  getColorById,
  updateColor,
  getNextColorCode,
} from "../../../../Apis/Inventory/ColorsApi";
import InputText from '../../../../Components/Inputs/InputText';
import InputColorPicker from '../../../../Components/Inputs/InputColorPicker';
import { ColorSchema } from '../../../../interfaces/ProjectInterfaces/Inventory/Colors/color-validation';
import * as yup from 'yup';

const ColorsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<ColorModel>({
    id: "",
    code: "",
    name: "",
    nameSecondLanguage: "",
    colorValue: "#000000",
  });
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formType !== FormTypes.Add) {
      const fetchData = async () => {
        const result = await getColorById(id);
        if (result) {
          setModel(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      const fetchNextCode = async () => {
        const result = await getNextColorCode();
        if (result && result.isSuccess) {
          setModel((prev) => ({ ...prev, code: result.result }));
        }
        setIsLoading(false);
      };
      fetchNextCode();
    }
  }, [formType, id]);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteColor(id);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response) {
      response.errorMessages?.forEach((error: string) => toastify(error, "error"));
      return false;
    }
    return false;
  };

  const validate = async () => {
    try {
      await ColorSchema.validate(model, { abortEarly: false });
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

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const response = await updateColor(model.id, model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response && response.errorMessages) {
      toastify(response.errorMessages[0], "error");
      return false;
    }
    return false;
  };

  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createColor(model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response && response.errorMessages) {
      toastify(response.errorMessages[0], "error");
      return false;
    }
    return false;
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        isModal
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      >
        <div>
          {isLoading ? (
            <div className="d-flex flex-row align-items-center justify-content-center" style={{ height: "100px" }}>
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>{t("AreYouSureDelete")} {model?.nameSecondLanguage}</p>
              ) : (
                <>
                  <div className="row mb-3">
                    <div className="col col-md-4">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label={t("Code")}
                        variant="outlined"
                        fullWidth
                        disabled
                        value={model?.code}
                      />
                    </div>
                    <div className="col col-md-4">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label={t("Name")}
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(value) => setModel((prev) => ({ ...prev, name: value }))}
                        error={Boolean(errors.name)}
                        helperText={errors.name ? t(errors.name) : undefined}
                      />
                    </div>
                    <div className="col col-md-4">
                      <InputText
                        type="text"
                        className="form-input form-control"
                        label={t("NameSecondLanguage")}
                        variant="outlined"
                        fullWidth
                        disabled={formType === FormTypes.Details}
                        value={model?.nameSecondLanguage}
                        onChange={(value) => setModel((prev) => ({ ...prev, nameSecondLanguage: value }))}
                        error={Boolean(errors.nameSecondLanguage)}
                        helperText={errors.nameSecondLanguage ? t(errors.nameSecondLanguage) : undefined}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col col-md-4">
                      <InputColorPicker
                        label={t("ColorValue")}
                        value={model?.colorValue}
                        disabled={formType === FormTypes.Details}
                        onChange={value => setModel(prev => ({ ...prev, colorValue: value }))}
                        name="colorValue"
                        error={Boolean(errors.colorValue)}
                        helperText={errors.colorValue ? t(errors.colorValue) : undefined}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default ColorsForm; 