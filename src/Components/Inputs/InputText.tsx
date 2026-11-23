import React from "react";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { resolveError, resolveHelperText, resolveRequired, type BaseInputProps } from "./types";

interface InputTextProps extends Omit<BaseInputProps<string>, "value"> {
  value: string | null;
  fullWidth?: boolean;
  size?: "small" | "medium";
  type?: string;
  className?: string;
  variant?: "outlined" | "filled" | "standard";
}

const InputText: React.FC<InputTextProps> = ({
  label,
  value,
  onChange,
  name,
  disabled = false,
  error = false,
  helperText = "",
  fullWidth = true,
  size = "small",
  type = "text",
  className = "",
  variant = "outlined",
  required,
  isRequired,
}) => {
  const { t } = useTranslation();
  const isReq = resolveRequired({ required, isRequired });
  const hasError = resolveError(error);
  const help = resolveHelperText(error, helperText);

  return (
    <TextField
      type={type}
      name={name}
      label={label ? `${label}${isReq ? ` (${t("Required")})` : ""}` : ""}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      error={hasError}
      helperText={help}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      className={className}
      required={isReq}
    />
  );
};

export default InputText;
