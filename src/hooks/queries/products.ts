import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "@/Apis/Inventory/ProductsApi";
import ProductModel from "@/interfaces/ProjectInterfaces/Inventory/Products/ProductModel";
import ProductInputModel from "@/interfaces/ProjectInterfaces/Inventory/Products/ProductInputModel";
import { FormTypes } from "@/interfaces/Components/FormType";
import { queryKeys } from "@/lib/queryKeys";
import { useEntityDetail } from "./useEntityDetail";
import { useEntityList } from "./useEntityList";
import { useEntityMutations } from "./useEntityMutations";

export function useProductsList() {
  return useEntityList<ProductModel>({
    queryKey: queryKeys.products.all,
    fetcher: getProducts,
  });
}

export function useProductDetail(id: string, formType: FormTypes) {
  return useEntityDetail<ProductModel>({
    queryKey: queryKeys.products.detail(id),
    fetcher: getProductById,
    id,
    formType,
  });
}

export function useProductMutations() {
  return useEntityMutations<ProductModel, ProductInputModel>({
    listQueryKey: queryKeys.products.all,
    detailQueryKey: queryKeys.products.detail,
    createFn: createProduct,
    updateFn: updateProduct,
    deleteFn: deleteProduct,
  });
}
