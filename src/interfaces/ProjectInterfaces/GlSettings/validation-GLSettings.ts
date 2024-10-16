import * as yup from 'yup';
import DecimalDigitsNumber from './DecimalDigitsNumber';

export const GLSettingsSchema = yup.object().shape({
    decimalDigitsNumber: yup
    .number()
    .oneOf(DecimalDigitsNumber, "Invalid Decimal digits number")
    .required("decimal digits number is required"),

    depreciationApplication: yup
    .string()
    .required("deprecation application is required"),

    monthDays: yup
    .number()
    .test(
        "greater-than-zero",
        "month days is required",
        (val) => {
            console.log(val)
            return val !== undefined && val > 0
        }
    ),

    isAllowingEditVoucher: yup.boolean().default(true),
    isAllowingDeleteVoucher: yup.boolean().default(true),
    isAllowingNegativeBalances: yup.boolean().default(false),
});


export type GLSettingsSchemaType = yup.InferType<typeof GLSettingsSchema>;