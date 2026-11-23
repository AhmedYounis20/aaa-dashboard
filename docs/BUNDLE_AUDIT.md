# Bundle Dependency Audit — Sprint 5

**Date:** August 6, 2026  
**Method:** Static import scan across `src/` + manual review of `package.json`

## Removed (unused in source)

| Package | Reason |
|---------|--------|
| `@material-tailwind/react` | No imports; app uses MUI |
| `bootstrap` / `react-bootstrap` | Login migrated to MUI; legacy `Login.css` not imported |
| `date-fns` | No imports; dates use `dayjs` + MUI pickers |
| `flowbite` / `flowbite-react` | No imports |
| `formik` | Forms use local state + Yup |
| `primereact` | No imports; tables use ag-Grid / MUI |
| `react-dropdown-select` | No imports |
| `react-select` | No imports; autocomplete uses MUI |
| `react-table` | No imports; tables use ag-Grid |

## Retained (in use)

| Package | Used by |
|---------|---------|
| `chart.js` / `react-chartjs-2` | `Dashboard.tsx` |
| `dayjs` | Date inputs and entry forms |
| `lodash` / `lodash.debounce` | Utilities |
| `react-icons` | Sidebar / header icons |
| `react-pro-sidebar` | Sidebar layout |
| `ag-grid-react` | Data tables |
| `@tanstack/react-query` | Server state (7 modules) |

## Follow-up

- Run `vite-bundle-visualizer` in a future sprint for chunk-level analysis
- Consider lazy-loading `Dashboard.tsx` chart dependencies
- Delete orphaned `src/Pages/Auth/login/Login.css` (unused bootstrap SCSS)
