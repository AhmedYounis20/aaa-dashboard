import React from "react";
import InputSelect from "@/Components/Inputs/InputSelect";
import InputText from "@/Components/Inputs/InputText";
import updateModel from "@/Helper/updateModelHelper";
import { FormTypes } from "@/interfaces/Components/FormType";
import {
  ProductNodeType,
  ProductNodeTypeOptions,
} from "@/interfaces/ProjectInterfaces/Inventory/Products/ProductNodeType";
import type { ItemKind, ItemSharedFormFields } from "./types";

interface ItemBasicInfoCardProps<T extends ItemSharedFormFields> {
  kind: ItemKind;
  formType: FormTypes;
  model: T;
  setModel: React.Dispatch<React.SetStateAction<T>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

function ItemBasicInfoCard<T extends ItemSharedFormFields>({
  kind,
  formType,
  model,
  setModel,
  errors,
  handleTranslate,
}: ItemBasicInfoCardProps<T>) {
  const isProduct = kind === "product";
  const fieldsDisabled = isProduct ? formType === FormTypes.Details : true;

  const filteredNodeTypeOptions = ProductNodeTypeOptions.filter(
    (opt) => opt.value !== ProductNodeType.SubDomain
  );

  const titleKey = isProduct ? "ProductBasicInfo" : "VariantBasicInfo";

  return (
    <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold text-dark-emphasis">📝 {handleTranslate(titleKey)}</h5>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <InputText
            type="text"
            className="form-input form-control"
            label={handleTranslate("Name")}
            variant="outlined"
            fullWidth
            isRequired
            disabled={fieldsDisabled}
            value={model?.name}
            onChange={(value) => setModel((prev) => (prev ? { ...prev, name: value } : prev))}
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
            isRequired
            disabled={fieldsDisabled}
            value={model?.nameSecondLanguage ?? null}
            onChange={(value) =>
              setModel((prev) => (prev ? { ...prev, nameSecondLanguage: value } : prev))
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
            isRequired
            variant="outlined"
            fullWidth
            disabled={fieldsDisabled}
            value={model?.code}
            onChange={(value) => setModel((prev) => (prev ? { ...prev, code: value } : prev))}
            error={!!errors.code}
            helperText={handleTranslate(errors.code)}
          />
        </div>

        {isProduct && (
          <div className="col-md-6">
            <InputSelect
              options={filteredNodeTypeOptions.map((e) => ({
                ...e,
                label: handleTranslate(e.label),
              }))}
              label={handleTranslate("NodeType")}
              defaultValue={model?.nodeType}
              disabled={formType !== FormTypes.Add}
              multiple={false}
              onChange={({ target }: { target: { value: ProductNodeType } }) =>
                updateModel(setModel, "nodeType", target.value)
              }
              name="NodeType"
              onBlur={null}
              error={undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemBasicInfoCard;
