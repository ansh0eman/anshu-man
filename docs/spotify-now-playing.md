# Spotify “Now Playing” activation plan

The local integration is intentionally inactive until the portfolio owner supplies server-side credentials. It never asks visitors to sign in and does not contain fallback or demo playback data.

## Architecture

1. The static homepage loads `src/components/NowPlaying.astro`.
2. The browser requests the same-origin `/api/spotify/now-playing` endpoint every 30 seconds while the page is visible.
3. A rewrite sends that request to a Netlify Function, which exchanges the owner’s refresh token for a short-lived access token, calls Spotify’s current-playback endpoint, and returns only normalized display fields.
4. The browser receives no client secret, refresh token, access token, device information, or raw Spotify response.

The public response has three states:

- `playing`: a real currently playing track and its display metadata.
- `idle`: Spotify returned no actively playing track.
- `unavailable`: credentials are absent or Spotify could not be reached. This response is not cached.

## One-time owner authorization

This helper runs only on the owner’s computer. It is not part of the public site and never asks visitors to authenticate. In the Spotify Dashboard, configure:

- Website: `https://anshuman.netlify.app`
- Redirect URI: `http://127.0.0.1:4321/spotify/callback`

Create `.env.spotify.local` in the project root and add the existing app credentials there:

```dotenv
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

Do not paste either value into source code, a command argument, chat, or a committed file. The helper enforces mode `0600`, listens only on `127.0.0.1`, requests only `user-read-currently-playing`, validates a random single-use state, and stops after one callback or five minutes.

Run:

```sh
npm run spotify:authorize
```

Open the printed Spotify URL and authorize the portfolio owner account. The helper exchanges the returned code locally and adds `SPOTIFY_REFRESH_TOKEN` to `.env.spotify.local` without printing the token. It refuses to overwrite an existing refresh token.

Copy all three values from that ignored local file into Netlify’s encrypted environment-variable settings:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

Never prefix these names with `PUBLIC_`. After Netlify has the values, delete `.env.spotify.local` if local testing is unnecessary, then redeploy. The production portfolio has no OAuth callback; visitors only call `/api/spotify/now-playing`.

If the refresh token expires or is revoked, remove only its line from `.env.spotify.local` (or recreate the file with the client values), rerun the helper, update Netlify, and redeploy. Until then, the component safely reports that Spotify is unavailable.

## Deployment verification

After the owner configures all three environment variables in Netlify:

1. Redeploy so the function receives the new environment settings.
2. With Spotify stopped, verify the endpoint returns `{ "status": "idle" }` and no credential-shaped fields.
3. Start a track on the owner account and verify the endpoint returns `status: "playing"` with only the normalized track fields.
4. Inspect browser network traffic and confirm no access token, refresh token, client ID, or client secret is present.
5. Temporarily remove one environment variable and confirm the endpoint returns HTTP 503 with `{ "status": "unavailable" }`.

## Official references

- Spotify: https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track
- Spotify refresh tokens: https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
- Netlify Functions: https://docs.netlify.com/build/functions/overview/
