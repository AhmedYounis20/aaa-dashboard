import './AppHeader.css'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    initialuserState,
    setLoggedInUser,
} from "../../../Storage/Redux/userAuthSlice";
import { AppBar, IconButton, InputBase, Toolbar, useTheme } from '@mui/material';
import FlexBetween from '../../FlexBetween';
import { GridMenuIcon } from '@mui/x-data-grid';
import { DarkModeOutlined, LightModeOutlined, Search, SettingsOutlined } from '@mui/icons-material';
import { setMode } from '../../../Storage/Redux/global';
import LogoutIcon from '@mui/icons-material/Logout';

type AppHeaderProps = {
    isSidebarOpen: boolean,
    setIsSidebarOpen: (open: boolean) => void,
}


function AppHeader({ isSidebarOpen, setIsSidebarOpen }: AppHeaderProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    
    const handleLogout = () => {
        localStorage.getItem("token") && localStorage.removeItem("token");
        dispatch(setLoggedInUser(initialuserState));
        navigate("/login");
    };

    return (
        <AppBar
            sx={{
                position: "static",
                background: "none",
                boxShadow: "none",
                borderBottom: '1px solid rgba(0, 0, 0, 0.125)'
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
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === 'dark'
                            ? <DarkModeOutlined sx={{ fontSize: '25px' }} />
                            : <LightModeOutlined sx={{ fontSize: '25px' }} />
                        }
                    </IconButton>
                    <IconButton>
                        <SettingsOutlined sx={{ fontSize: '25px' }} />
                    </IconButton>
                    <IconButton onClick={handleLogout}>
                        <LogoutIcon sx={{ fontSize: '25px' }} />
                    </IconButton>
                </FlexBetween>
            </Toolbar>
        </AppBar>
    )
}

export default AppHeader
