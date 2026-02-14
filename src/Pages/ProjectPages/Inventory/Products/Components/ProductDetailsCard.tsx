import React from "react";
import InputAutoComplete from "../../../../../Components/Inputs/InputAutoCompelete";
import InputText from "../../../../../Components/Inputs/InputText";
import { FormTypes } from "../../../../../interfaces/Components/FormType";
import SupplierModel from "../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel";
import ManufacturerCompanyModel from "../../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import ProductInputModel from "../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";

interface ProductDetailsCardProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  suppliers: SupplierModel[];
  manufacturerCompanies: ManufacturerCompanyModel[];
  handleTranslate: (key: string) => string;
  errors: Record<string, string>;
}

const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({
  formType,
  model,
  setModel,
  suppliers,
  manufacturerCompanies,
  handleTranslate,
}) => {
  return (
    <div className='card card-body'>
      <h5 className='mb-4'>{handleTranslate("ProductDetails")}</h5>
      <div className='row mb-3'>
        <div className='col col-md-6'>
          <InputText
            type='text'
            className='form-input form-control'
            label={handleTranslate("Model")}
            variant='outlined'
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model?.model ?? null}
            onChange={(value) =>
              setModel((prevModel) =>
                prevModel ? { ...prevModel, model: value } : prevModel,
              )
            }
          />
        </div>
        <div className='col col-md-6'>
          <InputText
            type='text'
            className='form-input form-control'
            label={handleTranslate("Version")}
            variant='outlined'
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model.version ?? null}
            onChange={(value) =>
              setModel((prevModel) =>
                prevModel ? { ...prevModel, version: value } : prevModel,
              )
            }
          />
        </div>
      </div>
      <div className='row mb-3'>
        <div className='col col-md-6'>
          <InputText
            type='text'
            className='form-input form-control'
            label={handleTranslate("CountryOfOrigin")}
            variant='outlined'
            fullWidth
            disabled={formType === FormTypes.Details}
            value={model.countryOfOrigin ?? null}
            onChange={(value) =>
              setModel((prevModel) =>
                prevModel
                  ? { ...prevModel, countryOfOrigin: value }
                  : prevModel,
              )
            }
          />
        </div>
        <div className='col col-md-6'>
          <InputAutoComplete
            options={suppliers?.map((item: { name: string; id: string }) => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
            label={handleTranslate("Suppliers")}
            value={model.suppliersIds}
            disabled={formType === FormTypes.Details}
            onChange={(value: string[] | null) => {
              setModel((prevModel) => {
                return prevModel
                  ? {
                      ...prevModel,
                      suppliersIds: value ?? [],
                    }
                  : prevModel;
              });
            }}
            multiple={true}
            handleBlur={null}
          />
        </div>
      </div>
      <div className='row mb-3'>
        <div className='col col-md-6'>
          <InputAutoComplete
            options={manufacturerCompanies?.map(
              (item: { name: string; id: string }) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              },
            )}
            label={handleTranslate("ManufacturerCompanies")}
            value={model.manufacturerCompaniesIds}
            disabled={formType === FormTypes.Details}
            onChange={(value: string[] | null) => {
              setModel((prevModel) => {
                return prevModel
                  ? {
                      ...prevModel,
                      manufacturerCompaniesIds: value ?? [],
                    }
                  : prevModel;
              });
            }}
            multiple={true}
            handleBlur={null}
          />
        </div>
        <div className='col col-md-6'></div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
