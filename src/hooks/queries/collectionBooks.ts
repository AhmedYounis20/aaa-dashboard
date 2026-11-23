import {
  createCollectionBook,
  deleteCollectionBook,
  getCollectionBookById,
  getCollectionBooks,
  updateCollectionBook,
} from "@/Apis/Account/CollectionBooksApi";
import type { CollectionBookModel } from "@/interfaces/ProjectInterfaces";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { ApiResult } from "@/interfaces/ApiResponse";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

async function fetchCollectionBookById(
  id: string,
  signal?: AbortSignal
): Promise<ApiResult<CollectionBookModel>> {
  const result = await getCollectionBookById(id, signal);
  if (!result) {
    return {
      isSuccess: false,
      result: null as unknown as CollectionBookModel,
      errorMessages: [],
      statusCode: 0,
      successMessage: "",
    };
  }
  return result;
}

export function useCollectionBooksList() {
  return useEntityList<CollectionBookModel>({
    queryKey: queryKeys.collectionBooks.all,
    fetcher: getCollectionBooks,
  });
}

export function useCollectionBookDetail(id: string, formType: FormTypes) {
  return useEntityDetail<CollectionBookModel>({
    queryKey: queryKeys.collectionBooks.detail(id),
    fetcher: fetchCollectionBookById,
    id,
    formType,
  });
}

export function useCollectionBookMutations() {
  return useEntityMutations<CollectionBookModel>({
    listQueryKey: queryKeys.collectionBooks.all,
    detailQueryKey: queryKeys.collectionBooks.detail,
    createFn: createCollectionBook as (
      data: CollectionBookModel
    ) => Promise<ApiResult<CollectionBookModel>>,
    updateFn: updateCollectionBook as (
      id: string,
      data: CollectionBookModel
    ) => Promise<ApiResult<CollectionBookModel>>,
    deleteFn: deleteCollectionBook as (id: string) => Promise<ApiResult<CollectionBookModel>>,
  });
}
