// Minimal Spotify Web Playback SDK types

export type SpotifyGetOAuthTokenCallback = (token: string) => void;

export interface SpotifyPlayerInit {
  name: string;
  getOAuthToken: (cb: SpotifyGetOAuthTokenCallback) => void;
  volume?: number;
}

export type SpotifyReadyEvent = { device_id: string };
export type SpotifyErrorEvent = { message: string };

export interface SpotifyPlayer {
  addListener(event: "ready", cb: (event: SpotifyReadyEvent) => void): boolean;
  addListener(
    event:
      | "not_ready"
      | "initialization_error"
      | "authentication_error"
      | "account_error",
    cb: (event: SpotifyErrorEvent) => void
  ): boolean;
  connect(): Promise<boolean>;
  disconnect(): void;
}

export interface SpotifyNamespace {
  Player: new (options: SpotifyPlayerInit) => SpotifyPlayer;
}
