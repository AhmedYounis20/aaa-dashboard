# Authentication Flow

This document describes how authentication works in the AAA Dashboard frontend after Sprint 2.

## Overview

```
Login Page → AuthProvider.login() → authApi → apiClient
                ↓
         authStorage (localStorage tokens)
                ↓
         AuthContext / useAuth() (user profile for UI)
                ↓
ProtectedRoute → validates token expiry → renders app routes
                ↓
apiClient interceptors → attach Bearer token + Accept-Language
                ↓
401 response → refreshTokens() → retry request OR logout
```

Redux is **theme-only** (`global` slice). User identity lives solely in `AuthProvider` / `useAuth()` — do not reintroduce a Redux user slice.

## Components

| File | Responsibility |
|------|----------------|
| `src/features/auth/AuthProvider.tsx` | Session state, login/logout, proactive refresh |
| `src/features/auth/ProtectedRoute.tsx` | Route guard with JWT expiry check |
| `src/features/auth/authStorage.ts` | Token read/write/clear in localStorage |
| `src/features/auth/tokenUtils.ts` | JWT decode + expiry validation |
| `src/features/auth/authEvents.ts` | Unauthorized callback (redirect to login) |
| `src/lib/apiClient.ts` | Axios instance, interceptors, token refresh |
| `src/Apis/Axios/axiosMethods.ts` | Toast notifications wrapper over apiClient |

## Login Flow

1. User submits credentials on `/login`
2. `AuthProvider.login()` calls `authApi.loginRequest()` (no auto-toast)
3. On success:
   - Access + refresh tokens saved via `authStorage.setTokens()`
   - User profile decoded from JWT and stored in AuthContext (`useAuth().user`)
   - User redirected to intended route (or `/`)
4. On failure:
   - Login page displays error toasts from API `errorMessages`

## Protected Routes

`ProtectedRoute` wraps all authenticated routes in `App.tsx`:

- Shows loader while `AuthProvider` initializes session
- Redirects to `/login` if no valid non-expired access token
- Preserves intended URL in `location.state.from` for post-login redirect

## API Requests

Every request through `apiClient`:

1. Adds `Authorization: Bearer <accessToken>` when present
2. Sets `Accept-Language` from current i18n language (`localStorage.i18nextLng`)
3. On **401**:
   - Calls `refreshTokens()` once (deduplicated if concurrent)
   - Retries original request with new token
   - On refresh failure: clears session and redirects to login

## Proactive Token Refresh

`AuthProvider` runs a 5-minute interval that refreshes tokens when the access token is within 60 seconds of expiry. This complements the reactive 401 refresh in `apiClient`.

## Logout Flow

1. User clicks logout in `AppHeader`
2. `AuthProvider.logout()` clears tokens, AuthContext user state, and navigates to `/login`
3. Refresh token is also removed (previously only access token was cleared)

## Security Notes

- **localStorage token XSS tradeoff:** Access and refresh tokens are stored in `localStorage` so any XSS can exfiltrate them. Prefer httpOnly secure cookies once the backend supports cookie-based auth; until then, harden XSS defenses (CSP, sanitization) and treat client-side JWT checks as UX only.
- JWT expiry is validated client-side before rendering protected routes.
- Client-side checks are UX guards only; the backend must enforce authorization on every API call.

## Testing Checklist

- [ ] Login with valid credentials → lands on dashboard
- [ ] Login with invalid credentials → error toast, stays on login
- [ ] Access protected URL while logged out → redirect to login, then back after login
- [ ] Logout → clears session, cannot access protected routes
- [ ] Switch language → subsequent API calls send updated `Accept-Language`
- [ ] Expired token → refresh or redirect to login
