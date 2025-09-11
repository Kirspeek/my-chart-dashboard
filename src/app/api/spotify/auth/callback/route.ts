import { NextRequest, NextResponse } from "next/server";
import { getSpotifyEnv, writeAuthCookies } from "@/lib/spotifyAuth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieState = req.cookies.get("sp_state")?.value || null;
  const codeVerifier = req.cookies.get("sp_code_verifier")?.value || null;

  if (
    !code ||
    !state ||
    !cookieState ||
    state !== cookieState ||
    !codeVerifier
  ) {
    return NextResponse.json({ error: "Invalid auth state" }, { status: 400 });
  }

  const { clientId, redirectUri } = getSpotifyEnv();
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Missing Spotify env" }, { status: 500 });
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ error: text }, { status: resp.status });
  }
  const json = (await resp.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
  };

  const expiresAt = Date.now() + (json.expires_in - 10) * 1000;

  const res = NextResponse.redirect(new URL("/music", req.url));
  const isProd = process.env.NODE_ENV === "production";
  // Write session cookies
  res.cookies.set("sp_access_token", json.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: Math.max(60, Math.floor((expiresAt - Date.now()) / 1000)),
  });
  if (json.refresh_token) {
    res.cookies.set("sp_refresh_token", json.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  res.cookies.set("sp_expires_at", String(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  // clear temp cookies
  res.cookies.set("sp_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("sp_code_verifier", "", { path: "/", maxAge: 0 });
  return res;
}
