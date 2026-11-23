import { useEffect, useState, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, TextField } from "@mui/material";
import { resolveError, resolveHelperText, resolveRequired, type BaseInputProps } from "./types";

export interface AutoCompleteOption {
  label: string;
  value?: string | number;
  [key: string]: unknown;
}

interface InputAutoCompleteProps extends Omit<BaseInputProps<unknown>, "value" | "onChange"> {
  options?: AutoCompleteOption[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  multiple?: boolean;
  value?: unknown;
  handleBlur?: React.FocusEventHandler | null;
  size?: "small" | "medium";
  defaultSelect?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultSelectCondition?: (option: any) => boolean;
}

const InputAutoComplete: React.FC<InputAutoCompleteProps> = ({
  options = [],
  label,
  onChange,
  disabled = false,
  multiple = false,
  name = "",
  value = multiple ? [] : null,
  handleBlur = () => {},
  error = false,
  helperText = "",
  size = "small",
  required,
  isRequired,
  defaultSelect = false,
  defaultSelectCondition = (option) => !!option,
}) => {
  const [dropDownOptions, setDropDownOptions] = useState(options);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const userClearedRef = useRef(false);
  const lastOptionsRef = useRef(JSON.stringify(options));
  const isReq = resolveRequired({ required, isRequired });
  const hasError = resolveError(error);
  const help = resolveHelperText(error, helperText);

  const mapValuesToObjects = (val: unknown, opts: AutoCompleteOption[]) => {
    if (multiple) {
      return Array.isArray(val)
        ? opts.filter(
            (option) =>
              option.value !== undefined && (val as (string | number)[]).includes(option.value)
          )
        : [];
    }
    return val ? opts.find((option) => option.value === val) || null : null;
  };

  useEffect(() => {
    const optionsString = JSON.stringify(options);
    if (lastOptionsRef.current !== optionsString) {
      setDropDownOptions(options);
      setHasAutoSelected(false);
      userClearedRef.current = false;
      lastOptionsRef.current = optionsString;
    }
  }, [options]);

  const selectedValue = mapValuesToObjects(value, dropDownOptions);

  useEffect(() => {
    if (!dropDownOptions || dropDownOptions.length === 0) return;

    const isValidSelection = multiple
      ? Array.isArray(selectedValue) && selectedValue.length > 0
      : selectedValue !== null && selectedValue !== undefined;

    if (!isValidSelection && defaultSelect && !hasAutoSelected && !userClearedRef.current) {
      const firstOption = dropDownOptions.find(defaultSelectCondition) || dropDownOptions[0];

      if (firstOption) {
        const newVal = multiple ? [firstOption.value] : firstOption.value;
        onChange(newVal);
        setHasAutoSelected(true);
      }
    }
  }, [
    value,
    dropDownOptions,
    multiple,
    defaultSelect,
    defaultSelectCondition,
    onChange,
    hasAutoSelected,
    selectedValue,
  ]);

  const onSelect = (
    _event: React.SyntheticEvent,
    val: AutoCompleteOption | AutoCompleteOption[] | null
  ) => {
    if (multiple) {
      const selectedValues = (val as AutoCompleteOption[]).map((e) => e.value);
      onChange(selectedValues);
      if (selectedValues.length === 0) userClearedRef.current = true;
      setHasAutoSelected(true);
    } else {
      const selected = val as AutoCompleteOption | null;
      const selectedVal = selected ? selected.value : null;
      onChange(selectedVal);
      if (selectedVal === null) userClearedRef.current = true;
      setHasAutoSelected(true);
    }
  };

  return (
    <FormControl fullWidth variant="outlined" required={isReq}>
      <Autocomplete
        size={size}
        multiple={multiple}
        id={name ? `autocomplete-${name}` : undefined}
        options={dropDownOptions}
        getOptionLabel={(option) => option.label || ""}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        filterSelectedOptions={multiple}
        value={selectedValue}
        disabled={disabled}
        onChange={onSelect}
        onBlur={handleBlur ?? undefined}
        selectOnFocus
        clearOnEscape
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
            helperText={help || undefined}
            error={hasError}
            name={name}
            required={isReq}
          />
        )}
      />
    </FormControl>
  );
};

export default InputAutoComplete;
