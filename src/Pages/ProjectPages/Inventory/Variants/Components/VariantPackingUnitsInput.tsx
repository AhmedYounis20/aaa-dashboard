import { FormTypes } from "../../../../../interfaces/Components/FormType";
import ProductPackingUnitsInput from "../../Products/Components/ProductPackingUnitsInput";
import ProductPackingUnitModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductPackingUnitModel";
import VariantPackingUnitModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantPackingUnitModel";

const toProductUnits = (units: VariantPackingUnitModel[]): ProductPackingUnitModel[] =>
  units.map(({ variantId, ...rest }) => ({
    ...rest,
    productId: variantId,
  }));

const toVariantUnits = (units: ProductPackingUnitModel[]): VariantPackingUnitModel[] =>
  units.map(({ productId, ...rest }) => ({
    ...rest,
    variantId: productId,
  }));

const VariantPackingUnitsInput: React.FC<{
  formType: FormTypes;
  variantPackingUnits: VariantPackingUnitModel[];
  handleUpdate: (variantPackingUnits: VariantPackingUnitModel[]) => void;
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}> = ({ formType, variantPackingUnits, handleUpdate, handleTranslate, errors }) => (
  <ProductPackingUnitsInput
    formType={formType}
    productPackingUnits={toProductUnits(variantPackingUnits)}
    handleUpdate={(units) => handleUpdate(toVariantUnits(units))}
    handleTranslate={handleTranslate}
    errors={errors}
  />
);

export default VariantPackingUnitsInput;
