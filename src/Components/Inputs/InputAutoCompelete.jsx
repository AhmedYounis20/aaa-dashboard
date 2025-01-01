import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, TextField } from "@mui/material";

const InputAutoComplete = ({
  options,
  label,
  onChange,
  disabled,
  multiple = false,
  name,
  value,
  handleBlur,
  error,
  helperText,
  size,
  defaultSelect = false,
  defaultSelectCondition = (value)=> value ? true : false
}) => {
  const [dropDownOptions, setDropDownOptions] = useState(options || []);
  const [values, setValues] = useState(multiple ? [] : null);

  // Map values to objects for rendering
  const mapValuesToObjects = (val, opts) => {
    if (multiple) {
      return Array.isArray(val)
        ? opts.filter((option) => val.includes(option.value))
        : [];
    } else {
      return val ? opts.find((option) => option.value === val) || null : null;
    }
  };

  // Update options if they change
  useEffect(() => {
    if (JSON.stringify(dropDownOptions) !== JSON.stringify(options)) {
      setDropDownOptions(options || []);
    }
  }, [options]);

  // Update values when external value or options change
  useEffect(() => {
    const mappedValues = mapValuesToObjects(value, dropDownOptions);
    if (JSON.stringify(mappedValues) !== JSON.stringify(values)) {
      setValues(mappedValues);
    }
  }, [value, dropDownOptions]);

  // Handle default selection
  useEffect(() => {
    if (
      defaultSelect &&
      dropDownOptions.length > 0 &&
      (!values || (value && multiple && values.length === 0))
    ) {
      const filteredOptions = dropDownOptions.filter(e=> defaultSelectCondition ? defaultSelectCondition(e): true);
      const firstOption = filteredOptions[0];
      if(firstOption){

        if (multiple) {
          setValues([firstOption]);
          onChange([firstOption.value]);
        } 
        else {
          setValues(firstOption);
          onChange(firstOption.value);
        }
      }
    }
  }, [dropDownOptions, defaultSelect, values, multiple, onChange,defaultSelectCondition]);

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
        onChange={(event, val) => OnSelect(event, val)}
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
