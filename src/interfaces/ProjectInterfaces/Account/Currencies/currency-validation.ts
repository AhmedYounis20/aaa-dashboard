import * as yup from 'yup'

export const CurrencySchema = yup.object().shape({
    name: yup
    .string()
    .required("NAME_IS_REQUIRED")
    .min(1,"NAME_IS_REQUIRED")
    .max(100, "NAME_CANNOT_EXCEED_100_LETTERS"),

    nameSecondLanguage: yup
    .string()
    .required("NAME_SECOND_LANGUAGE_IS_REQUIRED")
    .min(1,"NAME_SECOND_LANGUAGE_IS_REQUIRED")
    .max(100, "NAME_CANNOT_EXCEED_100_LETTERS"),

  symbol: yup
    .string()
    .required("SYMBOL_IS_REQUIRED")
    .min(1,"SYMBOL_IS_REQUIRED")
    .max(4, "SYMBOL_CANNOT_EXCEED_4_LETTERS"),

    exchangeRate: yup
    .number()
    .required("EXCHANGE_RATE_IS_REQUIRED")
    .test(
      "is-greater-than-zero",
      "EXCHANGE_RATE_MUST_BE_GREATER_THAN_0",
      val => val > 0
    ).test(
      "exchange-rate",
      "EXCHANGE_RATE_MUST_BE_EQUAL_ONE",
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
      "ISACTIVE_MUST_BE_TRUE",
      function (value) {
        const {isDefault} = this.parent;
        if( !isDefault || value ) {
          return true;
        }
        return false;
      }),    


});

export type CurrencySchemaType = yup.InferType<typeof CurrencySchema>;