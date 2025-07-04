import * as yup from 'yup';

export const CollectionBookSchema = yup.object().shape({
  name: yup.string().required('NAME_IS_REQUIRED'),
  nameSecondLanguage: yup.string().required('NAME_SECOND_LANGUAGE_IS_REQUIRED'),
});

export type CollectionBookSchemaType = yup.InferType<typeof CollectionBookSchema>; 