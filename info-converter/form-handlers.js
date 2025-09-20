// Modal management functions
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Handle z-index for nested modals
        if (modalId === 'eventModal') {
            // Check if we're opening from within another modal
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            if (openModals.length > 1) {
                // We have nested modals, increase z-index
                modal.style.zIndex = '2000';
            }
        } else if (modalId === 'imageImportModal') {
            // Image import modal should be on top of everything
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            if (openModals.length > 1) {
                // If there are already modals open, put this on top
                modal.style.zIndex = '3000';
            }
        }
    }
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.style.zIndex = ''; // Reset z-index
        document.body.style.overflow = ''; // Restore scrolling
        clearModalFields(modalId);
        
        // Reset editing state ONLY for specific modals to avoid conflicts with nested modals
        if (modalId === 'characterModal') {
            editingIndex = -1;
            editingType = '';
            editingCategory = '';
        } else if (modalId === 'storylineModal') {
            editingIndex = -1;
            editingType = '';
            editingCategory = '';
        } else if (modalId === 'planModal') {
            editingIndex = -1;
            editingType = '';
            editingCategory = '';
            currentEditingEvents = []; // Reset the working copy
            currentEditingSubArcs = []; // Reset sub-arcs working copy
            currentEditingSubArcEvents = []; // Reset sub-arc events working copy
        } else if (modalId === 'locationModal') {
            editingIndex = -1;
            editingType = '';
            editingCategory = '';
        } else if (modalId === 'worldItemModal') {
            editingIndex = -1;
            editingType = '';
            editingCategory = '';
        }
        
        // IMPORTANT: Reset event editing state when closing the event modal
        if (modalId === 'eventModal') {
            editingEventIndex = -1;
            editingEventContext = 'main';
            currentEditingSubevents = []; // Clear character moments
            editingSubeventIndex = -1;   // Reset subevent editing index
        }
        
        // Reset sub-arc editing state when closing sub-arc modal
        if (modalId === 'subArcModal') {
            editingSubArcIndex = -1;
            currentEditingSubArcEvents = []; // Reset working copy
        }
    }
}

function clearModalFields(modalId) {
    const modal = document.getElementById(modalId);
    const inputs = modal.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = input.id === 'event-visible' || input.id === 'subarc-visible'; // Default visibility to true
        } else {
            input.value = '';
        }
    });
    
    // Reset select elements too
    const selects = modal.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);
    
    // Clear events list if it's the plan modal
    if (modalId === 'planModal') {
        const eventsContainer = document.getElementById('events-list-container');
        if (eventsContainer) {
            eventsContainer.innerHTML = '<div class="empty-state">No events added yet</div>';
        }
        
        const subArcsContainer = document.getElementById('subarcs-list-container');
        if (subArcsContainer) {
            subArcsContainer.innerHTML = '<div class="empty-state">No sub-arcs added yet</div>';
        }
    }
    
    // Clear sub-arc events list if it's the sub-arc modal
    if (modalId === 'subArcModal') {
        const subArcEventsContainer = document.getElementById('subarc-events-list-container');
        if (subArcEventsContainer) {
            subArcEventsContainer.innerHTML = '<div class="empty-state">No events added yet</div>';
        }
    }
}

// Playlist modal functions
function openPlaylistModal(playlistData = null) {
    const modalTitle = document.getElementById('playlist-modal-title');
    
    if (playlistData) {
        modalTitle.textContent = 'Edit Playlist';
        populatePlaylistModal(playlistData);
    } else {
        modalTitle.textContent = 'Add Playlist';
        clearModalFields('playlistModal');
    }
    
    openModal('playlistModal');
    setupPlaylistTagAutocomplete();
}

function populatePlaylistModal(playlist) {
    document.getElementById('playlist-title').value = playlist.title || '';
    document.getElementById('playlist-spotify-url').value = playlist.spotifyUrl || '';
    document.getElementById('playlist-tags').value = (playlist.tags || []).join(', ');
    document.getElementById('playlist-description').value = playlist.description || '';
}

function savePlaylist() {
    const playlistData = {
        title: document.getElementById('playlist-title').value.trim(),
        spotifyUrl: document.getElementById('playlist-spotify-url').value.trim(),
        tags: document.getElementById('playlist-tags').value.trim()
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0),
        description: document.getElementById('playlist-description').value.trim()
    };

    // Validation
    if (!playlistData.title) {
        alert('Playlist title is required!');
        return;
    }

    if (!playlistData.spotifyUrl) {
        alert('Spotify URL is required!');
        return;
    }

    if (editingIndex >= 0 && editingType === 'playlist') {
        infoData.playlists[editingIndex] = playlistData;
    } else {
        infoData.playlists.push(playlistData);
    }

    updateContentList('playlists');
    closeModal('playlistModal');
    markDataAsModified();
}

// Setup character tag autocomplete for playlists
function setupPlaylistTagAutocomplete() {
    const input = document.getElementById('playlist-tags');
    if (!input) return;
    
    // Get all character names for autocomplete
    const characterNames = infoData.characters.map(char => char.name).filter(name => name);
    
    // Simple autocomplete implementation - you can enhance this later
    input.addEventListener('input', function(e) {
        const value = e.target.value;
        const lastComma = value.lastIndexOf(',');
        
        if (lastComma > -1) {
            const currentTag = value.substring(lastComma + 1).trim();
            // Add autocomplete suggestions logic here if needed
        }
    });


}

function setupCharacterColorInputs() {
    const colorText = document.getElementById('char-color');
    const colorPicker = document.getElementById('char-color-picker');
    
    if (colorText && colorPicker) {
        // Sync picker to text input
        colorText.addEventListener('input', () => {
            const color = colorText.value.trim();
            if (window.isValidHexColor(color)) {
                colorPicker.value = color;
            }
        });
        
        // Sync text input to picker
        colorPicker.addEventListener('input', () => {
            colorText.value = colorPicker.value;
        });
    }
}

// Update openCharacterModal to set up color inputs
function openCharacterModal(characterData = null) {
    const modalTitle = document.getElementById('character-modal-title');
    
    if (characterData) {
        modalTitle.textContent = 'Edit Character';
        populateCharacterModal(characterData);
    } else {
        modalTitle.textContent = 'Add Character';
        clearModalFields('characterModal');
        // Set default color for new characters
        document.getElementById('char-color').value = '#6c757d';
        document.getElementById('char-color-picker').value = '#6c757d';
    }
    
    openModal('characterModal');
    
    // Set up color input synchronization
    setupCharacterColorInputs();
}

function populateCharacterModal(character) {
    document.getElementById('char-name').value = character.name || '';
    document.getElementById('char-image').value = character.image || '';
    document.getElementById('char-tags').value = (character.tags || []).join(', ');
    document.getElementById('char-color').value = character.color || '#6c757d'; // NEW
    document.getElementById('char-color-picker').value = character.color || '#6c757d'; // NEW
    document.getElementById('char-basic').value = character.basic || '';
    document.getElementById('char-physical').value = character.physical || '';
    document.getElementById('char-personality').value = character.personality || '';
    document.getElementById('char-sexuality').value = character.sexuality || '';
    document.getElementById('char-fighting-style').value = character.fightingStyle || '';
    document.getElementById('char-background').value = character.background || '';
    document.getElementById('char-equipment').value = character.equipment || '';
    document.getElementById('char-hobbies').value = character.hobbies || '';
    document.getElementById('char-quirks').value = character.quirks || '';
    document.getElementById('char-relationships').value = character.relationships || '';
    document.getElementById('char-notes').value = character.notes || '';
    document.getElementById('char-gallery').value = (character.gallery || []).join('\n');
}

// MODIFY YOUR form-handlers.js file
function saveCharacter() {
    const characterData = {
        name: document.getElementById('char-name').value.trim(),
        image: document.getElementById('char-image').value.trim(),
        tags: document.getElementById('char-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag),
        color: document.getElementById('char-color').value || '#6c757d', // NEW
        basic: document.getElementById('char-basic').value.trim(),
        physical: document.getElementById('char-physical').value.trim(),
        personality: document.getElementById('char-personality').value.trim(),
        sexuality: document.getElementById('char-sexuality').value.trim(),
        fightingStyle: document.getElementById('char-fighting-style').value.trim(),
        background: document.getElementById('char-background').value.trim(),
        equipment: document.getElementById('char-equipment').value.trim(),
        hobbies: document.getElementById('char-hobbies').value.trim(),
        quirks: document.getElementById('char-quirks').value.trim(),
        relationships: document.getElementById('char-relationships').value.trim(),
        notes: document.getElementById('char-notes').value.trim(),
        gallery: document.getElementById('char-gallery').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line),
        
        id: (editingIndex >= 0 && editingType === 'character') ?
            infoData.characters[editingIndex].id || generateNextCharacterId() : 
            generateNextCharacterId()
    };

    // Validation
    if (!characterData.name) {
        alert('Character name is required!');
        return;
    }

    if (editingIndex >= 0 && editingType === 'character') {
        infoData.characters[editingIndex] = characterData;
    } else {
        infoData.characters.push(characterData);
    }

    updateContentList('characters');
    closeModal('characterModal');
    markDataAsModified();
}

// ADD this helper function at the bottom of form-handlers.js:
function generateNextCharacterId() {
    // Get existing character IDs
    const existingIds = infoData.characters
        ?.filter(char => char.id)
        .map(char => parseInt(char.id.replace('char_', '')))
        .filter(id => !isNaN(id)) || [];
    
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return `char_${String(maxId + 1).padStart(3, '0')}`;
}

// Storyline modal functions
function openStorylineModal(storylineData = null) {
    const modalTitle = document.getElementById('storyline-modal-title');
    
    if (storylineData) {
        modalTitle.textContent = 'Edit Storyline';
        populateStorylineModal(storylineData);
    } else {
        modalTitle.textContent = 'Add Storyline';
        clearModalFields('storylineModal');
    }
    
    openModal('storylineModal');
}

function populateStorylineModal(storyline) {
    document.getElementById('story-title').value = storyline.title || '';
    document.getElementById('story-pairing').value = storyline.pairing || '';
    document.getElementById('story-type').value = storyline.type || 'roleplay';
    document.getElementById('story-section').value = storyline.section || '';
    document.getElementById('story-tags').value = (storyline.tags || []).join(', ');
    document.getElementById('story-wordcount').value = storyline.wordcount || '';
    document.getElementById('story-last-updated').value = storyline.lastUpdated || '';
    document.getElementById('story-description').value = storyline.description || '';
    
    // NEW: Handle project link checkbox and link processing
    const isProjectLink = storyline.isProjectLink || false;
    const linkInput = document.getElementById('story-link');
    const projectCheckbox = document.getElementById('story-is-project-link');
    
    projectCheckbox.checked = isProjectLink;
    
    if (isProjectLink) {
        // Show just the filename if it's a project link
        linkInput.value = storyline.link ? storyline.link.replace('roleplays/', '') : '';
        linkInput.placeholder = 'story-title.html';
    } else {
        // Show full URL for external links
        linkInput.value = storyline.link || '';
        linkInput.placeholder = 'https://archiveofourown.org/works/123456';
    }
}

function saveStoryline() {
    // Collect tags from form field
    const tagsInput = document.getElementById('story-tags').value.trim();
    const tags = tagsInput ? 
        tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    // NEW: Get checkbox state and process link accordingly
    const isProjectLink = document.getElementById('story-is-project-link').checked;
    const rawLink = document.getElementById('story-link').value.trim();
    
    // Process the link based on checkbox state
    let processedLink = '';
    if (rawLink) {
        if (isProjectLink) {
            // For project links, ensure it doesn't already have roleplays/ prefix
            processedLink = rawLink.startsWith('roleplays/') ? rawLink.replace('roleplays/', '') : rawLink;
        } else {
            // For external links, use as-is
            processedLink = rawLink;
        }
    }

    const storylineData = {
        title: document.getElementById('story-title').value.trim(),
        pairing: document.getElementById('story-pairing').value.trim(),
        type: document.getElementById('story-type').value,
        section: document.getElementById('story-section').value.trim(),
        tags: tags,
        wordcount: parseInt(document.getElementById('story-wordcount').value) || 0,
        lastUpdated: document.getElementById('story-last-updated').value.trim(),
        link: processedLink,
        isProjectLink: isProjectLink, // NEW: Save the checkbox state
        description: document.getElementById('story-description').value.trim()
    };

    // Validation
    if (!storylineData.title) {
        alert('Storyline title is required!');
        return;
    }

    // NEW: Additional validation for project links
    if (isProjectLink && processedLink && !processedLink.endsWith('.html')) {
        if (!confirm('Project link doesn\'t end with .html. Continue anyway?')) {
            return;
        }
    }

    if (editingIndex >= 0 && editingType === 'storyline') {
        infoData.storylines[editingIndex] = storylineData;
    } else {
        infoData.storylines.push(storylineData);
    }

    updateContentList('storylines');
    closeModal('storylineModal');
    markDataAsModified();
}

// Event drag and drop functionality (updated to handle contexts)
function initializeEventDragDrop(container) {
    const eventItems = container.querySelectorAll('.event-item');
    
    eventItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            container.classList.add('dragging');
            
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.outerHTML);
        });

        item.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
            container.classList.remove('dragging');
            
            const allItems = container.querySelectorAll('.event-item');
            allItems.forEach(item => item.classList.remove('drag-over'));
            
            // Update event order after drag ends
            updateEventOrder(container);
            
            draggedElement = null;
        });

        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const siblings = container.querySelectorAll('.event-item');
            siblings.forEach(sibling => sibling.classList.remove('drag-over'));

            if (this !== draggedElement) {
                this.classList.add('drag-over');
            }
        });

        item.addEventListener('drop', function(e) {
            e.preventDefault();
            
            if (this !== draggedElement && draggedElement) {
                const rect = this.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    container.insertBefore(draggedElement, this);
                } else {
                    container.insertBefore(draggedElement, this.nextSibling);
                }
            }
            
            this.classList.remove('drag-over');
        });
    });

    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (e.target === container && draggedElement) {
            container.appendChild(draggedElement);
        }
    });
}

function updateEventOrder(container) {
    // Get the current visual order from DOM
    const eventItems = container.querySelectorAll('.event-item');
    const newOrder = [];
    
    // Determine which context we're updating
    const firstItem = eventItems[0];
    const context = firstItem ? firstItem.getAttribute('data-context') : 'main';
    
    // Get original events based on context
    let originalEvents = [];
    if (context === 'subarc') {
        originalEvents = currentEditingSubArcEvents;
    } else {
        originalEvents = currentEditingEvents;
    }
    
    eventItems.forEach(item => {
        const originalIndex = parseInt(item.getAttribute('data-index'));
        if (originalEvents[originalIndex]) {
            newOrder.push(originalEvents[originalIndex]);
        }
    });
    
    // Update the appropriate events array
    if (context === 'subarc') {
        currentEditingSubArcEvents = newOrder;
        updateSubArcEventsListInModal(newOrder);
    } else {
        currentEditingEvents = newOrder;
        updateEventsListInModal(newOrder);
    }

    markDataAsModified();
}

// Location modal functions
function openLocationModal(locationData = null) {
    const modalTitle = document.getElementById('location-modal-title');
    
    if (locationData) {
        modalTitle.textContent = 'Edit Location';
        populateLocationModal(locationData);
    } else {
        modalTitle.textContent = 'Add Location';
        clearModalFields('locationModal');
    }
    
    openModal('locationModal');
}

function populateLocationModal(location) {
    document.getElementById('loc-name').value = location.name || '';
    document.getElementById('loc-type').value = location.type || '';
    document.getElementById('loc-status').value = location.status || '';
    document.getElementById('loc-tags').value = (location.tags || []).join(', ');
    document.getElementById('loc-hidden').checked = location.hidden || false;
    document.getElementById('loc-image').value = location.image || '';
    document.getElementById('loc-description').value = location.description || '';
    document.getElementById('loc-features').value = location.features || '';
    document.getElementById('loc-connections').value = location.connections || '';
}

function saveLocation() {
    const locationData = {
        name: document.getElementById('loc-name').value.trim(),
        type: document.getElementById('loc-type').value.trim(),
        status: document.getElementById('loc-status').value.trim(),
        hidden: document.getElementById('loc-hidden').checked,
        tags: document.getElementById('loc-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag),
        image: document.getElementById('loc-image').value.trim(),
        description: document.getElementById('loc-description').value.trim(),
        features: document.getElementById('loc-features').value.trim(),
        connections: document.getElementById('loc-connections').value.trim()
    };
    // Validation
    if (!locationData.name) {
        alert('Location name is required!');
        return;
    }

    if (editingIndex >= 0 && editingType === 'location') {
        infoData.world.locations[editingIndex] = locationData;
    } else {
        infoData.world.locations.push(locationData);
    }

    updateContentList('locations');
    closeModal('locationModal');
    markDataAsModified();
}

// Generic world item modal functions
function openWorldItemModal(itemData = null, category) {
    const modalTitle = document.getElementById('world-item-modal-title');
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1, -1); // Capitalize and remove 's'
    
    if (itemData) {
        modalTitle.textContent = `Edit ${categoryName}`;
        populateWorldItemModal(itemData);
    } else {
        modalTitle.textContent = `Add ${categoryName}`;
        clearModalFields('worldItemModal');
    }
    
    // Update labels based on category
    const propertiesLabel = document.querySelector('label[for="item-properties"]');
    if (category === 'locations') {
        propertiesLabel.textContent = 'Notable Features:';
        document.getElementById('item-properties').placeholder = 'Important landmarks, characteristics, points of interest, etc.';
    } else {
        propertiesLabel.textContent = 'Properties/Characteristics:';
        document.getElementById('item-properties').placeholder = 'Special properties, abilities, characteristics, etc.';
    }
    
    // Store the category for saving
    editingCategory = category;
    openModal('worldItemModal');
}

function populateWorldItemModal(item) {
    document.getElementById('item-name').value = item.name || '';
    document.getElementById('item-category').value = item.category || item.type || '';
    document.getElementById('item-status').value = item.status || '';
    document.getElementById('item-tags').value = (item.tags || []).join(', ');
    document.getElementById('item-hidden').checked = item.hidden || false;
    document.getElementById('item-image').value = item.image || '';
    document.getElementById('item-description').value = item.description || '';
    
    // Handle different field names for different categories
    if (editingCategory === 'locations') {
        document.getElementById('item-properties').value = item.features || '';
        document.getElementById('item-connections').value = item.connections || '';
    } else {
        document.getElementById('item-properties').value = item.properties || item.characteristics || '';
        document.getElementById('item-connections').value = item.connections || item.related || '';
    }
}

function saveWorldItem() {
    const itemData = {
        name: document.getElementById('item-name').value.trim(),
        image: document.getElementById('item-image').value.trim(),
        description: document.getElementById('item-description').value.trim(),
        status: document.getElementById('item-status').value.trim(),
        hidden: document.getElementById('item-hidden').checked,
        tags: document.getElementById('item-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag)
    };

    // Handle different field names for different categories
    if (editingCategory === 'locations') {
        itemData.type = document.getElementById('item-category').value.trim();
        itemData.features = document.getElementById('item-properties').value.trim();
        itemData.connections = document.getElementById('item-connections').value.trim();
    } else {
        itemData.category = document.getElementById('item-category').value.trim();
        itemData.properties = document.getElementById('item-properties').value.trim();
        itemData.connections = document.getElementById('item-connections').value.trim();
    }

    // Validation
    // Validation
    if (!itemData.name) {
        alert('Item name is required!');
        return;
    }

    // Ensure the category exists in the world data
    if (!infoData.world[editingCategory]) {
        infoData.world[editingCategory] = [];
    }

    if (editingIndex >= 0 && editingType === 'worldItem') {
        infoData.world[editingCategory][editingIndex] = itemData;
    } else {
        infoData.world[editingCategory].push(itemData);
    }

    updateContentList(editingCategory);
    closeModal('worldItemModal');
    markDataAsModified();
}

// Add functions for each content type
window.addCharacter = function() {
    editingIndex = -1;
    editingType = 'character';
    openCharacterModal();
}

window.addStoryline = function() {
    editingIndex = -1;
    editingType = 'storyline';
    openStorylineModal();
}

window.addPlan = function() {
    editingIndex = -1;
    editingType = 'plan';
    openPlanModal();
}

window.addGeneral = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'general';
    openWorldItemModal(null, 'general');
}

window.addLocation = function() {
    editingIndex = -1;
    editingType = 'location';
    openLocationModal();
}

window.addConcept = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'concepts';
    openWorldItemModal(null, 'concepts');
}

window.addEvent = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'events';
    openWorldItemModal(null, 'events');
}

window.addCreature = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'creatures';
    openWorldItemModal(null, 'creatures');
}

window.addPlant = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'plants';
    openWorldItemModal(null, 'plants');
}

window.addItem = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'items';
    openWorldItemModal(null, 'items');
}

window.addFaction = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'factions';
    openWorldItemModal(null, 'factions');
}

window.addCulture = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'culture';
    openWorldItemModal(null, 'culture');
}

window.addCultivation = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'cultivation';
    openWorldItemModal(null, 'cultivation');
}

// Collapsible section functionality
function toggleCollapsible(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        icon.classList.remove('collapsed');
        icon.textContent = '▼';
    } else {
        content.classList.add('collapsed');
        icon.classList.add('collapsed');
        icon.textContent = '▶';
    }
}

// Sub-tab functionality (Generate/Preview)
window.switchSubTab = function(tabName) {
    // Remove active class from sub-tabs only (scope to the .tabs container)
    document.querySelectorAll('.tabs .tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab
    const activeTab = document.querySelector(`.tabs [data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`${tabName}-content-inner`);
    
    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeContent.classList.add('active');
        
        // If switching to preview, update it
        if (tabName === 'preview') {
            const html = document.getElementById('html-output').value;
            if (html) {
                updatePreview(html);
            }
        }
    }
}

// Legacy tab functionality (keeping for compatibility)
window.switchTab = function(tabName) {
    switchSubTab(tabName);
}

// Content management functions
function addDragListeners(element, container) {
    element.addEventListener('dragstart', function(e) {
        draggedElement = this;
        this.classList.add('dragging');
        container.classList.add('dragging');
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    });

    element.addEventListener('dragend', function(e) {
        this.classList.remove('dragging');
        container.classList.remove('dragging');
        
        const allItems = container.querySelectorAll('.content-item');
        allItems.forEach(item => item.classList.remove('drag-over'));
        
        // Update data order after drag ends
        updateDataOrder(container);
        
        draggedElement = null;
    });

    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const siblings = container.querySelectorAll('.content-item');
        siblings.forEach(sibling => sibling.classList.remove('drag-over'));

        if (this !== draggedElement) {
            this.classList.add('drag-over');
        }
    });

    element.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (this !== draggedElement && draggedElement) {
            const rect = this.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            if (e.clientY < midpoint) {
                container.insertBefore(draggedElement, this);
            } else {
                container.insertBefore(draggedElement, this.nextSibling);
            }
        }
        
        this.classList.remove('drag-over');
    });

    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        
        if (e.target === container && draggedElement) {
            container.appendChild(draggedElement);
        }
    });
}

function updateDataOrder(container) {
    // Get the category from the container ID
    const containerId = container.id;
    const category = containerId.replace('-list', '');
    
    // Get current data array
    let dataArray;
    if (category === 'characters') {
        dataArray = infoData.characters;
    } else if (category === 'storylines') {
        dataArray = infoData.storylines;
    } else if (category === 'plans') {
        dataArray = infoData.plans;
    } else {
        dataArray = infoData.world[category];
    }
    
    // Get the current visual order from DOM
    const contentItems = container.querySelectorAll('.content-item');
    const newOrder = [];
    
    contentItems.forEach(item => {
        // Extract the index from the edit button onclick attribute
        const editButton = item.querySelector('.btn-edit');
        if (editButton) {
            const onclickAttr = editButton.getAttribute('onclick');
            const indexMatch = onclickAttr.match(/editItem\(['"](.+?)['"],\s*(\d+)\)/);
            if (indexMatch) {
                const originalIndex = parseInt(indexMatch[2]);
                newOrder.push(dataArray[originalIndex]);
            }
        }
    });
    
    // Update the data array with the new order
    if (category === 'characters') {
        infoData.characters = newOrder;
    } else if (category === 'storylines') {
        infoData.storylines = newOrder;
    } else if (category === 'plans') {
        infoData.plans = newOrder;
    } else {
        infoData.world[category] = newOrder;
    }
    
    // Refresh the content list to update button indices
    updateContentList(category);
}

function createContentItem(name, type, index, category) {
    const item = document.createElement('div');
    item.className = 'content-item';
    item.draggable = true;
    
    // Get the actual data to check if it's hidden
    let itemData;
    if (category === 'characters') {
        itemData = infoData.characters[index];
    } else if (category === 'storylines') {
        itemData = infoData.storylines[index];
    } else if (category === 'plans') {
        itemData = infoData.plans[index];
    } else if (category === 'playlists') {  // ADD THIS
        itemData = infoData.playlists[index];
    } else {
        itemData = infoData.world[category][index];
    }
    
    // Add hidden class if item is hidden
    if (itemData && itemData.hidden) {
        item.classList.add('hidden-item');
    }
    
    const typeDisplay = type ? ` (${type})` : '';
    const hiddenBadge = (itemData && itemData.hidden) ? '<span class="hidden-badge">Hidden</span>' : '';
    
    // For plans, show event count and sub-arc count
    let extraInfo = '';
    if (category === 'plans' && itemData) {
        const mainEvents = itemData.events ? itemData.events.length : 0;
        const visibleMainEvents = itemData.events ? itemData.events.filter(event => event.visible !== false).length : 0;
        
        const subArcs = itemData.subArcs ? itemData.subArcs.length : 0;
        const visibleSubArcs = itemData.subArcs ? itemData.subArcs.filter(arc => arc.visible !== false).length : 0;
        
        let totalSubArcEvents = 0;
        let totalVisibleSubArcEvents = 0;
        
        if (itemData.subArcs) {
            itemData.subArcs.forEach(subArc => {
                if (subArc.events) {
                    totalSubArcEvents += subArc.events.length;
                    totalVisibleSubArcEvents += subArc.events.filter(event => event.visible !== false).length;
                }
            });
        }
        
        const totalEvents = mainEvents + totalSubArcEvents;
        const totalVisibleEvents = visibleMainEvents + totalVisibleSubArcEvents;
        
        extraInfo = ` <span class="event-count">(${totalVisibleEvents}/${totalEvents} events`;
        if (subArcs > 0) {
            extraInfo += `, ${visibleSubArcs}/${subArcs} sub-arcs`;
        }
        extraInfo += ')</span>';
    }
    
    item.innerHTML = `
        <div style="display: flex; align-items: center; flex: 1;">
            <span class="content-item-name">${name || 'Unnamed Item'}</span>
            <span class="content-item-type">${typeDisplay}</span>
            ${extraInfo}
            ${hiddenBadge}
        </div>
        <div class="content-item-actions">
            <button class="btn-small btn-edit" onclick="editItem('${category}', ${index})">Edit</button>
            <button class="btn-small btn-delete" onclick="deleteItem('${category}', ${index})">Delete</button>
        </div>
    `;
    
    return item;
}

window.updateContentList = function(category) {
    const container = document.getElementById(`${category}-list`);
    let items;
    
    if (category === 'characters') {
        items = infoData.characters;
    } else if (category === 'storylines') {
        items = infoData.storylines;
    } else if (category === 'plans') {
        items = infoData.plans;
    } else if (category === 'playlists') {  // ADD THIS
        items = infoData.playlists;
    } else {
        // Ensure the category exists before accessing it
        if (!infoData.world[category]) {
            infoData.world[category] = [];
        }
        items = infoData.world[category];
    }

    if (items.length === 0) {
        const emptyText = category === 'plans' ? 'No story arcs added yet' : `No ${category} added yet`;
        container.innerHTML = `<div class="empty-state">${emptyText}</div>`;
        return;
    }

    container.innerHTML = '';
    items.forEach((item, index) => {
        const name = item.name || item.title || 'Unnamed Item';
        // Handle different type field names for different categories
        let type = '';
        if (category === 'locations') {
            type = item.type || '';
        } else if (category === 'storylines') {
            type = item.pairing || '';
        } else if (category === 'plans') {
            type = '';
        } else {
            type = item.category || '';
        }
        
        const contentItem = createContentItem(name, type, index, category);
        
        // Add drag and drop functionality
        addDragListeners(contentItem, container);
        
        container.appendChild(contentItem);
    });
}

window.editItem = function(category, index) {
    editingIndex = index;
    editingCategory = category;
    
    if (category === 'characters') {
        editingType = 'character';
        openCharacterModal(infoData.characters[index]);
    } else if (category === 'storylines') {
        editingType = 'storyline';
        openStorylineModal(infoData.storylines[index]);
    } else if (category === 'plans') {
        editingType = 'plan';
        openPlanModal(infoData.plans[index]);
    } else if (category === 'playlists') {  // ADD THIS BLOCK
        editingType = 'playlist';
        openPlaylistModal(infoData.playlists[index]);
    } else if (category === 'locations') {
        editingType = 'location';
        openLocationModal(infoData.world.locations[index]);
    } else {
        editingType = 'worldItem';
        openWorldItemModal(infoData.world[category][index], category);
    }
}

window.deleteItem = function(category, index) {
    let itemName;
    
    if (category === 'characters') {
        itemName = infoData.characters[index]?.name;
    } else if (category === 'storylines') {
        itemName = infoData.storylines[index]?.title;
    } else if (category === 'plans') {
        itemName = infoData.plans[index]?.title;
    } else if (category === 'playlists') {  // ADD THIS LINE
        itemName = infoData.playlists[index]?.title;
    } else {
        itemName = infoData.world[category][index]?.name;
    }
    
    if (confirm(`Are you sure you want to delete "${itemName || 'this item'}"?`)) {
        if (category === 'characters') {
            infoData.characters.splice(index, 1);
        } else if (category === 'storylines') {
            infoData.storylines.splice(index, 1);
        } else if (category === 'plans') {
            infoData.plans.splice(index, 1);
        } else if (category === 'playlists') {  // ADD THIS BLOCK
            infoData.playlists.splice(index, 1);
        } else {
            infoData.world[category].splice(index, 1);
        }
        updateContentList(category);
    }
}

// Form data collection - NOW INCLUDES SUBARCS
window.collectFormData = function() {
    // Update basic information from form - WITH NULL CHECKS
    const worldTitleElement = document.getElementById('world-title');
    infoData.basic.title = worldTitleElement ? worldTitleElement.value.trim() : '';
    
    const worldSubtitleElement = document.getElementById('world-subtitle');
    infoData.basic.subtitle = worldSubtitleElement ? worldSubtitleElement.value.trim() : '';
    
    const bannerImageElement = document.getElementById('banner-image');
    infoData.basic.banner = bannerImageElement ? bannerImageElement.value.trim() : '';
    
    const overviewTitleElement = document.getElementById('overview-title');
    infoData.basic.overviewTitle = overviewTitleElement ? overviewTitleElement.value.trim() : '';
    
    const overviewTextElement = document.getElementById('overview-text');
    infoData.basic.overview = overviewTextElement ? overviewTextElement.value.trim() : '';
    
    const overviewImageElement = document.getElementById('overview-image');
    infoData.basic.overviewImage = overviewImageElement ? overviewImageElement.value.trim() : '';
    
    const backgroundColorElement = document.getElementById('background-color');
    infoData.basic.backgroundColor = backgroundColorElement ? backgroundColorElement.value.trim() : '';
    
    const backgroundImageElement = document.getElementById('background-image');
    infoData.basic.backgroundImage = backgroundImageElement ? backgroundImageElement.value.trim() : '';
    
    // Rest of the function stays the same - these already use optional chaining
    infoData.basic.mainContainerColor = document.getElementById('main-container-color')?.value?.trim() || '';
    infoData.basic.overviewContentBgImage = document.getElementById('overview-content-bg-image')?.value?.trim() || '';
    infoData.basic.overviewContentBgColor = document.getElementById('overview-content-bg-color')?.value?.trim() || '';
    infoData.basic.overviewContentOpacity = parseInt(document.getElementById('overview-content-opacity')?.value || 100);
    infoData.basic.overviewContentBlur = parseInt(document.getElementById('overview-content-blur')?.value || 0);
    infoData.basic.mainContainerBgImage = document.getElementById('main-container-bg-image')?.value?.trim() || '';
    infoData.basic.mainContainerBgColor = document.getElementById('main-container-bg-color')?.value?.trim() || '';
    infoData.basic.modalBgColor = document.getElementById('modal-bg-color')?.value?.trim() || '';
    infoData.basic.modalBgImage = document.getElementById('modal-bg-image')?.value?.trim() || '';

    // Clean custom navigation data
    if (infoData.basic.customNavLinks && Array.isArray(infoData.basic.customNavLinks)) {
        infoData.basic.customNavLinks = infoData.basic.customNavLinks.filter(link => 
            link && link.label && link.label.trim() && link.url && link.url.trim()
        );
        
        infoData.basic.customNavLinks.forEach(link => {
            if (typeof link.label === 'string') link.label = link.label.trim();
            if (typeof link.url === 'string') link.url = link.url.trim();
            if (!link.color) link.color = '#B1B695';
            if (!link.fontColor) link.fontColor = '#ffffff';
        });
    } else {
        infoData.basic.customNavLinks = [];
    }

    // Ensure custom navigation settings exist
    if (!infoData.basic.customNavSettings || typeof infoData.basic.customNavSettings !== 'object') {
        infoData.basic.customNavSettings = {
            location: null,
            alignment: null,
            spacing: null,
            position: null
        };
    }

    // FIXED: Update title settings controls (use correct IDs)
    const titleShowCheckbox = document.getElementById('world-title-visibility');
    const titleAlignmentSelect = document.getElementById('world-title-alignment');
    const titlePositionSelect = document.getElementById('world-title-position');

    if (titleShowCheckbox && infoData.basic.titleSettings) {
        titleShowCheckbox.checked = infoData.basic.titleSettings.show !== false;
    } else if (titleShowCheckbox) {
        titleShowCheckbox.checked = true; // default
    }

    if (titleAlignmentSelect && infoData.basic.titleSettings) {
        titleAlignmentSelect.value = infoData.basic.titleSettings.alignment || 'left';
    } else if (titleAlignmentSelect) {
        titleAlignmentSelect.value = 'left'; // default
    }

    if (titlePositionSelect && infoData.basic.titleSettings) {
        titlePositionSelect.value = infoData.basic.titleSettings.position || 'bottom';
    } else if (titlePositionSelect) {
        titlePositionSelect.value = 'bottom'; // default
    }

// FIXED: Collect page inclusion settings with null checks
    const includeWorldElement = document.getElementById('include-world');
    const includeCharactersElement = document.getElementById('include-characters');
    const includeStorylinesElement = document.getElementById('include-storylines');
    const includePlansElement = document.getElementById('include-plans');
    const includePlaylistsElement = document.getElementById('include-playlists');
    
    infoData.basic.includedPages = {
        world: includeWorldElement ? includeWorldElement.checked : true,
        characters: includeCharactersElement ? includeCharactersElement.checked : true,
        storylines: includeStorylinesElement ? includeStorylinesElement.checked : true,
        plans: includePlansElement ? includePlansElement.checked : true,
        playlists: includePlaylistsElement ? includePlaylistsElement.checked : true
    };

    
    // Ensure appearance settings are preserved and up to date
    if (!infoData.appearance) {
        infoData.appearance = {
            overviewStyle: 'journal',     
            navigationStyle: 'journal', 
            colorScheme: 'current',
            fontSet: 'serif',
            bannerSize: 'large',
            worldCategoriesHeader: 'default',
            pageHeader: 'standard',
            containerStyle: 'left-border',
            subcontainerStyle: 'soft-bg',
            siteWidth: 'standard',
            buttonStyle: 'rounded',
            customNavButtonStyle: 'rounded',
            backToTopStyle: 'circular'
        };
    }
    
    // Update appearance from form controls if they exist
    const templateSelect = document.getElementById('appearance-template');
    const overviewSelect = document.getElementById('appearance-overview-style');
    const navigationSelect = document.getElementById('appearance-navigation-style');
    const colorSelect = document.getElementById('appearance-color-scheme');
    const fontSelect = document.getElementById('appearance-font-set');
    const worldCategoriesHeaderSelect = document.getElementById('appearance-world-categories-header');
    const pageHeaderSelect = document.getElementById('appearance-page-header');
    const cardSelect = document.getElementById('appearance-card-style');
    const containerSelect = document.getElementById('appearance-container-style');
    const subcontainerSelect = document.getElementById('appearance-subcontainer-style');
    const buttonSelect = document.getElementById('appearance-button-style');
    const backToTopSelect = document.getElementById('appearance-back-to-top-style');
    const customNavButtonSelect = document.getElementById('appearance-custom-nav-button-style');

    if (customNavButtonSelect) {
        infoData.appearance.customNavButtonStyle = customNavButtonSelect.value;
    }
    
    if (templateSelect) {
        infoData.appearance.template = templateSelect.value;
    }
    if (overviewSelect) {
        infoData.appearance.overviewStyle = overviewSelect.value;
    }
    if (navigationSelect) {
        infoData.appearance.navigationStyle = navigationSelect.value;
    }
    if (colorSelect) {
        infoData.appearance.colorScheme = colorSelect.value;
    }
    if (fontSelect) {
        infoData.appearance.fontSet = fontSelect.value;
    }
    if (worldCategoriesHeaderSelect) {
        infoData.appearance.worldCategoriesHeader = worldCategoriesHeaderSelect.value;
    }
    if (pageHeaderSelect) {
        infoData.appearance.pageHeader = pageHeaderSelect.value;
    }
    if (cardSelect) {
        infoData.appearance.cardStyle = cardSelect.value;
    }
    if (buttonSelect) {
        infoData.appearance.buttonStyle = buttonSelect.value;
    }
    if (backToTopSelect) {
        infoData.appearance.backToTopStyle = backToTopSelect.value;
    }
    if (containerSelect) {
        infoData.appearance.containerStyle = containerSelect.value;
    }
    if (subcontainerSelect) {
        infoData.appearance.subcontainerStyle = subcontainerSelect.value;
    }
    // Add after the subcontainerStyle line:
    if (document.getElementById('appearance-banner-size')) {
        infoData.appearance.bannerSize = document.getElementById('appearance-banner-size').value;
    }
    // ADD THIS LINE:
    if (document.getElementById('appearance-site-width')) {
        infoData.appearance.siteWidth = document.getElementById('appearance-site-width').value;
    }
    if (!infoData.playlists) {
        infoData.playlists = [];
    }

    // Ensure custom pages are preserved
    if (!infoData.customPages) {
        infoData.customPages = [];
    }
    
    // Clean up data before processing
    cleanupData();
    
    return infoData;
}

// Data validation and cleanup - NOW INCLUDES SUBARCS
window.cleanupData = function() {
    // Remove empty entries and trim strings
    infoData.basic.title = infoData.basic.title.trim();
    infoData.basic.subtitle = infoData.basic.subtitle.trim();
    infoData.basic.banner = infoData.basic.banner.trim();
    infoData.basic.overviewTitle = infoData.basic.overviewTitle.trim();
    infoData.basic.overview = infoData.basic.overview.trim();
    infoData.basic.overviewImage = infoData.basic.overviewImage.trim();
    infoData.basic.backgroundColor = infoData.basic.backgroundColor.trim();
    infoData.basic.backgroundImage = infoData.basic.backgroundImage.trim();
    
    // Clean characters
    infoData.characters = infoData.characters.filter(char => char.name && char.name.trim());
    infoData.characters.forEach(char => {
        // Ensure all expected character fields exist including notes and tags
        const defaultCharacter = {
            name: '',
            image: '',
            tags: [],
            basic: '',
            physical: '',
            personality: '',
            sexuality: '',
            fightingStyle: '',
            background: '',
            equipment: '',
            hobbies: '',
            quirks: '',
            relationships: '',
            notes: '',
            gallery: []
        };
        
        // Fill in any missing fields
        Object.keys(defaultCharacter).forEach(field => {
            if (char[field] === undefined) {
                char[field] = defaultCharacter[field];
            }
        });
        
        // Clean existing fields
        Object.keys(char).forEach(key => {
            if (typeof char[key] === 'string') {
                char[key] = char[key].trim();
            } else if (Array.isArray(char[key])) {
                if (key === 'tags') {
                    char[key] = char[key].filter(tag => tag && tag.trim()).map(tag => tag.trim());
                } else {
                    char[key] = char[key].filter(item => item && item.trim()).map(item => item.trim());
                }
            }
        });
    });
    
    // Clean storylines
    infoData.storylines = infoData.storylines.filter(story => story.title && story.title.trim());
    infoData.storylines.forEach(story => {
        Object.keys(story).forEach(key => {
            if (typeof story[key] === 'string') {
                story[key] = story[key].trim();
            }
        });
        
        // ADD THESE LINES - Clean tags array
        if (Array.isArray(story.tags)) {
            story.tags = story.tags.filter(tag => tag && tag.trim()).map(tag => tag.trim());
        }
    });
    
    // Clean plans - NOW INCLUDING SUB-ARCS
    infoData.plans = infoData.plans.filter(plan => plan.title && plan.title.trim());
    infoData.plans.forEach(plan => {
        // Clean basic plan fields
        Object.keys(plan).forEach(key => {
            if (typeof plan[key] === 'string') {
                plan[key] = plan[key].trim();
            }
        });
        
        // Clean character tags array
        if (Array.isArray(plan.characterTags)) {
            plan.characterTags = plan.characterTags.filter(tag => tag && tag.trim()).map(tag => tag.trim());
        }
        
        // Clean main events array
        if (Array.isArray(plan.events)) {
            plan.events = plan.events.filter(event => event.title && event.title.trim());
            plan.events.forEach(event => {
                const defaultEvent = {
                    title: '',
                    type: 'rising',
                    timing: '',
                    notes: '',
                    image: '', // NEW
                    visible: true
                };
                
                Object.keys(defaultEvent).forEach(field => {
                    if (event[field] === undefined) {
                        event[field] = defaultEvent[field];
                    }
                });
                
                Object.keys(event).forEach(key => {
                    if (typeof event[key] === 'string') {
                        event[key] = event[key].trim();
                    }
                });
            });
        } else {
            plan.events = [];
        }
        
        // NEW: Clean sub-arcs array
        if (Array.isArray(plan.subArcs)) {
            plan.subArcs = plan.subArcs.filter(subArc => subArc.title && subArc.title.trim());
            plan.subArcs.forEach(subArc => {
                // Ensure all sub-arc fields exist
                const defaultSubArc = {
                    title: '',
                    description: '',
                    characterTags: [],
                    visible: true,
                    events: []
                };
                
                Object.keys(defaultSubArc).forEach(field => {
                    if (subArc[field] === undefined) {
                        subArc[field] = defaultSubArc[field];
                    }
                });
                
                // Clean string fields
                Object.keys(subArc).forEach(key => {
                    if (typeof subArc[key] === 'string') {
                        subArc[key] = subArc[key].trim();
                    }
                });
                
                // Clean character tags
                if (Array.isArray(subArc.characterTags)) {
                    subArc.characterTags = subArc.characterTags.filter(tag => tag && tag.trim()).map(tag => tag.trim());
                }
                
                // Clean sub-arc events
                if (Array.isArray(subArc.events)) {
                    subArc.events = subArc.events.filter(event => event.title && event.title.trim());
                    subArc.events.forEach(event => {
                        const defaultEvent = {
                            title: '',
                            type: 'rising',
                            timing: '',
                            notes: '',
                            visible: true
                        };
                        
                        Object.keys(defaultEvent).forEach(field => {
                            if (event[field] === undefined) {
                                event[field] = defaultEvent[field];
                            }
                        });
                        
                        Object.keys(event).forEach(key => {
                            if (typeof event[key] === 'string') {
                                event[key] = event[key].trim();
                            }
                        });
                    });
                } else {
                    subArc.events = [];
                }
            });
        } else {
            plan.subArcs = [];
        }
    });
    
    // Clean world items
    Object.keys(infoData.world).forEach(category => {
        infoData.world[category] = infoData.world[category].filter(item => item.name && item.name.trim());
        infoData.world[category].forEach(item => {
            if (item.hidden === undefined) {
                item.hidden = false;
            }
            
            Object.keys(item).forEach(key => {
                if (typeof item[key] === 'string') {
                    item[key] = item[key].trim();
                }
            });
        });
    });
    
    // Ensure appearance settings are clean and valid
    if (!infoData.appearance) {
        infoData.appearance = {
            template: 'journal',
            overviewStyle: 'journal',
            navigationStyle: 'journal',
            colorScheme: 'current',
            fontSet: 'serif',
            worldCategoriesHeader: 'default',
            pageHeader: 'standard',
            cardStyle: 'current',
            containerStyle: 'left-border',
            subcontainerStyle: 'soft-bg',
            buttonStyle: 'rounded'
        };
    }
}

// Make sub-arc-related functions globally available
window.addSubArc = addSubArc;
window.editSubArc = editSubArc;
window.deleteSubArc = deleteSubArc;
window.addEventToSubArc = addEventToSubArc;
window.openSubArcModal = openSubArcModal;
window.saveSubArc = saveSubArc;

// Make plan-related functions globally available (updated)
window.addEventToPlan = addEventToPlan;
window.editEventInPlan = editEventInPlan;
window.deleteEventFromPlan = deleteEventFromPlan;
window.openPlanModal = openPlanModal;
window.openEventModal = openEventModal;
window.savePlan = savePlan;
window.saveEvent = saveEvent;