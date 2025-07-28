import { useEffect, useState } from 'react';
import BaseForm from '../../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../../interfaces/Components/FormType';
import { CollectionBookModel } from '../../../../../interfaces/ProjectInterfaces';
import {
  createCollectionBook,
  deleteCollectionBook,
  getCollectionBookById,
  updateCollectionBook,
} from "../../../../../Apis/Account/CollectionBooksApi";
import InputText from '../../../../../Components/Inputs/InputText';
import { useTranslation } from 'react-i18next';
import { CollectionBookSchema } from '../../../../../interfaces/ProjectInterfaces/Account/CollectionBooks/validation-collectionBook';

const CollectionBooksForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction?: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<CollectionBookModel>({
    id: "",
    name: "",
    nameSecondLanguage: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCollectionBook = async () => {
      if (formType !== FormTypes.Add) {
        setIsLoading(true);
        try {
          const response = await getCollectionBookById(id);
          if (response?.result) {
            setModel(response.result);
          }
        } catch (error) {
          console.error('Error fetching collection book:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCollectionBook();
  }, [formType, id]);

  const validate = async () => {
    try {
      await CollectionBookSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as any).inner.forEach((error: any) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteCollectionBook(id);
    if (response?.result) {
      afterAction && afterAction();
      return true;
    } else {
      console.log(response);
      response?.errorMessages?.map((error: string) => {
        console.log(error);
      });
      return false;
    }
  };

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const response = await updateCollectionBook(model.id, model);
    if (response?.result) {
      afterAction && afterAction();
      return true;
    }
    return false;
  };

  const handleAdd = async () => {
    if ((await validate()) === false) return false;
    const response = await createCollectionBook(model);
    if (response?.result) {
      console.log(response);
      afterAction && afterAction();
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
                        disabled={formType === FormTypes.Details}
                        value={model?.name}
                        onChange={(value) => {
                          setModel((prevModel) =>
                            prevModel
                              ? { ...prevModel, name: value }
                              : prevModel
                          );
                        }}
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
                        onChange={(value) => {
                          setModel((prevModel) =>
                            prevModel
                              ? {
                                  ...prevModel,
                                  nameSecondLanguage: value,
                                }
                              : prevModel
                          );
                        }}
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

export default CollectionBooksForm;
