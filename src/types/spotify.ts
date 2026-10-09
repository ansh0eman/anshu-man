export interface SpotifyTrack {
	title: string;
	artists: string[];
	album: string;
	albumImageUrl: string | null;
	spotifyUrl: string;
	progressMs: number;
	durationMs: number;
}

export type NowPlayingResponse =
	| { status: 'playing'; track: SpotifyTrack }
	| { status: 'repeat'; track: SpotifyTrack }
	| { status: 'idle' }
	| { status: 'unavailable' };
