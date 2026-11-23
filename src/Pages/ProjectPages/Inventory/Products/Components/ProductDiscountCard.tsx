import React from "react";
import { ItemDiscountCard } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import ProductInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";

interface ProductDiscountCardProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  handleTranslate: (key: string) => string;
}

const ProductDiscountCard: React.FC<ProductDiscountCardProps> = (props) => (
  <ItemDiscountCard {...props} />
);

export default ProductDiscountCard;
