import type { SpotifyNamespace } from "@/interfaces/spotify";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: SpotifyNamespace;
  }
}

export {};
