import React from "react";
import { ItemBasicInfoCard } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import VariantInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";

interface VariantBasicInfoCardProps {
  formType: FormTypes;
  model: VariantInputModel;
  setModel: React.Dispatch<React.SetStateAction<VariantInputModel>>;
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const VariantBasicInfoCard: React.FC<VariantBasicInfoCardProps> = (props) => (
  <ItemBasicInfoCard kind="variant" {...props} />
);

export default VariantBasicInfoCard;
