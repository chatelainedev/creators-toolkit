// Timeline CSS Generation Functions - VISUAL/LAYOUT ONLY
// All filtering CSS moved to filter-css.js

// Main function to generate timeline CSS - layout and visuals only
function generateTimelineCSS(colors, fonts) {
    return `
        /* Plans View Container */
        .plans-view {
            display: none;
        }

        .plans-view.active {
            display: block;
        }

        .plan-stats {
            font-size: 0.75em;
            color: #999;
            text-align: center;
            margin-top: auto;
            padding-top: 8px;
            border-top: 1px solid rgba(0,0,0,0.1);
            font-style: italic;
            opacity: 0.8;
            font-family: inherit;
        }

        /* Timeline View Switcher */
        .tl-view-switcher {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
            margin: -25px 0 10px 0;
            padding: 4px 13px;
            border: 1px solid ${colors.textMuted}33;
            border-radius: 6px;
        }

        .tl-view-switcher label {
            font-size: 0.9em;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            font-weight: 500;
        }

        .timeline-view-select {
            padding: 6px 12px;
            border: 1px solid ${colors.textMuted};
            border-radius: 4px;
            background: ${colors.containerBg};
            color: ${colors.textPrimary};
            font-family: ${fonts.ui};
            font-size: 0.9em;
            cursor: pointer;
        }

        .timeline-view-select:focus {
            outline: none;
            border-color: ${colors.concepts};
        }

        /* CHRONOLOGICAL TIMELINE STYLES */
        .tl-timeline-container {
            position: relative;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px 0;
        }

        /* Continuous timeline line spanning entire container */
        .tl-timeline-container::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 70px;
            bottom: 0;
            width: 3px;
            background: ${colors.textMuted}33;
            transform: translateX(-50%);
            z-index: 1;
        }

        .tl-timeline-year {
            margin-bottom: 50px;
            position: relative;
        }

        .tl-timeline-year:last-child {
            margin-bottom: 0;
        }

        .tl-year-label {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            z-index: 2;
        }

        .tl-year-label h3 {
            display: inline-block;
            background: ${colors.containerBg};
            padding: 8px 20px;
            font-size: 1.2em;
            font-weight: bold;
            color: ${colors.textSecondary};
            border: 2px solid ${colors.textMuted}33;
            border-radius: 20px;
            font-family: ${fonts.ui};
            margin: 0;
            position: relative;
            z-index: 2;
        }

        /* Month labels - Option 1: Line from center */
        .tl-month-label {
            font-size: 0.75em;
            font-variant: small-caps;
            letter-spacing: 0.05em;
            font-weight: 600;
            color: ${colors.textMuted};
            font-family: ${fonts.ui};
            text-align: center;
            margin: 20px 130px 15px 0;
            position: relative;
        }

        .tl-month-label::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateY(-50%);
            width: 25px;
            height: 1px;
            background: ${colors.textMuted}66;
            margin-left: -65px;
        }

        .tl-month-label::after {
            content: '';
            position: absolute;
            right: 50%;
            top: 50%;
            transform: translateY(-50%);
            width: 25px;
            height: 1px;
            background: ${colors.textMuted}66;
            margin-right: -65px;
        }

        .tl-month-label.tl-no-month {
            opacity: 0;
            font-style: italic;
        }

        .tl-timeline-events {
            position: relative;
        }

/* FLEXBOX POSITIONING */
        .tl-timeline-event {
            position: relative;
            margin-bottom: 30px;
            width: 100%;
            display: flex;
            align-items: flex-start;
        }

        /* Left side events */
        .tl-timeline-event.tl-left-side {
            justify-content: flex-start;
        }

        /* Right side events */
        .tl-timeline-event.tl-right-side {
            justify-content: flex-end;
        }

        /* Individual event cards */
        .tl-event-card {
            width: 45%;
            background: var(--seasonal-bg, ${colors.containerBg});
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid ${colors.textMuted}33;
            position: relative;
            cursor: pointer;
            margin: 0;
            overflow: visible;
        }

        /* Stacked events containers */
        .tl-stacked-events {
            width: 45%;
            background: var(--seasonal-bg, ${colors.headerBg});
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 1px solid ${colors.textMuted}33;
            position: relative;
            cursor: pointer;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0;
        }

        /* Small event images in card corner */
        .tl-event-image {
            width: 60px;
            height: 60px;
            position: absolute;
            top: 0px;
            right: 500px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid;
            background: ${colors.containerBg};
            z-index: 3;
        }

        .tl-event-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .tl-stacked-events .tl-event-image {
            right: -9px;
        }

        /* MIRROR EFFECT: Right-align content in left-side events */
        .tl-timeline-event.tl-left-side .tl-event-card,
        .tl-timeline-event.tl-left-side .tl-stacked-events {
            text-align: right;
        }

        .tl-timeline-event.tl-left-side .tl-event-card .tl-event-arc-title,
        .tl-timeline-event.tl-left-side .tl-event-card .tl-event-title,
        .tl-timeline-event.tl-left-side .tl-event-card .tl-event-timing {
            text-align: right;
        }

        /* MIRROR EFFECT: Move images to left side for left-side events */
        .tl-timeline-event.tl-left-side .tl-event-image {
            right: auto;
            left: 500px;
            top: 0px;
        }

        .tl-timeline-event.tl-left-side .tl-stacked-events .tl-event-image {
            right: auto;
            left: 500px;
            top: 0px;
        }

        /* Connecting line for left-side images - on parent to avoid clipping */
        .tl-timeline-event.tl-left-side.has-image::after {
            content: '';
            position: absolute;
            left: 430px;
            top: 30px;
            width: 75px;
            height: 3px;
            background: ${colors.textMuted}60;
            z-index: 1;
        }

        /* Connecting line for right-side images - only show when image exists */
        .tl-timeline-event.tl-right-side.has-image::after {
            content: '';
            position: absolute;
            right: 430px;
            top: 30px;
            width: 75px;
            height: 3px;
            background: ${colors.textMuted}60;
            z-index: 1;
        }


        /* Ensure right-side events stay left-aligned */
        .tl-timeline-event.tl-right-side .tl-event-card,
        .tl-timeline-event.tl-right-side .tl-stacked-events {
            text-align: left;
        }

        .tl-timeline-event.tl-right-side .tl-event-card .tl-event-arc-title,
        .tl-timeline-event.tl-right-side .tl-event-card .tl-event-title,
        .tl-timeline-event.tl-right-side .tl-event-card .tl-event-timing {
            text-align: left;
        }

        /* Chronological timeline notes indicator */
        .tl-chrono-notes-indicator {
            position: absolute;
            bottom: 8px;
            font-size: 18px;
            color: ${colors.containerBg};
            opacity: 0.8;
            text-shadow: 0 0 2px ${colors.textPrimary}60;
            pointer-events: none;
            z-index: 5;
            transition: all 0.15s ease;
        }

        /* Left side events - diamond in bottom-left */
        .tl-timeline-event.tl-left-side .tl-chrono-notes-indicator {
            left: 8px;
        }

        /* Right side events - diamond in bottom-right */
        .tl-timeline-event.tl-right-side .tl-chrono-notes-indicator {
            right: 8px;
        }

        .tl-event-card:hover .tl-chrono-notes-indicator {
            opacity: 1;
            font-size: 20px;
            text-shadow: 0 0 3px ${colors.textPrimary}80;
        }

        .tl-arc-link {
            color: ${colors.textPrimary || colors.accent};
            cursor: pointer;
            transition: color 0.2s ease;
        }

        .tl-arc-link:hover {
            color: ${colors.textSecondary || colors.accentDark || colors.accent};
            text-decoration: underline;
        }

        .tl-event-arc-title {
            font-size: 0.75em;
            color: ${colors.textMuted};
            margin-bottom: 4px;
            font-family: ${fonts.ui};
            font-style: italic;
        }

        .tl-event-title {
            font-weight: 500;
            color: ${colors.textPrimary};
            margin-bottom: 8px;
            font-family: ${fonts.ui};
            line-height: 1.4;
        }

        .tl-event-timing {
            font-size: 0.8em;
            color: ${colors.textSecondary};
            background: ${colors.containerBg};
            padding: 2px 6px;
            border-radius: 3px;
            display: inline-block;
            font-family: ${fonts.ui};
            opacity: 0.7;
            font-weight: 400;
        }

        .tl-event-card:hover .tooltip {
            opacity: 1;
            visibility: visible;
        }

        .tl-stacked-events .tl-event-card:hover .tooltip {
            opacity: 1;
            visibility: visible;
        }

        .tl-timeline-marker {
            width: 16px;
            height: 16px;
            position: absolute;
            left: 50%;
            top: 20px;
            transform: translateX(-50%) rotate(45deg);
            z-index: 2;
            border: 2px solid ${colors.containerBg};
            /* background-color will be set inline via style attribute */
        }

        /* Rich node tooltip styling */
        .tl-node-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(33, 37, 41, 0.96);
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 0.85em;
            min-width: 200px;
            max-width: 300px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
            z-index: 1000;
            margin-bottom: 8px;
            line-height: 1.5;
            text-align: left;
            font-family: ${fonts.ui};
            pointer-events: none;
            white-space: normal;
            word-wrap: break-word;
        }

        .tl-event-card:hover .tl-node-tooltip {
            opacity: 1;
            visibility: visible;
        }

        .tl-node-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: rgba(33, 37, 41, 0.96);
            z-index: 1001;
        }

        /* Tooltip sections */
        .tl-tooltip-timing {
            margin-top: 4px;
            font-size: 0.9em;
            opacity: 0.8;
        }

        .tl-tooltip-duration {
            margin-top: 2px;
            font-style: italic;
            font-size: 0.85em;
            opacity: 0.7;
        }

        .tl-tooltip-characters {
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            font-size: 0.85em;
        }

        .tl-tooltip-character-tag {
            font-weight: 600;
            margin-right: 4px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .tl-tooltip-notes {
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            font-size: 0.85em;
            font-style: italic;
            opacity: 0.8;
        }

        /* STACKED EVENTS: Internal layout */
        .tl-stacked-events .tl-event-card {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 0 20px 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            cursor: pointer !important;
            border-bottom: 1px solid ${colors.textMuted}33 !important;
            overflow: visible !important;
        }

        .tl-stacked-events .tl-event-card:last-of-type {
            padding-bottom: 0 !important;
            border-bottom: none !important;
            margin-bottom: 0 !important;
        }

        .tl-stacked-events .tl-event-card:not(:first-of-type) {
            padding-top: 12px !important;
        }

        /* Event Notes Modal */
        .tl-event-notes-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            backdrop-filter: blur(2px);
        }

        .tl-event-notes-modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .tl-event-notes-modal-content {
            background: ${colors.headerBg};
            margin: 20px;
            padding: 25px;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border: 1px solid ${colors.textMuted}33;
            position: relative;
        }

        .tl-event-notes-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid ${colors.textMuted}33;
        }

        .tl-event-notes-modal-title {
            font-size: 1.1em;
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.secondary};
            margin: 0;
            line-height: 1.3;
            flex: 1;
            padding-right: 15px;
        }

        .tl-event-notes-modal-close {
            background: none;
            border: none;
            font-size: 1.5em;
            color: ${colors.textMuted};
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            transition: all 0.2s ease;
        }

        .tl-event-notes-modal-close:hover {
            background: ${colors.textMuted}20;
            color: ${colors.textPrimary};
        }

        .tl-event-notes-modal-arc {
            font-size: 0.85em;
            color: ${colors.textMuted};
            font-style: italic;
            margin-bottom: 8px;
            font-family: ${fonts.ui};
        }

        .tl-event-notes-modal-timing {
            font-size: 0.9em;
            color: ${colors.textSecondary};
            background: ${colors.containerBg};
            padding: 3px 8px;
            border-radius: 4px;
            display: inline-block;
            font-family: ${fonts.ui};
            margin-bottom: 15px;
        }

        .tl-event-notes-modal-notes {
            color: ${colors.textContent || colors.textSecondary};
            font-family: ${fonts.ui};
            line-height: 1.6;
            white-space: pre-wrap;
        }

        /* Timeline Empty State */
        .tl-timeline-empty {
            text-align: center;
            padding: 40px 20px;
            color: ${colors.textSecondary};
        }

        .tl-timeline-empty h3 {
            color: ${colors.textPrimary};
            margin-bottom: 10px;
            font-family: ${fonts.ui};
        }

        .tl-timeline-empty p {
            font-family: ${fonts.secondary};
            line-height: 1.5;
            max-width: 400px;
            margin: 0 auto;
        }

        .tl-duration-badge {
            display: inline-block;
            margin-left: 4px;
            font-size: 0.85em;
            color: var(--accent-color);
            opacity: 0.8;
        }

        .tl-tooltip-duration {
            margin-top: 2px;
            padding-top: 2px;
            border-top: 1px solid var(--border-tertiary);
        }

        /* Yearly event styling */
        .tl-yearly-event {
            opacity: 0.75;
        }

        .tl-yearly-event .tl-event-card {
            border-left: 2px dashed var(--border-color) !important;
            background: var(--bg-secondary);
        }

        .tl-yearly-event .tl-event-card,
        .tl-yearly-event .tl-stacked-events {
            background: var(--bg-secondary) !important;
        }

        .tl-yearly-event.tl-right-side > .tl-event-card,
        .tl-yearly-event.tl-right-side > .tl-stacked-events {
            border-left: 2px dashed var(--border-color) !important;
        }

        .tl-yearly-event.tl-left-side > .tl-event-card,
        .tl-yearly-event.tl-left-side > .tl-stacked-events {
        border-right: 2px dashed var(--border-color) !important;
        }

        .tl-yearly-event .tl-event-title {
            font-size: 0.9em;
            font-style: italic;
        }
    `;
}

export { generateTimelineCSS };