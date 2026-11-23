import { useQuery } from "@tanstack/react-query";
import {
  createFixedAsset,
  deleteFixedAsset,
  getDefaultFixedAssetData,
  getFixedAssetById,
  getFixedAssets,
  updateFixedAsset,
} from "@/Apis/Account/FixedAssetsApi";
import FixedAssetModel from "@/interfaces/ProjectInterfaces/Account/SubLedgers/FixedAssets/FixedAssetModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { unwrapApiResult } from "@/lib/unwrapApiResult";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useFixedAssetsList() {
  return useEntityList<FixedAssetModel>({
    queryKey: queryKeys.fixedAssets.all,
    fetcher: getFixedAssets,
  });
}

export function useFixedAssetDetail(
  id: string,
  formType: FormTypes,
  parentId: string | null,
  fixedAssetType = 0
) {
  const isEdit = formType !== FormTypes.Add && Boolean(id);
  const isAdd = formType === FormTypes.Add;

  const detailQuery = useQuery({
    queryKey: queryKeys.fixedAssets.detail(id),
    queryFn: async () => {
      const entity = unwrapApiResult(await getFixedAssetById(id));
      return {
        ...entity,
        code: entity.chartOfAccount?.code ?? entity.code,
      };
    },
    enabled: isEdit,
  });

  const defaultQuery = useQuery({
    queryKey: queryKeys.fixedAssets.default(parentId, fixedAssetType),
    queryFn: async () => {
      const result = await getDefaultFixedAssetData(parentId, fixedAssetType);
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

export function useFixedAssetMutations() {
  return useEntityMutations<FixedAssetModel>({
    listQueryKey: queryKeys.fixedAssets.all,
    detailQueryKey: queryKeys.fixedAssets.detail,
    createFn: createFixedAsset,
    updateFn: updateFixedAsset,
    deleteFn: deleteFixedAsset,
  });
}
