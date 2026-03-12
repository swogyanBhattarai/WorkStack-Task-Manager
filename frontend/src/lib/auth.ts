import type { JwtPayload } from "@/types";

const TOKEN_KEY = "token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = decodePayload(token);
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getUser(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;

  try {
    return decodePayload(token);
  } catch {
    return null;
  }
}

function decodePayload(token: string): JwtPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(json) as JwtPayload;
}
