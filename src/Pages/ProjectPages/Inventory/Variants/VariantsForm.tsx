import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createVariant,
  deleteVariant,
  getVariantById,
  updateVariant,
} from "../../../../Apis/Inventory/VariantsApi";
import BaseForm from "../../../../Components/Forms/BaseForm";
import { FormTypes } from "../../../../interfaces/Components/FormType";
import { ProductType } from "../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductType";
import { DiscountType } from "../../../../interfaces/ProjectInterfaces/Inventory/Products/DiscountType";
import SupplierModel from "../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel";
import { getSuppliers } from "../../../../Apis/Account/SuppliersApi";
import { getTaxes } from "../../../../Apis/Account/TaxesApi";
import { TaxModel } from "../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/TaxModel";
import ManufacturerCompanyModel from "../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import { getManufacturerCompanies } from "../../../../Apis/Inventory/ManufacturerCompaniesApi";
import { getBranches } from "../../../../Apis/Account/BranchesApi";
import BranchModel from "../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import { EMPTY_UUID } from "../../../../Utilities/SD";
import { InventoryThresholdScope } from "../../../../interfaces/ProjectInterfaces/Inventory/InventoryThresholdScope";
import InventoryThresholdsInput from "../Products/Components/InventoryThresholdsInput";
import ExpiryLevelsInput from "../Products/Components/ExpiryLevelsInput";
import { v4 as uuid } from "uuid";
import { ItemNodeType } from "../../../../interfaces/ProjectInterfaces/Inventory/Items/ItemNodeType";
import { NodeType } from "../../../../interfaces/Components/NodeType";
import VariantPictureUpload from "./Components/VariantPictureUpload";
import VariantPackingUnitsInput from "./Components/VariantPackingUnitsInput";
import VariantBasicInfoCard from "./Components/VariantBasicInfoCard";
import VariantCodesAndTypeCard from "./Components/VariantCodesAndTypeCard";
import VariantDetailsAndDiscountsCard from "./Components/VariantDetailsAndDiscountsCard";
import type { ValidationError } from "yup";
import VariantPackingUnitModel from "../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantPackingUnitModel";
import VariantInputModel, { buildVariantValidationSchema } from "../../../../interfaces/ProjectInterfaces/Inventory/Variants/VariantInputModel";

const VariantsForm: React.FC<{
  formType: FormTypes;
  id: string;
  handleCloseForm: () => void;
  afterAction: () => void;
  handleTranslate: (key: string) => string;
}> = ({
  formType,
  id,
  handleCloseForm,
  afterAction,
  handleTranslate,
}) => {
  const { t } = useTranslation();

  const createVariantPackingUnit: (
    isDefault?: boolean,
    orderNumber?: number,
  ) => VariantPackingUnitModel = (isDefault = false, orderNumber = 0) => {
    const packingUnit: VariantPackingUnitModel = {
      id: "",
      variantId: "",
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
  const [model, setModel] = useState<VariantInputModel>({
    id: EMPTY_UUID,
    code: "",
    name: "",
    nameSecondLanguage: "",
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
    variantAttachments: [],
    sellingPriceDiscounts: [],
    costCenters: [],
    packingUnits: [createVariantPackingUnit(true, 0)],
    isActive: false,
    productId: "",
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

  const validationSchema = buildVariantValidationSchema(t);

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
          setTaxes(taxesResult.result.filter((e) => e.nodeType === NodeType.Domain));
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
        const result = await getVariantById(id);
        if (result) {
          setModel({
            ...result.result,
            costCenters: (result.result.costCenters ?? []).map(
              (c: { id?: string; costCenterId: string | null; percent: number }) =>
                ({ ...c, id: c.id ?? uuid() })
            ),
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

    }
  }, [formType, id]);

  const handleDelete = async (): Promise<boolean> => {
    const response = await deleteVariant(id);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };

  const handleUpdate = async () => {
    if ((await validate()) === false) return false;
    const payload = {
      ...model,
      costCenters: model.costCenters?.filter(
        (c) => c.costCenterId != null && c.costCenterId !== "" && c.percent > 0
      ) ?? [],
    };
    const response = await updateVariant(id, payload);
    if (response && response.isSuccess) {
      afterAction();
      return true;
    }
    return false;
  };

  const handleAdd = async () => {
    console.log(model);
    if ((await validate()) === false) return false;

    const payload = {
      ...model,
      costCenters: model.costCenters?.filter(
        (c) => c.costCenterId != null && c.costCenterId !== "" && c.percent > 0
      ) ?? [],
    };
    const response = await createVariant(payload);
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
                <p>
                  {t("AreYouSureDelete")} {model?.nameSecondLanguage}
                </p>
              ) : (
                <>
                  <VariantBasicInfoCard
                    formType={formType}
                    model={model}
                    setModel={setModel}
                    errors={errors}
                    handleTranslate={handleTranslate}
                  />

                  {/* Variant Picture Card - Only for Domain variants */}
                  <VariantPictureUpload
                    variantId={id}
                    formType={formType}
                    attachments={model.variantAttachments || []}
                    onAttachmentsChange={(attachments) =>
                      setModel((prev) =>
                        prev
                          ? { ...prev, variantAttachments: attachments }
                          : prev,
                      )
                    }
                  />

                  <VariantCodesAndTypeCard
                    formType={formType}
                    model={model}
                    setModel={setModel}
                    errors={errors}
                    handleTranslate={handleTranslate}
                  />

                  <VariantDetailsAndDiscountsCard
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
                    <VariantPackingUnitsInput
                      variantPackingUnits={model.packingUnits || []}
                      handleTranslate={(key) => handleTranslate(key)}
                      formType={formType}
                      handleUpdate={(items) =>
                        setModel((prev) =>
                          prev ? { ...prev, packingUnits: items } : prev,
                        )
                      }
                      errors={errors}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </BaseForm>
    </div>
  );
};

export default VariantsForm;
