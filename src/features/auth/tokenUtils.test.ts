import { describe, expect, it } from "vitest";
import { decodeUserFromToken, isTokenExpired } from "./tokenUtils";

function makeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.sig`;
}

describe("tokenUtils", () => {
  describe("decodeUserFromToken", () => {
    it("maps common claim names to UserModel", () => {
      const token = makeJwt({
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "user-1",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "Ada",
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
      });

      expect(decodeUserFromToken(token)).toEqual({
        id: "user-1",
        fullName: "Ada",
        email: "Ada",
        role: "Admin",
      });
    });

    it("falls back to sub / unique_name / role", () => {
      const token = makeJwt({
        sub: "sub-9",
        unique_name: "bob@example.com",
        role: "User",
      });

      expect(decodeUserFromToken(token)).toEqual({
        id: "sub-9",
        fullName: "bob@example.com",
        email: "bob@example.com",
        role: "User",
      });
    });
  });

  describe("isTokenExpired", () => {
    it("returns false when exp is in the future beyond buffer", () => {
      const token = makeJwt({ exp: Math.floor(Date.now() / 1000) + 3600 });
      expect(isTokenExpired(token, 30)).toBe(false);
    });

    it("returns true when exp is within the buffer window", () => {
      const token = makeJwt({ exp: Math.floor(Date.now() / 1000) + 10 });
      expect(isTokenExpired(token, 30)).toBe(true);
    });

    it("returns true for invalid tokens", () => {
      expect(isTokenExpired("not-a-jwt")).toBe(true);
    });

    it("returns true when exp claim is missing", () => {
      const token = makeJwt({ sub: "x" });
      expect(isTokenExpired(token)).toBe(true);
    });
  });
});
