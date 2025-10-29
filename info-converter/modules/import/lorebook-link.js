// Lorebook Link Management
let linkedLorebookData = null;
let linkedLorebookFilename = null;

function openLorebookLink() {
    if (linkedLorebookData) {
        // Show context menu if lorebook is already linked
        showLorebookContextMenu();
    } else {
        // Open file selection modal
        document.getElementById('lorebook-link-file').value = '';
        openModal('lorebookLinkModal');
    }
}

function linkLorebookFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    if (!currentProject) {
        if (typeof window.showToast === 'function') {
            window.showToast('error', 'Please save your project first before linking lorebooks.');
        } else {
            alert('Please save your project first before linking lorebooks.');
        }
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // Store the lorebook data temporarily
            linkedLorebookData = jsonData;
            linkedLorebookFilename = file.name;
            
            // Save to project folder using the same pattern as image imports
            saveLinkedLorebook(file);
            
        } catch (error) {
            console.error('Error parsing lorebook file:', error);
            if (typeof window.showToast === 'function') {
                window.showToast('error', 'Error reading lorebook file. Please make sure it\'s a valid JSON file.');
            } else {
                alert('Error reading lorebook file. Please make sure it\'s a valid JSON file.');
            }
        }
    };
    
    reader.readAsText(file);
}

async function saveLinkedLorebook(file) {
    if (!isLocal || !userSessionManager) {
        if (typeof window.showToast === 'function') {
            window.showToast('error', 'File system access not available');
        } else {
            alert('File system access not available');
        }
        return;
    }
    
    try {
        // Use the same pattern as image imports
        const formData = new FormData();
        formData.append('file', file); // Note: using 'file' not 'image'
        formData.append('filename', file.name);
        formData.append('folderPath', 'assets/lorebook/');
        
        const userContext = userSessionManager.getUserContext();
        formData.append('projectName', currentProject);
        formData.append('userContext', JSON.stringify(userContext));
        
        if (typeof window.showToast === 'function') {
            window.showToast('info', 'Linking lorebook...', 2000);
        }
        
        const response = await fetch('/api/assets/import-file', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Store in infoData
            infoData.linkedLorebook = {
                filename: file.name,
                data: linkedLorebookData
            };
            markDataAsModified();
            
            // Update UI
            updateLorebookLinkUI();
            
            closeModal('lorebookLinkModal');
      
            if (typeof window.showToast === 'function') {
                window.showToast('success', `Lorebook "${file.name}" linked successfully!`);
            } else {
                alert(`Lorebook "${file.name}" linked successfully!`);
            }
        } else {
            throw new Error(result.error || 'Failed to link lorebook');
        }
        
    } catch (error) {
        console.error('Error linking lorebook:', error);
        if (typeof window.showToast === 'function') {
            window.showToast('error', `Failed to link lorebook: ${error.message}`);
        } else {
            alert(`Failed to link lorebook: ${error.message}`);
        }
    }
}

function showLorebookContextMenu() {
    const contextMenu = document.getElementById('lorebookContextMenu');
    const icon = document.getElementById('lorebook-link-icon');
    const rect = icon.getBoundingClientRect();
    
    contextMenu.style.display = 'block';
    contextMenu.style.left = rect.right + 10 + 'px';
    contextMenu.style.top = rect.top + 'px';
    
    // Hide menu when clicking elsewhere
    document.addEventListener('click', function hideMenu(e) {
        if (!contextMenu.contains(e.target) && !icon.contains(e.target)) {
            contextMenu.style.display = 'none';
            document.removeEventListener('click', hideMenu);
        }
    });
}

function removeLorebookLink() {
    linkedLorebookData = null;
    linkedLorebookFilename = null;
    
    if (infoData.linkedLorebook) {
        delete infoData.linkedLorebook;
        markDataAsModified();
    }
    
    updateLorebookLinkUI();
    document.getElementById('lorebookContextMenu').style.display = 'none';
    
    if (typeof window.showToast === 'function') {
        window.showToast('success', 'Lorebook link removed');
    } else {
        alert('Lorebook link removed');
    }
}

function updateLorebookLinkUI() {
    const linkIcon = document.getElementById('lorebook-link-icon');
    
    if (linkedLorebookData) {
        linkIcon.style.opacity = '1';
        linkIcon.style.color = '#4CAF50';
        linkIcon.title = `Linked: ${linkedLorebookFilename}`;
    } else {
        linkIcon.style.opacity = '0.7';
        linkIcon.style.color = '';
        linkIcon.title = 'Link Lorebook';
    }
}

// Initialize linked lorebook data from infoData
function initializeLinkedLorebook() {
    console.log('Initializing linked lorebook...');
    console.log('Current infoData.linkedLorebook:', infoData.linkedLorebook);
    
    if (infoData.linkedLorebook) {
        linkedLorebookData = infoData.linkedLorebook.data;
        linkedLorebookFilename = infoData.linkedLorebook.filename;
        updateLorebookLinkUI();
        console.log('Restored linked lorebook:', linkedLorebookFilename);
    } else {
        console.log('No linked lorebook found in infoData');
    }
}

// Make functions globally available
window.openLorebookLink = openLorebookLink;
window.linkLorebookFile = linkLorebookFile;
window.removeLorebookLink = removeLorebookLink;
window.initializeLinkedLorebook = initializeLinkedLorebook;