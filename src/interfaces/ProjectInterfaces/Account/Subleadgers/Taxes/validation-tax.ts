import * as yup from 'yup';
import { NodeType } from '../../../../Components/NodeType';

export const TaxSchema = yup.object().shape({
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
  code: yup.string().when("nodeType", {
    is: NodeType.Domain,
    then: (schema) => schema.required("CODE_IS_REQUIRED"),
    otherwise: (schema) => schema.notRequired(),
  }),
  percent: yup.number().when("nodeType", {
    is: NodeType.Domain,
    then: (schema) => schema.required("PERCENT_IS_REQUIRED_WHEN_DOMAIN").min(0, "PERCENT_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0").max(100, "PERCENT_CANNOT_EXCEED_100"),
    otherwise: (schema) => schema.notRequired(),
  }),
  chartOfAccountId: yup.string().when("nodeType", {
    is: NodeType.Domain,
    then: (schema) => schema.required("CHART_OF_ACCOUNTS_IS_REQUIRED"),
    otherwise: (schema) => schema.notRequired(),
  }),
  notes: yup.string().nullable(),
});
