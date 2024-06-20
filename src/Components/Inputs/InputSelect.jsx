import { InputLabel, MenuItem, Select, FormControl } from "@mui/material";
import React from "react";

const InputSelect = ({
  options,
  label,
  onChange,
  defaultValue,
  multiple = false,
  disabled = false,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label" disabled={disabled}>
        {label}
      </InputLabel>
      <Select
        label={label}
        defaultValue={defaultValue}
        onChange={onChange}
        multiple={multiple}
        autoComplete
        disabled={disabled}
      >
        {options &&
          options.map((item) => {
            console.log(item);
            return <MenuItem value={item.value}>{item.label} </MenuItem>;
          })}
      </Select>
    </FormControl>
  );
};

export default InputSelect;
