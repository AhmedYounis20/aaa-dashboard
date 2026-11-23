import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { authStorage } from "../../features/auth/authStorage";
import * as authEvents from "../../features/auth/authEvents";

const API = "https://api.test/api/";

const server = setupServer();

vi.mock("./logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  authStorage.clear();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

describe("apiClient 401 refresh", () => {
  beforeEach(() => {
    authStorage.setTokens("old-access", "refresh-token");
  });

  it("refreshes tokens and retries the original request on 401", async () => {
    let protectedHits = 0;

    server.use(
      http.get(`${API}protected`, () => {
        protectedHits += 1;
        if (protectedHits === 1) {
          return HttpResponse.json({ message: "unauthorized" }, { status: 401 });
        }
        return HttpResponse.json({
          isSuccess: true,
          statusCode: 200,
          result: { ok: true },
          successMessage: "",
          errorMessages: [],
        });
      }),
      http.post(`${API}auth/refresh`, async ({ request }) => {
        const body = (await request.json()) as {
          refreshToken: string;
          accessToken: string;
        };
        expect(body).toEqual({
          refreshToken: "refresh-token",
          accessToken: "old-access",
        });
        return HttpResponse.json({
          result: {
            accessToken: "new-access",
            refreshToken: "new-refresh",
          },
        });
      })
    );

    const { httpGet } = await import("./apiClient");
    const result = await httpGet<{ ok: boolean }>("protected");

    expect(protectedHits).toBe(2);
    expect(result.isSuccess).toBe(true);
    expect(result.result).toEqual({ ok: true });
    expect(authStorage.getAccessToken()).toBe("new-access");
    expect(authStorage.getRefreshToken()).toBe("new-refresh");
  });

  it("clears session and triggers unauthorized when refresh fails", async () => {
    const triggerSpy = vi.spyOn(authEvents, "triggerUnauthorized");

    server.use(
      http.get(`${API}protected`, () =>
        HttpResponse.json(
          {
            isSuccess: false,
            statusCode: 401,
            result: {},
            successMessage: "",
            errorMessages: ["unauthorized"],
          },
          { status: 401 }
        )
      ),
      http.post(`${API}auth/refresh`, () =>
        HttpResponse.json({ message: "invalid refresh" }, { status: 401 })
      )
    );

    const { httpGet } = await import("./apiClient");
    const result = await httpGet("protected");

    expect(result.isSuccess).toBe(false);
    expect(result.errorMessages).toContain("unauthorized");
    expect(authStorage.getAccessToken()).toBeNull();
    expect(authStorage.getRefreshToken()).toBeNull();
    expect(triggerSpy).toHaveBeenCalled();
  });

  it("sends en-US Accept-Language for en and en-* i18n locales", async () => {
    const captured: string[] = [];

    server.use(
      http.get(`${API}lang-check`, ({ request }) => {
        captured.push(request.headers.get("Accept-Language") || "");
        return HttpResponse.json({
          isSuccess: true,
          statusCode: 200,
          result: { ok: true },
          successMessage: "",
          errorMessages: [],
        });
      })
    );

    const { httpGet } = await import("./apiClient");

    localStorage.setItem("i18nextLng", "en-US");
    await httpGet("lang-check");
    localStorage.setItem("i18nextLng", "en");
    await httpGet("lang-check");
    localStorage.setItem("i18nextLng", "ar");
    await httpGet("lang-check");
    localStorage.setItem("i18nextLng", "ar-EG");
    await httpGet("lang-check");

    expect(captured).toEqual(["en-US", "en-US", "ar-EG", "ar-EG"]);
  });

  it("forwards AbortSignal and returns aborted result when canceled", async () => {
    server.use(
      http.get(`${API}slow`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return HttpResponse.json({
          isSuccess: true,
          statusCode: 200,
          result: { ok: true },
          successMessage: "",
          errorMessages: [],
        });
      })
    );

    const { httpGet } = await import("./apiClient");
    const controller = new AbortController();
    const pending = httpGet("slow", {}, { signal: controller.signal });
    controller.abort();

    const result = await pending;
    expect(result.isSuccess).toBe(false);
    expect(result.errorMessages?.[0]).toMatch(/abort/i);
  });
});
