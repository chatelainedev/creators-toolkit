// Updated plans-css.js
// Plans CSS with Card Style Support

function generatePlansCSS(colors, fonts, appearance) {
    const cardStyle = appearance?.cardStyle || 'current';
    
    // Generate container styles for plan elements based on card style
    let subarcContainerStyles = '';
    let subarcHeaderStyles = '';
    let eventContainerStyles = '';
    let modalContainerStyles = '';
    let subeventContainerStyles = '';
    
    switch (cardStyle) {
        case 'modern':
            subarcContainerStyles = `
                background: ${colors.containerBg};
                border-radius: 12px;
                border: none;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                overflow: hidden;
            `;
            subarcHeaderStyles = `
                background: ${colors.headerBg}66;
                border-radius: 12px 12px 0 0;
                border-bottom: 1px solid ${colors.textMuted}22;
            `;
            eventContainerStyles = `
                background: ${colors.containerBg} !important;
                border-radius: 12px;
                border: none;
                box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            `;
            modalContainerStyles = `
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            `;
            subeventContainerStyles = `
                background: ${colors.headerBg}33;
                border-radius: 12px;
                border: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            `;
            break;
            
        case 'minimal':
            subarcContainerStyles = `
                background: transparent;
                border-radius: 0;
                border: 1px solid ${colors.textMuted}44;
                box-shadow: none;
                overflow: visible;
            `;
            subarcHeaderStyles = `
                background: transparent;
                border-radius: 0;
                border-bottom: 1px solid ${colors.textMuted}44;
            `;
            eventContainerStyles = `
                background: transparent;
                border-radius: 0;
                border: 1px solid ${colors.textMuted}44;
                box-shadow: none;
            `;
            modalContainerStyles = `
                border-radius: 0;
                box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                border: 2px solid ${colors.textMuted}66;
            `;
            subeventContainerStyles = `
                background: ${colors.headerBg}22;
                border-radius: 0;
                border: 1px solid ${colors.textMuted}33;
                box-shadow: none;
            `;
            break;
            
        case 'detailed':
            subarcContainerStyles = `
                background: linear-gradient(145deg, ${colors.containerBg}, ${colors.headerBg});
                border-radius: 8px;
                border: 2px solid ${colors.textMuted}33;
                box-shadow: 0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1);
                overflow: hidden;
            `;
            subarcHeaderStyles = `
                background: linear-gradient(135deg, ${colors.headerBg}, ${colors.containerBg});
                border-radius: 8px 8px 0 0;
                border-bottom: 2px solid ${colors.textMuted}44;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
            `;
            eventContainerStyles = `
                background: linear-gradient(145deg, ${colors.containerBg}, ${colors.headerBg});
                border-radius: 8px;
                border: 2px solid ${colors.textMuted}33;
                box-shadow: 0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1);
            `;
            modalContainerStyles = `
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
                border: 2px solid ${colors.textMuted}55;
            `;
            subeventContainerStyles = `
                background: linear-gradient(135deg, ${colors.headerBg}88, ${colors.containerBg}88);
                border-radius: 8px;
                border: 1px solid ${colors.textMuted}44;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.05);
            `;
            break;
            
        case 'current':
        default:
            subarcContainerStyles = `
                background: ${colors.containerBg};
                border-radius: 8px;
                border: 1px solid ${colors.textMuted}33;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            `;
            subarcHeaderStyles = `
                background: ${colors.headerBg};
                border-radius: 8px 8px 0 0;
                border-bottom: 1px solid ${colors.textMuted}33;
            `;
            eventContainerStyles = `
                background: ${colors.containerBg};
                border-radius: 6px;
                border: 1px solid ${colors.textMuted}33;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            modalContainerStyles = `
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            `;
            subeventContainerStyles = `
                background: ${colors.headerBg};
                border-radius: 6px;
                border: 1px solid ${colors.textMuted}33;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            break;
    }
    
    // Generate hover styles based on card style
    let subarcHeaderHoverStyles = '';
    switch (cardStyle) {
        case 'modern':
            subarcHeaderHoverStyles = `
                background: ${colors.headerBg}88;
                transform: translateY(-1px);
            `;
            break;
        case 'minimal':
            subarcHeaderHoverStyles = `
                background: ${colors.headerBg}33;
            `;
            break;
        case 'detailed':
            subarcHeaderHoverStyles = `
                background: linear-gradient(135deg, ${colors.headerBg}dd, ${colors.containerBg}dd);
                transform: translateY(-1px);
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
            `;
            break;
        case 'current':
        default:
            subarcHeaderHoverStyles = `background: ${colors.textMuted}22;`;
            break;
    }

    return `    
        /* Plans Styles with Sub-Arcs Support - Card Style: ${cardStyle} */
        .plan-title {
            font-size: 1.3em;
            font-weight: bold;
            color: ${colors.textPrimary};
            margin-bottom: 8px;
            font-family: ${fonts.ui};
            flex-shrink: 0;
        }

        .plan-character-tags {
            color: ${colors.textSecondary};
            font-size: 0.9em;
            margin-bottom: 10px;
            flex-shrink: 0;
        }

        .plan-character-tags .character-tag {
            background: ${colors.textMuted}66;
            color: ${colors.textPrimary};
            font-family: ${fonts.ui};
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.85em;
            margin-right: 4px;
            margin-bottom: 2px;
            display: inline-block;
        }

        .plan-overview {
            color: ${colors.textSecondary};
            margin-bottom: 15px;
            line-height: 1.5;
            font-family: ${fonts.ui};
            flex-grow: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            overflow: hidden;
            max-height: 4.5em;
        }

        .plan-meta {
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

        .plan-event-count {
            font-weight: 500;
        }

        /* Plan Modal Styles with Card Style Support */
        .plan-modal-content {
            ${modalContainerStyles}
            max-width: 900px;
            width: 95%;
        }

        .plan-events-list {
            margin-top: 20px;
        }

        .plan-events-title {
            font-size: 1.2em;
            font-weight: 600;
            color: ${colors.textPrimary};
            margin-bottom: 15px;
            font-family: ${fonts.ui};
        }

        /* Sub-Arcs List Styles with Card Style Support */
        .plan-subarcs-list {
            margin-top: 20px;
        }

        .plan-subarcs-title {
            font-size: 1.2em;
            font-weight: 600;
            color: ${colors.textPrimary};
            margin-bottom: 15px;
            font-family: ${fonts.ui};
        }

        .plan-subarc {
            ${subarcContainerStyles}
            margin-bottom: 20px;
        }

        .plan-subarc.hidden-subarc {
            opacity: 0.6;
            ${cardStyle === 'minimal' ? 'border-style: dashed;' : ''}
        }

        .plan-subarc-header {
            ${subarcHeaderStyles}
            padding: 15px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s ease;
        }

        .plan-subarc-header:hover {
            ${subarcHeaderHoverStyles}
        }

        .plan-subarc-header-left {
            flex: 1;
        }

        .plan-subarc-title {
            font-size: 1.1em;
            font-weight: 600;
            color: ${colors.textPrimary};
            margin: 0 0 5px 0;
            font-family: ${fonts.ui};
        }

        .plan-subarc-description {
            font-size: 0.9em;
            color: ${colors.textSecondary};
            margin: 0 0 8px 0;
            line-height: 1.4;
        }

        .plan-subarc-character-tags {
            font-size: 0.8em;
            color: ${colors.textMuted};
        }

        .plan-subarc-character-tags .character-tag {
            background: ${colors.textMuted}66;
            color: ${colors.textPrimary};
            padding: 1px 4px;
            border-radius: 2px;
            font-size: 0.9em;
            margin-right: 3px;
        }

        .plan-subarc-toggle {
            font-size: 14px;
            transition: transform 0.3s ease;
            opacity: 0.7;
            color: ${colors.textSecondary};
        }

        .plan-subarc-toggle.expanded {
            transform: rotate(90deg);
        }

        .plan-subarc-content {
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .plan-subarc-content.collapsed {
            max-height: 0;
            opacity: 0;
        }

        .plan-subarc-content:not(.collapsed) {
            max-height: 1000px;
            opacity: 1;
        }

        .plan-subarc-events {
            padding: 15px 20px;
        }

        .plan-subarc.hidden-subarc::after {
            content: "HIDDEN";
            position: absolute;
            top: 5px;
            right: 10px;
            background: ${colors.textMuted};
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            opacity: 0.8;
        }

        /* Plan Event Subevents Section with Card Style Support */
        .plan-event-subevents {
            ${subeventContainerStyles}
            margin-top: 10px;
            overflow: hidden;
        }

        .plan-event-subevents-toggle {
            padding: 8px 12px;
            background: ${colors.headerBg};
            font-size: 0.8em;
            color: ${colors.textSecondary};
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s ease;
            user-select: none;
            border-bottom: 1px solid ${colors.textMuted}33;
            ${cardStyle === 'modern' ? 'border-radius: 12px 12px 0 0;' : ''}
            ${cardStyle === 'detailed' ? 'border-radius: 8px 8px 0 0;' : ''}
        }

        .plan-event-subevents-toggle:hover {
            background: ${colors.headerBg};
        }

        .plan-event-subevents-toggle-icon {
            font-size: 0.8em;
            color: ${colors.textSecondary};
            transition: transform 0.2s ease;
            width: 12px;
            text-align: center;
        }

        .plan-event-subevents-content {
            max-height: 300px;
            opacity: 1;
            transition: max-height 0.3s ease, opacity 0.2s ease;
            overflow: hidden;
        }

        .plan-event-subevents-content.collapsed {
            max-height: 0;
            opacity: 0;
        }

        /* Individual Subevent Items with Card Style Support */
        .plan-subevent-item {
            padding: 10px 12px;
            border-bottom: 1px solid ${colors.textMuted}33;
            background: ${colors.containerBg};
        }

        .plan-subevent-item:last-child {
            border-bottom: none;
            ${cardStyle === 'modern' ? 'border-radius: 0 0 12px 12px;' : ''}
            ${cardStyle === 'detailed' ? 'border-radius: 0 0 8px 8px;' : ''}
        }

        .subevent-description {
            font-size: 0.9em;
            color: ${colors.textPrimary};
            margin-bottom: 5px;
            line-height: 1.4;
            font-weight: 500;
        }

        .subevent-character-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }

        .subevent-character-tags .character-tag.small {
            font-size: 0.75em;
            padding: 2px 6px;
            background: ${colors.textMuted}33;
            color: ${colors.textSecondary};
            border-radius: ${cardStyle === 'modern' ? '10px' : cardStyle === 'minimal' ? '0' : '3px'};
            border: none;
            font-weight: 500;
        }

        .subevent-character-tags .no-tags {
            font-size: 0.75em;
            color: ${colors.textMuted};
            font-style: italic;
        }

        /* Character Moment Modal with Card Style Support */
        .subevent-item {
            ${cardStyle === 'modern' ? 'background: ' + colors.headerBg + '33; border-radius: 12px; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.06);' : ''}
            ${cardStyle === 'minimal' ? 'background: transparent; border-radius: 0; border: 1px solid ' + colors.textMuted + '44;' : ''}
            ${cardStyle === 'detailed' ? 'background: linear-gradient(135deg, ' + colors.headerBg + ', ' + colors.containerBg + '); border-radius: 8px; border: 2px solid ' + colors.textMuted + '33; box-shadow: 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.05);' : ''}
            ${cardStyle === 'current' ? 'background: ' + colors.headerBg + '; border-radius: 6px; border: 1px solid ' + colors.textMuted + '33;' : ''}
            padding: 12px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
        }

        .subevent-item:hover {
            background: ${colors.textMuted}15;
            ${cardStyle === 'modern' ? 'transform: translateY(-1px);' : ''}
            ${cardStyle === 'detailed' ? 'transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1);' : ''}
        }

        .subevent-content {
            flex: 1;
        }

        .subevent-tags {
            font-size: 0.85em;
            color: ${colors.textSecondary};
        }

        .subevent-tags .character-tag.small {
            background: ${colors.textMuted}66;
            color: ${colors.textPrimary};
            padding: 2px 6px;
            border-radius: ${cardStyle === 'modern' ? '8px' : cardStyle === 'minimal' ? '0' : '3px'};
            font-size: 0.8em;
            margin-right: 4px;
            display: inline-block;
        }

        .subevent-tags .no-tags {
            font-style: italic;
            color: ${colors.textMuted};
        }

        .subevent-actions {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
        }

        .subevent-actions .btn-edit,
        .subevent-actions .btn-delete {
            padding: 4px 8px;
            font-size: 0.8em;
            border: 1px solid ${colors.textMuted}66;
            background: ${colors.containerBg};
            color: ${colors.textSecondary};
            border-radius: ${cardStyle === 'modern' ? '8px' : cardStyle === 'minimal' ? '0' : '4px'};
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .subevent-actions .btn-edit:hover {
            background: ${colors.statusCanon};
            color: white;
            border-color: ${colors.statusCanon};
            ${cardStyle === 'modern' || cardStyle === 'detailed' ? 'transform: translateY(-1px);' : ''}
        }

        .subevent-actions .btn-delete:hover {
            background: ${colors.statusIdea};
            color: white;
            border-color: ${colors.statusIdea};
            ${cardStyle === 'modern' || cardStyle === 'detailed' ? 'transform: translateY(-1px);' : ''}
        }

        /* Storyline links in plan modals */
        .plan-event-storylines {
            margin: 4px 0;
            font-size: 0.85em;
            color: ${colors.textSecondary};
        }

        .plan-storyline-link {
            color: ${colors.linkColor || colors.textSecondary};
            cursor: pointer;
            transition: color 0.2s ease;
            margin-right: 8px;
        }

        .plan-storyline-link:hover {
            color: ${colors.linkHover || colors.textPrimary};
            text-decoration: underline;
            cursor: pointer;
        }

        /* Plan Event Styles with Collapsible Notes and Card Style Support */
        .plan-event {
            ${eventContainerStyles}
            background: var(--seasonal-bg, ${colors.containerBg});
            padding: 15px;
            margin-bottom: 10px;
            position: relative;
        }

        .plan-event.hidden-event {
            opacity: 0.6;
            ${cardStyle === 'minimal' ? 'border-style: dashed;' : ''}
        }

        .plan-event-header {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 8px;
        }

        .plan-event-type {
            font-size: 10px;
            color: white;
            padding: 2px 6px;
            border-radius: ${cardStyle === 'modern' ? '8px' : cardStyle === 'minimal' ? '0' : '3px'};
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
            font-family: 'Arial', sans-serif;
        }

        .plan-event-type.none {
            background-color: ${colors.textMuted};
        }

        .plan-event-type.exposition {
            background-color: ${colors.physical};
        }

        .plan-event-type.rising {
            background-color: ${colors.statusCanon};
        }

        .plan-event-type.setback {
            background-color: ${colors.statusIdea};
        }

        .plan-event-type.climax {
            background-color: ${colors.statusDraft};
            color: ${colors.statusDraft === '#ffc107' ? '#212529' : 'white'};
        }

        .plan-event-type.resolution {
            background-color: ${colors.hobbies};
        }

        /* Arc/SubArc Type Badges */
        .arc-type-badge, .subarc-type-badge {
            display: inline-block;
            font-size: 10px;
            color: white;
            padding: 3px 8px;
            border-radius: ${cardStyle === 'modern' ? '10px' : cardStyle === 'minimal' ? '0' : '4px'};
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
            font-family: 'Arial', sans-serif;
            margin-left: 10px;
            vertical-align: middle;
        }

        .plan-event-title {
            font-weight: 500;
            color: ${colors.textPrimary};
            font-family: ${fonts.ui};
            flex: 1;
        }

        .plan-event-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
            gap: 10px;
        }

        .plan-event-timing {
            font-size: 0.85em;
            color: ${colors.textSecondary};
            font-style: italic;
            font-family: ${fonts.ui};
            margin-left: auto;
        }

        .plan-event-characters {
            margin: 6px 0;
            font-size: 0.85em;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
        }

        .plan-event-characters .characters-label {
            flex-shrink: 0;
            font-weight: 500;
            margin-right: 2px;
        }

        .plan-event-characters .character-tag {
            background: ${colors.textMuted}66;
            color: ${colors.textPrimary};
            padding: 2px 6px;
            border-radius: ${cardStyle === 'modern' ? '8px' : cardStyle === 'minimal' ? '0' : '3px'};
            font-size: 0.88em;
            margin-right: 4px;
            margin-bottom: 2px;
            display: inline-block;
            font-family: ${fonts.ui} !important;
        }

        .event-character-tags {
            margin: 6px 0;
            font-size: 0.85em;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui} !important;
            display: flex;
            align-items: flex-start;
            gap: 6px;
        }

        .event-character-tags .characters-label {
            flex-shrink: 0;
            font-weight: 500;
        }

        .character-tag-small {
            display: inline-block;
            background: ${colors.textMuted}33;
            color: ${colors.textPrimary};
            padding: 2px 6px;
            border-radius: ${cardStyle === 'modern' ? '8px' : cardStyle === 'minimal' ? '0' : '3px'};
            font-size: 0.75em;
            margin-right: 4px;
            margin-bottom: 2px;
            font-family: ${fonts.ui} !important;
        }

        .event-bottom-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
            gap: 10px;
            font-size: 0.85em;
        }

        .event-timing-badge {
            background: ${colors.containerBg};
            color: ${colors.textSecondary};
            padding: 2px 6px;
            border-radius: ${cardStyle === 'modern' ? '8px' : cardStyle === 'minimal' ? '0' : '3px'};
            font-style: italic;
            font-family: ${fonts.ui};
        }

        .event-notes-preview {
            color: ${colors.textMuted};
            font-style: italic;
            font-family: ${fonts.ui};
        }

        /* Collapsible Notes Styles */
        .plan-event-notes-toggle {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.9em;
            color: ${colors.textSecondary};
            cursor: pointer;
            padding: 4px 0;
            transition: color 0.2s ease;
            font-family: ${fonts.ui};
        }

        .plan-event-notes-toggle:hover {
            color: ${colors.textPrimary};
        }

        .plan-event-notes-toggle-icon {
            font-size: 12px;
            transition: transform 0.3s ease;
        }

        .plan-event-notes-toggle.expanded .plan-event-notes-toggle-icon {
            transform: rotate(90deg);
        }

        .plan-event-notes {
            color: ${colors.textContent || colors.textSecondary};
            font-size: 0.9em;
            line-height: 1.4;
            font-family: ${fonts.ui};
            margin-top: 8px;
            padding: 10px 0 0 0;
            border-top: 1px solid ${colors.textMuted}33;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .plan-event-notes.collapsed {
            max-height: 0;
            opacity: 0;
            padding: 0;
            border-top: none;
            margin-top: 0;
        }

        .plan-event-notes:not(.collapsed) {
            max-height: 500px;
            opacity: 1;
        }

        .plan-event.hidden-event::after {
            content: "HIDDEN";
            position: absolute;
            top: 5px;
            right: 10px;
            background: ${colors.textMuted};
            color: white;
            padding: 2px 6px;
            border-radius: ${cardStyle === 'modern' ? '8px' : cardStyle === 'minimal' ? '0' : '3px'};
            font-size: 9px;
            font-weight: bold;
            opacity: 0.8;
        }  
    `;
}

export { generatePlansCSS };