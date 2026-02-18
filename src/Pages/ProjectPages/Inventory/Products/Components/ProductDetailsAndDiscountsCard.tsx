import React from "react";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import SupplierModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel";
import ManufacturerCompanyModel from "../../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import ProductInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";
import ProductDetailsCard from "./ProductDetailsCard";
import ProductDiscountCard from "./ProductDiscountCard";

interface ProductDetailsAndDiscountsCardProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  suppliers: SupplierModel[];
  manufacturerCompanies: ManufacturerCompanyModel[];
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}

const ProductDetailsAndDiscountsCard: React.FC<
  ProductDetailsAndDiscountsCardProps
> = ({
  formType,
  model,
  setModel,
  suppliers,
  manufacturerCompanies,
  handleTranslate,
  errors,
}) => {
  return (
    <div className='card card-body shadow-sm mb-3 rounded-3 border border-light-subtle'>
      <div className='row'>
        <div className='col col-md-6'>
          <ProductDetailsCard
            formType={formType}
            model={model}
            setModel={setModel}
            suppliers={suppliers}
            manufacturerCompanies={manufacturerCompanies}
            handleTranslate={handleTranslate}
            errors={errors}
          />
        </div>
        <div className='col col-md-6'>
          <ProductDiscountCard
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

export default ProductDetailsAndDiscountsCard;
