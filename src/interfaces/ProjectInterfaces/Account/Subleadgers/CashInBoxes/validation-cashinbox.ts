import * as yup from 'yup';

export const CashInBoxSchema = yup.object().shape({
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
  code: yup.string().required('CODE_IS_REQUIRED'),
  notes: yup.string().nullable(),
}); 