import * as yup from 'yup';
import CostCenterType, { Type } from './costCenterType';

export const CostCentersSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .max(100, "Name Can't excced 100 Letters"),

    nameSecondLanguage: yup
        .string()
        .required("Name is required")
        .max(100, "Name Can't excced 100 Letters"),

    nodeType: yup
        .mixed<Type>()
        .oneOf(Object.values(Type).filter(value => typeof value === "number") as Type[], "Invalid type")
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
    .of(yup.string().required("Each account must be a string")) // Ensure each item is a string
    .when('nodeType', {
        is: Type.Domain,
        then: schema => schema
            .required("At least add one account")
            .min(1, "At least add one account"), // Ensure the array has at least one item
    }),
});