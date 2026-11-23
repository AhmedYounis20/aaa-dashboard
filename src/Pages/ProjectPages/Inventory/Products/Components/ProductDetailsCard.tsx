import React from "react";
import { ItemDetailsCard } from "@/modules/inventory/shared";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import SupplierModel from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/Suppliers/SupplierModel";
import ManufacturerCompanyModel from "../../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { TaxModel } from "../../../../../interfaces/ProjectInterfaces/Account/SubLedgers/Taxes/TaxModel";
import ProductInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";

interface ProductDetailsCardProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  suppliers: SupplierModel[];
  manufacturerCompanies: ManufacturerCompanyModel[];
  taxes: TaxModel[];
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}

const ProductDetailsCard: React.FC<ProductDetailsCardProps> = (props) => (
  <ItemDetailsCard kind="product" {...props} />
);

export default ProductDetailsCard;
