import * as yup from 'yup';

export const handleValidationErrors = (validationErrors: unknown): Record<string, string> => {
  const validationErrorsMap: Record<string, string> = {};
  
  if (validationErrors instanceof yup.ValidationError) {
    validationErrors.inner.forEach((error) => {
      if (error.path) {
        validationErrorsMap[error.path] = error.message;
      }
    });
  }
  
  return validationErrorsMap;
}; 