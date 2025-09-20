// Color Customization System
// Add this to your main JavaScript file

// Initialize color customization system
function initializeColorCustomization() {
    // Add event listener to customize button
    const customizeBtn = document.getElementById('customize-colors-btn');
    if (customizeBtn) {
        customizeBtn.addEventListener('click', openColorCustomizeModal);
    }
    
    // Add event listener to apply button
    const applyBtn = document.getElementById('apply-color-changes');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyColorCustomizations);
    }
    
    // Add event listener to reset button
    const resetBtn = document.getElementById('reset-all-colors');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllColors);
    }
    
    // Hook into existing color scheme change handler
    const colorSchemeSelect = document.getElementById('appearance-color-scheme');
    if (colorSchemeSelect) {
        colorSchemeSelect.addEventListener('change', handleColorSchemeChange);
    }
}

// Open the color customize modal
function openColorCustomizeModal() {
    // Get current colors (with any existing overrides)
    const currentColors = getColorScheme();
    
    // Populate all the color fields
    populateColorCustomizeModal(currentColors);
    
    // Set up color picker synchronization for all mini pickers
    setupMiniColorPickers();
    
    // Show the modal
    openModal('colorCustomizeModal');
}

// Populate the modal with current color values
function populateColorCustomizeModal(colors) {
    // Helper function to set color field values
    function setColorField(colorKey, value) {
        const picker = document.getElementById(`custom-${colorKey}-picker`);
        const input = document.getElementById(`custom-${colorKey}`);
        
        if (picker && input) {
            // Handle special cases for nested properties
            let colorValue = value;
            
            // Convert rgba values to hex for color pickers (rough approximation)
            if (typeof colorValue === 'string' && colorValue.startsWith('rgba(')) {
                // For rgba values, just use a default hex color in the picker
                // but keep the rgba string in the text input
                picker.value = '#cccccc'; // default
                input.value = colorValue;
            } else if (window.isValidHexColor && window.isValidHexColor(colorValue)) {
                picker.value = colorValue;
                input.value = colorValue;
            } else {
                // Fallback for non-hex colors
                picker.value = '#cccccc';
                input.value = colorValue || '';
            }
        }
    }
    
    // Handle seasonal colors (nested object)
    if (colors.seasonal) {
        setColorField('seasonal-winter', colors.seasonal.winter);
        setColorField('seasonal-spring', colors.seasonal.spring);
        setColorField('seasonal-summer', colors.seasonal.summer);
        setColorField('seasonal-autumn', colors.seasonal.autumn);
    }
    
    // Set all other color fields
    const colorKeys = [
        // Background & Base
        'bodyBg', 'containerBg', 'headerBg', 'bannerBorder',
        // Navigation
        'navBg', 'navText', 'navActive', 'navActiveText', 'navHover',
        // Text
        'textPrimary', 'textSecondary', 'textMuted', 'textTitle', 'textContent',
        // World Categories
        'general', 'locations', 'factions', 'concepts', 'events', 
        'creatures', 'plants', 'items', 'culture', 'cultivation',
        // Character Profile
        'physical', 'personality', 'sexuality', 'fighting', 'background',
        'weapons', 'hobbies', 'quirks', 'relationships',
        // Links
        'linkColor', 'linkHover', 'linkColorSecondary', 'linkHoverSecondary',
        // Status
        'statusIdea', 'statusDraft', 'statusCanon', 'statusArchived',
        // Special
        'softBg', 'itemName', 'journalAccent',
        // Kawaii
        'kawaiiPink', 'kawaiiPurple', 'kawaiiBlue', 'kawaiiGold', 
        'kawaiiGreen', 'kawaiiOrange',
        // Wuxia
        'wuxiaAccent', 'wuxiaAccentLight', 'wuxiaGlow'
    ];
    
    colorKeys.forEach(key => {
        if (colors[key]) {
            setColorField(key, colors[key]);
        }
    });
}

// Set up synchronization between mini color pickers and hex inputs
function setupMiniColorPickers() {
    // Get all mini color pickers and their corresponding inputs
    const miniPickers = document.querySelectorAll('.mini-color-picker');
    
    miniPickers.forEach(picker => {
        const pickerId = picker.id;
        const inputId = pickerId.replace('-picker', '');
        const input = document.getElementById(inputId);
        
        if (input) {
            // Sync picker to input
            picker.addEventListener('input', function() {
                input.value = this.value;
            });
            
            // Sync input to picker (only for valid hex colors)
            input.addEventListener('input', function() {
                const color = this.value.trim();
                if (window.isValidHexColor && window.isValidHexColor(color)) {
                    picker.value = color;
                }
            });
        }
    });
    
    // IMPORTANT: Call this AFTER the DOM is ready and pickers are added
    setTimeout(() => {
        // Re-run your existing color picker setup to include mini pickers
        if (window.setupColorPickerInteractions) {
            window.setupColorPickerInteractions();
        }
        
        // Or call any other existing color picker initialization functions you have
        if (window.initializeAppearanceColorPickers) {
            window.initializeAppearanceColorPickers();
        }
    }, 100);
}

// Add context menu functionality to mini pickers (reuse existing system)
function addMiniPickerContextMenus() {
    // The mini pickers should automatically inherit your existing color picker functionality
    // No need to add duplicate handlers - your existing setupColorPickerInteractions() should handle this
    
    // If you have a global color picker setup function, call it:
    if (window.setupColorPickerInteractions) {
        window.setupColorPickerInteractions();
    }
}

// Apply color customizations
function applyColorCustomizations() {
    // Collect all custom color values
    const customColors = {};
    
    // Helper function to collect color value
    function collectColorValue(colorKey, isNested = false, parentKey = '') {
        const input = document.getElementById(`custom-${colorKey}`);
        if (input && input.value.trim()) {
            const value = input.value.trim();
            
            if (isNested) {
                if (!customColors[parentKey]) {
                    customColors[parentKey] = {};
                }
                const nestedKey = colorKey.replace(`${parentKey}-`, '');
                customColors[parentKey][nestedKey] = value;
            } else {
                customColors[colorKey] = value;
            }
        }
    }
    
    // Collect seasonal colors (nested)
    collectColorValue('seasonal-winter', true, 'seasonal');
    collectColorValue('seasonal-spring', true, 'seasonal');
    collectColorValue('seasonal-summer', true, 'seasonal');
    collectColorValue('seasonal-autumn', true, 'seasonal');
    
    // Collect all other colors
    const colorKeys = [
        'bodyBg', 'containerBg', 'headerBg', 'bannerBorder',
        'navBg', 'navText', 'navActive', 'navActiveText', 'navHover',
        'textPrimary', 'textSecondary', 'textMuted', 'textTitle', 'textContent',
        'general', 'locations', 'factions', 'concepts', 'events', 
        'creatures', 'plants', 'items', 'culture', 'cultivation',
        'physical', 'personality', 'sexuality', 'fighting', 'background',
        'weapons', 'hobbies', 'quirks', 'relationships',
        'linkColor', 'linkHover', 'linkColorSecondary', 'linkHoverSecondary',
        'statusIdea', 'statusDraft', 'statusCanon', 'statusArchived',
        'softBg', 'itemName', 'journalAccent',
        'kawaiiPink', 'kawaiiPurple', 'kawaiiBlue', 'kawaiiGold', 
        'kawaiiGreen', 'kawaiiOrange',
        'wuxiaAccent', 'wuxiaAccentLight', 'wuxiaGlow'
    ];
    
    colorKeys.forEach(key => {
        collectColorValue(key);
    });
    
    // Store the overrides in appearance data
    if (!window.infoData) {
        window.infoData = {};
    }
    if (!window.infoData.appearance) {
        window.infoData.appearance = {};
    }
    
    // Only store overrides if there are actually custom colors
    if (Object.keys(customColors).length > 0) {
        window.infoData.appearance.customColorOverrides = customColors;
        console.log('Applied color overrides:', customColors);
    } else {
        // Remove overrides if no custom colors
        delete window.infoData.appearance.customColorOverrides;
    }
    
    // Close modal
    closeModal('colorCustomizeModal');
    
    // Mark data as modified
    if (window.markDataAsModified) {
        window.markDataAsModified();
    }
    
    // Show success message
    if (window.showToast) {
        showToast('success', 'Color customizations applied!');
    }
    
    // Regenerate CSS if possible
    if (window.generateHTML) {
        // Only regenerate if HTML has been generated before
        const htmlOutput = document.getElementById('html-output');
        if (htmlOutput && htmlOutput.value) {
            setTimeout(() => {
                    window.generateHTML();

            }, 500);
        }
    }
}

// Reset all color customizations
function resetAllColors() {
    if (confirm('Reset all color customizations back to the base theme?')) {
        // Clear the overrides
        if (window.infoData && window.infoData.appearance) {
            delete window.infoData.appearance.customColorOverrides;
        }
        
        // Repopulate the modal with base colors
        const baseColors = getBaseColorScheme();
        populateColorCustomizeModal(baseColors);
        
        // Mark data as modified
        if (window.markDataAsModified) {
            window.markDataAsModified();
        }
        
        if (window.showToast) {
            showToast('success', 'Colors reset to base theme');
        }
    }
}

// Handle color scheme changes with override confirmation
function handleColorSchemeChange(event) {
    const hasOverrides = window.infoData && 
                        window.infoData.appearance && 
                        window.infoData.appearance.customColorOverrides;
    
    if (hasOverrides) {
        if (confirm('You have custom color overrides that will be lost when changing themes. Continue?')) {
            delete window.infoData.appearance.customColorOverrides;
            // Continue with original change handler
            if (window.handleAppearanceChange) {
                window.handleAppearanceChange(event);
            }
        } else {
            // Revert the dropdown change
            event.preventDefault();
            const currentScheme = window.infoData.appearance.colorScheme || 'current';
            event.target.value = currentScheme;
        }
    } else {
        // No overrides, proceed normally
        if (window.handleAppearanceChange) {
            window.handleAppearanceChange(event);
        }
    }
}

// Get base color scheme without overrides
function getBaseColorScheme() {
    const appearance = window.getAppearanceSettings ? window.getAppearanceSettings() : {};
    const schemeName = appearance.colorScheme || 'current';
    
    // Import colorSchemes if available
    if (typeof colorSchemes !== 'undefined') {
        return colorSchemes[schemeName]?.colors || colorSchemes.current?.colors || {};
    }
    
    // Fallback if colorSchemes not available
    return {};
}

// Modified getColorScheme function to include overrides
// This should REPLACE your existing getColorScheme function
function getColorScheme() {
    const baseColors = getBaseColorScheme();
    
    // Check for custom overrides
    const overrides = window.infoData && 
                     window.infoData.appearance && 
                     window.infoData.appearance.customColorOverrides;
    
    if (overrides) {
        // Merge base colors with overrides
        return { ...baseColors, ...overrides };
    }
    
    return baseColors;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeColorCustomization);
} else {
    initializeColorCustomization();
}

// Make functions globally available
window.openColorCustomizeModal = openColorCustomizeModal;
window.getBaseColorScheme = getBaseColorScheme;
window.initializeColorCustomization = initializeColorCustomization;