import { ItemCostCentersInput } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import ProductCostCenterModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductCostCenterModel";

const ProductCostCentersInput: React.FC<{
  formType: FormTypes;
  productCostCenters: ProductCostCenterModel[];
  handleUpdate: (costCenters: ProductCostCenterModel[]) => void;
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({ productCostCenters, handleUpdate, ...rest }) => (
  <ItemCostCentersInput costCenters={productCostCenters} handleUpdate={handleUpdate} {...rest} />
);

export default ProductCostCentersInput;
