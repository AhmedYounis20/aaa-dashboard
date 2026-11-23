import { useCallback, useEffect, useState } from "react";
import type { AnyObjectSchema } from "yup";
import { FormTypes } from "@/interfaces/Components/FormType";
import { handleValidationErrors } from "@/Helper/validationHelper";
import type { UseMutationResult } from "@tanstack/react-query";

export interface EntityFormDetail<T> {
  data?: T;
  defaultData?: Partial<T> | null;
  isLoading: boolean;
  isError?: boolean;
  refetch?: () => unknown;
}

export interface EntityFormMutations<T> {
  createMutation: UseMutationResult<unknown, unknown, T, unknown>;
  updateMutation: UseMutationResult<unknown, unknown, { id: string; data: T }, unknown>;
  deleteMutation: UseMutationResult<unknown, unknown, string, unknown>;
}

export interface UseEntityFormOptions<T extends { id: string }> {
  schema: AnyObjectSchema;
  defaultModel: T;
  formType: FormTypes;
  id: string;
  detail: EntityFormDetail<T>;
  mutations: EntityFormMutations<T>;
  /** Merge detail payload into form model (e.g. chartOfAccount.code → code). */
  mapDetail?: (data: T) => T;
  /** Apply default/next-code payload when adding. */
  mapDefault?: (prev: T, defaults: Partial<T>) => T;
}

/**
 * Form state + yup validation + mutation handlers for entity CRUD forms.
 * Follows PackingUnitsForm / BanksForm patterns.
 */
export function useEntityForm<T extends { id: string }>({
  schema,
  defaultModel,
  formType,
  id,
  detail,
  mutations,
  mapDetail,
  mapDefault,
}: UseEntityFormOptions<T>) {
  const [model, setModel] = useState<T>(defaultModel);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!detail.data) return;
    setModel(mapDetail ? mapDetail(detail.data) : detail.data);
  }, [detail.data, mapDetail]);

  useEffect(() => {
    if (formType !== FormTypes.Add || !detail.defaultData) return;
    setModel((prev) =>
      mapDefault
        ? mapDefault(prev, detail.defaultData as Partial<T>)
        : { ...prev, ...detail.defaultData }
    );
  }, [detail.defaultData, formType, mapDefault]);

  useEffect(() => {
    if (formType === FormTypes.Add) {
      setModel(defaultModel);
      setErrors({});
    }
  }, [formType, defaultModel]);

  const isLoading = formType !== FormTypes.Add && detail.isLoading;
  const isDetailError = formType !== FormTypes.Add && Boolean(detail.isError);

  const validate = useCallback(async () => {
    try {
      await schema.validate(model, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      setErrors(handleValidationErrors(validationErrors));
      return false;
    }
  }, [schema, model]);

  const handleAdd = useCallback(async () => {
    if (!(await validate())) return false;
    try {
      await mutations.createMutation.mutateAsync(model);
      return true;
    } catch {
      return false;
    }
  }, [validate, mutations.createMutation, model]);

  const handleUpdate = useCallback(async () => {
    if (isDetailError) return false;
    if (!(await validate())) return false;
    try {
      await mutations.updateMutation.mutateAsync({ id: model.id, data: model });
      return true;
    } catch {
      return false;
    }
  }, [isDetailError, validate, mutations.updateMutation, model]);

  const handleDelete = useCallback(async () => {
    if (isDetailError) return false;
    try {
      await mutations.deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  }, [isDetailError, mutations.deleteMutation, id]);

  return {
    model,
    setModel,
    errors,
    setErrors,
    isLoading,
    isDetailError,
    refetchDetail: detail.refetch,
    validate,
    handleAdd,
    handleUpdate,
    handleDelete,
  };
}
