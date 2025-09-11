import { cookies } from "next/headers";

export const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-library-modify",
].join(" ");

export function getSpotifyEnv() {
  const clientId = process.env.SPOTIFY_CLIENT_ID || "";
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "";
  return { clientId, clientSecret, redirectUri };
}

export function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return Buffer.from(binary, "binary")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function createCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

export function randomString(len = 64) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let res = "";
  const array = new Uint32Array(len);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) res += charset[array[i] % charset.length];
    return res;
  }
  for (let i = 0; i < len; i++) {
    res += charset[Math.floor(Math.random() * charset.length)];
  }
  return res;
}

export function readAuthCookies() {
  const store = cookies();
  const accessToken = store.get("sp_access_token")?.value || null;
  const refreshToken = store.get("sp_refresh_token")?.value || null;
  const expiresAtStr = store.get("sp_expires_at")?.value || null;
  const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : 0;
  return { accessToken, refreshToken, expiresAt };
}

export function writeAuthCookies({
  accessToken,
  refreshToken,
  expiresAt,
}: {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt: number;
}) {
  const store = cookies();
  const isProd = process.env.NODE_ENV === "production";
  store.set("sp_access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: Math.max(60, Math.floor((expiresAt - Date.now()) / 1000)),
  });
  if (refreshToken) {
    store.set("sp_refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  store.set("sp_expires_at", String(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
