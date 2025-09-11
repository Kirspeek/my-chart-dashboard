import { NextRequest, NextResponse } from "next/server";
import { fetchSpotifyToken } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing album id" }, { status: 400 });
  }
  try {
    const token = await fetchSpotifyToken();
    const resp = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
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
      images?: { url: string }[];
      artists?: { name: string }[];
      tracks?: {
        items?: {
          id: string;
          name: string;
          artists?: { name: string }[];
          preview_url?: string;
        }[];
      };
    };
    const tracks = (json.tracks?.items ?? []).map((t) => ({
      id: t.id,
      title: t.name,
      artist: (t.artists ?? []).map((a) => a.name).join(", ") ?? "",
      cover: json.images?.[0]?.url ?? "",
      previewUrl: t.preview_url ?? undefined,
    }));
    return NextResponse.json({
      album: {
        id: json.id,
        name: json.name,
        artist: json.artists?.[0]?.name ?? "",
      },
      tracks,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Album error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
