import type { NowPlayingResponse, SpotifyTrack } from '../../src/types/spotify';

declare const process: {
	env: Record<string, string | undefined>;
};

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const TOKEN_EXPIRY_BUFFER_MS = 30_000;

interface TokenResponse {
	access_token: string;
	expires_in: number;
}

interface SpotifyCurrentlyPlaying {
	is_playing?: boolean;
	progress_ms?: number | null;
	item?: {
		type?: string;
		name?: string;
		duration_ms?: number;
		artists?: Array<{ name?: string }>;
		album?: {
			name?: string;
			images?: Array<{ url?: string }>;
		};
		external_urls?: { spotify?: string };
	} | null;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

function json(body: NowPlayingResponse, status = 200, cacheControl = 'no-store'): Response {
	return Response.json(body, {
		status,
		headers: {
			'Cache-Control': cacheControl,
			'X-Content-Type-Options': 'nosniff'
		}
	});
}

function getCredentials(): { clientId: string; clientSecret: string; refreshToken: string } | null {
	const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
	const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim();

	if (!clientId || !clientSecret || !refreshToken) return null;

	return { clientId, clientSecret, refreshToken };
}

function isTokenResponse(value: unknown): value is TokenResponse {
	if (!value || typeof value !== 'object') return false;

	const token = value as Partial<TokenResponse>;
	return typeof token.access_token === 'string' && typeof token.expires_in === 'number';
}

async function getAccessToken(
	credentials: NonNullable<ReturnType<typeof getCredentials>>
): Promise<string> {
	if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

	const response = await fetch(TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`${credentials.clientId}:${credentials.clientSecret}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: credentials.refreshToken
		})
	});

	if (!response.ok) throw new Error(`Spotify token request failed with ${response.status}`);

	const payload: unknown = await response.json();
	if (!isTokenResponse(payload)) throw new Error('Spotify token response had an unexpected shape');

	cachedToken = {
		value: payload.access_token,
		expiresAt: Date.now() + Math.max(0, payload.expires_in * 1_000 - TOKEN_EXPIRY_BUFFER_MS)
	};

	return payload.access_token;
}

function safeSpotifyUrl(value: unknown): string | null {
	if (typeof value !== 'string') return null;

	try {
		const url = new URL(value);
		return url.protocol === 'https:' && url.hostname === 'open.spotify.com' ? url.toString() : null;
	} catch {
		return null;
	}
}

function safeImageUrl(value: unknown): string | null {
	if (typeof value !== 'string') return null;

	try {
		const url = new URL(value);
		return url.protocol === 'https:' ? url.toString() : null;
	} catch {
		return null;
	}
}

function normalizeTrack(payload: SpotifyCurrentlyPlaying): SpotifyTrack | null {
	const item = payload.item;
	if (!payload.is_playing || !item || item.type !== 'track') return null;

	const title = item.name?.trim();
	const album = item.album?.name?.trim();
	const artists = item.artists
		?.map(({ name }) => name?.trim())
		.filter((name): name is string => Boolean(name));
	const spotifyUrl = safeSpotifyUrl(item.external_urls?.spotify);

	if (!title || !album || !artists?.length || !spotifyUrl || typeof item.duration_ms !== 'number') {
		return null;
	}

	return {
		title,
		artists,
		album,
		albumImageUrl: safeImageUrl(item.album?.images?.[0]?.url),
		spotifyUrl,
		progressMs: typeof payload.progress_ms === 'number' ? payload.progress_ms : 0,
		durationMs: item.duration_ms
	};
}

export default function handler(request: Request): Promise<Response> | Response {
	if (request.method !== 'GET') {
		return new Response(null, {
			status: 405,
			headers: {
				Allow: 'GET',
				'Cache-Control': 'no-store'
			}
		});
	}

	return handleNowPlaying();
}

async function handleNowPlaying(): Promise<Response> {
	const credentials = getCredentials();
	if (!credentials) return json({ status: 'unavailable' }, 503);

	try {
		const accessToken = await getAccessToken(credentials);
		const response = await fetch(NOW_PLAYING_ENDPOINT, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (response.status === 204) {
			return json({ status: 'idle' }, 200, 'public, s-maxage=30, stale-while-revalidate=60');
		}

		if (!response.ok) throw new Error(`Spotify playback request failed with ${response.status}`);

		const payload = (await response.json()) as SpotifyCurrentlyPlaying;
		const track = normalizeTrack(payload);

		return track
			? json({ status: 'playing', track }, 200, 'public, s-maxage=15, stale-while-revalidate=30')
			: json({ status: 'idle' }, 200, 'public, s-maxage=30, stale-while-revalidate=60');
	} catch (error) {
		console.error(error instanceof Error ? error.message : 'Unknown Spotify integration error');
		return json({ status: 'unavailable' }, 503);
	}
}
