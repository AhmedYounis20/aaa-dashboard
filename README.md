# Accounting Management System — Frontend

Frontend for the **Accounting Management System (AAA ERP)**: general ledger, sub-ledgers, journal entries, and inventory (products, variants, transfers, transactions).

- **Live demo:** [ERP Frontend System](https://erp-frontend-system.netlify.app)
- **Backend repo:** [Accounting Management System](https://github.com/AhmedYounis20/AAA.ERP)
- **Enhancement plan:** [docs/ENHANCEMENT_PLAN.md](docs/ENHANCEMENT_PLAN.md)

## Tech Stack

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-593D88?logo=redux&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-5-0081CB?logo=mui&logoColor=white)

- **React 18** + **TypeScript** + **Vite**
- **Redux Toolkit** (auth & theme)
- **MUI** + **ag-Grid** for UI and data grids
- **Axios** for API calls
- **Yup** for validation
- **i18next** for English / Arabic (RTL)

## Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm** 9+
- Backend API running (see [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md))

## Quick Start

```bash
git clone https://github.com/AhmedYounis20/aaa-dashboard.git
cd aaa-dashboard
npm install
cp .env.example .env.development   # if .env.development is missing
npm run dev
```

The app runs at **http://localhost:5173** (Vite default).

Obtain login credentials from your team lead or backend seed documentation — do not commit credentials to the repository.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Typecheck + production build |
| `npm run typecheck` | Run TypeScript without emitting |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (write) |
| `npm run format:check` | Prettier (check only) |
| `npm run preview` | Preview production build locally |

## Environment Variables

All client-side config uses `VITE_*` variables. See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for the full list and deployment notes.

Minimum required:

```env
VITE_APP_ENV=development
VITE_API_BASE_URL=https://localhost:7248/api/
VITE_PAYABLE_NOTES_ID=<uuid>
VITE_RECEIVABLE_NOTES_ID=<uuid>
```

## Project Structure

```
src/
├── Apis/              # Domain API functions (axios)
├── Components/        # Shared UI (forms, tables, layout)
├── Container/         # App root
├── Helper/            # Utilities (validation, toast, enums)
├── features/auth/     # Auth provider, route guard, token utils
├── interfaces/        # TypeScript models & validation schemas
├── layout/            # DefaultLayout shell
├── locales/           # i18n translations (en, ar)
├── Pages/             # Feature pages (Account, Inventory, Auth)
├── Storage/           # Redux store
└── Utilities/         # Routes, theme, config
```

## Features

- **General Ledger:** Chart of accounts, GL settings, financial periods, currencies
- **Sub-ledgers:** Banks, taxes, cash boxes, customers, suppliers, fixed assets, branches
- **Entries:** Combined, payment/receipt vouchers, journal, opening entries
- **Inventory:** Products, variants, attributes, transfers, import/export transactions
- **i18n:** English and Arabic with RTL layout support

## CI

Pull requests to `main` / `develop` run:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run build`

See [.github/workflows/ci.yml](.github/workflows/ci.yml).

## Contributing

1. Create a feature branch from `develop`
2. Ensure `npm run lint`, `npm run typecheck`, and `npm run build` pass locally
3. Open a PR — CI must be green before merge

For architecture improvements, follow the sprint plan in [docs/ENHANCEMENT_PLAN.md](docs/ENHANCEMENT_PLAN.md).
