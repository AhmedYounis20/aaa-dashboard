import AttributeDefinitionModel from "../AttributeDefinitions/AttributeDefinitionModel";
import AttributeValueModel from "../AttributeValues/AttributeValueModel";

export interface VariantAttributeValueDto {
  id: string;
  variantId: string;
  attributeDefinitionId: string;
  attributeDefinition?: AttributeDefinitionModel;
  attributeValueId: string;
  attributeValue?: AttributeValueModel;
  createdAt: string;
  modifiedAt: string;
  createdByName?: string;
  createdByNameSecondLanguage?: string;
  modifiedByName?: string;
  modifiedByNameSecondLanguage?: string;
}


