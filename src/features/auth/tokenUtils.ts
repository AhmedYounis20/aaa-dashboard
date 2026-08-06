import { jwtDecode } from "jwt-decode";
import { UserModel } from "../../interfaces/Auth/UserModel";

interface JwtPayload {
  exp?: number;
}

export function decodeUserFromToken(token: string): UserModel {
  return jwtDecode<UserModel>(token);
}

export function isTokenExpired(token: string, bufferSeconds = 30): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return false;
    return Date.now() >= (exp - bufferSeconds) * 1000;
  } catch {
    return true;
  }
}
