import React from "react";
import InputSelect from "@/Components/Inputs/InputSelect";
import InputText from "@/Components/Inputs/InputText";
import updateModel from "@/Helper/updateModelHelper";
import { FormTypes } from "@/interfaces/Components/FormType";
import {
  ProductType,
  ProductTypeOptions,
} from "@/interfaces/ProjectInterfaces/Inventory/Products/ProductType";
import BarCodesInput from "./BarCodesInput";
import type { ItemKind, ItemSharedFormFields } from "./types";

interface ItemCodesAndTypeCardProps<T extends ItemSharedFormFields> {
  kind: ItemKind;
  formType: FormTypes;
  model: T;
  setModel: React.Dispatch<React.SetStateAction<T>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

function ItemCodesAndTypeCard<T extends ItemSharedFormFields>({
  kind,
  formType,
  model,
  setModel,
  errors,
  handleTranslate,
}: ItemCodesAndTypeCardProps<T>) {
  const isProduct = kind === "product";
  const titleKey = isProduct ? "ProductCodesAndType" : "VariantCodesAndType";
  const productTypeDisabled = isProduct ? formType === FormTypes.Details : true;

  return (
    <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold text-dark-emphasis">🧾 {handleTranslate(titleKey)}</h5>
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
            disabled={productTypeDisabled}
            multiple={false}
            onChange={({ target }: { target: { value: ProductType } }) =>
              updateModel(setModel, "productType", target.value)
            }
            name={isProduct ? "ProductType" : "VariantType"}
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
              formType === FormTypes.Details || (model?.egsCode !== null && model?.egsCode !== "")
            }
            value={model?.gs1Code ?? null}
            onChange={(value) => setModel((prev) => (prev ? { ...prev, gs1Code: value } : prev))}
            error={!!errors.gs1Code}
            helperText={errors.gs1Code ? handleTranslate(errors.gs1Code) : undefined}
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
              formType === FormTypes.Details || (model?.gs1Code !== null && model?.gs1Code !== "")
            }
            value={model?.egsCode ?? null}
            onChange={(value) => setModel((prev) => (prev ? { ...prev, egsCode: value } : prev))}
            error={!!errors.egsCode}
            helperText={errors.egsCode ? handleTranslate(errors.egsCode) : undefined}
          />
        </div>

        <div className="col-md-3">
          <BarCodesInput
            barCodes={model.barCodes}
            formType={formType}
            handleTranslate={(key) => handleTranslate(key)}
            handleUpdate={(barCodes: string[]) =>
              setModel((prev) => (prev ? { ...prev, barCodes } : prev))
            }
          />
        </div>
      </div>
    </div>
  );
}

export default ItemCodesAndTypeCard;
