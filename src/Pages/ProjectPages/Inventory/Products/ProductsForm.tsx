import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { createProduct, deleteProduct, getProductById, getProductNextCode, updateProduct } from "../../../../Apis/Inventory/ProductsApi";
import BaseForm from '../../../../Components/Forms/BaseForm';
import { FormTypes } from '../../../../interfaces/Components/FormType';
// import ProductModel from '../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductModel';
import { ProductType } from '../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductType';
import { DiscountType } from '../../../../interfaces/ProjectInterfaces/Inventory/Products/DiscountType';
import SupplierModel from '../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel';
import { getSuppliers } from '../../../../Apis/Account/SuppliersApi';
import { getTaxes } from '../../../../Apis/Account/TaxesApi';
import { TaxModel } from '../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/TaxModel';
import ManufacturerCompanyModel from '../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel';
import { getManufacturerCompanies } from '../../../../Apis/Inventory/ManufacturerCompaniesApi';
import { getBranches } from '../../../../Apis/Account/BranchesApi';
import BranchModel from '../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel';
// Removed imports for properties that belong to Variants, not Products
import { EMPTY_UUID } from '../../../../Utilities/SD';
import { InventoryThresholdScope } from '../../../../interfaces/ProjectInterfaces/Inventory/InventoryThresholdScope';
import InventoryThresholdsInput from './Components/InventoryThresholdsInput';
import ExpiryLevelsInput from './Components/ExpiryLevelsInput';
import { v4 as uuid } from "uuid";
import { ItemNodeType } from '../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemNodeType';
import { NodeType } from '../../../../interfaces/Components/NodeType';
import ProductPictureUpload from './Components/ProductPictureUpload';
import VariantCombinationBuilder from './Components/VariantCombinationBuilder';
import ProductAttributeDefinitionsSelector from './Components/ProductAttributeDefinitionsSelector';
import ProductPackingUnitsInput from './Components/ProductPackingUnitsInput';
import ProductBasicInfoCard from './Components/ProductBasicInfoCard';
import ProductCodesAndTypeCard from './Components/ProductCodesAndTypeCard';
import ProductDetailsAndDiscountsCard from './Components/ProductDetailsAndDiscountsCard';
import type { ValidationError } from "yup";
import ProductPackingUnitModel from '../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductPackingUnitModel';
import ProductInputModel, { buildProductValidationSchema } from '../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel';

const ProductsForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction: () => void;
  handleTranslate: (key: string) => string;
}> = ({ formType, id, parentId, handleCloseForm, afterAction, handleTranslate }) => {
  const { t } = useTranslation();
  
  const createProductPackingUnit: (
    isDefault?: boolean,
    orderNumber?: number
  ) => ProductPackingUnitModel = (isDefault = false, orderNumber = 0) => {
    const packingUnit: ProductPackingUnitModel = {
      id: "",
      productId: "",
      packingUnitId: "",
      name: "",
      averageCostPrice: 0,
      isDefaultPackingUnit: isDefault,
      isDefaultPurchases: true,
      isDefaultSales: true,
      lastCostPrice: 0,
      orderNumber,
      partsCount: 1,
      sellingPrices: [],
      createdAt: "",
      modifiedAt: "",
    };

    return packingUnit;
  };
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [model, setModel] = useState<ProductInputModel>({
    id: EMPTY_UUID,
    parentId: parentId,
    code: "",
    name: "",
    nameSecondLanguage: "",
    nodeType: ItemNodeType.Domain,
    defaultDiscountType: DiscountType.Percent,
    barCodes: [],
    suppliersIds: [],
    manufacturerCompaniesIds: [],
    salesTaxIds: [],
    purchaseTaxIds: [],
    conditionalDiscount: 0,
    countryOfOrigin: "",
    defaultDiscount: 0,
    egsCode: "",
    gs1Code: "",
    isDiscountBasedOnSellingPrice: false,
    productType: ProductType.Stock,
    maxDiscount: 100,
    model: "",
    version: "",
    productAttachments: [],
    productAttributeDefinitions: [],
    sellingPriceDiscounts: [],
    costCenters: [],
    packingUnits: [createProductPackingUnit(true, 0)],
    variantCombinations: [],
    inventoryThresholdScope: InventoryThresholdScope.All,
    inventoryThresholdBranchId: null,
    inventoryThresholds: [],
    expiryLevels: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [manufacturerCompanies, setManufacturerCompanies] = useState<ManufacturerCompanyModel[]>([]);
  const [taxes, setTaxes] = useState<TaxModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);

  const validationSchema = buildProductValidationSchema(t);

  useEffect(() => {
    if (formType != FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getSuppliers();
        if (result) {
          setSuppliers(
            result.result.filter((e) => e.nodeType == ItemNodeType.Domain)
          );
        }
        const companiesResult = await getManufacturerCompanies();
        if (companiesResult) {
          setManufacturerCompanies(companiesResult.result);
        }
        const taxesResult = await getTaxes();
        if (taxesResult && taxesResult.isSuccess) {
          setTaxes(taxesResult.result.filter((e) => e.nodeType === NodeType.Domain));
        }
        const branchesResult = await getBranches();
        if (branchesResult?.result) {
          setBranches(branchesResult.result);
        }
      }
      fetchData();
    }
  }, [formType]);

  const validate = async () => {
    try {
      await validationSchema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const validationErrorsMap: Record<string, string> = {};
      (validationErrors as ValidationError).inner.forEach((error: ValidationError) => {
        if (error.path) validationErrorsMap[error.path] = error.message;
      });
      setErrors(validationErrorsMap);
      return false;
    }
  };

  useEffect(() => {
    if (formType != FormTypes.Add) {
      const fetchData = async () => {
        const result = await getProductById(id);
        if (result) {         
            setModel({
              ...result.result,
              sellingPriceDiscounts: result.result.sellingPriceDiscounts ?? [],
              costCenters: (result.result.costCenters ?? []).map(
                (c: { id?: string; costCenterId: string | null; percent: number }) =>
                  ({ ...c, id: c.id ?? uuid() })
              ),
              packingUnits: result.result.packingUnits ?? [],
              variantCombinations:
                result.result.variantCombinations?.map(c => ({
                  ...c,
                  isExisting: true
                })) ?? [],
              inventoryThresholdScope: result.result.inventoryThresholdScope ?? InventoryThresholdScope.All,
              inventoryThresholdBranchId: result.result.inventoryThresholdBranchId ?? null,
              inventoryThresholds: (result.result.inventoryThresholds ?? []).sort(
                (a: { level: number }, b: { level: number }) => a.level - b.level
              ),
              expiryLevels: (result.result.expiryLevels ?? []).sort(
                (a: { level: number }, b: { level: number }) => a.level - b.level
              ),
            });

            setIsLoading(false);
        }
      };
      fetchData();
    } else {
      const fetchData = async () => {
        const result = await getProductNextCode(parentId);
        if (result.isSuccess && result.result) {
          setModel((prevModel) =>
            prevModel ? { ...prevModel, code: result.result } : prevModel
          );
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [formType, id, parentId]);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteProduct(id);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    } 
    return false;
  };
  
  const handleUpdate = async () => {
    if ((await validate()) === false) return false;    
    const basePayload = {
      ...model,
      costCenters: model.costCenters?.filter(
        (c) => c.costCenterId != null && c.costCenterId !== "" && c.percent > 0
      ) ?? [],
    };
    const payload =
      model.nodeType === ItemNodeType.Category
        ? { ...basePayload, packingUnits: [] }
        : basePayload;
    const response = await updateProduct(id, payload);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };
  
  const handleAdd = async () => {
    console.log(model);
    if ((await validate()) === false) return false;
    
    // Send the full model with variantCombinations - let the backend handle variant creation
    const basePayload = {
      ...model,
      costCenters : model.costCenters?.filter(
        (c) => c.costCenterId != null && c.costCenterId !== "" && c.percent > 0
      ) ?? [],
    };
    const payload =
      model.nodeType === ItemNodeType.Category
        ? { ...basePayload, packingUnits: [] }
        : basePayload;
    const response = await createProduct(payload);
    if (response && response.isSuccess) {
      console.log(response);
      afterAction();
      return true;
    }
    return false;
  };

  return (
    <div className="container h-full">
      <BaseForm
        formType={formType}
        handleCloseForm={handleCloseForm}
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        isModal={false}
      >
        <div>
          {isLoading ? (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "100px" }}
            >
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              {formType === FormTypes.Delete ? (
                <p>{t("AreYouSureDelete")} {model?.nameSecondLanguage}</p>
              ) : (
                <>
                  <ProductBasicInfoCard
                    formType={formType}
                    model={model}
                    setModel={setModel}
                    errors={errors}
                    handleTranslate={handleTranslate}
                  />

                  {/* Product Picture Card - Only for Domain products */}
                  {model.nodeType === ItemNodeType.Domain && (
                    <ProductPictureUpload
                      productId={id}
                      formType={formType}
                      attachments={model.productAttachments || []}
                      onAttachmentsChange={(attachments) =>
                        setModel((prev) =>
                          prev ? { ...prev, productAttachments: attachments } : prev
                        )
                      }
                    />
                  )}

                  {/* Detailed sections - Only for Domain products */}
                  {model.nodeType === ItemNodeType.Domain && (
                    <>
                      <ProductCodesAndTypeCard
                        formType={formType}
                        model={model}
                        setModel={setModel}
                        errors={errors}
                        handleTranslate={handleTranslate}
                      />

                      <ProductDetailsAndDiscountsCard
                        formType={formType}
                        model={model}
                        setModel={setModel}
                        suppliers={suppliers}
                        manufacturerCompanies={manufacturerCompanies}
                        taxes={taxes}
                        handleTranslate={handleTranslate}
                        errors={errors}
                      />
                      <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
                        <InventoryThresholdsInput
                          formType={formType}
                          scope={model.inventoryThresholdScope}
                          branchId={model.inventoryThresholdBranchId}
                          thresholds={model.inventoryThresholds ?? []}
                          onScopeChange={(scope) =>
                            setModel((prev) => prev ? { ...prev, inventoryThresholdScope: scope } : prev)
                          }
                          onBranchChange={(branchId) =>
                            setModel((prev) => prev ? { ...prev, inventoryThresholdBranchId: branchId } : prev)
                          }
                          onThresholdsChange={(inventoryThresholds) =>
                            setModel((prev) => prev ? { ...prev, inventoryThresholds } : prev)
                          }
                          branches={branches}
                          handleTranslate={handleTranslate}
                          errors={errors}
                        />
                      </div>
                      <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
                        <ExpiryLevelsInput
                          formType={formType}
                          levels={model.expiryLevels ?? []}
                          onLevelsChange={(expiryLevels) =>
                            setModel((prev) => prev ? { ...prev, expiryLevels } : prev)
                          }
                          handleTranslate={handleTranslate}
                          errors={errors}
                        />
                      </div>
                      <div className="card card-body shadow-sm mb-3 rounded-3 border border-light-subtle">
                        <ProductPackingUnitsInput
                          productPackingUnits={model.packingUnits || []}
                          handleTranslate={(key)=>handleTranslate(key)}
                          formType={formType}
                          handleUpdate={(items) =>
                            setModel((prev) =>
                              prev ? { ...prev, packingUnits: items } : prev
                            )
                          }
                          errors={errors}
                        />
                      </div>
                    </>
                  )}

                  {/* Product Attribute Definitions Selector - Only for Domain products */}
                  {model.nodeType === ItemNodeType.Domain && (
                    <ProductAttributeDefinitionsSelector
                      productAttributeDefinitions={model.productAttributeDefinitions || []}
                      onChange={(productAttributeDefinitions) => setModel(prev => prev ? { ...prev, productAttributeDefinitions } : prev)}
                      handleTranslate={handleTranslate}
                      formType={formType}
                    />
                  )}

                  {/* Variant Combination Builder - Only for Domain products */}
                  {model.nodeType === ItemNodeType.Domain && (
                    <VariantCombinationBuilder
                      combinations={model.variantCombinations || []}
                      onChange={(combinations) => setModel(prev => prev ? { ...prev, variantCombinations: combinations } : prev)}
                      onProductApplyChanges={(val: boolean) => {
                        setModel(prev => prev ? { ...prev, applyDomainChanges: val } : prev);
                      }}
                      productApplyChanges={true}
                      handleTranslate={handleTranslate}
                      formType={formType}
                      productName={model.name || ''}
                      productAttributeDefinitions={model.productAttributeDefinitions || []}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default ProductsForm;



