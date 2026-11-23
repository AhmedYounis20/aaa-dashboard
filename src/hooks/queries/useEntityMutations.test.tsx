import { describe, expect, it, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { useEntityMutations } from "./useEntityMutations";
import { ApiResult } from "@/interfaces/ApiResponse";
import { AllProviders, createTestQueryClient } from "@/test/testUtils";

vi.mock("../../Helper/toastify", () => ({
  toastify: vi.fn(),
}));

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
    statusCode: 400,
    result: {} as T,
    successMessage: "",
    errorMessages: ["boom"],
  };
}

describe("useEntityMutations", () => {
  it("create/update/delete unwrap results and invalidate list queries", async () => {
    const queryClient = createTestQueryClient();
    const listQueryKey = ["entities"] as const;
    const detailQueryKey = (id: string) => ["entities", id] as const;

    queryClient.setQueryData(listQueryKey, [{ id: "1", name: "Old" }]);
    queryClient.setQueryData(detailQueryKey("1"), { id: "1", name: "Old" });

    const createFn = vi.fn(async (data: Entity) => ok({ ...data, id: "2" }));
    const updateFn = vi.fn(async (id: string, data: Entity) => ok({ ...data, id }));
    const deleteFn = vi.fn(async (id: string) => ok({ id, name: "gone" }));

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const removeSpy = vi.spyOn(queryClient, "removeQueries");

    const { result } = renderHook(
      () =>
        useEntityMutations<Entity>({
          listQueryKey,
          detailQueryKey,
          createFn,
          updateFn,
          deleteFn,
        }),
      {
        wrapper: ({ children }) => (
          <AllProviders queryClient={queryClient}>{children}</AllProviders>
        ),
      }
    );

    await act(async () => {
      await result.current.createMutation.mutateAsync({
        id: "",
        name: "Created",
      });
    });
    expect(createFn).toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: listQueryKey });

    await act(async () => {
      await result.current.updateMutation.mutateAsync({
        id: "1",
        data: { id: "1", name: "Updated" },
      });
    });
    expect(updateFn).toHaveBeenCalledWith("1", { id: "1", name: "Updated" });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: detailQueryKey("1"),
    });

    await act(async () => {
      await result.current.deleteMutation.mutateAsync("1");
    });
    expect(deleteFn).toHaveBeenCalledWith("1");
    expect(removeSpy).toHaveBeenCalledWith({
      queryKey: detailQueryKey("1"),
    });
  });

  it("surfaces ApiError when createFn returns isSuccess false", async () => {
    const createFn = vi.fn(async () => fail<Entity>());
    const updateFn = vi.fn(async () => fail<Entity>());
    const deleteFn = vi.fn(async () => fail<Entity>());

    const { result } = renderHook(
      () =>
        useEntityMutations<Entity>({
          listQueryKey: ["entities"],
          createFn,
          updateFn,
          deleteFn,
        }),
      { wrapper: AllProviders }
    );

    await expect(result.current.createMutation.mutateAsync({ id: "", name: "x" })).rejects.toThrow(
      /boom/
    );

    await waitFor(() => {
      expect(result.current.createMutation.isError).toBe(true);
    });
  });

  it("toasts successMessage on create and error messages on failure", async () => {
    const { toastify } = await import("../../Helper/toastify");

    const createFn = vi.fn(async (data: Entity) => ok({ ...data, id: "2" }));
    const updateFn = vi.fn(async () => fail<Entity>());
    const deleteFn = vi.fn(async () => fail<Entity>());

    const { result } = renderHook(
      () =>
        useEntityMutations<Entity>({
          listQueryKey: ["entities"],
          createFn,
          updateFn,
          deleteFn,
        }),
      { wrapper: AllProviders }
    );

    await act(async () => {
      await result.current.createMutation.mutateAsync({
        id: "",
        name: "Created",
      });
    });
    expect(toastify).toHaveBeenCalledWith("ok", "success");

    await expect(
      result.current.updateMutation.mutateAsync({
        id: "1",
        data: { id: "1", name: "x" },
      })
    ).rejects.toThrow(/boom/);

    await waitFor(() => {
      expect(toastify).toHaveBeenCalledWith("boom", "error");
    });
  });
});
