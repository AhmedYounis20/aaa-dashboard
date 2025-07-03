import * as yup from 'yup';

export const ColorSchema = yup.object().shape({
  code: yup.string().required('CODE_IS_REQUIRED'),
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
  colorValue: yup.string()
    .required('COLOR_IS_REQUIRED')
    .test('is-color', 'COLOR_INVALID', value => {
      if (!value) return false;
      // Accept hex
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) return true;
      // Accept color names (basic check)
      const s = new Option().style;
      s.color = value;
      return s.color !== '';
    }),
});

export type ColorSchemaType = yup.InferType<typeof ColorSchema>; 