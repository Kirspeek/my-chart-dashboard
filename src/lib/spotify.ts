let cachedToken: { accessToken: string; expiresAt: number } | null = null;

export async function fetchSpotifyToken(): Promise<{
  accessToken: string;
  expiresAt: number;
}> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET env vars"
    );
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt - 10_000) {
    return cachedToken;
  }

  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Spotify token error: ${resp.status} ${text}`);
  }
  const json = (await resp.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
  cachedToken = {
    accessToken: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken;
}
