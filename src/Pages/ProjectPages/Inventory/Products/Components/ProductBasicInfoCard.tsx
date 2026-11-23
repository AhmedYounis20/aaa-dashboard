import React from "react";
import { ItemBasicInfoCard } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import ProductInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";

interface ProductBasicInfoCardProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const ProductBasicInfoCard: React.FC<ProductBasicInfoCardProps> = (props) => (
  <ItemBasicInfoCard kind="product" {...props} />
);

export default ProductBasicInfoCard;
