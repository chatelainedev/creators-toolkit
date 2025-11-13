// Lorebook Import Functions - Updated for two-modal system
let parsedLorebookEntries = [];

function openLorebookImport() {
    // Reset state and open file selection modal
    document.getElementById('lorebook-file').value = '';
    parsedLorebookEntries = [];
    openModal('lorebookSelectModal');
}

function parseLorebookFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            console.log('Loaded lorebook file:', jsonData);
            
            parsedLorebookEntries = extractLorebookEntries(jsonData);
            
            if (parsedLorebookEntries.length === 0) {
                alert('No valid entries found in the lorebook file. Please check the file format.');
                return;
            }
            
            // Close file selection modal and show preview
            closeModal('lorebookSelectModal');
            displayLorebookPreview();
            
        } catch (error) {
            console.error('Error parsing lorebook file:', error);
            alert('Error reading lorebook file. Please make sure it\'s a valid JSON file.');
        }
    };
    
    reader.readAsText(file);
}

function displayLorebookPreview() {
    // Open preview modal
    openModal('lorebookPreviewModal');
    
    // Update counts
    document.getElementById('total-count').textContent = parsedLorebookEntries.length;
    updateSelectedCount();
    
    // Get world categories for dropdown
    const worldCategories = [
        'general', 'locations', 'concepts', 'events', 'creatures', 
        'plants', 'items', 'factions', 'culture', 'cultivation', 'magic'
    ];
    
    // Generate entries container
    const entriesContainer = document.getElementById('lorebook-entries-container');
    entriesContainer.innerHTML = '';
    
    parsedLorebookEntries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'lorebook-entry';
        
        entryDiv.innerHTML = `
            <div class="entry-checkbox">
                <input type="checkbox" 
                       id="entry-${index}" 
                       ${entry.include ? 'checked' : ''} 
                       onchange="toggleEntry(${index}, this.checked)">
            </div>
            
            <div class="entry-name">
                <label for="entry-name-${index}">Entry Name</label>
                <input type="text" 
                       id="entry-name-${index}"
                       value="${escapeHtml(entry.name)}" 
                       onchange="updateEntryName(${index}, this.value)">
            </div>
            
            <div class="entry-category">
                <label for="entry-category-${index}">Category</label>
                <select id="entry-category-${index}" onchange="updateEntryCategory(${index}, this.value)">
                    ${worldCategories.map(cat => {
                        // Get display name with custom labels
                        let displayName;
                        if (cat === 'magic' && infoData.magicOptions?.customLabel) {
                            displayName = infoData.magicOptions.customLabel;
                        } else if (cat === 'cultivation' && infoData.cultivationOptions?.customLabel) {
                            displayName = infoData.cultivationOptions.customLabel;
                        } else {
                            displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
                        }
                        
                        return `<option value="${cat}" ${cat === entry.category ? 'selected' : ''}>
                            ${displayName}
                        </option>`;
                    }).join('')}
                </select>
            </div>
            
            <div class="entry-content">
                <textarea id="entry-content-${index}"
                          onchange="updateEntryContent(${index}, this.value)" 
                          placeholder="Entry content...">${escapeHtml(entry.content)}</textarea>
            </div>
        `;
        
        entriesContainer.appendChild(entryDiv);
    });
}

function backToFileSelection() {
    closeModal('lorebookPreviewModal');
    openModal('lorebookSelectModal');
}

function extractLorebookEntries(jsonData) {
    const entries = [];
    
    // Handle different lorebook formats
    let sourceEntries = [];
    
    // SillyTavern format - entries is an OBJECT with numeric keys, not array
    if (jsonData.entries && typeof jsonData.entries === 'object' && !Array.isArray(jsonData.entries)) {
        // Convert object to array
        sourceEntries = Object.values(jsonData.entries);
        console.log('Found SillyTavern format with object entries:', sourceEntries.length);
    }
    // SillyTavern format - entries array (alternative format)
    else if (jsonData.entries && Array.isArray(jsonData.entries)) {
        sourceEntries = jsonData.entries;
        console.log('Found array entries format:', sourceEntries.length);
    }
    // CharacterHub format - sometimes nested
    else if (jsonData.data && jsonData.data.entries && Array.isArray(jsonData.data.entries)) {
        sourceEntries = jsonData.data.entries;
    }
    // Direct array format
    else if (Array.isArray(jsonData)) {
        sourceEntries = jsonData;
    }
    // Root level entries as object
    else if (jsonData.lorebook && jsonData.lorebook.entries) {
        if (typeof jsonData.lorebook.entries === 'object' && !Array.isArray(jsonData.lorebook.entries)) {
            sourceEntries = Object.values(jsonData.lorebook.entries);
        } else {
            sourceEntries = jsonData.lorebook.entries;
        }
    }
    
    console.log('Found source entries:', sourceEntries.length);
    
    sourceEntries.forEach((entry, index) => {
        // Skip disabled entries
        if (entry.disable === true) {
            console.log('Skipping disabled entry:', entry.comment || entry.uid);
            return;
        }
        
        // Extract name from comment (primary) or fallbacks
        let name = '';
        if (entry.comment && entry.comment.trim()) {
            name = entry.comment.trim();
        } else if (entry.title && entry.title.trim()) {
            name = entry.title.trim();
        } else if (entry.name && entry.name.trim()) {
            name = entry.name.trim();
        } else if (entry.key && Array.isArray(entry.key) && entry.key.length > 0) {
            name = entry.key[0].trim();
        } else if (entry.keys && Array.isArray(entry.keys) && entry.keys.length > 0) {
            name = entry.keys[0].trim();
        } else {
            name = `Entry ${entry.uid || index + 1}`;
        }
        
        // Extract content
        let content = '';
        if (entry.content && entry.content.trim()) {
            content = entry.content.trim();
        } else if (entry.description && entry.description.trim()) {
            content = entry.description.trim();
        } else if (entry.text && entry.text.trim()) {
            content = entry.text.trim();
        }
        
        // Debug logging
        console.log(`Entry ${index}:`, {
            uid: entry.uid,
            comment: entry.comment,
            extractedName: name,
            hasContent: !!content,
            contentLength: content.length
        });
        
        // Skip if no meaningful content
        if (!content) {
            console.log('Skipping entry with no content:', name);
            return;
        }
        
        // Skip if no meaningful name
        if (!name || name.startsWith('Entry ')) {
            console.log('Skipping entry with no proper name:', entry);
            return;
        }
        
        entries.push({
            originalName: name,
            name: name,
            content: content,
            category: 'general', // Default to general
            include: true,
            id: entry.uid || index,
            originalEntry: entry // Keep reference for debugging
        });
    });
    
    console.log('Extracted valid entries:', entries.length);
    entries.forEach((entry, i) => {
        console.log(`Final entry ${i}:`, { name: entry.name, contentLength: entry.content.length });
    });
    
    return entries;
}

function toggleEntry(index, checked) {
    parsedLorebookEntries[index].include = checked;
    updateSelectedCount();
    updateSelectAllCheckbox();
}

function toggleAllEntries(checked) {
    parsedLorebookEntries.forEach((entry, index) => {
        entry.include = checked;
        const checkbox = document.getElementById(`entry-${index}`);
        if (checkbox) checkbox.checked = checked;
    });
    updateSelectedCount();
}

function updateEntryName(index, newName) {
    parsedLorebookEntries[index].name = newName.trim();
}

function updateEntryContent(index, newContent) {
    parsedLorebookEntries[index].content = newContent.trim();
}

function updateEntryCategory(index, newCategory) {
    parsedLorebookEntries[index].category = newCategory;
}

function updateSelectedCount() {
    const selectedCount = parsedLorebookEntries.filter(entry => entry.include).length;
    const selectedCountElement = document.getElementById('selected-count');
    if (selectedCountElement) {
        selectedCountElement.textContent = selectedCount;
    }
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('select-all-entries');
    if (!selectAllCheckbox) return;
    
    const selectedCount = parsedLorebookEntries.filter(entry => entry.include).length;
    const totalCount = parsedLorebookEntries.length;
    
    if (selectedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (selectedCount === totalCount) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

function importSelectedEntries() {
    const selectedEntries = parsedLorebookEntries.filter(entry => entry.include);
    
    if (selectedEntries.length === 0) {
        alert('No entries selected for import.');
        return;
    }
    
    let importedCount = 0;
    let overwriteDecisions = {};
    
    // Process each selected entry
    selectedEntries.forEach(entry => {
        if (!entry.name.trim() || !entry.content.trim()) {
            return; // Skip invalid entries
        }
        
        // Check for duplicates
        const existingIndex = infoData.world[entry.category].findIndex(
            item => item.name.toLowerCase() === entry.name.toLowerCase()
        );
        
        if (existingIndex !== -1) {
            // Handle duplicate
            let decision = overwriteDecisions[entry.name.toLowerCase()];
            
            if (!decision) {
                decision = confirm(
                    `An entry named "${entry.name}" already exists in ${entry.category}.\n\n` +
                    `Click OK to overwrite it, or Cancel to create a separate entry.`
                ) ? 'overwrite' : 'separate';
                
                overwriteDecisions[entry.name.toLowerCase()] = decision;
            }
            
            if (decision === 'overwrite') {
                // Overwrite existing entry
                infoData.world[entry.category][existingIndex].name = entry.name;
                infoData.world[entry.category][existingIndex].description = entry.content;
                importedCount++;
            } else {
                // Create separate entry with unique name
                const uniqueName = generateUniqueName(entry.name, entry.category);
                createWorldEntry(uniqueName, entry.content, entry.category);
                importedCount++;
            }
        } else {
            // No duplicate, create new entry
            createWorldEntry(entry.name, entry.content, entry.category);
            importedCount++;
        }
    });
    
    // Update affected content lists
    const categoriesUpdated = new Set(selectedEntries.map(entry => entry.category));
    categoriesUpdated.forEach(category => updateContentList(category));
    
    // Mark data as modified
    markDataAsModified();
    
    // Show success message and close modal
    if (typeof showToast === 'function') {
        showToast(`Successfully imported ${importedCount} lorebook entries!`, 'success');
    } else if (typeof showStatus === 'function') {
        showStatus('success', `Successfully imported ${importedCount} lorebook entries!`);
    } else {
        alert(`Successfully imported ${importedCount} lorebook entries!`);
    }
    
    closeModal('lorebookPreviewModal');
}

function generateUniqueName(baseName, category) {
    let counter = 2;
    let uniqueName = `${baseName} (${counter})`;
    
    while (infoData.world[category].some(item => 
        item.name.toLowerCase() === uniqueName.toLowerCase()
    )) {
        counter++;
        uniqueName = `${baseName} (${counter})`;
    }
    
    return uniqueName;
}

function createWorldEntry(name, description, category) {
    const newEntry = {
        name: name,
        description: description,
        category: category === 'locations' ? '' : '', // Locations use 'type' instead
        type: category === 'locations' ? '' : undefined,
        image: '',
        properties: category === 'locations' ? undefined : '',
        features: category === 'locations' ? '' : undefined,
        connections: '',
        status: '',
        hidden: false,
        tags: []
    };
    
    // Remove undefined properties
    Object.keys(newEntry).forEach(key => {
        if (newEntry[key] === undefined) {
            delete newEntry[key];
        }
    });
    
    infoData.world[category].push(newEntry);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available
window.openLorebookImport = openLorebookImport;
window.parseLorebookFile = parseLorebookFile;
window.backToFileSelection = backToFileSelection;
window.toggleEntry = toggleEntry;
window.toggleAllEntries = toggleAllEntries;
window.updateEntryName = updateEntryName;
window.updateEntryContent = updateEntryContent;
window.updateEntryCategory = updateEntryCategory;
window.importSelectedEntries = importSelectedEntries;