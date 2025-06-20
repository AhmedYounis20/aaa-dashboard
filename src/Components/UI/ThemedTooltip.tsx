import { Tooltip, useTheme, TooltipProps } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ThemedTooltipProps extends Omit<TooltipProps, "title"> {
  titleKey: string;
}

export default function ThemedTooltip({
  titleKey,
  children,
  ...props
}: ThemedTooltipProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tooltip
      title={t(titleKey)}
      placement={theme.direction === "rtl" ? "left" : "right"}
      arrow
      disableInteractive
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: theme.palette.mode === "dark" ? "white" : "black",
            color: theme.palette.mode === "dark" ? "black" : "white",
            fontSize: "0.625rem",
          },
        },
        arrow: {
          sx: {
            color: theme.palette.mode === "dark" ? "white" : "black",
          },
        },
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
}
