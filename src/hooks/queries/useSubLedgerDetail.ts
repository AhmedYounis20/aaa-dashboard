import { useQuery } from "@tanstack/react-query";
import { FormTypes } from "@/interfaces/Components/FormType";
import { ApiResult } from "@/interfaces/ApiResponse";
import { unwrapApiResult } from "@/lib/unwrapApiResult";

interface EntityWithCode {
  code?: string;
  chartOfAccount?: { code?: string } | null;
}

interface UseSubLedgerDetailOptions<T extends EntityWithCode> {
  detailQueryKey: readonly unknown[];
  defaultQueryKey: readonly unknown[];
  getById: (id: string, signal?: AbortSignal) => Promise<ApiResult<T>>;
  getDefault: (parentId: string | null, signal?: AbortSignal) => Promise<ApiResult<T> | null>;
  id: string;
  formType: FormTypes;
  parentId: string | null;
}

/**
 * Detail + next-default queries for tree sub-ledgers (Banks/Taxes pattern).
 * Exposes Query error fields so Edit/Delete forms can show ErrorState and block submit.
 */
export function useSubLedgerDetail<T extends EntityWithCode>({
  detailQueryKey,
  defaultQueryKey,
  getById,
  getDefault,
  id,
  formType,
  parentId,
}: UseSubLedgerDetailOptions<T>) {
  const isEdit = formType !== FormTypes.Add && Boolean(id);
  const isAdd = formType === FormTypes.Add;

  const detailQuery = useQuery({
    queryKey: detailQueryKey,
    queryFn: async ({ signal }) => {
      const entity = unwrapApiResult(await getById(id, signal));
      return {
        ...entity,
        code: entity.chartOfAccount?.code ?? entity.code,
      };
    },
    enabled: isEdit,
  });

  const defaultQuery = useQuery({
    queryKey: defaultQueryKey,
    queryFn: async ({ signal }) => {
      const result = await getDefault(parentId, signal);
      return result?.result ?? null;
    },
    enabled: isAdd,
  });

  return {
    data: detailQuery.data,
    defaultData: defaultQuery.data,
    isLoading: detailQuery.isLoading || defaultQuery.isLoading,
    isError: detailQuery.isError,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
  };
}
