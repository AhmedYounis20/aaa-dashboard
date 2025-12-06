import * as yup from 'yup';
import { NodeType } from '../../../../Components/NodeType';

export const FixedAssetSchema = yup.object().shape({
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
  code: yup.string().when("nodeType", {
    is: NodeType.Domain,
    then: (schema) => schema.required("CODE_IS_REQUIRED"),
    otherwise: (schema) => schema.notRequired(),
  }), 
  nodeType: yup.mixed().required('NODETYPE_IS_REQUIRED'),
  fixedAssetType: yup.mixed().required('FIXED_ASSET_TYPE_IS_REQUIRED'),
  serial: yup.string().when('nodeType', {
    is: NodeType.Domain,
    then: schema => schema.required('SERIAL_IS_REQUIRED'),
    otherwise: schema => schema.notRequired(),
  }),
  version: yup.string().when('nodeType', {
    is: NodeType.Domain,
    then: schema => schema.required('VERSION_IS_REQUIRED'),
    otherwise: schema => schema.notRequired(),
  }),
  manufactureCompany: yup.string().when('nodeType', {
    is: NodeType.Domain,
    then: schema => schema.required('MANUFACTURE_COMPANY_IS_REQUIRED'),
    otherwise: schema => schema.notRequired(),
  }),
  assetLifeSpanByYears: yup.number().when('isDepreciable', {
    is: true,
    then: schema => schema.required('ASSET_LIFE_SPAN_IS_REQUIRED').min(1, 'ASSET_LIFE_SPAN_MUST_BE_GREATER_THAN_0'),
    otherwise: schema => schema.notRequired(),
  }),
  depreciationRate: yup.number().when('isDepreciable', {
    is: true,
    then: schema => schema.required('DEPRECIATION_RATE_IS_REQUIRED').min(0, 'DEPRECIATION_RATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0').max(100, 'DEPRECIATION_RATE_CANNOT_EXCEED_100'),
    otherwise: schema => schema.notRequired(),
  }),
});

export type FixedAssetSchemaType = yup.InferType<typeof FixedAssetSchema>; 