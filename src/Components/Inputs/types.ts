/**
 * Shared input contract for form controls.
 * Canonical shape: `{ value, onChange(value), name, error, required }`.
 * `isRequired` is accepted as a deprecated alias of `required`.
 *
 * `onChange` is typed loosely (`any`) so existing call-site parameter types
 * (string | null, enums, legacy select events) remain assignable under
 * TypeScript's function variance rules during the migration.
 */
export interface BaseInputProps<TValue> {
  value?: TValue;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void;
  name?: string;
  error?: boolean | string | null;
  helperText?: string | null;
  required?: boolean;
  /** @deprecated Use `required` */
  isRequired?: boolean;
  disabled?: boolean;
  label?: string;
}

export function resolveRequired(props: { required?: boolean; isRequired?: boolean }): boolean {
  return props.required ?? props.isRequired ?? false;
}

export function resolveError(error?: boolean | string | null): boolean {
  return Boolean(error);
}

export function resolveHelperText(
  error?: boolean | string | null,
  helperText?: string | null
): string {
  if (typeof error === "string" && error) return error;
  return helperText ?? "";
}
