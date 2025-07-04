import * as yup from 'yup';

export const ChartOfAccountSchema = yup.object().shape({
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
  code: yup.string().required('CODE_IS_REQUIRED'),
  nodeType: yup.mixed().required('NodeType is required'),
}); 