# Server State Migration Guide (TanStack Query)

This guide explains how to migrate a CRUD module from manual `useState` + `useEffect` fetching to TanStack Query.

**Reference implementations:** Currencies, PackingUnits, ManufacturerCompanies

## Prerequisites

- `@tanstack/react-query` installed
- `QueryClientProvider` in `main.tsx`
- Generic hooks in `src/hooks/queries/`

## Step 1 — Add query keys

In `src/lib/queryKeys.ts`:

```typescript
myEntity: {
  all: ["myEntity"] as const,
  detail: (id: string) => ["myEntity", id] as const,
},
```

Use plural camelCase matching the domain (`packingUnits`, not `PackingUnits`).

## Step 2 — Create entity query hooks

Create `src/hooks/queries/myEntity.ts`:

```typescript
import { getMyEntities, getMyEntityById, createMyEntity, updateMyEntity, deleteMyEntity } from "../../Apis/...";
import { queryKeys } from "../../lib/queryKeys";
import { useEntityList } from "./useEntityList";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityMutations } from "./useEntityMutations";

export function useMyEntitiesList() {
  return useEntityList({ queryKey: queryKeys.myEntity.all, fetcher: getMyEntities });
}

export function useMyEntityDetail(id: string, formType: FormTypes) {
  return useEntityDetail({
    queryKey: queryKeys.myEntity.detail(id),
    fetcher: getMyEntityById,
    id,
    formType,
  });
}

export function useMyEntityMutations() {
  return useEntityMutations({
    listQueryKey: queryKeys.myEntity.all,
    detailQueryKey: queryKeys.myEntity.detail,
    createFn: createMyEntity,
    updateFn: updateMyEntity,
    deleteFn: deleteMyEntity,
  });
}
```

Export from `src/hooks/queries/index.ts`.

## Step 3 — Migrate `*Root.tsx`

**Remove:**
- `data` / `isLoading` state
- `fetchData` function
- `useEffect` for initial fetch
- `afterAction={() => fetchData()}` prop on form

**Add:**
```typescript
const { data = [], isLoading, isFetching, isError, refetch } = useMyEntitiesList();

if (isLoading) return <Loader />;
```

Pass `data` to `AppContent`. Wire the grid sync button so other users' changes can be pulled without a browser refresh:

```typescript
<AppContent
  data={data}
  loading={isFetching}
  onRefresh={() => void refetch()}
  ...
/>
```

- `isLoading` — first load only (full-page loader)
- `isFetching` — any in-flight request (grid spinner during sync)
- `refetch()` — same role as the old `fetchData()` when the user clicks grid refresh
- `refetchOnWindowFocus: true` (global default) — refreshes when the user returns to the browser tab

List auto-refreshes after **local** create/update/delete via cache invalidation. **Remote** changes (another PC/user) require grid refresh or tab focus — same as before, except grid refresh must be wired to `refetch()`.

## Step 4 — Migrate `*Form.tsx`

**Remove:**
- Manual `useEffect` fetch for edit/details
- `afterAction` prop and calls
- Direct API calls in handlers (keep validation)

**Add:**
```typescript
const { data: fetchedModel, isLoading: isDetailLoading } = useMyEntityDetail(id, formType);
const { createMutation, updateMutation, deleteMutation } = useMyEntityMutations();

useEffect(() => {
  if (fetchedModel) setModel(fetchedModel);
}, [fetchedModel]);
```

**Handlers:**
```typescript
const handleAdd = async () => {
  if (!(await validate())) return false;
  try {
    await createMutation.mutateAsync(model);
    return true;
  } catch {
    return false;
  }
};
```

Use `mutateAsync` so `BaseForm` knows success/failure. API toasts still come from `axiosMethods`.

## Step 5 — Verify

- [ ] List loads on page open
- [ ] Add → list updates without manual refresh
- [ ] Edit → form loads entity data
- [ ] Update → list reflects changes
- [ ] Delete → row removed from list
- [ ] React Query DevTools shows cache entries (dev mode)

## Query key conventions

| Key | Usage |
|-----|-------|
| `["entityName"]` | List queries |
| `["entityName", id]` | Detail queries |

## Invalidation rules

`useEntityMutations` automatically:
- Invalidates list key on create/update/delete
- Invalidates detail key on update
- Removes detail cache on delete

## Common pitfalls

1. **Forgetting to export hooks** from `hooks/queries/index.ts`
2. **Not resetting model on Add** — add `useEffect` when `formType === FormTypes.Add`
3. **Double loading states** — use `isDetailLoading` only when `formType !== Add`
4. **Keeping `afterAction`** — no longer needed; remove the prop entirely

## Next modules (planned)

| Sprint | Modules |
|--------|---------|
| 5 | Banks, Taxes, SellingPrices, Attributes |
| 7 | Sub-ledgers, Settings, Chart of Accounts |
| 8 | Products, Variants, Inventory Transfers |

See [ADR 001](./adr/001-tanstack-query.md) for the architectural decision.
