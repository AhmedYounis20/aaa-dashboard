import * as yup from 'yup'

export const CurrencySchema = yup.object().shape({
    name: yup
    .string()
    .required("Name is Required")
    .min(1)
    .max(100, "Name can't exceed 100 letters"),

    nameSecondLanguage: yup
    .string()
    .required("الأسم مطلوب")
    .min(1)
    .max(100, "لا يمكن أن يتجاوز الأسم 100 حرف"),

  symbol: yup
    .string()
    .required("Symbol is required")
    .min(1)
    .max(4, "Symbol can't not exceed 4 letters"),

    exchangeRate: yup
    .number()
    .required("Exchange Rate is required")
    .test(
      "is-greater-than-zero",
      "Exchange Rate must ne greater than 0",
      val => val > 0
    ).test(
      "exchange-rate",
      "Exchange rate must be equal one",
      function (value) {
        const { isDefault } = this.parent;
        if(!isDefault ||  value === 1) {
          return true;
        }
        return false;
      }
    ),

    isDefault: yup.boolean(),

    isActive: yup.boolean().test(
      'isActive',
      "isActive must be true",
      function (value) {
        const {isDefault} = this.parent;
        if( !isDefault || value ) {
          return true;
        }
        return false;
      }),    


});

export type CurrencySchemaType = yup.InferType<typeof CurrencySchema>;