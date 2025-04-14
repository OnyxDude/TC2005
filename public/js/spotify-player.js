// Spotify Web Playback SDK integration

// Spotify Player object
let player = null;
let deviceId = null;
let isPlayerConnected = false;

// Initialize the Spotify Web Playback SDK
window.onSpotifyWebPlaybackSDKReady = () => {
    // Check if a Spotify track ID is available on the page
    const trackId = document.getElementById('spotify-track-id')?.value;
    if (!trackId) {
        console.log('No Spotify track ID found, skipping player initialization');
        return;
    }
    
    // Initialize player
    initializePlayer();
};

// Initialize the Spotify player
function initializePlayer() {
    const tokenElement = document.getElementById('spotify-token');
    if (!tokenElement) {
        console.error('Spotify user token not found');
        showError('Se requiere autenticación con Spotify para reproducir música.');
        return;
    }
    
    const token = tokenElement.value;
    
    player = new Spotify.Player({
        name: 'My Music App Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { 
        console.error('Initialization error:', message); 
        showError('Error al inicializar el reproductor: ' + message);
    });
    
    player.addListener('authentication_error', ({ message }) => { 
        console.error('Authentication error:', message); 
        showError('Error de autenticación: ' + message);
    });
    
    player.addListener('account_error', ({ message }) => { 
        console.error('Account error:', message);
        showError('Error de cuenta: Se requiere Spotify Premium para reproducir música.');
    });
    
    player.addListener('playback_error', ({ message }) => { 
        console.error('Playback error:', message);
        showError('Error de reproducción: ' + message);
    });

    // Playback status updates
    player.addListener('player_state_changed', state => {
        if (state) {
            updatePlaybackState(state);
        }
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Player ready with Device ID', device_id);
        deviceId = device_id;
        isPlayerConnected = true;
        
        // Update UI
        document.getElementById('player-connect-button').classList.add('hidden');
        document.getElementById('player-controls').classList.remove('hidden');
        
        // Show success message
        showMessage('Reproductor conectado');
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        isPlayerConnected = false;
        deviceId = null;
        
        // Update UI
        document.getElementById('player-connect-button').classList.remove('hidden');
        document.getElementById('player-controls').classList.add('hidden');
    });

    // Connect to the player
    player.connect();
}

// Play the current track
function playTrack() {
    if (!player || !isPlayerConnected || !deviceId) {
        showError('Reproductor no conectado. Haz clic en "Conectar reproductor" primero.');
        return;
    }
    
    const trackId = document.getElementById('spotify-track-id').value;
    const trackUri = `spotify:track:${trackId}`;
    
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.getElementById('spotify-token').value}`
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error.message || 'Error al iniciar reproducción');
            });
        }
    })
    .catch(error => {
        console.error('Error starting playback:', error);
        showError(`Error: ${error.message}`);
    });
}

// Pause playback
function pauseTrack() {
    if (player) {
        player.pause();
    }
}

// Toggle play/pause
function togglePlayPause() {
    if (!player || !isPlayerConnected) {
        playTrack();
        return;
    }
    
    player.getCurrentState().then(state => {
        if (!state) {
            playTrack();
        } else {
            if (state.paused) {
                player.resume();
            } else {
                player.pause();
            }
        }
    });
}

// Update UI based on playback state
function updatePlaybackState(state) {
    const playButton = document.getElementById('play-pause-button');
    
    if (state.paused) {
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

// Disconnect player
function disconnectPlayer() {
    if (player) {
        player.disconnect();
        isPlayerConnected = false;
        deviceId = null;
        
        // Update UI
        document.getElementById('player-connect-button').classList.remove('hidden');
        document.getElementById('player-controls').classList.add('hidden');
    }
}

// Show error message
function showError(message) {
    const errorContainer = document.getElementById('player-error');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorContainer.classList.add('hidden');
        }, 5000);
    }
}

// Show success message
function showMessage(message) {
    const messageContainer = document.getElementById('player-message');
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.classList.remove('hidden');
        
        // Hide after 3 seconds
        setTimeout(() => {
            messageContainer.classList.add('hidden');
        }, 3000);
    }
}
