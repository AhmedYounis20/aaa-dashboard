import { Box, useMediaQuery } from "@mui/material";
import { AppHeader } from "../Components";
import { withAuth } from "../Hoc";
import { createContext, useState, useEffect } from "react";
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
  const isMobile = useMediaQuery("(max-width: 992px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <appContext.Provider
      value={{
        isMobile,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      <Box>
        <AppHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <Box
          component='main'
          flexGrow={1}
          display='flex'
          sx={{ marginTop: "55px" }}
        >
          <AppSidebar items={sidebarItemsData} />
          <Box
            component='section'
            flexGrow={1}
            p={3}
            overflow='auto'
            sx={{
              marginInlineStart: isMobile
                ? 0
                : isSidebarOpen
                ? "230px"
                : "80px",
              transition: "margin 0.3s ease",
              height: "100%",
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
