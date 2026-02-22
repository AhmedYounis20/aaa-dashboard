import { Box, Typography } from "@mui/material";
import React from "react";
import { FormTypes } from "../../../../../../interfaces/Components/FormType";
import { TaxModel } from "../../../../../../interfaces/ProjectInterfaces/Account/Subleadgers/Taxes/TaxModel";
import ProductInputModel from "../../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";
import BarCodesInput from "../BarCodes";
import ProductCodesAndTypeCard from "../ProductCodesAndTypeCard";
import ProductCostCentersInput from "../ProductCostCentersInput";
import ProductPackingUnitsInput from "../ProductPackingUnitsInput";
import ProductPictureUpload from "../ProductPictureUpload";

interface GeneralInformationTabProps {
  formType: FormTypes;
  productId: string;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  taxes: TaxModel[];
  errors: Record<string, string>;
  handleTranslate: (key: string) => string;
}

const GeneralInformationTab: React.FC<GeneralInformationTabProps> = ({
  formType,
  productId,
  model,
  setModel,
  taxes,
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
          {handleTranslate("GeneralInformation")}
        </Typography>
      </Box>
      <Box
        className='grid grid-cols-1 md:grid-cols-2 gap-4'
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
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
            productId={productId}
            formType={formType}
            handleTranslate={handleTranslate}
            attachments={model.productAttachments || []}
            onAttachmentsChange={(attachments) =>
              setModel((prev) =>
                prev ? { ...prev, productAttachments: attachments } : prev,
              )
            }
          />
          <ProductCostCentersInput
            formType={formType}
            productCostCenters={model.costCenters ?? []}
            handleUpdate={(items) => {
              setModel((prevModel) =>
                prevModel ? { ...prevModel, costCenters: items } : prevModel,
              );
            }}
            handleTranslate={(key) => handleTranslate(key)}
            errors={errors}
          />
          <BarCodesInput
            barCodes={model.barCodes}
            formType={formType}
            handleTranslate={(key) => handleTranslate(key)}
            handleUpdate={(barCodes: string[]) =>
              setModel((prev) => (prev ? { ...prev, barCodes } : prev))
            }
          />
        </Box>
      </Box>
      <ProductPackingUnitsInput
        productPackingUnits={model.packingUnits || []}
        handleTranslate={(key) => handleTranslate(key)}
        formType={formType}
        handleUpdate={(items) =>
          setModel((prev) => (prev ? { ...prev, packingUnits: items } : prev))
        }
        errors={errors}
      />
    </>
  );
};

export default GeneralInformationTab;
