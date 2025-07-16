import * as yup from 'yup';
import DecimalDigitsNumber from './DecimalDigitsNumber';
import DepreciationApplication from './DepreciationApplication';

export const GLSettingsSchema = yup.object().shape({
    decimalDigitsNumber: yup
    .number()
    .oneOf(DecimalDigitsNumber, "INVALID_DECIMAL_DIGITS_NUMBER")
    .required("DECIMAL_DIGITS_NUMBER_IS_REQUIRED"),

    depreciationApplication: yup
    .string()
    .required("DEPRECIATION_APPLICATION_IS_REQUIRED"),

    monthDays: yup
    .number()
    .when('depreciationApplication', {
      is: (val: DepreciationApplication) => val == DepreciationApplication.Monthly,
      then: (schema) => schema.moreThan(0, 'MONTH_DAYS_IS_REQUIRED'),
    }),

    isAllowingEditVoucher: yup.boolean().default(true),
    isAllowingDeleteVoucher: yup.boolean().default(true),
    isAllowingNegativeBalances: yup.boolean().default(false),
});


export type GLSettingsSchemaType = yup.InferType<typeof GLSettingsSchema>;