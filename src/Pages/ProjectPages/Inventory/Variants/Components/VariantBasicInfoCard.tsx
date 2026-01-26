import React from "react";
import InputText from "../../../../../Components/Inputs/InputText";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import VariantInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";

interface VariantBasicInfoCardProps {
  formType: FormTypes;
  model: VariantInputModel;
  setModel: React.Dispatch<React.SetStateAction<VariantInputModel>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const VariantBasicInfoCard: React.FC<VariantBasicInfoCardProps> = ({
  model,
  setModel,
  errors,
  handleTranslate,
}) => {
  return (
    <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold text-dark-emphasis">
          📝 {handleTranslate("VariantBasicInfo")}
        </h5>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <InputText
            type="text"
            className="form-input form-control"
            label={handleTranslate("Name")}
            variant="outlined"
            fullWidth
            isRquired
            disabled
            value={model?.name}
            onChange={(value) =>
              setModel((prev) => (prev ? { ...prev, name: value } : prev))
            }
            error={!!errors.name}
            helperText={handleTranslate(errors.name)}
          />
        </div>

        <div className="col-md-6">
          <InputText
            type="text"
            className="form-input form-control"
            label={handleTranslate("NameSecondLanguage")}
            variant="outlined"
            fullWidth
            isRquired
            disabled
            value={model?.nameSecondLanguage ?? null}
            onChange={(value) =>
              setModel((prev) =>
                prev ? { ...prev, nameSecondLanguage: value } : prev
              )
            }
            error={!!errors.nameSecondLanguage}
            helperText={handleTranslate(errors.nameSecondLanguage)}
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <InputText
            type="text"
            className="form-input form-control"
            label={handleTranslate("Code")}
            isRquired
            variant="outlined"
            fullWidth
            disabled
            value={model?.code}
            onChange={(value) =>
              setModel((prev) => (prev ? { ...prev, code: value } : prev))
            }
            error={!!errors.code}
            helperText={handleTranslate(errors.code)}
          />
        </div>
      </div>
    </div>
  );
};

export default VariantBasicInfoCard;

