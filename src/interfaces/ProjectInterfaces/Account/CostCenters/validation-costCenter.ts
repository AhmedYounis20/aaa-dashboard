import * as yup from 'yup';
import CostCenterType, { Type } from './costCenterType';

const guidRegex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;

export const CostCentersSchema = yup.object().shape({
    name: yup
        .string()
        .required("NAME_IS_REQUIRED")
        .max(100, "NAME_CANNOT_EXCEED_100_LETTERS"),

    nameSecondLanguage: yup
        .string()
        .required("NAME_SECOND_LANGUAGE_IS_REQUIRED")
        .max(100, "NAME_CANNOT_EXCEED_100_LETTERS"),

    nodeType : yup
    .mixed<Type>()
    .oneOf(Object.values(Type) as Type[], "INVALID_TYPE") 
    .required("NODETYPE_IS_REQUIRED"),

    costCenterType: yup
        .mixed<CostCenterType>()
        .oneOf(Object.values(CostCenterType).filter(value => typeof value === "number") as CostCenterType[])
        .required("COST_CENTER_TYPE_IS_REQUIRED"),

    percent: yup
    .number()
    .when('nodeType', {
        is: Type.Domain, 
        then: schema => schema
            .required("PERCENT_IS_REQUIRED_WHEN_DOMAIN")
            .min(0, "PERCENT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0")
            .max(100, "PERCENT_CANNOT_EXCEED_100"),
        otherwise: schema => schema.notRequired(),
    }),

    chartOfAccounts: yup
    .array()
    .of(
        yup
            .string()
            .required("EACH_ACCOUNT_MUST_BE_STRING")
            .matches(guidRegex, "EACH_ACCOUNT_MUST_BE_VALID_GUID") 
        )
        .when(['nodeType', 'costCenterType'], {
        is: (nodeType: Type, costCenterType: CostCenterType) => nodeType === Type.Domain && costCenterType === CostCenterType.RelatedToAccount,
        then: schema => schema
            .required("AT_LEAST_ADD_ONE_ACCOUNT_WHEN_DOMAIN_AND_RELATED")
            .min(1, "AT_LEAST_ADD_ONE_ACCOUNT"),
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