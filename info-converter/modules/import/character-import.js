// Character Import Functions - PNG Character Card Import System
let parsedCharacterData = null;
let selectedCharacterBookEntries = [];

function openCharacterImport() {
    // Reset state and open file selection modal
    document.getElementById('character-file').value = '';
    document.getElementById('import-character-book').checked = false;
    document.getElementById('import-character-note').checked = false;
    parsedCharacterData = null;
    selectedCharacterBookEntries = [];
    openModal('characterSelectModal');
}

function parseCharacterFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    const isImage = file.type.startsWith('image/');
    const isJson = file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');

    if (!isImage && !isJson) {
        alert('Please select a PNG image file or JSON file containing character card data.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let characterJson;
            
            if (isJson) {
                // Handle JSON files directly
                const jsonString = e.target.result;
                characterJson = JSON.parse(jsonString);
            } else {
                // Handle PNG files (existing logic)
                const arrayBuffer = e.target.result;
                characterJson = extractCharacterDataFromPNG(arrayBuffer);
                
                if (!characterJson) {
                    alert('No character data found in this image. Please make sure it\'s a valid character card.');
                    return;
                }
            }
            
            parsedCharacterData = parseCharacterJson(characterJson);
            
            if (!parsedCharacterData.basicFields.name) {
                alert('Invalid character data found. Please check the file format.');
                return;
            }
            
            console.log('Parsed character data:', parsedCharacterData);
            
            // Check if we need to show character book selection
            const importCharacterBook = document.getElementById('import-character-book').checked;
            
            if (importCharacterBook && parsedCharacterData.characterBookEntries.length > 0) {
                // Close file selection modal and show character book preview
                closeModal('characterSelectModal');
                displayCharacterBookPreview();
            } else {
                // Skip directly to character creation
                closeModal('characterSelectModal');
                populateCharacterModalFromImport();
            }
            
        } catch (error) {
            console.error('Error parsing character file:', error);
            alert('Error reading character card. Please make sure it\'s a valid character card image.');
        }
    };
    
    if (isJson) {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

function extractCharacterDataFromPNG(arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Check for PNG signature
    if (uint8Array[0] !== 0x89 || uint8Array[1] !== 0x50 || uint8Array[2] !== 0x4E || uint8Array[3] !== 0x47) {
        throw new Error('Not a valid PNG file');
    }
    
    let offset = 8; // Skip PNG signature
    
    while (offset < uint8Array.length) {
        // Read chunk length (big-endian)
        const length = (uint8Array[offset] << 24) | (uint8Array[offset + 1] << 16) | 
                      (uint8Array[offset + 2] << 8) | uint8Array[offset + 3];
        offset += 4;
        
        // Read chunk type
        const type = String.fromCharCode(uint8Array[offset], uint8Array[offset + 1], 
                                       uint8Array[offset + 2], uint8Array[offset + 3]);
        offset += 4;
        
        if (type === 'tEXt') {
            // Parse tEXt chunk
            const textData = uint8Array.slice(offset, offset + length);
            const textString = new TextDecoder('latin1').decode(textData);
            
            const nullIndex = textString.indexOf('\0');
            if (nullIndex !== -1) {
                const keyword = textString.slice(0, nullIndex);
                const text = textString.slice(nullIndex + 1);
                
                if (keyword === 'chara') {
                    try {
                        // Decode base64
                        const decodedJson = atob(text);
                        return JSON.parse(decodedJson);
                    } catch (e) {
                        console.error('Error decoding character data:', e);
                        return null;
                    }
                }
            }
        }
        
        offset += length + 4; // Skip chunk data and CRC
    }
    
    return null;
}

function parseCharacterJson(jsonData) {
    const result = {
        basicFields: {
            name: '',
            description: '',
            personality: '',
            scenario: ''
        },
        characterNote: '',
        characterBookEntries: [],
        hasCharacterBook: false,
        hasCharacterNote: false
    };
    
    // Extract main fields
    if (jsonData.data) {
        // V2 format
        result.basicFields.name = jsonData.data.name || '';
        result.basicFields.description = jsonData.data.description || '';
        result.basicFields.personality = jsonData.data.personality || '';
        result.basicFields.scenario = jsonData.data.scenario || '';
        
        // Check for character note (system prompt)
        if (jsonData.data.system_prompt || jsonData.data.post_history_instructions) {
            result.characterNote = (jsonData.data.system_prompt || '') + 
                                 (jsonData.data.post_history_instructions ? '\n\n' + jsonData.data.post_history_instructions : '');
            result.hasCharacterNote = true;
        }
        
        // Extract character book
        if (jsonData.data.character_book && jsonData.data.character_book.entries) {
            result.characterBookEntries = jsonData.data.character_book.entries
                .filter(entry => entry.content && entry.content.trim())
                .map(entry => ({
                    name: entry.comment || entry.keys?.[0] || 'Untitled Entry',
                    content: entry.content,
                    include: false
                }));
            result.hasCharacterBook = result.characterBookEntries.length > 0;
        }
    } else {
        // V1 format fallback
        result.basicFields.name = jsonData.name || '';
        result.basicFields.description = jsonData.description || '';
        result.basicFields.personality = jsonData.personality || '';
        result.basicFields.scenario = jsonData.scenario || '';
    }
    
    return result;
}

function displayCharacterBookPreview() {
    openModal('characterBookPreviewModal');
    
    document.getElementById('character-book-total-count').textContent = parsedCharacterData.characterBookEntries.length;
    updateCharacterBookSelectedCount();
    
    const entriesContainer = document.getElementById('character-book-entries-container');
    entriesContainer.innerHTML = '';
    
    parsedCharacterData.characterBookEntries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'character-book-entry';
        
        entryDiv.innerHTML = `
            <div class="entry-checkbox">
                <input type="checkbox" 
                       id="cb-entry-${index}" 
                       ${entry.include ? 'checked' : ''} 
                       onchange="toggleCharacterBookEntry(${index})">
                <label for="cb-entry-${index}">${entry.name}</label>
            </div>
            <div class="entry-preview">
                <div class="entry-content">${entry.content.substring(0, 200)}${entry.content.length > 200 ? '...' : ''}</div>
            </div>
        `;
        
        entriesContainer.appendChild(entryDiv);
    });
}

function toggleCharacterBookEntry(index) {
    parsedCharacterData.characterBookEntries[index].include = 
        !parsedCharacterData.characterBookEntries[index].include;
    updateCharacterBookSelectedCount();
}

function updateCharacterBookSelectedCount() {
    const selected = parsedCharacterData.characterBookEntries.filter(entry => entry.include).length;
    document.getElementById('character-book-selected-count').textContent = selected;
}

function selectAllCharacterBookEntries() {
    parsedCharacterData.characterBookEntries.forEach(entry => entry.include = true);
    
    // Update checkboxes
    parsedCharacterData.characterBookEntries.forEach((entry, index) => {
        document.getElementById(`cb-entry-${index}`).checked = true;
    });
    
    updateCharacterBookSelectedCount();
}

function selectNoneCharacterBookEntries() {
    parsedCharacterData.characterBookEntries.forEach(entry => entry.include = false);
    
    // Update checkboxes
    parsedCharacterData.characterBookEntries.forEach((entry, index) => {
        document.getElementById(`cb-entry-${index}`).checked = false;
    });
    
    updateCharacterBookSelectedCount();
}

function proceedToCharacterCreation() {
    // Store selected entries
    selectedCharacterBookEntries = parsedCharacterData.characterBookEntries.filter(entry => entry.include);
    
    closeModal('characterBookPreviewModal');
    populateCharacterModalFromImport(); // Changed this line
}

function populateCharacterModalFromImport() {
    // Clear any existing character data
    clearCharacterForm();
    
    // Open character modal
    openModal('characterModal');
    
    // Populate basic fields
    document.getElementById('char-name').value = parsedCharacterData.basicFields.name;
    document.getElementById('char-basic').value = parsedCharacterData.basicFields.description;  
    document.getElementById('char-personality').value = parsedCharacterData.basicFields.personality;
    
    // Build background content
    let backgroundContent = '';
    
    // Add scenario if present
    if (parsedCharacterData.basicFields.scenario) {
        backgroundContent += parsedCharacterData.basicFields.scenario;
    }
    
    // Add character note if requested and present
    const importCharacterNote = document.getElementById('import-character-note').checked;
    if (importCharacterNote && parsedCharacterData.characterNote) {
        if (backgroundContent) backgroundContent += '\n\n';
        backgroundContent += '--- Character Notes ---\n';
        backgroundContent += parsedCharacterData.characterNote;
    }
    
    // Add selected character book entries
    if (selectedCharacterBookEntries.length > 0) {
        if (backgroundContent) backgroundContent += '\n\n';
        backgroundContent += '--- Character Book Entries ---\n';
        selectedCharacterBookEntries.forEach((entry, index) => {
            if (index > 0) backgroundContent += '\n\n';
            backgroundContent += `${entry.name}:\n${entry.content}`;
        });
    }
    
    document.getElementById('char-background').value = backgroundContent;
    
    // Show import success message
    if (typeof showToast === 'function') {
        showToast('Character data imported successfully! Review and save when ready.', 'success');
    }
    
    // Focus on name field for any final edits
    const nameField = document.getElementById('char-name');
    if (nameField) nameField.focus();
}

function clearCharacterForm() {
    const fields = [
        'char-name', 'character-basic', 'character-physical',
        'char-personality', 'character-sexuality', 'character-fighting-style',
        'char-background', 'character-equipment', 'character-hobbies',
        'char-quirks', 'character-relationships'
    ];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) element.value = '';
    });
    
    // Clear image preview
    const imagePreview = document.getElementById('character-image-preview');
    if (imagePreview) {
        imagePreview.style.display = 'none';
        imagePreview.innerHTML = '';
    }
    
    // Reset file input
    const imageInput = document.getElementById('character-image');
    if (imageInput) imageInput.value = '';
}

// Make functions globally available
window.openCharacterImport = openCharacterImport;
window.parseCharacterFile = parseCharacterFile;
window.displayCharacterBookPreview = displayCharacterBookPreview;
window.toggleCharacterBookEntry = toggleCharacterBookEntry;
window.selectAllCharacterBookEntries = selectAllCharacterBookEntries;
window.selectNoneCharacterBookEntries = selectNoneCharacterBookEntries;
window.proceedToCharacterCreation = proceedToCharacterCreation;
window.populateCharacterModalFromImport = populateCharacterModalFromImport;