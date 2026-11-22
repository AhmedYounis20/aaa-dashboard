import { CacheProvider } from "@emotion/react";
import { useMemo, useEffect, useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { rtlCache } from "@/Utilities/rtlCache";
import { themeSettings } from "@/Utilities/theme";
import { RootState } from "@/Storage/Redux/store";
import { AuthProvider, ProtectedRoute } from "@/features/auth";
import { AppRoutes } from "@/routes/AppRoutes";
import RouteLoadingFallback from "@/routes/RouteLoadingFallback";
import Login from "@/Pages/Auth/login/Login";
import Register from "@/Pages/Auth/register/Register";
import Page404 from "@/Pages/ErrorPages/page404/Page404";
import DefaultLayout from "@/layout/DefaultLayout";
import Dashboard from "@/Pages/Dashboard";

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

  const theme = useMemo(() => createTheme(themeSettings(mode, dir)), [mode, dir]);

  const router = (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="items" element={<Navigate to="/products" replace />} />
              <Route path="colors" element={<Navigate to="/products" replace />} />
              <Route path="sizes" element={<Navigate to="/products" replace />} />
              {AppRoutes()}
            </Route>
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      {dir === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {router}
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {router}
        </ThemeProvider>
      )}
    </Suspense>
  );
}

export default App;
