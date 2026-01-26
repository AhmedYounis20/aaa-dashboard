import React from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import SupplierModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel";
import ManufacturerCompanyModel from "../../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { TaxModel } from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/TaxModel";
import VariantDetailsCard from "./VariantDetailsCard";
import VariantDiscountCard from "./VariantDiscountCard";
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

const VariantDetailsAndDiscountsCard: React.FC<
  VariantDetailsAndDiscountsCardProps
> = ({
  formType,
  model,
  setModel,
  suppliers,
  manufacturerCompanies,
  taxes,
  handleTranslate,
  errors,
}) => {
  return (
    <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
      <div className="row">
        <div className="col col-md-6">
          <VariantDetailsCard
            formType={formType}
            model={model}
            setModel={setModel}
            suppliers={suppliers}
            manufacturerCompanies={manufacturerCompanies}
            taxes={taxes}
            handleTranslate={handleTranslate}
            errors={errors}
          />
        </div>
        <div className="col col-md-6">
          <VariantDiscountCard
            formType={formType}
            model={model}
            setModel={setModel}
            handleTranslate={handleTranslate}
          />
        </div>
      </div>
    </div>
  );
};

export default VariantDetailsAndDiscountsCard;

