import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseForm from "@/Components/Forms/BaseForm";
import { FormTypes } from "@/interfaces/Components/FormType";
import SellingPriceModel from "@/interfaces/ProjectInterfaces/Inventory/SellingPrices/SellingPriceModel";
import InputText from "@/Components/Inputs/InputText";
import { SellingPriceSchema } from "@/interfaces/ProjectInterfaces/Inventory/SellingPrices/validation-sellingPrice";
import Loader from "@/Components/Loader";
import { ErrorState } from "@/Components/feedback";
import { useSellingPriceDetail, useSellingPriceMutations } from "@/hooks/queries";

const defaultModel: SellingPriceModel = {
  id: "",
  name: "",
  nameSecondLanguage: "",
};

const SellingPricesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
}> = ({ formType, id, handleCloseForm }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<SellingPriceModel>({ ...defaultModel });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: fetchedModel,
    isLoading: isDetailLoading,
    isError,
    refetch,
  } = useSellingPriceDetail(id, formType);
  const { createMutation, updateMutation, deleteMutation } = useSellingPriceMutations();

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
  const isDetailError = formType !== FormTypes.Add && isError;

  const validate = async () => {
    try {
      await SellingPriceSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as { inner: { path?: string; message: string }[] }).inner.forEach(
        (error) => {
          if (error.path) validationErrorsMap[error.path] = error.message;
        }
      );
      setErrors(validationErrorsMap);
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
          ) : isDetailError ? (
            <ErrorState onRetry={() => void refetch()} />
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
                      isRequired
                      disabled={formType === FormTypes.Details}
                      value={model?.name}
                      onChange={(value) => setModel((prevModel) => ({ ...prevModel, name: value }))}
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
                      isRequired
                      disabled={formType === FormTypes.Details}
                      value={model?.nameSecondLanguage}
                      onChange={(value) =>
                        setModel((prevModel) => ({
                          ...prevModel,
                          nameSecondLanguage: value,
                        }))
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

export default SellingPricesForm;
