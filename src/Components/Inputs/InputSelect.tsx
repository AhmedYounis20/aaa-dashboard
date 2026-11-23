import { useId } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { resolveError, resolveHelperText, resolveRequired, type BaseInputProps } from "./types";

export interface SelectOption {
  label: string | number;
  value: string | number;
}

export type SelectValue = string | number | Array<string | number>;

export interface InputSelectProps extends Omit<BaseInputProps<SelectValue>, "onChange" | "value"> {
  options?: SelectOption[];
  value?: SelectValue;
  /** @deprecated Use `value` */
  defaultValue?: SelectValue;
  /**
   * Prefer `(value) => void`. Legacy `({ target }) =>` / `e.target.value`
   * handlers are still invoked via a runtime shim (e.g. GlSettingsRoot).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void;
  multiple?: boolean;
  onBlur?: React.FocusEventHandler | null;
}

/** Runtime bridge: new handlers get `value`; legacy event destructuring still works. */
function emitSelectChange(
  onChange: InputSelectProps["onChange"],
  value: SelectValue,
  name?: string
) {
  if (!onChange) return;
  try {
    const src = onChange.toString();
    if (/\{\s*target[\s,}]/.test(src) || /\.target\b/.test(src)) {
      onChange({ target: { value, name } });
      return;
    }
  } catch {
    // fall through to value contract
  }
  onChange(value);
}

const InputSelect: React.FC<InputSelectProps> = ({
  options,
  label,
  onChange,
  value,
  defaultValue,
  multiple = false,
  disabled = false,
  name,
  onBlur,
  error,
  helperText,
  required,
  isRequired,
}) => {
  const labelId = useId();
  const isReq = resolveRequired({ required, isRequired });
  const hasError = resolveError(error);
  const help = resolveHelperText(error, helperText);
  const resolvedValue = value ?? defaultValue ?? (multiple ? ([] as string[]) : "");

  const handleChange = (event: SelectChangeEvent<SelectValue>) => {
    emitSelectChange(onChange, event.target.value as SelectValue, name);
  };

  return (
    <FormControl fullWidth error={hasError} disabled={disabled} required={isReq}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={resolvedValue}
        onChange={handleChange}
        onBlur={onBlur ?? undefined}
        multiple={multiple}
        disabled={disabled}
        name={name}
        size="small"
      >
        {options?.map((item) => (
          <MenuItem value={item.value} key={String(item.value)}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {help ? <FormHelperText>{help}</FormHelperText> : null}
    </FormControl>
  );
};

export default InputSelect;
