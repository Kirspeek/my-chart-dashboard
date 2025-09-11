import { NextResponse } from "next/server";
import { fetchSpotifyToken } from "@/lib/spotify";
import { API_ENDPOINTS } from "@/apis/constants";

async function getToken(): Promise<string | null> {
  try {
    const token = await fetchSpotifyToken();
    return token.accessToken;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q)
    return NextResponse.json({
      tracks: [],
      albums: [],
      artists: [],
      playlists: [],
    });

  const token = await getToken();
  if (!token)
    return NextResponse.json(
      {
        error: "Failed to acquire Spotify token",
        tracks: [],
        albums: [],
        artists: [],
        playlists: [],
      },
      { status: 502 }
    );

  try {
    const res = await fetch(API_ENDPOINTS.SPOTIFY_EXTERNAL.search(q), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: text || `Spotify search error ${res.status}`,
          tracks: [],
          albums: [],
          artists: [],
          playlists: [],
        },
        { status: res.status }
      );
    }
    const data = (await res.json()) as {
      tracks?: {
        items?: {
          id: string;
          name: string;
          artists?: { id?: string; name: string }[];
          album?: { images?: { url: string }[] };
          preview_url?: string;
        }[];
      };
      albums?: {
        items?: {
          id: string;
          name: string;
          artists?: { name: string }[];
          images?: { url: string }[];
        }[];
      };
      artists?: {
        items?: { id: string; name: string; images?: { url: string }[] }[];
      };
      playlists?: {
        items?: {
          id: string;
          name: string;
          owner?: { display_name?: string };
          images?: { url: string }[];
        }[];
      };
    };

    const trackItems = Array.isArray(data.tracks?.items)
      ? (data.tracks?.items ?? []).filter((t) => t && typeof t.id === "string")
      : [];
    const tracks = trackItems.map((t) => ({
      id: t.id,
      title: t.name,
      artist: (t.artists || []).map((a) => a.name).join(", ") || "",
      cover: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || "",
      previewUrl: t.preview_url || undefined,
      artistId: t.artists?.[0]?.id || undefined,
    }));

    const albumItems = Array.isArray(data.albums?.items)
      ? (data.albums?.items ?? []).filter((a) => a && typeof a.id === "string")
      : [];
    const albums = albumItems.map((a) => ({
      id: a.id,
      title: a.name,
      artist: (a.artists || []).map((x) => x.name).join(", ") || "",
      cover: a.images?.[1]?.url || a.images?.[0]?.url || "",
    }));

    const artistItems = Array.isArray(data.artists?.items)
      ? (data.artists?.items ?? []).filter(
          (ar) => ar && typeof ar.id === "string"
        )
      : [];
    const artists = artistItems.map((ar) => ({
      id: ar.id,
      name: ar.name,
      cover: ar.images?.[1]?.url || ar.images?.[0]?.url || "",
    }));

    const playlistItems = Array.isArray(data.playlists?.items)
      ? (data.playlists?.items ?? []).filter(
          (p) => p && typeof p.id === "string"
        )
      : [];
    const playlists = playlistItems.map((p) => ({
      id: p.id,
      title: p.name,
      owner: p.owner?.display_name || "",
      cover: p.images?.[0]?.url || "",
    }));

    return NextResponse.json({ tracks, albums, artists, playlists });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Spotify search error";
    return NextResponse.json(
      { error: message, tracks: [], albums: [], artists: [], playlists: [] },
      { status: 500 }
    );
  }
}
