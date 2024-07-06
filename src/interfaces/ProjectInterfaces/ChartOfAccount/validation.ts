import * as yup from 'yup'
import ChartOfAccountModel from './ChartOfAccountModel';

  export const chartsOfAccountSchema: yup.ObjectSchema<ChartOfAccountModel> = yup.object().shape({

// export const cartsOfAccountSchema: yup.ObjectSchema<ChartValidation> = yup.object().shape({
    id: yup
    .string()
    .required(),

    name: yup
    .string()
    .required("Name is Required")
    .max(100, "Name Can't Exceed 100 letters"),

    nameSecondLanguage: yup
    .string()
    .required("Name is Required")
    .max(100, "Name Can't Exceed 100 letters"),

    parentId: yup
    .string()
    .nullable(),

    accountGuidId: yup
    .string()
    .required("Account Guide is Required"),

    code: yup
    .string()
    .required("Code Is Required")
    .max(100, "Code can't exceed 100 letters."),

    isPostedAccount: yup
    .boolean()
    .default(false),
    
    isActiveAccount: yup
    .boolean()
    .default(true),
    
    isStopDealing: yup
    .boolean()
    .default(true),
    
    isDepreciable: yup
    .boolean()
    .default(false),
    
    accountNature: yup.number(),

    description: yup
    .string()
    .optional()
    .max(1000, "Description Can't Exceed 1000 letters"),
});



