import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../Apis/Identity/authApi";
import { UserLoginModel } from "../../interfaces/Auth/UserLoginModel";
import { UserModel } from "../../interfaces/Auth/UserModel";
import {
  initialuserState,
  setLoggedInUser,
} from "../../Storage/Redux/userAuthSlice";
import { refreshTokens } from "../../lib/apiClient";
import { setUnauthorizedHandler } from "./authEvents";
import { authStorage } from "./authStorage";
import { decodeUserFromToken, isTokenExpired } from "./tokenUtils";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserModel | null;
  login: (credentials: UserLoginModel) => Promise<{
    success: boolean;
    errorMessages?: string[];
  }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserModel | null>(null);

  const clearSession = useCallback(() => {
    authStorage.clear();
    setUser(null);
    dispatch(setLoggedInUser(initialuserState));
  }, [dispatch]);

  const logout = useCallback(() => {
    clearSession();
    navigate("/login", { replace: true });
  }, [clearSession, navigate]);

  const establishSession = useCallback(
    (accessToken: string, refreshToken: string) => {
      authStorage.setTokens(accessToken, refreshToken);
      const userData = decodeUserFromToken(accessToken);
      setUser(userData);
      dispatch(setLoggedInUser(userData));
    },
    [dispatch]
  );

  const login = useCallback(
    async (
      credentials: UserLoginModel
    ): Promise<{ success: boolean; errorMessages?: string[] }> => {
      const response = await loginRequest(credentials);

      if (response?.isSuccess) {
        const { accessToken, refreshToken } = response.result;
        establishSession(accessToken, refreshToken);
        return { success: true };
      }

      return {
        success: false,
        errorMessages: response?.errorMessages,
      };
    },
    [establishSession]
  );

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      navigate("/login", { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [clearSession, navigate]);

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      const accessToken = authStorage.getAccessToken();
      const refreshToken = authStorage.getRefreshToken();

      if (accessToken && !isTokenExpired(accessToken)) {
        try {
          const userData = decodeUserFromToken(accessToken);
          if (!cancelled) {
            setUser(userData);
            dispatch(setLoggedInUser(userData));
          }
        } catch {
          clearSession();
        }
      } else if (refreshToken) {
        const refreshed = await refreshTokens();
        if (cancelled) return;

        if (refreshed) {
          const newAccessToken = authStorage.getAccessToken();
          if (newAccessToken) {
            try {
              const userData = decodeUserFromToken(newAccessToken);
              setUser(userData);
              dispatch(setLoggedInUser(userData));
            } catch {
              clearSession();
            }
          } else {
            clearSession();
          }
        } else {
          clearSession();
        }
      } else if (accessToken) {
        clearSession();
      }

      if (!cancelled) {
        setIsLoading(false);
      }
    };

    void bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [clearSession, dispatch]);

  useEffect(() => {
    if (!user) return;

    const intervalId = window.setInterval(() => {
      const accessToken = authStorage.getAccessToken();
      if (!accessToken || isTokenExpired(accessToken, 60)) {
        void refreshTokens().then((refreshed) => {
          if (refreshed) {
            const newToken = authStorage.getAccessToken();
            if (newToken) {
              const userData = decodeUserFromToken(newToken);
              setUser(userData);
              dispatch(setLoggedInUser(userData));
            }
          }
        });
      }
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [dispatch, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      user,
      login,
      logout,
    }),
    [isLoading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export { AuthContext };
