import React from "react";
import { ItemDiscountCard } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import VariantInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";

interface VariantDiscountCardProps {
  formType: FormTypes;
  model: VariantInputModel;
  setModel: React.Dispatch<React.SetStateAction<VariantInputModel>>;
  handleTranslate: (key: string) => string;
}

const VariantDiscountCard: React.FC<VariantDiscountCardProps> = (props) => (
  <ItemDiscountCard {...props} />
);

export default VariantDiscountCard;
