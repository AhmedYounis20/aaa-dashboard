interface VariantCombinationModel {
  id: string;
  name: string;
  attributeValues: { [attributeDefinitionId: string]: string }; // attributeDefinitionId -> attributeValueId
  applyProductChanges: boolean;
  isExisting?: boolean;
}

export default VariantCombinationModel;


