import { NextRequest, NextResponse } from "next/server";
import { fetchSpotifyToken } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing track id" }, { status: 400 });
  }
  try {
    const token = await fetchSpotifyToken();
    const resp = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token.accessToken}` },
      cache: "no-store",
    });
    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: text }, { status: resp.status });
    }
    const json = (await resp.json()) as {
      id: string;
      name: string;
      artists?: { id?: string; name: string }[];
      album?: { images?: { url: string }[] };
      preview_url?: string;
    };
    const track = {
      id: json.id,
      title: json.name,
      artist: (json.artists || []).map((a) => a.name).join(", ") || "",
      cover: json.album?.images?.[0]?.url || "",
      previewUrl: json.preview_url || undefined,
      artistId: json.artists?.[0]?.id || undefined,
    };
    return NextResponse.json({ track });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Track error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
