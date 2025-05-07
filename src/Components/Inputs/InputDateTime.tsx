import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";

type PickerType = "date" | "time" | "datetime";

interface AppDateTimePickerProps {
  label?: string;
  value: Date | null;
  onChange?: (value: Date | null) => void;
  disabled?: boolean;
  type?: PickerType;
  slotProps?: any;
}

const InputDateTimePicker: React.FC<AppDateTimePickerProps> = ({
  label = "Select Date",
  value,
  onChange,
  disabled = false,
  type = "datetime",
  slotProps,
}) => {
  const commonProps = {
    label,
    value: value ? dayjs(value) : null,
    onChange: (newValue: any) => {
      onChange?.(newValue ? newValue.toDate() : null);
    },
    disabled,
    slotProps,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker"]}>
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
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default InputDateTimePicker;
