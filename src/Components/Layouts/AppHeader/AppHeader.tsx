import './AppHeader.css'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    initialuserState,
    setLoggedInUser,
} from "../../../Storage/Redux/userAuthSlice";
import { 
    AppBar, 
    IconButton, 
    Toolbar, 
    useTheme, 
    Box, 
    Typography, 
    Avatar,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import FlexBetween from '../../FlexBetween';
import { GridMenuIcon } from '@mui/x-data-grid';
import { 
    DarkModeOutlined, 
    LightModeOutlined, 
    SettingsOutlined,
    Language,
    AccountCircle,
    NotificationsNone
} from '@mui/icons-material';
import { setMode } from '../../../Storage/Redux/global';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from "react-i18next";
import { useState } from 'react';

type AppHeaderProps = {
    isSidebarOpen: boolean,
    setIsSidebarOpen: (open: boolean) => void,
}

function AppHeader({ isSidebarOpen, setIsSidebarOpen }: AppHeaderProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { i18n, t } = useTranslation();
    const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

    const changeLanguage = (lng: "en" | "ar") => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
        setLanguageMenuAnchor(null);
    };

    const handleLogout = () => {
        localStorage.getItem("accessToken") && localStorage.removeItem("accessToken");
        dispatch(setLoggedInUser(initialuserState));
        navigate("/login");
        setUserMenuAnchor(null);
    };

    const openLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
        setLanguageMenuAnchor(event.currentTarget);
    };

    const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };

    return (
        <AppBar
            sx={{
                position: "relative",
                background: theme.palette.background.paper,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
                borderBottom: `1px solid ${theme.palette.divider}`,
                zIndex: 1,
            }}
        >
            <Toolbar sx={{ 
                justifyContent: "space-between",
                minHeight: "64px",
                px: 2,
            }}>
                {/* LEFT SIDE */}
                <FlexBetween gap={2}>
                    <IconButton 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        sx={{
                            color: theme.palette.primary.contrastText,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            boxShadow: `0 4px 12px rgba(${theme.palette.primary.main}, 0.3)`,
                            '&:hover': {
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                color: theme.palette.primary.contrastText,
                                transform: 'scale(1.05)',
                                boxShadow: `0 6px 20px rgba(${theme.palette.primary.main}, 0.4)`,
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        <GridMenuIcon />
                    </IconButton>
                    
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                            }}
                        >
                            {t("Dashboard")}
                        </Typography>
                    </Box>
                </FlexBetween>

                {/* RIGHT SIDE */}
                <FlexBetween gap={1}>
                    {/* Language Selector */}
                    <IconButton
                        onClick={openLanguageMenu}
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        <Language />
                    </IconButton>
                    
                    <Menu
                        anchorEl={languageMenuAnchor}
                        open={Boolean(languageMenuAnchor)}
                        onClose={() => setLanguageMenuAnchor(null)}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                minWidth: 120,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                                borderRadius: 2,
                            }
                        }}
                    >
                        <MenuItem 
                            onClick={() => changeLanguage("en")}
                            selected={i18n.language === "en"}
                            sx={{
                                fontWeight: i18n.language === "en" ? 600 : 400,
                            }}
                        >
                            English
                        </MenuItem>
                        <MenuItem 
                            onClick={() => changeLanguage("ar")}
                            selected={i18n.language === "ar"}
                            sx={{
                                fontWeight: i18n.language === "ar" ? 600 : 400,
                            }}
                        >
                            العربية
                        </MenuItem>
                    </Menu>

                    {/* Theme Toggle */}
                    <IconButton 
                        onClick={() => dispatch(setMode())}
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        {theme.palette.mode === "dark" ? (
                            <LightModeOutlined />
                        ) : (
                            <DarkModeOutlined />
                        )}
                    </IconButton>

                    {/* Notifications */}
                    <IconButton
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        <NotificationsNone />
                    </IconButton>

                    {/* User Menu */}
                    <IconButton
                        onClick={openUserMenu}
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        <AccountCircle />
                    </IconButton>

                    <Menu
                        anchorEl={userMenuAnchor}
                        open={Boolean(userMenuAnchor)}
                        onClose={() => setUserMenuAnchor(null)}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                minWidth: 180,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                                borderRadius: 2,
                            }
                        }}
                    >
                        <MenuItem sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                                    <AccountCircle />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        Admin User
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        admin@example.com
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem 
                            onClick={() => setUserMenuAnchor(null)}
                            sx={{ py: 1.5 }}
                        >
                            <SettingsOutlined sx={{ mr: 1, fontSize: 20 }} />
                            {t("Settings")}
                        </MenuItem>
                        <Divider />
                        <MenuItem 
                            onClick={handleLogout}
                            sx={{ 
                                py: 1.5,
                                color: theme.palette.error.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.error.light,
                                    color: theme.palette.error.contrastText,
                                }
                            }}
                        >
                            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                            {t("Logout")}
                        </MenuItem>
                    </Menu>
                </FlexBetween>
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader
