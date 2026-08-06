import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../../Components/Loader";
import { useAuth } from "./AuthProvider";
import { authStorage } from "./authStorage";
import { isTokenExpired } from "./tokenUtils";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  const accessToken = authStorage.getAccessToken();
  const hasValidSession = isAuthenticated && accessToken && !isTokenExpired(accessToken);

  if (!hasValidSession) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
