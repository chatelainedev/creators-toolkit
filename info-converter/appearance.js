import overviewStyles from './templates/overview-styles.js';
import navigationStyles from './templates/navigation-styles.js';
import buttonStyles from './templates/button-styles.js';
import cardStyles from './templates/card-styles.js';
import { containerStyles, subcontainerStyles } from './templates/container-styles.js';
import infodisplayStyles from './templates/infodisplay-styles.js';
import colorSchemes from './templates/colorSchemes/index.js'; 
import backToTopStyles from './templates/backtotop-styles.js';
import fontSets from './templates/font-sets.js';
import bannerStyles from './templates/banner-styles.js';
import backgroundStyles, { backgroundColorOverlays } from './templates/background-styles.js';
import storylineStyles from './templates/storyline-styles.js';
import worldCategoriesHeaderStyles from './templates/header-styles.js';
// Appearance Management System - Fixed

// Default appearance settings
const defaultAppearance = {
    overviewStyle: 'journal',     
    navigationStyle: 'journal',   
    colorScheme: 'current',
    fontSet: 'serif',
    worldCategoriesHeader: 'default',
    pageHeader: 'standard',
    storylineStyle: 'default',
    containerStyle: 'left-border',
    subcontainerStyle: 'soft-bg',
    infodisplayStyle: 'default',
    bannerSize: 'large',
    bannerStyle: 'none',
    backgroundStyle: 'none',
    backgroundColorOverlay: 'none',
    buttonStyle: 'rounded',
    customNavButtonStyle: 'rounded',
    backToTopStyle: 'circular',
    siteWidth: 'standard',
    cardStyle: 'current'  // ADD THIS LINE
};

// Template definitions with clear differences - delete this later after migration
const templates = {
    journal: {
        name: 'Journal',
        description: 'Notebook aesthetic with lined paper and red margin line in overview'
    },
    modern: {
        name: 'Modern',
        description: 'Clean cards with rounded corners and gradient header in overview'
    },
    classic: {
        name: 'Classic',
        description: 'Traditional formal document with ornate double borders in overview'
    }
};

// Initialize appearance settings
function initializeAppearance() {
    // Add appearance settings to global infoData if not present
    if (!window.infoData) {
        window.infoData = {};
    }
    if (!window.infoData.appearance) {
        window.infoData.appearance = { ...defaultAppearance };
    }
    
    // Ensure all properties exist
    Object.keys(defaultAppearance).forEach(key => {
        if (!window.infoData.appearance[key]) {
            window.infoData.appearance[key] = defaultAppearance[key];
        }
    });
    
    // Populate appearance form controls
    populateAppearanceControls();

    initializeColorCustomization();
    
    // Add event listeners
    addAppearanceEventListeners();
}

// Enhanced populateAppearanceControls with better error handling and DOM checking
function populateAppearanceControls() {
    // ENHANCED: Check if DOM is ready
    if (document.readyState === 'loading') {
        console.log('DOM not ready, scheduling appearance controls population...');
        document.addEventListener('DOMContentLoaded', populateAppearanceControls);
        return;
    }
    
    // Ensure appearance settings exist
    const appearance = getAppearanceSettings();
    
    // ENHANCED: Validate that all required elements exist before proceeding
    const requiredElements = [
        'appearance-overview-style',
        'appearance-navigation-style', 
        'appearance-color-scheme',
        'appearance-font-set',
        'appearance-card-style',
        'appearance-container-style',
        'appearance-subcontainer-style',
        'appearance-banner-size',
        'appearance-button-style',
        'appearance-background-style',
        'appearance-background-color-overlay',
        'appearance-custom-nav-button-style',
        'appearance-back-to-top-style',
        'appearance-site-width'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.warn('Missing appearance control elements:', missingElements);
        // Schedule retry after a short delay
        setTimeout(() => {
            console.log('Retrying appearance controls population...');
            populateAppearanceControls();
        }, 250);
        return;
    }

    // Banner style dropdown
    const bannerStyleSelect = document.getElementById('appearance-banner-style');
    if (bannerStyleSelect) {
        bannerStyleSelect.innerHTML = '';
        Object.entries(bannerStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            bannerStyleSelect.appendChild(option);
        });
        bannerStyleSelect.value = appearance.bannerStyle || 'none';
    }

    // Background style dropdown
    const backgroundStyleSelect = document.getElementById('appearance-background-style');
    if (backgroundStyleSelect) {
        backgroundStyleSelect.innerHTML = '';
        Object.entries(backgroundStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            backgroundStyleSelect.appendChild(option);
        });
        backgroundStyleSelect.value = appearance.backgroundStyle || 'none';
    }

    // Background color overlay dropdown
    const backgroundColorOverlaySelect = document.getElementById('appearance-background-color-overlay');
    if (backgroundColorOverlaySelect) {
        backgroundColorOverlaySelect.innerHTML = '';
        Object.entries(backgroundColorOverlays).forEach(([key, overlay]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = overlay.name;
            backgroundColorOverlaySelect.appendChild(option);
        });
        backgroundColorOverlaySelect.value = appearance.backgroundColorOverlay || 'none';
    }
    
    // Overview style dropdown
    const overviewSelect = document.getElementById('appearance-overview-style');
    if (overviewSelect) {
        overviewSelect.innerHTML = '';
        Object.entries(overviewStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            overviewSelect.appendChild(option);
        });
        overviewSelect.value = appearance.overviewStyle || 'journal';
    }
    
    // Navigation style dropdown
    const navigationSelect = document.getElementById('appearance-navigation-style');
    if (navigationSelect) {
        navigationSelect.innerHTML = '';
        Object.entries(navigationStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            navigationSelect.appendChild(option);
        });
        navigationSelect.value = appearance.navigationStyle || 'journal';
    }
    
    // Color scheme dropdown
    const colorSelect = document.getElementById('appearance-color-scheme');
    if (colorSelect) {
        colorSelect.innerHTML = '';
        Object.entries(colorSchemes).forEach(([key, scheme]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = scheme.name;
            colorSelect.appendChild(option);
        });
        colorSelect.value = appearance.colorScheme || 'current';
    }
    
    // Font set dropdown
    const fontSelect = document.getElementById('appearance-font-set');
    if (fontSelect) {
        fontSelect.innerHTML = '';
        Object.entries(fontSets).forEach(([key, fontSet]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = fontSet.name;
            fontSelect.appendChild(option);
        });
        fontSelect.value = appearance.fontSet || 'serif';
    }

    // World categories header dropdown
    const worldCategoriesHeaderSelect = document.getElementById('appearance-world-categories-header');
    if (worldCategoriesHeaderSelect) {
        worldCategoriesHeaderSelect.innerHTML = '';
        Object.entries(worldCategoriesHeaderStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            worldCategoriesHeaderSelect.appendChild(option);
        });
        worldCategoriesHeaderSelect.value = appearance.worldCategoriesHeader || 'default';
    }
    
    // Page header dropdown
    const pageHeaderSelect = document.getElementById('appearance-page-header');
    if (pageHeaderSelect) {
        pageHeaderSelect.innerHTML = '';
        const pageHeaderOptions = {
            'standard': 'Standard',
            'minimal': 'Minimal', 
            'banner': 'Banner',
            'compact': 'Compact',
            'cards': 'Cards',
            'kawaii': 'Kawaii',
            'industrial': 'Industrial',
            'manuscript': 'Manuscript',
            'neon': 'Neon',
            'cyberpunk': 'Cyberpunk',
            'matrix': 'Matrix',
            'glitch': 'Glitch',
            'neuralInterface': 'Neural Interface'
        };
        Object.entries(pageHeaderOptions).forEach(([key, name]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = name;
            pageHeaderSelect.appendChild(option);
        });
        pageHeaderSelect.value = appearance.pageHeader || 'standard';
    }

    // Storyline style dropdown
    const storylineStyleSelect = document.getElementById('appearance-storyline-style');
    if (storylineStyleSelect) {
        storylineStyleSelect.innerHTML = '';
        Object.entries(storylineStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            storylineStyleSelect.appendChild(option);
        });
        storylineStyleSelect.value = appearance.storylineStyle || 'default';
    }

    // Card style dropdown
    const cardSelect = document.getElementById('appearance-card-style');
    if (cardSelect) {
        cardSelect.innerHTML = '';
        Object.entries(cardStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            cardSelect.appendChild(option);
        });
        cardSelect.value = appearance.cardStyle || 'current';
    }
    
    // Container style dropdown
    const containerSelect = document.getElementById('appearance-container-style');
    if (containerSelect) {
        containerSelect.innerHTML = '';
        Object.entries(containerStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            containerSelect.appendChild(option);
        });
        containerSelect.value = appearance.containerStyle || 'left-border';
    }
    
    // Subcontainer style dropdown
    const subcontainerSelect = document.getElementById('appearance-subcontainer-style');
    if (subcontainerSelect) {
        subcontainerSelect.innerHTML = '';
        Object.entries(subcontainerStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            subcontainerSelect.appendChild(option);
        });
        subcontainerSelect.value = appearance.subcontainerStyle || 'soft-bg';
    }

    // Info-Display style dropdown
    const infodisplaySelect = document.getElementById('appearance-infodisplay-style');
    if (infodisplaySelect) {
        infodisplaySelect.innerHTML = '';
        Object.entries(infodisplayStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            infodisplaySelect.appendChild(option);
        });
        infodisplaySelect.value = appearance.infodisplayStyle || 'default';
    }

    // Banner size dropdown
    const bannerSelect = document.getElementById('appearance-banner-size');
    if (bannerSelect) {
        bannerSelect.value = appearance.bannerSize || 'large';
    }

    // Site width dropdown
    const siteWidthSelect = document.getElementById('appearance-site-width');
    if (siteWidthSelect) {
        siteWidthSelect.value = appearance.siteWidth || 'standard';
    }
    
    // Button style dropdown
    const buttonSelect = document.getElementById('appearance-button-style');
    if (buttonSelect) {
        buttonSelect.innerHTML = '';
        Object.entries(buttonStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            buttonSelect.appendChild(option);
        });
        buttonSelect.value = appearance.buttonStyle || 'rounded';
    }

    // Custom Navigation Button style dropdown
    const customNavButtonSelect = document.getElementById('appearance-custom-nav-button-style');
    if (customNavButtonSelect) {
        customNavButtonSelect.innerHTML = '';
        Object.entries(buttonStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            customNavButtonSelect.appendChild(option);
        });
        customNavButtonSelect.value = appearance.customNavButtonStyle || 'rounded';
    }

    // Back to Top style dropdown
    const backToTopSelect = document.getElementById('appearance-back-to-top-style');
    if (backToTopSelect) {
        backToTopSelect.innerHTML = '';
        Object.entries(backToTopStyles).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            backToTopSelect.appendChild(option);
        });
        backToTopSelect.value = appearance.backToTopStyle || 'circular';
    }
    
    // Update descriptions
    updateAppearanceDescriptions();
    
    // ENHANCED: Multiple forced updates with better validation
    const forceUpdate = () => {
        const currentAppearance = getAppearanceSettings();
        
        if (overviewSelect && currentAppearance.overviewStyle) {
            overviewSelect.value = currentAppearance.overviewStyle;
        }
        if (navigationSelect && currentAppearance.navigationStyle) {
            navigationSelect.value = currentAppearance.navigationStyle;
        }
        if (colorSelect && currentAppearance.colorScheme) {
            colorSelect.value = currentAppearance.colorScheme;
        }
        if (fontSelect && currentAppearance.fontSet) {
            fontSelect.value = currentAppearance.fontSet;
        }
        if (cardSelect && currentAppearance.cardStyle) {
            cardSelect.value = currentAppearance.cardStyle;
        }
        if (containerSelect && currentAppearance.containerStyle) {
            containerSelect.value = currentAppearance.containerStyle;
        }
        if (subcontainerSelect && currentAppearance.subcontainerStyle) {
            subcontainerSelect.value = currentAppearance.subcontainerStyle;
        }
        if (infodisplaySelect && currentAppearance.infodisplayStyle) {
            infodisplaySelect.value = currentAppearance.infodisplayStyle;
        }
        if (bannerSelect && currentAppearance.bannerSize) {
            bannerSelect.value = currentAppearance.bannerSize;
        }
        if (buttonSelect && currentAppearance.buttonStyle) {
            buttonSelect.value = currentAppearance.buttonStyle;
        }
        if (customNavButtonSelect && currentAppearance.customNavButtonStyle) {
            customNavButtonSelect.value = currentAppearance.customNavButtonStyle;
        }
        if (siteWidthSelect && currentAppearance.siteWidth) {
            siteWidthSelect.value = currentAppearance.siteWidth;
        }
        
        updateAppearanceDescriptions();
    };
    
    // Schedule multiple force updates to handle timing issues
    setTimeout(forceUpdate, 50);
    setTimeout(forceUpdate, 150);
    setTimeout(forceUpdate, 350);
}

// Add event listeners for appearance controls
function addAppearanceEventListeners() {
    const controls = [
        'appearance-overview-style',      
        'appearance-navigation-style',    
        'appearance-color-scheme', 
        'appearance-font-set',
        'appearance-world-categories-header',  // ADD THIS LINE
        'appearance-page-header',
        'appearance-storyline-style',
        'appearance-container-style',
        'appearance-subcontainer-style',
        'appearance-banner-size',
        'appearance-banner-style',
        'appearance-background-style', 
        'appearance-background-color-overlay',
        'appearance-button-style',
        'appearance-custom-nav-button-style',
        'appearance-back-to-top-style',
        'appearance-site-width',
        'appearance-card-style'
    ];
    
    controls.forEach(controlId => {
        const control = document.getElementById(controlId);
        if (control) {
            control.addEventListener('change', handleAppearanceChange);
        } else {
            console.warn('Could not find control:', controlId);
        }
    });
}

// Handle appearance control changes
function handleAppearanceChange(event) {
    const controlId = event.target.id;
    const value = event.target.value;
    
    console.log('Appearance change:', controlId, 'to', value);
    
    // Ensure appearance object exists
    if (!window.infoData) {
        window.infoData = {};
    }
    if (!window.infoData.appearance) {
        window.infoData.appearance = { ...defaultAppearance };
    }
    
    // Update infoData
    switch (controlId) {
        case 'appearance-overview-style':
            window.infoData.appearance.overviewStyle = value;
            break;
        case 'appearance-navigation-style':
            window.infoData.appearance.navigationStyle = value;
            break;
        case 'appearance-color-scheme':
            window.infoData.appearance.colorScheme = value;
            break;
        case 'appearance-font-set':
            window.infoData.appearance.fontSet = value;
            break;
        case 'appearance-card-style':
            window.infoData.appearance.cardStyle = value;
            break;
        case 'appearance-world-categories-header':  // ADD THIS CASE
            window.infoData.appearance.worldCategoriesHeader = value;
            break;
        case 'appearance-page-header':
            window.infoData.appearance.pageHeader = value;
            console.log('Page header changed to:', value); // ADD DEBUG LINE
            break;
        case 'appearance-storyline-style':  // ADD THIS CASE
            window.infoData.appearance.storylineStyle = value;
            break;
        case 'appearance-container-style':
            window.infoData.appearance.containerStyle = value;
            break;
        case 'appearance-subcontainer-style':
            window.infoData.appearance.subcontainerStyle = value;
            break;
        case 'appearance-infodisplay-style':
            window.infoData.appearance.infodisplayStyle = value;
            break;
        case 'appearance-banner-size':
            window.infoData.appearance.bannerSize = value;
            break;
        case 'appearance-banner-style':
            window.infoData.appearance.bannerStyle = value;
            break;
        case 'appearance-background-style':
            window.infoData.appearance.backgroundStyle = value;
            break;
        case 'appearance-background-color-overlay':
            window.infoData.appearance.backgroundColorOverlay = value;
            break;
        case 'appearance-button-style':  // NEW: Handle timeline style changes
            window.infoData.appearance.buttonStyle = value;
            break;
        case 'appearance-custom-nav-button-style':  // ADD THIS CASE
            window.infoData.appearance.customNavButtonStyle = value;
            break;
        case 'appearance-back-to-top-style':
            window.infoData.appearance.backToTopStyle = value;
            break;
        case 'appearance-site-width':  // ADD THIS CASE
            window.infoData.appearance.siteWidth = value;
            break;
    }
    
    console.log('Updated infoData.appearance:', window.infoData.appearance);
    
    // Update descriptions
    updateAppearanceDescriptions();
    
    // Auto-regenerate if HTML exists (optional - for live preview)
    const htmlOutput = document.getElementById('html-output');
    if (htmlOutput && htmlOutput.value && event.target.hasAttribute('data-auto-preview')) {
        generateHTML();
    }
}

// Update appearance descriptions
function updateAppearanceDescriptions() {
    const appearance = getAppearanceSettings();

    // Banner style description
    const bannerStyleDesc = document.getElementById('banner-style-description');
    if (bannerStyleDesc) {
        const style = appearance.bannerStyle || 'none';
        const styleObj = bannerStyles[style];
        if (styleObj) {
            bannerStyleDesc.textContent = styleObj.description;
        }
    }

    // Background style description
    const backgroundStyleDesc = document.getElementById('background-style-description');
    if (backgroundStyleDesc) {
        const style = appearance.backgroundStyle || 'none';
        const styleObj = backgroundStyles[style];
        if (styleObj) {
            backgroundStyleDesc.textContent = styleObj.description;
        }
    }

    // Background color overlay description
    const backgroundColorOverlayDesc = document.getElementById('background-color-overlay-description');
    if (backgroundColorOverlayDesc) {
        const overlay = appearance.backgroundColorOverlay || 'none';
        const overlayObj = backgroundColorOverlays[overlay];
        if (overlayObj) {
            backgroundColorOverlayDesc.textContent = overlayObj.description;
        }
    }
    
    // Overview style description
    const overviewDesc = document.getElementById('overview-style-description');
    if (overviewDesc) {
        const style = appearance.overviewStyle;
        overviewDesc.textContent = overviewStyles[style]?.description || '';
    }
    
    // Navigation style description
    const navigationDesc = document.getElementById('navigation-style-description');
    if (navigationDesc) {
        const style = appearance.navigationStyle;
        navigationDesc.textContent = navigationStyles[style]?.description || '';
    }
    
    // Color scheme description
    const colorDesc = document.getElementById('color-scheme-description');
    if (colorDesc) {
        const scheme = appearance.colorScheme;
        colorDesc.textContent = colorSchemes[scheme]?.description || '';
    }
    
    // Font set description
    const fontDesc = document.getElementById('font-set-description');
    if (fontDesc) {
        const fontSet = appearance.fontSet;
        fontDesc.textContent = fontSets[fontSet]?.description || '';
    }

    // World categories header description
    const worldCategoriesHeaderDesc = document.getElementById('world-categories-header-description');
    if (worldCategoriesHeaderDesc) {
        const style = appearance.worldCategoriesHeader || 'default';
        worldCategoriesHeaderDesc.textContent = worldCategoriesHeaderStyles[style]?.description || 'Controls how world category headers are displayed';
    }

    // Page header description
    const pageHeaderDesc = document.getElementById('page-header-description');
    if (pageHeaderDesc) {
        const style = appearance.pageHeader || 'standard';
        const descriptions = {
            'standard': 'Standard headers with borders and traditional styling',
            'minimal': 'Clean text-only headers with subtle underlines and minimal spacing',
            'banner': 'Large banner-style headers with gradients and shadows', 
            'compact': 'Condensed headers to save vertical space with light backgrounds',
            'cards': 'Elevated card-like headers with shadows and colored borders',
            'kawaii': 'Cute rounded headers with pastel gradients and sparkle decorations',
            'industrial': 'Technical angular headers with clipped corners and bold accents',
            'manuscript': 'Elegant parchment-style headers with ornate corner decorations',
            'neon': 'Cyberpunk headers with glowing effects and neon accent colors',
            'cyberpunk': 'Neon terminal interface with scanning grids, holographic brackets, and glowing section headers',
            'matrix': 'Digital terminal with cascading code effects and monospace typography for section headers',
            'glitch': 'Digital corruption with RGB text separation and static noise effects on headers and tabs',
            'neuralInterface': 'Connected network nodes with pulsing connections and data flow animations'
        };
        pageHeaderDesc.textContent = descriptions[style] || 'Controls the style of page headers throughout the site';
    }

    // Storyline style description
    const storylineStyleDesc = document.getElementById('storyline-style-description');
    if (storylineStyleDesc) {
        const style = appearance.storylineStyle || 'default';
        storylineStyleDesc.textContent = storylineStyles[style]?.description || 'Controls the style of storyline section headers, subsection headers, and table of contents';
    }

    // Card style description
    const cardDesc = document.getElementById('card-style-description');
    if (cardDesc) {
        const style = appearance.cardStyle;
        cardDesc.textContent = cardStyles[style]?.description || '';
    }
    
    // Container style description
    const containerDesc = document.getElementById('container-style-description');
    if (containerDesc) {
        const style = appearance.containerStyle;
        containerDesc.textContent = containerStyles[style]?.description || '';
    }
    
    // Subcontainer style description
    const subcontainerDesc = document.getElementById('subcontainer-style-description');
    if (subcontainerDesc) {
        const style = appearance.subcontainerStyle;
        subcontainerDesc.textContent = subcontainerStyles[style]?.description || '';
    }

    // Info-Display style description
    const infodisplayDesc = document.getElementById('infodisplay-style-description');
    if (infodisplayDesc) {
        const style = appearance.infodisplayStyle;
        infodisplayDesc.textContent = infodisplayStyles[style]?.description || '';
    }

    // Banner size description
    const bannerDesc = document.getElementById('banner-size-description');
    if (bannerDesc) {
        const size = appearance.bannerSize || 'large';
        const sizeNames = { 
            'extra-small': 'Extra Small',
            small: 'Small', 
            medium: 'Medium', 
            large: 'Large',
            separate: 'Separate (Full Width)',
            hidden: 'Hidden'
        };
        bannerDesc.textContent = `Controls the height of the banner image area (current: ${sizeNames[size]})`;
    }

    // Site width description (ADD THIS SECTION)
    const siteWidthDesc = document.getElementById('site-width-description');
    if (siteWidthDesc) {
        const width = appearance.siteWidth || 'standard';
        const widthNames = { 
            narrow: 'Narrow (800px)', 
            standard: 'Standard (900px)', 
            wide: 'Wide (1000px)' 
        };
        siteWidthDesc.textContent = `Controls the maximum width of the generated info page (current: ${widthNames[width]})`;
    }

    // Button style description (NEW)
    const buttonDesc = document.getElementById('button-style-description');
    if (buttonDesc) {
        const style = appearance.buttonStyle || 'rounded';
        buttonDesc.textContent = buttonStyles[style]?.description || 'Controls how button elements are displayed (not yet implemented)';
    }

    // Add this in the updateAppearanceDescriptions function
    const customNavButtonStyleDesc = document.getElementById('custom-nav-button-style-description');
    if (customNavButtonStyleDesc && buttonStyles[appearance.customNavButtonStyle || 'rounded']) {
        customNavButtonStyleDesc.textContent = buttonStyles[appearance.customNavButtonStyle || 'rounded'].description;
    }

    // Add this somewhere in the updateAppearanceDescriptions function:
    const backToTopDesc = document.getElementById('back-to-top-style-description');
    if (backToTopDesc) {
        const style = appearance.backToTopStyle || 'circular';
        const styleObj = backToTopStyles[style];
        if (styleObj) {
            backToTopDesc.textContent = styleObj.description;
        }
    }
}

// Migrate old template setting to new split settings
function migrateTemplateToSplitStyles(appearance) {
    // If we have the old template setting but not the new ones
    if (appearance.template && (!appearance.overviewStyle || !appearance.navigationStyle)) {
        console.log('Migrating old template setting:', appearance.template);
        
        // Set both styles to the same as the old template
        appearance.overviewStyle = appearance.template;
        appearance.navigationStyle = appearance.template;
        
        // Remove the old template setting
        delete appearance.template;
        
        console.log('Migrated to:', { 
            overviewStyle: appearance.overviewStyle, 
            navigationStyle: appearance.navigationStyle 
        });
    }
    
    // ENHANCED: Also ensure cardStyle exists even if template didn't exist
    if (!appearance.cardStyle) {
        appearance.cardStyle = 'current';
        console.log('Set missing cardStyle to default:', appearance.cardStyle);
    }
    
    return appearance;
}

// Get current appearance settings
function getAppearanceSettings() {
    // Ensure appearance settings exist and have all required properties
    if (!window.infoData) {
        window.infoData = {};
    }
    if (!window.infoData.appearance) {
        window.infoData.appearance = { ...defaultAppearance };
    }
    
    // ENHANCED: Fill in any missing properties more thoroughly
    Object.keys(defaultAppearance).forEach(key => {
        if (window.infoData.appearance[key] === undefined || window.infoData.appearance[key] === null) {
            window.infoData.appearance[key] = defaultAppearance[key];
            console.log(`Setting missing appearance property ${key} to default:`, defaultAppearance[key]);
        }
    });

    // ENHANCED: More comprehensive migration from old template setting
    window.infoData.appearance = migrateTemplateToSplitStyles(window.infoData.appearance);
    
    return window.infoData.appearance;
}

// Get color scheme colors
function getColorScheme() {
    const appearance = getAppearanceSettings();
    const schemeName = appearance.colorScheme || 'current';
    const baseColors = colorSchemes[schemeName]?.colors || colorSchemes.current.colors;
    
    // NEW: Check for custom overrides
    const overrides = window.infoData && 
                     window.infoData.appearance && 
                     window.infoData.appearance.customColorOverrides;
    
    if (overrides) {
        return { ...baseColors, ...overrides };
    }
    
    return baseColors;
}

// Get font set
function getFontSet() {
    const appearance = getAppearanceSettings();
    const fontName = appearance.fontSet || 'serif';
    return fontSets[fontName] || fontSets.serif;
}

// Preview appearance changes
function previewAppearanceChanges() {
    // Generate HTML with current settings
    if (document.getElementById('html-output').value) {
        generateHTML();
        
        // Switch to preview tab
        if (typeof switchSubTab === 'function') {
            switchSubTab('preview');
        }
        
        // Switch to generate main tab if not already there
        if (typeof switchMainTab === 'function') {
            switchMainTab('generate');
        }
        
        if (typeof showStatus === 'function') {
            showStatus('success', 'Preview updated with new appearance settings!');
        }
    } else {
        if (typeof showStatus === 'function') {
            showStatus('error', 'Please generate HTML first, then you can preview appearance changes.');
        } else {
            alert('Please generate HTML first, then you can preview appearance changes.');
        }
    }
}

// Reset appearance to defaults
function resetAppearanceToDefaults() {
    if (confirm('Reset all appearance settings to defaults?')) {
        if (!window.infoData) {
            window.infoData = {};
        }
        window.infoData.appearance = { ...defaultAppearance };
        populateAppearanceControls();
        
        if (typeof showStatus === 'function') {
            showStatus('success', 'Appearance settings reset to defaults');
        }
    }
}

// Export appearance settings
function exportAppearanceSettings() {
    const settings = getAppearanceSettings();
    const jsonData = JSON.stringify(settings, null, 2);
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData));
    element.setAttribute('download', 'appearance-settings.json');
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Import appearance settings
function importAppearanceSettings() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                
                // Validate settings have required properties
                const requiredKeys = Object.keys(defaultAppearance);
                const isValid = requiredKeys.every(key => settings.hasOwnProperty(key));
                
                if (isValid) {
                    if (!window.infoData) {
                        window.infoData = {};
                    }
                    window.infoData.appearance = { ...defaultAppearance, ...settings };
                    populateAppearanceControls();
                    
                    if (typeof showStatus === 'function') {
                        showStatus('success', 'Appearance settings imported successfully!');
                    } else {
                        alert('Appearance settings imported successfully!');
                    }
                } else {
                    throw new Error('Invalid appearance settings file');
                }
            } catch (error) {
                if (typeof showStatus === 'function') {
                    showStatus('error', 'Error importing appearance settings: Invalid file format');
                } else {
                    alert('Error importing appearance settings: Invalid file format');
                }
            }
        };
        reader.readAsText(file);
    };
    
    fileInput.click();
}

// Load appearance settings from external data (useful for imports)
function loadAppearanceSettings(appearanceData) {
    if (appearanceData && typeof appearanceData === 'object') {
        if (!window.infoData) {
            window.infoData = {};
        }
        if (!window.infoData.appearance) {
            window.infoData.appearance = { ...defaultAppearance };
        }
        
        // Update the settings
        window.infoData.appearance = { ...defaultAppearance, ...appearanceData };
        
        // Repopulate the controls
        populateAppearanceControls();
        
        return true;
    }
    return false;
}

// Debug function to check current appearance state
function debugAppearanceState() {
    console.log('=== APPEARANCE DEBUG ===');
    console.log('infoData.appearance:', window.infoData?.appearance);
    console.log('Template dropdown value:', document.getElementById('appearance-template')?.value);
    console.log('Color scheme dropdown value:', document.getElementById('appearance-color-scheme')?.value);
    console.log('Font set dropdown value:', document.getElementById('appearance-font-set')?.value);
    console.log('Container style dropdown value:', document.getElementById('appearance-container-style')?.value);
    console.log('Subcontainer style dropdown value:', document.getElementById('appearance-subcontainer-style')?.value);
    console.log('========================');
}

// Export functions for use in other files - Make sure these are available immediately
if (typeof window !== 'undefined') {
    window.initializeAppearance = initializeAppearance;
    window.getAppearanceSettings = getAppearanceSettings;
    window.getColorScheme = getColorScheme;
    window.getFontSet = getFontSet;
    window.populateAppearanceControls = populateAppearanceControls;
    window.loadAppearanceSettings = loadAppearanceSettings;
    window.previewAppearanceChanges = previewAppearanceChanges;
    window.resetAppearanceToDefaults = resetAppearanceToDefaults;
    window.exportAppearanceSettings = exportAppearanceSettings;
    window.importAppearanceSettings = importAppearanceSettings;
    window.debugAppearanceState = debugAppearanceState;
}