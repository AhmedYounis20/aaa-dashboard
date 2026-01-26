import React from "react";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import InputText from "../../../../../Components/Inputs/InputText";
import BarCodesInput from "../../Products/Components/BarCodes";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import {
  ProductType,
  ProductTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductType";
import updateModel from "../../../../../Helper/updateModelHelper";
import VariantInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";

interface VariantCodesAndTypeCardProps {
  formType: FormTypes;
  model: VariantInputModel;
  setModel: React.Dispatch<React.SetStateAction<VariantInputModel>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const VariantCodesAndTypeCard: React.FC<VariantCodesAndTypeCardProps> = ({
  formType,
  model,
  setModel,
  errors,
  handleTranslate,
}) => {
  return (
    <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold text-dark-emphasis">
          🧾 {handleTranslate("VariantCodesAndType")}
        </h5>
      </div>

      <div className="row g-3">
        <div className="col-md-3">
          <InputSelect
            options={ProductTypeOptions.map((e) => ({
              ...e,
              label: handleTranslate(e.label),
            }))}
            label={handleTranslate("ProductType")}
            defaultValue={model?.productType}
            disabled
            multiple={false}
            onChange={({
              target,
            }: {
              target: { value: ProductType };
            }) => updateModel(setModel, "variantType", target.value)}
            name="VariantType"
            onBlur={null}
            error={undefined}
          />
        </div>

        <div className="col-md-3">
          <InputText
            type="text"
            className="form-input form-control"
            label={handleTranslate("GS1Code")}
            variant="outlined"
            fullWidth
            disabled={
              formType === FormTypes.Details ||
              (model?.egsCode !== null && model?.egsCode !== "")
            }
            value={model?.gs1Code ?? null}
            onChange={(value) =>
              setModel((prev) => (prev ? { ...prev, gs1Code: value } : prev))
            }
            error={!!errors.gs1Code}
            helperText={
              errors.gs1Code ? handleTranslate(errors.gs1Code) : undefined
            }
          />
        </div>

        <div className="col-md-3">
          <InputText
            type="text"
            className="form-input form-control"
            label={handleTranslate("EGSCode")}
            variant="outlined"
            fullWidth
            disabled={
              formType === FormTypes.Details ||
              (model?.gs1Code !== null && model?.gs1Code !== "")
            }
            value={model?.egsCode ?? null}
            onChange={(value) =>
              setModel((prev) => (prev ? { ...prev, egsCode: value } : prev))
            }
            error={!!errors.egsCode}
            helperText={
              errors.egsCode ? handleTranslate(errors.egsCode) : undefined
            }
          />
        </div>

        <div className="col-md-3">
          <BarCodesInput
            barCodes={model.barCodes}
            formType={formType}
            handleTranslate={(key:any) => handleTranslate(key)}
            handleUpdate={(barCodes: string[]) =>
              setModel((prev) => (prev ? { ...prev, barCodes } : prev))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default VariantCodesAndTypeCard;

