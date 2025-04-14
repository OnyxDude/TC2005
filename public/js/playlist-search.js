document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const playlistsContainer = document.getElementById('playlists-container');
    const searchNotification = document.getElementById('search-notification');
    
 
    const showNotification = (message, isError = false) => {
        searchNotification.textContent = message;
        searchNotification.className = isError ? 
            'block mb-4 p-3 bg-red-900 bg-opacity-20 text-red-300 rounded-md text-center' :
            'block mb-4 p-3 bg-green-900 bg-opacity-20 text-green-300 rounded-md text-center';
        searchNotification.style.display = 'block';
    };
    

    const handleSearch = () => {
        const searchTerm = searchInput.value.trim();
        

        playlistsContainer.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-spotify-green text-4xl"></i><p class="text-spotify-gray mt-4">Buscando playlists...</p></div>';
        searchNotification.style.display = 'none';
        

        console.log(`Searching for "${searchTerm}"`);
        

        fetch(`/playlists/search?term=${encodeURIComponent(searchTerm)}`)
        .then(response => {
            console.log('Search response status:', response.status);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Search results:', data);
            
            
            showNotification(data.message, data.error);
            
            
            if (data.playlists && Array.isArray(data.playlists)) {
                renderPlaylists(data.playlists);
            } else {
                throw new Error('Formato de respuesta inválido');
            }
        })
        .catch(error => {
            console.error('Error in search:', error);
            showNotification('Ocurrió un error durante la búsqueda: ' + error.message, true);
            playlistsContainer.innerHTML = '<div class="bg-gray-800 rounded-lg p-6 text-center border border-gray-700"><p class="text-spotify-gray">Error al cargar resultados.</p></div>';
        });
    };
    

    const renderPlaylists = (playlists) => {
        if (playlists.length === 0) {
            playlistsContainer.innerHTML = `
                <div class="bg-gray-800 rounded-lg p-10 text-center border border-gray-700">
                    <p class="text-spotify-gray mb-6">No se encontraron playlists para tu búsqueda.</p>
                    <a href="/playlists/agregar" class="btn-spotify bg-spotify-green hover:bg-opacity-80 text-white py-2 px-4 rounded-full font-medium transition-all duration-200 inline-flex items-center">
                        <i class="fas fa-music mr-2"></i> Crea una nueva playlist
                    </a>
                </div>
            `;
            return;
        }
        
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
        
        playlists.forEach(playlist => {
            html += `
                <div class="card bg-gray-800 hover:bg-gray-700 rounded-lg p-5 shadow-lg flex flex-col transition-all duration-200 border border-gray-700">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-xl font-bold text-spotify-green">${playlist.nombre}</h3>
                        <div class="flex space-x-3">
                            <a href="/playlists/${playlist.id}" class="text-spotify-gray hover:text-white">
                                <i class="fas fa-eye"></i>
                            </a>
                            <a href="/playlists/editar/${playlist.id}" class="text-spotify-green hover:text-white">
                                <i class="fas fa-edit"></i>
                            </a>
                        </div>
                    </div>
                    <p class="text-spotify-gray mb-2">${playlist.descripcion || ''}</p>
                    <p class="text-spotify-gray mt-auto">
                        <span class="text-sm opacity-70">Plataforma:</span> 
                        ${playlist.plataforma_nombre || 'No especificada'}
                    </p>
                    ${playlist.total_canciones !== undefined ? `
                    <p class="text-spotify-gray">
                        <span class="text-sm opacity-70">Canciones:</span> 
                        ${playlist.total_canciones}
                    </p>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        playlistsContainer.innerHTML = html;
    };
    

    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
        
    
        const debounce = (func, delay) => {
            let timeoutId;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(context, args);
                }, delay);
            };
        };
        
        
        searchInput.addEventListener('input', debounce(() => {
            if (searchInput.value.trim().length >= 2) {
                handleSearch();
            }
        }, 500));
    }
});
