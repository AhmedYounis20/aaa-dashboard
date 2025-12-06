import * as yup from 'yup';
import { NodeType } from '../../../../Components/NodeType';

export const SupplierSchema = yup.object().shape({
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
  code: yup.string().when("nodeType", {
    is: NodeType.Domain,
    then: (schema) => schema.required("CODE_IS_REQUIRED"),
    otherwise: (schema) => schema.notRequired(),
  }), 
  email: yup.string().email('InvalidEmail').nullable(),
  phone: yup.string().nullable(),
  mobile: yup.string().nullable(),
  address: yup.string().nullable(),
  taxNumber: yup.string().nullable(),
  companyName: yup.string().nullable(),
  nodeType: yup.mixed().required('NodeType is required'),
  notes: yup.string().nullable(),
}); 