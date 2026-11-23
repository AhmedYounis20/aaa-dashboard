import React from "react";
import { FormTypes } from "@/interfaces/Components/FormType";
import SupplierModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Suppliers/SupplierModel";
import ManufacturerCompanyModel from "@/interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { TaxModel } from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Taxes/TaxModel";
import ItemDetailsCard from "./ItemDetailsCard";
import ItemDiscountCard from "./ItemDiscountCard";
import type { ItemKind, ItemSharedFormFields } from "./types";

interface ItemDetailsAndDiscountsCardProps<T extends ItemSharedFormFields> {
  kind: ItemKind;
  formType: FormTypes;
  model: T;
  setModel: React.Dispatch<React.SetStateAction<T>>;
  suppliers: SupplierModel[];
  manufacturerCompanies: ManufacturerCompanyModel[];
  taxes: TaxModel[];
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}

function ItemDetailsAndDiscountsCard<T extends ItemSharedFormFields>({
  kind,
  formType,
  model,
  setModel,
  suppliers,
  manufacturerCompanies,
  taxes,
  handleTranslate,
  errors,
}: ItemDetailsAndDiscountsCardProps<T>) {
  return (
    <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
      <div className="row">
        <div className="col col-md-6">
          <ItemDetailsCard
            kind={kind}
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
          <ItemDiscountCard
            formType={formType}
            model={model}
            setModel={setModel}
            handleTranslate={handleTranslate}
          />
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsAndDiscountsCard;
