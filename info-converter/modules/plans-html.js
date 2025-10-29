// UPDATED: Plan/Arc modal functions with sub-arcs support
let currentEditingEvents = []; // Track main arc events during editing session
let currentEditingSubArcs = []; // NEW: Track sub-arcs during editing session
let editingSubArcIndex = -1; // NEW: Track which sub-arc is being edited
let currentEditingSubArcEvents = []; // NEW: Track events within the current sub-arc being edited
// Global variables for subevent management
let currentEditingSubevents = []; // Working copy of subevents during event editing
let editingSubeventIndex = -1; // Track which subevent is being edited

function migratePlanData() {
    // Ensure all existing plans have a tags field
    if (infoData.plans) {
        infoData.plans.forEach(plan => {
            if (!plan.hasOwnProperty('tags')) {
                plan.tags = []; // Initialize empty tags array
            }
        });
        console.log('Migrated plans data to include tags field');
    }
}

//MOVED from form-handlers
function openPlanModal(planData = null) {
    const modalTitle = document.getElementById('plan-modal-title');
    
    if (planData) {
        modalTitle.textContent = 'Edit Story Arc';
        // Create working copies for editing
        currentEditingEvents = planData.events ? JSON.parse(JSON.stringify(planData.events)) : [];
        currentEditingSubArcs = planData.subArcs ? JSON.parse(JSON.stringify(planData.subArcs)) : []; // NEW
        document.getElementById('plan-color').value = '#3498db';
        document.getElementById('plan-color-picker').value = '#3498db';
        document.getElementById('plan-type').value = 'main-plot';
        populatePlanModal(planData);
    } else {
        modalTitle.textContent = 'Add Story Arc';
        currentEditingEvents = []; // Start with empty events for new arc
        currentEditingSubArcs = []; // NEW: Start with empty sub-arcs
        clearModalFields('planModal');
    }
    
    openModal('planModal');
    
    // Set up character tag autocomplete
    setupCharacterTagAutocomplete();
    setupPlanColorInputs();
}

function populatePlanModal(plan) {
    document.getElementById('plan-title').value = plan.title || '';
    document.getElementById('plan-overview').value = plan.overview || '';
    document.getElementById('plan-character-tags').value = (plan.characterTags || []).join(', ');
    document.getElementById('plan-filter-tags').value = (plan.tags || []).join(', '); // NEW
    document.getElementById('plan-color').value = plan.color || '#3498db';
    document.getElementById('plan-type').value = plan.type || 'main-plot';
    
    const colorPicker = document.getElementById('plan-color-picker');
    if (colorPicker) {
        colorPicker.value = plan.color || '#3498db';
    }

    // Create working copies for editing
    currentEditingEvents = plan.events ? JSON.parse(JSON.stringify(plan.events)) : [];
    currentEditingSubArcs = plan.subArcs ? JSON.parse(JSON.stringify(plan.subArcs)) : [];
    
    updateEventsListInModal(currentEditingEvents);
    updateSubArcsListInModal(currentEditingSubArcs);
}

// UPDATED: Save plan with auto-collected character tags
function savePlan() {
    // Collect character tags from all events (main + sub-arc events)
    const autoCollectedTags = collectCharacterTagsFromEvents(currentEditingEvents, currentEditingSubArcs);
    
    // Get manually entered character tags
    const manualCharacterTags = document.getElementById('plan-character-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    // Combine and deduplicate character tags
    const allCharacterTags = [...new Set([...manualCharacterTags, ...autoCollectedTags])];
    
    // NEW: Get filter tags (separate from character tags)
    const filterTags = document.getElementById('plan-filter-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    const planData = {
        title: document.getElementById('plan-title').value.trim(),
        overview: document.getElementById('plan-overview').value.trim(),
        characterTags: allCharacterTags, // Keep existing character tags
        tags: filterTags, // NEW: Add filter tags field
        color: document.getElementById('plan-color').value.trim() || '#3498db',
        type: document.getElementById('plan-type').value.trim() || 'main-plot',
        events: [...currentEditingEvents],
        subArcs: [...currentEditingSubArcs]
    };

    // Validation
    if (!planData.title) {
        alert('Arc title is required!');
        return;
    }

    if (editingIndex >= 0 && editingType === 'plan') {
        infoData.plans[editingIndex] = planData;
    } else {
        infoData.plans.push(planData);
    }

    updateContentList('plans');
    closeModal('planModal');
    markDataAsModified();
}

function setupPlanColorInputs() {
    const colorText = document.getElementById('plan-color');
    const colorPicker = document.getElementById('plan-color-picker');
    
    if (colorText && colorPicker) {
        // Sync picker to text input
        colorText.addEventListener('input', () => {
            const color = colorText.value.trim();
            if (isValidHexColor(color)) {
                colorPicker.value = color;
            }
        });
        
        // Sync text input to picker
        colorPicker.addEventListener('input', () => {
            colorText.value = colorPicker.value;
        });
    }
}

function setupSubArcColorInputs() {
    const colorText = document.getElementById('subarc-color');
    const colorPicker = document.getElementById('subarc-color-picker');
    
    if (colorText && colorPicker) {
        // Sync picker to text input
        colorText.addEventListener('input', () => {
            const color = colorText.value.trim();
            if (isValidHexColor(color)) {
                colorPicker.value = color;
            }
        });
        
        // Sync text input to picker
        colorPicker.addEventListener('input', () => {
            colorText.value = colorPicker.value;
        });
    }
}

// NEW: Functions for managing sub-arcs
function addSubArc() {
    editingSubArcIndex = -1; // Reset sub-arc editing index
    openSubArcModal();
}

function editSubArc(subArcIndex) {
    if (subArcIndex >= 0 && subArcIndex < currentEditingSubArcs.length) {
        openSubArcModal(currentEditingSubArcs[subArcIndex], subArcIndex);
    }
}

function deleteSubArc(subArcIndex) {
    if (subArcIndex >= 0 && subArcIndex < currentEditingSubArcs.length) {
        const subArcTitle = currentEditingSubArcs[subArcIndex].title || 'Untitled Sub-Arc';
        if (confirm(`Are you sure you want to delete the sub-arc "${subArcTitle}" and all its events?`)) {
            currentEditingSubArcs.splice(subArcIndex, 1);
            updateSubArcsListInModal(currentEditingSubArcs);
            markDataAsModified();
        }
    }
}

// NEW: Sub-Arc modal functions
function openSubArcModal(subArcData = null, subArcIndex = -1) {
    const modalTitle = document.getElementById('subarc-modal-title');
    
    if (subArcData) {
        modalTitle.textContent = 'Edit Sub-Arc';
        // Create working copy of events for editing
        currentEditingSubArcEvents = subArcData.events ? 
            JSON.parse(JSON.stringify(subArcData.events)) : [];
        populateSubArcModal(subArcData);
    } else {
        modalTitle.textContent = 'Add Sub-Arc';
        // Start with empty events for new sub-arc
        currentEditingSubArcEvents = [];
        clearModalFields('subArcModal');
        // Set default color for new sub-arcs
        document.getElementById('subarc-color').value = '#e74c3c';
        document.getElementById('subarc-color-picker').value = '#e74c3c';
        document.getElementById('subarc-type').value = '';
    }
    
    editingSubArcIndex = subArcIndex;
    openModal('subArcModal');
    
    // Set up character tag autocomplete for sub-arc
    setupSubArcCharacterTagAutocomplete();
    // Set up color input synchronization
    setupSubArcColorInputs();
}

// UPDATED: Save sub-arc with auto-collected character tags
function saveSubArc() {
    // Collect character tags from sub-arc events
    const autoCollectedTags = collectCharacterTagsFromSubArcEvents(currentEditingSubArcEvents);
    
    // Get manually entered tags
    const manualTags = document.getElementById('subarc-character-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    // Combine and deduplicate
    const allTags = [...new Set([...manualTags, ...autoCollectedTags])];
    
    const subArcData = {
        title: document.getElementById('subarc-title').value.trim(),
        description: document.getElementById('subarc-description').value.trim(),
        characterTags: allTags, // Use combined tags
        color: document.getElementById('subarc-color').value.trim(),
        type: document.getElementById('subarc-type').value.trim(),
        visible: document.getElementById('subarc-visible').checked,
        events: [...currentEditingSubArcEvents]
    };

    // Validation
    if (!subArcData.title) {
        alert('Sub-arc title is required!');
        return;
    }

    if (editingSubArcIndex >= 0) {
        currentEditingSubArcs[editingSubArcIndex] = subArcData;
    } else {
        currentEditingSubArcs.push(subArcData);
    }

    updateSubArcsListInModal(currentEditingSubArcs);
    closeModal('subArcModal');
    markDataAsModified();
    
    // Show a message if tags were auto-collected
    if (autoCollectedTags.length > 0) {
        console.log(`Auto-collected character tags from sub-arc events: ${autoCollectedTags.join(', ')}`);
    }
}

// NEW: Add event to currently editing sub-arc
function addEventToSubArc() {
    editingEventIndex = -1;
    editingEventContext = 'subarc';
    openEventModal(null, -1, 'subarc');
}

function updateEventsListInModal(events) {
    const container = document.getElementById('events-list-container');
    if (!container) return;
    
    if (!events || events.length === 0) {
        container.innerHTML = '<div class="empty-state">No main events added yet</div>';
        return;
    }
    
    container.innerHTML = '';
    events.forEach((event, index) => {
        const eventElement = createEventElement(event, index, 'main');
        container.appendChild(eventElement);
    });
    
    // Add drag and drop functionality
    initializeEventDragDrop(container);
}

// NEW: Update sub-arcs list in modal
function updateSubArcsListInModal(subArcs) {
    const container = document.getElementById('subarcs-list-container');
    if (!container) return;
    
    if (!subArcs || subArcs.length === 0) {
        container.innerHTML = '<div class="empty-state">No sub-arcs added yet</div>';
        return;
    }
    
    container.innerHTML = '';
    subArcs.forEach((subArc, index) => {
        const subArcElement = createSubArcElement(subArc, index);
        container.appendChild(subArcElement);
    });

    // Add drag and drop functionality
    initializeSubArcDragDrop(container);  // ADD THIS LINE
}

// UPDATED: Functions for managing events within plans (now with context support)
function addEventToPlan(context = 'main') {
    editingEventIndex = -1; // Reset event editing index
    editingEventContext = context; // NEW: Set context
    openEventModal(null, -1, context);
}

function editEventInPlan(eventIndex, context = 'main') {
    editingEventContext = context; // Set context
    
    if (context === 'subarc') {
        // Editing an event within the currently selected sub-arc
        if (eventIndex >= 0 && eventIndex < currentEditingSubArcEvents.length) {
            openEventModal(currentEditingSubArcEvents[eventIndex], eventIndex, context);
        }
    } else {
        // Editing a main event
        if (eventIndex >= 0 && eventIndex < currentEditingEvents.length) {
            openEventModal(currentEditingEvents[eventIndex], eventIndex, context);
        }
    }
}

function deleteEventFromPlan(eventIndex, context = 'main') {
    if (context === 'subarc') {
        // Deleting an event from a sub-arc
        if (eventIndex >= 0 && eventIndex < currentEditingSubArcEvents.length) {
            currentEditingSubArcEvents.splice(eventIndex, 1);
            updateSubArcEventsListInModal(currentEditingSubArcEvents);
            markDataAsModified();
        }
    } else {
        // Deleting a main event
        if (eventIndex >= 0 && eventIndex < currentEditingEvents.length) {
            currentEditingEvents.splice(eventIndex, 1);
            updateEventsListInModal(currentEditingEvents);
            markDataAsModified();
        }
    }
}

//
// Toggle subevents section visibility
function toggleSubeventsSection() {
    const container = document.getElementById('subevents-container');
    const arrow = document.getElementById('subevents-arrow');
    
    if (container && arrow) {
        if (container.classList.contains('collapsed')) {
            container.classList.remove('collapsed');
            arrow.innerHTML = '&#9660;';
        } else {
            container.classList.add('collapsed');
            arrow.innerHTML = '&#9654;';
        }
    }
}

// Update subevent count display
function updateSubeventCount() {
    const countElement = document.getElementById('subevents-count');
    if (countElement) {
        const count = currentEditingSubevents.length;
        countElement.textContent = count > 0 ? `(${count})` : '(0)';
    }
}

// Display subevents in the event modal list
function updateSubeventsDisplay() {
    const container = document.getElementById('subevents-list');
    if (!container) return;
    
    if (currentEditingSubevents.length === 0) {
        container.innerHTML = '<div class="empty-state">No character moments added yet</div>';
        updateSubeventCount();
        return;
    }
    
    container.innerHTML = '';
    currentEditingSubevents.forEach((subevent, index) => {
        const subeventElement = createSubeventElement(subevent, index);
        container.appendChild(subeventElement);
    });
    
    updateSubeventCount();
}

// Create a subevent element (styled like content items)
// Create a subevent element (styled like content items)
function createSubeventElement(subevent, index) {
    const element = document.createElement('div');
    element.className = 'subevent-item';
    element.draggable = true;
    
    const characterTags = subevent.characterTags && subevent.characterTags.length > 0
        ? subevent.characterTags.map(tag => `<span class="character-tag small">${tag}</span>`).join(' ')
        : '<span class="no-tags">No characters</span>';
    
    element.innerHTML = `
        <div class="subevent-content">
            <div class="subevent-description">${subevent.description || 'Untitled moment'}</div>
            <div class="subevent-tags">${characterTags}</div>
        </div>
        <div class="subevent-actions">
            <button class="btn-edit" onclick="editSubevent(${index})" title="Edit">Edit</button>
            <button class="btn-delete" onclick="deleteSubevent(${index})" title="Delete">Delete</button>
        </div>
    `;
    
    return element;
}

// Open subevent modal for adding/editing
function openSubeventModal(subeventIndex = -1) {
    const modalTitle = document.getElementById('subevent-modal-title');
    
    if (subeventIndex >= 0) {
        modalTitle.textContent = 'Edit Character Moment';
        const subevent = currentEditingSubevents[subeventIndex];
        populateSubeventModal(subevent);
        editingSubeventIndex = subeventIndex;
    } else {
        modalTitle.textContent = 'Add Character Moment';
        clearSubeventModalFields();
        editingSubeventIndex = -1;
    }
    
    openModal('subeventModal');
}

// Populate subevent modal with data
function populateSubeventModal(subevent) {
    document.getElementById('subevent-description').value = subevent.description || '';
    document.getElementById('subevent-character-tags').value = (subevent.characterTags || []).join(', ');
}

// Clear subevent modal fields
function clearSubeventModalFields() {
    document.getElementById('subevent-description').value = '';
    document.getElementById('subevent-character-tags').value = '';
}

// Save subevent
function saveSubevent() {
    const characterTagsInput = document.getElementById('subevent-character-tags').value.trim();
    const characterTags = characterTagsInput 
        ? characterTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
    
    const subeventData = {
        description: document.getElementById('subevent-description').value.trim(),
        characterTags: characterTags
    };
    
    // Validation
    if (!subeventData.description) {
        alert('Description is required!');
        return;
    }
    
    if (editingSubeventIndex >= 0) {
        // Editing existing subevent
        currentEditingSubevents[editingSubeventIndex] = subeventData;
    } else {
        // Adding new subevent
        currentEditingSubevents.push(subeventData);
    }
    
    updateSubeventsDisplay();
    closeModal('subeventModal');
}

// Edit subevent
function editSubevent(index) {
    openSubeventModal(index);
}

// Delete subevent
function deleteSubevent(index) {
    const subevent = currentEditingSubevents[index];
    if (confirm(`Delete character moment: "${subevent.description}"?`)) {
        currentEditingSubevents.splice(index, 1);
        updateSubeventsDisplay();
    }
}

// Event listener setup for subevent functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add subevent button
    const addSubeventBtn = document.getElementById('add-subevent-btn');
    if (addSubeventBtn) {
        addSubeventBtn.addEventListener('click', () => openSubeventModal());
    }
    
    // Save subevent button
    const saveSubeventBtn = document.getElementById('save-subevent');
    if (saveSubeventBtn) {
        saveSubeventBtn.addEventListener('click', saveSubevent);
    }
});

// Update populateEventModal function to include subevents
function populateEventModal(event) {
    document.getElementById('event-title').value = event.title || '';
    document.getElementById('event-type').value = event.type || 'rising';
    document.getElementById('event-character-tags').value = (event.characterTags || []).join(', ');
    document.getElementById('event-timing').value = event.timing || '';
    document.getElementById('event-notes').value = event.notes || '';
    
    // Set selected storylines in custom dropdown
    const storylineLinks = event.storylineLinks || [];
    selectedStorylines = [...storylineLinks];
    updateStorylineDisplay();
    updateStorylineOptions();
    
    document.getElementById('event-image').value = event.image || '';
    document.getElementById('event-visible').checked = event.visible !== false;
    
    // IMPORTANT: Load subevents/character moments properly
    currentEditingSubevents = event.subevents ? JSON.parse(JSON.stringify(event.subevents)) : [];
    editingSubeventIndex = -1; // Reset subevent editing index
    
    if (typeof updateSubeventsDisplay === 'function') {
        updateSubeventsDisplay();
        
        // Collapse subevents section by default
        const subeventsContainer = document.getElementById('subevents-container');
        const subeventsArrow = document.getElementById('subevents-arrow');
        if (subeventsContainer && subeventsArrow) {
            subeventsContainer.classList.add('collapsed');
            subeventsArrow.innerHTML = '&#9654;'
        }
    }
}

// Update saveEvent function to include subevents
function saveEvent() {
    console.log('=== SAVE EVENT DEBUG ===');
    console.log('Current editing context:', editingEventContext);
    console.log('Current editing subevents:', currentEditingSubevents);
    console.log('Event index:', editingEventIndex);
    
    const characterTagsInput = document.getElementById('event-character-tags').value.trim();
    const characterTags = characterTagsInput 
        ? characterTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
    
    const eventData = {
        title: document.getElementById('event-title').value.trim(),
        type: document.getElementById('event-type').value,
        characterTags: characterTags,
        timing: document.getElementById('event-timing').value.trim(),
        notes: document.getElementById('event-notes').value.trim(),
        storylineLinks: selectedStorylines.slice(),
        image: document.getElementById('event-image').value.trim(),
        visible: document.getElementById('event-visible').checked,
        subevents: currentEditingSubevents ? JSON.parse(JSON.stringify(currentEditingSubevents)) : []
    };
    
    console.log('Event data being saved:', eventData);
    console.log('Subevents being saved:', eventData.subevents);
    
    // Validation
    if (!eventData.title) {
        alert('Event title is required!');
        return;
    }
    
    // Save based on context (main arc vs sub-arc)
    if (editingEventContext === 'main') {
        if (editingEventIndex >= 0) {
            currentEditingEvents[editingEventIndex] = eventData;
            console.log('Updated main event at index:', editingEventIndex);
        } else {
            currentEditingEvents.push(eventData);
            console.log('Added new main event');
        }
        console.log('Current editing events after save:', currentEditingEvents);
        updateEventsListInModal(currentEditingEvents);
    } else if (editingEventContext === 'subarc') {
        if (editingEventIndex >= 0) {
            currentEditingSubArcEvents[editingEventIndex] = eventData;
            console.log('Updated subarc event at index:', editingEventIndex);
        } else {
            currentEditingSubArcEvents.push(eventData);
            console.log('Added new subarc event');
        }
        console.log('Current editing subarc events after save:', currentEditingSubArcEvents);
        updateSubArcEventsListInModal(currentEditingSubArcEvents);
    }
    
    closeModal('eventModal');
    markDataAsModified();
}

// NEW: Function to collect character tags from all events in an arc
function collectCharacterTagsFromEvents(events, subArcs = []) {
    const allTags = new Set();
    
    // Collect from main events
    if (events && Array.isArray(events)) {
        events.forEach(event => {
            if (event.characterTags && Array.isArray(event.characterTags)) {
                event.characterTags.forEach(tag => allTags.add(tag));
            }
        });
    }
    
    // Collect from sub-arc events
    if (subArcs && Array.isArray(subArcs)) {
        subArcs.forEach(subArc => {
            if (subArc.events && Array.isArray(subArc.events)) {
                subArc.events.forEach(event => {
                    if (event.characterTags && Array.isArray(event.characterTags)) {
                        event.characterTags.forEach(tag => allTags.add(tag));
                    }
                });
            }
        });
    }
    
    return Array.from(allTags);
}

// NEW: Function to collect character tags from sub-arc events
function collectCharacterTagsFromSubArcEvents(events) {
    const allTags = new Set();
    
    if (events && Array.isArray(events)) {
        events.forEach(event => {
            if (event.characterTags && Array.isArray(event.characterTags)) {
                event.characterTags.forEach(tag => allTags.add(tag));
            }
        });
    }
    
    return Array.from(allTags);
}



function populateSubArcModal(subArc) {
    document.getElementById('subarc-title').value = subArc.title || '';
    document.getElementById('subarc-description').value = subArc.description || '';
    document.getElementById('subarc-character-tags').value = (subArc.characterTags || []).join(', ');
    document.getElementById('subarc-color').value = subArc.color || '#e74c3c';
    document.getElementById('subarc-color-picker').value = subArc.color || '#e74c3c';
    document.getElementById('subarc-type').value = subArc.type || '';
    document.getElementById('subarc-visible').checked = subArc.visible !== false;
    
    // Populate sub-arc events list using working copy
    updateSubArcEventsListInModal(currentEditingSubArcEvents);
}

function setupSubArcCharacterTagAutocomplete() {
    const input = document.getElementById('subarc-character-tags');
    if (!input) return;
    
    // Get all character names for autocomplete
    const characterNames = infoData.characters.map(char => char.name).filter(name => name);
    
    // Simple autocomplete implementation
    input.addEventListener('input', function(e) {
        const value = e.target.value;
        const lastComma = value.lastIndexOf(',');
        
        if (lastComma > -1) {
            const currentTag = value.substring(lastComma + 1).trim();
            // Add autocomplete suggestions logic here if needed
        }
    });
}

function updateSubArcEventsListInModal(events) {
    const container = document.getElementById('subarc-events-list-container');
    if (!container) return;
    
    if (!events || events.length === 0) {
        container.innerHTML = '<div class="empty-state">No events added yet</div>';
        return;
    }
    
    container.innerHTML = '';
    events.forEach((event, index) => {
        const eventElement = createEventElement(event, index, 'subarc');
        container.appendChild(eventElement);
    });
    
    // Add drag and drop functionality
    initializeEventDragDrop(container);
}

function setupCharacterTagAutocomplete() {
    const input = document.getElementById('plan-character-tags');
    if (!input) return;
    
    // Get all character names for autocomplete
    const characterNames = infoData.characters.map(char => char.name).filter(name => name);
    
    // Simple autocomplete implementation
    input.addEventListener('input', function(e) {
        // Could implement more sophisticated autocomplete here
        // For now, just basic functionality
        const value = e.target.value;
        const lastComma = value.lastIndexOf(',');
        
        if (lastComma > -1) {
            const currentTag = value.substring(lastComma + 1).trim();
            // Add autocomplete suggestions logic here if needed
        }
    });
}

// NEW: Create sub-arc element for display in plan modal
function createSubArcElement(subArc, index) {
    const subArcDiv = document.createElement('div');
    subArcDiv.className = 'subarc-item';
    subArcDiv.draggable = true;  // ADD THIS LINE
    subArcDiv.setAttribute('data-index', index);
    
    const visibilityBadge = subArc.visible === false ? '<span class="hidden-badge">Hidden</span>' : '';
    const characterTags = subArc.characterTags && subArc.characterTags.length > 0 
        ? subArc.characterTags.join(', ') 
        : 'No characters tagged';
    const eventCount = subArc.events ? subArc.events.length : 0;
    const visibleEventCount = subArc.events ? subArc.events.filter(e => e.visible !== false).length : 0;
    
    subArcDiv.innerHTML = `
        <div class="subarc-content">
            <div class="subarc-header">
                <div class="subarc-title">${subArc.title || 'Untitled Sub-Arc'}</div>
                ${visibilityBadge}
            </div>
            <div class="subarc-description">${subArc.description || 'No description'}</div>
            <div class="subarc-meta">
                <div class="subarc-characters">Characters: ${characterTags}</div>
                <div class="subarc-event-count">Events: ${visibleEventCount}/${eventCount}</div>
            </div>
        </div>
        <div class="subarc-actions">
            <button type="button" class="btn-small btn-edit" onclick="editSubArc(${index})">Edit</button>
            <button type="button" class="btn-small btn-delete" onclick="deleteSubArc(${index})">Delete</button>
        </div>
    `;
    
    if (subArc.visible === false) {
        subArcDiv.classList.add('hidden-item');
    }
    
    return subArcDiv;
}

// UPDATED: Create event element with character tags display
// UPDATED: createEventElement function with improved layout  
function createEventElement(event, index, context = 'main') {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event-item';
    eventDiv.draggable = true;
    eventDiv.setAttribute('data-index', index);
    eventDiv.setAttribute('data-context', context);
    
    // Get event type badge color based on current appearance
    const colors = (typeof getColorScheme === 'function') ? 
        getColorScheme() : {};
    let typeColor = colors.textSecondary || '#6c757d';
    
    switch (event.type) {
        case 'rising':
            typeColor = colors.statusCanon || '#28a745';
            break;
        case 'setback':
            typeColor = colors.statusIdea || '#dc3545';
            break;
        case 'climax':
            typeColor = colors.statusDraft || '#ffc107';
            break;
    }
    
    const visibilityBadge = event.visible === false ? '<span class="hidden-badge">Hidden</span>' : '';
    
    // NEW: Character tags display with better alignment
    const characterTags = event.characterTags && event.characterTags.length > 0 
        ? event.characterTags.map(tag => `<span class="character-tag-small">${tag}</span>`).join(' ')
        : '';
    const characterTagsDisplay = characterTags ? `<div class="event-character-tags"><span class="characters-label">Characters:</span> ${characterTags}</div>` : '';
    
    eventDiv.innerHTML = `
        <div class="event-content">
            <div class="event-header">
                <div class="event-type-badge" style="background-color: ${typeColor}">
                    ${getEventTypeDisplay(event.type)}
                </div>
                <div class="event-title">${event.title || 'Untitled Event'}</div>
                ${visibilityBadge}
            </div>
            ${characterTagsDisplay}
            <div class="event-bottom-info">
                ${event.timing ? `<span class="event-timing-badge">${event.timing}</span>` : ''}
                ${event.notes ? `<div class="event-notes-preview">Has notes</div>` : ''}
            </div>
        </div>
        <div class="event-actions">
            <button type="button" class="btn-small btn-edit" onclick="editEventInPlan(${index}, '${context}')">Edit</button>
            <button type="button" class="btn-small btn-delete" onclick="deleteEventFromPlan(${index}, '${context}')">Delete</button>
        </div>
    `;
    
    if (event.visible === false) {
        eventDiv.classList.add('hidden-item');
    }
    
    return eventDiv;
}

function getEventTypeDisplay(type) {
    const typeMap = {
        'rising': 'Rising',
        'setback': 'Setback',
        'climax': 'Climax'
    };
    return typeMap[type] || 'Rising';
}

// NEW: Setup character tag autocomplete for events
function setupEventCharacterTagAutocomplete() {
    const input = document.getElementById('event-character-tags');
    if (!input) return;
    
    // Get all character names for autocomplete
    const characterNames = infoData.characters.map(char => char.name).filter(name => name);
    
    // Simple autocomplete implementation
    input.addEventListener('input', function(e) {
        const value = e.target.value;
        const lastComma = value.lastIndexOf(',');
        
        if (lastComma > -1) {
            const currentTag = value.substring(lastComma + 1).trim();
            // Add autocomplete suggestions logic here if needed
        }
    });
}

// UPDATED: Event modal functions with character tags support
function openEventModal(eventData = null, eventIndex = -1, context = 'main') {
    const modalTitle = document.getElementById('event-modal-title');
    
    editingEventIndex = eventIndex;
    editingEventContext = context;
    
    // Set up the dropdown first
    setupStorylineDropdown();
    
    if (eventData) {
        modalTitle.textContent = 'Edit Event';
        populateEventModal(eventData);
    } else {
        modalTitle.textContent = 'Add Event';
        clearModalFields('eventModal');
        // IMPORTANT: Reset character moments for new events
        currentEditingSubevents = [];
        editingSubeventIndex = -1;
        // Reset for new events
        selectedStorylines = [];
        updateStorylineDisplay();
        
        // Clear the subevents display
        if (typeof updateSubeventsDisplay === 'function') {
            updateSubeventsDisplay();
        }
    }
    
    openModal('eventModal');
    setupEventCharacterTagAutocomplete();
}

// NEW: Custom storyline dropdown functions
let selectedStorylines = [];

function toggleStorylineDropdown() {
    const options = document.getElementById('event-storyline-options');
    const isVisible = options.style.display !== 'none';
    options.style.display = isVisible ? 'none' : 'block';
}

function toggleStorylineOption(storylineTitle) {
    const index = selectedStorylines.indexOf(storylineTitle);
    
    if (index > -1) {
        // Remove if already selected
        selectedStorylines.splice(index, 1);
    } else {
        // Add if not selected
        selectedStorylines.push(storylineTitle);
    }
    
    updateStorylineDisplay();
    updateStorylineOptions();
}

function updateStorylineDisplay() {
    const textSpan = document.getElementById('storyline-selected-text');
    if (selectedStorylines.length === 0) {
        textSpan.textContent = 'Click to select storylines...';
    } else if (selectedStorylines.length === 1) {
        textSpan.textContent = selectedStorylines[0];
    } else {
        textSpan.textContent = `${selectedStorylines.length} storylines selected`;
    }
}

function updateStorylineOptions() {
    const options = document.querySelectorAll('.storyline-option');
    options.forEach(option => {
        const title = option.textContent;
        if (selectedStorylines.includes(title)) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// NEW: Setup custom storyline dropdown in event modal
function setupStorylineDropdown() {
    const container = document.getElementById('event-storyline-options');
    if (!container) return;
    
    container.innerHTML = '';
    selectedStorylines = []; // Reset selections
    
    if (!infoData.storylines || infoData.storylines.length === 0) {
        container.innerHTML = '<div style="padding: 8px; color: #666; font-style: italic;">No storylines available</div>';
        return;
    }
    
    infoData.storylines.forEach((storyline) => {
        const option = document.createElement('div');
        option.className = 'storyline-option';
        option.textContent = storyline.title;
        option.onclick = () => toggleStorylineOption(storyline.title);
        container.appendChild(option);
    });
    
    updateStorylineDisplay();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const container = document.getElementById('event-storyline-container');
        if (container && !container.contains(e.target)) {
            document.getElementById('event-storyline-options').style.display = 'none';
        }
    });
}

// Generate the existing cards view
// Generate the existing cards view
function generateCardsView(data) {    
    // Collect all unique VISIBLE filter tags from plans (plan.tags, not characterTags)
    const allPlanTags = new Set();
    data.plans.forEach(plan => {
        if (plan.tags && plan.tags.length > 0) {
            const visibleTags = getVisibleTags(plan.tags);
            visibleTags.forEach(tag => allPlanTags.add(tag));
        }
    });
    const tagsArray = Array.from(allPlanTags).sort();

    let cardsHTML = '';
    
    // FIXED: Always add filter navigation container, even with no tags
    cardsHTML += `
        <div class="character-navigation">
            <div class="character-nav-header" onclick="togglePlanNavigation()">
                <span class="character-nav-title">Filter Plans</span>
                <span class="character-nav-toggle">▶</span>
            </div>
            <div class="character-nav-content collapsed">
                <div class="character-filter-controls">
                    <input type="text" class="character-search" id="plan-search" placeholder="Search plans...">
                    <div class="filter-mode-buttons">
                        <button class="filter-mode-option active" id="plan-filter-mode-any" onclick="setPlanFilterMode('any')">Any</button>
                        <button class="filter-mode-option" id="plan-filter-mode-all" onclick="setPlanFilterMode('all')">All</button>
                    </div>
                    <button class="clear-selected-btn" id="clear-plan-selected-btn" onclick="clearAllPlanTags()">Clear</button>
                </div>`;

    // FIXED: Only conditionally add tag links if tags exist
    if (tagsArray.length > 0) {
        cardsHTML += '<div class="character-tag-links">';
        tagsArray.forEach(tag => {
            const parsed = parseTagWithColor(tag);
            let styleAttr = '';
            if (parsed.bgColor) {
                const textColor = parsed.textColor || getContrastingTextColor(parsed.bgColor);
                const hoverColor = parsed.hoverColor || parsed.bgColor;
                styleAttr = ` style="background-color: ${parsed.bgColor}; color: ${textColor}; --hover-color: ${hoverColor};"`;
            }
            const escapedTag = tag.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");
            cardsHTML += `<div class="character-tag-link" onclick="togglePlanTag('${escapedTag}')"${styleAttr}>${parsed.name}</div>`;
        });
        cardsHTML += '</div>';
    }

    cardsHTML += `
            </div>
        </div>`;

    cardsHTML += '<div class="plans-grid">';
    
    data.plans.forEach((plan, index) => {
        // Character tags display - show only visible character tags
        let characterTagsDisplay = '<span style="color: #999; font-style: italic;">No characters tagged</span>';
        if (plan.characterTags && plan.characterTags.length > 0) {
            const visibleCharacterTags = getVisibleTags(plan.characterTags);
            if (visibleCharacterTags.length > 0) {
                characterTagsDisplay = visibleCharacterTags.map(tag => `<span class="character-tag">${tag}</span>`).join('');
            }
        }
        
        const mainEvents = plan.events ? plan.events.filter(event => event.visible !== false) : [];
        const totalMainEvents = mainEvents.length;
        
        // Count subevents in main events
        let totalSubeventsMain = 0;
        mainEvents.forEach(event => {
            if (event.subevents && Array.isArray(event.subevents)) {
                totalSubeventsMain += event.subevents.length;
            }
        });
        
        let totalSubArcEvents = 0;
        let totalSubeventsSubArc = 0;
        const visibleSubArcs = plan.subArcs ? plan.subArcs.filter(subArc => subArc.visible !== false) : [];
        
        visibleSubArcs.forEach(subArc => {
            if (subArc.events) {
                const visibleSubArcEvents = subArc.events.filter(event => event.visible !== false);
                totalSubArcEvents += visibleSubArcEvents.length;
                
                visibleSubArcEvents.forEach(event => {
                    if (event.subevents && Array.isArray(event.subevents)) {
                        totalSubeventsSubArc += event.subevents.length;
                    }
                });
            }
        });
        
        const totalEvents = totalMainEvents + totalSubArcEvents;
        const totalSubevents = totalSubeventsMain + totalSubeventsSubArc;
        
        // Create data attributes for filtering - use plan.tags (stripped of "!")
        const tagsData = plan.tags ? plan.tags.map(stripHiddenPrefix).join(',') : '';
        const nameData = plan.title.toLowerCase();
        
        cardsHTML += `
            <div class="plan-card" 
                data-tags="${tagsData}" 
                data-name="${nameData}" 
                data-plan-color="${plan.color || '#3498db'}"
                onclick="openPlanModal(${index})">
                <div class="plan-header">
                    <div class="plan-title">${plan.title}</div>
                </div>
                <div class="plan-character-tags">
                    <strong>Characters:</strong> ${characterTagsDisplay}
                </div>
                <div class="plan-overview">${parseMarkdown(plan.overview || 'No overview provided.')}</div>
                <div class="plan-stats">
                    ${totalEvents} events • ${totalSubevents} moments • ${visibleSubArcs.length} sub-arcs
                </div>
            </div>`;
    });
    
    cardsHTML += '</div>';
    cardsHTML += `<button class="back-to-top" id="plan-back-to-top" title="Back to top"></button>`;
    
    return cardsHTML;
}

function generatePlanFilteringJavaScript() {
    return `
        // Plan filtering state
        let selectedPlanTags = new Set();
        let planFilterMode = 'any';
        let currentPlanSearchFilter = '';

        // Initialize plan filtering (reusing character filter structure)
        function initializePlanFiltering() {
            const searchInput = document.getElementById('plan-search');
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    currentPlanSearchFilter = this.value.toLowerCase().trim();
                    applyPlanFilters();
                });
            }
        }

        function togglePlanNavigation() {
            const plansSection = document.getElementById('plans');
            if (!plansSection) return;
            
            const content = plansSection.querySelector('.character-nav-content');
            const toggle = plansSection.querySelector('.character-nav-toggle');
            
            if (content && toggle) {
                content.classList.toggle('collapsed');
                toggle.innerHTML = content.classList.contains('collapsed') ? '&#9654;' : '&#9660;';
                
                // Update toggle state for proper styling
                if (content.classList.contains('collapsed')) {
                    toggle.classList.remove('expanded');
                } else {
                    toggle.classList.add('expanded');
                }
            }
        }

        function togglePlanTag(tag) {
            if (typeof selectedPlanTags === 'undefined') {
                window.selectedPlanTags = new Set();
            }
            
            if (selectedPlanTags.has(tag)) {
                selectedPlanTags.delete(tag);
            } else {
                selectedPlanTags.add(tag);
            }
            
            updatePlanTagStates();
            updatePlanClearButtonState();
            applyPlanFilters();
        }

        function updatePlanTagStates() {
            const plansSection = document.getElementById('plans');
            if (!plansSection) return;
            
            plansSection.querySelectorAll('.character-tag-link').forEach(link => {
                const onclickAttr = link.getAttribute('onclick');
                const tagMatch = onclickAttr.match(/togglePlanTag\\('(.+?)'\\)/);
                const fullTag = tagMatch ? tagMatch[1] : link.textContent;
                const strippedTag = stripHiddenPrefix(fullTag);
                
                if (selectedPlanTags.has(strippedTag)) {
                    link.classList.add('selected');
                } else {
                    link.classList.remove('selected');
                }
            });
        }

        function updatePlanClearButtonState() {
            const clearBtn = document.getElementById('clear-plan-selected-btn');
            if (clearBtn) {
                if (selectedPlanTags.size > 0) {
                    clearBtn.classList.add('active');
                } else {
                    clearBtn.classList.remove('active');
                }
            }
        }

        function clearAllPlanTags() {
            selectedPlanTags.clear();
            updatePlanTagStates();
            updatePlanClearButtonState();
            applyPlanFilters();
        }

        function setPlanFilterMode(mode) {
            planFilterMode = mode;
            
            // Update UI
            document.querySelectorAll('#plan-filter-mode-any, #plan-filter-mode-all').forEach(option => {
                option.classList.remove('active');
            });
            document.getElementById(\`plan-filter-mode-\${mode}\`).classList.add('active');
            
            // Reapply filters
            applyPlanFilters();
        }

        function applyPlanFilters() {
            const planCards = document.querySelectorAll('.plan-card');
            
            planCards.forEach(card => {
                const cardTags = card.getAttribute('data-tags').toLowerCase().split(',').filter(tag => tag.trim());
                const cardName = card.getAttribute('data-name');
                
                // Search filter
                const matchesSearch = currentPlanSearchFilter === '' || cardName.includes(currentPlanSearchFilter);
                
                // Tag filter
                let matchesTags = true;
                
                if (selectedPlanTags.size > 0) {
                    const selectedTagsLower = Array.from(selectedPlanTags).map(tag => tag.toLowerCase());
                    
                    if (planFilterMode === 'all') {
                        // Plan must have ALL selected tags
                        matchesTags = selectedTagsLower.every(selectedTag => 
                            cardTags.some(cardTag => cardTag.includes(selectedTag))
                        );
                    } else {
                        // Plan must have ANY selected tag (default)
                        matchesTags = selectedTagsLower.some(selectedTag => 
                            cardTags.some(cardTag => cardTag.includes(selectedTag))
                        );
                    }
                }
                
                // Show/hide card (reusing existing hidden class)
                if (matchesSearch && matchesTags) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Update results count (optional)
            updatePlanResultsCount();
        }

        function updatePlanResultsCount() {
            const visibleCards = document.querySelectorAll('.plan-card:not(.hidden)');
            const totalCards = document.querySelectorAll('.plan-card');
            
            // You can add a results counter display here if desired
            console.log(\`Showing \${visibleCards.length} of \${totalCards.length} plans\`);
        }

        // Function to apply plan colors to cards
        function applyPlanCardColors() {
            const planCards = document.querySelectorAll('.plan-card[data-plan-color]');
            
            planCards.forEach(card => {
                const planColor = card.getAttribute('data-plan-color');
                if (planColor) {
                    // Create a more subtle version of the color for the border
                    const subtleColor = addOpacityToHexColor(planColor, 0.4); // 40% opacity
                    card.style.setProperty('--plan-border-color', subtleColor);
                }
            });
        }

        // Helper function to add opacity to hex colors
        function addOpacityToHexColor(hex, opacity) {
            // Remove # if present
            hex = hex.replace('#', '');
            
            // Parse RGB
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            // Return rgba with opacity
            return \`rgba(\${r}, \${g}, \${b}, \${opacity})\`;
        }

        // Initialize plan filtering when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Add a small delay to ensure elements are rendered
            setTimeout(() => {
                initializePlanFiltering();
                applyPlanCardColors(); 
                
                // Initialize back to top for plans
                const backToTopBtn = document.getElementById('plan-back-to-top');
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
            }, 100);
        });

        // MOVE THESE HERE (at the end, before the closing backtick):
        window.togglePlanNavigation = togglePlanNavigation;
        window.togglePlanTag = togglePlanTag;
        window.setPlanFilterMode = setPlanFilterMode;
        window.clearAllPlanTags = clearAllPlanTags;
        
        // Also add these:
        window.selectedPlanTags = selectedPlanTags;
        window.applyPlanFilters = applyPlanFilters;
        window.updatePlanTagStates = updatePlanTagStates;
        window.updatePlanClearButtonState = updatePlanClearButtonState;
    `;
}

// Main function to generate Plans content with Cards/Timeline tabs
function generatePlansContentWithTimeline(data) {
    let plansHTML = '<div id="plans" class="content">';
    
    if (data.plans && data.plans.length > 0) {
        // Header with tabs
        plansHTML += `
            <div class="plans-header-with-tabs">
                <h2 class="section-title">Story Plans</h2>
                <div class="plans-tabs">
                    <button class="plans-tab active" id="cards-tab" onclick="switchPlansView('cards')">Cards</button>
                    <button class="plans-tab" id="timeline-tab" onclick="switchPlansView('timeline')">Timeline</button>
                </div>
            </div>`;
        
        // Cards View (using your existing generateCardsView function)
        plansHTML += '<div id="cards-view" class="plans-view active">';
        plansHTML += generateCardsView(data);
        plansHTML += '</div>';
        
        // Timeline View (using your existing generateTimelineView function)
        plansHTML += '<div id="timeline-view" class="plans-view">';
        plansHTML += generateTimelineView(data);
        plansHTML += `<button class="back-to-top" id="timeline-back-to-top" title="Back to top"></button>`;
        plansHTML += generateEventNotesModal(); // Add modal
        plansHTML += '</div>';
        
    } else {
        plansHTML += `
            <h2 class="section-title">Story Plans</h2>
            <div class="empty-content">
                <h3>No Story Plans</h3>
                <p>No story arcs have been added yet.</p>
            </div>`;
    }
    
    plansHTML += '</div>';
    return plansHTML;
}

// Make plan functions globally available (similar to timeline-html.js pattern)
if (typeof window !== 'undefined') {
    // Functions called from HTML onclick handlers need to be global
    window.togglePlanNavigation = function() { /* implementation */ };
    window.togglePlanTag = function(tag) { /* implementation */ };  
    window.setPlanFilterMode = function(mode) { /* implementation */ };
    window.clearAllPlanTags = function() { /* implementation */ };
    
    // Functions called from other modules  
    window.generateCardsView = generateCardsView;
    window.generatePlansContentWithTimeline = generatePlansContentWithTimeline;
}

// ============================================================================
// GLOBAL EXPORTS - Only what's actually needed
// ============================================================================

// Functions called from HTML onclick handlers
window.openPlanModal = openPlanModal;
window.savePlan = savePlan;
window.addSubArc = addSubArc;
window.editSubArc = editSubArc;
window.deleteSubArc = deleteSubArc;
window.openSubArcModal = openSubArcModal;
window.saveSubArc = saveSubArc;
window.addEventToPlan = addEventToPlan;
window.editEventInPlan = editEventInPlan;
window.deleteEventFromPlan = deleteEventFromPlan;
window.addEventToSubArc = addEventToSubArc;
window.openEventModal = openEventModal;
window.saveEvent = saveEvent;
window.openSubeventModal = openSubeventModal;
window.saveSubevent = saveSubevent;
window.editSubevent = editSubevent;
window.deleteSubevent = deleteSubevent;
window.toggleSubeventsSection = toggleSubeventsSection;
window.toggleStorylineDropdown = toggleStorylineDropdown;
window.toggleStorylineOption = toggleStorylineOption;

// Functions called from other modules (only if needed)
window.setupPlanColorInputs = setupPlanColorInputs;
window.setupSubArcColorInputs = setupSubArcColorInputs;
window.migratePlanData = migratePlanData;