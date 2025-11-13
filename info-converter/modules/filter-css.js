// Updated filter-css.js
// Unified Filter CSS for all navigation sections (World, Characters, Timeline, Storylines)
// Now supports Card Style variations AND includes Timeline filtering CSS

function generateUnifiedFilterCSS(colors, fonts, appearance) {
    const cardStyle = appearance?.cardStyle || 'current';
    
    // Generate base container styles that match the selected card style
    let containerStyles = '';
    let headerStyles = '';
    
    switch (cardStyle) {
        case 'modern':
            containerStyles = `
                background: ${colors.containerBg};
                border-radius: 12px;
                border: none;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            `;
            headerStyles = `
                background: ${colors.containerBg};
                border-radius: 12px;
                transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
            `;
            break;
            
        case 'minimal':
            containerStyles = `
                background: transparent;
                border-radius: 0;
                border: 1px solid ${colors.textMuted}44;
                box-shadow: none;
            `;
            headerStyles = `
                background: transparent;
                border-radius: 0;
                transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
            `;
            break;
            
        case 'detailed':
            containerStyles = `
                background: linear-gradient(145deg, ${colors.containerBg}, ${colors.headerBg});
                border-radius: 8px;
                border: 2px solid ${colors.textMuted}33;
                box-shadow: 0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1);
            `;
            headerStyles = `
                background: linear-gradient(135deg, ${colors.headerBg}, ${colors.containerBg});
                border-radius: 8px;
                transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
            `;
            break;
            
        case 'current':
        default:
            containerStyles = `
                background: ${colors.containerBg === 'white' ? 
                    'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' : colors.headerBg};
                border-radius: 8px;
                border: 1px solid ${colors.textMuted};
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            headerStyles = `
                background: ${colors.containerBg === 'white' ? 
                    'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' : colors.headerBg};
                border-radius: 8px;
                transition: background-color 0.2s ease;
            `;
            break;

        case 'industrial':
            containerStyles = `
                background: ${colors.headerBg};
                border-radius: 0;
                border: 1px solid ${colors.bannerBorder};
                box-shadow: inset 0 0 15px rgba(0,0,0,0.3);
                clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);
            `;
            headerStyles = `
                background: ${colors.headerBg};
                border-radius: 0;
                transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
                position: relative;
            `;
            break;

        case 'wuxia':
            containerStyles = `
                background: linear-gradient(135deg, 
                    ${colors.containerBg} 0%, 
                    rgba(240,249,240,0.3) 50%,
                    rgba(255,255,255,0.9) 100%);
                border-radius: 8px;
                border: 1px solid rgba(240,249,240,0.4);
                box-shadow: 
                    0 3px 15px rgba(0,0,0,0.06),
                    0 1px 4px rgba(0,0,0,0.08),
                    inset 0 1px 2px rgba(255,255,255,0.8);
            `;
            headerStyles = `
                background: linear-gradient(135deg, 
                    rgba(255,255,255,0.9) 0%, 
                    rgba(240,249,240,0.2) 100%);
                border-radius: 8px;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                position: relative;
            `;
            break;

        case 'adventurersTome':
            containerStyles = `
                background: ${colors.navHover} !important;
                border-radius: 4px;
                border: 1px solid #5a4230;
                box-shadow: 
                    inset 0 0 15px rgba(0,0,0,0.3),
                    0 2px 5px rgba(0,0,0,0.2);
            `;
            headerStyles = `
                background: ${colors.navHover} !important;
                border-radius: 4px;
                transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
                border-bottom: 1px solid #3d2a1c;
            `;
            break;

        case 'horrific':
            containerStyles = `
                background: linear-gradient(135deg, 
                    ${colors.headerBg} 0%, 
                    rgba(139,21,56,0.05) 50%, 
                    ${colors.headerBg} 100%);
                border-radius: 0;
                border: 2px solid #2d1e26;
                box-shadow: 
                    0 4px 20px rgba(0,0,0,0.6),
                    inset 0 0 20px rgba(0,0,0,0.3),
                    inset 0 1px 3px rgba(139,21,56,0.1);
            `;
            headerStyles = `
                background: linear-gradient(135deg, 
                    ${colors.headerBg} 0%, 
                    rgba(139,21,56,0.08) 100%);
                border-radius: 0;
                transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
                border-bottom: 1px solid rgba(139,21,56,0.3);
            `;
            break;

        case 'parchment':
            containerStyles = `
                background: linear-gradient(135deg, 
                    #fefcf8 0%, 
                    #f8f5f0 30%, 
                    #faf7f2 70%, 
                    #f5f2ed 100%);
                border: 1px solid rgba(139,69,19,0.2);
                border-radius: 8px;
                box-shadow: 
                    0 3px 12px rgba(139,69,19,0.08),
                    inset 0 1px 3px rgba(255,255,255,0.8);
            `;
            headerStyles = `
                background: linear-gradient(135deg, 
                    rgba(245,245,220,0.4) 0%, 
                    rgba(250,240,230,0.2) 100%);
                border-radius: 8px;
                transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
                border-bottom: 1px solid rgba(139,69,19,0.15);
            `;
            break;
    }
    
    // Generate hover styles based on card style
    let headerHoverStyles = '';
    switch (cardStyle) {
        case 'modern':
            headerHoverStyles = `
                background: ${colors.headerBg}33;
                transform: translateY(-1px);
                box-shadow: 0 6px 25px rgba(0,0,0,0.12);
            `;
            break;
        case 'minimal':
            headerHoverStyles = `
                background: ${colors.headerBg}22;
                border-color: ${colors.textMuted}88;
            `;
            break;
        case 'detailed':
            headerHoverStyles = `
                background: linear-gradient(135deg, ${colors.headerBg}dd, ${colors.containerBg}dd);
                transform: translateY(-1px);
                box-shadow: 0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2);
            `;
            break;
        case 'industrial':
            headerHoverStyles = `
                background: ${colors.containerBg};
                border-color: ${colors.journalAccent};
                box-shadow: 0 0 20px ${colors.journalAccent}22;
            `;
            break;

        case 'wuxia':
            headerHoverStyles = `
                background: linear-gradient(135deg, 
                    rgba(255,255,255,0.95) 0%, 
                    rgba(240,249,240,0.4) 100%);
                border-color: rgba(240,249,240,0.7);
                box-shadow: 
                    0 6px 25px rgba(0,0,0,0.08),
                    0 2px 8px rgba(0,0,0,0.1),
                    inset 0 1px 3px rgba(255,255,255,0.9);
            `;
            break;

        case 'adventurersTome':
            headerHoverStyles = `
                background: ${colors.containerBg};
                border-color: #3d2a1c;
                box-shadow: 
                    inset 0 0 10px rgba(0,0,0,0.2), 
                    0 4px 12px rgba(0,0,0,0.3);
            `;
            break;

        case 'horrific':
            headerHoverStyles = `
                background: linear-gradient(135deg, 
                    ${colors.containerBg} 0%, 
                    rgba(139,21,56,0.12) 100%);
                border-color: rgba(139,21,56,0.5);
                box-shadow: 
                    0 8px 35px rgba(0,0,0,0.8),
                    0 0 20px rgba(139,21,56,0.3),
                    inset 0 2px 6px rgba(0,0,0,0.15);
            `;
            break;

        case 'parchment':
            headerHoverStyles = `
                background: linear-gradient(135deg, 
                    rgba(245,245,220,0.6) 0%, 
                    rgba(250,240,230,0.4) 100%);
                border-color: rgba(139,69,19,0.4);
                box-shadow: 
                    0 4px 15px rgba(139,69,19,0.12),
                    inset 0 1px 3px rgba(255,255,255,0.9);
            `;
            break;
        case 'current':
        default:
            headerHoverStyles = `
            background: ${colors.textMuted}22;
            `;
            break;
    }

    return `
        /* UNIFIED FILTER STYLING - All Navigation Sections with Card Style Support */

        /* Base navigation styling for all filters - Card Style: ${cardStyle} */
        .world-navigation,
        .character-navigation,
        .timeline-navigation,
        .storylines-navigation {
            ${containerStyles}
            padding: 0;
            margin-bottom: 20px;
        }

        /* Timeline gets sticky positioning and z-index */
        .timeline-navigation {
            position: sticky;
            top: 0;
            z-index: 100;
            margin-bottom: 30px;
        }

        /* World navigation gets sticky positioning and z-index */
        .world-navigation {
            position: sticky;
            top: 0;
            z-index: 100;
            margin-bottom: 30px;
        }

        /* Character navigation gets sticky positioning and z-index */
        .character-navigation {
            position: sticky;
            top: 0;
            z-index: 100;
            margin-bottom: 30px;
        }

        /* Unified header styling - matches card style */
        .world-nav-header,
        .character-nav-header,
        .timeline-nav-header,
        .storylines-nav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            cursor: pointer;
            ${headerStyles}
        }

        .world-nav-header:hover,
        .character-nav-header:hover,
        .timeline-nav-header:hover,
        .storylines-nav-header:hover {
            ${headerHoverStyles}
        }

        /* Unified title styling */
        .world-nav-title,
        .character-nav-title,
        .timeline-nav-title,
        .storylines-nav-title {
            font-size: 0.95em;
            font-weight: 500;
            color: ${colors.textSecondary};
            font-family: ${fonts.primary};
        }

        /* Unified toggle styling */
        .world-nav-toggle,
        .character-nav-toggle,
        .timeline-nav-toggle,
        .storylines-nav-toggle {
            font-size: 12px;
            transition: transform 0.3s ease;
            opacity: 0.7;
            color: ${colors.textSecondary};
        }

        .world-nav-toggle.expanded,
        .character-nav-toggle.expanded,
        .timeline-nav-toggle.expanded,
        .storylines-nav-toggle.expanded {
            transform: rotate(90deg);
        }

        /* Unified content styling */
        .world-nav-content,
        .character-nav-content,
        .storylines-nav-content {
            padding: 0 20px 20px 20px;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }

        /* FIXED: Timeline navigation gets reduced bottom padding to sit closer to view switcher */
        .timeline-nav-content {
            padding: 0 20px 4px 20px;  /* REDUCED: From 8px to 4px bottom padding */
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }

        .world-nav-content.collapsed,
        .character-nav-content.collapsed,
        .timeline-nav-content.collapsed,
        .storylines-nav-content.collapsed {
            max-height: 0;
            padding: 0 20px;
            opacity: 0;
        }

        .world-nav-content:not(.collapsed),
        .character-nav-content:not(.collapsed),
        .storylines-nav-content:not(.collapsed) {
            max-height: 600px;
            opacity: 1;
            padding: 0 20px 20px 20px;
        }

        /* Timeline nav content when not collapsed gets the reduced padding */
        .timeline-nav-content:not(.collapsed) {
            max-height: 600px;
            opacity: 1;
            padding: 0 20px 4px 20px;  /* REDUCED: From 8px to 4px bottom padding */
        }

        /* Unified filter controls */
        .world-filter-controls,
        .character-filter-controls,
        .timeline-filter-controls,
        .storylines-filter-controls {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        /* Unified search input styling */
        .world-search,
        .character-search,
        .timeline-search {
            flex: 1;
            min-width: 150px;
            max-width: 250px;
            padding: 6px 12px;
            border: 1px solid ${colors.textMuted};
            border-radius: 4px;
            font-size: 0.9em;
            background: ${colors.containerBg};
            color: ${colors.textPrimary};
            transition: border-color 0.2s ease;
            font-family: ${fonts.ui};
        }

        .world-search:focus,
        .character-search:focus,
        .timeline-search:focus {
            outline: none;
            border-color: ${colors.statusDraft};
        }

        /* Unified filter mode buttons */
        .world-filter-mode-buttons,
        .character-filter-mode-buttons,
        .timeline-filter-mode-buttons,
        .storylines-filter-mode-buttons,
        .filter-mode-buttons {
            display: flex;
            background: ${colors.textMuted}20;
            border-radius: 4px;
            overflow: hidden;
        }

        .world-filter-mode-option,
        .character-filter-mode-option,
        .timeline-filter-mode-option,
        .storylines-filter-mode-option,
        .filter-mode-option {
            padding: 6px 12px;
            cursor: pointer;
            font-size: 0.85em;
            font-weight: 500;
            transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
            background: transparent;
            border: none;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
        }

        .world-filter-mode-option.active,
        .character-filter-mode-option.active,
        .timeline-filter-mode-option.active,
        .storylines-filter-mode-option.active,
        .filter-mode-option.active {
            background: ${colors.statusDraft};
            color: white;
        }

        .world-filter-mode-option:hover:not(.active),
        .character-filter-mode-option:hover:not(.active),
        .timeline-filter-mode-option:hover:not(.active),
        .storylines-filter-mode-option:hover:not(.active),
        .filter-mode-option:hover:not(.active) {
            background: ${colors.textMuted}40;
            color: ${colors.textPrimary};
        }

        /* Unified clear button styling */
        .world-clear-selected-btn,
        .character-clear-selected-btn,
        .timeline-clear-selected-btn,
        .storylines-clear-selected-btn,
        .clear-selected-btn {
            padding: 6px 12px;
            font-size: 0.85em;
            background: transparent;
            border: 1px solid ${colors.textMuted};
            border-radius: 4px;
            cursor: pointer;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            transition: all 0.2s ease;
            opacity: 0.6;
        }

        .world-clear-selected-btn.active,
        .character-clear-selected-btn.active,
        .timeline-clear-selected-btn.active,
        .storylines-clear-selected-btn.active,
        .clear-selected-btn.active {
            opacity: 1;
            border-color: ${colors.statusDraft};
            color: ${colors.statusDraft};
        }

        .world-clear-selected-btn:hover,
        .character-clear-selected-btn:hover,
        .timeline-clear-selected-btn:hover,
        .storylines-clear-selected-btn:hover,
        .clear-selected-btn:hover {
            background: ${colors.textMuted}20;
            color: ${colors.textPrimary};
        }

        /* UPDATED: Unified tag links styling - All use squareish World style */
        .world-nav-links,
        .world-tag-links,
        .character-tag-links,
        .timeline-tag-links,
        .storylines-tag-links {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        /* All tag links now use the same professional, squareish style */
        .world-nav-link,
        .world-tag-link,
        .character-tag-link,
        .timeline-tag-link,
        .storylines-tag-link {
            padding: 6px 14px;
            background: ${colors.linkHover};
            color: ${colors.containerBg};
            text-decoration: none;
            border-radius: 4px; /* Squareish like World links */
            font-size: 0.85em;
            font-weight: 500;
            transition: background 0.2s ease, box-shadow 0.2s ease; /* Removed transform */
            font-family: ${fonts.ui};
            cursor: pointer;
            border: 1px solid ${colors.textSecondary}33;
            letter-spacing: 0.2px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            user-select: none;
        }

        .world-nav-link:hover,
        .world-tag-link:hover,
        .character-tag-link:hover,
        .timeline-tag-link:hover,
        .storylines-tag-link:hover {
            background: var(--hover-color, ${colors.textMuted}) !important;
            text-decoration: none;
            color: ${colors.containerBg};
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        /* Selected state - just color change, no × button, no padding change */
        .character-tag-link.selected,
        .world-tag-link.selected,
        .timeline-tag-link.selected,
        .storylines-tag-link.selected {
            background-color: var(--hover-color, ${colors.statusDraft}) !important;
            border-color: ${colors.statusDraft}66;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        /* Status filter dropdown (World section) */
        .status-filter {
            padding: 6px 12px;
            border: 1px solid ${colors.textMuted};
            border-radius: 4px;
            font-size: 0.85em;
            background: ${colors.containerBg};
            color: ${colors.textPrimary};
            font-family: ${fonts.ui};
            cursor: pointer;
            width: 120px;
            flex-shrink: 0;
        }

        .status-filter:focus {
            outline: none;
            border-color: ${colors.statusDraft};
        }

        /* Timeline year range inputs */
        .timeline-year-range {
            display: flex;
            gap: 12px;
            margin-top: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        .timeline-year-range label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85em;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
        }

        .timeline-year-input {
            width: 80px;
            padding: 4px 8px;
            border: 1px solid ${colors.textMuted};
            border-radius: 4px;
            font-size: 0.85em;
            background: ${colors.containerBg};
            color: ${colors.textPrimary};
            font-family: ${fonts.ui};
        }

        .timeline-year-input:focus {
            outline: none;
            border-color: ${colors.statusDraft};
        }

        /* ===== FILTERING RULES - UNIVERSAL ===== */
        
        /* Universal hidden class for all filtering */
        .hidden {
            display: none !important;
        }
        
        /* Pre-hidden elements support */
        /* Pre-hidden elements support - only hide when there's an active filter and no match */
        .pre-hidden {
            display: block; /* Show by default */
        }

        /* Only hide pre-hidden elements when there's an active global filter and they don't match */
        body[data-global-filter] .pre-hidden:not(.filter-match) {
            display: none !important;
        }
        
        /* Character card filtering */
        .character-card.hidden {
            display: none !important;
        }
        
        /* World item filtering */
        .world-item.hidden {
            display: none !important;
        }
        
        /* Storyline card filtering */
        .storyline-card.hidden {
            display: none !important;
        }
        
        /* Plan card filtering */
        .plan-card.hidden {
            display: none !important;
        }
        
        /* Playlist card filtering */
        .playlist-card.hidden {
            display: none !important;
        }

        /* ===== TIMELINE-SPECIFIC FILTERING RULES ===== */
        
        /* Timeline event filtering - Chronological view */
        .tl-timeline-event.hidden {
            display: none !important;
        }
        
        /* Timeline year section filtering */
        .tl-timeline-year.hidden {
            display: none !important;
        }
        
        /* Arc swimlane filtering */
        .tl-arc-swimlane.hidden {
            display: none !important;
        }
        
        /* Arc event node filtering */
        .tl-arc-event-node.hidden {
            display: none !important;
        }
        
        /* Smooth transitions for timeline filtering */
        .tl-timeline-event {
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        
        .tl-arc-swimlane {
            transition: opacity 0.2s ease;
        }
        
        .tl-arc-event-node {
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        
        /* Visual feedback for filtered timeline states */
        .tl-timeline-event[style*="display: none"] {
            opacity: 0;
            transform: scale(0.9);
            pointer-events: none;
        }
        
        .tl-arc-event-node[style*="display: none"] {
            opacity: 0;
            transform: scale(0.8);
            pointer-events: none;
        }
        
        /* Swimlane with no visible events gets dimmed */
        .tl-arc-swimlane:not(:has(.tl-arc-event-node:not([style*="display: none"]))) .tl-arc-label {
            opacity: 0.5;
        }
        
        /* Alternative for browsers without :has() support */
        .tl-arc-swimlane.no-visible-events .tl-arc-label {
            opacity: 0.5;
        }
        
        /* Empty year columns when all events are hidden */
        .tl-arc-year-column:not(:has(.tl-arc-event-node[style*="display: block"], .tl-arc-event-node:not([style*="display: none"]))) {
            opacity: 0.3;
        }
        
        .tl-arc-year-column.empty-filtered {
            opacity: 0.3;
        }
        
        /* Ensure swimlane labels remain visible even when events are filtered */
        .tl-arc-label {
            opacity: 1 !important;
        }
        
        /* Timeline stacked events filtering */
        .tl-stacked-events .tl-event-card.hidden {
            display: none !important;
        }
`;
}

export { generateUnifiedFilterCSS };