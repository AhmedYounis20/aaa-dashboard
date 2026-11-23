import React, { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslation } from "react-i18next";
import { resolveError, resolveHelperText, resolveRequired, type BaseInputProps } from "./types";

interface InputNumberProps extends Omit<BaseInputProps<number>, "value"> {
  value: number | null;
  fullWidth?: boolean;
  size?: "small" | "medium";
  className?: string;
  variant?: "outlined" | "filled" | "standard";
  inputType?: "number" | "percent";
  precision?: number | null;
  allowEmpty?: boolean;
}

const InputNumber: React.FC<InputNumberProps> = ({
  label = "",
  value,
  onChange,
  name,
  disabled = false,
  error = false,
  helperText = "",
  fullWidth = true,
  size = "small",
  className = "",
  variant = "outlined",
  required,
  isRequired,
  inputType = "number",
  precision = null,
  allowEmpty = false,
}) => {
  const { t } = useTranslation();
  const isReq = resolveRequired({ required, isRequired });
  const hasError = resolveError(error);
  const help = resolveHelperText(error, helperText);
  const [inputValue, setInputValue] = useState<string>("");

  // Helper: Clamp percent and format with precision
  const formatValue = useCallback(
    (num: number): string => {
      if (inputType === "percent") {
        num = Math.min(Math.max(num, 0), 100);
      }
      return precision !== null ? num.toFixed(precision) : num.toString();
    },
    [inputType, precision]
  );

  // Sync external value to internal inputValue state
  useEffect(() => {
    if (value === null || value === undefined || isNaN(value)) {
      setInputValue("");
    } else {
      setInputValue(formatValue(value));
    }
  }, [value, formatValue]);

  // Handle typing input
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      // Remove percent sign if present
      if (inputType === "percent") {
        val = val.replace("%", "");
      }

      // Allow empty input (user clearing)
      if (val === "") {
        setInputValue("");
        if (!allowEmpty) {
          onChange?.(0);
        }
        return;
      }

      // Validate allowed chars: digits, one dot or comma (for decimals)
      const valid = /^(\d+([.,]\d*)?|\.\d*)$/.test(val);
      if (!valid) return;

      // Normalize comma to dot for Number conversion
      const normalizedVal = val.replace(",", ".");

      setInputValue(val);

      const num = Number(normalizedVal);
      if (!isNaN(num)) {
        onChange?.(num);
      }
    },
    [inputType, onChange, allowEmpty]
  );

  // Format and clamp value on blur
  const handleBlur = useCallback(() => {
    if (inputValue === "") {
      if (allowEmpty) {
        // Keep empty
        return;
      } else {
        setInputValue(formatValue(0));
        onChange?.(0);
        return;
      }
    }

    // Normalize input value before converting
    const normalizedInput = inputValue.replace(",", ".");
    const num = Number(normalizedInput);
    if (isNaN(num)) return;

    const formatted = formatValue(num);
    setInputValue(formatted);
    onChange?.(num);
  }, [inputValue, onChange, formatValue, allowEmpty]);

  return (
    <TextField
      type="number"
      name={name}
      label={`${label}${isReq ? ` (${t("Required")})` : ""}`}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      error={hasError}
      helperText={help}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      className={className}
      required={isReq}
      inputProps={{
        inputMode: "decimal",
        pattern: "[0-9]*[.,]?[0-9]*",
      }}
      InputProps={{
        endAdornment:
          inputType === "percent" ? <InputAdornment position="end">%</InputAdornment> : null,
      }}
    />
  );
};

export default InputNumber;
