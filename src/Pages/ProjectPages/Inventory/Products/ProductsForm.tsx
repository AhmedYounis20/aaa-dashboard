import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductNextCode,
  updateProduct,
} from "../../../../Apis/Inventory/ProductsApi";
import BaseForm from "../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../interfaces/Components/FormType";
// import ProductModel from '../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductModel';
import { getBranches } from "../../../../Apis/Account/BranchesApi";
import { getSuppliers } from "../../../../Apis/Account/SuppliersApi";
import { getTaxes } from "../../../../Apis/Account/TaxesApi";
import { getManufacturerCompanies } from "../../../../Apis/Inventory/ManufacturerCompaniesApi";
import BranchModel from "../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import SupplierModel from "../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel";
import { TaxModel } from "../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/TaxModel";
import ManufacturerCompanyModel from "../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { DiscountType } from "../../../../interfaces/ProjectInterfaces/Inventory/Products/DiscountType";
import { ProductType } from "../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductType";
// Removed imports for properties that belong to Variants, not Products
import { InfoOutlined, LayersOutlined } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { FiPackage } from "react-icons/fi";
import { LuLayers } from "react-icons/lu";
import { RiBarcodeFill } from "react-icons/ri";
import { v4 as uuid } from "uuid";
import type { ValidationError } from "yup";
import TabsComponent from "../../../../Components/UI/TabsComponent";
import { EMPTY_UUID } from "../../../../Utilities/SD";
import { NodeType } from "../../../../interfaces/Components/NodeType";
import { InventoryThresholdScope } from "../../../../interfaces/ProjectInterfaces/Inventory/InventoryThresholdScope";
import { ItemNodeType } from "../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemNodeType";
import ProductInputModel, {
  buildProductValidationSchema,
} from "../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";
import ProductPackingUnitModel from "../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductPackingUnitModel";
import { TrackedBy } from "../../../../interfaces/ProjectInterfaces/Inventory/Products/TrackedBy";
import BarCodesInput from "./Components/BarCodes";
import ExpiryLevelsInput from "./Components/ExpiryLevelsInput";
import InventoryThresholdsInput from "./Components/InventoryThresholdsInput";
import ProductAttributeDefinitionsSelector from "./Components/ProductAttributeDefinitionsSelector";
import ProductBasicInfoCard from "./Components/ProductBasicInfoCard";
import ProductCodesAndTypeCard from "./Components/ProductCodesAndTypeCard";
import ProductCostCentersInput from "./Components/ProductCostCentersInput";
import ProductDetailsCard from "./Components/ProductDetailsCard";
import ProductDiscountCard from "./Components/ProductDiscountCard";
import ProductPackingUnitsInput from "./Components/ProductPackingUnitsInput";
import ProductPictureUpload from "./Components/ProductPictureUpload";
import VariantCombinationBuilder from "./Components/VariantCombinationBuilder";

const ProductsForm: React.FC<{
  formType: FormTypes;
  id: string;
  parentId: string | null;
  handleCloseForm: () => void;
  afterAction: () => void;
  handleTranslate: (key: string) => string;
}> = ({
  formType,
  id,
  parentId,
  handleCloseForm,
  afterAction,
  handleTranslate,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const createProductPackingUnit: (
    isDefault?: boolean,
    orderNumber?: number,
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
    isSales: false,
    isPurchases: false,
    isDiscountBasedOnSellingPrice: false,
    productType: ProductType.Stock,
    trackedBy: TrackedBy.ByQuantity,
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
  const [manufacturerCompanies, setManufacturerCompanies] = useState<
    ManufacturerCompanyModel[]
  >([]);
  const [taxes, setTaxes] = useState<TaxModel[]>([]);
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<
    Record<string, string[]>
  >({});

  const validationSchema = buildProductValidationSchema(t);

  useEffect(() => {
    if (formType != FormTypes.Delete) {
      const fetchData = async () => {
        const result = await getSuppliers();
        if (result) {
          setSuppliers(
            result.result.filter((e) => e.nodeType == ItemNodeType.Domain),
          );
        }
        const companiesResult = await getManufacturerCompanies();
        if (companiesResult) {
          setManufacturerCompanies(companiesResult.result);
        }
        const taxesResult = await getTaxes();
        if (taxesResult && taxesResult.isSuccess) {
          setTaxes(
            taxesResult.result.filter((e) => e.nodeType === NodeType.Domain),
          );
        }
        const branchesResult = await getBranches();
        if (branchesResult?.result) {
          setBranches(branchesResult.result);
        }
      };
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
      (validationErrors as ValidationError).inner.forEach(
        (error: ValidationError) => {
          if (error.path) validationErrorsMap[error.path] = error.message;
        },
      );
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
            isSales: result.result.isSales ?? false,
            isPurchases: result.result.isPurchases ?? false,
            sellingPriceDiscounts: result.result.sellingPriceDiscounts ?? [],
            costCenters: (result.result.costCenters ?? []).map(
              (c: {
                id?: string;
                costCenterId: string | null;
                percent: number;
              }) => ({ ...c, id: c.id ?? uuid() }),
            ),
            packingUnits: result.result.packingUnits ?? [],
            variantCombinations:
              result.result.variantCombinations?.map((c) => ({
                ...c,
                isExisting: true,
              })) ?? [],
            inventoryThresholdScope:
              result.result.inventoryThresholdScope ??
              InventoryThresholdScope.All,
            inventoryThresholdBranchId:
              result.result.inventoryThresholdBranchId ?? null,
            inventoryThresholds: (result.result.inventoryThresholds ?? []).sort(
              (a: { level: number }, b: { level: number }) => a.level - b.level,
            ),
            expiryLevels: (result.result.expiryLevels ?? []).sort(
              (a: { level: number }, b: { level: number }) => a.level - b.level,
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
            prevModel ? { ...prevModel, code: result.result } : prevModel,
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
      costCenters:
        model.costCenters?.filter(
          (c) =>
            c.costCenterId != null && c.costCenterId !== "" && c.percent > 0,
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
      costCenters:
        model.costCenters?.filter(
          (c) =>
            c.costCenterId != null && c.costCenterId !== "" && c.percent > 0,
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
    <BaseForm
      formType={formType}
      handleCloseForm={handleCloseForm}
      handleAdd={handleAdd}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      isModal={false}
      title={
        model.nodeType === ItemNodeType.Domain
          ? handleTranslate("Product")
          : handleTranslate("Category")
      }
    >
      <div>
        {isLoading ? (
          <div
            className='d-flex flex-row align-items-center justify-content-center'
            style={{ height: "100px" }}
          >
            <div className='spinner-border text-primary' role='status'></div>
          </div>
        ) : (
          <>
            {formType === FormTypes.Delete ? (
              <p>
                {t("AreYouSureDelete")} {model?.nameSecondLanguage}
              </p>
            ) : (
              <>
                <ProductBasicInfoCard
                  formType={formType}
                  model={model}
                  setModel={setModel}
                  errors={errors}
                  handleTranslate={handleTranslate}
                />
                {model.nodeType === ItemNodeType.Domain && (
                  <TabsComponent
                    tabs={[
                      {
                        label: handleTranslate("GeneralInformation"),
                        icon: <FiPackage className='w-4 h-4' />,
                        isActive: true,
                        content: (
                          <>
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                variant='h6'
                                sx={{
                                  fontWeight: 600,
                                  color: "text.primary",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  fontSize: "1rem",
                                }}
                              >
                                {handleTranslate("GeneralInformation")}
                              </Typography>
                            </Box>
                            <Box
                              className='grid grid-cols-1 md:grid-cols-2 gap-4'
                              sx={{
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                pb: 2,
                              }}
                            >
                              <ProductCodesAndTypeCard
                                formType={formType}
                                model={model}
                                taxes={taxes}
                                setModel={setModel}
                                errors={errors}
                                handleTranslate={handleTranslate}
                              />
                              <Box>
                                <ProductPictureUpload
                                  productId={id}
                                  formType={formType}
                                  handleTranslate={handleTranslate}
                                  attachments={model.productAttachments || []}
                                  onAttachmentsChange={(attachments) =>
                                    setModel((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            productAttachments: attachments,
                                          }
                                        : prev,
                                    )
                                  }
                                />
                                <ProductCostCentersInput
                                  formType={formType}
                                  productCostCenters={model.costCenters ?? []}
                                  handleUpdate={(items) => {
                                    setModel((prevModel) =>
                                      prevModel
                                        ? { ...prevModel, costCenters: items }
                                        : prevModel,
                                    );
                                  }}
                                  handleTranslate={(key) =>
                                    handleTranslate(key)
                                  }
                                  errors={errors}
                                />

                                <BarCodesInput
                                  barCodes={model.barCodes}
                                  formType={formType}
                                  handleTranslate={(key) =>
                                    handleTranslate(key)
                                  }
                                  handleUpdate={(barCodes: string[]) =>
                                    setModel((prev) =>
                                      prev ? { ...prev, barCodes } : prev,
                                    )
                                  }
                                />
                              </Box>
                            </Box>
                            <ProductPackingUnitsInput
                              productPackingUnits={model.packingUnits || []}
                              handleTranslate={(key) => handleTranslate(key)}
                              formType={formType}
                              handleUpdate={(items) =>
                                setModel((prev) =>
                                  prev
                                    ? { ...prev, packingUnits: items }
                                    : prev,
                                )
                              }
                              errors={errors}
                            />
                          </>
                        ),
                      },
                      {
                        label: handleTranslate("Discount"),
                        icon: <RiBarcodeFill />,
                        isActive: true,
                        content: (
                          <>
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                variant='h6'
                                sx={{
                                  fontWeight: 600,
                                  color: "text.primary",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  fontSize: "1rem",
                                }}
                              >
                                {handleTranslate("DiscountDetails")}
                              </Typography>
                            </Box>
                            <Box>
                              <ProductDiscountCard
                                formType={formType}
                                model={model}
                                setModel={setModel}
                                handleTranslate={handleTranslate}
                              />
                            </Box>
                          </>
                        ),
                      },
                      {
                        label: handleTranslate("AttributesAndVariants"),
                        icon: <LuLayers />,
                        isActive: true,
                        content: (
                          <Box>
                            <ProductAttributeDefinitionsSelector
                              productAttributeDefinitions={
                                model.productAttributeDefinitions || []
                              }
                              onChange={(productAttributeDefinitions) =>
                                setModel((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        productAttributeDefinitions,
                                      }
                                    : prev,
                                )
                              }
                              handleTranslate={handleTranslate}
                              formType={formType}
                              selectedAttributeValues={selectedAttributeValues}
                              onSelectedAttributeValuesChange={
                                setSelectedAttributeValues
                              }
                            />
                            <VariantCombinationBuilder
                              combinations={model.variantCombinations || []}
                              onChange={(combinations) =>
                                setModel((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        variantCombinations: combinations,
                                      }
                                    : prev,
                                )
                              }
                              onProductApplyChanges={(val: boolean) => {
                                setModel((prev) =>
                                  prev
                                    ? { ...prev, applyDomainChanges: val }
                                    : prev,
                                );
                              }}
                              productApplyChanges={true}
                              handleTranslate={handleTranslate}
                              formType={formType}
                              productName={model.name || ""}
                              productAttributeDefinitions={
                                model.productAttributeDefinitions || []
                              }
                              selectedAttributeValues={selectedAttributeValues}
                              onSelectedAttributeValuesChange={
                                setSelectedAttributeValues
                              }
                            />
                          </Box>
                        ),
                      },
                      {
                        label: handleTranslate("AdditionalInformation"),
                        icon: <InfoOutlined />,
                        isActive: true,
                        content: (
                          <>
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                variant='h6'
                                sx={{
                                  fontWeight: 600,
                                  color: "text.primary",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  fontSize: "1rem",
                                }}
                              >
                                {handleTranslate("AdditionalInformation")}
                              </Typography>
                            </Box>
                            <ProductDetailsCard
                              formType={formType}
                              model={model}
                              setModel={setModel}
                              suppliers={suppliers}
                              manufacturerCompanies={manufacturerCompanies}
                              handleTranslate={handleTranslate}
                              errors={errors}
                            />
                            <InventoryThresholdsInput
                              formType={formType}
                              scope={model.inventoryThresholdScope}
                              branchId={model.inventoryThresholdBranchId}
                              thresholds={model.inventoryThresholds ?? []}
                              onScopeChange={(scope) =>
                                setModel((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        inventoryThresholdScope: scope,
                                      }
                                    : prev,
                                )
                              }
                              onBranchChange={(branchId) =>
                                setModel((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        inventoryThresholdBranchId: branchId,
                                      }
                                    : prev,
                                )
                              }
                              onThresholdsChange={(inventoryThresholds) =>
                                setModel((prev) =>
                                  prev
                                    ? { ...prev, inventoryThresholds }
                                    : prev,
                                )
                              }
                              branches={branches}
                              handleTranslate={handleTranslate}
                              errors={errors}
                            />
                            <ExpiryLevelsInput
                              formType={formType}
                              levels={model.expiryLevels ?? []}
                              onLevelsChange={(expiryLevels) =>
                                setModel((prev) =>
                                  prev ? { ...prev, expiryLevels } : prev,
                                )
                              }
                              handleTranslate={handleTranslate}
                              errors={errors}
                            />
                          </>
                        ),
                      },
                      {
                        label: handleTranslate("Compo"),
                        icon: <LayersOutlined />,
                        isActive: true,
                        content: (
                          <div className='card card-body shadow-sm rounded-3 border border-light-subtle'></div>
                        ),
                      },
                    ]}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </BaseForm>
  );
};

export default ProductsForm;
