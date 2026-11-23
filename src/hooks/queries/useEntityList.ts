import { useQuery } from "@tanstack/react-query";
import { ApiResult } from "@/interfaces/ApiResponse";
import { unwrapApiResult } from "@/lib/unwrapApiResult";

interface UseEntityListOptions<T> {
  queryKey: readonly unknown[];
  fetcher: (signal?: AbortSignal) => Promise<ApiResult<T[]>>;
  enabled?: boolean;
  staleTime?: number;
}

export function useEntityList<T>({
  queryKey,
  fetcher,
  enabled = true,
  staleTime,
}: UseEntityListOptions<T>) {
  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => unwrapApiResult(await fetcher(signal)),
    enabled,
    staleTime,
  });
}
