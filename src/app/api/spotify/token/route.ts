import { NextResponse } from "next/server";
import { fetchSpotifyToken } from "@/lib/spotify";

export async function GET() {
  try {
    const token = await fetchSpotifyToken();
    return NextResponse.json({
      access_token: token.accessToken,
      expires_at: token.expiresAt,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Token error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
