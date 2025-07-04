import * as yup from 'yup';

export const FinancialPeriodSchema = yup.object().shape({
  yearNumber: yup.string().required('YEAR_NUMBER_IS_REQUIRED'),
  periodTypeByMonth: yup.number().required('PERIOD_TYPE_IS_REQUIRED'),
  startDate: yup.date().required('START_DATE_IS_REQUIRED'),
  endDate: yup.date().required('END_DATE_IS_REQUIRED'),
});

export type FinancialPeriodSchemaType = yup.InferType<typeof FinancialPeriodSchema>; 