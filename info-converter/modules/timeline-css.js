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

        /* Left side events (odd) */
        .tl-timeline-event:nth-child(odd) {
            justify-content: flex-start;
        }

        /* Right side events (even) */
        .tl-timeline-event:nth-child(even) {
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

        .tl-timeline-marker {
            width: 16px;
            height: 16px;
            position: absolute;
            left: 50%;
            top: 20px;
            transform: translateX(-50%) rotate(45deg);
            z-index: 2;
            border: 2px solid ${colors.containerBg};
        }

        .tl-timeline-marker.rising {
            background: ${colors.statusCanon || '#28a745'};
        }

        .tl-timeline-marker.setback {
            background: ${colors.statusIdea || '#dc3545'};
        }

        .tl-timeline-marker.climax {
            background: ${colors.statusDraft || '#ffc107'};
        }

        /* Small event images in card corner */
        .tl-event-image {
            width: 60px;
            height: 60px;
            position: absolute;
            top: -30px;
            right: 5px;
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
        .tl-timeline-event:nth-child(odd) .tl-event-card,
        .tl-timeline-event:nth-child(odd) .tl-stacked-events {
            text-align: right;
        }

        .tl-timeline-event:nth-child(odd) .tl-event-card .tl-event-arc-title,
        .tl-timeline-event:nth-child(odd) .tl-event-card .tl-event-title,
        .tl-timeline-event:nth-child(odd) .tl-event-card .tl-event-timing {
            text-align: right;
        }

        /* MIRROR EFFECT: Move images to left side for left-side events */
        .tl-timeline-event:nth-child(odd) .tl-event-image {
            right: auto;
            left: 5px;
        }

        .tl-timeline-event:nth-child(odd) .tl-stacked-events .tl-event-image {
            right: auto;
            left: -9px;
        }

        /* Ensure right-side events stay left-aligned */
        .tl-timeline-event:nth-child(even) .tl-event-card,
        .tl-timeline-event:nth-child(even) .tl-stacked-events {
            text-align: left;
        }

        .tl-timeline-event:nth-child(even) .tl-event-card .tl-event-arc-title,
        .tl-timeline-event:nth-child(even) .tl-event-card .tl-event-title,
        .tl-timeline-event:nth-child(even) .tl-event-card .tl-event-timing {
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

        /* Left side events (odd) - diamond in bottom-left */
        .tl-timeline-event:nth-child(odd) .tl-chrono-notes-indicator {
            left: 8px;
        }

        /* Right side events (even) - diamond in bottom-right */
        .tl-timeline-event:nth-child(even) .tl-chrono-notes-indicator {
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

        /* TOOLTIP STYLING */
        .tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 0.85em;
            width: 300px;
            max-width: 90vw;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
            z-index: 10;
            margin-bottom: 8px;
            line-height: 1.5;
            text-align: left;
            font-family: ${fonts.ui};
            max-height: 9em;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 6;
            line-clamp: 6;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
        }

        .tooltip::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1.4em;
            background: linear-gradient(transparent, #333);
            pointer-events: none;
            z-index: 1;
        }

        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: #333;
        }

        .tl-tooltip-timing {
            margin-top: 3px;
            padding-top: 3px;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            font-size: 0.85em;
            line-height: 1.0;
            font-style: italic;
            opacity: 0.9;
        }

        .tl-event-card:hover .tooltip {
            opacity: 1;
            visibility: visible;
        }

        .tl-stacked-events .tl-event-card:hover .tooltip {
            opacity: 1;
            visibility: visible;
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

        /* Back to top button */
        #timeline-back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${colors.textSecondary};
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            z-index: 1000;
        }

        #timeline-back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }

        #timeline-back-to-top:hover {
            background: ${colors.textMuted};
            transform: translateY(-2px);
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

        /* ARC TIMELINE STYLES */
        .tl-arc-timeline-container {
            position: relative;
            width: 100%;
            margin: 0 auto;
            padding: 20px 0;
            overflow-x: auto;
            overflow-y: visible;
            z-index: 1;
        }

        .tl-arc-timeline-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${colors.containerBg};
            opacity: 0.3;
            z-index: -1;
            pointer-events: none;
        }

        /* Header structure */
        .tl-arc-header {
            display: flex;
            align-items: center;
            border-bottom: 2px solid ${colors.textMuted}44;
            margin-bottom: 20px;
            padding-bottom: 10px;
            min-width: fit-content;
            white-space: nowrap;
        }

        .tl-arc-label-column {
            width: 250px;
            min-width: 250px;
            max-width: 250px;
            padding: 15px;
            font-weight: bold;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            background: ${colors.headerBg};
            border-radius: 6px 0 0 6px;
            text-align: center;
            flex-shrink: 0;
            box-sizing: border-box;
        }

        .tl-arc-years-header {
            display: flex;
            min-width: fit-content;
            align-items: stretch;
            flex-shrink: 0;
            margin-left: 0;
            border-left: none;
        }

        .tl-arc-years-header .tl-arc-year-column {
            min-width: 100px;
            width: 100px;
            max-width: 175px;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            color: ${colors.textSecondary};
            font-family: ${fonts.ui};
            background: ${colors.headerBg};
            border-left: 1px solid ${colors.textMuted}33;
            flex-shrink: 0;
            flex-grow: 0;
            box-sizing: border-box;
        }

        /* Swimlane structure */
        .tl-arc-swimlane {
            display: flex;
            align-items: stretch;
            margin-bottom: 2px;
            min-height: 70px;
            border-bottom: 1px solid ${colors.textMuted}22;
            min-width: fit-content;
            overflow: visible;
            position: relative;
            z-index: 2;
            white-space: nowrap;
            background: ${colors.textMuted}08;
        }

        .tl-arc-swimlane::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--arc-color, ${colors.textSecondary});
            opacity: 0.08;
            z-index: -1;
        }

        .tl-arc-swimlane:hover::before {
            opacity: 0.15;
        }

        .tl-subarc-swimlane {
            margin-left: 0;
            min-height: 60px;
            background: ${colors.textMuted}08;
            min-width: fit-content;
            padding-left: 20px;
        }

        .tl-subarc-swimlane::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--arc-color, ${colors.textSecondary});
            opacity: 0.05;
            z-index: -1;
        }

        .tl-subarc-swimlane:hover::before {
            opacity: 0.12;
        }

        /* Arc Labels */
        .tl-arc-label {
            width: 250px;
            min-width: 250px;
            max-width: 250px;
            padding: 15px;
            background: var(--arc-color, ${colors.textSecondary})22;
            border-left: 4px solid var(--arc-color, ${colors.textSecondary});
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 8px;
            flex-shrink: 0;
            box-sizing: border-box;
        }

        .tl-subarc-label {
            background: var(--arc-color, ${colors.textSecondary})15;
            border-left: 3px solid var(--arc-color, ${colors.textSecondary});
            width: 230px;
            min-width: 230px;
            max-width: 230px;
            padding: 15px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 6px;
        }

        .tl-subarc-swimlane .tl-arc-timeline {
            min-width: fit-content;
            flex-shrink: 0;
        }

        .tl-arc-title {
            font-weight: 600;
            color: ${colors.textPrimary};
            font-family: ${fonts.ui};
            font-size: 0.9em;
            line-height: 1.3;
        }

        .tl-subarc-title {
            font-size: 0.8em;
            color: ${colors.textSecondary};
            position: relative;
        }

        .tl-arc-type-tag {
            background: var(--arc-color, ${colors.textSecondary});
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7em;
            font-family: ${fonts.ui};
            width: fit-content;
        }

        /* Arc Timeline Events Area */
        .tl-arc-timeline {
            display: flex;
            align-items: stretch;
            min-width: fit-content;
            overflow: visible;
            flex-shrink: 0;
            margin-left: 0;
        }

        .tl-arc-timeline .tl-arc-year-column {
            background: transparent;
            border-left: 1px solid ${colors.textMuted}22;
            padding: 10px;
            display: flex;
            flex-direction: column;
            min-width: 100px;
            width: 100px;
            max-width: 175px;
            flex-shrink: 0;
            flex-grow: 0;
            overflow: visible;
            box-sizing: border-box;
        }

        .tl-arc-year-column:last-child {
            border-radius: 0 6px 6px 0;
        }

        /* Node Container */
        .tl-arc-nodes-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-height: 40px;
            width: 100%;
            padding: 5px;
            overflow: visible;
            position: relative;
            z-index: 3;
        }

        /* Node Lane */
        .tl-arc-node-lane {
            display: flex;
            align-items: center;
            gap: 8px;
            min-height: 24px;
            flex-wrap: nowrap;
            width: max-content;
            min-width: 100%;
            overflow: visible;
            position: relative;
        }

        /* Event Node */
        .tl-arc-event-node {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.15s ease;
            position: relative;
            flex-shrink: 0;
            border: 2px solid var(--arc-color, ${colors.textSecondary});
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            z-index: 4;
        }

        .tl-arc-event-node:hover {
            transform: scale(1.1);
            z-index: 500;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .tl-arc-event-node:focus {
            outline: 2px solid ${colors.concepts};
            outline-offset: 2px;
        }

        /* Notes indicator - cute little diamond */
        .tl-node-notes-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 6px;
            color: ${colors.containerBg};
            opacity: 0.6;
            text-shadow: 0 0 2px ${colors.textPrimary}30;
            pointer-events: none;
            z-index: 5;
            transition: all 0.15s ease;
        }

        .tl-arc-event-node:hover .tl-node-notes-indicator {
            opacity: 0.85;
            font-size: 7px;
            text-shadow: 0 0 3px ${colors.textPrimary}50;
        }

        /* Node Spacer */
        .tl-arc-node-spacer {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }

        /* Timing Indicator */
        .tl-node-timing-indicator {
            position: absolute;
            bottom: -14px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 8px;
            color: ${colors.textMuted};
            font-family: ${fonts.ui};
            white-space: nowrap;
            font-weight: 500;
            text-shadow: 0 0 2px ${colors.containerBg};
            pointer-events: none;
        }

        /* Node Tooltip */
        .tl-node-tooltip {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(33, 37, 41, 0.96);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.75em;
            max-width: 320px;
            min-width: 200px;
            white-space: normal;
            word-wrap: break-word;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 1000;
            pointer-events: none;
            line-height: 1.3;
            font-family: ${fonts.ui};
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
            backdrop-filter: blur(2px);
        }

        .tl-arc-event-node:hover .tl-node-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(-1px);
        }

        .tl-arc-year-column:last-child .tl-arc-event-node .tl-node-tooltip {
            left: auto;
            right: 0;
            transform: translateX(0) translateY(-1px);
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

        /* Character Tags in Tooltip */
        .tl-tooltip-characters {
            margin-top: 3px;
            padding-top: 3px;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            font-size: 0.85em;
            line-height: 1.0;
        }

        .tl-tooltip-character-tag {
            font-weight: 600;
            margin-right: 3px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .tl-empty-year {
            min-height: 20px;
        }

        /* Scrolling for Year Columns */
        .tl-arc-year-column::-webkit-scrollbar {
            height: 4px;
        }

        .tl-arc-year-column::-webkit-scrollbar-track {
            background: ${colors.textMuted}20;
            border-radius: 2px;
        }

        .tl-arc-year-column::-webkit-scrollbar-thumb {
            background: ${colors.textMuted}60;
            border-radius: 2px;
        }

        .tl-arc-year-column::-webkit-scrollbar-thumb:hover {
            background: ${colors.textMuted}80;
        }

        /* Animation for node appearance */
        @keyframes nodeAppear {
            from {
                opacity: 0;
                transform: scale(0.5);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .tl-arc-event-node {
            animation: nodeAppear 0.3s ease-out;
        }

        /* Arc Timeline Expand Controls */
        .tl-arc-header-controls {
            position: relative;
            display: flex;
            justify-content: flex-end;
            padding: 10px 15px 5px 15px;
            z-index: 10;
        }

        .tl-arc-expand-btn {
            background: ${colors.containerBg};
            border: 1px solid ${colors.textMuted}44;
            border-radius: 4px;
            padding: 6px 8px;
            cursor: pointer;
            color: ${colors.textSecondary};
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .tl-arc-expand-btn:hover {
            background: ${colors.textMuted}22;
            color: ${colors.textPrimary};
            border-color: ${colors.textMuted}66;
        }

        .tl-expand-icon {
            transition: transform 0.2s ease;
        }

        /* Expanded Arc Timeline Styles */
        .tl-arc-timeline-container.expanded {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            z-index: 9999 !important;
            background: ${colors.containerBg} !important;
            overflow: auto !important;
            cursor: grab;
            margin: 0 !important;
            padding: 20px !important;
            box-sizing: border-box;
        }

        .tl-arc-timeline-container.expanded:active {
            cursor: grabbing;
        }

        .tl-arc-timeline-container.expanded .tl-expand-icon {
            transform: rotate(45deg);
        }

        /* Adjust header controls in expanded mode */
        .tl-arc-timeline-container.expanded .tl-arc-header-controls {
            position: sticky;
            top: 0;
            background: transparent !important;
            padding: 15px;
            border-bottom: 1px solid ${colors.textMuted}33;
            margin: -20px -20px 20px -20px;
            z-index: 100;
        }

        .tl-arc-timeline-container.expanded .tl-arc-expand-btn {
            background: ${colors.textMuted}22;
            border-color: ${colors.textMuted}66;
        }

        /* Ensure arc timeline content is wide enough in expanded mode */
        .tl-arc-timeline-container.expanded .tl-arc-header,
        .tl-arc-timeline-container.expanded .tl-arc-swimlane {
            min-width: max-content;
        }

        /* Hide scrollbars but keep functionality in expanded mode */
        .tl-arc-timeline-container.expanded::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        .tl-arc-timeline-container.expanded::-webkit-scrollbar-track {
            background: ${colors.textMuted}20;
            border-radius: 4px;
        }

        .tl-arc-timeline-container.expanded::-webkit-scrollbar-thumb {
            background: ${colors.textMuted}60;
            border-radius: 4px;
        }

        .tl-arc-timeline-container.expanded::-webkit-scrollbar-thumb:hover {
            background: ${colors.textMuted}80;
        }
    `;
}

export { generateTimelineCSS };