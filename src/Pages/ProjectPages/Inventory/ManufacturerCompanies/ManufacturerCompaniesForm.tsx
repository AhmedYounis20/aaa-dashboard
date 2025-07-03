import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import  ManufacturerCompanyModel  from "../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { toastify } from '../../../../Helper/toastify';
import {
  createManufacturerCompany,
  deleteManufacturerCompany,
  getManufacturerCompanyById,
  updateManufacturerCompany,
} from "../../../../Apis/Inventory/ManufacturerCompaniesApi";
import InputText from '../../../../Components/Inputs/InputText';

const ManufacturerCompaniesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
const { t } = useTranslation();
  const [model, setModel] = useState<ManufacturerCompanyModel>({
    id: "",
    name: "",
    nameSecondLanguage: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(
    formType != FormTypes.Add
  );

  // const [updateGuide] = useUpdateManufacturerCompanyMutation();
  // const [createGuide] = useCreateManufacturerCompanyMutation();
  // const [deleteGuide] = useDeleteManufacturerCompanyMutation();

  useEffect(() => {
    if (formType != FormTypes.Add) {
      const fetchData = async () => {
        const result = await getManufacturerCompanyById(id);
        if (result) {
          setModel(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteManufacturerCompany(id);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      afterAction();
      return true;
    } else if (response) {
      console.log(response);
      response.errorMessages?.map((error: string) => {
        toastify(error, "error");
        console.log(error);
      });
      return false;
    }
    return false;
  };
  const handleUpdate = async () => {
    const response = await updateManufacturerCompany(model.id, model);
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
    const response = await createManufacturerCompany(model);
    if (response && response.isSuccess) {
      toastify(response.successMessage);
      console.log(response);
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
                        onChange={(value) =>
                          setModel((prevModel) =>
                            prevModel
                              ? { ...prevModel, name: value }
                              : prevModel
                          )
                        }
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

export default ManufacturerCompaniesForm;
