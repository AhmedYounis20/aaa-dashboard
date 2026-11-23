import { describe, expect, it, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { useSubLedgerDetail } from "./useSubLedgerDetail";
import { FormTypes } from "@/interfaces/Components/FormType";
import { ApiResult } from "@/interfaces/ApiResponse";
import { AllProviders, createTestQueryClient } from "@/test/testUtils";

type Entity = {
  id: string;
  name: string;
  code?: string;
  chartOfAccount?: { code?: string } | null;
};

function fail<T>(): ApiResult<T> {
  return {
    isSuccess: false,
    statusCode: 500,
    result: {} as T,
    successMessage: "",
    errorMessages: ["detail failed"],
  };
}

function ok<T>(result: T): ApiResult<T> {
  return {
    isSuccess: true,
    statusCode: 200,
    result,
    successMessage: "ok",
    errorMessages: [],
  };
}

describe("useSubLedgerDetail", () => {
  it("exposes isError / error / refetch when detail getById fails", async () => {
    const queryClient = createTestQueryClient();
    const getById = vi.fn(async () => fail<Entity>());
    const getDefault = vi.fn(async () => ok({ id: "", name: "", code: "01" }));

    const { result } = renderHook(
      () =>
        useSubLedgerDetail<Entity>({
          detailQueryKey: ["banks", "1"],
          defaultQueryKey: ["banks", "default", null],
          getById,
          getDefault,
          id: "1",
          formType: FormTypes.Edit,
          parentId: null,
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
    expect(getDefault).not.toHaveBeenCalled();
  });

  it("maps chartOfAccount.code onto code on success", async () => {
    const queryClient = createTestQueryClient();
    const getById = vi.fn(async () =>
      ok({
        id: "1",
        name: "Bank",
        code: "legacy",
        chartOfAccount: { code: "1001" },
      })
    );
    const getDefault = vi.fn(async () => null);

    const { result } = renderHook(
      () =>
        useSubLedgerDetail<Entity>({
          detailQueryKey: ["banks", "1"],
          defaultQueryKey: ["banks", "default", null],
          getById,
          getDefault,
          id: "1",
          formType: FormTypes.Delete,
          parentId: null,
        }),
      {
        wrapper: ({ children }) => (
          <AllProviders queryClient={queryClient}>{children}</AllProviders>
        ),
      }
    );

    await waitFor(() => expect(result.current.data?.code).toBe("1001"));
    expect(result.current.isError).toBe(false);
  });
});
