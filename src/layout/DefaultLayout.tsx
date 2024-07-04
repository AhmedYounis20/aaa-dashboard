import { Box, useMediaQuery } from "@mui/material";
import { AppContent, AppHeader } from "../Components/index";
import { withAuth } from '../Hoc';
import { createContext, useState } from "react";
import { Outlet } from 'react-router-dom'
import AppSidebar from "../Components/Layouts/Sidebar";
import sidebarItemsData from "../Utilities/routes";

// type appProps = {
//   isMobile: boolean;
//   isSidebarOpen: boolean;
//   setIsSidebarOpen: (open: boolean) => void 
// }

export const appContext = createContext(undefined);

const DefaultLayout = () => {
  const isMobile = useMediaQuery("(max-width: 1550px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <appContext.Provider value={{
      isMobile,
      isSidebarOpen,
      setIsSidebarOpen
    }}>
      <Box
        display='flex'
        width="100%"
      >
        <AppSidebar
          items={sidebarItemsData}
          // isMobile={isMobile}
          // isSidebarOpen={isSidebarOpen}
          // setIsSidebarOpen={setIsSidebarOpen}
        />
        <Box width='100%'>
          <AppHeader
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Box p={4}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </appContext.Provider>
  );
}

export default withAuth(DefaultLayout) ?? null
