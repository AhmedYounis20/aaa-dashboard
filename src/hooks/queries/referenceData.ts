import { useQuery } from "@tanstack/react-query";
import { getBranches } from "@/Apis/Account/BranchesApi";
import { getChartOfAccounts } from "@/Apis/Account/ChartOfAccountsApi";
import { getCollectionBooks } from "@/Apis/Account/CollectionBooksApi";
import { getCostCenters } from "@/Apis/Account/CostCenterApi";
import { getCurrencies } from "@/Apis/Account/CurrenciesApi";
import BranchModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/Branches/BranchModel";
import type { ChartOfAccountModel, CollectionBookModel } from "@/interfaces/ProjectInterfaces";
import type { CostCenterModel } from "@/interfaces/ProjectInterfaces/Account/CostCenters/costCenterModel";
import CurrencyModel from "@/interfaces/ProjectInterfaces/Account/Currencies/CurrencyModel";
import { queryKeys, REF_DATA_STALE_TIME_MS } from "@/shared/lib/queryKeys";
import { unwrapApiResult } from "@/lib/unwrapApiResult";

/**
 * Cross-entity reference-data hooks with a long staleTime (30m).
 * Prefer these in forms/dropdowns instead of ad-hoc `useEffect` fetches.
 * Shares cache keys with entity list hooks where they already exist (e.g. currencies).
 */

export function useCurrencies(enabled = true) {
  return useQuery<CurrencyModel[]>({
    queryKey: queryKeys.currencies.all,
    queryFn: async ({ signal }) => unwrapApiResult(await getCurrencies(signal)),
    staleTime: REF_DATA_STALE_TIME_MS,
    enabled,
  });
}

export function useBranches(enabled = true) {
  return useQuery<BranchModel[]>({
    queryKey: queryKeys.branches.all,
    queryFn: async ({ signal }) => unwrapApiResult(await getBranches(signal)),
    staleTime: REF_DATA_STALE_TIME_MS,
    enabled,
  });
}

export function useChartOfAccounts(enabled = true) {
  return useQuery<ChartOfAccountModel[]>({
    queryKey: queryKeys.chartOfAccounts.all,
    queryFn: async ({ signal }) => unwrapApiResult(await getChartOfAccounts(signal)),
    staleTime: REF_DATA_STALE_TIME_MS,
    enabled,
  });
}

export function useCostCenters(enabled = true) {
  return useQuery<CostCenterModel[]>({
    queryKey: queryKeys.costCenters.all,
    queryFn: async ({ signal }) => unwrapApiResult(await getCostCenters(signal)),
    staleTime: REF_DATA_STALE_TIME_MS,
    enabled,
  });
}

export function useCollectionBooks(enabled = true) {
  return useQuery<CollectionBookModel[]>({
    queryKey: queryKeys.collectionBooks.all,
    queryFn: async ({ signal }) => unwrapApiResult(await getCollectionBooks(signal)),
    staleTime: REF_DATA_STALE_TIME_MS,
    enabled,
  });
}
