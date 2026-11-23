# Environment Configuration

This document describes environment variables and known backend URLs for the AAA Dashboard frontend.

## Environment Files

| File | Purpose | Committed |
|------|---------|-----------|
| `.env.example` | Template with all variables documented | Yes |
| `.env.development` | Local dev defaults (localhost API) | Yes |
| `.env.production` | Production build defaults (override in hosting) | Yes |
| `.env.local` | Personal overrides (never commit) | No |
| `.env.staging` | Staging build overrides | No |

Vite loads env files automatically based on mode:

- `npm run dev` → `.env.development` + `.env.local`
- `npm run build` → `.env.production` (set vars in CI or hosting provider)

## Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_ENV` | Environment label | `development` |
| `VITE_API_BASE_URL` | Backend API base URL (include trailing `/`) | `https://localhost:7248/api/` |
| `VITE_PAYABLE_NOTES_ID` | Chart-of-accounts ID for payment vouchers | UUID from backend |
| `VITE_RECEIVABLE_NOTES_ID` | Chart-of-accounts ID for receipt vouchers | UUID from backend |

All variables are exposed to the client bundle. **Do not put secrets** (passwords, API keys) in `VITE_*` variables.

## Local Setup

```bash
cp .env.example .env.development
# Edit values as needed, then:
npm run dev
```

If `.env.development` already exists in the repo, you can start directly with `npm run dev`.

## Backend URLs (Reference)

Coordinate with the backend team for current URLs. Known environments:

| Environment | API URL | Notes |
|-------------|---------|-------|
| Local | `https://localhost:7248/api/` | Default .NET dev certificate; trust cert or use HTTP if configured |
| Hosted (legacy demo) | `https://zkjb3c5fq9-001-site1.mtempurl.com/api/` | Previously hardcoded; confirm before use |
| Staging | _TBD_ | Set in `.env.staging` or CI secrets |
| Production | _TBD_ | Set in Netlify/hosting env vars |

## Production / Netlify Deployment

Set these in your hosting provider's environment settings:

```
VITE_APP_ENV=production
VITE_API_BASE_URL=<production-api-url>
VITE_PAYABLE_NOTES_ID=<uuid>
VITE_RECEIVABLE_NOTES_ID=<uuid>
```

Rebuild/redeploy after changing env vars — Vite inlines them at build time.

## CI

GitHub Actions sets env vars inline for the build step (see `.github/workflows/ci.yml`). Update those values when staging/production API URLs are finalized.

## Troubleshooting

**Error: `VITE_API_BASE_URL is not defined`**

Copy `.env.example` to `.env.development` or create `.env.local` with the required variables.

**API calls fail locally**

- Ensure the backend is running on the URL in `VITE_API_BASE_URL`
- For HTTPS localhost, trust the dev certificate or switch backend to HTTP

**Voucher forms cannot find payable/receivable accounts**

Confirm `VITE_PAYABLE_NOTES_ID` and `VITE_RECEIVABLE_NOTES_ID` match chart-of-accounts IDs from your backend seed data.
