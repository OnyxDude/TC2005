// Funcionalidad para ocultar/mostrar los resultados de búsqueda de Spotify
function toggleSpotifyResults() {
    const container = document.getElementById('spotifyResultsContainer');
    const toggleText = document.getElementById('toggleSpotifyResultsText');
    const toggleIcon = document.getElementById('toggleSpotifyResultsIcon');
    
    if (container.style.display === 'none') {
        container.style.display = 'grid';
        toggleText.textContent = 'Ocultar';
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
    } else {
        container.style.display = 'none';
        toggleText.textContent = 'Mostrar';
        toggleIcon.classList.remove('fa-chevron-up');
        toggleIcon.classList.add('fa-chevron-down');
    }
}

// Función para cargar más resultados (implementación futura con paginación)
// Esta es una versión simplificada que podría expandirse para hacer llamadas AJAX
// y obtener más resultados de la API de Spotify
let currentOffset = 20; // Asumiendo que inicialmente mostramos 20 resultados
const resultsPerPage = 20;

function showMoreResults() {
    // Esta función podría hacer una llamada AJAX para cargar más resultados
    // Utilizando el offset actual y la cantidad de resultados por página
    
    // Ejemplo de cómo sería la implementación real con AJAX:
    const searchQuery = document.querySelector('input[name="q"]').value;
    
    // Mostrar un indicador de carga
    const loadMoreButton = document.querySelector('button[onclick="showMoreResults()"]');
    const originalButtonText = loadMoreButton.innerHTML;
    loadMoreButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Cargando...';
    loadMoreButton.disabled = true;
    
    // Hacer la solicitud AJAX para más resultados
    fetch(`/canciones/api/search?q=${encodeURIComponent(searchQuery)}&offset=${currentOffset}&limit=${resultsPerPage}`)
        .then(response => response.json())
        .then(data => {
            if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
                // Agregar los nuevos resultados al contenedor existente
                const container = document.getElementById('spotifyResultsContainer');
                
                data.tracks.items.forEach(track => {
                    const trackElement = createTrackElement(track);
                    container.appendChild(trackElement);
                });
                
                // Actualizar el offset para la próxima carga
                currentOffset += data.tracks.items.length;
                
                // Si no hay más resultados, ocultar el botón
                if (data.tracks.items.length < resultsPerPage || !data.tracks.next) {
                    loadMoreButton.style.display = 'none';
                }
            } else {
                // No hay más resultados, ocultar el botón
                loadMoreButton.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error cargando más resultados:', error);
            alert('Error al cargar más resultados. Por favor, inténtalo de nuevo.');
        })
        .finally(() => {
            // Restaurar el botón
            loadMoreButton.innerHTML = originalButtonText;
            loadMoreButton.disabled = false;
        });
}

// Función auxiliar para crear un elemento de pista de Spotify
function createTrackElement(track) {
    const div = document.createElement('div');
    div.className = 'bg-gray-800 hover:bg-gray-700 rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-all duration-200';
    
    // Crear contenido HTML para el elemento
    let albumImage = '';
    if (track.album && track.album.images && track.album.images.length > 0) {
        albumImage = `<img src="${track.album.images[0].url}" alt="${track.album.name}" class="w-full h-48 object-cover">`;
    } else {
        albumImage = `<div class="w-full h-48 bg-gray-700 flex items-center justify-center">
                        <i class="fas fa-music text-4xl text-gray-500"></i>
                      </div>`;
    }
    
    const releaseDate = new Date(track.album.release_date).getFullYear();
    const artistNames = track.artists.map(a => a.name).join(', ');
    
    div.innerHTML = `
        ${albumImage}
        <div class="p-5">
            <h3 class="text-xl font-bold text-spotify-green mb-2">${track.name}</h3>
            <p class="text-white mb-2">${artistNames}</p>
            <p class="text-spotify-gray mb-2"><span class="text-sm opacity-70">Album:</span> ${track.album.name}</p>
            <p class="text-spotify-gray mb-4"><span class="text-sm opacity-70">Año:</span> ${releaseDate}</p>
            
            <div class="flex items-center justify-between mt-4">
                <a href="${track.external_urls.spotify}" target="_blank" class="text-spotify-green hover:text-white transition-colors">
                    <i class="fab fa-spotify mr-1"></i> Reproducir
                </a>
                <a href="/canciones/agregar-spotify/${track.id}" class="btn-spotify bg-spotify-green hover:bg-opacity-80 text-white py-2 px-4 rounded-full font-medium transition-all duration-200">
                    <i class="fas fa-plus mr-1"></i> Guardar
                </a>
            </div>
        </div>
    `;
    
    return div;
}
