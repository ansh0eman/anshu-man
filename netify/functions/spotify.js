const axios = require('axios');
const querystring = require('querystring');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'https://google.com/';
const refresh_token = 'YOUR_REFRESH_TOKEN';

exports.handler = async function(event, context) {
    const authHeader = `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`;
    
    try {
        // Get an access token
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }), {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const accessToken = tokenResponse.data.access_token;

        // Fetch top tracks
        const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=5', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        // Fetch top artists
        const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=5', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                topTracks: topTracksResponse.data.items,
                topArtists: topArtistsResponse.data.items
            })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from Spotify' })
        };
    }
};
