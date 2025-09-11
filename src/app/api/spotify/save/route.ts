import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { trackId } = (await req.json().catch(() => ({}))) as {
    trackId?: string;
  };
  if (!trackId) {
    return NextResponse.json({ error: "Missing trackId" }, { status: 400 });
  }

  const accessToken = req.cookies.get("sp_access_token")?.value || null;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resp = await fetch(
    `https://api.spotify.com/v1/me/tracks?ids=${encodeURIComponent(trackId)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (resp.status === 401) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ error: text }, { status: resp.status });
  }
  return NextResponse.json({ ok: true });
}


