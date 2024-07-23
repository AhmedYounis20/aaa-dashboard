import { Box, useMediaQuery } from "@mui/material";
import { AppHeader } from "../Components/index";
import { withAuth } from '../Hoc';
import { createContext, useState } from "react";
import { Outlet } from 'react-router-dom'
import AppSidebar from "../Components/Layouts/Sidebar";
import sidebarItemsData from "../Utilities/routes";
import { appProps } from "../interfaces/Components/appProps";

export const appContext = createContext<appProps>({
  isMobile: false,
  isSidebarOpen: false,
  setIsSidebarOpen :undefined
});

const DefaultLayout = () => {
  const isMobile = useMediaQuery("(max-width: 1550px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <appContext.Provider
      value={{
        isMobile,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      <Box display="flex" width="100%" height={"100vh"} overflow={"hidden"}>
        <AppSidebar
          items={sidebarItemsData}
          isMobile={isMobile}
          // isSidebarOpen={isSidebarOpen}
          // setIsSidebarOpen={setIsSidebarOpen}
        />
        <Box width="100%" height={"10vh"}>
          <AppHeader
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Box p={4} height={"90vh"} overflow={"auto"}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </appContext.Provider>
  );
}

export default withAuth(DefaultLayout) ?? null
