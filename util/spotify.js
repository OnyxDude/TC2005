const axios = require('axios');

// Spotify API credentials
const CLIENT_ID = 'ff06c27f6c474c6b94244352d881d49c';
const CLIENT_SECRET = '69df2f322eb648e997545307639dfd77';

// Token cache
let tokenData = {
    access_token: null,
    expires_at: null
};

/**
 * Get Spotify access token using client credentials flow
 */
const getAccessToken = async () => {
    // Check if we have a valid token already
    if (tokenData.access_token && tokenData.expires_at && tokenData.expires_at > Date.now()) {
        return tokenData.access_token;
    }

    try {
        // Request new token
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            params: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
            }
        });

        // Update token cache
        tokenData = {
            access_token: response.data.access_token,
            expires_at: Date.now() + (response.data.expires_in * 1000) - 60000 // Subtract 1 minute as buffer
        };

        return tokenData.access_token;
    } catch (error) {
        console.error('Error getting Spotify access token:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Spotify');
    }
};

/**
 * Search for tracks on Spotify
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return (max 50)
 * @param {number} offset - Results offset for pagination
 */
const searchTracks = async (query, limit = 20, offset = 0) => {
    try {
        const token = await getAccessToken();
        
        const response = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/search',
            params: {
                q: query,
                type: 'track',
                limit: limit,
                offset: offset
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error searching Spotify tracks:', error.response?.data || error.message);
        throw new Error('Failed to search Spotify tracks');
    }
};

/**
 * Get track details from Spotify
 * @param {string} trackId - Spotify track ID
 */
const getTrackDetails = async (trackId) => {
    try {
        const token = await getAccessToken();
        
        const response = await axios({
            method: 'get',
            url: `https://api.spotify.com/v1/tracks/${trackId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error getting Spotify track details:', error.response?.data || error.message);
        throw new Error('Failed to get Spotify track details');
    }
};

/**
 * Search for a specific track by name and artist
 * @param {string} trackName - Track name to search for
 * @param {string} artist - Artist name (optional)
 */
const findTrackByNameAndArtist = async (trackName, artist = '') => {
    try {
        let query = trackName;
        if (artist) {
            query += ` artist:${artist}`;
        }
        
        const results = await searchTracks(query, 1, 0);
        
        if (results.tracks && results.tracks.items && results.tracks.items.length > 0) {
            return results.tracks.items[0];
        }
        
        return null;
    } catch (error) {
        console.error('Error finding track:', error.message);
        return null;
    }
};

/**
 * Start or resume playback on a user's device
 * @param {string} trackUri - Spotify track URI
 * @param {string} deviceId - Target device ID (optional)
 * @param {string} userAccessToken - User's access token with appropriate scopes
 */
const startPlayback = async (trackUri, deviceId, userAccessToken) => {
    try {
        const url = deviceId ? 
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}` : 
            'https://api.spotify.com/v1/me/player/play';
        
        const response = await axios({
            method: 'put',
            url: url,
            data: {
                uris: [trackUri]
            },
            headers: {
                'Authorization': `Bearer ${userAccessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error starting playback:', error.response?.data || error.message);
        throw new Error('Failed to start playback. This feature requires Spotify Premium.');
    }
};

module.exports = {
    searchTracks,
    getTrackDetails,
    findTrackByNameAndArtist,
    startPlayback
};
