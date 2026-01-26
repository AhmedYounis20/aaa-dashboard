import AttributeDefinitionModel from "../AttributeDefinitions/AttributeDefinitionModel";

interface ProductAttributeDefinitionModel {

  attributeDefinitionId: string;
  attributeDefinition?: AttributeDefinitionModel;
  isVariant: boolean;

}

export default ProductAttributeDefinitionModel;


