import { useQuery } from "@tanstack/react-query";
import { FormTypes } from "@/interfaces/Components/FormType";
import { ApiResult } from "@/interfaces/ApiResponse";
import { unwrapApiResult } from "@/lib/unwrapApiResult";

interface UseEntityDetailOptions<T> {
  queryKey: readonly unknown[];
  fetcher: (id: string, signal?: AbortSignal) => Promise<ApiResult<T>>;
  id: string;
  formType: FormTypes;
  staleTime?: number;
}

/**
 * Entity get-by-id for Edit/Delete/Details. Returns the full Query result
 * (`data`, `isLoading`, `isError`, `error`, `refetch`, …) so forms can show
 * ErrorState and block submit when the load fails.
 */
export function useEntityDetail<T>({
  queryKey,
  fetcher,
  id,
  formType,
  staleTime,
}: UseEntityDetailOptions<T>) {
  const enabled = formType !== FormTypes.Add && Boolean(id);

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => unwrapApiResult(await fetcher(id, signal)),
    enabled,
    staleTime,
  });
}
