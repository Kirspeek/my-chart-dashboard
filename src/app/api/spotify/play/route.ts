import { NextRequest, NextResponse } from "next/server";

async function readAccessToken(req: NextRequest): Promise<string | null> {
  const t = req.cookies.get("sp_access_token")?.value || null;
  const expStr = req.cookies.get("sp_expires_at")?.value || "0";
  const exp = parseInt(expStr, 10) || 0;
  if (!t || Date.now() > exp - 5000) {
    // refresh
    const r = await fetch(new URL("/api/spotify/auth/refresh", req.url));
    if (!r.ok) return null;
    const j = await r.json();
    return j.access_token || null;
  }
  return t;
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId");
  if (!deviceId)
    return NextResponse.json({ error: "Missing deviceId" }, { status: 400 });

  const token = await readAccessToken(req);
  if (!token)
    return NextResponse.json({ error: "No access token" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const uris: string[] = Array.isArray(body?.uris) ? body.uris : [];
  if (!uris.length)
    return NextResponse.json({ error: "Missing uris" }, { status: 400 });

  const resp = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(deviceId)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    }
  );
  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ error: text }, { status: resp.status });
  }
  return NextResponse.json({ ok: true });
}
