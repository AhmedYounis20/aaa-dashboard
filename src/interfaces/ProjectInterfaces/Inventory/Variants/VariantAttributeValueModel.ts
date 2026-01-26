import AttributeDefinitionModel from "../AttributeDefinitions/AttributeDefinitionModel";
import AttributeValueModel from "../AttributeValues/AttributeValueModel";


interface VariantAttributeValueModel {
  id: string;
  variantId: string;
  attributeDefinitionId: string;
  attributeValueId: string;
  attributeDefinition?: AttributeDefinitionModel;
  attributeValue?: AttributeValueModel;
  createdAt: string;
  modifiedAt: string;
  createdByName?: string;
  createdByNameSecondLanguage?: string;
  modifiedByName?: string;
  modifiedByNameSecondLanguage?: string;
}

export default VariantAttributeValueModel;


