import React from "react";
import { ItemCodesAndTypeCard } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import VariantInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";

interface VariantCodesAndTypeCardProps {
  formType: FormTypes;
  model: VariantInputModel;
  setModel: React.Dispatch<React.SetStateAction<VariantInputModel>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const VariantCodesAndTypeCard: React.FC<VariantCodesAndTypeCardProps> = (props) => (
  <ItemCodesAndTypeCard kind="variant" {...props} />
);

export default VariantCodesAndTypeCard;
