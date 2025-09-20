// Updated generateCharactersContent function
function generateCharactersContent(data) {
    let charactersHTML = '<div id="characters" class="content">';
    
    if (data.characters && data.characters.length > 0) {
        // Collect all unique VISIBLE tags (excluding "!" prefixed ones)
        const allTags = new Set();
        data.characters.forEach(character => {
            if (character.tags && Array.isArray(character.tags)) {
                const visibleTags = getVisibleTags(character.tags);
                visibleTags.forEach(tag => allTags.add(tag));
            }
        });

        const tagsArray = Array.from(allTags).sort();

        // Header comes first
        charactersHTML += `
            <div class="characters-header">
                <h2 class="section-title">Characters</h2>
            </div>`;

        // Character navigation with only visible tags
        charactersHTML += `
            <div class="character-navigation" id="character-nav">
                <div class="character-nav-header" onclick="toggleCharacterNavigation()">
                    <span class="character-nav-title">Filter Characters</span>
                    <span class="character-nav-toggle">&#9654;</span>
                </div>
                <div class="character-nav-content collapsed">
                    <div class="character-filter-controls">
                        <input type="text" class="character-search" id="character-search" placeholder="Search characters...">
                        <div class="filter-mode-buttons">
                            <button class="filter-mode-option active" id="filter-mode-any" onclick="setFilterMode('any')">Any</button>
                            <button class="filter-mode-option" id="filter-mode-all" onclick="setFilterMode('all')">All</button>
                        </div>
                        <button class="clear-selected-btn" id="clear-selected-btn" onclick="clearAllCharacterTags()">Clear</button>
                    </div>`;

        if (tagsArray.length > 0) {
            charactersHTML += '<div class="character-tag-links">';
            
            tagsArray.forEach(tag => {
                charactersHTML += `<div class="character-tag-link" onclick="toggleCharacterTag('${tag}')">${tag}</div>`;
            });
            
            charactersHTML += '</div>';
        }

        charactersHTML += `
                </div>
            </div>`;

        // Characters grid
        charactersHTML += '<div class="characters-grid">';
        
        data.characters.forEach((character, index) => {
            const imageContent = character.image 
                ? `<img src="${character.image}" alt="${character.name}" class="character-image">`
                : `<div class="character-image">No Image</div>`;
            
            // Generate tags for the character card (only visible tags)
            let tagsHTML = '';
            if (character.tags && character.tags.length > 0) {
                const visibleTags = getVisibleTags(character.tags);
                if (visibleTags.length > 0) {
                    tagsHTML = '<div class="character-card-tags">';
                    visibleTags.slice(0, 3).forEach(tag => {
                        tagsHTML += `<span class="character-card-tag">${tag}</span>`;
                    });
                    if (visibleTags.length > 3) {
                        tagsHTML += `<span class="character-card-tag">+${visibleTags.length - 3}</span>`;
                    }
                    tagsHTML += '</div>';
                }
            }

            // Create data attributes for filtering - use ALL tags but stripped of "!" for comparison
            const allTagsStripped = character.tags ? character.tags.map(stripHiddenPrefix).join(',') : '';

                charactersHTML += `
                    <div class="character-card" data-tags="${allTagsStripped}" data-name="${character.name.toLowerCase()}" onclick="openCharacterModal(${index})">
                    ${imageContent}
                    <div class="character-name">${character.name}</div>
                    ${tagsHTML}
                </div>`;
        });
        
        charactersHTML += '</div>';
        charactersHTML += `<button class="back-to-top" id="character-back-to-top" title="Back to top"></button>`;
    } else {
        charactersHTML += `
            <h2 class="section-title">Characters</h2>
            <div class="empty-content">
                <h3>No Characters</h3>
                <p>No characters have been added yet.</p>
            </div>`;
    }
    
    charactersHTML += '</div>';
    return charactersHTML;
}

function generateCharactersFilteringJavaScript() {
    return `
        // UPDATED: Compact character filtering functions
        function setFilterMode(mode) {
            characterFilterMode = mode;
            
            // Update UI
            document.querySelectorAll('.filter-mode-option').forEach(option => {
                option.classList.remove('active');
            });
            document.getElementById(\`filter-mode-\${mode}\`).classList.add('active');
            
            // Reapply filters
            applyCharacterFilters();
        }
        
        function updateCharacterResultsCount() {
            const visibleCards = document.querySelectorAll('.character-card:not(.hidden)');
            const totalCards = document.querySelectorAll('.character-card');
            
            // You could add a results counter here if desired
            console.log(\`Showing \${visibleCards.length} of \${totalCards.length} characters\`);
        }

        function toggleCharacterTag(tag) {
            if (selectedCharacterTags.has(tag)) {
                selectedCharacterTags.delete(tag);
            } else {
                selectedCharacterTags.add(tag);
            }
            
            updateCharacterTagStates();
            updateClearButtonState();
            applyCharacterFilters();
        }
        
        function updateCharacterTagStates() {
            document.querySelectorAll('.character-tag-link').forEach(link => {
                const tag = link.textContent;
                if (selectedCharacterTags.has(tag)) {
                    link.classList.add('selected');
                } else {
                    link.classList.remove('selected');
                }
            });
        }
        
        function updateClearButtonState() {
            const clearBtn = document.getElementById('clear-selected-btn');
            if (clearBtn) {
                if (selectedCharacterTags.size > 0) {
                    clearBtn.classList.add('active');
                } else {
                    clearBtn.classList.remove('active');
                }
            }
        }
        
        function clearAllCharacterTags() {
            selectedCharacterTags.clear();
            updateCharacterTagStates();
            updateClearButtonState();
            applyCharacterFilters();
        }
        
        function toggleCharacterNavigation() {
            const content = document.querySelector('.character-nav-content');
            const toggle = document.querySelector('.character-nav-toggle');
            
            if (content && toggle) {
                if (content.classList.contains('collapsed')) {
                    content.classList.remove('collapsed');
                    toggle.classList.add('expanded');
                    toggle.innerHTML = '&#9660;';
                } else {
                    content.classList.add('collapsed');
                    toggle.classList.remove('expanded');
                    toggle.innerHTML = '&#9654;';
                }
            }
        }

        // Updated character filtering function
        function applyCharacterFilters() {
            const characterCards = document.querySelectorAll('.character-card');
            
            characterCards.forEach(card => {
                // Get tags from data attribute (these are already stripped of "!" prefix)
                const cardTags = card.getAttribute('data-tags').toLowerCase().split(',').filter(tag => tag.trim());
                const cardName = card.getAttribute('data-name');
                
                // Search filter
                const matchesSearch = currentSearchFilter === '' || cardName.includes(currentSearchFilter);
                
                // Tag filter
                let matchesTags = true;
                
                if (selectedCharacterTags.size > 0) {
                    const selectedTagsLower = Array.from(selectedCharacterTags).map(tag => tag.toLowerCase());
                    
                    if (characterFilterMode === 'all') {
                        // Character must have ALL selected tags
                        matchesTags = selectedTagsLower.every(selectedTag => 
                            cardTags.some(cardTag => cardTag.includes(selectedTag))
                        );
                    } else {
                        // Character must have ANY selected tag (default)
                        matchesTags = selectedTagsLower.some(selectedTag => 
                            cardTags.some(cardTag => cardTag.includes(selectedTag))
                        );
                    }
                }
                
                // Show/hide card
                if (matchesSearch && matchesTags) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
            
            updateCharacterResultsCount();
        }

        // Make compact character filtering functions globally available
        window.toggleCharacterTag = toggleCharacterTag;
        window.clearAllCharacterTags = clearAllCharacterTags;
        window.setFilterMode = setFilterMode;
        window.toggleCharacterNavigation = toggleCharacterNavigation;
    `;
}

// Make functions globally available
window.generateCharactersContent = generateCharactersContent;
window.generateCharactersFilteringJavaScript = generateCharactersFilteringJavaScript;