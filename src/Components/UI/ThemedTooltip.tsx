import { Tooltip, useTheme, TooltipProps } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ThemedTooltipProps extends Omit<TooltipProps, "title"> {
  title: string;
}

export default function ThemedTooltip({
  title,
  placement,
  children,
  ...props
}: ThemedTooltipProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tooltip
      title={t(title)}
      placement={placement || "top"}
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
