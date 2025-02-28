import React, { useEffect, useState, useRef } from "react";
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
  const [values, setValues] = useState(multiple ? [] : null);
  const firstSelectionMade = useRef(false); // Track if an initial selection was made

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
    if (JSON.stringify(dropDownOptions) !== JSON.stringify(options)) {
      setDropDownOptions(options);
      firstSelectionMade.current = false; // Reset flag when options change
    }
  }, [options]);

  /** Update selected values when `value` or `dropDownOptions` change */
  useEffect(() => {
    if (dropDownOptions.length > 0) {
      const mappedValues = mapValuesToObjects(value, dropDownOptions);

      // Check if the selected values still exist in the options
      const isSelectedInOptions = multiple
        ? mappedValues.length > 0
        : mappedValues !== null;

      if (isSelectedInOptions) {
        setValues(mappedValues);
      } else {
        // If defaultSelect is true, pick the first valid option
        if (defaultSelect) {
          const firstOption =
            dropDownOptions.find(defaultSelectCondition) || dropDownOptions[0];
          if (firstOption) {
            setValues(multiple ? [firstOption] : firstOption);
            onChange(multiple ? [firstOption.value] : firstOption.value);
          }
        } else {
          // Otherwise, just clear the selection
          setValues(multiple ? [] : null);
          onChange(multiple ? [] : null);
        }
      }
    }
  }, [
    value,
    dropDownOptions,
    defaultSelect,
    multiple,
    onChange,
    defaultSelectCondition,
  ]);

  /** Handle user selection */
  const OnSelect = (event, val) => {
    if (multiple) {
      const selectedValues = val.map((e) => e.value);
      setValues(val);
      onChange(selectedValues);
    } else {
      const selectedValue = val ? val.value : null;
      setValues(val);
      onChange(selectedValue);
    }

    if (!val || (multiple && val.length === 0)) {
      firstSelectionMade.current = true; // Prevent re-selection after manual removal
    }
  };

  return (
    <FormControl fullWidth variant="outlined">
      <Autocomplete
        size={size}
        multiple={multiple}
        id={`autocomplete-${name}`}
        options={dropDownOptions}
        getOptionLabel={(option) => option.label || ""}
        filterSelectedOptions
        value={values}
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
            InputProps={params.InputProps}
          />
        )}
      />
    </FormControl>
  );
};

export default InputAutoComplete;
