// ======================
// IMAGE IMPORT SYSTEM - FIXED VERSION
// ======================

// Global variables for image import
let currentImageField = null;
let currentImageContext = {};

// Initialize image import system
function initializeImageImport() {
    // Add event listeners to all image import buttons
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.image-import-trigger');
        if (btn) {
            const targetField = btn.getAttribute('data-target-field');
            const context = btn.getAttribute('data-context');
            openImageImportModal(targetField, context);
        }
    });
    
    // Set up import modal events
    const importFileInput = document.getElementById('import-image-file');
    const importFilenameInput = document.getElementById('import-image-name');
    const importLocationInput = document.getElementById('import-image-path');
    const importBtn = document.getElementById('import-image-btn');
    
    if (importFileInput) {
        importFileInput.addEventListener('change', handleFileSelection);
    }
    
    if (importFilenameInput) {
        importFilenameInput.addEventListener('input', updateImportPreview);
    }
    
    if (importLocationInput) {
        importLocationInput.addEventListener('input', updateImportPreview);
    }
    
    if (importBtn) {
        importBtn.addEventListener('click', performImageImport);
    }
}

// Open image import modal with smart defaults
function openImageImportModal(fieldId, context) {
    currentImageField = fieldId;
    currentImageContext = {
        context: context
    };
    
    // Clear previous values
    document.getElementById('import-image-file').value = '';
    document.getElementById('import-image-name').value = '';
    
    // Set up smart default path
    const smartDefaultPath = getSmartDefaultPath(context);
    document.getElementById('import-image-path').value = smartDefaultPath;
    
    // Update preview
    updateImportPreview();
    
    openModal('imageImportModal');
}

// Generate smart default paths based on context
function getSmartDefaultPath(context) {
    switch (context) {
        case 'banner':
            return 'assets/ui/banners/';
        case 'overview':
            return 'assets/ui/overview/';
        case 'background':
            return 'assets/ui/backgrounds/';
        case 'modal-bg':
            return 'assets/ui/backgrounds/';
        case 'event':
            return 'assets/events/';
        case 'character':
            // Try to get character name from the form
            const charName = document.getElementById('char-name')?.value.trim();
            if (charName) {
                // Sanitize name for filesystem
                const safeName = charName.toLowerCase().replace(/[^a-z0-9]/g, '');
                return `assets/characters/${safeName}/`;
            }
            return 'assets/characters/';
        case 'character-card':  // NEW: Add this case
            // Try to get character name from the form
            const cardCharName = document.getElementById('char-name')?.value.trim();
            if (cardCharName) {
                // Sanitize name for filesystem
                const safeName = cardCharName.toLowerCase().replace(/[^a-z0-9]/g, '');
                return `assets/characters/${safeName}/`;
            }
            return 'assets/characters/';
        case 'world-item':
            // Try to get the world category from editing context
            if (editingCategory) {
                return `assets/world/${editingCategory}/`;
            }
            return 'assets/world/';
        case 'custom-page':
        // Get the current page ID from editing context
            const currentPageId = getCurrentCustomPageId();
            if (currentPageId) {
                return `pages/${currentPageId}/`;
            }
            return 'pages/';
        default:
            return 'assets/';
    }
}

// Handle file selection and auto-suggest filename
function handleFileSelection(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const context = currentImageContext.context;
    
    // NEW: PNG-only validation for character cards
    if (context === 'character-card' && file.type !== 'image/png') {
        alert('Character cards must be PNG files only!');
        e.target.value = '';
        return;
    }
    
    // Auto-suggest filename based on original name
    const originalName = file.name;
    const extension = originalName.split('.').pop().toLowerCase();
    
    // Generate smart filename suggestions
    let suggestedName = originalName;
    
    if (context === 'character') {
        const charName = document.getElementById('char-name')?.value.trim();
        if (charName) {
            const safeName = charName.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            // Suggest different names based on field
            if (currentImageField === 'char-image') {
                suggestedName = `${safeName}-main.${extension}`;
            } else if (currentImageField === 'char-gallery') {
                suggestedName = `${safeName}-gallery-${Date.now()}.${extension}`;
            } else {
                suggestedName = `${safeName}.${extension}`;
            }
        }
    } else if (context === 'character-card') {  
        const charName = document.getElementById('char-name')?.value.trim();
        if (charName) {
            const safeName = charName.toLowerCase().replace(/[^a-z0-9]/g, '');
            // FORCE PNG extension for character cards
            suggestedName = `${safeName}-card.png`;
        } else {
            suggestedName = `character-card.png`;
        }
    } else if (context === 'world-item') {
        const itemName = document.getElementById('item-name')?.value.trim();
        if (itemName && editingCategory) {
            const safeName = itemName.toLowerCase().replace(/[^a-z0-9]/g, '');
            suggestedName = `${safeName}.${extension}`;
        }
    }
    
    document.getElementById('import-image-name').value = suggestedName;
    updateImportPreview();
}

// Update the final path preview
function updateImportPreview() {
    const filename = document.getElementById('import-image-name')?.value.trim() || 'image.jpg';
    const location = document.getElementById('import-image-path')?.value.trim() || 'assets/';
    
    // Ensure location ends with /
    const normalizedLocation = location.endsWith('/') ? location : location + '/';
    const finalPath = normalizedLocation + filename;
    
    const previewElement = document.getElementById('import-final-path');
    if (previewElement) {
        previewElement.textContent = finalPath;
    }
    
    // Enable/disable import button
    const importBtn = document.getElementById('import-image-btn');
    const fileInput = document.getElementById('import-image-file');
    
    if (importBtn) {
        importBtn.disabled = !fileInput?.files?.length || !filename;
    }
}

// Perform the actual image import
async function performImageImport() {
    if (!currentProject) {
        alert('Please save your project first before importing images.');
        return;
    }
    
    const fileInput = document.getElementById('import-image-file');
    const filename = document.getElementById('import-image-name').value.trim();
    const folderPath = document.getElementById('import-image-path').value.trim();
    
    if (!fileInput.files.length) {
        alert('Please select an image file.');
        return;
    }
    
    if (!filename) {
        alert('Please enter a filename.');
        return;
    }
    
    if (!folderPath) {
        alert('Please enter a folder path.');
        return;
    }
    
    const file = fileInput.files[0];
    
    try {
        // Show progress
        const importBtn = document.getElementById('import-image-btn');
        const originalText = importBtn.textContent;
        importBtn.textContent = 'Importing...';
        importBtn.disabled = true;
        
        // Prepare form data
        const formData = new FormData();
        formData.append('image', file);  // API expects 'image', not 'file'
        formData.append('filename', filename);
        formData.append('folderPath', folderPath.endsWith('/') ? folderPath.slice(0, -1) : folderPath);  // API expects 'folderPath', not 'path'
        formData.append('projectName', currentProject);
        
        // Add user context if available
        if (userSessionManager) {
            formData.append('userContext', JSON.stringify(userSessionManager.getUserContext()));
        }
        
        console.log('📷 Starting image import:', {
            filename,
            folderPath,
            project: currentProject,
            size: file.size
        });
        
        // Make the API call
        const response = await fetch('/api/assets/import-image', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Image import successful:', result);
            
            // Insert the path into the original field
            insertPathIntoField(result.relativePath);
            
            // Close modal
            closeModal('imageImportModal');
            
            // Show success message
            showToast('success', `Image imported: ${result.filename}`);
            
        } else {
            throw new Error(result.error || 'Import failed');
        }
        
    } catch (error) {
        console.error('❌ Image import failed:', error);
        showToast('error', `Import failed: ${error.message}`);
    } finally {
        // Reset button
        const importBtn = document.getElementById('import-image-btn');
        importBtn.textContent = 'Import';
        importBtn.disabled = false;
    }
}

// Insert the imported path into the correct field
function insertPathIntoField(relativePath) {
    const targetField = document.getElementById(currentImageField);
    if (!targetField) return;
    
    // For gallery fields (contains 'gallery' in the field name), append to the end
    if (currentImageField.includes('gallery')) {
        const currentValue = targetField.value.trim();
        const newValue = currentValue ? currentValue + '\n' + relativePath : relativePath;
        targetField.value = newValue;
    } else {
        // For regular fields, replace the value
        targetField.value = relativePath;
    }
    
    // Trigger change event to update data
    targetField.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log(`📝 Updated ${currentImageField} with: ${relativePath}`);
}

// Initialize the image import system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add slight delay to ensure other systems are loaded
    setTimeout(initializeImageImport, 100);
});