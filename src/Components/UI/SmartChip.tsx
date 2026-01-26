import { Chip, useTheme } from "@mui/material";
export const SmartChip: React.FC<{ value: string }> = ({ value }) => {
  const theme = useTheme();

  return (
    <Chip
      label={value}
      size='small'
      variant='filled'
      className="mx-1"
      sx={{
        backgroundColor: value
          ? theme.palette.success.main
          : theme.palette.error.main,
        color: value
          ? theme.palette.success.contrastText
          : theme.palette.error.contrastText,
      }}
    />
  );
};
