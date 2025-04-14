// Controlador para la página de canciones con layout integrado
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const advancedSearchToggle = document.getElementById('advancedSearchToggle');
    const advancedSearchPanel = document.getElementById('advancedSearchPanel');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    
    // Toggle panel de búsqueda avanzada
    if (advancedSearchToggle && advancedSearchPanel) {
        advancedSearchToggle.addEventListener('click', function() {
            advancedSearchPanel.classList.toggle('hidden');
            
            // Animación sutil del icono
            const icon = this.querySelector('i');
            if (icon) {
                if (advancedSearchPanel.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-sliders-h');
                } else {
                    icon.classList.remove('fa-sliders-h');
                    icon.classList.add('fa-times');
                }
            }
        });
    }
    
    // Control de vista grid/lista
    if (gridViewBtn && listViewBtn && gridView && listView) {
        gridViewBtn.addEventListener('click', function() {
            gridView.classList.remove('hidden');
            listView.classList.add('hidden');
            gridViewBtn.classList.add('bg-spotify-green', 'text-white');
            listViewBtn.classList.remove('bg-spotify-green', 'text-white');
            listViewBtn.classList.add('text-gray-400');
            
            // Guardar preferencia en localStorage
            localStorage.setItem('cancionesViewMode', 'grid');
        });
        
        listViewBtn.addEventListener('click', function() {
            gridView.classList.add('hidden');
            listView.classList.remove('hidden');
            listViewBtn.classList.add('bg-spotify-green', 'text-white');
            gridViewBtn.classList.remove('bg-spotify-green', 'text-white');
            gridViewBtn.classList.add('text-gray-400');
            
            // Guardar preferencia en localStorage
            localStorage.setItem('cancionesViewMode', 'list');
        });
        
        // Cargar preferencia guardada
        const savedViewMode = localStorage.getItem('cancionesViewMode');
        if (savedViewMode === 'list') {
            listViewBtn.click();
        }
    }
});

// Funciones para los resultados de Spotify
function showMoreResults() {
    // Esta función se activará al hacer clic en "Ver más resultados"
    // La implementación real requerirá una llamada AJAX para cargar más resultados
    console.log('Cargar más resultados...');
    
    // Implementación básica (sin AJAX)
    const button = document.querySelector('button[onclick="showMoreResults()"]');
    if (button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Cargando...';
        button.disabled = true;
        
        // Simulación de carga
        setTimeout(() => {
            button.innerHTML = 'Ver más resultados';
            button.disabled = false;
        }, 1000);
    }
}
