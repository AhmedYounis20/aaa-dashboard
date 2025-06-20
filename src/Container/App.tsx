import { CacheProvider } from "@emotion/react";
import { rtlCache } from "../Utilities/rtlCache"; // 👈
import { useMemo, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { themeSettings } from "../Utilities/theme";
import { useSelector } from "react-redux";
import { RootState } from "../Storage/Redux/store";
import { useTranslation } from "react-i18next";

import Login from "../Pages/Auth/login/Login";
import Register from "../Pages/Auth/register/Register";
import Page404 from "../Pages/ErrorPages/page404/Page404";
import DefaultLayout from "../layout/DefaultLayout";
import Dashboard from "../Pages/Dashboard";
import sidebarItemsData, { ISidebarItem } from "../Utilities/routes";

function App() {
  const mode = useSelector((state: RootState) => state.global.mode);
  const { i18n } = useTranslation();
  const currentDir = i18n.language === "ar" ? "rtl" : "ltr";
  const [dir, setDir] = useState<"rtl" | "ltr">(currentDir);

  useEffect(() => {
    const newDir = i18n.language === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const theme = useMemo(
    () => createTheme(themeSettings(mode, dir)),
    [mode, dir]
  );
  const cache = useMemo(() => (dir === "rtl" ? rtlCache : null), [dir]);
  console.log(theme);
  console.log(cache);

  return (
    <>
      {dir === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {renderRouter()}
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {renderRouter()}
        </ThemeProvider>
      )}
    </>
  );
}

  function renderRouter() {
    return (
      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Dashboard />} />
            {sidebarItemsData?.map((item, idx) =>
              item?.submenu ? AddRoute(item, idx) : null
            )}
          </Route>
        <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    );
  }

function AddRoute(item: ISidebarItem, idx: number) {
  return (
    <Route
      key={idx}
      path={item.path ?? "/"}
      element={item.page ? <item.page /> : null}
    >
      {item.submenu
        ? item.submenu.map((subItem, idx) => AddRoute(subItem, idx))
        : null}
    </Route>
  );
}

export default App;
