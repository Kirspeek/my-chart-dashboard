"use client";

import React from "react";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: any;
  }
}

type SpotifyWebPlayerProps = {
  trackUri?: string; // spotify:track:xxx
  onReady?: (deviceId: string) => void;
};

export default function SpotifyWebPlayer({
  trackUri,
  onReady,
}: SpotifyWebPlayerProps) {
  const playerRef = React.useRef<any>(null);
  const [deviceId, setDeviceId] = React.useState<string | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function ensureToken() {
      const res = await fetch("/api/spotify/auth/refresh", {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.access_token as string;
    }

    async function loadSdk() {
      if (window.Spotify) return;
      await new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => resolve();
      });
    }

    async function init() {
      await loadSdk();
      const token = await ensureToken();
      if (!token || cancelled) return;

      const player = new window.Spotify.Player({
        name: "Dashboard Player",
        getOAuthToken: async (cb: (t: string) => void) => {
          const r = await fetch("/api/spotify/auth/refresh", {
            cache: "no-store",
          });
          if (r.ok) {
            const j = await r.json();
            cb(j.access_token);
          }
        },
        volume: 0.8,
      });
      playerRef.current = player;

      player.addListener(
        "ready",
        async ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
          setIsReady(true);
          onReady?.(device_id);
          try {
            await fetch("/api/spotify/transfer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ deviceId: device_id, play: false }),
            });
          } catch {}
        }
      );
      player.addListener("not_ready", () => setIsReady(false));
      player.addListener("initialization_error", ({ message }: any) =>
        console.error(message)
      );
      player.addListener("authentication_error", ({ message }: any) =>
        console.error(message)
      );
      player.addListener("account_error", ({ message }: any) =>
        console.error(message)
      );

      await player.connect();
    }

    init();
    return () => {
      cancelled = true;
      if (playerRef.current) {
        try {
          playerRef.current.disconnect();
        } catch {}
      }
    };
  }, [onReady]);

  React.useEffect(() => {
    async function play() {
      if (!trackUri || !deviceId) return;
      const res = await fetch(
        `/api/spotify/play?deviceId=${encodeURIComponent(deviceId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uris: [trackUri] }),
        }
      );
      if (!res.ok) {
        // Most likely the user isn't premium or auth missing
        // Errors are logged server-side
      }
    }
    play();
  }, [trackUri, deviceId]);

  return null;
}
