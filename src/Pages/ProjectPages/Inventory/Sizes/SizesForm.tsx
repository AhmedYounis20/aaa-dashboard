import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
import SizeModel from "../../../../interfaces/ProjectInterfaces/Inventory/Sizes/SizeModel";
import {
  createSize,
  deleteSize,
  getSizeById,
  updateSize,
  getNextSizeCode,
} from "../../../../Apis/Inventory/SizesApi";
import InputText from '../../../../Components/Inputs/InputText';

const SizesForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
}> = ({ formType, id, handleCloseForm, afterAction }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState<SizeModel>({
    id: "",
    code: "",
    name: "",
    nameSecondLanguage: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(formType != FormTypes.Add);

  useEffect(() => {
    if (formType !== FormTypes.Add) {
      const fetchData = async () => {
        const result = await getSizeById(id);
        if (result) {
          setModel(result.result);
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      const fetchNextCode = async () => {
        const result = await getNextSizeCode();
        if (result && result.isSuccess) {
          setModel((prev) => ({ ...prev, code: result.result }));
        }
        setIsLoading(false);
      };
      fetchNextCode();
    }
  }, [formType, id]);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteSize(id);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    } 
    return false;
  };
  const handleUpdate = async () => {
    const response = await updateSize(model.id, model);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    } 
    return false;
  };
  const handleAdd = async () => {
    const response = await createSize(model);
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

export default SizesForm; 