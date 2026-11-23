import React from "react";
import InputAutoComplete from "@/Components/Inputs/InputAutoComplete";
import InputText from "@/Components/Inputs/InputText";
import { FormTypes } from "@/interfaces/Components/FormType";
import SupplierModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Suppliers/SupplierModel";
import ManufacturerCompanyModel from "@/interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { TaxModel } from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Taxes/TaxModel";
import ItemCostCentersInput from "./ItemCostCentersInput";
import type { ItemKind, ItemSharedFormFields } from "./types";

interface ItemDetailsCardProps<T extends ItemSharedFormFields> {
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

function ItemDetailsCard<T extends ItemSharedFormFields>({
  kind,
  formType,
  model,
  setModel,
  suppliers,
  manufacturerCompanies,
  taxes,
  handleTranslate,
  errors,
}: ItemDetailsCardProps<T>) {
  const titleKey = kind === "product" ? "ProductDetails" : "VariantDetails";

  return (
    <div className="card card-body">
      <h5 className="mb-4">{handleTranslate(titleKey)}</h5>
      <div className="row mb-3">
        <div className="col col-md-6">
          <InputText
            type="text"
            className="form-input form-control"
            label={handleTranslate("Model")}
            variant="outlined"
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model?.model ?? null}
            onChange={(value) =>
              setModel((prevModel) => (prevModel ? { ...prevModel, model: value } : prevModel))
            }
          />
        </div>
        <div className="col col-md-6">
          <InputText
            type="text"
            className="form-input form-control"
            label={handleTranslate("Version")}
            variant="outlined"
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model.version ?? null}
            onChange={(value) =>
              setModel((prevModel) => (prevModel ? { ...prevModel, version: value } : prevModel))
            }
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col col-md-6">
          <InputText
            type="text"
            className="form-input form-control"
            label={handleTranslate("CountryOfOrigin")}
            variant="outlined"
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model.countryOfOrigin ?? null}
            onChange={(value) =>
              setModel((prevModel) =>
                prevModel ? { ...prevModel, countryOfOrigin: value } : prevModel
              )
            }
          />
        </div>
        <div className="col col-md-6">
          <InputAutoComplete
            options={suppliers?.map((item: { name: string; id: string }) => ({
              label: item.name,
              value: item.id,
            }))}
            label={handleTranslate("Suppliers")}
            value={model.suppliersIds}
            disabled={formType === FormTypes.Details}
            onChange={(value: string[] | null) => {
              setModel((prevModel) =>
                prevModel ? { ...prevModel, suppliersIds: value ?? [] } : prevModel
              );
            }}
            multiple={true}
            handleBlur={null}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col col-md-6">
          <InputAutoComplete
            options={manufacturerCompanies?.map((item: { name: string; id: string }) => ({
              label: item.name,
              value: item.id,
            }))}
            label={handleTranslate("ManufacturerCompanies")}
            value={model.manufacturerCompaniesIds}
            disabled={formType === FormTypes.Details}
            onChange={(value: string[] | null) => {
              setModel((prevModel) =>
                prevModel
                  ? {
                      ...prevModel,
                      manufacturerCompaniesIds: value ?? [],
                    }
                  : prevModel
              );
            }}
            multiple={true}
            handleBlur={null}
          />
        </div>
        <div className="col col-md-6">
          <InputAutoComplete
            options={taxes?.map((item: { name: string; id: string }) => ({
              label: item.name,
              value: item.id,
            }))}
            label={handleTranslate("SalesTaxes")}
            value={model.salesTaxIds ?? []}
            disabled={formType === FormTypes.Details}
            onChange={(value: string[] | null) => {
              setModel((prevModel) =>
                prevModel ? { ...prevModel, salesTaxIds: value ?? [] } : prevModel
              );
            }}
            multiple={true}
            handleBlur={null}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col col-md-6">
          <InputAutoComplete
            options={taxes?.map((item: { name: string; id: string }) => ({
              label: item.name,
              value: item.id,
            }))}
            label={handleTranslate("PurchaseTaxes")}
            value={model.purchaseTaxIds ?? []}
            disabled={formType === FormTypes.Details}
            onChange={(value: string[] | null) => {
              setModel((prevModel) =>
                prevModel ? { ...prevModel, purchaseTaxIds: value ?? [] } : prevModel
              );
            }}
            multiple={true}
            handleBlur={null}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col col-md-12">
          <ItemCostCentersInput
            formType={formType}
            costCenters={model.costCenters ?? []}
            handleUpdate={(items) => {
              setModel((prevModel) =>
                prevModel ? { ...prevModel, costCenters: items } : prevModel
              );
            }}
            handleTranslate={(key) => handleTranslate(key)}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsCard;
