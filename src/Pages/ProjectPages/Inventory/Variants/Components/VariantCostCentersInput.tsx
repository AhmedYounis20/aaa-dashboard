import { ItemCostCentersInput } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import VariantCostCenterModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantCostCenterModel";

const VariantCostCentersInput: React.FC<{
  formType: FormTypes;
  variantCostCenters: VariantCostCenterModel[];
  handleUpdate: (costCenters: VariantCostCenterModel[]) => void;
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({ variantCostCenters, handleUpdate, ...rest }) => (
  <ItemCostCentersInput costCenters={variantCostCenters} handleUpdate={handleUpdate} {...rest} />
);

export default VariantCostCentersInput;
