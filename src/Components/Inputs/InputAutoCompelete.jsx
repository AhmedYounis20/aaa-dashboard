import React, { useState } from "react";
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
  handleBlur
}) => {
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectAllChecked, setSelectAllChecked] = useState(false);

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

  const sortedOptions = [...options].sort((a, b) => {
    const order = sortDirection === "asc" ? 1 : -1;
    return order * a.label.localeCompare(b.label);
  });

  const handleChange = (event, newValue) => {
    onChange(name, newValue ? newValue?.value : '' )
  };

  return (
    <FormControl fullWidth variant="outlined">
      <Autocomplete
        multiple={multiple}
        id="checkboxes-tags-demo"
        options={sortedOptions}
        getOptionLabel={(option) => option.label}
        // onChange={(e, values) => onChange(name, values)}
        onChange={(event,value)=>{
          console.log(event)

          if (Array.isArray(value)) {
            console.log("It is an array");
            onChange(value.map((e) => e["value"]));
          } else if (typeof value === "object" && value !== null) {
            onChange(value["value"]);
          } else {
            console.log("It is neither an array nor an object");
          }
        }}
        onBlur={handleBlur}
        value={value}
        selectOnFocus
        clearOnEscape
        disabled={disabled}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label={label} />
        )}
      />
    </FormControl>
  );
};

export default InputAutoComplete;
