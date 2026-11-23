import { describe, expect, it } from "vitest";
import { ApiError, unwrapApiResult } from "./unwrapApiResult";
import { ApiResult } from "../../interfaces/ApiResponse";

describe("unwrapApiResult", () => {
  it("returns result when isSuccess is true", () => {
    const payload: ApiResult<{ id: string }> = {
      isSuccess: true,
      statusCode: 200,
      result: { id: "1" },
      successMessage: "ok",
      errorMessages: [],
    };

    expect(unwrapApiResult(payload)).toEqual({ id: "1" });
  });

  it("throws ApiError when result is null/undefined", () => {
    expect(() => unwrapApiResult(null)).toThrow(ApiError);
    expect(() => unwrapApiResult(undefined)).toThrow(/Empty API response/);
  });

  it("throws ApiError with messages and status when isSuccess is false", () => {
    const payload: ApiResult<unknown> = {
      isSuccess: false,
      statusCode: 400,
      result: null as unknown as unknown,
      successMessage: "",
      errorMessages: ["Name is required", "Code is required"],
    };

    try {
      unwrapApiResult(payload);
      expect.fail("expected throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      const apiError = error as ApiError;
      expect(apiError.message).toBe("Name is required, Code is required");
      expect(apiError.statusCode).toBe(400);
    }
  });

  it("uses default message when errorMessages is missing", () => {
    const payload: ApiResult<unknown> = {
      isSuccess: false,
      statusCode: 500,
      result: {} as unknown,
      successMessage: "",
    };

    expect(() => unwrapApiResult(payload)).toThrow(/Request failed/);
  });
});
