import { ItemSellingPriceDiscountsInput } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import VariantSellingPriceDiscountModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantSellingPriceDiscountModel";

const VariantSellingPriceDiscountsInput: React.FC<{
  formType: FormTypes;
  variantSellingPriceDiscounts: VariantSellingPriceDiscountModel[];
  handleUpdate: (sellingPriceDiscounts: VariantSellingPriceDiscountModel[]) => void;
  handleTranslate: (key: string) => string;
}> = ({ variantSellingPriceDiscounts, handleUpdate, ...rest }) => (
  <ItemSellingPriceDiscountsInput
    sellingPriceDiscounts={variantSellingPriceDiscounts}
    handleUpdate={handleUpdate}
    {...rest}
  />
);

export default VariantSellingPriceDiscountsInput;
