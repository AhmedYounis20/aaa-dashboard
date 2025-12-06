import * as yup from 'yup';
import { NodeType } from '../../../../Components/NodeType';

export const BranchSchema = yup.object().shape({
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
  code: yup.string().when("nodeType", {
    is: NodeType.Domain,
    then: (schema) => schema.required("CODE_IS_REQUIRED"),
    otherwise: (schema) => schema.notRequired(),
  }), 
  address: yup.string().nullable(),
  phone: yup.string().nullable(),
  nodeType: yup.mixed().required('NodeType is required'),
  notes: yup.string().nullable(),
  logo: yup.mixed().nullable(),
}); 