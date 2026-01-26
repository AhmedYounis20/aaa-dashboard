import React from "react";
import InputSelect from "../../../../../Components/Inputs/InputSelect";
import InputText from "../../../../../Components/Inputs/InputText";
import updateModel from "../../../../../Helper/updateModelHelper";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import {
  ItemNodeType,
  ItemNodeTypeOptions,
} from "../../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemNodeType";
import ProductInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";

interface ProductBasicInfoCardProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const ProductBasicInfoCard: React.FC<ProductBasicInfoCardProps> = ({
  formType,
  model,
  setModel,
  errors,
  handleTranslate,
}) => {
  const filteredNodeTypeOptions = ItemNodeTypeOptions.filter(
    (opt) => opt.value !== ItemNodeType.SubDomain
  );

  return (
    <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold text-dark-emphasis">
          📝 {handleTranslate("ProductBasicInfo")}
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
            disabled={formType === FormTypes.Details}
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
            disabled={formType === FormTypes.Details}
            value={model?.nameSecondLanguage}
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
            disabled={formType === FormTypes.Details}
            value={model?.code}
            onChange={(value) =>
              setModel((prev) => (prev ? { ...prev, code: value } : prev))
            }
            error={!!errors.code}
            helperText={handleTranslate(errors.code)}
          />
        </div>

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
            onChange={({
              target,
            }: {
              target: { value: ItemNodeType };
            }) => updateModel(setModel, "nodeType", target.value)}
            name="NodeType"
            onBlur={null}
            error={undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductBasicInfoCard;

