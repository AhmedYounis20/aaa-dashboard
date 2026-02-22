import { Box, Typography } from "@mui/material";
import React from "react";
import { FormTypes } from "../../../../../../interfaces/Components/FormType";
import BranchModel from "../../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Branches/BranchModel";
import SupplierModel from "../../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Suppliers/SupplierModel";
import ManufacturerCompanyModel from "../../../../../../interfaces/ProjectInterfaces/Inventory/ManufacturerCompanies/ManufacturerCompanyModel";
import ProductInputModel from "../../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";
import ExpiryLevelsInput from "../ExpiryLevelsInput";
import InventoryThresholdsInput from "../InventoryThresholdsInput";
import ProductDetailsCard from "../ProductDetailsCard";

interface AdditionalInformationTabProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  suppliers: SupplierModel[];
  manufacturerCompanies: ManufacturerCompanyModel[];
  branches: BranchModel[];
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const AdditionalInformationTab: React.FC<AdditionalInformationTabProps> = ({
  formType,
  model,
  setModel,
  suppliers,
  manufacturerCompanies,
  branches,
  errors,
  handleTranslate,
}) => {
  return (
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
            prev ? { ...prev, inventoryThresholdScope: scope } : prev,
          )
        }
        onBranchChange={(branchId) =>
          setModel((prev) =>
            prev ? { ...prev, inventoryThresholdBranchId: branchId } : prev,
          )
        }
        onThresholdsChange={(inventoryThresholds) =>
          setModel((prev) => (prev ? { ...prev, inventoryThresholds } : prev))
        }
        branches={branches}
        handleTranslate={handleTranslate}
        errors={errors}
      />
      <ExpiryLevelsInput
        formType={formType}
        levels={model.expiryLevels ?? []}
        onLevelsChange={(expiryLevels) =>
          setModel((prev) => (prev ? { ...prev, expiryLevels } : prev))
        }
        handleTranslate={handleTranslate}
        errors={errors}
      />
    </>
  );
};

export default AdditionalInformationTab;
