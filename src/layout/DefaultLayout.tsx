import { Box, useMediaQuery } from "@mui/material";
import { AppHeader } from "../Components";
import { withAuth } from "../Hoc";
import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../Components/Layouts/Sidebar";
import sidebarItemsData from "../Utilities/routes";
import { appProps } from "../interfaces/Components/appProps";

export const appContext = createContext<appProps>({
  isMobile: false,
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
});

const DefaultLayout = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
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
        <AppSidebar items={sidebarItemsData} />

        <Box
          component="main"
          flexGrow={1}
          display="flex"
          flexDirection="column"
          height="100vh"
          overflow="hidden"
        >
          <AppHeader
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Box
            component="section"
            flexGrow={1}
            p={3}
            overflow="auto"
            bgcolor="#f9f9f9"
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </appContext.Provider>
  );
};

export default withAuth(DefaultLayout);
