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
                    const onclickAttr = link.getAttribute('onclick');
                    const tagMatch = onclickAttr.match(/toggleStorylinesTag\\('(.+?)', '\\w+'\\)/);
                    const fullTag = tagMatch ? tagMatch[1] : link.textContent;
                    const strippedTag = stripHiddenPrefix(fullTag);
                    
                    if (selectedTags.has(strippedTag)) {
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

        // Toggle table of contents
        function toggleStorylineTOC(viewType) {
            const tocContent = document.querySelector('.storyline-toc-content');
            const tocToggle = document.querySelector('.storyline-toc-toggle');
            
            if (tocContent && tocToggle) {
                tocContent.classList.toggle('collapsed');
                tocToggle.classList.toggle('expanded');
                tocToggle.textContent = tocContent.classList.contains('collapsed') ? '▶' : '▼';
            }
        }
        
        // Smooth scroll to storyline section
        function scrollToStorylineSection(anchorId) {
            const element = document.getElementById(anchorId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            const subsectionHeaders = viewContainer.querySelectorAll('.storyline-subsection-header');

            // First, handle subsection headers
            subsectionHeaders.forEach(header => {
                const nextGrid = header.nextElementSibling;
                if (nextGrid && nextGrid.classList.contains('storylines-grid')) {
                    const visibleCards = nextGrid.querySelectorAll('.storyline-card:not(.hidden)');
                    
                    if (visibleCards.length > 0) {
                        header.style.display = '';
                        nextGrid.style.display = '';
                    } else {
                        header.style.display = 'none';
                        nextGrid.style.display = 'none';
                    }
                }
            });

            // Then, handle section headers - hide only if ALL their content is hidden
            sectionHeaders.forEach(header => {
                let currentElement = header.nextElementSibling;
                let hasAnyVisibleContent = false;
                
                // Check all grids (main section grid + subsection grids) until next section header
                while (currentElement && !currentElement.classList.contains('storyline-section-header')) {
                    if (currentElement.classList.contains('storylines-grid')) {
                        const visibleCards = currentElement.querySelectorAll('.storyline-card:not(.hidden)');
                        if (visibleCards.length > 0) {
                            hasAnyVisibleContent = true;
                            break;
                        }
                    }
                    currentElement = currentElement.nextElementSibling;
                }
                
                // Show section header if ANY of its grids have visible cards
                if (hasAnyVisibleContent) {
                    header.style.display = '';
                } else {
                    header.style.display = 'none';
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
        window.toggleStorylineTOC = toggleStorylineTOC;
        window.scrollToStorylineSection = scrollToStorylineSection;
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
    
    // Organize storylines into hierarchy: ungrouped, sections with subsections
    const ungroupedStorylines = [];
    const sectionedStorylines = {}; // { sectionName: { noSubsection: [], subsections: { subsectionName: [] } } }

    filteredStorylines.forEach(storyline => {
        const section = (storyline.section || '').trim();
        const subsection = (storyline.subsection || '').trim();
        
        if (!section) {
            // No section at all - completely ungrouped
            ungroupedStorylines.push(storyline);
        } else {
            // Has a section
            if (!sectionedStorylines[section]) {
                sectionedStorylines[section] = {
                    noSubsection: [],
                    subsections: {}
                };
            }
            
            if (!subsection) {
                // Has section but no subsection
                sectionedStorylines[section].noSubsection.push(storyline);
            } else {
                // Has both section and subsection
                if (!sectionedStorylines[section].subsections[subsection]) {
                    sectionedStorylines[section].subsections[subsection] = [];
                }
                sectionedStorylines[section].subsections[subsection].push(storyline);
            }
        }
    });

    // Build HTML: navigation + TOC + grids
    let gridHTML = navigationHTML; // Add navigation first
    
    // Add table of contents if there are sections AND option is enabled
    const showTOC = data.storylinesOptions?.showTOC ?? true;
    if (Object.keys(sectionedStorylines).length > 0 && showTOC) {
        gridHTML += generateStorylineTOC(sectionedStorylines, filterType);
    }
    
    // Start the main grid for ungrouped storylines
    gridHTML += '<div class="storylines-grid" id="storylines-grid-' + filterType + '">';
    
    // Render ungrouped storylines first (no section at all)
    ungroupedStorylines.forEach((storyline, index) => {
        gridHTML += generateStorylineCard(storyline, index);
    });

    // Close the initial grid
    gridHTML += '</div>';

    // Render each section with its subsections
    Object.keys(sectionedStorylines).sort().forEach(sectionName => {
        const sectionData = sectionedStorylines[sectionName];
        
        // Section header (if enabled)
        const showSections = data.storylinesOptions?.showSections ?? true;
        if (showSections) {
            gridHTML += `<div class="storyline-section-header">
                <h3 class="storyline-section-title">${sectionName}</h3>
            </div>`;
        }
        
        // Start a new grid for this section
        const sectionId = sectionName.replace(/\s+/g, '-').toLowerCase();
        gridHTML += '<div class="storylines-grid" id="storylines-grid-' + filterType + '-section-' + sectionId + '">';
        
        // Render storylines in this section with NO subsection first
        sectionData.noSubsection.forEach((storyline, index) => {
            gridHTML += generateStorylineCard(storyline, index);
        });
        
        // Close the section's main grid
        gridHTML += '</div>';
        
        // Now render each subsection within this section
        Object.keys(sectionData.subsections).sort().forEach(subsectionName => {
            // Subsection header (if enabled)
            const showSubsections = data.storylinesOptions?.showSubsections ?? true;
            if (showSubsections) {
                gridHTML += `<div class="storyline-subsection-header">
                    <h4 class="storyline-subsection-title">${subsectionName}</h4>
                </div>`;
            }
            
            // Start a grid for this subsection
            const subsectionId = subsectionName.replace(/\s+/g, '-').toLowerCase();
            gridHTML += '<div class="storylines-grid" id="storylines-grid-' + filterType + '-section-' + sectionId + '-subsection-' + subsectionId + '">';
            
            // Render storylines in this subsection
            sectionData.subsections[subsectionName].forEach((storyline, index) => {
                gridHTML += generateStorylineCard(storyline, index);
            });
            
            // Close subsection grid
            gridHTML += '</div>';
        });
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
            const parsed = parseTagWithColor(tag);
            let styleAttr = '';
            if (parsed.bgColor) {
                const textColor = parsed.textColor || getContrastingTextColor(parsed.bgColor);
                const hoverColor = parsed.hoverColor || parsed.bgColor;
                styleAttr = ` style="background-color: ${parsed.bgColor}; color: ${textColor}; --hover-color: ${hoverColor};"`;
            }
            const escapedTag = tag.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");
            navHTML += `<span class="storylines-tag-link" onclick="toggleStorylinesTag('${escapedTag}', '${viewType}')"${styleAttr}>${parsed.name}</span>`;
        });
        navHTML += '</div>';
    }
    
    navHTML += `
            </div>
        </div>`;
    
    return navHTML;
}

// Generate table of contents for storyline sections
function generateStorylineTOC(sectionedStorylines, filterType) {
    let tocHTML = `
        <div class="storyline-toc">
            <div class="storyline-toc-header" onclick="toggleStorylineTOC('${filterType}')">
                <span class="storyline-toc-title">Table of Contents</span>
                <span class="storyline-toc-toggle">▶</span>
            </div>
            <div class="storyline-toc-content collapsed">
                <ul class="storyline-toc-list">`;
    
    // Sort sections alphabetically
    Object.keys(sectionedStorylines).sort().forEach(sectionName => {
        const sectionData = sectionedStorylines[sectionName];
        const sectionId = sectionName.replace(/\s+/g, '-').toLowerCase();
        const sectionAnchor = `storylines-grid-${filterType}-section-${sectionId}`;
        
        tocHTML += `<li class="storyline-toc-section">
            <a href="#${sectionAnchor}" onclick="scrollToStorylineSection('${sectionAnchor}'); return false;">${sectionName}</a>`;
        
        // Add subsections if they exist
        if (Object.keys(sectionData.subsections).length > 0) {
            tocHTML += '<ul class="storyline-toc-subsections">';
            
            Object.keys(sectionData.subsections).sort().forEach(subsectionName => {
                const subsectionId = subsectionName.replace(/\s+/g, '-').toLowerCase();
                const subsectionAnchor = `storylines-grid-${filterType}-section-${sectionId}-subsection-${subsectionId}`;
                
                tocHTML += `<li class="storyline-toc-subsection">
                    <a href="#${subsectionAnchor}" onclick="scrollToStorylineSection('${subsectionAnchor}'); return false;">${subsectionName}</a>
                </li>`;
            });
            
            tocHTML += '</ul>';
        }
        
        tocHTML += '</li>';
    });
    
    tocHTML += `
                </ul>
            </div>
        </div>`;
    
    return tocHTML;
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