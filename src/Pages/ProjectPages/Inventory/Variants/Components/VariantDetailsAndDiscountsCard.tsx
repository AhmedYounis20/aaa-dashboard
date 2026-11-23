import React from "react";
import { ItemDetailsAndDiscountsCard } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import SupplierModel from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/Suppliers/SupplierModel";
import ManufacturerCompanyModel from "../../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { TaxModel } from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/Taxes/TaxModel";
import VariantInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";

interface VariantDetailsAndDiscountsCardProps {
  formType: FormTypes;
  model: VariantInputModel;
  setModel: React.Dispatch<React.SetStateAction<VariantInputModel>>;
  suppliers: SupplierModel[];
  manufacturerCompanies: ManufacturerCompanyModel[];
  taxes: TaxModel[];
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}

const VariantDetailsAndDiscountsCard: React.FC<VariantDetailsAndDiscountsCardProps> = (props) => (
  <ItemDetailsAndDiscountsCard kind="variant" {...props} />
);

export default VariantDetailsAndDiscountsCard;
