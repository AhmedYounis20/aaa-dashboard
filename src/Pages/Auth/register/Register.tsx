import { useEffect } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { toastify } from "../../../Helper/toastify";
import { useAuth } from "../../../features/auth";

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toastify(t("RegistrationNotAvailable"), "info");
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
            {t("Register")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("CreateYourAccount")}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label={t("Username")}
              name="username"
              autoComplete="username"
              disabled
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label={t("Email")}
              name="email"
              type="email"
              autoComplete="email"
              disabled
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label={t("Password")}
              name="password"
              type="password"
              autoComplete="new-password"
              disabled
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label={t("RepeatPassword")}
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              disabled
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              sx={{ mt: 3, mb: 2, textTransform: "none" }}
            >
              {t("CreateAccount")}
            </Button>
            <Typography variant="body2" align="center">
              <Link component={RouterLink} to="/login" underline="hover">
                {t("Login")}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
