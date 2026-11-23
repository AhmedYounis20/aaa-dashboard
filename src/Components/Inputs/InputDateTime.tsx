import React from "react";
import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

type PickerType = "date" | "time" | "datetime";

interface AppDateTimePickerProps {
  label?: string;
  value: Date | null;
  onChange?: (value: Date | null) => void;
  name?: string;
  disabled?: boolean;
  type?: PickerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slotProps?: any;
  required?: boolean;
  /** @deprecated Use `required` */
  isRequired?: boolean;
  error?: boolean | string | null;
  helperText?: string | null;
}

const InputDateTimePicker: React.FC<AppDateTimePickerProps> = ({
  label,
  value,
  onChange,
  name,
  disabled = false,
  type = "datetime",
  slotProps,
  required,
  isRequired,
}) => {
  const { t } = useTranslation();
  const defaultLabel = t("SelectDate");
  const isReq = required ?? isRequired ?? false;

  const commonProps = {
    label: (label || defaultLabel) + (isReq ? " (" + t("Required") + ")" : ""),
    value: value ? dayjs(value) : null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (newValue: any) => {
      onChange?.(newValue ? newValue.toDate() : null);
    },
    disabled,
    name,
    slotProps,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%" }}>
        {type === "date" && <DatePicker {...commonProps} />}
        {type === "time" && (
          <TimePicker
            {...commonProps}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
        )}
        {type === "datetime" && (
          <DateTimePicker
            {...commonProps}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default InputDateTimePicker;
