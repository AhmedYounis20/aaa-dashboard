import { Box, useMediaQuery, useTheme } from "@mui/material";
import { AppHeader } from "../Components";
import { withAuth } from "../Hoc";
import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../Components/Layouts/Sidebar";
import { appProps } from "../interfaces/Components/appProps";
import sidebarItemsData from "../Utilities/routes";

export const appContext = createContext<appProps>({
  isMobile: false,
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
});

const DefaultLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 991px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  return (
    <appContext.Provider
      value={{
        isMobile,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      <Box display="flex" height="100vh" overflow="hidden">
        <AppHeader
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

        <Box
          component="main"
          flexGrow={1}
          display="flex"
          sx={{ marginTop: "64px" }}
        >
          <AppSidebar items={sidebarItemsData} />
          <Box
            component="section"
            flexGrow={1}
            p={3}
            overflow="auto"
             sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </appContext.Provider>
  );
};

export default withAuth(DefaultLayout);
