import React from "react";
import TextField from "@mui/material/TextField";

interface InputTextProps {
  label: string;
  value: string | null;
  onChange?: (value: string) => void | null;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  type?: string;
  className?: string;
  variant?: "outlined" | "filled" | "standard";
}

const InputText: React.FC<InputTextProps> = ({
  label,
  value,
  onChange  = null,
  disabled = false,
  error = false,
  helperText = "",
  fullWidth = true,
  size = "small",
  type = "text",
  className = "",
  variant = "outlined",
}) => {
  return (
    <TextField
      type={type}
      label={label}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      className={className}
    />
  );
};

export default InputText;
