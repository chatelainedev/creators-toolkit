// Updated generateWorldContent function
function generateWorldContent(data) {
    const categories = [
        { key: 'general', title: 'General' },     // ADD THIS LINE
        { key: 'locations', title: 'Locations' },
        { key: 'factions', title: 'Factions' },
        { key: 'culture', title: 'Culture' },
        { key: 'cultivation', title: 'Cultivation' },
        { key: 'concepts', title: 'Concepts' },
        { key: 'events', title: 'Events' },
        { key: 'creatures', title: 'Creatures' },
        { key: 'plants', title: 'Plants' },
        { key: 'items', title: 'Items' }
    ];

    let worldHTML = '<div id="world" class="content">';

    // Check if there's any content (excluding hidden items)
    let hasAnyContent = false;
    let availableCategories = [];
    categories.forEach(category => {
        const items = data.world[category.key];
        if (items && items.length > 0) {
            const visibleItems = items.filter(item => !item.hidden);
            if (visibleItems.length > 0) {
                hasAnyContent = true;
                availableCategories.push(category);
            }
        }
    });

    // Collect all unique VISIBLE tags from all world items
    const allWorldTags = new Set();
    availableCategories.forEach(category => {
        const items = data.world[category.key];
        items.filter(item => !item.hidden).forEach(item => {
            if (item.tags && Array.isArray(item.tags)) {
                const visibleTags = getVisibleTags(item.tags);
                visibleTags.forEach(tag => allWorldTags.add(tag));
            }
        });
    });
    const worldTagsArray = Array.from(allWorldTags).sort();

    if (!hasAnyContent) {
        worldHTML += `
            <h2 class="section-title">World</h2>
            <div class="empty-content">
                <h3>No World Information</h3>
                <p>No world information has been added yet.</p>
            </div>`;
    } else {
        // Header layout
        worldHTML += `
            <div class="world-header">
                <h2 class="section-title">World</h2>
                <div class="world-tabs">`;

        availableCategories.forEach((category, index) => {
            worldHTML += `<button class="world-tab" id="${category.key}-tab" onclick="switchWorldCategory('${category.key}')">${category.title}</button>`;
        });

        worldHTML += `
                </div>
            </div>`;

        // Collapsible navigation with only visible tags
        worldHTML += `
            <div class="world-navigation" id="world-nav">
                <div class="world-nav-header" onclick="toggleWorldNavigation()">
                    <span class="world-nav-title">Filter & Search</span>
                    <span class="world-nav-toggle">&#9654;</span>
                </div>
                <div class="world-nav-content collapsed">
                    <div class="world-filter-controls">
                        <input type="text" class="world-search" id="world-search" placeholder="Search world information...">
                        <select class="status-filter" id="status-filter">
                            <option value="">All Status</option>
                            <option value="idea">Idea</option>
                            <option value="tentative">Tentative</option>
                            <option value="brainstorm">Brainstorm</option>
                            <option value="draft">Draft</option>
                            <option value="in-progress">In Progress</option>
                            <option value="developing">Developing</option>
                            <option value="canon">Canon</option>
                            <option value="established">Established</option>
                            <option value="final">Final</option>
                            <option value="placeholder">Placeholder</option>
                            <option value="needs-work">Needs Work</option>
                            <option value="deprecated">Deprecated</option>
                            <option value="unused">Unused</option>
                            <option value="archived">Archived</option>
                        </select>
                        <div class="world-filter-mode-buttons">
                            <button class="world-filter-mode-option active" id="world-filter-mode-any" onclick="setWorldFilterMode('any')">Any</button>
                            <button class="world-filter-mode-option" id="world-filter-mode-all" onclick="setWorldFilterMode('all')">All</button>
                        </div>
                        <button class="world-clear-selected-btn" id="world-clear-selected-btn" onclick="clearAllWorldTags()">Clear</button>
                    </div>`;

        // Add visible tag links only
        if (worldTagsArray.length > 0) {
            worldHTML += '<div class="world-tag-links">';
            worldTagsArray.forEach(tag => {
                worldHTML += `<div class="world-tag-link" onclick="toggleWorldTag('${tag}')">${tag}</div>`;
            });
            worldHTML += '</div>';
        }

        worldHTML += `
                </div>
            </div>`;

        // Generate content sections
        availableCategories.forEach((category, index) => {
            const items = data.world[category.key];
            const visibleItems = items.filter(item => !item.hidden);
            
            if (visibleItems.length > 0) {
                worldHTML += `<section id="${category.key}" class="world-section" style="display: block;">`;
                worldHTML += `<h3 class="world-category-title">${category.title}</h3>`;
                worldHTML += '<div class="world-items">';

                visibleItems.forEach(item => {
                    worldHTML += generateWorldItem(item, category.key);
                });

                worldHTML += '</div></section>';
            }
        });

        worldHTML += `<button class="back-to-top" id="world-back-to-top" title="Back to top"></button>`;
    }

    worldHTML += '</div>';
    return worldHTML;
}

// Updated generateWorldItem function
function generateWorldItem(item, category) {
    const hasImage = item.image && item.image.trim();
    const itemClass = hasImage ? `world-item has-image ${category}` : `world-item ${category}`;
    
    // Use ALL tags (stripped of "!") for filtering data attributes
    const allTagsStripped = item.tags ? item.tags.map(stripHiddenPrefix).join(',') : '';
    
    let itemHTML = `<div class="${itemClass}" data-category="${category}" data-status="${item.status || ''}" data-tags="${allTagsStripped}">`;    
    
    // IMAGE REMOVED - No longer directly display the image
    
    itemHTML += '<div class="world-item-content">';
    
    // Generate name with status badge AND image indicator
    itemHTML += `<h3 class="item-name">
        <span>${item.name}</span>`;
    
    // Add subtle image indicator if image exists
    if (hasImage) {
        itemHTML += `<span class="image-indicator" 
                           data-image-src="${item.image}" 
                           data-image-alt="${item.name}"></span>`;
    }
    
    // Add status badge if status exists
    if (item.status && item.status.trim()) {
        const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
        const statusDisplay = getStatusDisplayText(item.status);
        itemHTML += `<span class="status-badge ${statusClass}">${statusDisplay}</span>`;
    }
    
    itemHTML += '</h3>';
    
    // Rest of the existing item generation...
    if (item.category || item.type) {
        itemHTML += `<div class="item-type">${item.category || item.type}</div>`;
    }
    
    if (item.description) {
        itemHTML += `<div class="item-description">${parseMarkdown(item.description)}</div>`;
    }
    
    // Handle different field names for different categories
    const featuresContent = item.properties || item.features;
    if (featuresContent) {
        itemHTML += `
            <div class="info-section">
                <div class="item-label">Notable Features:</div>
                <div>${parseMarkdown(featuresContent)}</div>
            </div>`;
    }
    
    if (item.connections) {
        itemHTML += `
            <div class="info-section">
                <div class="item-label">Related Information:</div>
                <div>${parseMarkdown(item.connections)}</div>
            </div>`;
    }
    
    itemHTML += '</div></div>';
    return itemHTML;
}


function getStatusDisplayText(statusValue) {
    const statusMap = {
        'idea': 'Idea',
        'tentative': 'Tentative', 
        'brainstorm': 'Brainstorm',
        'draft': 'Draft',
        'in-progress': 'In Progress',
        'developing': 'Developing',
        'canon': 'Canon',
        'established': 'Established',
        'final': 'Final',
        'placeholder': 'Placeholder',
        'needs-work': 'Needs Work',
        'deprecated': 'Deprecated',
        'unused': 'Unused',
        'archived': 'Archived'
    };
    
    return statusMap[statusValue] || statusValue;
}

function generateWorldFilteringJavascript () {
    return`
            //WORLD Filtering
        // Make toggleWorldNavigation available globally
        window.toggleWorldNavigation = toggleWorldNavigation;
        window.switchWorldCategory = switchWorldCategory;
        
        function toggleWorldNavigation() {
            const content = document.querySelector('.world-nav-content');
            const toggle = document.querySelector('.world-nav-toggle');
            
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
                            
        // Global state for world filtering
        let selectedWorldTags = new Set();
        let worldFilterMode = 'any';


        function switchWorldCategory(categoryKey) {
            // Update tab states
            document.querySelectorAll('.world-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(\`\${categoryKey}-tab\`).classList.add('active');
            
            // Don't hide sections - just scroll to the selected category
            const targetSection = document.getElementById(categoryKey);
            if (targetSection) {
                // Smooth scroll to the section
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }
            
        function toggleWorldTag(tag) {
            if (selectedWorldTags.has(tag)) {
                selectedWorldTags.delete(tag);
            } else {
                selectedWorldTags.add(tag);
            }
            
            updateWorldTagStates();
            updateWorldClearButtonState();
            filterWorldItems();
        }

        function updateWorldTagStates() {
            document.querySelectorAll('.world-tag-link').forEach(link => {
                const tag = link.textContent;
                if (selectedWorldTags.has(tag)) {
                    link.classList.add('selected');
                } else {
                    link.classList.remove('selected');
                }
            });
        }

        function updateWorldClearButtonState() {
            const clearBtn = document.getElementById('world-clear-selected-btn');
            if (clearBtn) {
                if (selectedWorldTags.size > 0) {
                    clearBtn.classList.add('active');
                } else {
                    clearBtn.classList.remove('active');
                }
            }
        }

        function clearAllWorldTags() {
            selectedWorldTags.clear();
            updateWorldTagStates();
            updateWorldClearButtonState();
            filterWorldItems();
        }

        function setWorldFilterMode(mode) {
            worldFilterMode = mode;
            
            // Update UI
            document.querySelectorAll('.world-filter-mode-option').forEach(option => {
                option.classList.remove('active');
            });
            document.getElementById(\`world-filter-mode-\${mode}\`).classList.add('active');
            
            // Reapply filters
            filterWorldItems();
        }

        // Updated world filtering function
        function filterWorldItems() {
            const searchInput = document.getElementById('world-search');
            const statusFilter = document.getElementById('status-filter');
            
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const selectedStatus = statusFilter ? statusFilter.value : '';
            const worldItems = document.querySelectorAll('.world-item');
            
            worldItems.forEach(item => {
                const name = item.querySelector('.item-name')?.textContent.toLowerCase() || '';
                const category = item.getAttribute('data-category') || '';
                const status = item.getAttribute('data-status') || '';
                const tagsData = item.getAttribute('data-tags') || '';
                const textContent = item.textContent.toLowerCase();
                
                // Search filter
                const matchesSearch = searchTerm === '' || 
                    name.includes(searchTerm) || 
                    category.includes(searchTerm) || 
                    status.includes(searchTerm) ||
                    tagsData.toLowerCase().includes(searchTerm) ||
                    textContent.includes(searchTerm);
                    
                // Status filter
                const matchesStatus = selectedStatus === '' || status === selectedStatus;
                
                // Tag filter
                let matchesTags = true;
                if (selectedWorldTags.size > 0) {
                    // Tags in data attribute are already stripped of "!" prefix
                    const itemTags = tagsData.toLowerCase().split(',').filter(tag => tag.trim());
                    const selectedTagsLower = Array.from(selectedWorldTags).map(tag => tag.toLowerCase());
                    
                    if (worldFilterMode === 'all') {
                        // Item must have ALL selected tags
                        matchesTags = selectedTagsLower.every(selectedTag => 
                            itemTags.some(itemTag => itemTag.includes(selectedTag))
                        );
                    } else {
                        // Item must have ANY selected tag (default)
                        matchesTags = selectedTagsLower.some(selectedTag => 
                            itemTags.some(itemTag => itemTag.includes(selectedTag))
                        );
                    }
                }
                
                // Show/hide item
                if (matchesSearch && matchesStatus && matchesTags) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Update section visibility
            // Update section visibility - simplified version
            const sections = document.querySelectorAll('.world-section');
            sections.forEach(section => {
                const visibleItems = section.querySelectorAll('.world-item:not(.hidden)');
                if (visibleItems.length > 0) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }

        // Make world filtering functions globally available
        window.toggleWorldTag = toggleWorldTag;
        window.clearAllWorldTags = clearAllWorldTags;
        window.setWorldFilterMode = setWorldFilterMode;
        window.selectedWorldTags = selectedWorldTags;
    `;
}

function generateWorldImageJavascript () {
    return`
    // Initialize gallery mode functionality
function initializeGalleryMode() {
    // Create preview image element (reused for all hovers)
    const previewImg = document.createElement('img');
    previewImg.className = 'image-preview';
    previewImg.style.display = 'none';
    document.body.appendChild(previewImg);
    
    // Add event listeners to all image indicators
    document.addEventListener('mouseover', handleImageIndicatorHover);
    document.addEventListener('mouseout', handleImageIndicatorOut);
    document.addEventListener('mousemove', handleImageIndicatorMove);
    document.addEventListener('click', handleImageIndicatorClick);
}

function handleImageIndicatorHover(e) {
    if (!e.target.classList.contains('image-indicator')) return;
    
    const previewImg = document.querySelector('.image-preview');
    const imageSrc = e.target.getAttribute('data-image-src');
    const imageAlt = e.target.getAttribute('data-image-alt');
    
    if (previewImg && imageSrc) {
        previewImg.src = imageSrc;
        previewImg.alt = imageAlt;
        previewImg.style.display = 'block';
        
        // Position the preview image
        positionPreviewImage(e, previewImg);
        
        // Show with animation
        requestAnimationFrame(() => {
            previewImg.classList.add('visible');
        });
    }
}

function handleImageIndicatorOut(e) {
    if (!e.target.classList.contains('image-indicator')) return;
    
    const previewImg = document.querySelector('.image-preview');
    if (previewImg) {
        previewImg.classList.remove('visible');
        setTimeout(() => {
            previewImg.style.display = 'none';
        }, 200);
    }
}

function handleImageIndicatorMove(e) {
    if (!e.target.classList.contains('image-indicator')) return;
    
    const previewImg = document.querySelector('.image-preview');
    if (previewImg && previewImg.classList.contains('visible')) {
        positionPreviewImage(e, previewImg);
    }
}

function handleImageIndicatorClick(e) {
    if (!e.target.classList.contains('image-indicator')) return;
    
    e.preventDefault();
    const imageSrc = e.target.getAttribute('data-image-src');
    const imageAlt = e.target.getAttribute('data-image-alt');
    
    if (imageSrc) {
        // Use existing modal system
        openImageModal(imageSrc, imageAlt);
    }
}

function positionPreviewImage(e, previewImg) {
    const buffer = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let x = e.pageX + buffer;
    let y = e.pageY + buffer;
    
    // Adjust if preview would go off screen
    if (x + 120 + buffer > viewportWidth) {
        x = e.pageX - 120 - buffer;
    }
    if (y + 120 + buffer > viewportHeight) {
        y = e.pageY - 120 - buffer;
    }
    
    previewImg.style.left = x + 'px';
    previewImg.style.top = y + 'px';
}
    `;
}

// Make functions globally available
window.generateWorldContent = generateWorldContent;
window.generateWorldItem = generateWorldItem;
window.getStatusDisplayText = getStatusDisplayText;
window.generateWorldFilteringJavascript = generateWorldFilteringJavascript;
window.generateWorldImageJavascript = generateWorldImageJavascript;