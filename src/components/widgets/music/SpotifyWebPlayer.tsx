"use client";

import React from "react";
import { API_ENDPOINTS } from "@/apis/constants";
import { SpotifyNamespace, SpotifyPlayer } from "@/interfaces/spotify";
import "@/interfaces/global";

type SpotifyWebPlayerProps = {
  trackUri?: string;
  onReady?: (deviceId: string) => void;
};

export default function SpotifyWebPlayer({
  trackUri,
  onReady,
}: SpotifyWebPlayerProps) {
  const playerRef = React.useRef<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function ensureToken() {
      const res = await fetch(API_ENDPOINTS.SPOTIFY.AUTH.REFRESH, {
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
        script.src = API_ENDPOINTS.SPOTIFY_EMBED.sdkSrc();
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => resolve();
      });
    }

    async function init() {
      await loadSdk();
      const token = await ensureToken();
      if (!token || cancelled) return;

      const SpotifyNS = window.Spotify as SpotifyNamespace | undefined;
      if (!SpotifyNS) return;

      const player = new SpotifyNS.Player({
        name: "Dashboard Player",
        getOAuthToken: async (cb: (t: string) => void) => {
          const r = await fetch(API_ENDPOINTS.SPOTIFY.AUTH.REFRESH, {
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
          onReady?.(device_id);
          try {
            await fetch(API_ENDPOINTS.SPOTIFY.PLAYER.TRANSFER, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ deviceId: device_id, play: false }),
            });
          } catch {}
        }
      );
      player.addListener("not_ready", () => {});
      player.addListener("initialization_error", ({ message }) =>
        console.error(message)
      );
      player.addListener("authentication_error", ({ message }) =>
        console.error(message)
      );
      player.addListener("account_error", ({ message }) =>
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
      const res = await fetch(API_ENDPOINTS.SPOTIFY.PLAYER.PLAY(deviceId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uris: [trackUri] }),
      });
      if (!res.ok) {
      }
    }
    play();
  }, [trackUri, deviceId]);

  return null;
}
