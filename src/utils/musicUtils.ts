import type { SearchItem } from "@/interfaces/music";

type MusicSearchApiResponse = {
  tracks?: Array<{
    id: string;
    title: string;
    artist: string;
    cover: string;
    artistId?: string;
  }>;
  albums?: Array<{
    id: string;
    title: string;
    artist: string;
    cover: string;
  }>;
  artists?: Array<{
    id: string;
    name: string;
    cover: string;
  }>;
  playlists?: Array<{
    id: string;
    title: string;
    owner: string;
    cover: string;
  }>;
};

export function getTrackIdFromEmbedUrl(embedUrl: string): string | null {
  try {
    const match = embedUrl.match(/embed\/track\/([^\/?#]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function computeEmbedHeight(
  embedUrl: string,
  isSearchMode: boolean
): number {
  try {
    if (isSearchMode) return 140;
    if (embedUrl.includes("/track/")) return 280;
    return 430;
  } catch {
    return isSearchMode ? 140 : 280;
  }
}

export function mapSearchApiResponse(json: MusicSearchApiResponse): {
  tracks: SearchItem[];
  albums: SearchItem[];
  artists: SearchItem[];
  playlists: SearchItem[];
} {
  const tracks = Array.isArray(json?.tracks)
    ? json.tracks.map(
        (t: {
          id: string;
          title: string;
          artist: string;
          cover: string;
          artistId?: string;
        }): SearchItem => ({
          id: t.id,
          title: t.title,
          subtitle: t.artist,
          cover: t.cover,
          kind: "tracks",
          artistId: t.artistId,
        })
      )
    : [];

  const albums = Array.isArray(json?.albums)
    ? json.albums.map(
        (a: {
          id: string;
          title: string;
          artist: string;
          cover: string;
        }): SearchItem => ({
          id: a.id,
          title: a.title,
          subtitle: a.artist,
          cover: a.cover,
          kind: "albums",
        })
      )
    : [];

  const artists = Array.isArray(json?.artists)
    ? json.artists.map(
        (ar: { id: string; name: string; cover: string }): SearchItem => ({
          id: ar.id,
          title: ar.name,
          subtitle: "Artist",
          cover: ar.cover,
          kind: "artists",
        })
      )
    : [];

  const playlists = Array.isArray(json?.playlists)
    ? json.playlists.map(
        (p: {
          id: string;
          title: string;
          owner: string;
          cover: string;
        }): SearchItem => ({
          id: p.id,
          title: p.title,
          subtitle: p.owner,
          cover: p.cover,
          kind: "playlists",
        })
      )
    : [];

  return { tracks, albums, artists, playlists };
}
