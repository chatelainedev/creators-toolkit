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
        } else if (input.type === 'radio') {
            // Don't clear radio button values, just reset checked state
            // The first radio with 'checked' attribute will remain selected
            // Do nothing here - radio buttons keep their values
        } else {
            input.value = '';
        }
    });
    
    // Reset select elements too
    const selects = modal.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);

    if (modalId === 'characterModal') {
        // Reset stats to defaults
        const defaultStats = ['Strength', 'Constitution', 'Agility', 'Technique', 'Defense', 'Charisma'];
        document.getElementById('char-stat-range').value = 100;
        
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`char-stat-${i}-label`).value = defaultStats[i - 1];
            document.getElementById(`char-stat-${i}-value`).value = 0;
        }
    }
    
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
        
        currentEditingEvents = [];
        currentEditingSubArcs = [];
        currentEditingSubArcEvents = [];
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

function populateFactionDropdown() {
    const factionSelect = document.getElementById('char-faction');
    if (!factionSelect) return;
    
    // Clear existing options except "None"
    factionSelect.innerHTML = '<option value="">None</option>';
    
    // Get factions from world building
    if (infoData.world && infoData.world.factions) {
        infoData.world.factions.forEach(faction => {
            const option = document.createElement('option');
            option.value = faction.name;
            option.textContent = faction.name;
            factionSelect.appendChild(option);
        });
    }
}

function populateLocationDropdown() {
    const locationSelect = document.getElementById('char-location');
    if (!locationSelect) return;
    
    // Clear existing options except "None"
    locationSelect.innerHTML = '<option value="">None</option>';
    
    // Get locations from world building
    if (infoData.world && infoData.world.locations) {
        infoData.world.locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location.name;
            option.textContent = location.name;
            locationSelect.appendChild(option);
        });
    }
}

function populateItemsDropdown() {
    const dropdown = document.getElementById('char-items-dropdown');
    if (!dropdown) return;
    
    // Clear existing options
    dropdown.innerHTML = '';
    
    // Get items from world building that have icons
    if (infoData.world && infoData.world.items) {
        const itemsWithIcons = infoData.world.items.filter(item => {
            return item.icon && (item.icon.type === 'custom' || item.icon.type === 'builder');
        });
        
        if (itemsWithIcons.length === 0) {
            dropdown.innerHTML = '<div style="padding: 8px 12px; color: var(--text-muted);">No items with icons available</div>';
        } else {
            itemsWithIcons.forEach(item => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'multiselect-option';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = item.name;
                checkbox.id = `item-${item.name.replace(/\s+/g, '-')}`;
                checkbox.onchange = updateItemsDisplay;
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = item.name;
                
                optionDiv.appendChild(checkbox);
                optionDiv.appendChild(label);
                dropdown.appendChild(optionDiv);
            });
        }
    }
}

function toggleItemsDropdown() {
    const dropdown = document.getElementById('char-items-dropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

function updateItemsDisplay() {
    const dropdown = document.getElementById('char-items-dropdown');
    const display = document.getElementById('char-items-display');
    
    if (!dropdown || !display) return;
    
    const checkedBoxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkedBoxes.length === 0) {
        display.textContent = 'Select items...';
    } else if (checkedBoxes.length === 1) {
        display.textContent = checkedBoxes[0].value;
    } else {
        display.textContent = `${checkedBoxes.length} items selected`;
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('char-items-dropdown');
    const button = document.getElementById('char-items-button');
    
    if (dropdown && button && !dropdown.contains(e.target) && !button.contains(e.target)) {
        dropdown.style.display = 'none';
    }

    // Skills
    const skillsDropdown = document.getElementById('char-skills-dropdown');
    const skillsButton = document.getElementById('char-skills-button');
    
    if (skillsDropdown && skillsButton && !skillsDropdown.contains(e.target) && !skillsButton.contains(e.target)) {
        skillsDropdown.style.display = 'none';
    }
});

function populateSkillsDropdown() {
    const dropdown = document.getElementById('char-skills-dropdown');
    if (!dropdown) return;
    
    dropdown.innerHTML = '';
    
    const skillsWithIcons = [];
    
    // Get Magic entries with icons
    if (infoData.world && infoData.world.magic) {
        infoData.world.magic.forEach(magicItem => {
            if (magicItem.icon && (magicItem.icon.type === 'custom' || magicItem.icon.type === 'builder')) {
                skillsWithIcons.push({
                    name: magicItem.name,
                    category: 'magic'
                });
            }
        });
    }
    
    // Get Cultivation entries with icons
    if (infoData.world && infoData.world.cultivation) {
        infoData.world.cultivation.forEach(cultivationItem => {
            if (cultivationItem.icon && (cultivationItem.icon.type === 'custom' || cultivationItem.icon.type === 'builder')) {
                skillsWithIcons.push({
                    name: cultivationItem.name,
                    category: 'cultivation'
                });
            }
        });
    }
    
    skillsWithIcons.sort((a, b) => a.name.localeCompare(b.name));
    
    if (skillsWithIcons.length === 0) {
        dropdown.innerHTML = '<div style="padding: 8px 12px; color: var(--text-muted);">No magic/cultivation skills with icons available</div>';
    } else {
        skillsWithIcons.forEach(skill => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'multiselect-option';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = skill.name;
            checkbox.id = `skill-${skill.name.replace(/\s+/g, '-')}`;
            checkbox.dataset.category = skill.category;
            checkbox.onchange = updateSkillsDisplay;
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = skill.name;
            
            optionDiv.appendChild(checkbox);
            optionDiv.appendChild(label);
            dropdown.appendChild(optionDiv);
        });
    }
}

function toggleSkillsDropdown() {
    const dropdown = document.getElementById('char-skills-dropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

function updateSkillsDisplay() {
    const dropdown = document.getElementById('char-skills-dropdown');
    const display = document.getElementById('char-skills-display');
    
    if (!dropdown || !display) return;
    
    const checkedBoxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkedBoxes.length === 0) {
        display.textContent = 'Select skills...';
    } else if (checkedBoxes.length === 1) {
        display.textContent = checkedBoxes[0].value;
    } else {
        display.textContent = `${checkedBoxes.length} skills selected`;
    }
}

// Update stat max values when range changes
function updateStatRanges() {
    const maxRange = document.getElementById('char-stat-range').value || 100;
    
    for (let i = 1; i <= 6; i++) {
        const valueInput = document.getElementById(`char-stat-${i}-value`);
        if (valueInput) {
            valueInput.max = maxRange;
            // If current value exceeds new max, adjust it
            if (parseInt(valueInput.value) > parseInt(maxRange)) {
                valueInput.value = maxRange;
            }
        }
    }
}

// Initialize stat range listeners
function initializeStatListeners() {
    const rangeInput = document.getElementById('char-stat-range');
    if (rangeInput) {
        rangeInput.addEventListener('change', updateStatRanges);
        rangeInput.addEventListener('input', updateStatRanges);
    }
}

// Update openCharacterModal to set up color inputs
function openCharacterModal(characterData = null) {
    const modalTitle = document.getElementById('character-modal-title');
    editingIndex = characterData ? infoData.characters.indexOf(characterData) : -1;
    editingType = 'character';
    
    populateFactionDropdown();
    populateLocationDropdown();
    populateItemsDropdown();
    populateSkillsDropdown();
    
    if (characterData) {
        modalTitle.textContent = 'Edit Character';
        populateCharacterModal(characterData);
    } else {
        modalTitle.textContent = 'Add Character';
        clearModalFields('characterModal');
        document.getElementById('char-color').value = '#6c757d';
        document.getElementById('char-color-picker').value = '#6c757d';
        // ADD THIS LINE - default to true for new characters:
        document.getElementById('char-show-info-display').checked = true;
    }
    
    // ADD THIS BLOCK - enable/disable based on global setting:
    const globalShowInfoDisplay = infoData.charactersOptions?.showInfoDisplay ?? false;
    const charInfoDisplayCheckbox = document.getElementById('char-show-info-display');
    if (charInfoDisplayCheckbox) {
        charInfoDisplayCheckbox.disabled = !globalShowInfoDisplay;
        if (!globalShowInfoDisplay) {
            charInfoDisplayCheckbox.checked = false;
        }
    }
    
    openModal('characterModal');
    setupCharacterColorInputs();
    initializeStatListeners();
}

function populateCharacterModal(character) {
    document.getElementById('char-name').value = character.name || '';
    document.getElementById('char-full-name').value = character.fullName || '';
    document.getElementById('char-title').value = character.title || '';
    document.getElementById('char-age').value = character.age || '';
    document.getElementById('char-image').value = character.image || '';
    document.getElementById('char-tags').value = (character.tags || []).join(', ');
    document.getElementById('char-color').value = character.color || '#6c757d'; // NEW
    document.getElementById('char-color-picker').value = character.color || '#6c757d'; // NEW
    document.getElementById('char-location').value = character.location || ''; 
    document.getElementById('char-faction').value = character.faction || '';
    // Populate stats
    const defaultStats = ['Strength', 'Constitution', 'Agility', 'Technique', 'Defense', 'Charisma'];
    
    if (character.stats) {
        document.getElementById('char-stat-range').value = character.stats.range || 100;
        
        // Populate the 6 stat fields
        for (let i = 1; i <= 6; i++) {
            const stat = character.stats.entries && character.stats.entries[i - 1];
            document.getElementById(`char-stat-${i}-label`).value = stat ? stat.label : defaultStats[i - 1];
            document.getElementById(`char-stat-${i}-value`).value = stat ? stat.value : 0;
        }
    } else {
        // Use defaults for new characters
        document.getElementById('char-stat-range').value = 100;
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`char-stat-${i}-label`).value = defaultStats[i - 1];
            document.getElementById(`char-stat-${i}-value`).value = 0;
        }
    }
    
    // Update max ranges
    updateStatRanges();
    document.getElementById('char-basic').value = character.basic || '';
    document.getElementById('char-physical').value = character.physical || '';
    document.getElementById('char-personality').value = character.personality || '';
    document.getElementById('char-sexuality').value = character.sexuality || '';
    document.getElementById('char-fighting-style').value = character.fightingStyle || '';
    document.getElementById('char-background').value = character.background || '';
    document.getElementById('char-equipment').value = character.equipment || '';
    // Populate items checkboxes
    const itemsDropdown = document.getElementById('char-items-dropdown');
    if (itemsDropdown) {
        const checkboxes = itemsDropdown.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = character.items && character.items.includes(checkbox.value);
        });
        updateItemsDisplay();
    }
    // Populate skills checkboxes
    const skillsDropdown = document.getElementById('char-skills-dropdown');
    if (skillsDropdown) {
        const checkboxes = skillsDropdown.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = character.skills && character.skills.includes(checkbox.value);
        });
        updateSkillsDisplay();
    }
    document.getElementById('char-show-info-display').checked = character.showInfoDisplay !== false; // default true
    document.getElementById('char-hobbies').value = character.hobbies || '';
    document.getElementById('char-quirks').value = character.quirks || '';
    document.getElementById('char-relationships').value = character.relationships || '';
    document.getElementById('char-card-enabled').checked = character.cardEnabled || false;
    document.getElementById('char-card-path').value = character.cardPath || '';
    document.getElementById('char-notes').value = character.notes || '';
    document.getElementById('char-gallery').value = (character.gallery || []).join('\n');
}

// MODIFY YOUR form-handlers.js file
function saveCharacter() {
    // Collect stats
    const stats = {
        range: parseInt(document.getElementById('char-stat-range').value) || 100,
        entries: []
    };
    
    // Collect all 6 stats
    for (let i = 1; i <= 6; i++) {
        const label = document.getElementById(`char-stat-${i}-label`).value.trim();
        const value = document.getElementById(`char-stat-${i}-value`).value.trim();
        
        // Only add stat if it has a label (allows users to leave some empty)
        if (label) {
            stats.entries.push({
                label: label,
                value: parseInt(value) || 0
            });
        }
    }
    
    const characterData = {
        name: document.getElementById('char-name').value.trim(),
        fullName: document.getElementById('char-full-name').value.trim(),
        title: document.getElementById('char-title').value.trim(),
        age: document.getElementById('char-age').value.trim(),
        image: document.getElementById('char-image').value.trim(),
        tags: document.getElementById('char-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag),
        color: document.getElementById('char-color').value || '#6c757d',
        location: document.getElementById('char-location').value.trim(),
        faction: document.getElementById('char-faction').value.trim(),
        stats: stats, // ADD THIS
        basic: document.getElementById('char-basic').value.trim(),
        physical: document.getElementById('char-physical').value.trim(),
        personality: document.getElementById('char-personality').value.trim(),
        sexuality: document.getElementById('char-sexuality').value.trim(),
        fightingStyle: document.getElementById('char-fighting-style').value.trim(),
        background: document.getElementById('char-background').value.trim(),
        equipment: document.getElementById('char-equipment').value.trim(),
        items: Array.from(document.getElementById('char-items-dropdown').querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
        skills: Array.from(document.getElementById('char-skills-dropdown').querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
        showInfoDisplay: document.getElementById('char-show-info-display').checked,
        hobbies: document.getElementById('char-hobbies').value.trim(),
        quirks: document.getElementById('char-quirks').value.trim(),
        relationships: document.getElementById('char-relationships').value.trim(),
        cardEnabled: document.getElementById('char-card-enabled').checked,
        cardPath: document.getElementById('char-card-path').value.trim(),       
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
    
    // Populate section datalist with existing sections
    const sectionDatalist = document.getElementById('section-datalist');
    sectionDatalist.innerHTML = '';
    
    const uniqueSections = new Set();
    infoData.storylines.forEach(storyline => {
        if (storyline.section && storyline.section.trim()) {
            uniqueSections.add(storyline.section.trim());
        }
    });
    
    uniqueSections.forEach(section => {
        const option = document.createElement('option');
        option.value = section;
        sectionDatalist.appendChild(option);
    });
    
    // NEW: Set up subsection field behavior
    const sectionInput = document.getElementById('story-section');
    const subsectionInput = document.getElementById('story-subsection');
    
    // Enable/disable subsection based on section value
    if (sectionInput.value.trim()) {
        subsectionInput.disabled = false;
        populateSubsectionDatalist(sectionInput.value.trim());
    } else {
        subsectionInput.disabled = true;
        subsectionInput.value = '';
    }
    
    // Listen for changes to section field
    sectionInput.addEventListener('input', function() {
        if (this.value.trim()) {
            subsectionInput.disabled = false;
            populateSubsectionDatalist(this.value.trim());
        } else {
            subsectionInput.disabled = true;
            subsectionInput.value = '';
        }
    });
    
    openModal('storylineModal');
}

// Generate unique ID for world items based on category
function generateWorldItemId(category) {
    // Get category prefix (e.g., 'locations' -> 'loc', 'items' -> 'item')
    const prefixMap = {
        'locations': 'loc',
        'concepts': 'concept',
        'events': 'event',
        'creatures': 'creature',
        'plants': 'plant',
        'items': 'item',
        'factions': 'faction',
        'culture': 'culture',
        'cultivation': 'cultivation',
        'magic': 'magic',
        'general': 'general'
    };
    
    const prefix = prefixMap[category] || category;
    
    // Get existing IDs for this category
    const existingIds = infoData.world[category]
        ?.filter(item => item.id)
        .map(item => parseInt(item.id.replace(`${prefix}_`, '')))
        .filter(id => !isNaN(id)) || [];
    
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return `${prefix}_${maxId + 1}`;
}

function populateSubsectionDatalist(sectionName) {
    const subsectionDatalist = document.getElementById('subsection-datalist');
    subsectionDatalist.innerHTML = '';
    
    const uniqueSubsections = new Set();
    infoData.storylines.forEach(storyline => {
        // Only include subsections from the same section
        if (storyline.section === sectionName && 
            storyline.subsection && 
            storyline.subsection.trim()) {
            uniqueSubsections.add(storyline.subsection.trim());
        }
    });
    
    uniqueSubsections.forEach(subsection => {
        const option = document.createElement('option');
        option.value = subsection;
        subsectionDatalist.appendChild(option);
    });
}

function populateStorylineModal(storyline) {
    // Helper function to set value only if current field is empty
    const setIfEmpty = (fieldId, value) => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.value = value || '';
        }
    };
    
    // Always set these fields (for edit mode)
    if (!document.getElementById('story-title').value) {
        document.getElementById('story-title').value = storyline.title || '';
    }
    if (!document.getElementById('story-pairing').value) {
        document.getElementById('story-pairing').value = storyline.pairing || '';
    }
    if (!document.getElementById('story-type').value || document.getElementById('story-type').value === 'roleplay') {
        document.getElementById('story-type').value = storyline.type || 'roleplay';
    }
    if (!document.getElementById('story-section').value) {
        document.getElementById('story-section').value = storyline.section || '';
    }
    if (!document.getElementById('story-subsection').value) {
        document.getElementById('story-subsection').value = storyline.subsection || '';
    }
    if (!document.getElementById('story-tags').value) {
        document.getElementById('story-tags').value = (storyline.tags || []).join(', ');
    }
    if (!document.getElementById('story-wordcount').value) {
        document.getElementById('story-wordcount').value = storyline.wordcount || '';
    }
    if (!document.getElementById('story-last-updated').value) {
        document.getElementById('story-last-updated').value = storyline.lastUpdated || '';
    }
    if (!document.getElementById('story-description').value) {
        document.getElementById('story-description').value = storyline.description || '';
    }
    
    // Handle project link checkbox and link processing
    const isProjectLink = storyline.isProjectLink || false;
    const linkInput = document.getElementById('story-link');
    const projectCheckbox = document.getElementById('story-is-project-link');
    
    projectCheckbox.checked = isProjectLink;
    
    if (isProjectLink) {
        // Show just the filename if it's a project link
        if (!linkInput.value) {
            linkInput.value = storyline.link ? storyline.link.replace('roleplays/', '') : '';
        }
        linkInput.placeholder = 'story-title.html';
    } else {
        // Show full URL for external links
        if (!linkInput.value) {
            linkInput.value = storyline.link || '';
        }
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
        subsection: document.getElementById('story-subsection').value.trim(),
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

// Drag and drop for sub-arcs
function initializeSubArcDragDrop(container) {
    const subArcItems = container.querySelectorAll('.subarc-item');
    let draggedElement = null;
    
    subArcItems.forEach(item => {
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
            
            const allItems = container.querySelectorAll('.subarc-item');
            allItems.forEach(item => item.classList.remove('drag-over'));
            
            // Update subarc order after drag ends
            updateSubArcOrder(container);
            
            draggedElement = null;
        });

        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const siblings = container.querySelectorAll('.subarc-item');
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

function updateSubArcOrder(container) {
    // Get the current visual order from DOM
    const subArcItems = container.querySelectorAll('.subarc-item');
    const newOrder = [];
    
    subArcItems.forEach(item => {
        const originalIndex = parseInt(item.getAttribute('data-index'));
        if (currentEditingSubArcs[originalIndex]) {
            newOrder.push(currentEditingSubArcs[originalIndex]);
        }
    });
    
    // Update the sub-arcs array
    currentEditingSubArcs = newOrder;
    updateSubArcsListInModal(newOrder);
    
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
    
    // Get category name with custom labels support
    let categoryName;
    if (category === 'general') {
        categoryName = 'General';
    } else if (category === 'magic' && infoData.magicOptions?.customLabel) {
        categoryName = infoData.magicOptions.customLabel;
    } else if (category === 'cultivation' && infoData.cultivationOptions?.customLabel) {
        categoryName = infoData.cultivationOptions.customLabel;
    } else if (category === 'culture' && infoData.cultureOptions?.customLabel) {
        categoryName = infoData.cultureOptions.customLabel;
    } else if (category === 'events' && infoData.eventsOptions?.customLabel) {
        categoryName = infoData.eventsOptions.customLabel;
    } else {
        // FIXED: Changed slice(1, -1) to slice(1) to prevent cutting off last letter
        categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Show/hide icon section based on category
    const iconSection = document.getElementById('world-item-icon-section');
    if (iconSection) {
        // Show icon section for items, magic, and cultivation
        iconSection.style.display = (category === 'items' || category === 'magic' || category === 'cultivation') ? 'block' : 'none';
    }
    
    if (itemData) {
        modalTitle.textContent = `Edit ${categoryName}`;
        populateWorldItemModal(itemData);
    } else {
        modalTitle.textContent = `Add ${categoryName}`;
        clearModalFields('worldItemModal');
        
        // CRITICAL: Create a new item object with an ID for new entries
        // This allows icons to be saved even before the entry is saved
        if (category === 'items' || category === 'magic' || category === 'cultivation') {
            window.currentEditingItem = {
                id: generateWorldItemId(category),
                name: '',
                icon: null
            };
        } else {
            window.currentEditingItem = null;
        }
        
        // Reset icon fields (with safety checks) - for items, magic, and cultivation
        if (category === 'items' || category === 'magic' || category === 'cultivation') {
            const iconTypeNone = document.querySelector('input[name="icon-type"][value="none"]');
            const customIconSection = document.getElementById('custom-icon-image-section');
            const builderSection = document.getElementById('icon-builder-section');
            const previewContainer = document.getElementById('icon-preview-container');
            const iconImageInput = document.getElementById('item-icon-image');
            const configureBtn = document.getElementById('configure-icon-btn');
            
            if (iconTypeNone) iconTypeNone.checked = true;
            if (customIconSection) customIconSection.style.display = 'none';
            if (builderSection) builderSection.style.display = 'none';
            if (previewContainer) previewContainer.style.display = 'none';
            if (iconImageInput) iconImageInput.value = '';
            if (configureBtn) configureBtn.style.display = 'none';
            currentIconConfig = null;
        }
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
    // SET THIS FIRST, BEFORE ANYTHING ELSE
    window.currentEditingItem = item;
    document.getElementById('item-name').value = item.name || '';
    document.getElementById('item-category').value = item.category || item.type || '';
    document.getElementById('item-status').value = item.status || '';
    document.getElementById('item-tags').value = (item.tags || []).join(', ');
    document.getElementById('item-hidden').checked = item.hidden || false;
    document.getElementById('item-image').value = item.image || '';
    document.getElementById('item-description').value = item.description || '';
    
    // Handle properties/features field (different for locations)
    if (item.features) {
        document.getElementById('item-properties').value = item.features || '';
    } else {
        document.getElementById('item-properties').value = item.properties || '';
    }
    
    // Handle connections field
    document.getElementById('item-connections').value = item.connections || '';
    
    // Handle icon configuration
    if (item.icon) {
        if (item.icon.type === 'custom') {
            document.querySelector('input[name="icon-type"][value="custom"]').checked = true;
            document.getElementById('item-icon-image').value = item.icon.image || '';
            document.getElementById('custom-icon-image-section').style.display = 'block';
            document.getElementById('icon-builder-section').style.display = 'none';
            document.getElementById('configure-icon-btn').style.display = 'none';
            document.getElementById('icon-preview-container').style.display = 'none';
        } else if (item.icon.type === 'builder') {
            document.querySelector('input[name="icon-type"][value="builder"]').checked = true;
            document.getElementById('custom-icon-image-section').style.display = 'none';
            document.getElementById('icon-builder-section').style.display = 'block';
            document.getElementById('configure-icon-btn').style.display = 'inline-block';
            
            window.currentEditingItem = item;
            
            // Show preview
            const previewContainer = document.getElementById('icon-preview-container');
            const previewDisplay = document.getElementById('icon-preview-display');
            const iconPath = getIconPath(item.icon.category, item.icon.file);
            let borderCSS = 'none';
            if (item.icon.borderStyle === 'thin') {
                borderCSS = `2px solid ${item.icon.borderColor}`;
            } else if (item.icon.borderStyle === 'thick') {
                borderCSS = `4px solid ${item.icon.borderColor}`;
            }
            const borderRadius = item.icon.shape === 'circle' ? '50%' : '4px';
            
            previewDisplay.innerHTML = `
                <div style="
                    width: 48px;
                    height: 48px;
                    background-color: ${item.icon.bgColor};
                    border: ${borderCSS};
                    border-radius: ${borderRadius};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 10px 0;
                ">
                    <img src="${iconPath}" alt="${item.icon.name}" 
                        style="width: 28px; height: 28px; image-rendering: pixelated; opacity: ${item.icon.iconOpacity / 100};">
                </div>
            `;
            
            previewContainer.style.display = 'block';
        }
    } else {
        // CRITICAL: Item has no icon - reset everything to "No Icon"
        const iconTypeNone = document.querySelector('input[name="icon-type"][value="none"]');
        const customIconSection = document.getElementById('custom-icon-image-section');
        const builderSection = document.getElementById('icon-builder-section');
        const previewContainer = document.getElementById('icon-preview-container');
        const configureBtn = document.getElementById('configure-icon-btn');
        const iconImageInput = document.getElementById('item-icon-image');
        
        if (iconTypeNone) iconTypeNone.checked = true;
        if (customIconSection) customIconSection.style.display = 'none';
        if (builderSection) builderSection.style.display = 'none';
        if (previewContainer) previewContainer.style.display = 'none';
        if (configureBtn) configureBtn.style.display = 'none';
        if (iconImageInput) iconImageInput.value = '';
    }
}

function getIconPath(category, file) {
    return `images/item-icons/${category}/${file}`;
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
            .filter(tag => tag),
        icon: null  // Will be set below
    };
    
    // Check which icon type is selected
    const iconType = document.querySelector('input[name="icon-type"]:checked').value;
    if (iconType === 'custom') {
        const customImage = document.getElementById('item-icon-image').value.trim();
        if (customImage) {
            itemData.icon = {
                type: 'custom',
                image: customImage
            };
        }
    } else if (iconType === 'builder') {
        // Read from window.currentEditingItem if it exists
        if (window.currentEditingItem && window.currentEditingItem.icon && window.currentEditingItem.icon.type === 'builder') {
            itemData.icon = window.currentEditingItem.icon;
            console.log('✅ Saving builder icon to item:', itemData.icon);
        } else {
            console.warn('⚠️ Builder icon selected but no icon config found');
        }
    }
    
    // Handle different property names for different categories
    if (editingCategory === 'locations') {
        itemData.type = document.getElementById('item-category').value.trim();
        itemData.features = document.getElementById('item-properties').value.trim();
        itemData.connections = document.getElementById('item-connections').value.trim();
    } else {
        itemData.category = document.getElementById('item-category').value.trim();
        itemData.properties = document.getElementById('item-properties').value.trim();
        itemData.connections = document.getElementById('item-connections').value.trim();
    }

    // Generate or preserve ID
    if (editingIndex >= 0) {
        const existingItem = infoData.world[editingCategory][editingIndex];
        itemData.id = existingItem.id || generateWorldItemId(editingCategory);
    } else {
        // Use the ID that was already generated when opening the modal
        // This ensures icons can be saved before the entry is saved
        itemData.id = window.currentEditingItem?.id || generateWorldItemId(editingCategory);
    }

    // Validation
    if (!itemData.name) {
        alert('Item name is required!');
        return;
    }

    if (editingIndex >= 0) {
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

window.addMagic = function() {
    editingIndex = -1;
    editingType = 'worldItem';
    editingCategory = 'magic';
    openWorldItemModal(null, 'magic');
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
        <div style="display: flex; align-items: center; flex: 1; min-width: 0;">
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
            infodisplayStyle: 'default',
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
    const infodisplaySelect = document.getElementById('appearance-infodisplay-style');
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
    if (infodisplaySelect) {
        infoData.appearance.infodisplayStyle = infodisplaySelect.value;
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

    // Ensure linked lorebook data is preserved
    infoData.linkedLorebook = infoData.linkedLorebook || null;

// DON'T store userTimeSystems in projects - they should only store the selectedTimeSystemId
    
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
            fullName: '',
            title: '',
            age: '',
            image: '',
            tags: [],
            location: '',
            faction: '',
            stats: { 
                range: 100, 
                entries: [
                    { label: 'Strength', value: 0 },
                    { label: 'Constitution', value: 0 },
                    { label: 'Agility', value: 0 },
                    { label: 'Technique', value: 0 },
                    { label: 'Defense', value: 0 },
                    { label: 'Charisma', value: 0 }
                ]
            },
            basic: '',
            physical: '',
            personality: '',
            sexuality: '',
            fightingStyle: '',
            background: '',
            equipment: '',
            items: [], 
            skills: [], 
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
            infodisplayStyle: 'default',
            buttonStyle: 'rounded'
        };
    }
}

// Storylines Options functions
function openStorylinesOptionsModal() {
    // Populate checkboxes with current values
    document.getElementById('storylines-show-toc').checked = infoData.storylinesOptions?.showTOC ?? true;
    document.getElementById('storylines-show-sections').checked = infoData.storylinesOptions?.showSections ?? true;
    document.getElementById('storylines-show-subsections').checked = infoData.storylinesOptions?.showSubsections ?? true;
    
    openModal('storylinesOptionsModal');
}

function saveStorylinesOptions() {
    // Ensure storylinesOptions exists
    if (!infoData.storylinesOptions) {
        infoData.storylinesOptions = {};
    }
    
    infoData.storylinesOptions.showTOC = document.getElementById('storylines-show-toc').checked;
    infoData.storylinesOptions.showSections = document.getElementById('storylines-show-sections').checked;
    infoData.storylinesOptions.showSubsections = document.getElementById('storylines-show-subsections').checked;
    
    closeModal('storylinesOptionsModal');
    markDataAsModified();
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Storylines display options saved!');
    }
}

// Plans Options functions
function openPlansOptionsModal() {
    // Populate time system dropdown
    if (typeof populateTimeSystemsDropdown === 'function') {
        populateTimeSystemsDropdown();
    }
    
    // Set current selection
    const selectedSystem = infoData.plansOptions?.selectedTimeSystemId || 'default';
    document.getElementById('plans-time-system').value = selectedSystem;
    
    openModal('plansOptionsModal');
}

function savePlansOptions() {
    // Ensure plansOptions exists
    if (!infoData.plansOptions) {
        infoData.plansOptions = {};
    }
    
    infoData.plansOptions.selectedTimeSystemId = document.getElementById('plans-time-system').value;
    
    closeModal('plansOptionsModal');
    markDataAsModified();
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Plans options saved!');
    }
}

// Magic Options functions
function openMagicOptionsModal() {
    // Populate input with current value
    const customLabel = infoData.magicOptions?.customLabel || 'Magic';
    document.getElementById('magic-custom-label').value = customLabel;
    
    openModal('magicOptionsModal');
}

function saveMagicOptions() {
    // Ensure magicOptions exists
    if (!infoData.magicOptions) {
        infoData.magicOptions = {};
    }
    
    infoData.magicOptions.customLabel = document.getElementById('magic-custom-label').value.trim() || 'Magic';
    
    closeModal('magicOptionsModal');
    markDataAsModified();
    
    updateCategoryLabels(); // ADD THIS LINE
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Magic display options saved!');
    }
}

// Cultivation Options functions
function openCultivationOptionsModal() {
    // Populate input with current value
    const customLabel = infoData.cultivationOptions?.customLabel || 'Cultivation';
    document.getElementById('cultivation-custom-label').value = customLabel;
    
    openModal('cultivationOptionsModal');
}

function saveCultivationOptions() {
    // Ensure cultivationOptions exists
    if (!infoData.cultivationOptions) {
        infoData.cultivationOptions = {};
    }
    
    infoData.cultivationOptions.customLabel = document.getElementById('cultivation-custom-label').value.trim() || 'Cultivation';
    
    closeModal('cultivationOptionsModal');
    markDataAsModified();
    
    updateCategoryLabels(); // ADD THIS LINE
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Cultivation display options saved!');
    }
}

// Culture Options functions
function openCultureOptionsModal() {
    // Populate input with current value
    const customLabel = infoData.cultureOptions?.customLabel || 'Culture';
    document.getElementById('culture-custom-label').value = customLabel;
    
    openModal('cultureOptionsModal');
}

function saveCultureOptions() {
    // Ensure cultureOptions exists
    if (!infoData.cultureOptions) {
        infoData.cultureOptions = {};
    }
    
    infoData.cultureOptions.customLabel = document.getElementById('culture-custom-label').value.trim() || 'Culture';
    
    closeModal('cultureOptionsModal');
    markDataAsModified();
    
    updateCategoryLabels(); // ADD THIS LINE
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Culture display options saved!');
    }
}

// Events Options functions
function openEventsOptionsModal() {
    // Populate input with current value
    const customLabel = infoData.eventsOptions?.customLabel || 'Events';
    document.getElementById('events-custom-label').value = customLabel;
    
    openModal('eventsOptionsModal');
}

function saveEventsOptions() {
    // Ensure eventsOptions exists
    if (!infoData.eventsOptions) {
        infoData.eventsOptions = {};
    }
    
    infoData.eventsOptions.customLabel = document.getElementById('events-custom-label').value.trim() || 'Events';
    
    closeModal('eventsOptionsModal');
    markDataAsModified();
    
    updateCategoryLabels(); // ADD THIS LINE
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Events display options saved!');
    }
}

// Update category display labels in the UI
function updateCategoryLabels() {
    // Update Magic labels
    if (infoData.magicOptions?.customLabel) {
        const magicLabel = infoData.magicOptions.customLabel;
        
        // Update section header
        const magicSectionHeader = document.querySelector('#magic-section .section-header h3');
        if (magicSectionHeader) {
            magicSectionHeader.innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> ${magicLabel}`;
        }
        
        // Update sidebar
        const magicSidebarItem = document.querySelector('.sidebar-item[data-category="magic"] .category-name');
        if (magicSidebarItem) {
            magicSidebarItem.textContent = magicLabel;
        }
        
        // Update add button text
        const magicAddBtn = document.getElementById('add-magic');
        if (magicAddBtn) {
            magicAddBtn.textContent = `+ Add ${magicLabel}`;
        }
    }

    // Update Culture labels
    if (infoData.cultureOptions?.customLabel) {
        const cultureLabel = infoData.cultureOptions.customLabel;
        
        // Update section header
        const cultureSectionHeader = document.querySelector('#culture-section .section-header h3');
        if (cultureSectionHeader) {
            cultureSectionHeader.innerHTML = `<i class="fas fa-theater-masks"></i> ${cultureLabel}`;
        }
        
        // Update sidebar
        const cultureSidebarItem = document.querySelector('.sidebar-item[data-category="culture"] .category-name');
        if (cultureSidebarItem) {
            cultureSidebarItem.textContent = cultureLabel;
        }
        
        // Update add button text
        const cultureAddBtn = document.getElementById('add-culture');
        if (cultureAddBtn) {
            cultureAddBtn.textContent = `+ Add ${cultureLabel}`;
        }
    }
    
    // Update Cultivation labels
    if (infoData.cultivationOptions?.customLabel) {
        const cultivationLabel = infoData.cultivationOptions.customLabel;
        
        // Update section header
        const cultivationSectionHeader = document.querySelector('#cultivation-section .section-header h3');
        if (cultivationSectionHeader) {
            cultivationSectionHeader.innerHTML = `<i class="fas fa-leaf"></i> ${cultivationLabel}`;
        }
        
        // Update sidebar
        const cultivationSidebarItem = document.querySelector('.sidebar-item[data-category="cultivation"] .category-name');
        if (cultivationSidebarItem) {
            cultivationSidebarItem.textContent = cultivationLabel;
        }
        
        // Update add button text
        const cultivationAddBtn = document.getElementById('add-cultivation');
        if (cultivationAddBtn) {
            cultivationAddBtn.textContent = `+ Add ${cultivationLabel}`;
        }
    }

    // Update Events labels
    if (infoData.eventsOptions?.customLabel) {
        const eventsLabel = infoData.eventsOptions.customLabel;
        
        // Update section header
        const eventsSectionHeader = document.querySelector('#events-section .section-header h3');
        if (eventsSectionHeader) {
            eventsSectionHeader.innerHTML = `<i class="fas fa-calendar-alt"></i> ${eventsLabel}`;
        }
        
        // Update sidebar
        const eventsSidebarItem = document.querySelector('.sidebar-item[data-category="events"] .category-name');
        if (eventsSidebarItem) {
            eventsSidebarItem.textContent = eventsLabel;
        }
        
        // Update add button text
        const eventsAddBtn = document.getElementById('add-event');
        if (eventsAddBtn) {
            eventsAddBtn.textContent = `+ Add ${eventsLabel}`;
        }
    }
}

// Characters Options functions
function openCharactersOptionsModal() {
    // Populate checkboxes with current values
    const showByFactionCheckbox = document.getElementById('characters-show-by-faction');
    const showInfoDisplayCheckbox = document.getElementById('characters-show-info-display'); // NEW
    const manageFactionOrderBtn = document.getElementById('manage-faction-order-btn');
    
    showByFactionCheckbox.checked = infoData.charactersOptions?.showByFaction ?? true;
    showInfoDisplayCheckbox.checked = infoData.charactersOptions?.showInfoDisplay ?? false; // NEW - default false
    
    // Enable/disable the order button based on checkbox
    if (manageFactionOrderBtn) {
        manageFactionOrderBtn.disabled = !showByFactionCheckbox.checked;
    }
    
    // Add listener to checkbox to update button state
    showByFactionCheckbox.addEventListener('change', function() {
        if (manageFactionOrderBtn) {
            manageFactionOrderBtn.disabled = !this.checked;
        }
    });
    
    openModal('charactersOptionsModal');
}

function saveCharactersOptions() {
    // Ensure charactersOptions exists
    if (!infoData.charactersOptions) {
        infoData.charactersOptions = {};
    }
    
    infoData.charactersOptions.showByFaction = document.getElementById('characters-show-by-faction').checked;
    infoData.charactersOptions.showInfoDisplay = document.getElementById('characters-show-info-display').checked;
    
    closeModal('charactersOptionsModal');
    markDataAsModified();
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Characters display options saved!');
    }
}

// Faction Order functions
function openFactionOrderModal() {
    const container = document.getElementById('faction-order-list');
    if (!container) return;
    
    // Get factions that are actually assigned to characters
    const assignedFactions = new Set();
    infoData.characters.forEach(character => {
        if (character.faction && character.faction.trim()) {
            assignedFactions.add(character.faction.trim());
        }
    });
    
    if (assignedFactions.size === 0) {
        alert('No factions are currently assigned to characters.');
        return;
    }
    
    // Get faction indices from world.factions
    const factionItems = [];
    infoData.world.factions.forEach((faction, index) => {
        if (assignedFactions.has(faction.name)) {
            factionItems.push({ name: faction.name, index: index });
        }
    });
    
    // Sort based on saved order if it exists
    if (infoData.charactersOptions?.factionOrder) {
        factionItems.sort((a, b) => {
            const aIndex = infoData.charactersOptions.factionOrder.indexOf(a.index);
            const bIndex = infoData.charactersOptions.factionOrder.indexOf(b.index);
            
            // If both in saved order, use saved order
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            // If only a is in saved order, a comes first
            if (aIndex !== -1) return -1;
            // If only b is in saved order, b comes first
            if (bIndex !== -1) return 1;
            // Neither in saved order, sort alphabetically
            return a.name.localeCompare(b.name);
        });
    } else {
        // No saved order, sort alphabetically
        factionItems.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Populate the list
    container.innerHTML = '';
    factionItems.forEach((item, displayIndex) => {
        const factionItem = document.createElement('div');
        factionItem.className = 'event-item';
        factionItem.draggable = true;
        factionItem.setAttribute('data-index', displayIndex);
        factionItem.setAttribute('data-faction-index', item.index);
        
        factionItem.innerHTML = `
            <div class="event-item-header">
                <i class="fas fa-grip-vertical drag-handle"></i>
                <span class="event-item-title">${item.name}</span>
            </div>
        `;
        
        container.appendChild(factionItem);
    });
    
    // Initialize drag and drop
    initializeFactionOrderDragDrop(container);
    
    openModal('factionOrderModal');
}

function initializeFactionOrderDragDrop(container) {
    const factionItems = container.querySelectorAll('.event-item');
    let draggedElement = null;
    
    factionItems.forEach(item => {
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

function saveFactionOrder() {
    const container = document.getElementById('faction-order-list');
    if (!container) return;
    
    // Ensure charactersOptions exists
    if (!infoData.charactersOptions) {
        infoData.charactersOptions = {};
    }
    
    // Get the current order from the DOM
    const factionItems = container.querySelectorAll('.event-item');
    const factionOrder = [];
    
    factionItems.forEach(item => {
        const factionIndex = parseInt(item.getAttribute('data-faction-index'));
        factionOrder.push(factionIndex);
    });
    
    infoData.charactersOptions.factionOrder = factionOrder;
    
    closeModal('factionOrderModal');
    markDataAsModified();
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Faction order saved!');
    }
}

// Info-Display Labels functions
function openInfoDisplayLabelsModal() {
    // Populate inputs with current values or defaults
    const labels = infoData.charactersOptions?.infoDisplayLabels || {};
    
    document.getElementById('info-display-label-age').value = labels.age || 'Age';
    document.getElementById('info-display-label-origin').value = labels.origin || 'Origin';
    document.getElementById('info-display-label-faction').value = labels.faction || 'Faction';
    document.getElementById('info-display-label-items').value = labels.items || 'Special Items';
    
    openModal('infoDisplayLabelsModal');
}

function saveInfoDisplayLabels() {
    // Ensure charactersOptions exists
    if (!infoData.charactersOptions) {
        infoData.charactersOptions = {};
    }
    
    // Save custom labels
    infoData.charactersOptions.infoDisplayLabels = {
        age: document.getElementById('info-display-label-age').value.trim() || 'Age',
        origin: document.getElementById('info-display-label-origin').value.trim() || 'Origin',
        faction: document.getElementById('info-display-label-faction').value.trim() || 'Faction',
        items: document.getElementById('info-display-label-items').value.trim() || 'Special Items'
    };
    
    closeModal('infoDisplayLabelsModal');
    markDataAsModified();
    
    if (typeof showStatus === 'function') {
        showStatus('success', 'Info-Display labels saved!');
    }
}

// Icon Builder Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Icon type toggle handler
    const iconTypeRadios = document.querySelectorAll('input[name="icon-type"]');
    iconTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Get the value from the checked radio button explicitly
            const selectedValue = document.querySelector('input[name="icon-type"]:checked').value;
            
            const customIconSection = document.getElementById('custom-icon-image-section');
            const builderSection = document.getElementById('icon-builder-section');
            
            const configureBtn = document.getElementById('configure-icon-btn');

            if (selectedValue === 'custom') {
                customIconSection.style.display = 'block';
                builderSection.style.display = 'none';
                configureBtn.style.display = 'none';
            } else if (selectedValue === 'builder') {
                customIconSection.style.display = 'none';
                builderSection.style.display = 'block';
                configureBtn.style.display = 'inline-block';
            } else {
                customIconSection.style.display = 'none';
                builderSection.style.display = 'none';
                configureBtn.style.display = 'none';
            }
        });
    });
    
    // Color picker sync for icon bg color
    const iconBgColorPicker = document.getElementById('icon-bg-color-picker');
    if (iconBgColorPicker) {
        iconBgColorPicker.addEventListener('input', function() {
            document.getElementById('icon-bg-color').value = this.value;
            updateIconPreview();
        });
    }
    
    const iconBgColorText = document.getElementById('icon-bg-color');
    if (iconBgColorText) {
        iconBgColorText.addEventListener('input', function() {
            if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                document.getElementById('icon-bg-color-picker').value = this.value;
            }
        });
    }
    
    // Color picker sync for icon border color
    const iconBorderColorPicker = document.getElementById('icon-border-color-picker');
    if (iconBorderColorPicker) {
        iconBorderColorPicker.addEventListener('input', function() {
            document.getElementById('icon-border-color').value = this.value;
            updateIconPreview();
        });
    }
    
    const iconBorderColorText = document.getElementById('icon-border-color');
    if (iconBorderColorText) {
        iconBorderColorText.addEventListener('input', function() {
            if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                document.getElementById('icon-border-color-picker').value = this.value;
            }
        });
    }
});

// Make savePlaylist globally accessible
window.savePlaylist = savePlaylist;

// Make functions globally available
window.openFactionOrderModal = openFactionOrderModal;
window.saveFactionOrder = saveFactionOrder;

// Make functions globally available
window.openCharactersOptionsModal = openCharactersOptionsModal;
window.saveCharactersOptions = saveCharactersOptions;

// Make functions globally available
window.openStorylinesOptionsModal = openStorylinesOptionsModal;
window.saveStorylinesOptions = saveStorylinesOptions;