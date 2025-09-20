import backToTopStyles from './templates/backtotop-styles.js';
import titleFonts from './templates/titlefonts.js';
import { generateOverviewStyles } from './templates/overview-styles.js';
import { generateOverviewLinksCSS, generateCustomNavigationCSS, generateSharedButtonStyles} from './templates/button-styles.js';
import { generateCardStyleCSS } from './templates/card-styles.js';
import { generateUnifiedFilterCSS } from './modules/filter-css.js';
import { generatePlansCSS } from './modules/plans-css.js';
import { generateTimelineCSS } from './modules/timeline-css.js';
import { generatePlaylistCSS } from './modules/playlist-css.js';
import { generateCategoryStyles } from './templates/category-styles.js';
import { generatePageHeaderStyles } from './templates/header-styles.js';
import { generateNavigationStyles } from './templates/navigation-styles.js';
import bannerStyles, { generateBannerStyleCSS } from './templates/banner-styles.js';
import { generateCharacterSubcontainerStyles, generateContainerStyles, generateSubcontainerStyles } from './templates/container-styles.js';
// CSS Generation Functions
// Split from html-generator.js to reduce file size
// At the top of css-generator.js, after other dependencies
if (typeof generateOverviewStyles !== 'function') {
    console.warn('Overview styles not loaded yet');
    // You could add a fallback or loading mechanism here if needed
}

function generateModalBackgroundStyle(basic, colors) {
    const bgImage = basic.modalBgImage && basic.modalBgImage.trim();
    const bgColor = basic.modalBgColor && basic.modalBgColor.trim();
    
    if (bgImage) {
        return `${bgColor || colors.containerBg} url('${bgImage}') center/cover no-repeat`;
    } else if (bgColor) {
        return bgColor;
    } else {
        return colors.containerBg;
    }
}

// Export the main CSS generation function
window.generateCSS = function() {
    // Get appearance settings - use fallbacks if functions aren't available yet
    let appearance = (typeof getAppearanceSettings === 'function') ? getAppearanceSettings() : {
        overviewStyle: 'journal',       
        navigationStyle: 'journal',
        colorScheme: 'current',
        fontSet: 'serif',
        worldCategoriesHeader: 'default',
        pageHeader: 'standard',
        containerStyle: 'left-border',
        subcontainerStyle: 'soft-bg',
        bannerSize: 'large',
        buttonStyle: 'rounded' 
    };

    // Migrate old template setting if needed
    appearance = migrateAppearanceForCSS(appearance);
    
    const colors = (typeof getColorScheme === 'function') ? getColorScheme() : {
        bodyBg: '#f5f5f5',
        containerBg: 'white',
        headerBg: '#e8e8e8',
        bannerBorder: 'rgba(255, 255, 255, 0.8)',
        navBg: '#444',
        navText: '#ccc',
        navActive: 'white',
        navActiveText: '#333',
        textPrimary: '#333',
        textSecondary: '#666',
        textMuted: '#999',
        textTitle: '#2c3e50',
        textContent: '#555',
        general: '#f0f4f8',
        locations: '#f0f4f8',
        factions: '#f7f3ff',
        concepts: '#f0f9f0',
        events: '#fff8f0',
        creatures: '#fdf2f8',
        plants: '#f0fdf4',
        items: '#f8f9ff',
        culture: '#fff8f0', // warm orange tint
        cultivation: '#f0f9f0', // green tint
        statusIdea: '#dc3545',
        statusDraft: '#ffc107',
        statusCanon: '#28a745',
        statusArchived: '#6c757d',
        softBg: '#f8f9fa'
    };
    
    const fonts = (typeof getFontSet === 'function') ? getFontSet() : {
        primary: "'Georgia', serif",
        secondary: "'Times New Roman', serif",
        ui: "'Trebuchet MS', 'Arial', sans-serif"
    };

    // Get banner size setting
    const bannerSize = appearance.bannerSize || 'large';
    const bannerHeights = {
        'extra-small': '80px',
        small: '120px',
        medium: '160px', 
        large: '200px',
        hidden: '50px'
    };
    const bannerHeight = bannerHeights[bannerSize];

    // ADD: Get site width setting (ADD THIS SECTION RIGHT AFTER BANNER SIZE)
    const siteWidth = appearance.siteWidth || 'standard';
    const siteWidths = {
        narrow: '800px',
        standard: '900px',
        wide: '1000px'
    };
    const containerWidth = siteWidths[siteWidth];
    
    // Get background settings from data
    const data = infoData || {};
    const basic = data.basic || {};

    // Calculate minimum height based on actual overview content
function calculateMinimumContainerHeight(appearance, basic, data) {
    const overviewStyle = appearance.overviewStyle || 'journal';
    
    // MUCH more aggressive padding - what styles actually need
    const stylePadding = {
        'journal': 80,
        'modern': 120,
        'classic': 60,       // Way more compact!
        'magazine': 70,
        'minimal': 160,      // This one actually needs space
        'industrial': 50,    // Super compact
        'wuxia': 120,
        'horrific': 90,
        'parchment': 90
    };
    
    let height = stylePadding[overviewStyle] || 60;
    
    // Only add what's actually there
    if (basic.overviewTitle && basic.overviewTitle.trim()) {
        height += 50; // Reduced from 60
    }
    
    if (basic.overviewLinks && basic.overviewLinks.length > 0) {
        const validLinks = basic.overviewLinks.filter(link => 
            link.label && link.label.trim() && link.url && link.url.trim()
        );
        if (validLinks.length > 0) {
            height += 60; // Reduced from 70
        }
    }
    
    if (basic.overview && basic.overview.trim()) {
        const text = basic.overview.trim();
        const words = text.split(/\s+/).length;
        const avgWordsPerLine = 15; // More words per line = less height
        const lineHeight = 22; // Slightly tighter
        const lines = Math.ceil(words / avgWordsPerLine);
        const textHeight = lines * lineHeight;
        const paragraphs = text.split(/\n\s*\n/).length;
        const paragraphSpacing = (paragraphs - 1) * 15; // Reduced spacing
        height += textHeight + paragraphSpacing;
    } else {
        height += 25; // Reduced from 30
    }
    
    if (basic.overviewImage && basic.overviewImage.trim()) {
        height += 340; // Reduced from 360
    }
    
    // Check vertical navigation
    const navigationStyle = appearance.navigationStyle || 'journal';
    
    if (navigationStyle === 'journal' || navigationStyle === 'squares') {
        const enabledSections = [];
        if (basic.overview || basic.overviewTitle) enabledSections.push('overview');
        if (data.world && Object.keys(data.world).some(cat => data.world[cat] && data.world[cat].length > 0)) {
            enabledSections.push('world');
        }
        if (data.characters && data.characters.length > 0) enabledSections.push('characters');
        if (data.storylines && data.storylines.length > 0) enabledSections.push('storylines');
        if (data.plans && data.plans.length > 0) enabledSections.push('plans');
        if (data.playlists && data.playlists.length > 0) enabledSections.push('playlists');
        if (data.customPages && data.customPages.length > 0) {
            enabledSections.push(...data.customPages.map(p => p.id));
        }
        
        const tabCount = Math.max(enabledSections.length, 2);
        const navigationHeight = (tabCount * 60) + 30; // Tighter tabs
        
        if (navigationHeight > height) {
            return Math.max(navigationHeight, 200); // Much lower minimum
        }
    }
    
    return Math.max(height, 200); // Much lower minimum!
}

    const containerMinHeight = calculateMinimumContainerHeight(appearance, basic, data);

    // Get title font and color settings
    const titleSettings = (data.basic && data.basic.titleSettings) ? data.basic.titleSettings : 
        { show: true, alignment: 'left', position: 'bottom', font: 'theme', color: '' };

    // Determine title font family using titleFonts
    let titleFontFamily = fonts.ui; // default
    let subtitleFontFamily = fonts.primary; // default

    if (titleSettings.font && titleSettings.font !== 'theme') {
        const titleFontSet = (typeof titleFonts !== 'undefined' && titleFonts[titleSettings.font]) 
            ? titleFonts[titleSettings.font] 
            : null;
        if (titleFontSet) {
            titleFontFamily = titleFontSet.titleFont === 'theme' ? fonts.ui : titleFontSet.titleFont;
            subtitleFontFamily = titleFontSet.subtitleFont === 'theme' ? fonts.primary : titleFontSet.subtitleFont;
        }
    }

    // Determine title color
    const titleColor = (titleSettings.color && titleSettings.color.trim()) ? titleSettings.color : 'white';
    
    // Determine background style
    let backgroundStyle = `background: ${colors.bodyBg};`;
    
    if (basic.backgroundImage && basic.backgroundImage.trim()) {
        backgroundStyle = `background: url('${basic.backgroundImage}') center center fixed;
            background-size: cover;`;
    } else if (basic.backgroundColor && basic.backgroundColor.trim()) {
        backgroundStyle = `background: ${basic.backgroundColor};`;
    }
    
    // Generate template-specific styles (now split)
    const templateStyles = generateTemplateStyles(appearance.overviewStyle || 'journal', appearance.navigationStyle || 'journal', colors, fonts);
    
   // Generate category header styles
    const categoryStyles = generateCategoryStyles(appearance.worldCategoriesHeader || 'default', colors, fonts);
   
    // Generate container-specific styles
    const containerStyles = generateContainerStyles(appearance.containerStyle, colors);
    
    // Generate subcontainer-specific styles
    const subcontainerStyles = generateSubcontainerStyles(appearance.subcontainerStyle, colors);

    const cardStyleCSS = (typeof generateCardStyleCSS === 'function') ? 
    generateCardStyleCSS(appearance, colors, fonts) : '';
    
    return `
        /* Info Page Styles - ${appearance.overviewStyle.charAt(0).toUpperCase() + appearance.overviewStyle.slice(1)} Overview + ${appearance.navigationStyle.charAt(0).toUpperCase() + appearance.navigationStyle.slice(1)} Navigation */       
        body {
            font-family: ${fonts.primary};
            line-height: 1.6;
            color: ${colors.textPrimary};
            ${backgroundStyle}
            margin: 0;
            padding: 20px;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.15);
            pointer-events: none;
            z-index: -1;
        }

        .container {
            max-width: ${containerWidth};
            margin: 0 auto;
            min-height: ${containerMinHeight}px;
            ${generateMainContainerBackgroundStyle(basic, colors)}
            box-shadow: 2px 2px 10px rgba(0,0,0,0.1), -2px 2px 10px rgba(0,0,0,0.1);
            transition: min-height 0.2s ease, background 0.1s ease;
        }

        /* Section Titles (Characters, World, Storylines, Plans, etc.) */
        ${generatePageHeaderStyles(appearance.pageHeader || 'standard', colors, fonts)}

                /* Custom Pages Integration */
        ${(() => {
            try {
                const data = (typeof collectFormData === 'function') ? collectFormData() : {};
                if (data && data.customPages && data.customPages.length > 0 && window.customPageTemplates) {
                    return window.customPageTemplates.generateAllPagesCSS(data.customPages, appearance, colors, fonts);
                }
                return '';
            } catch (error) {
                console.warn('Custom pages CSS generation failed:', error);
                return '';
            }
        })()}

        /* World Category Titles (Locations, Factions, etc.) */
        .world-category-title,
        h3.world-category-title {
            font-family: ${fonts.secondary};
            font-weight: 500;
            font-size: 1.4em;
        }

        /* Character Names */
        .character-name,
        .character-card .character-name {
            font-family: ${fonts.secondary};
            font-weight: 600;
        }

        /* Info Section Titles */
        .info-title {
            font-family: ${fonts.secondary};
            font-weight: 500;
            font-size: 1.1em;
        }

        /* Storyline and Plan Titles */
        .storyline-title,
        .plan-title {
            font-family: ${fonts.secondary};
            font-weight: 600;
            font-size: 1.3em;
        }

        /* General Headings */
        h1, h2, h3, h4, h5, h6 {
            font-family: ${fonts.secondary};
        }

        h1 { font-size: 2.2em; font-weight: 700; }
        h2 { font-size: 1.8em; font-weight: 600; }
        h3 { font-size: 1.4em; font-weight: 500; }
        h4 { font-size: 1.2em; font-weight: 500; }

        /* Navigation Links and Buttons */
        .world-nav-link,
        .character-tag-link,
        button,
        input[type="button"] {
            font-family: ${fonts.ui};
        }

        /* Form Elements */
        input,
        select,
        textarea {
            font-family: ${fonts.ui};
        }

        /* Character Grid Item Names */
        .character-grid-item .character-name {
            font-family: ${fonts.secondary};
            font-weight: 600;
        }

        /* Timeline and Event Titles */
        .timeline-item .event-title,
        .event-name {
            font-family: ${fonts.secondary};
            font-weight: 500;
        }

        /* Playlist Names */
        .playlist-name,
        .playlist-title {
            font-family: ${fonts.secondary};
            font-weight: 600;
        }

        /* Status and Label Text */
        .status-label,
        .category-label,
        .item-label {
            font-family: ${fonts.ui};
            font-size: 0.9em;
            font-weight: 500;
        }

        /* Header */
        .header {
            position: relative;
            height: ${bannerHeight};
            background: ${colors.headerBg};
            display: flex;
            align-items: flex-end;
            padding: 30px;
            overflow: hidden;
            border: 3px solid ${colors.bannerBorder};
            border-radius: 3px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 
                        inset 0 0 0 1px rgba(0, 0, 0, 0.1);
            margin-bottom: 0;
        }

        .banner-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .banner-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, ${colors.headerBg} 0%, #e8e8e8 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${colors.textSecondary};
            font-size: 16px;
        }

        ${bannerSize === 'hidden' ? `
        .banner-image { 
            display: none; 
        }
        
        .banner-placeholder { 
            display: none; 
        }
        
        .header { 
            background: transparent !important; 
            border: none !important; 
            box-shadow: none !important; 
        }` : ''}

        /* Banner Style Effects */
        ${generateBannerStyleCSS(appearance.bannerStyle || 'none')}

        .title-overlay {
            position: absolute;
            z-index: 2;
            max-width: calc(100% - 60px);
        }

        /* Horizontal Alignment Classes */
        .title-alignment-left {
            left: 30px;
            text-align: left;
        }

        .title-alignment-center {
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
        }

        .title-alignment-right {
            right: 30px;
            left: auto;
            text-align: right;
        }

        /* Vertical Position Classes */
        .title-position-top {
            top: 30px;
        }

        .title-position-center {
            top: 50%;
            transform: translateY(-50%);
        }

        .title-position-center.title-alignment-center {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .title-position-bottom {
            bottom: 30px;
        }

        /* Enhanced main title styling */
        /* Enhanced main title styling */
        .main-title {
            color: ${titleColor};
            font-size: 3.6em;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 
                        1px 1px 2px rgba(0,0,0,0.9);
            margin: 0;
            line-height: 1.1;
            letter-spacing: 0.5px;
            font-family: ${titleFontFamily};
        }

        /* Subtitle styling */
        .main-subtitle {
            color: ${titleColor === 'white' ? 'rgba(255, 255, 255, 0.85)' : titleColor};
            font-size: 1.7em;
            font-weight: 400;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
            margin: 8px 0 0 0;
            line-height: 1.3;
            font-style: italic;
            font-family: ${subtitleFontFamily};
            opacity: 0.9;
        }

        /* Overview Title and Image Styles */
        .overview-title {
            font-family: ${fonts.secondary};  // ← Use secondary for titles!
            font-size: 2.0em;
            font-weight: 700;
            color: ${colors.textTitle || colors.textPrimary};
            text-align: left;
            margin: 15px 0 30px 0;
            line-height: 1.0;
            letter-spacing: 0.5px;
        }

        .overview-image-container {
            text-align: center;
            margin: 30px 0 0 0;
        }

        .overview-image {
            max-width: 300px;
            max-height: 300px;
            width: auto;
            height: auto;
            border-radius: 8px;
            cursor: pointer;
        }

        /* Navigation */
        .nav-tabs {
            display: flex;
            background: ${colors.navBg};
            margin: 0;
        }

        .nav-tab {
            flex: 1;
            padding: 15px;
            text-align: center;
            color: ${colors.navText};
            cursor: pointer;
            border-right: 1px solid #555;
            border: none;
            background: none;
            font-family: ${fonts.ui};
            font-size: 14px;
            transition: all 0.2s ease;
        }

        .nav-tab:last-child {
            border-right: none;
        }

        .nav-tab.active {
            background: ${colors.navActive};
            color: ${colors.navActiveText};
        }

        .nav-tab:hover:not(.active) {
            background: ${colors.navHover};
            color: white;
        }

        /* Content Areas */
        .content {
            display: none;
            padding: 30px;
            min-height: 400px;
        }

        .content.active {
            display: block;
        }

        ${templateStyles}

/* World Information Styles */

        .world-section {
            margin-bottom: 30px;
        }

        .section-title {
            color: ${colors.textPrimary};
            border-bottom: 2px solid ${colors.locations};
            padding-bottom: 8px;
            margin-bottom: 20px;
            font-size: 1.8em;
            font-weight: normal;
            scroll-margin-top: 120px;
            font-family: ${fonts.primary};
        }

        /* Base World Item Styles (Main Containers) */
        .world-item {
            padding: 20px;
            margin-bottom: 15px;
            overflow: hidden;
            background: ${colors.containerBg};
        }

        .world-item::after {
            content: "";
            display: table;
            clear: both;
        }

        .world-item.has-image {
            display: block;
        }
        
        /* World Item Names */
        .item-name,
        .world-item .item-name {
            font-family: ${fonts.primary}; 
            color: ${colors.itemName};
            font-weight: 600;
        }

        .item-description,
        .world-item .item-description {
            font-family: ${fonts.ui}; 
            font-weight: 500;
            font-size: 18px;
        }

        ${containerStyles}

        .world-item-image {
            width: 180px;          
            height: 135px;           
            object-fit: cover;
            border-radius: 6px;
            cursor: pointer;
            margin: -10 0 15px 15px; 
            display: block;
            float: right;         
            clear: right;          
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }

        .world-item-content {
            overflow: hidden; 
        }

        .world-item-content::after {
            content: "";
            display: table;
            clear: both;
        }

        .item-name {
            margin: 0 0 8px 0;
            color: ${colors.textTitle || colors.textPrimary};
            font-size: 1.3em;
            font-weight: 600;
            font-family: ${fonts.ui};
            letter-spacing: 0.3px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .status-badge {
            font-size: 0.45em;
            font-weight: 400;
            padding: 1px 4px;
            border-radius: 3px;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            opacity: 0.7;
            font-family: 'Arial', sans-serif;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .status-badge.idea { background-color: ${colors.statusIdea}; color: white; }
        .status-badge.tentative { background-color: ${colors.statusDraft}; color: white; }
        .status-badge.brainstorm { background-color: ${colors.statusIdea}; color: white; }
        .status-badge.draft { background-color: ${colors.statusDraft}; color: ${colors.statusDraft === '#ffc107' ? '#212529' : 'white'}; }
        .status-badge.in-progress { background-color: ${colors.statusDraft}; color: white; }
        .status-badge.developing { background-color: ${colors.statusDraft}; color: white; }
        .status-badge.canon { background-color: ${colors.statusCanon}; color: white; }
        .status-badge.established { background-color: ${colors.statusCanon}; color: white; }
        .status-badge.final { background-color: ${colors.statusCanon}; color: white; }
        .status-badge.placeholder { background-color: ${colors.textSecondary}; color: white; }
        .status-badge.needs-work { background-color: ${colors.statusIdea}; color: white; }
        .status-badge.deprecated { background-color: ${colors.statusArchived}; color: white; }
        .status-badge.unused { background-color: ${colors.statusArchived}; color: white; }
        .status-badge.archived { background-color: ${colors.statusArchived}; color: white; }

        .item-type {
            color: ${colors.textSecondary};
            font-style: italic;
            font-size: 0.9em;
            margin-bottom: 10px;
        }

        .item-description {
            margin-bottom: 10px;
            font-family: ${fonts.secondary};
            color: ${colors.textContent || colors.textSecondary};
        }

        /* Info Sections (Subcontainers) */
        .info-section {
            margin: 8px 0;
            font-family: ${fonts.ui};
        }

        .item-label {
            font-weight: bold;
            color: ${colors.textTitle || colors.textPrimary};
            font-size: 0.9em;
            margin-bottom: 6px;
            font-family: ${fonts.ui};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: ${colors.textMuted}33;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }

        .world-item.hidden {
            display: none;
        }

        /* Spoiler tag styling */
        .spoiler {
            background: #888;
            color: #888;
            padding: 2px 4px;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.3s ease;
            user-select: none;
        }

        .spoiler:hover {
            background: #666;
            color: #666;
        }

        .spoiler.revealed {
            background: transparent;
            color: inherit;
            cursor: default;
        }

        .spoiler.revealed:hover {
            background: transparent;
            color: inherit;
        }

        /* Storylines Views - REUSE Plans pattern */
        .storylines-view {
            display: none;
        }

        .storylines-view.active {
            display: block;
        }

        .storylines-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .storyline-card {
            background: ${colors.headerBg};
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            cursor: pointer;
            border: 1px solid ${colors.textMuted}33;
            transition: all 0.2s ease; 
            display: flex;
            flex-direction: column;
            min-height: 200px;
        }

        .storyline-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-color: ${colors.textMuted}66;
            /* Add the subtle lift effect like plan cards */
            transform: translateY(-1px);
        }

        .storyline-card-no-link {
            opacity: 0.7;
            cursor: default;
        }

        .storyline-card-no-link:hover {
            transform: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-color: ${colors.textMuted}33;
        }

        .storyline-no-link {
            color: ${colors.textMuted};
            font-style: italic;
            font-size: 0.9em;
        }

        .storyline-title {
            font-size: 1.3em;
            font-weight: bold;
            color: ${colors.textPrimary};
            margin-bottom: 8px;
            font-family: ${fonts.ui};
            flex-shrink: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        .storyline-pairing {
            color: ${colors.textSecondary};
            font-style: italic;
            margin-bottom: 10px;
            flex-shrink: 0;
        }

        .storyline-description {
            color: ${colors.textSecondary};
            margin-bottom: 15px;
            font-family: ${fonts.ui};
            flex-grow: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            line-height: 1.5;
            max-height: 4.5em; /* 3 lines × 1.5 line-height */
        }

        .storyline-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 10px;
            border-top: 1px solid ${colors.textMuted}33;
            font-size: 0.9em;
            color: ${colors.textMuted};
            flex-shrink: 0;
            margin-top: auto;
        }

        .storyline-updated {
            font-weight: 500;
        }

        /* Wordcount inside section title 
        .section-title .wordcount-display {
            float: right;
            background: ${colors.headerBg};
            border: 1px solid ${colors.textMuted}33;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 0.55em;
            font-weight: 600;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            white-space: nowrap;
            min-width: 100px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            cursor: help;
            margin-left: 15px;
            margin-top: 2px;
        }

        .section-title .wordcount-display:hover {
            background: ${colors.containerBg};
            border-color: ${colors.textMuted}66;
        } */

        /* Individual storyline wordcount */
        .storyline-wordcount {
            font-size: 0.8em;
            color: ${colors.textMuted};
            font-weight: 500;
            margin-bottom: 8px;
            font-style: italic;
        }

        /* ALL MODALS - Proper centering and background */
        /* ALL MODALS - Proper centering and background */
        .modal {
            display: none;
            position: fixed;
            z-index: 99999 !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0,0,0,0.7);
            /* Use flexbox for reliable centering */
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .modal.active {
            display: flex !important;
        }

        /* Base modal content - applies to ALL modal types */
        .modal-content,
        .plan-modal-content,
        .storyline-modal-content,
        .playlist-modal-content,
        .character-modal-content {
            background: ${generateModalBackgroundStyle(basic, colors)};
            margin: 0 !important;
            width: 95% !important;
            max-width: 1000px !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            border-radius: 8px !important;
            animation: modalSlideIn 0.3s ease !important;
            position: relative !important;
            z-index: 100000 !important;
        }

        /* Plan modals get slightly different max-width */
        .plan-modal-content {
            max-width: 900px !important;
        }

        @keyframes modalSlideIn {
            from {
                transform: translateY(-30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modal-header {
            background: ${colors.textSecondary};
            color: ${colors.containerBg};
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 2; /* Ensure header stays above background */
        }

        .modal-title {
            font-size: 1.5em;
            font-weight: normal;
            margin: 0;
            font-family: ${fonts.accent};
        }

        .close {
            color: ${colors.containerBg};
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.2s ease;
            z-index: 3; /* Ensure close button is always clickable */
            position: relative;
        }

        .close:hover {
            opacity: 0.7;
        }

        .modal-body {
            padding: 25px;
            position: relative;
            z-index: 2; /* Ensure content stays above background */
        }

        .character-modal-grid {
            display: flex;
            flex-direction: column;
            gap: 25px;
            margin-bottom: 25px;
        }

        .character-header-section {
            display: flex;
            gap: 25px;
            align-items: flex-start;
        }

        /* Character Modal - Main profile image */
        .modal .character-main-image {
            width: 240px !important;
            height: 320px !important;
            background: ${colors.headerBg};
            border-radius: 8px;
            display: flex !important;
            align-items: center;
            justify-content: center;
            color: ${colors.textMuted};
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            overflow: hidden;
            position: relative;
        }

        .modal .character-main-image img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center;
            display: block !important;
            border-radius: 8px;
            position: absolute !important;
            top: 0;
            left: 0;
        }

        .character-basic-info {
            flex: 1;
            min-width: 0;
        }

        .character-basic-info .info-section {
            height: 280px !important;
            display: flex;
            flex-direction: column;
        }

        .character-basic-info .info-section .info-title {
            flex-shrink: 0;
        }

        .character-basic-info .info-section .info-content {
            flex: 1;
            overflow-y: auto;
            padding-right: 8px;
        }

        .character-detailed-sections {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 10px;
        }

        .character-info {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .info-title {
            margin: 0 0 12px 0;
            color: ${colors.textTitle || colors.textPrimary};
            font-size: 1.3em;
            font-weight: 700;
            font-family: ${fonts.ui};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid ${colors.textMuted};
            padding-bottom: 8px;
            background: linear-gradient(90deg, ${colors.textMuted}20 0%, transparent 100%);
            padding-left: 12px;
            margin-left: -12px;
            border-radius: 4px 0 0 4px;
        }

        .info-content {
            line-height: 1.6;
            color: ${colors.textContent || colors.textSecondary};
            font-family: ${fonts.ui};
        }

        .character-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
            margin-top: 20px;
            padding: 20px;
            background: ${colors.bodyBg === '#1a1a1a' ? colors.headerBg : 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)'};
            border-radius: 8px;
            border: 2px dashed ${colors.textMuted};
        }

        .gallery-title {
            grid-column: 1 / -1;
            margin: 0 0 10px 0;
            color: ${colors.textSecondary};
            font-size: 1.1em;
            font-weight: 600;
            text-align: center;
            font-family: ${fonts.ui};
        }

        .gallery-image {
            width: 100%;
            height: 120px;
            background: ${colors.containerBg};
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${colors.textSecondary};
            font-size: 11px;
            object-fit: cover;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 2px solid transparent;
        }


        /* Image Modal - FIXED z-index */
        .image-modal {
            display: none;
            position: fixed;
            z-index: 100000 !important;  /* Higher than regular modals */
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            padding: 20px;
            box-sizing: border-box;
        }

        .image-modal-content {
            position: relative;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            max-width: 90vw;
            max-height: 90vh;
        }

        .image-modal img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .image-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            font-size: 24px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 100001 !important;
        }

        .image-nav:hover {
            background: rgba(0,0,0,0.9);
            transform: translateY(-50%) scale(1.1);
        }

        .image-nav.visible {
            display: flex;
        }

        .image-prev {
            left: 20px;
        }

        .image-next {
            right: 20px;
        }

        .image-counter {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            display: none;
        }

        .image-counter.visible {
            display: block;
        }

        .image-close {
            position: absolute;
            top: 15px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.2s ease;
            z-index: 100001 !important;
        }

        .image-close:hover {
            opacity: 0.7;
        }

        /* Empty state styles */
        .empty-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            color: ${colors.textMuted};
            text-align: center;
        }

        .empty-content h3 {
            margin-bottom: 10px;
            font-size: 1.5em;
            font-weight: normal;
            font-family: ${fonts.primary};
        }

        .empty-content p {
            font-style: italic;
        }

        /* Console hidden display styles */
        .world-item.dev-hidden {
            border: 2px dashed #ff6b6b !important;
            background: rgba(255, 107, 107, 0.1) !important;
            opacity: 0.6;
            position: relative;
        }

        .world-item.dev-hidden::before {
            content: "🙈 HIDDEN";
            position: absolute;
            top: 5px;
            right: 10px;
            background: #ff6b6b;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            z-index: 10;
        }

        /* Back to Top Buttons - Universal Styling */
        /* Back to Top Buttons - Universal Styling */
        .back-to-top,
        #world-back-to-top,
        #character-back-to-top,
        #plans-back-to-top,
        #storylines-back-to-top,
        #playlists-back-to-top,
        [id^="custom-page-back-to-top-"] {
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            left: auto !important;
            border: none;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            z-index: 1000;
            ${(() => {
                const styles = generateBackToTopStyleCSS(appearance.backToTopStyle || 'circular', colors);
                return styles.containerCss;
            })()}
        }

        /* Add content via pseudo-element */
        .back-to-top::after,
        #world-back-to-top::after,
        #character-back-to-top::after,
        #plans-back-to-top::after,
        #storylines-back-to-top::after,
        #playlists-back-to-top::after,
        [id^="custom-page-back-to-top-"]::after {
            ${(() => {
                const styles = generateBackToTopStyleCSS(appearance.backToTopStyle || 'circular', colors);
                const style = backToTopStyles[appearance.backToTopStyle || 'circular'] || backToTopStyles.circular;
                return `
                    content: '${style.icon}';
                    ${styles.iconCss}
                `;
            })()}
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: inherit;
        }

        .back-to-top.visible,
        #world-back-to-top.visible,
        #character-back-to-top.visible,
        #plans-back-to-top.visible,
        #storylines-back-to-top.visible,
        #playlists-back-to-top.visible,
        [id^="custom-page-back-to-top-"].visible {
            opacity: 1 !important;
            visibility: visible !important;
        }

        .back-to-top:hover,
        #world-back-to-top:hover,
        #character-back-to-top:hover,
        #plans-back-to-top:hover,
        #storylines-back-to-top:hover,
        #playlists-back-to-top:hover,
        [id^="custom-page-back-to-top-"]:hover {
            filter: brightness(1.15);
            transform: translateY(-2px);
        }

        #world,
        #overview,
        #characters,
        #storylines,
        #plans,
        #playlists {
            min-height: ${containerMinHeight}px !important;
        }
        ${subcontainerStyles}

        ${cardStyleCSS}

        ${categoryStyles} 

        .storylines-content-active,
        .plans-content-active,
        .characters-content-active,
        .world-content-active,
        .playlists-content-active {
            min-height: ${containerMinHeight}px !important;
        }
        ${generateOverviewLinksCSS(colors, fonts, basic.overviewLinksAlignment || 'left', basic.overviewLinksSpacing || 'centered', appearance.buttonStyle || 'rounded')}
        ${(() => {
            console.log('🔧 Calling generateCustomNavigationCSS with:');
            console.log('- appearance.customNavButtonStyle:', appearance.customNavButtonStyle);
            console.log('- appearance.buttonStyle:', appearance.buttonStyle);
            return generateCustomNavigationCSS(colors, fonts, basic.customNavSettings, appearance.buttonStyle || 'rounded', appearance.customNavButtonStyle || 'rounded', siteWidth);
        })()}
        ${generateCharacterSubcontainerStyles(appearance.subcontainerStyle, colors)}

        
        /* Character Grid Layout - Keep all grid functionality */
        .characters-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
            gap: 15px !important;
            margin-top: 20px !important;
            width: 100% !important;
        }

        .character-card {
            width: auto !important;
            max-width: none !important;
            min-width: 160px !important;
        }

        .character-card.hidden {
            display: none !important;
        }

        /* Timeline Styles */
        ${generateTimelineCSS(colors, fonts)}

        /* Filter CSS */
        ${generateUnifiedFilterCSS(colors, fonts, appearance)}

        // Find where you're combining all CSS and add:
        ${generatePlaylistCSS(colors, fonts)}

        /* Plans modal styles */
        ${generatePlansCSS(colors, fonts, appearance)}

        /* Custom Scrollbars with Theme Colors */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: ${colors.headerBg};
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: ${colors.textMuted};
            border-radius: 4px;
            transition: background 0.2s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: ${colors.textSecondary};
        }

        ::-webkit-scrollbar-corner {
            background: ${colors.headerBg};
        }

        /* Modal Scrollbars */
        .modal-content ::-webkit-scrollbar {
            width: 6px;
        }

        .modal-content ::-webkit-scrollbar-track {
            background: ${colors.headerBg};
            border-radius: 3px;
        }

        .modal-content ::-webkit-scrollbar-thumb {
            background: ${colors.textMuted}88;
            border-radius: 3px;
        }

        .modal-content ::-webkit-scrollbar-thumb:hover {
            background: ${colors.textSecondary};
        }

        /* Character Modal Basic Info Section Scrollbars (Enhanced) */
        .character-basic-info .info-section .info-content::-webkit-scrollbar {
            width: 6px;
        }

        .character-basic-info .info-section .info-content::-webkit-scrollbar-track {
            background: ${colors.headerBg};
            border-radius: 3px;
        }

        .character-basic-info .info-section .info-content::-webkit-scrollbar-thumb {
            background: ${colors.textMuted};
            border-radius: 3px;
        }

        .character-basic-info .info-section .info-content::-webkit-scrollbar-thumb:hover {
            background: ${colors.textSecondary};
        }

        /* Firefox Scrollbar Support */
        html {
            scrollbar-width: thin;
            scrollbar-color: ${colors.textMuted} ${colors.headerBg};
        }

        .modal-content {
            scrollbar-width: thin;
            scrollbar-color: ${colors.textMuted}88 ${colors.headerBg};
        }

        ${generateWuxiaFogEffect(appearance.overviewStyle, colors)}

        //WORLD Images
        /* Subtle image indicator */
        /* Image indicator - using higher specificity to avoid !important ....idk why i need these twice but it wont work without?? */
        .world-item .world-item-content .item-name .image-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: ${colors.textMuted};
            border-radius: 2px;
            margin-left: 5px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            vertical-align: middle;
            flex-shrink: 0;
        }

        .world-item .world-item-content .item-name .image-indicator:hover {
            background: ${colors.textSecondary};
            transform: scale(1.2);
        }

        /* Image indicator - using higher specificity to avoid !important */
        .world-item .world-item-content .item-name .image-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: ${colors.textMuted};
            border-radius: 2px;
            margin-left: 5px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            vertical-align: middle;
            flex-shrink: 0;
        }

        .world-item .world-item-content .item-name .image-indicator:hover {
            background: ${colors.textSecondary};
            transform: scale(1.2);
        }

        /* Global image preview element */
        .image-preview {
            position: absolute;
            z-index: 1000;
            max-width: 120px;
            max-height: 120px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid ${colors.containerBg};
            pointer-events: none;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.2s ease;
            display: none;
        }

        .image-preview.visible {
            opacity: 1;
            transform: scale(1);
        }
        
        `;

        // SOLUTION: Safe version that doesn't interfere with modals
        function generateMainContainerBackgroundStyle(basic, colors) {
            const bgImage = basic.mainContainerBgImage && basic.mainContainerBgImage.trim();
            const bgColor = basic.mainContainerBgColor && basic.mainContainerBgColor.trim();
            
            let styles = [];
            
            // Simple background assignment - no opacity or blur
            if (bgImage) {
                // If there's an image, use it with optional color fallback
                styles.push(`background: ${bgColor || colors.containerBg} url('${bgImage}') center/auto repeat`);
            } else if (bgColor) {
                // If just color, use it
                styles.push(`background: ${bgColor}`);
            } else {
                // Default theme background
                styles.push(`background: ${colors.containerBg}`);
            }
            
            return styles.join('; ') + ';';
        }

}

// Generate template-specific styles (affects layout, Overview tab appearance, and navigation)
function generateTemplateStyles(overviewStyle, navigationStyle, colors, fonts) {
    // Get basic data for overview background settings
    const data = infoData || {};
    const basic = data.basic || {};
    
    // Helper function to generate overview-content background styles for the main element
    function generateOverviewMainBackgroundStyle() {
        const bgImage = basic.overviewContentBgImage && basic.overviewContentBgImage.trim();
        const bgColor = basic.overviewContentBgColor && basic.overviewContentBgColor.trim();
        const opacity = basic.overviewContentOpacity || 100;
        const blur = basic.overviewContentBlur || 0;
        
        if (!bgImage && !bgColor) return '';
        
        let styles = [];
        
        // Add background image/color
        if (bgImage) {
            styles.push(`background-image: url('${bgImage}')`);
            styles.push('background-size: cover');
            styles.push('background-position: center');
            styles.push('background-repeat: no-repeat');
        } else if (bgColor) {
            styles.push(`background-color: ${bgColor}`);
        }
        
        // Add opacity and blur
        if (opacity !== 100) {
            styles.push(`opacity: ${opacity / 100}`);
        }
        if (blur > 0) {
            styles.push(`filter: blur(${blur}px)`);
        }
        
        return styles.join('; ') + ';';
    }

    // Generate overview styles
    const overviewCSS = generateOverviewStyles(overviewStyle, colors, fonts, generateOverviewMainBackgroundStyle);
    
    // Generate navigation styles  
    const navigationCSS = generateNavigationStyles(navigationStyle, colors, fonts);
    
    // Combine both styles
    return overviewCSS + '\n\n' + navigationCSS;
}

function generateWuxiaFogEffect(overviewStyle, colors) {
    // Only add fog effect if using wuxia overview style
    if (overviewStyle !== 'wuxia') {
        return '';
    }
    
    return `
        /* ANIMATED BOTTOM MIST EFFECT - Only for wuxia overview style */
        body::after {
            content: '';
            position: fixed;
            bottom: 0;
            left: 0;
            width: 150%;
            height: 300px;
            background: url('images/styles/fog.png') repeat-x bottom;
            background-size: auto 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.2;
            animation: gentleMist 8s ease-in-out infinite;
            /* Gradient mask - more opaque at bottom, transparent at top */
            mask: linear-gradient(to top, 
                rgba(0,0,0,0.7) 0%, 
                rgba(0,0,0,0.5) 25%, 
                rgba(0,0,0,0.3) 50%, 
                rgba(0,0,0,0.15) 70%, 
                rgba(0,0,0,0.05) 85%, 
                rgba(0,0,0,0) 100%);
            -webkit-mask: linear-gradient(to top, 
                rgba(0,0,0,0.7) 0%, 
                rgba(0,0,0,0.5) 25%, 
                rgba(0,0,0,0.3) 50%, 
                rgba(0,0,0,0.15) 70%, 
                rgba(0,0,0,0.05) 85%, 
                rgba(0,0,0,0) 100%);
        }

        @keyframes gentleMist {
            0% {
                transform: translateX(0);
            }
            33% {
                transform: translateX(-80px);
            }
            66% {
                transform: translateX(-40px);
            }
            100% {
                transform: translateX(0);
            }
        }
    `;
}

// 5. ADD: Migration helper for CSS generation (add this before generateCSS function):
function migrateAppearanceForCSS(appearance) {
    // If we still have the old template setting, convert it
    if (appearance.template && (!appearance.overviewStyle || !appearance.navigationStyle)) {
        return {
            ...appearance,
            overviewStyle: appearance.template,
            navigationStyle: appearance.template
        };
    }
    // Ensure cardStyle exists
    if (!appearance.cardStyle) {
        appearance.cardStyle = 'current';
    }
    
    return appearance;
}

function generateBackToTopStyleCSS(styleName, colors) {
    const style = backToTopStyles[styleName] || backToTopStyles.circular;
    
    return {
        containerCss: style.containerCss(colors),
        iconCss: style.iconCss(colors)
    };
}

// Get seasonal background color based on month
window.getSeasonalColor = function(month, colors) {
    // Add fallback for missing seasonal colors
    if (!colors || !colors.seasonal) {
        return colors?.containerBg || '#ffffff'; // Fallback
    }
    
    // Winter: months 12, 1, 2
    if (month === 12 || month === 1 || month === 2) {
        return colors.seasonal.winter || colors.containerBg;
    }
    // Spring: months 3, 4, 5
    else if (month >= 3 && month <= 5) {
        return colors.seasonal.spring || colors.containerBg;
    }
    // Summer: months 6, 7, 8
    else if (month >= 6 && month <= 8) {
        return colors.seasonal.summer || colors.containerBg;
    }
    // Autumn: months 9, 10, 11
    else if (month >= 9 && month <= 11) {
        return colors.seasonal.autumn || colors.containerBg;
    }
    
    return colors.containerBg; // Default fallback
}

// Additional helper functions if missing
if (typeof window !== 'undefined') {
    window.forceRegenerateCSS = function() {
        console.log('Force regenerating CSS...');
        if (typeof generateHTML === 'function') {
            generateHTML();
            console.log('✅ CSS regenerated successfully');
        }
    };
    
    window.debugCategoryColors = function() {
        console.log('=== CATEGORY COLORS DEBUG ===');
        const colors = getColorScheme ? getColorScheme() : {};
        const categoryColors = colors;
        console.log('Current colors object:', colors);
        console.log('Generated category colors:', categoryColors);
        return { colors, categoryColors };
    };
}

