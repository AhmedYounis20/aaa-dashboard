import { useQuery } from "@tanstack/react-query";
import { ApiResult } from "../../interfaces/ApiResponse";
import { unwrapApiResult } from "../../lib/unwrapApiResult";

interface UseEntityListOptions<T> {
  queryKey: readonly unknown[];
  fetcher: () => Promise<ApiResult<T[]>>;
  enabled?: boolean;
}

export function useEntityList<T>({
  queryKey,
  fetcher,
  enabled = true,
}: UseEntityListOptions<T>) {
  return useQuery({
    queryKey,
    queryFn: async () => unwrapApiResult(await fetcher()),
    enabled,
  });
}
