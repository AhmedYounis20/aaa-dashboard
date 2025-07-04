import * as yup from 'yup';

export const BankSchema = yup.object().shape({
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
  code: yup.string().required('CODE_IS_REQUIRED'),
  phone: yup.string().nullable(),
  email: yup.string().email('EMAIL_INVALID').nullable(),
  bankAccount: yup.string().nullable(),
  bankAddress: yup.string().nullable(),
  notes: yup.string().nullable(),
}); 