import * as yup from 'yup';
import CostCenterType, { Type } from './costCenterType';

const guidRegex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;

export const CostCentersSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .max(100, "Name Can't excced 100 Letters"),

    nameSecondLanguage: yup
        .string()
        .required("Name is required")
        .max(100, "Name Can't excced 100 Letters"),

    nodeType : yup
    .mixed<Type>()
    .oneOf(Object.values(Type) as Type[], "Invalid type") 
    .required("Type is required"),

    costCenterType: yup
        .mixed<CostCenterType>()
        .oneOf(Object.values(CostCenterType).filter(value => typeof value === "number") as CostCenterType[])
        .required("Cost Center Type is required"),

    percent: yup
    .number()
    .when('nodeType', {
        is: Type.Domain, 
        then: schema => schema
            .required("Percent is required when node type is 'Domain'")
            .min(0, "Percent must be greater than or equal to 0")
            .max(100, "Percent cannot exceed 100"),
        otherwise: schema => schema.notRequired(),
    }),

    chartOfAccounts: yup
    .array()
    .of(
        yup
            .string()
            .required("Each account must be a string")
            .matches(guidRegex, "Each account must be a valid GUID") 
        )
        .when(['nodeType', 'costCenterType'], {
        is: (nodeType: Type, costCenterType: CostCenterType) => nodeType === Type.Domain && costCenterType === CostCenterType.RelatedToAccount,
        then: schema => schema
            .required("At least add one account when node type is Domain and cost center type is Related")
            .min(1, "At least add one account"),
        otherwise: schema => schema.notRequired(),
        }),
    })
    .test('cost-center-type-relationship', 'Cost center type must be related to Domain', function (value) {
        const { nodeType, costCenterType } = value || {};
        if (nodeType === Type.Domain) {

        const relatedCostCenterType = CostCenterType.RelatedToAccount;


        if (costCenterType !== relatedCostCenterType) {
            return this.createError({
            path: 'costCenterType',
            message: `Cost center type must be ${relatedCostCenterType} when node type is Domain`,
            });
        }
        }

    return true; 
});