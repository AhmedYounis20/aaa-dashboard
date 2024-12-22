import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, TextField } from "@mui/material";

const InputAutoComplete = ({
  options,
  label,
  onChange,
  disabled,
  multiple = false, // Default to single-select
  name,
  value, // Can be null, empty array, or valid values
  handleBlur,
  error,
  helperText,
  size,
}) => {
  const [dropDownOptions, setDropDownOptions] = useState(options || []); // Default empty options
  const [values, setValues] = useState(multiple ? [] : null); // Initialize as empty
  const [isLoading, setIsLoading] = useState(true);

  // Map values to objects for rendering
  const mapValuesToObjects = (val) => {
    if (multiple) {
      return Array.isArray(val)
        ? options.filter((option) => val.includes(option.value))
        : [];
    } else {
      return val
        ? options.find((option) => option.value === val) || null
        : null;
    }
  };

  // Sync values with external value prop
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setValues(mapValuesToObjects(value)); // Map only when value is valid
    } else {
      setValues(multiple ? [] : null); // Handle empty initial values
    }
    setIsLoading(false);
  }, [value, options]); // Re-run on value or options change

  // Handle options change to update dropDownOptions
  useEffect(() => {
    setDropDownOptions(options || []); // Update options only when necessary
  }, [options]);

  return (
    <FormControl fullWidth variant="outlined">
      <Autocomplete
        size={size}
        multiple={multiple}
        id={`autocomplete-${name}`}
        options={dropDownOptions}
        getOptionLabel={(option) => option.label || ""}
        filterSelectedOptions
        loading={isLoading}
        value={values} // Mapped values
        disabled={disabled}
        onChange={(event, val) => {
          if (multiple) {
            const selectedValues = val.map((e) => e.value); // Extract values
            setValues(val);
            onChange(selectedValues); // Emit values only
          } else {
            const selectedValue = val ? val.value : null; // Single value or null
            setValues(val);
            onChange(selectedValue);
          }
        }}
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
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <span>Loading...</span> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default InputAutoComplete;
