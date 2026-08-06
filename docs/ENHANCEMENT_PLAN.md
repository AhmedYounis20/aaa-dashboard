# AAA Dashboard — Enhancement Plan

**Document version:** 1.0  
**Date:** August 6, 2026  
**Scope:** Frontend (`aaa-dashboard`) — architecture hardening & scalability  
**Sprint length:** 2 weeks (10 working days)  
**Team assumption:** 2 frontend developers + 1 part-time tech lead reviewer

---

## Table of Contents

1. [Goals & Success Criteria](#1-goals--success-criteria)
2. [Guiding Principles](#2-guiding-principles)
3. [Roadmap Overview](#3-roadmap-overview)
4. [Sprint Plans](#4-sprint-plans)
5. [Dependency Map](#5-dependency-map)
6. [Risk Register](#6-risk-register)
7. [Definition of Done](#7-definition-of-done)
8. [Appendix: New Entity Checklist](#8-appendix-new-entity-checklist)

---

## 1. Goals & Success Criteria

### Primary Goals

| # | Goal | Target |
|---|------|--------|
| G1 | Safe, environment-driven deployments | Zero hardcoded API URLs or secrets in source |
| G2 | Predictable quality | Every PR passes lint, typecheck, build in CI |
| G3 | Reduced duplication | Server-state logic centralized; no copy-paste fetch in new modules |
| G4 | Production-ready auth | Token validation, route guards, foundation for RBAC |
| G5 | Maintainable codebase | Consistent TS, path aliases, lean dependencies |
| G6 | Regression safety | Critical paths covered by automated tests |

### Success Metrics (End of Phase 3)

- CI green on `main` for 4 consecutive weeks
- New CRUD module scaffolded in ≤ 1 day (down from ~2–3 days)
- Initial JS bundle reduced by ≥ 15% after dependency cleanup
- 0 `console.log` in `src/Apis` and auth flow
- ≥ 60% of list pages migrated to shared server-state hooks
- Login + 2 CRUD flows covered by E2E tests

---

## 2. Guiding Principles

1. **Enhance, don't rewrite** — Keep Root/Form pattern; improve infrastructure around it.
2. **One sprint, one theme** — Avoid mixing infra and feature work in the same sprint.
3. **Migrate opportunistically** — New patterns apply to new/changed code first; bulk migration in dedicated tasks.
4. **Backend alignment** — Auth/RBAC and env URLs must match backend capabilities; flag blockers early.
5. **Small PRs** — Target PRs ≤ 400 lines; one concern per PR.

---

## 3. Roadmap Overview

```
Phase 1 — Foundation          Sprints 1–2   (Weeks 1–4)
Phase 2 — State & Structure   Sprints 3–5   (Weeks 5–10)
Phase 3 — Quality & Scale     Sprints 6–8   (Weeks 11–16)
Phase 4 — Optional Strategic  Sprints 9+    (Backlog)
```

| Phase | Sprints | Theme |
|-------|---------|-------|
| 1 | 1–2 | Config, CI, HTTP client, auth basics, docs |
| 2 | 3–5 | Server state, routing, TS consistency, errors |
| 3 | 6–8 | Testing, RBAC, inventory refactor, performance |
| 4 | 9+ | Codegen, Storybook, advanced modularization |

---

## 4. Sprint Plans

---

### Sprint 1 — Configuration & Quality Gates

**Goal:** Make the project deployable and verifiable across environments without code changes.

**Capacity:** 2 devs × 10 days = ~20 dev-days

#### Tasks

| ID | Task | Owner | Est. | Priority |
|----|------|-------|------|----------|
| S1-T1 | Add Vite env support (`VITE_API_BASE_URL`, `VITE_APP_ENV`) | Dev A | 0.5d | P0 |
| S1-T2 | Create `.env.example` with documented variables (no secrets) | Dev A | 0.5d | P0 |
| S1-T3 | Replace hardcoded `baseUrl` in `src/Utilities/SD.ts` with `import.meta.env` | Dev A | 0.5d | P0 |
| S1-T4 | Move `payableNotesId` / `receivableNotesId` to env or settings API stub | Dev A | 1d | P1 |
| S1-T5 | Add GitHub Actions workflow: `lint` → `tsc --noEmit` → `vite build` | Dev B | 1d | P0 |
| S1-T6 | Fix README: React 18, Vite commands, remove hardcoded credentials | Dev B | 0.5d | P0 |
| S1-T7 | Add `npm run typecheck` script (`tsc --noEmit`) | Dev B | 0.25d | P0 |
| S1-T8 | Verify `.gitignore` covers `dist/`, `.env*`, logs; remove tracked build artifacts if any | Dev B | 0.25d | P0 |
| S1-T9 | Add Prettier + format script; optional format-on-CI (check only) | Dev B | 1d | P2 |
| S1-T10 | Spike: document backend env URLs for dev/staging/prod | Tech Lead | 0.5d | P0 |

#### Acceptance Criteria

- [x] App runs with `VITE_API_BASE_URL` from `.env.development`
- [x] CI runs on every PR to `main` / develop branch
- [x] README setup instructions match actual project (`npm run dev`, port from Vite)
- [x] No plaintext credentials in repository
- [x] `npm run build` succeeds in CI without local-only config

> **Sprint 1 completed:** Aug 6, 2026 — see git history for deliverables.

#### Deliverables

- `.env.example`
- `.github/workflows/ci.yml`
- Updated `README.md`
- Updated `src/Utilities/SD.ts`

---

### Sprint 2 — HTTP Client & Authentication Hardening

**Goal:** Reliable, testable API layer and typed route protection.

**Capacity:** ~20 dev-days

#### Tasks

| ID | Task | Owner | Est. | Priority |
|----|------|-------|------|----------|
| S2-T1 | Refactor `axiosMethods.ts` → `src/lib/apiClient.ts` (single axios instance) | Dev A | 1.5d | P0 |
| S2-T2 | Fix shared mutable GET config bug (per-request params) | Dev A | 0.5d | P0 |
| S2-T3 | Read `Accept-Language` from i18n in request interceptor (not module init) | Dev A | 0.5d | P0 |
| S2-T4 | Remove/gate `console.log` in API layer behind `import.meta.env.DEV` logger | Dev A | 0.5d | P1 |
| S2-T5 | Decouple toast notifications from HTTP layer (return errors; callers toast) | Dev A | 1.5d | P1 |
| S2-T6 | Consolidate token refresh: remove duplicate `setInterval` + 401 retry logic overlap | Dev A | 1d | P0 |
| S2-T7 | Create `src/features/auth/` — `AuthContext`, `useAuth`, token expiry check via `jwt-decode` | Dev B | 2d | P0 |
| S2-T8 | Replace `withAuth.jsx` HOC with typed `ProtectedRoute` component | Dev B | 1d | P0 |
| S2-T9 | Use React Router `Navigate` instead of `window.location.replace` | Dev B | 0.5d | P0 |
| S2-T10 | Sync Redux `userAuthStore` with `AuthContext` on login/logout/refresh | Dev B | 1d | P1 |
| S2-T11 | Migrate Login page from Bootstrap to MUI (visual parity) | Dev B | 1.5d | P2 |
| S2-T12 | Write auth flow doc (login → token storage → refresh → logout) | Tech Lead | 0.5d | P1 |

#### Acceptance Criteria

- [x] Expired token redirects to login before API call fails visibly
- [x] Language switch updates API `Accept-Language` on next request
- [x] No `console.log` in production build for API/auth code paths
- [x] `withAuth.jsx` deleted; all guards use `ProtectedRoute`
- [ ] Manual test: login → navigate → wait for token refresh → API still works

> **Sprint 2 completed:** Aug 6, 2026 — apiClient refactor + typed auth guard.

#### Deliverables

- `src/lib/apiClient.ts`
- `src/features/auth/AuthProvider.tsx`
- `src/features/auth/ProtectedRoute.tsx`
- `docs/AUTH_FLOW.md`

---

### Sprint 3 — Server State Foundation (TanStack Query)

**Goal:** Introduce centralized server-state management; migrate pilot modules.

**Decision:** TanStack Query (lighter migration from current axios functions than full RTK Query adoption).

**Capacity:** ~20 dev-days

#### Tasks

| ID | Task | Owner | Est. | Priority |
|----|------|-------|------|----------|
| S3-T1 | ADR: document choice of TanStack Query vs RTK Query | Tech Lead | 0.5d | P0 |
| S3-T2 | Install `@tanstack/react-query`; add `QueryClientProvider` in `main.tsx` | Dev A | 0.5d | P0 |
| S3-T3 | Create query key factory pattern (`src/lib/queryKeys.ts`) | Dev A | 0.5d | P0 |
| S3-T4 | Create generic hooks: `useEntityList`, `useEntityDetail`, `useEntityMutation` | Dev A | 2d | P0 |
| S3-T5 | Configure default options: staleTime, retry, global error handler | Dev A | 0.5d | P1 |
| S3-T6 | **Pilot migrate:** `Currencies` module (Root + Form) | Dev A | 1.5d | P0 |
| S3-T7 | **Pilot migrate:** `PackingUnits` module | Dev B | 1.5d | P0 |
| S3-T8 | **Pilot migrate:** `ManufacturerCompanies` module | Dev B | 1.5d | P0 |
| S3-T9 | Remove commented RTK Query code in `EntriesApi.ts` (or archive in ADR) | Dev B | 0.25d | P2 |
| S3-T10 | Document migration guide: "Converting a Root page to TanStack Query" | Dev A | 0.5d | P1 |
| S3-T11 | Add React Query DevTools (dev only) | Dev B | 0.25d | P2 |

#### Acceptance Criteria

- [x] 3 modules use TanStack Query with no local `fetchData` + `useEffect`
- [x] Create/update/delete invalidates list cache automatically
- [x] Loading and error states consistent across migrated modules
- [x] Migration guide reviewed by second dev before wider rollout

> **Sprint 3 implemented (pending review):** Aug 6, 2026 — not committed yet.

#### Deliverables

- `src/lib/queryClient.ts`
- `src/hooks/queries/useEntityList.ts` (and related)
- `docs/SERVER_STATE_MIGRATION.md`
- 3 migrated modules

---

### Sprint 4 — Routing, Aliases & TypeScript Consistency

**Goal:** Cleaner imports, scalable routing, full TypeScript coverage for shared infra.

**Capacity:** ~20 dev-days

#### Tasks

| ID | Task | Owner | Est. | Priority |
|----|------|-------|------|----------|
| S4-T1 | Add path aliases in `vite.config.ts` + `tsconfig.json` (`@/`, `@/features`, etc.) | Dev A | 0.5d | P0 |
| S4-T2 | Split `Utilities/routes.ts` → `routes/` + `config/sidebar.config.ts` | Dev A | 2d | P0 |
| S4-T3 | Implement lazy-loaded route modules (`React.lazy` + `Suspense`) | Dev A | 1.5d | P1 |
| S4-T4 | Add route-level loading fallback component | Dev A | 0.5d | P1 |
| S4-T5 | Convert `withAuth.jsx` remnants, `DataTable.jsx`, `DataTreeTable.jsx` → `.tsx` | Dev B | 2d | P0 |
| S4-T6 | Convert `InputSelect.jsx`, `InputAutoCompelete.jsx` → `.tsx` | Dev B | 1d | P1 |
| S4-T7 | Type `AppContent` props with generics (reduce `any`) | Dev B | 1.5d | P1 |
| S4-T8 | Type Redux slices (`PayloadAction<UserModel>`, etc.) | Dev B | 0.5d | P1 |
| S4-T9 | Bulk-update imports in 5 Account modules to use `@/` aliases | Dev A | 1d | P2 |
| S4-T10 | Fix route path inconsistencies (document breaking changes; align with backend) | Tech Lead | 1d | P2 |

#### Acceptance Criteria

- [ ] No relative imports deeper than `../` in new/edited files
- [ ] Sidebar config importable without pulling all page components eagerly
- [ ] All shared infra files are `.tsx` / `.ts` (no `.jsx` in `Components/`, `Hoc/`)
- [ ] App builds with code-split chunks per major domain

#### Deliverables

- `src/routes/account.routes.tsx`
- `src/routes/inventory.routes.tsx`
- `src/config/sidebar.config.ts`
- Updated `tsconfig.json` paths

---

### Sprint 5 — Error Handling & Dependency Cleanup

**Goal:** Resilient UX and leaner bundle.

**Capacity:** ~20 dev-days

#### Tasks

| ID | Task | Owner | Est. | Priority |
|----|------|-------|------|----------|
| S5-T1 | Add `AppErrorBoundary` wrapping `<Outlet />` in `DefaultLayout` | Dev A | 1d | P0 |
| S5-T2 | Create standard `ErrorState`, `EmptyState`, `LoadingState` components | Dev A | 1d | P0 |
| S5-T3 | Integrate error/empty states into `AppContent` | Dev A | 1d | P0 |
| S5-T4 | Audit `package.json` — identify unused dependencies | Dev B | 0.5d | P0 |
| S5-T5 | Remove unused packages: formik, primereact, react-table, react-select, react-dropdown-select, flowbite, material-tailwind (if confirmed unused) | Dev B | 1d | P0 |
| S5-T6 | Remove bootstrap/react-bootstrap after Login MUI migration (Sprint 2) | Dev B | 0.5d | P1 |
| S5-T7 | Consolidate date lib to `dayjs` only (remove `date-fns` if unused) | Dev B | 0.5d | P2 |
| S5-T8 | Add `vite-bundle-visualizer`; capture before/after bundle report | Dev B | 0.5d | P1 |
| S5-T9 | Migrate 4 more list modules to TanStack Query (Banks, Taxes, SellingPrices, Attributes) | Dev A | 3d | P1 |
| S5-T10 | Add global API error page (403/500) with retry action | Dev A | 1d | P2 |

#### Acceptance Criteria

- [ ] Render error in a child route does not white-screen entire app
- [ ] Bundle size report attached to sprint review
- [ ] Removed deps do not break build
- [ ] 7 total modules on TanStack Query (3 from S3 + 4 this sprint)

#### Deliverables

- `src/components/feedback/AppErrorBoundary.tsx`
- `docs/BUNDLE_AUDIT.md`
- Updated `package.json`

---

### Sprint 6 — Testing Foundation

**Goal:** Automated regression safety for core infrastructure and one domain.

**Capacity:** ~20 dev-days

#### Tasks

| ID | Task | Owner | Est. | Priority |
|----|------|-------|------|----------|
| S6-T1 | Install Vitest + React Testing Library + MSW | Dev A | 1d | P0 |
| S6-T2 | Configure Vitest in `vite.config.ts`; add `npm run test` | Dev A | 0.5d | P0 |
| S6-T3 | Add test CI job (run on PR) | Dev A | 0.5d | P0 |
| S6-T4 | Unit tests: `apiClient` interceptors (auth header, 401 retry, language) | Dev A | 2d | P0 |
| S6-T5 | Unit tests: `handleValidationErrors`, 3 Yup schemas (product, bank, entry) | Dev B | 2d | P0 |
| S6-T6 | Component tests: `ProtectedRoute` (authenticated vs not) | Dev B | 1d | P0 |
| S6-T7 | Hook tests: `useEntityList` with MSW mock | Dev A | 1.5d | P1 |
| S6-T8 | Component tests: `BaseForm` submit flows (add/edit/delete) | Dev B | 1.5d | P1 |
| S6-T9 | Set coverage threshold (start low: 20% lines on `src/lib`, `src/hooks`, `src/features/auth`) | Dev A | 0.5d | P2 |
| S6-T10 | Document testing conventions in `docs/TESTING.md` | Dev B | 0.5d | P1 |

#### Acceptance Criteria

- [ ] `npm run test` passes locally and in CI
- [ ] Auth and API client have ≥ 80% coverage
- [ ] New PR template mentions test requirement for logic changes

#### Deliverables

- `vitest.config.ts`
- `src/lib/__tests__/apiClient.test.ts`
- `docs/TESTING.md`

---

### Sprint 7 — RBAC & TanStack Query Rollout (Account Domain)

**Goal:** Role-aware navigation and majority of Account modules on server-state hooks.

**Capacity:** ~20 dev-days  
**Dependency:** Backend must expose roles/permissions (or document static role map).

#### Tasks

| ID | Task | Owner | Est. | Priority |
|----|------|-------|------|----------|
| S7-T1 | Define permission model (`docs/RBAC.md`) — align with backend claims/roles | Tech Lead | 1d | P0 |
| S7-T2 | Create `permissions.ts` map: route → required roles | Dev A | 1d | P0 |
| S7-T3 | Add `RequirePermission` wrapper for routes | Dev A | 1d | P0 |
| S7-T4 | Hide sidebar items user cannot access | Dev A | 1d | P0 |
| S7-T5 | Disable action buttons (add/edit/delete) based on permission | Dev B | 1.5d | P1 |
| S7-T6 | Migrate Sub-ledgers to TanStack Query (Banks, Customers, Suppliers, Branches) | Dev B | 3d | P0 |
| S7-T7 | Migrate Settings to TanStack Query (GL Settings, Cost Centers, Financial Periods, Collection Books) | Dev A | 3d | P0 |
| S7-T8 | Migrate Chart of Accounts + Account Guides | Dev A | 2d | P1 |
| S7-T9 | Manual QA matrix: test admin vs restricted role (if available) | QA/Dev | 1d | P0 |

#### Acceptance Criteria

- [ ] Unauthorized route shows 403 page, not blank screen
- [ ] Sidebar reflects user role
- [ ] ≥ 80% of Account list pages use TanStack Query
- [ ] RBAC doc signed off by backend team

#### Deliverables

- `src/features/auth/permissions.ts`
- `src/features/auth/RequirePermission.tsx`
- `docs/RBAC.md`

---

### Sprint 8 — Inventory Refactor, E2E & Performance

**Goal:** Tame Inventory complexity; end-to-end confidence; measurable performance win.

**Capacity:** ~20 dev-days

#### Tasks

| ID | Task | Owner | Est. | Priority |
|----|------|-------|------|----------|
| S8-T1 | Create `src/features/inventory/shared/` — extract packing units, discounts, cost centers inputs | Dev A | 3d | P0 |
| S8-T2 | Create shared hooks: `usePackingUnitsInput`, `useSellingPriceDiscounts` | Dev A | 2d | P0 |
| S8-T3 | Migrate Products + Variants to TanStack Query | Dev B | 2d | P0 |
| S8-T4 | Migrate Inventory Transfers + Transactions to TanStack Query | Dev B | 2d | P0 |
| S8-T5 | Install Playwright; add E2E: login → dashboard | Dev B | 1d | P0 |
| S8-T6 | E2E: Currencies CRUD smoke test | Dev B | 1.5d | P0 |
| S8-T7 | E2E: Products list + open form smoke test | Dev B | 1.5d | P1 |
| S8-T8 | Add E2E to CI (headless, against staging API) | Dev A | 1d | P1 |
| S8-T9 | Performance: memoize heavy table columns; audit unnecessary re-renders in ProductsForm | Dev A | 1d | P2 |
| S8-T10 | Final bundle comparison report vs Sprint 5 baseline | Dev B | 0.5d | P1 |

#### Acceptance Criteria

- [ ] Product and Variant forms share ≥ 3 subcomponents from `inventory/shared`
- [ ] All Inventory list pages on TanStack Query
- [ ] E2E passes in CI against staging
- [ ] Sprint demo: full login → product list → open form flow

#### Deliverables

- `src/features/inventory/shared/`
- `e2e/login.spec.ts`
- `e2e/currencies.spec.ts`
- `docs/PERFORMANCE_REPORT.md`

---

### Phase 4 — Backlog (Sprints 9+)

These are **optional** and prioritized after Phase 3 completion.

| Sprint | Theme | Key Tasks |
|--------|-------|-----------|
| 9 | Form standardization | Adopt React Hook Form + Yup for Entries and Products; remove manual form state |
| 10 | OpenAPI integration | Generate TS client from backend Swagger; deprecate hand-written API files gradually |
| 11 | Storybook | Document BaseForm, AppContent, input components, table variants |
| 12 | Entries domain deep refactor | Extract shared journal line editor; reduce CompinedEntriesForm complexity |
| 13 | Naming & route cleanup | Fix Compined→Combined, SubLeadgers→Subledgers (coordinate API/backend) |
| 14 | Advanced auth | httpOnly cookie session (requires backend); CSRF handling |
| 15 | i18n audit | Extract hardcoded strings; translation coverage report |

---

## 5. Dependency Map

```
Sprint 1 (Env + CI)
    └── Sprint 2 (API + Auth) ── depends on env vars
            └── Sprint 3 (TanStack Query) ── depends on clean apiClient
                    └── Sprint 5 (migrate more modules)
                    └── Sprint 7 (Account rollout)
                    └── Sprint 8 (Inventory rollout)
            └── Sprint 4 (Routes + TS) ── can parallel with S3 partially
    └── Sprint 6 (Testing) ── best after S2 (auth/api stable)

Sprint 5 (Error boundary) ── independent after S1
Sprint 7 (RBAC) ── requires backend role contract
Sprint 8 (E2E) ── requires staging environment + CI from S1
```

### Parallelization Notes

| Can run in parallel | Must be sequential |
|---------------------|-------------------|
| S4 aliases/routing + S3 TanStack Query (different files) | S2 before S3 |
| S5 dependency cleanup + S4 TS migration | S1 before S2 |
| S6 testing setup + S5 error states | S7 RBAC needs S2 auth |
| S8 inventory shared components + S7 migrations (if 3 devs) | E2E needs staging env |

---

## 6. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Backend RBAC not ready for S7 | High | Medium | Use static role map; stub permissions; defer button-level RBAC |
| TanStack Query migration breaks edge-case forms | Medium | Medium | Pilot on simple CRUD first; keep rollback PRs small |
| Removing UI libs breaks hidden usage | Medium | Low | Grep + bundle analyze before removal; one lib per PR |
| E2E flaky in CI | Medium | High | Use staging seed data; retry policy; start with smoke tests only |
| Team continues old patterns during migration | High | Medium | ESLint rule/block PR template; code review checklist |
| Route renames break bookmarks/integrations | Low | Medium | Document in CHANGELOG; add redirects for old paths |

---

## 7. Definition of Done

A task is **Done** when:

- [ ] Code merged to `develop` (or `main`) via reviewed PR
- [ ] CI passes (lint, typecheck, build, tests if applicable)
- [ ] No new `any` without explicit eslint-disable comment and justification
- [ ] No hardcoded URLs, secrets, or credentials
- [ ] Updated docs if behavior or setup changed
- [ ] Manual smoke test recorded for user-facing changes
- [ ] Translation keys added for new user-visible strings (EN + AR)

A sprint is **Done** when:

- [ ] All P0 tasks complete
- [ ] ≥ 80% of planned P1 tasks complete
- [ ] Sprint review demo conducted
- [ ] Retrospective actions captured for next sprint

---

## 8. Appendix: New Entity Checklist

Use this when adding a new ERP module **after Phase 3**:

```
[ ] Create feature folder: src/features/{domain}/{entity}/
[ ] Add models + Yup validation schema
[ ] Add API functions using apiClient
[ ] Add TanStack Query hooks (list, detail, create, update, delete)
[ ] Add query keys to queryKeys.ts
[ ] Create {Entity}Root.tsx + {Entity}Form.tsx using BaseForm + AppContent
[ ] Register route in domain routes file (lazy loaded)
[ ] Add sidebar entry in sidebar.config.ts with permission key
[ ] Add i18n keys (en + ar)
[ ] Add unit tests for validation schema
[ ] Add MSW handlers for hook tests (optional)
[ ] Update RBAC permissions map
```

---

## Sprint Calendar (Reference)

| Sprint | Weeks | Dates (approx.) | Theme |
|--------|-------|-----------------|-------|
| 1 | 1–2 | Aug 6 – Aug 19, 2026 | Config & CI |
| 2 | 3–4 | Aug 20 – Sep 2, 2026 | API & Auth |
| 3 | 5–6 | Sep 3 – Sep 16, 2026 | TanStack Query pilots |
| 4 | 7–8 | Sep 17 – Sep 30, 2026 | Routes & TS |
| 5 | 9–10 | Oct 1 – Oct 14, 2026 | Errors & deps |
| 6 | 11–12 | Oct 15 – Oct 28, 2026 | Testing |
| 7 | 13–14 | Oct 29 – Nov 11, 2026 | RBAC & Account |
| 8 | 15–16 | Nov 12 – Nov 25, 2026 | Inventory & E2E |

---

*Maintained by: Tech Lead / Solution Architect*  
*Next review: End of Sprint 2*
