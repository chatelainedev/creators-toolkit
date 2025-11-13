// Updated generateCharactersContent function
// Helper function to generate individual character card HTML
function generateCharacterCard(character, index) {
    const imageContent = character.image 
        ? `<img src="${character.image}" alt="${character.name}" class="character-image">`
        : `<div class="character-image">No Image</div>`;
    
    // Generate tags for the character card (only visible tags, strip color syntax)
    let tagsHTML = '';
    if (character.tags && character.tags.length > 0) {
        const visibleTags = getVisibleTags(character.tags);
        if (visibleTags.length > 0) {
            tagsHTML = '<div class="character-card-tags">';
            visibleTags.slice(0, 3).forEach(tag => {
                const parsed = parseTagWithColor(tag);
                tagsHTML += `<span class="character-card-tag">${parsed.name}</span>`;
            });
            if (visibleTags.length > 3) {
                tagsHTML += `<span class="character-card-tag">+${visibleTags.length - 3}</span>`;
            }
            tagsHTML += '</div>';
        }
    }

    // Create data attributes for filtering - use ALL tags but stripped of "!" for comparison
    const allTagsStripped = character.tags ? character.tags.map(stripHiddenPrefix).join(',') : '';

    // Add context menu attributes if character card is enabled
    const contextMenuAttrs = character.cardEnabled && character.cardPath 
        ? `oncontextmenu="showCharacterCardContextMenu(event, '${character.cardPath}'); return false;"` 
        : '';

    return `
        <div class="character-card" data-tags="${allTagsStripped}" data-name="${character.name.toLowerCase()}" 
            onclick="openCharacterModal(${index})" ${contextMenuAttrs}>
        ${imageContent}
        <div class="character-name">${character.name}</div>
        ${tagsHTML}
    </div>`;
}

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
                const parsed = parseTagWithColor(tag);
                let styleAttr = '';
                if (parsed.bgColor) {
                    const textColor = parsed.textColor || getContrastingTextColor(parsed.bgColor);
                    const hoverColor = parsed.hoverColor || parsed.bgColor; // Default to same as bg if not specified
                    styleAttr = ` style="background-color: ${parsed.bgColor}; color: ${textColor}; --hover-color: ${hoverColor};"`;
                }
                const escapedTag = tag.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");
                charactersHTML += `<div class="character-tag-link" onclick="toggleCharacterTag('${escapedTag}')"${styleAttr}>${parsed.name}</div>`;
            });
            
            charactersHTML += '</div>';
        }

        charactersHTML += `
                </div>
            </div>`;

        // Check if we should organize by faction
        const showByFaction = data.charactersOptions?.showByFaction ?? true;

        if (showByFaction) {
            // Organize characters by faction
            const factionGroups = {}; // { factionName: [characters] }
            const noFactionCharacters = [];

            data.characters.forEach(character => {
                const faction = (character.faction || '').trim();
                
                if (!faction) {
                    noFactionCharacters.push(character);
                } else {
                    if (!factionGroups[faction]) {
                        factionGroups[faction] = [];
                    }
                    factionGroups[faction].push(character);
                }
            });

            // Determine faction render order
            let factionNames = Object.keys(factionGroups);
            
            if (data.charactersOptions?.factionOrder && data.world?.factions) {
                // Build ordered list based on saved faction indices
                const orderedFactions = [];
                const unorderedFactions = [];
                
                data.charactersOptions.factionOrder.forEach(factionIndex => {
                    if (data.world.factions[factionIndex]) {
                        const factionName = data.world.factions[factionIndex].name;
                        if (factionGroups[factionName]) {
                            orderedFactions.push(factionName);
                        }
                    }
                });
                
                // Find any factions not in the saved order (new factions)
                factionNames.forEach(name => {
                    if (!orderedFactions.includes(name)) {
                        unorderedFactions.push(name);
                    }
                });
                
                // Sort unordered alphabetically and append
                unorderedFactions.sort();
                factionNames = [...orderedFactions, ...unorderedFactions];
            } else {
                // No saved order, sort alphabetically
                factionNames.sort();
            }

            // Render each faction group with headers
            factionNames.forEach(factionName => {
                // Faction header (using same style as storyline sections)
                charactersHTML += `<div class="storyline-section-header">
                    <h3 class="storyline-section-title">${factionName}</h3>
                </div>`;
                
                // Grid for this faction
                charactersHTML += '<div class="characters-grid">';
                
                factionGroups[factionName].forEach((character) => {
                    const characterIndex = data.characters.indexOf(character);
                    charactersHTML += generateCharacterCard(character, characterIndex);
                });
                
                charactersHTML += '</div>';
            });

            // Render characters without faction last
            if (noFactionCharacters.length > 0) {
                charactersHTML += '<div class="characters-grid">';
                
                noFactionCharacters.forEach((character) => {
                    const characterIndex = data.characters.indexOf(character);
                    charactersHTML += generateCharacterCard(character, characterIndex);
                });
                
                charactersHTML += '</div>';
            }
        } else {
            // Original behavior: single grid with all characters in order
            charactersHTML += '<div class="characters-grid">';

            data.characters.forEach((character, index) => {
                charactersHTML += generateCharacterCard(character, index);
            });
            
            charactersHTML += '</div>';
        }
        
        charactersHTML += `<button class="back-to-top" id="character-back-to-top" title="Back to top"></button>`;

        // Add character card context menu
        charactersHTML += `
            <div id="character-card-context-menu" class="context-menu" style="display: none;">
                <div class="context-menu-item" onclick="downloadCharacterCard()">
                    <i class="fas fa-download"></i> Download
                </div>
            </div>`;
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
            console.log('toggleCharacterTag called with:', tag);
            // Strip color syntax for comparison purposes
            const strippedTag = stripHiddenPrefix(tag);
            console.log('After stripping:', strippedTag);
            
            if (selectedCharacterTags.has(strippedTag)) {
                selectedCharacterTags.delete(strippedTag);
            } else {
                selectedCharacterTags.add(strippedTag);
            }
            updateCharacterTagStates();
            updateClearButtonState();
            applyCharacterFilters();
        }

        function updateCharacterTagStates() {
            document.querySelectorAll('.character-tag-link').forEach(link => {
                // Get the full tag (with color syntax) from onclick attribute
                const onclickAttr = link.getAttribute('onclick');
                const tagMatch = onclickAttr.match(/toggleCharacterTag\\('(.+?)'\\)/);
                const fullTag = tagMatch ? tagMatch[1] : link.textContent;
                const strippedTag = stripHiddenPrefix(fullTag);
                
                if (selectedCharacterTags.has(strippedTag)) {
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
            // Hide/show faction headers based on whether they have visible characters
            const factionHeaders = document.querySelectorAll('#characters .storyline-section-header');
            factionHeaders.forEach(header => {
                // Get the next grid element (contains characters for this faction)
                const nextGrid = header.nextElementSibling;
                if (nextGrid && nextGrid.classList.contains('characters-grid')) {
                    // Check if any characters in this faction's grid are visible
                    const visibleChars = nextGrid.querySelectorAll('.character-card:not(.hidden)');
                    
                    if (visibleChars.length > 0) {
                        header.style.display = '';
                        nextGrid.style.display = '';
                    } else {
                        header.style.display = 'none';
                        nextGrid.style.display = 'none';
                    }
                }
            });
        }

        // NEW: Character card context menu functions
        let currentCardPath = '';
        
        function showCharacterCardContextMenu(event, cardPath) {
            event.preventDefault();
            event.stopPropagation();
            
            currentCardPath = cardPath;
            const contextMenu = document.getElementById('character-card-context-menu');
            
            // Use clientX/clientY for viewport coordinates instead of pageX/pageY
            let x = event.clientX;
            let y = event.clientY;
            
            // Get viewport dimensions to prevent menu from going off-screen
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Estimate menu dimensions (adjust these if needed)
            const menuWidth = 120;
            const menuHeight = 40;
            
            // Adjust position if menu would go off-screen
            if (x + menuWidth > viewportWidth) {
                x = viewportWidth - menuWidth - 5;
            }
            if (y + menuHeight > viewportHeight) {
                y = viewportHeight - menuHeight - 5;
            }
            
            // Ensure minimum distance from edges
            x = Math.max(5, x);
            y = Math.max(5, y);
            
            contextMenu.style.left = x + 'px';
            contextMenu.style.top = y + 'px';
            contextMenu.style.display = 'block';
        }
        
        function downloadCharacterCard() {
            if (currentCardPath) {
                const link = document.createElement('a');
                link.href = currentCardPath;
                link.download = currentCardPath.split('/').pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            hideCharacterCardContextMenu();
        }
        
        function hideCharacterCardContextMenu() {
            const contextMenu = document.getElementById('character-card-context-menu');
            if (contextMenu) {
                contextMenu.style.display = 'none';
            }
        }
        
        // Hide context menu when clicking elsewhere
        document.addEventListener('click', hideCharacterCardContextMenu);
        
        // Make character card functions globally available
        window.showCharacterCardContextMenu = showCharacterCardContextMenu;
        window.downloadCharacterCard = downloadCharacterCard;

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