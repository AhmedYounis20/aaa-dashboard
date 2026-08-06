import { useQuery } from "@tanstack/react-query";
import { FormTypes } from "../../interfaces/Components/FormType";
import { ApiResult } from "../../interfaces/ApiResponse";
import { unwrapApiResult } from "../../lib/unwrapApiResult";

interface UseEntityDetailOptions<T> {
  queryKey: readonly unknown[];
  fetcher: (id: string) => Promise<ApiResult<T>>;
  id: string;
  formType: FormTypes;
}

export function useEntityDetail<T>({
  queryKey,
  fetcher,
  id,
  formType,
}: UseEntityDetailOptions<T>) {
  const enabled = formType !== FormTypes.Add && Boolean(id);

  return useQuery({
    queryKey,
    queryFn: async () => unwrapApiResult(await fetcher(id)),
    enabled,
  });
}
