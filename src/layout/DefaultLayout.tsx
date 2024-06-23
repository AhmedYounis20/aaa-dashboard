import { Box, useMediaQuery } from "@mui/material";
import { AppHeader } from "../Components/index";
import { withAuth } from '../Hoc';
import { useState } from "react";
import { Outlet } from 'react-router-dom'
import AppSidebar from "../Components/Layouts/Sidebar";
import sidebarItemsData from "../Utilities/routes";


const DefaultLayout = () => {
  const isMobile = useMediaQuery("(max-width: 1025px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <Box
      display='flex'
      width="100%"
      height="100%"
    >
      <AppSidebar 
        items={sidebarItemsData} 
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box width='100%'>
        <AppHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
}

export default withAuth(DefaultLayout) ?? null
