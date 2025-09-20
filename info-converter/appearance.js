import colorSchemes from './templates/color-schemes.js';
import backToTopStyles from './templates/backtotop-styles.js';
import fontSets from './templates/font-sets.js';
import bannerStyles from './templates/banner-styles.js';
// Appearance Management System - Fixed

// Default appearance settings
const defaultAppearance = {
    overviewStyle: 'journal',     
    navigationStyle: 'journal',   
    colorScheme: 'current',
    fontSet: 'serif',
    worldCategoriesHeader: 'default',
    pageHeader: 'standard',
    containerStyle: 'left-border',
    subcontainerStyle: 'soft-bg',
    bannerSize: 'large',
    bannerStyle: 'none',
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

// Overview style definitions
const overviewStyles = {
    journal: {
        name: 'Journal',
        description: 'Notebook aesthetic with lined paper and red margin line'
    },
    modern: {
        name: 'Modern',
        description: 'Clean cards with rounded corners and gradient header'
    },
    classic: {
        name: 'Classic',
        description: 'Traditional formal document with ornate double borders'
    },
    magazine: {
        name: 'Magazine',
        description: 'Clean editorial layout with professional typography and subtle accents'
    },
    minimal: {
        name: 'Minimal',
        description: 'Ultra-clean design with generous whitespace and subtle shadows'
    },
    botanical: {
        name: 'Botanical',
        description: 'Organic nature theme with vine patterns and leaf decorations'
    },
    constellation: {
        name: 'Constellation', 
        description: 'Starfield mapping with celestial navigation elements'
    },
    manuscript: {
        name: 'Manuscript',
        description: 'Medieval illuminated manuscript with drop caps and ornate borders'
    },
    neon: {
        name: 'Neon',
        description: 'Cyberpunk retro-future with glowing circuit patterns'
    },
    archive: {
        name: 'Archive',
        description: 'Research library filing system with classification labels'
    },
    kawaii: {
        name: 'Kawaii',
        descriptions: 'Soft pastel design with rounded corners, dreamy gradients, and adorable decorative elements.'
    },
    candyPop: {
        name: 'Candy Pop',
        description: '3D candy button styling with glossy shine effects.'
    },
    cottagecoreDiary: {
        name: 'Cottagecore Diary',
        description: 'A cozy, rustic journal with pressed flowers, delicate vines, and a warm, sun-drenched cottage feel.'
    },
    magicalGirlLocket: {
        name: 'Magical Girl Locket',
        description: 'A sparkling magical girl transformation item, with shimmering stars, pastel ribbons, and a radiant heart motif.'
    },
    pastelSpells: {
        name: 'Pastel Spells',
        description: 'A sweetly spooky grimoire mixing pastel magic with dark, gothic elements.'
    },
    strawberryPatch: {
        name: 'Strawberry Patch',
        description: 'A sweet and fresh design reminiscent of a picnic blanket.'
    },
    industrial: {
        name: 'Industrial',
        description: 'Wireframe/grid background overlay, hard angles'
    },
    wuxia: {
        name: 'Wuxia',
        description: 'Elegant cultivation manual page with traditional corner decorations and jade accents'
    },
    horrific: {
        name: 'Horrific',
        description: 'Cursed grimoire page with blood drips and ominous shadows'
    },
    foundFootage: {
        name: 'Found Footage',
        description: 'Simulates a night-vision security camera feed with scanlines, a REC indicator, timestamps, and a low-fi, gritty feel.'
    },
    badSignal: {
        name: 'Bad Signal',
        description: 'Mimics a degraded VHS tape or a haunted broadcast, featuring static, distortion, and unsettling visual glitches.'
    },
    theFurther: {
        name: 'The Further',
        description: 'A descent into a shadowy, ethereal realm. Features dark, smoky textures, faint, ghostly text effects, and an oppressive, claustrophobic atmosphere.'
    },
    parchment: {
        name: 'Parchment&Quill',
        description: 'Elegant personal letter with wax seal, letterhead, and refined correspondence styling'
    },
    dataTerminal: {
        name: 'Data Terminal',
        description: 'Cyberpunk terminal interface with scanlines, command prompts, line numbers, and monospace typography'
    }
};

// Navigation style definitions
const navigationStyles = {
    hidden: {
        name: 'Hidden',
        description: 'Completely hide the navigation tabs from view'
    },
    journal: {
        name: 'Journal',
        description: 'Icon-based side navigation with hover effects'
    },
    modern: {
        name: 'Modern',
        description: 'Flat uppercase text tabs with bottom borders'
    },
    classic: {
        name: 'Classic',
        description: 'Traditional bordered navigation with standard styling'
    },
    circular: {
        name: 'Circular',
        description: 'Round circular tabs positioned vertically on the left side with letter initials'
    },
    squares: {
        name: 'Squares',
        description: 'Square icon tabs positioned vertically on the left side with FontAwesome icons'
    },
    pills: {
        name: 'Pills',
        description: 'Rounded pill-shaped tabs with smooth transitions and clean spacing'
    },
    underline: {
        name: 'Underline',
        description: 'Minimalist tabs with animated underlines and subtle hover effects'
    },
    kawaii: {
        name: 'Kawaii',
        description: 'Cute pastel bubble tabs with sparkle effects and bouncy hover animations'
    },
    hearts: {
        name: 'Hearts',
        description: 'Sweet heart-themed tabs with animated heart decorations and gentle heartbeat effects'
    },
    candy: {
        name: 'Candy',
        description: 'Round candy-like side tabs with cute emoji icons and playful scaling animations'
    },
    flowers: {
        name: 'Flowers',
        description: 'Flower petal-shaped tabs with blooming center animations and gentle rotation effects'
    },
    industrial: {
        name: 'Industrial',
        description: 'Hard-edged tabs attached to the main content area'
    },
    wuxia: {
        name: 'Wuxia',
        description: 'Elegant hanging scroll tabs with jade accents and flowing animations'
    },
    playersHandbook: {
        name: 'Player\'s Handbook',
        description: 'Ornate D&D handbook chapter tabs with corner flourishes and illuminated manuscript styling'
    },
    adventurersTome: {
        name: 'Adventurer\'s Tome',
        description: 'Tabs with a wooden effect, TTRPG inspired'
    },
    cartographersTable: {
        name: 'Cartographer\'s Table',
        description: 'Torn map fragments on a dark leather background, with a dotted line connecting to the active tab.'
    },
    royalBanner: {
        name: 'Royal Banner',
        description: 'Hanging silk banners sealed with a royal crest, fit for a king\'s council chamber.'
    },
    steppingStones: {
        name: 'Stepping Stones',
        description: 'Vertically-aligned, moss-covered runestones that glow softly with an inner light when selected.'
    },
    starforged: {
        name: 'Starforged',
        description: 'Celestial navigation points that form a guiding constellation when a path is chosen.'
    },
    horrific: {
        name: 'Horrific',
        description: 'Cursed grimoire tabs with occult symbols and blood red accents'
    },
    foundFootage: {
        name: 'Found Footage',
        description: 'A glitchy camcorder interface with scanlines and a REC indicator, inspired by found footage horror.'
    },
    badSignal: {
        name: 'Bad Signal',
        description: 'A distorted, flickering VHS tape interface with analog static and unsettling visual corruption.'
    },
    theFurther: {
        name: 'The Further',
        description: 'A dark, ethereal style with floating, smoky tabs and an ominous, ghostly glow on the active selection.'
    },
    parchment: {
        name: 'Parchment&Quill',
        description: 'Elegant folded parchment tabs with wax seals, inspired by regency correspondence'
    },
    cyberpunk: {
        name: 'Cyberpunk',
        description: 'Neon-glowing terminal tabs with holographic brackets, scanning lines, and futuristic styling'
    },
    holographic: {
        name: 'Holographic',
        description: 'Iridescent tabs with prismatic shimmer effects and color-shifting borders'
    },
    matrix: {
        name: 'Matrix',
        description: 'Digital rain terminal interface with vertical tabs and cascading code effects'
    },
    neuralNetwork: {
        name: 'Neural Network',
        description: 'Circular connected nodes with pulsing neural connections and data flow animations'
    },
    glitch: {
        name: 'Glitch',
        description: 'Digital corruption effects with RGB separation, static noise, and data distortion'
    },
};

// Button styles
const buttonStyles = {
    'rounded': {
        name: 'Rounded',
        description: 'Buttons with soft rounded corners'
    },
    'sharp': {
        name: 'Sharp', 
        description: 'Buttons with square corners'
    },
    'pill': {
        name: 'Pill',
        description: 'Buttons with fully rounded edges'
    },
    'subtle': {
        name: 'Subtle',
        description: 'Buttons with minimal rounded corners'
    },
    'neon': {
        name: 'Neon',
        description: 'Cyberpunk glowing neon buttons with electric effects'
    },
    'glassmorphism': {
        name: 'Glassmorphism', 
        description: 'Modern frosted glass effect with subtle transparency'
    },
    'origami': {
        name: 'Origami',
        description: 'Folded paper effect with crisp angular shadows'
    },
    'holographic': {
        name: 'Holographic',
        description: 'Iridescent rainbow shimmer effects that shift with hover'
    },
    'sketch': {
        name: 'Sketch',
        description: 'Hand-drawn artistic style with rough, sketchy borders'
    },
    'crystal': {
        name: 'Crystal',
        description: 'Faceted gem-like appearance with prismatic reflections'
    },
    'typewriter': {
        name: 'Typewriter',
        description: 'Vintage typewriter key styling with mechanical click effects'
    },
    'liquid': {
        name: 'Liquid',
        description: 'Organic flowing blob shapes that morph on hover'
    },
    'kawaii': {
        name: 'Kawaii',
        description: 'Cute rounded buttons with soft shadows and heart decorations'
    },
    'candyPop': {
        name: 'Candy Pop',
        description: 'Glossy 3D candy buttons with shine effects and gentle scaling'
    },
    'magicalGirl': {
        name: 'Magical Girl', 
        description: 'Sparkly buttons with star decorations and magical glow effects'
    },
    'industrial': {
        name: 'Industrial',
        description: 'Angular buttons with clipped corners and metal-like styling'
    },
    'wuxia': {
        name: 'Wuxia',
        description: 'Elegant jade-inspired buttons with traditional patterns'
    },
    'horrific': {
        name: 'Horrific',
        description: 'Dark gothic buttons with blood-drip effects and ominous shadows'
    },
    'glitchSignal': {
        name: 'Glitch Signal',
        description: 'An analog horror button that flickers and distorts with corrupted data and RGB-shifting text.'
    },
    'ectoplasm': {
        name: 'Ectoplasm',
        description: 'A semi-transparent, ghostly button with a wispy, morphing shape and an ethereal glow.'
    },
    'runicCarving': {
        name: 'Runic Carving',
        description: 'Looks like a symbol carved into ancient stone, with inset text and a faint, ominous energy.'
    },
    'parchment': {
        name: 'Parchment',
        description: 'Aged paper buttons with ink-stain effects and quill flourishes'
    }
};

// World Categories Header style definitions
const worldCategoriesHeaderStyles = {
    'default': {
        name: 'Default',
        description: 'Standard category headers with basic styling'
    },
    'hidden': {
        name: 'Hidden',
        description: 'Hide category headers completely'
    },
    'enhanced': {
        name: 'Enhanced',
        description: 'Bold headers with colored underlines and caps'
    },
    'boxed': {
        name: 'Boxed',
        description: 'Headers in bordered boxes with background'
    },
    'accent': {
        name: 'Accent Bar',
        description: 'Left accent bar with gradient background'
    },
    'underlined': {
        name: 'Underlined',
        description: 'Clean headers with simple bottom borders and uppercase styling'
    },
    'simple': {
        name: 'Simple',
        description: 'Basic headers with light backgrounds and subtle borders'
    },
    'bordered': {
        name: 'Bordered',
        description: 'Clean headers with full borders and centered text'
    },
    'minimal': {
        name: 'Minimal',
        description: 'Ultra-minimal headers with just uppercase text and spacing'
    },
    'clean': {
        name: 'Clean',
        description: 'Modern headers with soft backgrounds and left accent borders'
    },
    'kawaii': {
        name: 'Kawaii',
        description: 'Adorable rounded headers with soft pastel gradients and heart decorations'
    },
    'candyPop': {
        name: 'Candy Pop',
        description: 'Transparent candy-style headers with glossy shine effects and glass-like appearance'
    },
    'magicalGirl': {
        name: 'Magical Girl',
        description: 'Sparkly headers with star decorations and magical gradient backgrounds'
    },
    'industrial': {
        name: 'Industrial',
        description: 'Technical headers with hard edges, clipped corners, and bold left borders'
    },
    'wuxia': {
        name: 'Wuxia',
        description: 'Elegant headers with jade accents, subtle gradients, and traditional diamond flourishes'
    },
    'playersHandbook': {
        name: 'Player\'s Handbook',
        description: 'Ornate D&D manuscript headers with burgundy gradients and corner flourishes'
    },
    'adventurersTome': {
        name: 'Adventurer\'s Tome',
        description: 'Wooden tome headers with leather-bound styling and colored category tabs'
    },
    'horrific': {
        name: 'Horrific',
        description: 'Dark occult headers with blood red accents and ominous glowing seals'
    },
    'parchmentQuill': {
        name: 'Parchment&Quill',
        description: 'Elegant aged parchment headers with quill pen flourishes and ink accents'
    },
    'cyberpunk': {
        name: 'Cyberpunk',
        description: 'Simple neon terminal headers with glowing text and left accent borders'
    },
    'holographic': {
        name: 'Holographic',
        description: 'Subtle gradient headers with soft borders and light text glow'
    },
    'digitalMinimal': {
        name: 'Digital Minimal',
        description: 'Clean tech headers with bottom borders and spaced lettering'
    },
    'neonBoxed': {
        name: 'Neon Boxed',
        description: 'Simple bordered headers with centered text and subtle glow'
    },
    'dataLabel': {
        name: 'Data Label',
        description: 'File system style headers with monospace font and comment prefixes'
    }
};

// Container style definitions (affects main world item containers)
const containerStyles = {
    'left-border': {
        name: 'Left Border',
        description: 'Colored left border, different colors per category'
    },
    'outlined': {
        name: 'Outlined',
        description: 'Border around entire container, different colors per category'
    },
    'cards': {
        name: 'Cards',
        description: 'Drop shadows with thick top borders, different colors per category'
    },
    'solid-bg': {
        name: 'Solid Background',
        description: 'Subtle solid color backgrounds with sharp corners'
    },
    'outlined-bg': {
        name: 'Outlined Background',
        description: 'Subtle solid color backgrounds with matching outlines and rounded corners'
    },
    'boxed': {
        name: 'Boxed',
        description: 'Clean boxes with subtle shadows and rounded corners'
    },
    'tabs': {
        name: 'Tabs', 
        description: 'File folder style with colored tabs at the top'
    },
    'rounded': {
        name: 'Rounded',
        description: 'Modern rounded design with soft shadows and category accents'
    },
    'kawaii': {
        name: 'Kawaii',
        description: 'Adorable pastel containers with rounded corners, soft shadows, and cute emoji accents'
    },
    'candyPop': {
        name: 'Candy Pop',
        description: 'Sweet candy-colored containers with bubbly borders and playful gradients'
    },
    'magicalGirl': {
        name: 'Magical Girl',
        description: 'Sparkly containers with star decorations, gradient borders, and magical shimmer effects'
    },
    'industrial': {
        name: 'Industrial',
        description: 'Just background color differences and colored category headers'
    },
    'wuxia': {
        name: 'Wuxia',
        description: 'Refined containers with subtle gradients, traditional patterns, and jade-colored category accents'
    },
    'playersHandbook': {
        name: 'Player\'s Handbook',
        description: 'Ornate D&D handbook entries with burgundy borders, corner decorations, and illuminated category headers'
    },
    'adventurersTome': {
        name: 'Adventurer\'s Tome',
        description: ''
    },
    'horrific': {
        name: 'Horrific',
        description: 'Cursed relics with occult symbols and blood-red seals'
    },
    'parchment': {
        name: 'Parchment&Quill',
        description: 'Elegant aged parchment documents with ink accents and regency styling'
    },
    'minimal': {
        name: 'Minimal',
        description: 'Just background color differences and colored category headers'
    }
};

// Subcontainer style definitions (affects info sections within world items)
const subcontainerStyles = {
    'soft-bg': {
        name: 'Soft Background',
        description: 'Light background with subtle borders'
    },
    'outlined': {
        name: 'Outlined',
        description: 'Alternating solid and dashed borders'
    },
    'pills': {
        name: 'Pills',
        description: 'Rounded sections with shadows'
    },
    'stripes': {
        name: 'Stripes',
        description: 'Alternating colors with thick left borders'
    },
    'boxed': {
        name: 'Boxed',
        description: 'Simple contained sections with subtle borders'
    },
    'headers': {
        name: 'Headers',
        description: 'Clean section headers with colored backgrounds'
    },
    'rounded': {
        name: 'Rounded',
        description: 'Soft rounded sections to match rounded containers'
    },
    'kawaii': {
        name: 'Kawaii',
        description: 'Soft pastel info sections with rounded bubbles and gentle shadows'
    },
    'candyPop': {
        name: 'Candy Pop', 
        description: 'Sweet candy-themed sections with colorful borders and bubbly styling'
    },
    'magicalGirl': {
        name: 'Magical Girl',
        description: 'Enchanted info sections with sparkle effects and magical gradient backgrounds'
    },
    'industrial': {
        name: 'Industrial',
        description: 'Hard edges with a clipped corner, thick left border'
    },
    'wuxia': {
        name: 'Wuxia',
        description: 'Elegant sections with scholarly patterns and refined jade-tinted borders'
    },
    'playersHandbook': {
        name: 'Player\'s Handbook',
        description: 'Medieval manuscript sections with corner flourishes, illuminated headers, and parchment textures'
    },
    'adventurersTome': {
        name: 'Adventurer\'s Tome',
        description: ''
    },
    'horrific': {
        name: 'Horrific', 
        description: 'Forbidden scrolls with ancient parchment texture and wax seals'
    },
    'parchment': {
        name: 'Parchment&Quill',
        description: 'Refined letter sections with quill pen flourishes and watermark textures'
    },
    'minimal': {
        name: 'Minimal',
        description: 'Clean text with dotted separators'
    }

};

// Card style definitions (affects character, storyline, plan, and playlist cards)
const cardStyles = {
    'current': {
        name: 'Current',
        description: 'Current card styling for characters, storylines, plans, and playlists'
    },
    'modern': {
        name: 'Modern',
        description: 'Clean modern cards with subtle shadows and rounded corners'
    },
    'minimal': {
        name: 'Minimal',
        description: 'Simple flat cards with basic borders and clean typography'
    },
    'detailed': {
        name: 'Detailed',
        description: 'Rich cards with multiple visual elements and enhanced spacing'
    },
    'corporate': {
        name: 'Corporate', 
        description: 'Professional business-like design with structured borders and uppercase styling'
    },
    'vintage': {
        name: 'Vintage',
        description: 'Retro aesthetic with sepia tinting, inset shadows, and classic styling'
    },
    'frost': {
        name: 'Frost',
        description: 'Modern transparency effects with subtle backdrop blur and gradient backgrounds'
    },
    'slate': {
        name: 'Slate',
        description: 'Flat design emphasizing contrast with bold borders and clean typography'
    },
    'kawaii': {
        name: 'Kawaii',
        description: 'Cute rounded cards with heart decorations and soft pastel styling'
    },
    'pastelDream': {
        name: 'Pastel Dream',
        description: 'Dreamy ultra-soft cards with gentle shimmer effects and ethereal gradients'
    },
    'candyPop': {
        name: 'Candy Pop',
        description: 'Sweet bouncy cards with candy-colored borders, glossy shine effects, and playful scaling animations'
    },
    'magicalGirl': {
        name: 'Magical Girl',
        description: 'Sparkly transformation-themed cards with rainbow borders, floating animations, and magical glow effects'
    },
    'industrial': {
        name: 'Industrial',
        description: 'Stamped metal and dossier cards'
    },
    'wuxia': {
        name: 'Wuxia',
        description: 'Refined jade tablet cards with traditional patterns and elegant Chinese character accents'
    },
    'playersHandbook': {
        name: 'Player\'s Handbook',
        description: 'Ornate medieval manuscript cards with illuminated portraits, quest descriptions, battle maps, and bardic song sheets'
    },
    'adventurersTome': {
        name: 'Adventurer\'s Tome',
        description: ''
    },
    'horrific': {
        name: 'Horrific',
        description: 'Cursed portraits and forbidden tome pages with dark textures'
    },
    'parchment': {
        name: 'Parchment&Quill',
        description: 'Refined regency calling cards and correspondence with wax seals and elegant paper textures'
    },
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
        'appearance-container-style',
        'appearance-subcontainer-style',
        'appearance-banner-size',
        'appearance-banner-style', 
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
        case 'appearance-container-style':
            window.infoData.appearance.containerStyle = value;
            break;
        case 'appearance-subcontainer-style':
            window.infoData.appearance.subcontainerStyle = value;
            break;
        case 'appearance-banner-size':
            window.infoData.appearance.bannerSize = value;
            break;
        case 'appearance-banner-style':
            window.infoData.appearance.bannerStyle = value;
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

    // Banner size description
    const bannerDesc = document.getElementById('banner-size-description');
    if (bannerDesc) {
        const size = appearance.bannerSize || 'large';
        const sizeNames = { 
            'extra-small': 'Extra Small',
            small: 'Small', 
            medium: 'Medium', 
            large: 'Large',
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