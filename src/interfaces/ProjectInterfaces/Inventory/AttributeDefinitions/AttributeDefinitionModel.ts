import AttributeValueModel from "../AttributeValues/AttributeValueModel";

interface AttributeDefinitionModel {
    id: string;
    name: string;
    nameSecondLanguage: string;
    isActive: boolean;
    predefinedValues: AttributeValueModel[];
}

export default AttributeDefinitionModel;
