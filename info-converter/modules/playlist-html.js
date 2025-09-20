// Playlist HTML Generation Functions
// This file contains functions to generate playlist HTML for the Playlists section

// Global state for playlist filtering
let selectedPlaylistTags = new Set();
let playlistFilterMode = 'any';

// Main function to generate Playlists content
function generatePlaylistsContent(data) {
    let playlistsHTML = '<div id="playlists" class="content">';
    
    if (data.playlists && data.playlists.length > 0) {
        // Collect VISIBLE tags for filtering
        const uniqueTags = collectPlaylistTags(data);
        const navigationHTML = generatePlaylistNavigation(uniqueTags);
        
        playlistsHTML += `
            <div class="playlists-header">
                <h2 class="section-title">Playlists</h2>
            </div>`;

        playlistsHTML += navigationHTML; // Add navigation above grid
        playlistsHTML += '<div class="playlists-grid" id="playlists-grid">';
        
        data.playlists.forEach((playlist, index) => {
            playlistsHTML += generatePlaylistCard(playlist, index);
        });
        
        playlistsHTML += '</div>';
    } else {
        playlistsHTML += `
            <h2 class="section-title">Playlists</h2>
            <div class="empty-content">
                <h3>No Playlists</h3>
                <p>No playlists have been added yet.</p>
            </div>`;
    }
    
    playlistsHTML += `<button class="back-to-top" id="playlists-back-to-top" title="Back to top"></button>`;
    playlistsHTML += '</div>';
    return playlistsHTML;
}


// Generate individual playlist card (REMOVED VISUAL TAGS)
function collectPlaylistTags(data) {
    const uniqueTags = new Set();
    
    if (data.playlists && data.playlists.length > 0) {
        data.playlists.forEach(playlist => {
            if (playlist.tags && Array.isArray(playlist.tags)) {
                const visibleTags = getVisibleTags(playlist.tags);
                visibleTags.forEach(tag => {
                    if (tag && tag.trim()) {
                        uniqueTags.add(tag.trim());
                    }
                });
            }
        });
    }
    
    return Array.from(uniqueTags).sort();
}

// Updated generatePlaylistCard function - matches your actual code with hidden tag support
function generatePlaylistCard(playlist, index) {
    const title = playlist.title || 'Untitled Playlist';
    const description = playlist.description || '';
    
    // Extract Spotify playlist ID from URL
    const embedUrl = extractSpotifyEmbedUrl(playlist.spotifyUrl);
    
    let embedHTML;
    if (embedUrl) {
        embedHTML = `
            <iframe 
                src="${embedUrl}" 
                width="100%" 
                height="380" 
                frameborder="0" 
                allowtransparency="true" 
                allow="encrypted-media">
            </iframe>`;
    } else {
        // Fallback for invalid URLs
        embedHTML = `
            <div class="playlist-embed-fallback">
                <div class="fallback-icon">♪</div>
                <div class="fallback-text">Invalid Spotify URL</div>
                <div class="fallback-url">${playlist.spotifyUrl || 'No URL provided'}</div>
            </div>`;
    }
    
    // Create data attributes for filtering - use ALL tags but stripped of "!" prefix
    const tagsData = playlist.tags ? playlist.tags.map(stripHiddenPrefix).join(',').toLowerCase() : '';

    return `
        <div class="playlist-card" data-tags="${tagsData}">
            <div class="playlist-header">
                <h3 class="playlist-title">${title}</h3>
            </div>
            
            <div class="playlist-embed">
                ${embedHTML}
            </div>
            
            ${description ? `<div class="playlist-description">${parseMarkdown(description)}</div>` : ''}
        </div>`;
}

// Generate playlist filter navigation (using storylines pattern)
function generatePlaylistNavigation(uniqueTags) {
    if (uniqueTags.length === 0) {
        return ''; // No navigation if no tags
    }
    
    let navHTML = `
        <div class="storylines-navigation" id="playlist-nav">
            <div class="storylines-nav-header" onclick="togglePlaylistNavigation()">
                <span class="storylines-nav-title">Filter Playlists</span>
                <span class="storylines-nav-toggle">▶</span>
            </div>
            <div class="storylines-nav-content collapsed">
                <div class="storylines-filter-controls">
                    <div class="storylines-filter-mode-buttons">
                        <button class="storylines-filter-mode-option active" id="playlist-filter-mode-any" onclick="setPlaylistFilterMode('any')">Any</button>
                        <button class="storylines-filter-mode-option" id="playlist-filter-mode-all" onclick="setPlaylistFilterMode('all')">All</button>
                    </div>
                    <button class="storylines-clear-selected-btn" id="playlist-clear-selected-btn" onclick="clearAllPlaylistTags()" title="Clear all selected tags">Clear</button>
                </div>
                <div class="storylines-tag-links">`;
    
    uniqueTags.forEach(tag => {
        navHTML += `<span class="storylines-tag-link" onclick="togglePlaylistTag('${tag}')">${tag}</span>`;
    });
    
    navHTML += `
                </div>
            </div>
        </div>`;
    
    return navHTML;
}

// Generate playlist filtering JavaScript
function generatePlaylistJavaScript() {
    return `
        // Global state for playlist filtering
        let selectedPlaylistTags = new Set();
        let playlistFilterMode = 'any';

        // Toggle playlist navigation (expand/collapse)
        function togglePlaylistNavigation() {
            const content = document.getElementById('playlist-nav')?.querySelector('.storylines-nav-content');
            const toggle = document.getElementById('playlist-nav')?.querySelector('.storylines-nav-toggle');
            
            if (content && toggle) {
                content.classList.toggle('collapsed');
                toggle.classList.toggle('expanded');
                toggle.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
            }
        }

        // Toggle individual playlist tag selection
        function togglePlaylistTag(tag) {
            if (selectedPlaylistTags.has(tag)) {
                selectedPlaylistTags.delete(tag);
            } else {
                selectedPlaylistTags.add(tag);
            }
            
            updatePlaylistTagStates();
            updatePlaylistClearButtonState();
            applyPlaylistFilters();
        }

        // Set filter mode (any/all)
        function setPlaylistFilterMode(mode) {
            playlistFilterMode = mode;
            
            // Update UI
            document.querySelectorAll('.storylines-filter-mode-option').forEach(option => {
                option.classList.remove('active');
            });
            document.getElementById('playlist-filter-mode-' + mode).classList.add('active');
            
            // Reapply filters
            applyPlaylistFilters();
        }

        // Clear all selected tags
        function clearAllPlaylistTags() {
            selectedPlaylistTags.clear();
            updatePlaylistTagStates();
            updatePlaylistClearButtonState();
            applyPlaylistFilters();
        }

        // Update visual state of tag links
        function updatePlaylistTagStates() {
            const navContainer = document.getElementById('playlist-nav');
            
            if (navContainer) {
                const tagLinks = navContainer.querySelectorAll('.storylines-tag-link');
                tagLinks.forEach(link => {
                    const tag = link.textContent;
                    if (selectedPlaylistTags.has(tag)) {
                        link.classList.add('selected');
                    } else {
                        link.classList.remove('selected');
                    }
                });
            }
        }

        // Update clear button state
        function updatePlaylistClearButtonState() {
            const clearBtn = document.getElementById('playlist-clear-selected-btn');
            
            if (clearBtn) {
                if (selectedPlaylistTags.size > 0) {
                    clearBtn.classList.add('active');
                } else {
                    clearBtn.classList.remove('active');
                }
            }
        }

        // Apply filters to playlist cards
        function applyPlaylistFilters() {
            const gridContainer = document.getElementById('playlists-grid');
            
            if (!gridContainer) return;
            
            const playlistCards = gridContainer.querySelectorAll('.playlist-card');
            let visibleCount = 0;
            
            playlistCards.forEach(card => {
                let shouldShow = true;
                
                // Tag filtering
                if (selectedPlaylistTags.size > 0) {
                    const cardTags = card.getAttribute('data-tags');
                    const cardTagsArray = cardTags ? cardTags.split(',').map(tag => tag.trim()) : [];
                    
                    if (playlistFilterMode === 'all') {
                        // Card must have ALL selected tags
                        shouldShow = Array.from(selectedPlaylistTags).every(selectedTag => 
                            cardTagsArray.some(cardTag => cardTag.includes(selectedTag.toLowerCase()))
                        );
                    } else {
                        // Card must have ANY of the selected tags
                        shouldShow = Array.from(selectedPlaylistTags).some(selectedTag => 
                            cardTagsArray.some(cardTag => cardTag.includes(selectedTag.toLowerCase()))
                        );
                    }
                }
                
                // Show/hide card
                if (shouldShow) {
                    card.style.display = '';
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
            
            console.log(\`Playlist filtering: \${visibleCount}/\${playlistCards.length} playlists visible\`);
        }

        // Initialize playlist features
        function initializePlaylistFeatures() {
            // Playlist back to top button
            const backToTopBtn = document.getElementById('playlists-back-to-top');
            if (backToTopBtn) {
                window.addEventListener('scroll', function() {
                    if (window.pageYOffset > 300) {
                        backToTopBtn.classList.add('visible');
                    } else {
                        backToTopBtn.classList.remove('visible');
                    }
                });
                
                backToTopBtn.addEventListener('click', function() {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        }

        // Make playlist filtering functions globally available
        window.togglePlaylistNavigation = togglePlaylistNavigation;
        window.togglePlaylistTag = togglePlaylistTag;
        window.setPlaylistFilterMode = setPlaylistFilterMode;
        window.clearAllPlaylistTags = clearAllPlaylistTags;
        window.selectedPlaylistTags = selectedPlaylistTags;
        window.initializePlaylistFeatures = initializePlaylistFeatures;
    `;
}

// Extract Spotify playlist ID and create embed URL
function extractSpotifyEmbedUrl(url) {
    if (!url) return null;
    
    // Match various Spotify URL formats
    const patterns = [
        /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,  // Standard playlist URL
        /spotify\.com\/embed\/playlist\/([a-zA-Z0-9]+)/, // Already embed URL
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator&theme=0`;
        }
    }
    
    return null; // Invalid URL
}

// Make functions globally available
window.generatePlaylistsContent = generatePlaylistsContent;
window.generatePlaylistCard = generatePlaylistCard;
window.extractSpotifyEmbedUrl = extractSpotifyEmbedUrl;
window.collectPlaylistTags = collectPlaylistTags;
window.generatePlaylistNavigation = generatePlaylistNavigation;
window.generatePlaylistJavaScript = generatePlaylistJavaScript;