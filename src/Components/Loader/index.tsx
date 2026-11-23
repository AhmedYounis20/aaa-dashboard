import { Box, CircularProgress } from "@mui/material";

type LoaderProps = {
  height?: string | number;
  /** MUI CircularProgress color; defaults to primary */
  color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
};

function Loader({ height = "60vh", color = "primary" }: LoaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height,
      }}
    >
      <CircularProgress color={color} />
    </Box>
  );
}

export default Loader;
