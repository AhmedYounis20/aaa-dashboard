# ADR 001: TanStack Query for Server State

**Status:** Accepted  
**Date:** August 6, 2026  
**Sprint:** 3

## Context

The frontend fetches entity data in each `*Root.tsx` using `useState` + `useEffect` + manual `fetchData()` callbacks. After create/update/delete, forms call `afterAction()` to refetch lists. This pattern duplicates loading/error/cache logic across 25+ modules.

Redux Toolkit is used only for auth and theme. A commented-out RTK Query implementation exists in `EntriesApi.ts` but was never completed.

## Decision

Adopt **TanStack Query (React Query v5)** for all server/API state.

Keep **Redux Toolkit** for client-only UI state (auth profile mirror, theme mode).

## Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **TanStack Query** | Minimal migration from axios functions; framework-agnostic; excellent devtools | Another dependency; learning curve | **Selected** |
| **RTK Query** | Unified with Redux store | Requires refactoring APIs to `createApi`; Redux already underused; commented code abandoned | Rejected |
| **Manual hooks only** | No new dependency | Still duplicates cache/invalidation per module | Rejected |
| **SWR** | Simple API | Less mutation tooling; team less familiar | Rejected |

## Consequences

### Positive
- Automatic cache, deduplication, and background refetch
- List invalidation after mutations without `afterAction` callbacks
- Consistent loading/error states via shared hooks
- DevTools for debugging API state

### Negative
- Team must learn query keys and invalidation patterns
- Two state systems (Redux + TanStack Query) until Redux scope is clarified

### Migration Strategy
1. Add infrastructure (QueryClient, query keys, generic hooks)
2. Pilot on 3 simple CRUD modules: Currencies, PackingUnits, ManufacturerCompanies
3. Document migration guide for remaining modules
4. Roll out module-by-module in Sprints 5, 7, 8

## References

- [TanStack Query docs](https://tanstack.com/query/latest)
- `docs/SERVER_STATE_MIGRATION.md`
