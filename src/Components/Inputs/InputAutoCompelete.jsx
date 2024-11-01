import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  FormControl,
  TextField,
} from "@mui/material";

const InputAutoComplete = ({
  options,
  label,
  onChange,
  disabled,
  multiple,
  name,
  value,
  defaultValue,
  handleBlur,
  error,
  helperText
}) => {
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [values, setValues] = useState(value);

  const handleSortToggle = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };


  const handleSelectAll = () => {
    onChange(name, options?.map((option) => option?.value));
    setSelectAllChecked(true);
  }

  const handleClearAll = () => {
    onChange(name, []);
    setSelectAllChecked(false);
  };

  const sortedOptions = [...options]
  .filter((option) => !values.some((val) => val.value === option.value)) // Exclude selected values
  .sort((a, b) => {
    const order = sortDirection === "asc" ? 1 : -1;
    return order * a.label.localeCompare(b.label);
  });

useEffect(() => {
  setValues(value);
}, [value]);


  return (
    <FormControl fullWidth variant="outlined">
      <Autocomplete
        multiple={multiple}
        id="checkboxes-tags-demo"
        options={sortedOptions}
        getOptionLabel={(option) => option.label}
        filterSelectedOptions={true}
        defaultValue={defaultValue}
        onChange={(event, val) => {
          if (Array.isArray(val)) {
            setValues(val.map((e) => e));
            onChange(val.map((e) => e["value"]));
          } else if (typeof val === "object" && val !== null) {
            onChange(val["value"]);
            setValues(val);
          } else {
            console.log("It is neither an array nor an object");
          }
        }}
        onBlur={handleBlur}
        value={values}
        selectOnFocus
        clearOnEscape
        disabled={disabled}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label={label} helperText={helperText} error={error} />
        )}
      />
    </FormControl>
  );
};

export default InputAutoComplete;
