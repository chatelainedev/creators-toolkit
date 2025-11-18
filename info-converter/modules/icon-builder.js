/**
 * Icon Builder Module for Lore Codex
 * Handles all icon builder functionality for World entries
 * 
 * Dependencies (from other files):
 * - window.currentEditingItem (from form-handlers.js)
 * - editingCategory (from form-handlers.js)
 * - window.isLocal, window.currentProject (from project management)
 * - window.userSessionManager (from user session)
 * - showToast() (from utilities)
 * - openModal(), closeModal() (from modal system)
 * - syncColorInputs() (stays in form-handlers.js - used by other features)
 */

// Global variables for icon builder
let currentIconConfig = null;
let scannedIconLibrary = null;

// Load icon categories and files from server
async function loadIconLibrary() {
    try {
        const response = await fetch('/api/icons/scan');
        const data = await response.json();
        
        if (data.categories) {
            scannedIconLibrary = data.categories;
            console.log('📚 Loaded icon library:', Object.keys(scannedIconLibrary).length, 'categories');
            return true;
        } else {
            console.warn('⚠️ No icon categories found');
            scannedIconLibrary = {};
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to load icon library:', error);
        scannedIconLibrary = {};
        return false;
    }
}

// Populate category dropdown with scanned folders
function populateIconCategories() {
    const select = document.getElementById('icon-category-select');
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">Select category...</option>';
    
    if (!scannedIconLibrary || Object.keys(scannedIconLibrary).length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No icon folders found';
        select.appendChild(option);
        return;
    }
    
    // Add categories alphabetically
    const categories = Object.keys(scannedIconLibrary).sort();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        // Capitalize first letter for display
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        select.appendChild(option);
    });
    
    console.log('📂 Populated', categories.length, 'icon categories');
}

// Open icon builder modal
async function openIconBuilderModal() {
    const iconType = document.querySelector('input[name="icon-type"]:checked').value;
    
    if (iconType !== 'builder') {
        alert('Please select "Build Icon" option first');
        return;
    }
    
    // Load icon library if not already loaded
    if (!scannedIconLibrary) {
        console.log('🔥 Loading icon library...');
        const success = await loadIconLibrary();
        if (!success) {
            console.warn('⚠️ Could not load icons, modal will show empty');
        }
    }
    
    // Always populate categories when opening modal
    populateIconCategories();

    // Load saved icon styles
    await loadIconStyles();
    
    // Get icon config from the current item being edited
    const item = window.currentEditingItem;
    const currentIconConfig = (item && item.icon && item.icon.type === 'builder') ? 
        item.icon : null;
    
    console.log('Opening icon builder for item:', item?.name, 'Icon config:', currentIconConfig);
    
    if (currentIconConfig) {
        // Restore previous configuration
        document.getElementById('icon-category-select').value = currentIconConfig.category || '';
        
        // Load icons for the saved category
        loadIconCategory();
        
        // Restore color settings
        document.getElementById('icon-bg-color').value = currentIconConfig.bgColor || '#4a90e2';
        document.getElementById('icon-bg-color-picker').value = currentIconConfig.bgColor || '#4a90e2';
        document.getElementById('icon-border-color').value = currentIconConfig.borderColor || '#2c5aa0';
        document.getElementById('icon-border-color-picker').value = currentIconConfig.borderColor || '#2c5aa0';
        
        // Restore shape
        const shape = currentIconConfig.shape || 'square';
        document.querySelector(`input[name="icon-shape"][value="${shape}"]`).checked = true;
        
        // Restore border style
        const borderStyle = currentIconConfig.borderStyle || 'thin';
        document.querySelector(`input[name="icon-border"][value="${borderStyle}"]`).checked = true;
        
        toggleBorderColor();
        
        // Restore opacity
        document.getElementById('icon-opacity').value = currentIconConfig.iconOpacity || 100;
        
        // Check for matching saved style
        const matchedStyle = await findMatchingIconStyle(currentIconConfig);
        if (matchedStyle) {
            const dropdown = document.getElementById('icon-saved-styles');
            dropdown.value = matchedStyle.name;
            document.getElementById('delete-icon-style-btn').disabled = false;
        }
        
        // Select the icon after a short delay to ensure grid is loaded
        setTimeout(() => {
            const iconOption = document.querySelector(`.icon-option[data-file="${currentIconConfig.file}"]`);
            if (iconOption) {
                selectIcon(iconOption);
            } else {
                console.warn('⚠️ Could not find icon option for:', currentIconConfig.file);
            }
        }, 150);
    } else {
        // Reset to defaults for new icon
        console.log('No existing icon config, resetting to defaults');
        document.getElementById('icon-category-select').value = '';
        document.getElementById('icon-grid').innerHTML = '<div class="helper-text">Select a category to see available icons</div>';
        document.getElementById('icon-bg-color').value = '#4a90e2';
        document.getElementById('icon-bg-color-picker').value = '#4a90e2';
        document.getElementById('icon-border-color').value = '#2c5aa0';
        document.getElementById('icon-border-color-picker').value = '#2c5aa0';
        document.querySelector('input[name="icon-shape"][value="square"]').checked = true;
        document.querySelector('input[name="icon-border"][value="thin"]').checked = true;
        document.getElementById('icon-opacity').value = 100;
        toggleBorderColor();
        document.getElementById('icon-builder-preview').innerHTML = '<div class="helper-text">Select an icon to preview</div>';
    }
    
    openModal('iconBuilderModal');
}

// Load icons for selected category
function loadIconCategory() {
    const category = document.getElementById('icon-category-select').value;
    const iconGrid = document.getElementById('icon-grid');
    
    if (!category) {
        iconGrid.innerHTML = '<div class="helper-text">Select a category to see available icons</div>';
        return;
    }
    
    const icons = scannedIconLibrary[category] || [];
    
    if (icons.length === 0) {
        iconGrid.innerHTML = '<div class="helper-text">No icons found in this category</div>';
        return;
    }
    
    iconGrid.innerHTML = '';
    icons.forEach(icon => {
        const iconPath = `images/item-icons/${category}/${icon.file}`;
        const optionDiv = document.createElement('div');
        optionDiv.className = 'icon-option';
        optionDiv.dataset.category = category;
        optionDiv.dataset.file = icon.file;
        optionDiv.dataset.name = icon.name;
        optionDiv.innerHTML = `
            <img src="${iconPath}" alt="${icon.name}" onerror="this.src='images/placeholder.png'">
        `;
        optionDiv.onclick = () => selectIcon(optionDiv);
        iconGrid.appendChild(optionDiv);
    });
}

// Select an icon from the grid
function selectIcon(optionElement) {
    // Remove selection from all options
    document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    optionElement.classList.add('selected');
    
    // Update preview
    updateIconPreview();
}

// Update the icon preview
function updateIconPreview() {
    const selectedIcon = document.querySelector('.icon-option.selected');
    const preview = document.getElementById('icon-builder-preview');
    
    if (!selectedIcon) {
        preview.innerHTML = '<div class="helper-text">Select an icon to preview</div>';
        return;
    }
    
    const category = selectedIcon.dataset.category;
    const file = selectedIcon.dataset.file;
    const iconPath = getIconPath(category, file);
    const shape = document.querySelector('input[name="icon-shape"]:checked').value;
    const bgColor = document.getElementById('icon-bg-color').value;
    const borderStyle = document.querySelector('input[name="icon-border"]:checked').value;
    const borderColor = document.getElementById('icon-border-color').value;
    
    let borderCSS = 'none';
    if (borderStyle === 'thin') {
        borderCSS = `2px solid ${borderColor}`;
    } else if (borderStyle === 'thick') {
        borderCSS = `4px solid ${borderColor}`;
    }
    
    const borderRadius = shape === 'circle' ? '50%' : '4px';
    
    preview.innerHTML = `
        <div class="icon-preview-item" style="
            width: 64px;
            height: 64px;
            background-color: ${bgColor};
            border: ${borderCSS};
            border-radius: ${borderRadius};
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <img src="${iconPath}" alt="Preview" style="width: 34px; height: 34px; image-rendering: pixelated; opacity: ${document.getElementById('icon-opacity').value / 100};">
        </div>
    `;
}

// Toggle border color section visibility
function toggleBorderColor() {
    const borderStyle = document.querySelector('input[name="icon-border"]:checked').value;
    const borderColorSection = document.getElementById('border-color-section');
    borderColorSection.style.display = borderStyle === 'none' ? 'none' : 'block';
}

// Save the configured icon
async function saveIconConfig() {
    const selectedIcon = document.querySelector('.icon-option.selected');
    
    if (!selectedIcon) {
        alert('Please select an icon');
        return;
    }
    
    const iconConfig = {
        type: 'builder',
        category: selectedIcon.dataset.category,
        file: selectedIcon.dataset.file,
        name: selectedIcon.dataset.name,
        shape: document.querySelector('input[name="icon-shape"]:checked').value,
        bgColor: document.getElementById('icon-bg-color').value,
        borderStyle: document.querySelector('input[name="icon-border"]:checked').value,
        borderColor: document.getElementById('icon-border-color').value,
        iconOpacity: document.getElementById('icon-opacity').value 
    };
    
    // Generate PNG from the current config
    const pngData = await generateIconPNG(iconConfig);
    
    // Save PNG to server if we have a project and item ID
    if (window.isLocal && window.currentProject && window.currentEditingItem && window.currentEditingItem.id) {
        try {
            const userContext = window.userSessionManager.getUserContext();
            const response = await fetch('/api/save-built-icon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName: window.currentProject,
                    itemId: window.currentEditingItem.id,
                    category: editingCategory,
                    pngData: pngData,
                    userContext: userContext
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Store the path to the saved PNG instead of base64
                iconConfig.savedPath = result.iconPath;
                console.log('✅ Icon PNG saved to:', result.iconPath);
            } else {
                console.warn('⚠️ Failed to save icon PNG to disk');
            }
        } catch (error) {
            console.error('Error saving icon PNG:', error);
        }
    }
    
    // Store on the current item being edited
    if (window.currentEditingItem) {
        window.currentEditingItem.icon = iconConfig;
    }
    
    // Show preview in the world item modal
    const previewContainer = document.getElementById('icon-preview-container');
    const previewDisplay = document.getElementById('icon-preview-display');
    
    const iconPath = `images/item-icons/${iconConfig.category}/${iconConfig.file}`;
    let borderCSS = 'none';
    if (iconConfig.borderStyle === 'thin') {
        borderCSS = `2px solid ${iconConfig.borderColor}`;
    } else if (iconConfig.borderStyle === 'thick') {
        borderCSS = `4px solid ${iconConfig.borderColor}`;
    }
    const borderRadius = iconConfig.shape === 'circle' ? '50%' : '4px';
    
    previewDisplay.innerHTML = `
        <div style="
            width: 48px;
            height: 48px;
            background-color: ${iconConfig.bgColor};
            border: ${borderCSS};
            border-radius: ${borderRadius};
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px 0;
        ">
            <img src="${iconPath}" alt="${iconConfig.name}" 
                style="width: 28px; height: 28px; image-rendering: pixelated; opacity: ${iconConfig.iconOpacity / 100};">
        </div>
    `;
    
    previewContainer.style.display = 'block';
    
    closeModal('iconBuilderModal');
}

// Generate PNG with just the icon image (no frame/background)
async function generateIconPNG(iconConfig) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        
        // Make background transparent
        ctx.clearRect(0, 0, 48, 48);
        
        // Load and draw the icon image
        const iconImg = new Image();
        iconImg.onload = () => {
            // Draw icon centered at larger size
            ctx.globalAlpha = iconConfig.iconOpacity ? iconConfig.iconOpacity / 100 : 1;
            ctx.drawImage(iconImg, 9, 9, 30, 30);
            
            // Convert to base64 PNG
            resolve(canvas.toDataURL('image/png'));
        };
        
        iconImg.src = getIconPath(iconConfig.category, iconConfig.file);
    });
}

// Get the path to an icon file
function getIconPath(category, file) {
    return `images/item-icons/${category}/${file}`;
}

// ===== Icon Style Management Functions =====

// Load saved icon styles from project config
async function loadIconStyles() {
    const dropdown = document.getElementById('icon-saved-styles');
    
    // Clear existing options except "New"
    dropdown.innerHTML = '<option value="">New</option>';
    
    // Check if we have a project loaded
    if (!window.isLocal || !window.currentProject) {
        dropdown.innerHTML = '<option value="">Export project first</option>';
        dropdown.disabled = true;
        document.getElementById('save-icon-style-btn').disabled = true;
        document.getElementById('delete-icon-style-btn').disabled = true;
        return;
    }
    
    dropdown.disabled = false;
    document.getElementById('save-icon-style-btn').disabled = false;
    
    try {
        const userContext = window.userSessionManager.getUserContext();
        const userPath = userContext.isGuest ? 'guest' : userContext.userId;
        const configResponse = await fetch(`/projects/${userPath}/${window.currentProject}/project-config.json`);
        
        if (configResponse.ok) {
            const config = await configResponse.json();
            
            if (config.iconStyles && config.iconStyles.length > 0) {
                config.iconStyles.forEach(style => {
                    const option = document.createElement('option');
                    option.value = style.name;
                    option.textContent = style.name;
                    dropdown.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading icon styles:', error);
    }
}

// Save current icon style
async function saveIconStyle() {
    if (!window.isLocal || !window.currentProject) {
        showToast('error', 'No project loaded');
        return;
    }
    
    const dropdown = document.getElementById('icon-saved-styles');
    const selectedStyleName = dropdown.value;
    
    // Get current style settings
    const currentStyle = {
        shape: document.querySelector('input[name="icon-shape"]:checked').value,
        borderStyle: document.querySelector('input[name="icon-border"]:checked').value,
        bgColor: document.getElementById('icon-bg-color').value,
        borderColor: document.getElementById('icon-border-color').value,
        iconOpacity: parseInt(document.getElementById('icon-opacity').value)
    };
    
    // If "New" is selected, prompt for name
    if (selectedStyleName === '') {
        const styleName = prompt('Enter a name for this style:');
        if (!styleName || styleName.trim() === '') return;
        
        currentStyle.name = styleName.trim();
        await saveIconStyleToConfig(currentStyle, false);
        
        // Reload dropdown and select the new style
        await loadIconStyles();
        dropdown.value = currentStyle.name;
        document.getElementById('delete-icon-style-btn').disabled = false;
    } else {
        // Overwrite existing style
        currentStyle.name = selectedStyleName;
        await saveIconStyleToConfig(currentStyle, true);
        showToast('success', `Style "${selectedStyleName}" updated`);
    }
}

// Save icon style to project config
async function saveIconStyleToConfig(style, isUpdate) {
    try {
        const userContext = window.userSessionManager.getUserContext();
        const userPath = userContext.isGuest ? 'guest' : userContext.userId;
        const configPath = `/projects/${userPath}/${window.currentProject}/project-config.json`;
        
        // Load existing config
        const configResponse = await fetch(configPath);
        let config = {};
        
        if (configResponse.ok) {
            config = await configResponse.json();
        }
        
        // Initialize iconStyles array if it doesn't exist
        if (!config.iconStyles) {
            config.iconStyles = [];
        }
        
        if (isUpdate) {
            // Find and update existing style
            const index = config.iconStyles.findIndex(s => s.name === style.name);
            if (index !== -1) {
                config.iconStyles[index] = style;
            }
        } else {
            // Add new style
            config.iconStyles.push(style);
        }
        
        // Save config back
        const response = await fetch('/api/save-project-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectName: window.currentProject,
                config: config,
                userContext: userContext
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            if (!isUpdate) {
                showToast('success', `Style "${style.name}" saved`);
            }
        } else {
            showToast('error', 'Failed to save style');
        }
    } catch (error) {
        console.error('Error saving icon style:', error);
        showToast('error', 'Failed to save style');
    }
}

// Delete selected icon style
async function deleteIconStyle() {
    const dropdown = document.getElementById('icon-saved-styles');
    const selectedStyleName = dropdown.value;
    
    if (selectedStyleName === '') return;
    
    if (!confirm(`Delete style "${selectedStyleName}"?`)) return;
    
    try {
        const userContext = window.userSessionManager.getUserContext();
        const userPath = userContext.isGuest ? 'guest' : userContext.userId;
        const configPath = `/projects/${userPath}/${window.currentProject}/project-config.json`;
        
        // Load existing config
        const configResponse = await fetch(configPath);
        let config = {};
        
        if (configResponse.ok) {
            config = await configResponse.json();
        }
        
        if (config.iconStyles) {
            // Remove the style
            config.iconStyles = config.iconStyles.filter(s => s.name !== selectedStyleName);
            
            // Save config back
            const response = await fetch('/api/save-project-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName: window.currentProject,
                    config: config,
                    userContext: userContext
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('success', `Style "${selectedStyleName}" deleted`);
                
                // Reload dropdown and reset to "New"
                await loadIconStyles();
                dropdown.value = '';
                document.getElementById('delete-icon-style-btn').disabled = true;
            } else {
                showToast('error', 'Failed to delete style');
            }
        }
    } catch (error) {
        console.error('Error deleting icon style:', error);
        showToast('error', 'Failed to delete style');
    }
}

// Apply selected icon style
function applyIconStyle() {
    const dropdown = document.getElementById('icon-saved-styles');
    const selectedStyleName = dropdown.value;
    const deleteBtn = document.getElementById('delete-icon-style-btn');
    
    // Update delete button state
    if (selectedStyleName === '') {
        deleteBtn.disabled = true;
    } else {
        deleteBtn.disabled = false;
    }
    
    // If "New" is selected, don't change anything
    if (selectedStyleName === '') return;
    
    // Find and apply the style
    fetchIconStyle(selectedStyleName).then(style => {
        if (style) {
            // Apply the style settings
            document.querySelector(`input[name="icon-shape"][value="${style.shape}"]`).checked = true;
            document.querySelector(`input[name="icon-border"][value="${style.borderStyle}"]`).checked = true;
            document.getElementById('icon-bg-color').value = style.bgColor;
            document.getElementById('icon-bg-color-picker').value = style.bgColor;
            document.getElementById('icon-border-color').value = style.borderColor;
            document.getElementById('icon-border-color-picker').value = style.borderColor;
            document.getElementById('icon-opacity').value = style.iconOpacity;
            
            toggleBorderColor();
            updateIconPreview();
        }
    });
}

// Fetch a specific icon style from project config
async function fetchIconStyle(styleName) {
    if (!window.isLocal || !window.currentProject) return null;
    
    try {
        const userContext = window.userSessionManager.getUserContext();
        const userPath = userContext.isGuest ? 'guest' : userContext.userId;
        const configResponse = await fetch(`/projects/${userPath}/${window.currentProject}/project-config.json`);
        
        if (configResponse.ok) {
            const config = await configResponse.json();
            
            if (config.iconStyles) {
                return config.iconStyles.find(style => style.name === styleName);
            }
        }
    } catch (error) {
        console.error('Error fetching icon style:', error);
    }
    
    return null;
}

// Find if current icon settings match a saved style
async function findMatchingIconStyle(iconConfig) {
    if (!window.isLocal || !window.currentProject) return null;
    
    try {
        const userContext = window.userSessionManager.getUserContext();
        const userPath = userContext.isGuest ? 'guest' : userContext.userId;
        const configResponse = await fetch(`/projects/${userPath}/${window.currentProject}/project-config.json`);
        
        if (configResponse.ok) {
            const config = await configResponse.json();
            
            if (config.iconStyles) {
                // Find a style that matches all the icon's style properties
                return config.iconStyles.find(style => 
                    style.shape === iconConfig.shape &&
                    style.borderStyle === iconConfig.borderStyle &&
                    style.bgColor === iconConfig.bgColor &&
                    style.borderColor === iconConfig.borderColor &&
                    style.iconOpacity === parseInt(iconConfig.iconOpacity)
                );
            }
        }
    } catch (error) {
        console.error('Error finding matching icon style:', error);
    }
    
    return null;
}

// ===== Event Listeners =====

// Icon type toggle handler (moved from form-handlers.js DOMContentLoaded)
document.addEventListener('DOMContentLoaded', function() {
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
                if (configureBtn) configureBtn.style.display = 'none';
            } else if (selectedValue === 'builder') {
                customIconSection.style.display = 'none';
                builderSection.style.display = 'block';
                if (configureBtn) configureBtn.style.display = 'inline-block';
            } else {
                customIconSection.style.display = 'none';
                builderSection.style.display = 'none';
                if (configureBtn) configureBtn.style.display = 'none';
            }
        });
    });
});