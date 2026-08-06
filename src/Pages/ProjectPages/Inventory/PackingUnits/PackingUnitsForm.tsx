import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseForm from "../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../interfaces/Components/FormType";
import PackingUnitModel from "../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/PackingUnitModel";
import InputText from "../../../../Components/Inputs/InputText";
import { PackingUnitSchema } from "../../../../interfaces/ProjectInterfaces/Inventory/PackingUnits/validation-packingUnit";
import Loader from "../../../../Components/Loader";
import { handleValidationErrors } from "../../../../Helper/validationHelper";
import {
  usePackingUnitDetail,
  usePackingUnitMutations,
} from "../../../../hooks/queries";

const defaultModel: PackingUnitModel = {
  id: "",
  name: "",
  nameSecondLanguage: "",
};

const PackingUnitsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<PackingUnitModel>(defaultModel);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: fetchedModel, isLoading: isDetailLoading } = usePackingUnitDetail(id, formType);
  const { createMutation, updateMutation, deleteMutation } = usePackingUnitMutations();

  useEffect(() => {
    if (fetchedModel) {
      setModel(fetchedModel);
    }
  }, [fetchedModel]);

  useEffect(() => {
    if (formType === FormTypes.Add) {
      setModel(defaultModel);
    }
  }, [formType]);

  const isLoading = formType !== FormTypes.Add && isDetailLoading;

  const validate = async () => {
    try {
      await PackingUnitSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      setErrors(handleValidationErrors(validationErrors));
      return false;
    }
  };

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
            <Loader />
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>
                  {t("AreYouSureDelete")} {model?.nameSecondLanguage}
                </p>
              ) : (
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
                          prevModel ? { ...prevModel, name: value } : prevModel
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
                            ? { ...prevModel, nameSecondLanguage: value }
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
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default PackingUnitsForm;
