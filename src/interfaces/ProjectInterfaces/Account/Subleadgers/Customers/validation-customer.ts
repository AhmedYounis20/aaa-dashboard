import * as yup from 'yup';

export const CustomerSchema = yup.object().shape({
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
  code: yup.string().required('CODE_IS_REQUIRED'),
  email: yup.string().email('InvalidEmail').nullable(),
  phone: yup.string().nullable(),
  mobile: yup.string().nullable(),
  address: yup.string().nullable(),
  taxNumber: yup.string().nullable(),
  customerType: yup.string().required('CustomerType is required'),
  nodeType: yup.mixed().required('NodeType is required'),
  notes: yup.string().nullable(),
}); 