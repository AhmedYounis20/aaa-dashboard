import React from "react";
import { ItemCodesAndTypeCard } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import ProductInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";

interface ProductCodesAndTypeCardProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const ProductCodesAndTypeCard: React.FC<ProductCodesAndTypeCardProps> = (props) => (
  <ItemCodesAndTypeCard kind="product" {...props} />
);

export default ProductCodesAndTypeCard;
