import { Box } from "@mui/material";
import React from "react";
import { FormTypes } from "../../../../../../interfaces/Components/FormType";
import ProductInputModel from "../../../../../../interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";
import ProductAttributeDefinitionsSelector from "../ProductAttributeDefinitionsSelector";
import VariantCombinationBuilder from "../VariantCombinationBuilder";

interface AttributesAndVariantsTabProps {
  formType: FormTypes;
  model: ProductInputModel;
  setModel: React.Dispatch<React.SetStateAction<ProductInputModel>>;
  selectedAttributeValues: Record<string, string[]>;
  setSelectedAttributeValues: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  handleTranslate: (key: string) => string;
}

const AttributesAndVariantsTab: React.FC<AttributesAndVariantsTabProps> = ({
  formType,
  model,
  setModel,
  selectedAttributeValues,
  setSelectedAttributeValues,
  handleTranslate,
}) => {
  return (
    <Box>
      <ProductAttributeDefinitionsSelector
        productAttributeDefinitions={model.productAttributeDefinitions || []}
        onChange={(productAttributeDefinitions) =>
          setModel((prev) =>
            prev
              ? {
                  ...prev,
                  productAttributeDefinitions,
                  ...(productAttributeDefinitions.length === 0
                    ? { variantCombinations: [] }
                    : {}),
                }
              : prev,
          )
        }
        handleTranslate={handleTranslate}
        formType={formType}
        selectedAttributeValues={selectedAttributeValues}
        onSelectedAttributeValuesChange={setSelectedAttributeValues}
      />
      <VariantCombinationBuilder
        combinations={model.variantCombinations || []}
        onChange={(combinations) =>
          setModel((prev) =>
            prev ? { ...prev, variantCombinations: combinations } : prev,
          )
        }
        onProductApplyChanges={(val: boolean) => {
          setModel((prev) =>
            prev ? { ...prev, applyDomainChanges: val } : prev,
          );
        }}
        productApplyChanges={true}
        handleTranslate={handleTranslate}
        formType={formType}
        productName={model.name || ""}
        productAttributeDefinitions={model.productAttributeDefinitions || []}
        selectedAttributeValues={selectedAttributeValues}
        onSelectedAttributeValuesChange={setSelectedAttributeValues}
      />
    </Box>
  );
};

export default AttributesAndVariantsTab;
