import { describe, expect, it, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { useEntityDetail } from "./useEntityDetail";
import { FormTypes } from "@/interfaces/Components/FormType";
import { ApiResult } from "@/interfaces/ApiResponse";
import { AllProviders, createTestQueryClient } from "@/test/testUtils";

type Entity = { id: string; name: string };

function ok<T>(result: T): ApiResult<T> {
  return {
    isSuccess: true,
    statusCode: 200,
    result,
    successMessage: "ok",
    errorMessages: [],
  };
}

function fail<T>(): ApiResult<T> {
  return {
    isSuccess: false,
    statusCode: 500,
    result: {} as T,
    successMessage: "",
    errorMessages: ["load failed"],
  };
}

describe("useEntityDetail", () => {
  it("exposes isError / error / refetch when get-by-id fails", async () => {
    const queryClient = createTestQueryClient();
    const fetcher = vi.fn(async () => fail<Entity>());

    const { result } = renderHook(
      () =>
        useEntityDetail<Entity>({
          queryKey: ["entities", "1"],
          fetcher,
          id: "1",
          formType: FormTypes.Edit,
        }),
      {
        wrapper: ({ children }) => (
          <AllProviders queryClient={queryClient}>{children}</AllProviders>
        ),
      }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
    expect(typeof result.current.refetch).toBe("function");
  });

  it("loads entity data on success", async () => {
    const queryClient = createTestQueryClient();
    const entity = { id: "1", name: "Unit" };
    const fetcher = vi.fn(async () => ok(entity));

    const { result } = renderHook(
      () =>
        useEntityDetail<Entity>({
          queryKey: ["entities", "1"],
          fetcher,
          id: "1",
          formType: FormTypes.Edit,
        }),
      {
        wrapper: ({ children }) => (
          <AllProviders queryClient={queryClient}>{children}</AllProviders>
        ),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(entity);
    expect(result.current.isError).toBe(false);
  });

  it("does not fetch in Add mode", async () => {
    const fetcher = vi.fn(async () => ok({ id: "1", name: "x" }));
    const queryClient = createTestQueryClient();

    const { result } = renderHook(
      () =>
        useEntityDetail<Entity>({
          queryKey: ["entities", ""],
          fetcher,
          id: "",
          formType: FormTypes.Add,
        }),
      {
        wrapper: ({ children }) => (
          <AllProviders queryClient={queryClient}>{children}</AllProviders>
        ),
      }
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(fetcher).not.toHaveBeenCalled();
  });
});
