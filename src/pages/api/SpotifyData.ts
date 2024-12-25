import { AstroResponse } from 'astro';
import axios from 'axios';

const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

let accessToken = '';

async function getAccessToken() {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({ grant_type: 'client_credentials' }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            },
        }
    );
    accessToken = response.data.access_token;
}

export async function get({ params }: any): Promise<AstroResponse> {
    if (!accessToken) await getAccessToken();

    try {
        const { type = 'artists', limit = 10 } = params;
        const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit },
        });

        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch Spotify data' }), { status: 500 });
    }
}
