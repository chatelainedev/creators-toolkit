// Add this function to the END of your storylines-filtering.js file

function generateStorylinesJavaScript() {
    return `
        // Global state for storylines filtering
        let selectedRoleplayTags = new Set();
        let selectedSoloTags = new Set();
        let roleplayFilterMode = 'any';
        let soloFilterMode = 'any';

        // Toggle storylines navigation (expand/collapse) - FIXED VERSION
        function toggleStorylinesNavigation(viewType) {
            const content = document.getElementById(\`storylines-nav-\${viewType}\`)?.querySelector('.storylines-nav-content');
            const toggle = document.getElementById(\`storylines-nav-\${viewType}\`)?.querySelector('.storylines-nav-toggle');
            
            if (content && toggle) {
                content.classList.toggle('collapsed');
                toggle.classList.toggle('expanded');
                toggle.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
            }
        }

        // Toggle individual storyline tag selection
        function toggleStorylinesTag(tag, viewType) {
            const selectedTags = viewType === 'roleplay' ? selectedRoleplayTags : selectedSoloTags;
            
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
            } else {
                selectedTags.add(tag);
            }
            
            updateStorylinesTagStates(viewType);
            updateStorylinesClearButtonState(viewType);
            applyStorylinesFilters(viewType);
        }

        // Set filter mode (any/all) for a specific view type
        function setStorylinesFilterMode(mode, viewType) {
            if (viewType === 'roleplay') {
                roleplayFilterMode = mode;
            } else {
                soloFilterMode = mode;
            }
            
            // Update UI
            document.querySelectorAll(\`#storylines-nav-\${viewType} .storylines-filter-mode-option\`).forEach(option => {
                option.classList.remove('active');
            });
            document.getElementById(\`storylines-filter-mode-\${mode}-\${viewType}\`).classList.add('active');
            
            // Reapply filters
            applyStorylinesFilters(viewType);
        }

        // Clear all selected tags for a specific view type
        function clearAllStorylinesTags(viewType) {
            const selectedTags = viewType === 'roleplay' ? selectedRoleplayTags : selectedSoloTags;
            selectedTags.clear();
            updateStorylinesTagStates(viewType);
            updateStorylinesClearButtonState(viewType);
            applyStorylinesFilters(viewType);
        }

        // Update visual state of tag links
        function updateStorylinesTagStates(viewType) {
            const selectedTags = viewType === 'roleplay' ? selectedRoleplayTags : selectedSoloTags;
            const navContainer = document.getElementById(\`storylines-nav-\${viewType}\`);
            
            if (navContainer) {
                const tagLinks = navContainer.querySelectorAll('.storylines-tag-link');
                tagLinks.forEach(link => {
                    const tag = link.textContent;
                    if (selectedTags.has(tag)) {
                        link.classList.add('selected');
                    } else {
                        link.classList.remove('selected');
                    }
                });
            }
        }

        // Update clear button state
        function updateStorylinesClearButtonState(viewType) {
            const selectedTags = viewType === 'roleplay' ? selectedRoleplayTags : selectedSoloTags;
            const clearBtn = document.getElementById(\`storylines-clear-selected-btn-\${viewType}\`);
            
            if (clearBtn) {
                if (selectedTags.size > 0) {
                    clearBtn.classList.add('active');
                } else {
                    clearBtn.classList.remove('active');
                }
            }
        }

        // FIXED: Apply filters to storyline cards - now works with sections
        function applyStorylinesFilters(viewType) {
            const selectedTags = viewType === 'roleplay' ? selectedRoleplayTags : selectedSoloTags;
            const filterMode = viewType === 'roleplay' ? roleplayFilterMode : soloFilterMode;
            
            // FIXED: Instead of looking for a specific grid container, 
            // look for all storyline cards in the entire view
            const viewContainer = document.getElementById(\`\${viewType}s-view\`);
            
            if (!viewContainer) return;
            
            // Find ALL storyline cards in this view (regardless of which grid they're in)
            const storylineCards = viewContainer.querySelectorAll('.storyline-card');
            let visibleCount = 0;
            
            storylineCards.forEach(card => {
                let shouldShow = true;
                
                // Tag filtering
                if (selectedTags.size > 0) {
                    const cardTags = card.getAttribute('data-tags');
                    const cardTagsArray = cardTags ? cardTags.split(',').map(tag => tag.trim()) : [];
                    
                    if (filterMode === 'all') {
                        // Card must have ALL selected tags
                        shouldShow = Array.from(selectedTags).every(selectedTag => 
                            cardTagsArray.some(cardTag => cardTag.toLowerCase().includes(selectedTag.toLowerCase()))
                        );
                    } else {
                        // Card must have ANY of the selected tags
                        shouldShow = Array.from(selectedTags).some(selectedTag => 
                            cardTagsArray.some(cardTag => cardTag.toLowerCase().includes(selectedTag.toLowerCase()))
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
            
            // Update section visibility after filtering
            const sectionHeaders = viewContainer.querySelectorAll('.storyline-section-header');
            sectionHeaders.forEach(header => {
                // Find the next grid element (should be the storylines-grid right after this header)
                const nextGrid = header.nextElementSibling;
                if (nextGrid && nextGrid.classList.contains('storylines-grid')) {
                    const visibleCards = nextGrid.querySelectorAll('.storyline-card:not(.hidden)');
                    
                    if (visibleCards.length > 0) {
                        // Show both header and grid
                        header.style.display = '';
                        nextGrid.style.display = '';
                    } else {
                        // Hide both header and grid if no visible cards
                        header.style.display = 'none';
                        nextGrid.style.display = 'none';
                    }
                }
            });
            
            // Update results count if needed (optional - could add this later)
            console.log(\`\${viewType} filtering: \${visibleCount}/\${storylineCards.length} storylines visible\`);
        }

        // Make storylines filtering functions globally available
        window.toggleStorylinesNavigation = toggleStorylinesNavigation;
        window.toggleStorylinesTag = toggleStorylinesTag;
        window.setStorylinesFilterMode = setStorylinesFilterMode;
        window.clearAllStorylinesTags = clearAllStorylinesTags;
        window.selectedRoleplayTags = selectedRoleplayTags;
        window.selectedSoloTags = selectedSoloTags;
    `;
}

// Main function to generate storylines content
function generateStorylinesContent(data) {
    let storylinesHTML = '<div id="storylines" class="content">';
    
    if (data.storylines && data.storylines.length > 0) {
        // Calculate total wordcount
        const totalWordcount = data.storylines.reduce((total, storyline) => {
            return total + (storyline.wordcount || 0);
        }, 0);
        
        // Format wordcount with commas for readability
        const formattedWordcount = totalWordcount.toLocaleString();
        
        // Header structure with toggle buttons and repositioned word count
        storylinesHTML += `
            <div class="storylines-header">
                <h2 class="section-title">Storylines
                    <span class="wordcount-display-small" title="Total word count across all storylines">${formattedWordcount} words</span>
                </h2>
                <div class="storylines-tabs">
                    <button class="storylines-tab active" id="roleplays-tab" onclick="switchStorylinesView('roleplays')">Roleplays</button>
                    <button class="storylines-tab" id="solos-tab" onclick="switchStorylinesView('solos')">Solos</button>
                </div>
            </div>`;
        
        // Roleplays View
        storylinesHTML += '<div id="roleplays-view" class="storylines-view active">';
        storylinesHTML += generateStorylinesGrid(data, 'roleplay');
        storylinesHTML += '</div>';
        
        // Solos View
        storylinesHTML += '<div id="solos-view" class="storylines-view">';
        storylinesHTML += generateStorylinesGrid(data, 'solo');
        storylinesHTML += '</div>';
        
    } else {
        storylinesHTML += `
            <h2 class="section-title">Storylines</h2>
            <div class="empty-content">
                <h3>No Storylines</h3>
                <p>No storylines have been added yet.</p>
            </div>`;
    }
    
    storylinesHTML += `<button class="back-to-top" id="storylines-back-to-top" title="Back to top"></button>`;
    storylinesHTML += '</div>';
    return storylinesHTML;
}

function generateStorylinesGrid(data, filterType) {    
    // Filter storylines by type
    const filteredStorylines = data.storylines.filter(storyline => {
        const type = storyline.type || 'roleplay';
        return type === filterType;
    });
    
    if (filteredStorylines.length === 0) {
        const typeLabel = filterType === 'roleplay' ? 'Roleplays' : 'Solos';
        return `
            <div class="empty-content">
                <h3>No ${typeLabel}</h3>
                <p>No ${filterType} storylines have been added yet.</p>
            </div>`;
    }
    
    // Collect VISIBLE tags for this view type and generate navigation
    const uniqueTags = collectStorylinesTagsForType(data, filterType);
    const navigationHTML = generateStorylinesNavigation(uniqueTags, filterType);
    
    let gridHTML = navigationHTML; // Add navigation above grid
    gridHTML += '<div class="storylines-grid" id="storylines-grid-' + filterType + '">';
    
    // Separate storylines into ungrouped and grouped
    // Separate storylines into ungrouped and grouped
    const ungroupedStorylines = [];
    const groupedStorylines = {};

    filteredStorylines.forEach(storyline => {
        const section = (storyline.section || '').trim();
        if (!section) {
            ungroupedStorylines.push(storyline);
        } else {
            if (!groupedStorylines[section]) {
                groupedStorylines[section] = [];
            }
            groupedStorylines[section].push(storyline);
        }
    });

    // Render ungrouped storylines first
    ungroupedStorylines.forEach((storyline, index) => {
        gridHTML += generateStorylineCard(storyline, index);
    });

    // Close the initial grid
    gridHTML += '</div>';

    // Render each section with its own header and grid
    Object.keys(groupedStorylines).sort().forEach(sectionName => {
        gridHTML += `<div class="storyline-section-header">
            <h3 class="storyline-section-title">— ${sectionName} —</h3>
        </div>`;
        
        // Start a new grid for this section
        gridHTML += '<div class="storylines-grid" id="storylines-grid-' + filterType + '-section-' + sectionName.replace(/\s+/g, '-').toLowerCase() + '">';
        
        groupedStorylines[sectionName].forEach((storyline, index) => {
            gridHTML += generateStorylineCard(storyline, index);
        });
        
        // Close this section's grid
        gridHTML += '</div>';
    });
    return gridHTML;
}

// Updated collectStorylinesTagsForType function - only collect visible tags
function collectStorylinesTagsForType(data, filterType) {
    const uniqueTags = new Set();
    
    if (data.storylines && data.storylines.length > 0) {
        data.storylines.forEach(storyline => {
            const type = storyline.type || 'roleplay';
            if (type === filterType && storyline.tags && Array.isArray(storyline.tags)) {
                const visibleTags = getVisibleTags(storyline.tags);
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

// Generate storylines filter navigation for a specific view type
function generateStorylinesNavigation(uniqueTags, viewType) {
    const viewLabel = viewType === 'roleplay' ? 'Roleplays' : 'Solos';
    
    // FIXED: Always show navigation container, even with no tags
    let navHTML = `
        <div class="storylines-navigation" id="storylines-nav-${viewType}">
            <div class="storylines-nav-header" onclick="toggleStorylinesNavigation('${viewType}')">
                <span class="storylines-nav-title">Filter ${viewLabel}</span>
                <span class="storylines-nav-toggle">▶</span>
            </div>
            <div class="storylines-nav-content collapsed">
                <div class="storylines-filter-controls">
                    <div class="storylines-filter-mode-buttons">
                        <button class="storylines-filter-mode-option active" id="storylines-filter-mode-any-${viewType}" onclick="setStorylinesFilterMode('any', '${viewType}')">Any</button>
                        <button class="storylines-filter-mode-option" id="storylines-filter-mode-all-${viewType}" onclick="setStorylinesFilterMode('all', '${viewType}')">All</button>
                    </div>
                    <button class="storylines-clear-selected-btn" id="storylines-clear-selected-btn-${viewType}" onclick="clearAllStorylinesTags('${viewType}')" title="Clear all selected tags">Clear</button>
                </div>`;

    // FIXED: Only conditionally add tag links if tags exist
    if (uniqueTags.length > 0) {
        navHTML += '<div class="storylines-tag-links">';
        uniqueTags.forEach(tag => {
            navHTML += `<span class="storylines-tag-link" onclick="toggleStorylinesTag('${tag}', '${viewType}')">${tag}</span>`;
        });
        navHTML += '</div>';
    }
    
    navHTML += `
            </div>
        </div>`;
    
    return navHTML;
}

// Helper function to generate individual storyline card HTML
function generateStorylineCard(storyline, index) {
    // Format individual wordcount if present
    const wordcountDisplay = storyline.wordcount 
        ? `<div class="storyline-wordcount">${storyline.wordcount.toLocaleString()} words</div>`
        : '';
    
    // Make card clickable if there's a link, otherwise make it non-clickable
    // NEW: Process link based on isProjectLink flag
    let finalLink = '';
    if (storyline.link) {
        if (storyline.isProjectLink) {
            finalLink = `roleplays/${storyline.link}`;
        } else {
            finalLink = storyline.link;
        }
    }

    const cardOnClick = finalLink 
        ? `onclick="window.location.href='${finalLink}'"`
        : '';
    const cardClass = storyline.link 
        ? 'storyline-card' 
        : 'storyline-card storyline-card-no-link';
    
    // Prepare text for tooltips (strip HTML for clean tooltips)
    const titleText = storyline.title || 'Untitled';
    const descriptionText = storyline.description || 'No description provided.';
    const cleanDescription = descriptionText.replace(/<[^>]*>/g, '');
    
    // Use ALL tags (stripped of "!") for filtering data attributes
    const allTagsStripped = storyline.tags ? storyline.tags.map(stripHiddenPrefix).join(',') : '';
    
    return `
        <div class="${cardClass}" data-type="${storyline.type || 'roleplay'}" data-tags="${allTagsStripped}" ${cardOnClick}>
            <div class="storyline-title" title="${titleText}">${titleText}</div>
            <div class="storyline-pairing">${storyline.pairing || 'No pairing specified'}</div>
            ${wordcountDisplay}
            <div class="storyline-description" title="${cleanDescription}">${parseMarkdown(descriptionText)}</div>
            <div class="storyline-meta">
                <div class="storyline-updated">Updated: ${storyline.lastUpdated || 'Unknown'}</div>
                ${storyline.link ? '' : '<span class="storyline-no-link">No link available</span>'}
            </div>
        </div>`;
}

// Make all storylines functions globally available
window.generateStorylinesContent = generateStorylinesContent;
window.generateStorylinesGrid = generateStorylinesGrid;
window.collectStorylinesTagsForType = collectStorylinesTagsForType;
window.generateStorylinesNavigation = generateStorylinesNavigation;