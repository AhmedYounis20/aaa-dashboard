import { InputLabel, MenuItem, Select, FormControl } from "@mui/material";

export interface SelectOption {
  label: string | number;
  value: string | number;
}

interface InputSelectProps {
  options?: SelectOption[];
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (event: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
  multiple?: boolean;
  disabled?: boolean;
  name?: string;
  onBlur?: React.FocusEventHandler | null;
  error?: boolean | string;
}

const InputSelect: React.FC<InputSelectProps> = ({
  options,
  label,
  onChange,
  defaultValue,
  multiple = false,
  disabled = false,
  name,
  onBlur,
  error,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="input-select-label" disabled={disabled}>
        {label}
      </InputLabel>
      <Select
        label={label}
        value={defaultValue ?? (multiple ? [] : "")}
        onChange={onChange as never}
        onBlur={onBlur ?? undefined}
        multiple={multiple}
        disabled={disabled}
        name={name}
        error={Boolean(error)}
        size="small"
      >
        {options?.map((item) => (
          <MenuItem value={item.value} key={String(item.value)}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default InputSelect;
