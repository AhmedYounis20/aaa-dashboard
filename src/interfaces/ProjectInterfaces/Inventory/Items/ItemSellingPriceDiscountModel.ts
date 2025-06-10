import { DiscountType } from "./DiscountType";

interface ItemSellingPriceDiscountModel {
  sellingPriceId: string;
  discount : number;
  discountType : DiscountType;
  name: string;
  nameSecondLanguage: string;
}

export default ItemSellingPriceDiscountModel;