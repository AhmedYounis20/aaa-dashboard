import { DiscountType } from "./DiscountType";

interface ProductSellingPriceDiscountModel {
  sellingPriceId: string;
  discount : number;
  discountType : DiscountType;
  name: string;
  nameSecondLanguage: string;
}

export default ProductSellingPriceDiscountModel;


