import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Button,
  TextField,
} from "@mui/material";

const InputAutoComplete = ({
  options,
  label,
  onChange,
  defaultValue,
  disabled,
  multiple
}) => {
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedValues, setSelectedValues] = useState(defaultValue || []);

  const handleSortToggle = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleSelectAll = () => {
    setSelectedValues(options.map((option) => option.value));
    setSelectAllChecked(true);
  };

  const handleClearAll = () => {
    setSelectedValues([]);
    setSelectAllChecked(false);
  };

  const sortedOptions = [...options].sort((a, b) => {
    const order = sortDirection === "asc" ? 1 : -1;
    return order * a.label.localeCompare(b.label);
  });

  const handleChange = (event, values) => {
    setSelectedValues(values);
    onChange(values);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <Autocomplete
        multiple={multiple}
        id="checkboxes-tags-demo"
        options={sortedOptions}
        getOptionLabel={(option) => option.label}
        onChange={handleChange}
        value={selectedValues}
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
