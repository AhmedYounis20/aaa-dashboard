import { describe, it, expect } from "vitest";
import { mapServerFetchResult } from "./serverFetch";
import type { FetchDataResult } from "./types";

describe("mapServerFetchResult", () => {
  it("marks error when isSuccess is false", () => {
    const state = mapServerFetchResult({
      isSuccess: false,
      result: null,
    } as unknown as FetchDataResult);
    expect(state.error).toBe(true);
    expect(state.items).toEqual([]);
    expect(state.totalCount).toBe(0);
  });

  it("marks error when result is null/undefined", () => {
    expect(mapServerFetchResult(null).error).toBe(true);
    expect(mapServerFetchResult(undefined).error).toBe(true);
  });

  it("maps successful page payload", () => {
    const state = mapServerFetchResult({
      isSuccess: true,
      statusCode: 200,
      successMessage: "",
      result: {
        items: [{ id: "1" }],
        totalCount: 1,
        totalPages: 1,
        pageNumber: 1,
        pageSize: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
    expect(state.error).toBe(false);
    expect(state.items).toEqual([{ id: "1" }]);
    expect(state.totalCount).toBe(1);
  });
});
