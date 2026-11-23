import { jwtDecode } from "jwt-decode";
import { UserModel } from "../../interfaces/Auth/UserModel";

interface JwtPayload {
  exp?: number;
  [claim: string]: unknown;
}

const NAME_IDENTIFIER = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

function claimString(payload: JwtPayload, ...keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
  }
  return "";
}

export function decodeUserFromToken(token: string): UserModel {
  const payload = jwtDecode<JwtPayload>(token);
  const name = claimString(payload, NAME_CLAIM, "unique_name", "name", "email");
  const id = claimString(payload, NAME_IDENTIFIER, "sub", "id");
  const role = claimString(payload, ROLE_CLAIM, "role");

  return {
    id,
    fullName: name,
    email: name,
    role,
  };
}

export function isTokenExpired(token: string, bufferSeconds = 30): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    // Missing exp is invalid/expired — never treat as a valid session.
    if (exp == null || typeof exp !== "number") return true;
    return Date.now() >= (exp - bufferSeconds) * 1000;
  } catch {
    return true;
  }
}
