import { ItemSellingPriceDiscountsInput } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import ProductSellingPriceDiscountModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductSellingPriceDiscountModel";

const ProductSellingPriceDiscountsInput: React.FC<{
  formType: FormTypes;
  productSellingPriceDiscounts: ProductSellingPriceDiscountModel[];
  handleUpdate: (sellingPriceDiscounts: ProductSellingPriceDiscountModel[]) => void;
  handleTranslate: (key: string) => string;
}> = ({ productSellingPriceDiscounts, handleUpdate, ...rest }) => (
  <ItemSellingPriceDiscountsInput
    sellingPriceDiscounts={productSellingPriceDiscounts}
    handleUpdate={handleUpdate}
    {...rest}
  />
);

export default ProductSellingPriceDiscountsInput;
