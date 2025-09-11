import { NextResponse } from "next/server";
import {
  createCodeChallenge,
  getSpotifyEnv,
  randomString,
  SPOTIFY_SCOPES,
} from "@/lib/spotifyAuth";

export async function GET() {
  const { clientId, redirectUri } = getSpotifyEnv();
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Missing Spotify env" }, { status: 500 });
  }

  const state = randomString(16);
  const codeVerifier = randomString(64);
  const codeChallenge = await createCodeChallenge(codeVerifier);

  const res = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${encodeURIComponent(
      clientId
    )}&scope=${encodeURIComponent(SPOTIFY_SCOPES)}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${encodeURIComponent(state)}&code_challenge_method=S256&code_challenge=${encodeURIComponent(
      codeChallenge
    )}`
  );
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set("sp_state", state, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
    sameSite: "lax",
    secure: isProd,
  });
  res.cookies.set("sp_code_verifier", codeVerifier, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
    sameSite: "lax",
    secure: isProd,
  });
  return res;
}
