# Styling debt (Phase D)

## Decision

**Primary:** MUI (`sx` / theme). Secondary systems should shrink over time.

## Tailwind

- Config uses Tailwind v3 `content:` (not the deprecated v2 `purge` key).
- Still present for scattered utility classes in layout/pages.
- Residual: either migrate remaining Tailwind utilities to MUI `sx`, or remove the Tailwind/PostCSS pipeline once unused.

## Bootstrap

- **JS CDN:** removed (no `data-bs-*` / `bootstrap.*` usage).
- **CSS CDN:** still loaded from `index.html` (RTL Bootstrap 5.3.2).
- Residual: ~48 form/page files still use Bootstrap grid/utilities (`row`, `col-*`, `card`, `d-flex`, `btn`, …).
- Shared shell already on MUI: `BaseForm`, `SubLedgerForm`, `Loader`, `AppContent`, `DefaultLayout`.
- Drop the Bootstrap CSS CDN after those forms are migrated to MUI `Grid` / `Stack` / `Box`.

## Icons CDNs

- `boxicons` and `bootstrap-icons` remain in `index.html` for legacy class-based icons.
- Prefer MUI icons / `react-icons` for new UI; remove icon CDNs when class usages are gone.
