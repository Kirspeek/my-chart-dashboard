import { NextRequest, NextResponse } from "next/server";
import { fetchSpotifyToken } from "@/lib/spotify";
import { API_ENDPOINTS } from "@/apis/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing artist id" }, { status: 400 });
  }
  try {
    const token = await fetchSpotifyToken();
    const resp = await fetch(
      API_ENDPOINTS.SPOTIFY_EXTERNAL.artists.topTracks(id, "US"),
      {
        headers: { Authorization: `Bearer ${token.accessToken}` },
        cache: "no-store",
      }
    );
    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: text }, { status: resp.status });
    }
    const json = (await resp.json()) as {
      tracks?: {
        id: string;
        name: string;
        artists?: { name: string }[];
        album?: { images?: { url: string }[] };
        preview_url?: string;
      }[];
    };
    const tracks = (json.tracks ?? []).map((t) => ({
      id: t.id,
      title: t.name,
      artist: (t.artists ?? []).map((a) => a.name).join(", ") ?? "",
      cover: t.album?.images?.[0]?.url ?? "",
      previewUrl: t.preview_url ?? undefined,
    }));
    return NextResponse.json({ tracks });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Artist error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
