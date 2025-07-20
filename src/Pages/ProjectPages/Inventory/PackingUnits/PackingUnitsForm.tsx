import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import  PackingUnitModel  from "../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel";
import {
  createPackingUnit,
  deletePackingUnit,
  getPackingUnitById,
  updatePackingUnit,
} from "../../../../Apis/Inventory/PackingUnitsApi";
import InputText from '../../../../Components/Inputs/InputText';
import { PackingUnitSchema } from '../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/validation-packingUnit';
import * as yup from 'yup';

const PackingUnitsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
const { t } = useTranslation();
  const [model, setModel] = useState<PackingUnitModel>({
    id: "",
    name: "",
    nameSecondLanguage: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // const [updateGuide] = useUpdatePackingUnitMutation();
  // const [createGuide] = useCreatePackingUnitMutation();
  // const [deleteGuide] = useDeletePackingUnitMutation();

  useEffect(() => {
    if (formType != FormTypes.Add) {
      const fetchData = async () => {
        const result = await getPackingUnitById(id);
        if (result) {
          setModel(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deletePackingUnit(id);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    } 
    return false;
  };
  const validate = async () => {
    try {
      await PackingUnitSchema.validate(model, { abortEarly: false });
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
    const response = await updatePackingUnit(model.id, model);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    } 
    return false;
  };
  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createPackingUnit(model);
    if (response && response.isSuccess) {
      afterAction();
      return true;
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
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "100px" }}
            >
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>{t("AreYouSureDelete")} {model?.nameSecondLanguage}</p>
              ) : (
                <>
                  <div className="row mb-3">
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
                              ? { ...prevModel, name: value }
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
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default PackingUnitsForm;
