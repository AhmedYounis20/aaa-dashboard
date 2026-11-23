import { useCallback, useEffect } from "react";
import { useForm, type DefaultValues, type FieldValues, type Path } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { AnyObjectSchema } from "yup";
import { FormTypes } from "@/interfaces/Components/FormType";
import type { EntityFormDetail, EntityFormMutations, UseEntityFormOptions } from "./useEntityForm";

export interface UseEntityFormRhfOptions<T extends FieldValues & { id: string }> extends Omit<
  UseEntityFormOptions<T>,
  "schema" | "defaultModel"
> {
  schema: AnyObjectSchema;
  defaultModel: T;
}

/**
 * Optional react-hook-form scaffolding path for new/refactored entity forms.
 * Keeps the same mutation/detail contract as `useEntityForm` without a big-bang migration.
 */
export function useEntityFormRhf<T extends FieldValues & { id: string }>({
  schema,
  defaultModel,
  formType,
  id,
  detail,
  mutations,
  mapDetail,
  mapDefault,
}: UseEntityFormRhfOptions<T>) {
  const form = useForm<T>({
    // yupResolver generics differ slightly from entity model shapes; cast is intentional.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: defaultModel as DefaultValues<T>,
    mode: "onSubmit",
  });

  const { reset, handleSubmit, formState, setError, clearErrors } = form;

  useEffect(() => {
    if (!detail.data) return;
    reset((mapDetail ? mapDetail(detail.data) : detail.data) as DefaultValues<T>);
  }, [detail.data, mapDetail, reset]);

  useEffect(() => {
    if (formType !== FormTypes.Add || !detail.defaultData) return;
    const next = mapDefault
      ? mapDefault(defaultModel, detail.defaultData as Partial<T>)
      : { ...defaultModel, ...detail.defaultData };
    reset(next as DefaultValues<T>);
  }, [detail.defaultData, formType, mapDefault, defaultModel, reset]);

  useEffect(() => {
    if (formType === FormTypes.Add) {
      reset(defaultModel as DefaultValues<T>);
      clearErrors();
    }
  }, [formType, defaultModel, reset, clearErrors]);

  const isLoading = formType !== FormTypes.Add && detail.isLoading;

  const handleAdd = useCallback(async () => {
    let ok = false;
    await handleSubmit(async (values) => {
      try {
        await mutations.createMutation.mutateAsync(values);
        ok = true;
      } catch {
        ok = false;
      }
    })();
    return ok;
  }, [handleSubmit, mutations.createMutation]);

  const handleUpdate = useCallback(async () => {
    let ok = false;
    await handleSubmit(async (values) => {
      try {
        await mutations.updateMutation.mutateAsync({
          id: values.id,
          data: values,
        });
        ok = true;
      } catch {
        ok = false;
      }
    })();
    return ok;
  }, [handleSubmit, mutations.updateMutation]);

  const handleDelete = useCallback(async () => {
    try {
      await mutations.deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  }, [mutations.deleteMutation, id]);

  const errors = Object.fromEntries(
    Object.entries(formState.errors).map(([key, err]) => [key, (err?.message as string) || ""])
  ) as Record<string, string>;

  const setFieldError = useCallback(
    (name: Path<T>, message: string) => {
      setError(name, { type: "manual", message });
    },
    [setError]
  );

  return {
    form,
    model: form.watch(),
    setModel: (updater: T | ((prev: T) => T)) => {
      const current = form.getValues();
      const next = typeof updater === "function" ? (updater as (prev: T) => T)(current) : updater;
      reset(next as DefaultValues<T>, { keepDirty: true });
    },
    errors,
    setErrors: (next: Record<string, string>) => {
      clearErrors();
      Object.entries(next).forEach(([key, message]) => {
        setError(key as Path<T>, { type: "manual", message });
      });
    },
    setFieldError,
    isLoading,
    handleAdd,
    handleUpdate,
    handleDelete,
    control: form.control,
    register: form.register,
    detail: detail as EntityFormDetail<T>,
    mutations: mutations as EntityFormMutations<T>,
  };
}
