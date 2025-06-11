import Login from '../Pages/Auth/login/Login';
import Page404 from '../Pages/ErrorPages/page404/Page404';
import Register from '../Pages/Auth/register/Register';
import DefaultLayout from '../layout/DefaultLayout';
import './App.css'
import { useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes,Route } from "react-router-dom";
import { createTheme } from '@mui/material/styles';
import {ThemeProvider} from '@mui/material'
import { themeSettings } from '../Utilities/theme';
import Dashboard from '../Pages/Dashboard';
import { CssBaseline } from '@mui/material';
import { RootState } from '../Storage/Redux/store';
import sidebarItemsData, { ISidebarItem } from "../Utilities/routes";
import { useTranslation } from 'react-i18next';

function App() {
  const mode = useSelector((state : RootState) => state.global.mode);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
    const { i18n } = useTranslation();
    const changeLanguage = (lng: "en" | "ar") => {
      i18n.changeLanguage(lng);
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    };
    useEffect(() => {
      if (i18n.language != "en" && i18n.language != "ar") changeLanguage("en");

      document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    }, []);
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<Dashboard />} />
              {sidebarItemsData?.map((item) =>
                item?.submenu ? (
                  AddRoute(item)
                ) : (
                  null
                )
              )}
           
            </Route>
            <Route path="*" element={<Page404 />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );

  function AddRoute(item: ISidebarItem) {
    return <Route
      path={`${item.path ? item.path: '/'}`}
      element={item.page ? <item.page /> : null}
    >
      {item.submenu ? (item?.submenu.map((subItem) =>  AddRoute(subItem))
      ): null}
    </Route>;
  }
}

export default App
