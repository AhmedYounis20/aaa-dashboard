import { useEffect, useState } from "react";
import { Link as RouterLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { UserLoginModel } from "../../../interfaces/Auth/UserLoginModel";
import { toastify } from "../../../Helper/toastify";
import { useAuth } from "../../../features/auth";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [userInput, setUserInput] = useState<UserLoginModel>({
    username: "",
    password: "",
  });

  const redirectPath =
    (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath]);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const result = await login(userInput);

      if (result.success) {
        navigate(redirectPath, { replace: true });
        return;
      }

      result.errorMessages?.forEach((message) => toastify(message, "error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t("Login")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("SignInToAccount")}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              required
              margin="normal"
              label={t("Username")}
              name="username"
              autoComplete="username"
              value={userInput.username}
              onChange={(event) =>
                setUserInput((prev) => ({ ...prev, username: event.target.value }))
              }
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label={t("Password")}
              name="password"
              type="password"
              autoComplete="current-password"
              value={userInput.password}
              onChange={(event) =>
                setUserInput((prev) => ({ ...prev, password: event.target.value }))
              }
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              sx={{ mt: 3 }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : t("Login")}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            <Link component={RouterLink} to="/register" underline="hover">
              {t("Register")}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
