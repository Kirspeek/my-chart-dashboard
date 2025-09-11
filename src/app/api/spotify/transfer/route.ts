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

export async function POST(req: NextRequest) {
  const token = await readAccessToken(req);
  if (!token)
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  const { deviceId, play } = (await req.json().catch(() => ({}))) as {
    deviceId?: string;
    play?: boolean;
  };
  if (!deviceId)
    return NextResponse.json({ error: "Missing deviceId" }, { status: 400 });

  const resp = await fetch(
    API_ENDPOINTS.SPOTIFY_EXTERNAL.me.player.transfer(),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ device_ids: [deviceId], play: Boolean(play) }),
    }
  );
  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ error: text }, { status: resp.status });
  }
  return NextResponse.json({ ok: true });
}
