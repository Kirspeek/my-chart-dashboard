import { NextRequest, NextResponse } from "next/server";
import { getSpotifyEnv } from "@/lib/spotifyAuth";

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("sp_refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }
  const { clientId } = getSpotifyEnv();
  if (!clientId) {
    return NextResponse.json({ error: "Missing Spotify env" }, { status: 500 });
  }
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
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
  };
  const expiresAt = Date.now() + (json.expires_in - 10) * 1000;
  const res = NextResponse.json({
    access_token: json.access_token,
    expires_at: expiresAt,
  });
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set("sp_access_token", json.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: Math.max(60, Math.floor((expiresAt - Date.now()) / 1000)),
  });
  res.cookies.set("sp_expires_at", String(expiresAt), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
