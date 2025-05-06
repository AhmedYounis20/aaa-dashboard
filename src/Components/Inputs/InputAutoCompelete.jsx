import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, TextField } from "@mui/material";

const InputAutoComplete = ({
  options = [],
  label,
  onChange,
  disabled = false,
  multiple = false,
  name,
  value,
  handleBlur,
  error,
  helperText,
  size = "medium",
  defaultSelect = false,
  defaultSelectCondition = (option) => (option ? true : false),
}) => {
  const [dropDownOptions, setDropDownOptions] = useState(options);

  /** Helper function to find matching objects in options */
  const mapValuesToObjects = (val, opts) => {
    if (multiple) {
      return Array.isArray(val)
        ? opts.filter((option) => val.includes(option.value))
        : [];
    } else {
      return val ? opts.find((option) => option.value === val) || null : null;
    }
  };

  /** Update dropdown options when `options` change */
  useEffect(() => {
    setDropDownOptions(options);
  }, [options]);

  /** Determine value to display in Autocomplete */
  const selectedValue = mapValuesToObjects(value, dropDownOptions);

  /** Handle user selection */
  const OnSelect = (event, val) => {
    if (multiple) {
      const selectedValues = val.map((e) => e.value);
      onChange(selectedValues);
    } else {
      const selectedValue = val ? val.value : null;
      onChange(selectedValue);
    }
  };

  /** Auto-select default if value is not present in options */
  useEffect(() => {
    if (!dropDownOptions || dropDownOptions.length === 0) return;

    const isValidSelection = multiple
      ? selectedValue.length > 0
      : selectedValue !== null;

    if (!isValidSelection && defaultSelect) {
      const firstOption =
        dropDownOptions.find(defaultSelectCondition) || dropDownOptions[0];

      if (firstOption) {
        const newVal = multiple ? [firstOption.value] : firstOption.value;
        onChange(newVal);
      }
    }
  }, [
    value,
    dropDownOptions,
    multiple,
    defaultSelect,
    defaultSelectCondition,
    onChange,
  ]);

  return (
    <FormControl fullWidth variant="outlined">
      <Autocomplete
        size={size}
        multiple={multiple}
        id={`autocomplete-${name}`}
        options={dropDownOptions}
        getOptionLabel={(option) => option.label || ""}
        isOptionEqualToValue={(option, val) => option?.value === val?.value}
        filterSelectedOptions
        value={selectedValue}
        disabled={disabled}
        onChange={OnSelect}
        onBlur={handleBlur}
        selectOnFocus
        clearOnEscape
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
            helperText={helperText}
            error={error}
            name={name}
          />
        )}
      />
    </FormControl>
  );
};

export default InputAutoComplete;
