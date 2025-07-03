import React, { useEffect, useState, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl, TextField } from "@mui/material";

const InputAutoComplete = (props) => {
  const {
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
    defaultSelect = false,
    defaultSelectCondition = (option) => !!option,
  } = props;

  const [dropDownOptions, setDropDownOptions] = useState(options);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const userClearedRef = useRef(false);
  const lastOptionsRef = useRef(JSON.stringify(options));

  const mapValuesToObjects = (val, opts) => {
    if (multiple) {
      return Array.isArray(val)
        ? opts.filter((option) => val.includes(option.value))
        : [];
    } else {
      return val ? opts.find((option) => option.value === val) || null : null;
    }
  };

  useEffect(() => {
    const optionsString = JSON.stringify(options);
    if (lastOptionsRef.current !== optionsString) {
      setDropDownOptions(options);
      setHasAutoSelected(false);
      userClearedRef.current = false;
      lastOptionsRef.current = optionsString;
    }
    // else, options did not change, do not reset flags
  }, [options]);

  const selectedValue = mapValuesToObjects(value, dropDownOptions);

  useEffect(() => {
    if (!dropDownOptions || dropDownOptions.length === 0) return;

    const isValidSelection = multiple
      ? Array.isArray(selectedValue) && selectedValue.length > 0
      : selectedValue !== null && selectedValue !== undefined;

    if (!isValidSelection && defaultSelect && !hasAutoSelected && !userClearedRef.current) {
      const firstOption =
        dropDownOptions.find(defaultSelectCondition) || dropDownOptions[0];

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

  const OnSelect = (event, val) => {
    if (multiple) {
      const selectedValues = val.map((e) => e.value);
      onChange(selectedValues);
      if (selectedValues.length === 0) userClearedRef.current = true;
      setHasAutoSelected(true);
    } else {
      const selectedValue = val ? val.value : null;
      onChange(selectedValue);
      if (selectedValue === null) userClearedRef.current = true;
      setHasAutoSelected(true);
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
