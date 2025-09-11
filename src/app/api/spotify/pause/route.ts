import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/apis/constants";

async function readAccessToken(req: NextRequest): Promise<string | null> {
  const t = req.cookies.get("sp_access_token")?.value || null;
  const expStr = req.cookies.get("sp_expires_at")?.value || "0";
  const exp = parseInt(expStr, 10) || 0;
  if (!t || Date.now() > exp - 5000) {
    const r = await fetch(new URL(API_ENDPOINTS.SPOTIFY.AUTH.REFRESH, req.url));
    if (!r.ok) return null;
    const j = await r.json();
    return j.access_token || null;
  }
  return t;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId");
  const token = await readAccessToken(req);
  if (!token)
    return NextResponse.json({ error: "No access token" }, { status: 401 });

  const resp = await fetch(
    API_ENDPOINTS.SPOTIFY_EXTERNAL.me.player.pause(deviceId || undefined),
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ error: text }, { status: resp.status });
  }
  return NextResponse.json({ ok: true });
}
