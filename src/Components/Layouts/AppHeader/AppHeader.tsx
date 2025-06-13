import './AppHeader.css'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    initialuserState,
    setLoggedInUser,
} from "../../../Storage/Redux/userAuthSlice";
import { AppBar, IconButton, Toolbar, useTheme } from '@mui/material';
import FlexBetween from '../../FlexBetween';
import { GridMenuIcon } from '@mui/x-data-grid';
import { DarkModeOutlined, LightModeOutlined, SettingsOutlined } from '@mui/icons-material';
import { setMode } from '../../../Storage/Redux/global';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from "react-i18next";

type AppHeaderProps = {
    isSidebarOpen: boolean,
    setIsSidebarOpen: (open: boolean) => void,
}


function AppHeader({ isSidebarOpen, setIsSidebarOpen }: AppHeaderProps) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { i18n } = useTranslation();

     const changeLanguage = (lng: "en" | "ar") => {
       i18n.changeLanguage(lng);
       document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
     };
    const handleLogout = () => {
        localStorage.getItem("accessToken") && localStorage.removeItem("accessToken");
        dispatch(setLoggedInUser(initialuserState));
        navigate("/login");
    };

    return (
      <AppBar
        sx={{
          position: "static",
          background: "none",
          boxShadow: "none",
          borderBottom: "1px solid rgba(0, 0, 0, 0.125)",
          zIndex: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LEFT SIDE */}
          <FlexBetween>
            <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <GridMenuIcon />
            </IconButton>
            {/* <FlexBetween
                        // backgroundColor={theme.palette.background.alt}
                        borderRadius="9px"
                        gap="3rem"
                        p="0.1rem 0.5rem"
                        border='1px solid rgba(0,0,0,0.125)'
                    >
                        <InputBase placeholder='Search...' />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </FlexBetween> */}
          </FlexBetween>

          {/* RIGHT SIDE */}
          <FlexBetween>
            <IconButton
              onClick={() =>
                changeLanguage(i18n.language == "ar" ? "en" : "ar")
              }
            >
              {i18n.language == "ar" ? "ar" : "en"}
            </IconButton>
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlined sx={{ fontSize: "25px" }} />
              ) : (
                <LightModeOutlined sx={{ fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton>
              <SettingsOutlined sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton onClick={handleLogout}>
              <LogoutIcon sx={{ fontSize: "25px" }} />
            </IconButton>
          </FlexBetween>
        </Toolbar>
      </AppBar>
    );
}

export default AppHeader
