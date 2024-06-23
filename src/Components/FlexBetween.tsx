import { Box, styled } from "@mui/material";

interface FlexBetweenProps {
    alignItems?: string;
}

const FlexBetween = styled(Box)<FlexBetweenProps>(({ alignItems = "center" }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: alignItems,
}));

export default FlexBetween;
