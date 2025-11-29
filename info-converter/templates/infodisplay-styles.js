// Info-Display style definitions (affects info display within character profiles)
const infodisplayStyles = {
    'default': {
        name: 'RPG Profile',
        description: 'Modern RPG-style character sheet with metallic accents and skill corners'
    },
    'minimalist': {
        name: 'Minimalist',
        description: 'Ultra-clean design with subtle borders and transparent backgrounds'
    },
    'cyberpunk': {
        name: 'Cyberpunk',
        description: 'Glowing neon effects with animated scanline and tech-inspired borders'
    },
    'compact': {
        name: 'Compact',
        description: 'Tighter spacing with smaller icons and condensed text layout'
    },
    'ornate': {
        name: 'Ornate',
        description: 'Classical design with double borders and decorative flourishes'
    }
}

function generateInfodisplayStyles(infodisplayStyle, colors, fonts) {
    const categoryColors = colors;
    
    switch (infodisplayStyle) {
        case 'default':
            return `

        /* Info-Display Container */
        .character-info-display {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 0;
            background: ${colors.headerBg}88;
            border: 1px solid ${colors.textMuted}33;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            height: 360px;
            overflow: hidden;
        }

        /* Info-Display Header */
        .info-display-header {
            background: linear-gradient(90deg, ${colors.textMuted}20 0%, transparent 100%);
            border-bottom: 2px solid ${colors.textMuted};
            padding: 10px 16px;
            margin: 0;
            color: ${colors.textTitle};
            font-size: 1.1em;
            font-weight: 700;
            font-family: ${fonts.ui};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            flex-shrink: 0;
            margin-bottom: 10px;
        }

        /* Two-column grid layout */
        .info-display-content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            padding: 12px;
            overflow-y: auto;
            flex: 1;
            height: 100%;
        }

        /* Scrollbar styling for grid */
        .info-display-content-grid::-webkit-scrollbar {
            width: 6px;
        }

        .info-display-content-grid::-webkit-scrollbar-track {
            background: ${colors.headerBg};
            border-radius: 3px;
        }

        .info-display-content-grid::-webkit-scrollbar-thumb {
            background: ${colors.textMuted};
            border-radius: 3px;
        }

        .info-display-content-grid::-webkit-scrollbar-thumb:hover {
            background: ${colors.textSecondary};
        }

        /* Firefox scrollbar */
        .info-display-content-grid {
            scrollbar-width: thin;
            scrollbar-color: ${colors.textMuted} ${colors.headerBg};
        }

        /* LEFT COLUMN - Basic info */
        .info-display-left {
            display: flex;
            flex-direction: column;
            gap: 17px;
        }

        /* RIGHT COLUMN - Stats and Skills container */
        .info-display-right {
            background: ${colors.containerBg};
            opacity: 0.9;
            border-radius: 6px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
            height: fit-content;
        }

        /* Each row in the left column */
        .info-display-row {
            display: flex;
            align-items: center;
            gap: 10px;
            min-height: 28px;
        }

        /* Labels */
        .info-display-label {
            font-weight: 700;
            background: linear-gradient(to right, ${colors.navActive}66, transparent);
            color: ${colors.textPrimary};
            width: 150px;
            flex-shrink: 0;
            font-family: ${fonts.ui};
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-display-label::before {
            content: '▸ ';
            color: ${colors.textSecondary};
            margin-right: 4px;
        }

        /* Values */
        .info-display-value {
            color: ${colors.textPrimary};
            font-family: ${fonts.body};
            flex: 1;
            font-size: 0.95em;
            line-height: 1.3;
        }

        /* Character name - metallic gradient effect with theme colors */
        .character-display-name {
            font-weight: 700;
            font-size: 1.4em;
            background: linear-gradient(180deg, 
                ${colors.linkColor} 0%, 
                ${colors.linkHover || colors.linkColor} 40%,
                ${colors.linkColor} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            filter: drop-shadow(0 2px 4px ${colors.linkColor}40);
        }

        /* Links (for Faction, Location) */
        .info-display-link {
            color: ${colors.linkColor} !important;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s ease, color 0.2s ease;
        }

        .info-display-link:hover {
            border-bottom-color: ${colors.linkColor};
            color: ${colors.linkHover} !important;
        }

        .info-display-link:visited {
            color: ${colors.linkColor} !important;
        }

/* Items Icons Container */
        /* Keep the icons container with overflow for carousel, but ensure tooltip can escape */
        .info-display-icons {
            display: flex;
            flex-wrap: nowrap;
            gap: 6px;
            align-items: center;
            max-width: 152px;
            overflow: hidden;
            position: relative;
            scroll-behavior: smooth;
        }

        /* Individual item icon */
        .info-display-icon {
            width: 32px;
            height: 32px;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border-radius: 0;
            background: ${colors.containerBg}20;
            position: relative;
            flex-shrink: 0;
            border: none !important;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 90%;
        }

        .info-display-icon:hover {
            opacity: 100%;
        }

        /* Carousel navigation arrows for both items and skills */
        .icons-carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            color: ${colors.textSecondary}88;
            border: none;
            width: 20px;
            height: 20px;
            border-radius: 3px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            z-index: 10;
            transition: background 0.2s ease;
        }

        .icons-carousel-nav:hover {
            color: ${colors.textPrimary};
        }

        .icons-carousel-nav.visible {
            display: flex;
        }

        /* Items carousel positioning */
        .info-display-row.info-display-items .icons-carousel-nav.prev {
            left: 140px;
        }

        .info-display-row.info-display-items .icons-carousel-nav.next {
            right: -7px;
        }

        /* Make sure parent containers are positioned for absolute arrow positioning */
        .info-display-row.info-display-items {
            position: relative;
        }

        /* Use fixed positioning to escape all containers */
        .item-tooltip-container {
            position: relative;
            display: inline-block;
        }

        /* Remove the ::after pseudo-element tooltip since we'll use JS */
        .item-tooltip-container[data-tooltip]::after {
            display: none;
        }

        /* SKILLS icon */
        .info-display-skills-icon {
            width: 32px;
            height: 32px;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border-radius: 0;
            background: ${colors.containerBg}20;
            position: relative;
            flex-shrink: 0;
            border: none !important;
        }

        .info-display-skills-icons {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            align-items: center;
            justify-content: center;
            flex: 1;
        }

        /* The new wrapper span also needs to be a positioning context */
        .icon-corners-wrapper {
            position: relative;
            display: block; /* Make it fill the parent div */
            width: 100%;
            height: 100%;
        }

        /* This is the base style for ALL FOUR corner pieces */
        .info-display-skills-icon::before,
        .info-display-skills-icon::after,
        .icon-corners-wrapper::before,
        .icon-corners-wrapper::after {
            content: '';
            position: absolute;
            width: 8px;   /* The length of the corner lines */
            height: 8px;  /* The length of the corner lines */
            border-color: ${colors.linkColor}99; /* Use a theme color, maybe slightly transparent */
            border-style: solid;
            border-width: 0; /* We will add borders to specific sides below */
            transition: all 0.2s ease-in-out;
        }

        /* Top-Left Corner (on the outer div) */
        .info-display-skills-icon::before {
            top: -4px;
            left: -4px;
            border-top-width: 2px;
            border-left-width: 2px;
        }

        /* Bottom-Right Corner (on the outer div) */
        .info-display-skills-icon::after {
            bottom: -4px;
            right: -4px;
            border-bottom-width: 2px;
            border-right-width: 2px;
        }

        /* Top-Right Corner (on the inner span) */
        .icon-corners-wrapper::before {
            top: -4px;
            right: -4px;
            border-top-width: 2px;
            border-right-width: 2px;
        }

        /* Bottom-Left Corner (on the inner span) */
        .icon-corners-wrapper::after {
            bottom: -4px;
            left: -4px;
            border-bottom-width: 2px;
            border-left-width: 2px;
        }

        /* --- Optional Hover Effect --- */
        .info-display-skills-icon:hover::before,
        .info-display-skills-icon:hover::after,
        .info-display-skills-icon:hover .icon-corners-wrapper::before,
        .info-display-skills-icon:hover .icon-corners-wrapper::after {
            border-color: ${colors.linkHover || colors.linkColor};
            width: 12px; /* Make corners expand slightly on hover */
            height: 12px;
        }

        .skills-tooltip-container {
            position: relative;
            display: inline-block; /* Or 'block' if it suits layout better */
        }

        .skills-tooltip-container[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            top: 100%; /* Position it below the container */
            left: 50%;
            transform: translateX(-50%);
            margin-top: 1px; /* Extra space to clear the expanding corners on hover */
            color: ${colors.textPrimary}; 
            font-size: 0.75em;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
            z-index: 1000;
            transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
        }

        .skills-tooltip-container[data-tooltip]:hover::after {
            opacity: 0.7; 
            visibility: visible;
        }

        /* Stats display (right column) */
        .info-display-stats {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .stat-display-row {
            display: flex;
            align-items: center;
            gap: 40px;
        }

        .stat-label {
            font-size: 0.8em;
            font-weight: 600;
            color: ${colors.textPrimary};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: ${fonts.ui};
            width: 80px;        
            flex-shrink: 0; 
        }

        .stat-bar-container {
            position: relative;
            height: 16px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            overflow: hidden;
            flex: 1;  
        }

        .stat-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: linear-gradient(90deg, ${colors.linkColor}, ${colors.linkHover || colors.linkColor});
            border-radius: 8px;
            transition: width 0.3s ease;
        }

        .stat-value {
            position: absolute;
            top: 50%;
            right: 6px;
            transform: translateY(-50%);
            font-size: 0.7em;
            font-weight: 600;
            color: ${colors.textPrimary};
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            z-index: 1;
            font-family: ${fonts.ui};
        }

        /* Skills container at bottom of right column */
        .info-display-skills-container {
            margin-top: auto;
            padding: 5px;
        }

        .info-display-skills-container .info-display-icons {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            justify-content: center;
        }

        /* Adjust icon sizing for skills in right column */
        .info-display-skills-container .info-display-icon {
            width: 36px;
            height: 36px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .character-info-display {
                height: auto;
                max-height: 400px;
            }

            .info-display-header {
                font-size: 1em;
                padding: 8px 12px;
            }

            .info-display-content-grid {
                grid-template-columns: 1fr;
                padding: 10px;
                gap: 10px;
            }
            
            .info-display-row {
                flex-wrap: wrap;
                min-height: 24px;
            }
            
            .info-display-label {
                min-width: 70px;
                font-size: 0.8em;
            }

            .info-display-value {
                font-size: 0.9em;
            }

            .info-display-right {
                padding: 10px;
            }
        }`;

        case 'minimalist':
            return `
        /* Info-Display Container */
        .character-info-display {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 0;
            background: ${colors.containerBg};
            border: 1px solid ${colors.textMuted}22;
            border-radius: 4px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
            height: 360px;
            overflow: hidden;
        }

        .info-display-header {
            background: transparent;
            border-bottom: 1px solid ${colors.textMuted}33;
            padding: 12px 16px;
            margin: 0;
            color: ${colors.textPrimary};
            font-size: 1em;
            font-weight: 500;
            font-family: ${fonts.ui};
            text-transform: none;
            letter-spacing: 0;
            flex-shrink: 0;
            margin-bottom: 15px;
        }

        .info-display-content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            padding: 16px;
            overflow-y: auto;
            flex: 1;
            height: 100%;
        }

        .info-display-left {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .info-display-right {
            background: transparent;
            border-radius: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-shadow: none;
            height: fit-content;
        }

        .info-display-row {
            display: flex;
            align-items: center;
            gap: 20px;
            min-height: 24px;
            padding-bottom: 8px;
            border-bottom: 1px solid ${colors.textMuted}11;
        }

        .info-display-label {
            font-weight: 500;
            background: transparent;
            color: ${colors.textMuted};
            width: 100px;
            flex-shrink: 0;
            font-family: ${fonts.ui};
            font-size: 0.75em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-display-label::before {
            content: '';
            margin-right: 0;
        }

        .info-display-value {
            color: ${colors.textPrimary};
            font-family: ${fonts.body};
            flex: 1;
            font-size: 0.9em;
            line-height: 1.4;
        }

        .character-display-name {
            font-weight: 600;
            font-size: 1.3em;
            background: none;
            -webkit-text-fill-color: ${colors.textPrimary};
            color: ${colors.textPrimary};
            filter: none;
        }

        .info-display-link {
            color: ${colors.linkColor} !important;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid ${colors.linkColor}33;
            transition: border-color 0.2s ease;
        }

        .info-display-link:hover {
            border-bottom-color: ${colors.linkColor};
        }

        .info-display-icons {
            display: flex;
            flex-wrap: nowrap;
            gap: 6px;
            align-items: center;
            max-width: 152px;
            overflow: hidden;
            position: relative;
            scroll-behavior: smooth;
        }

        .info-display-icon {
            width: 32px;
            height: 32px;
            cursor: pointer;
            transition: opacity 0.2s ease;
            border-radius: 2px;
            background: ${colors.headerBg}44;
            position: relative;
            flex-shrink: 0;
            border: 1px solid ${colors.textMuted}22 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 80%;
        }

        .info-display-icon:hover {
            opacity: 100%;
        }

        .icons-carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            color: ${colors.textMuted};
            border: none;
            width: 20px;
            height: 20px;
            border-radius: 0;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            z-index: 10;
            transition: color 0.2s ease;
        }

        .icons-carousel-nav:hover {
            color: ${colors.textPrimary};
        }

        .icons-carousel-nav.visible {
            display: flex;
        }

        .info-display-row.info-display-items .icons-carousel-nav.prev {
            left: 100px;
        }

        .info-display-row.info-display-items .icons-carousel-nav.next {
            right: 2px;
        }

        .info-display-row.info-display-items {
            position: relative;
        }

        .item-tooltip-container {
            position: relative;
            display: inline-block;
        }

        .info-display-skills-icon {
            width: 32px;
            height: 32px;
            cursor: pointer;
            transition: opacity 0.2s ease;
            border-radius: 2px;
            background: ${colors.headerBg}44;
            position: relative;
            flex-shrink: 0;
            border: 1px solid ${colors.textMuted}22 !important;
        }

        .info-display-skills-icons {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
            justify-content: center;
            flex: 1;
        }

        .icon-corners-wrapper {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }

        /* Remove corner decorations for minimalist style */
        .info-display-skills-icon::before,
        .info-display-skills-icon::after,
        .icon-corners-wrapper::before,
        .icon-corners-wrapper::after {
            display: none;
        }

        .info-display-skills-icon:hover {
            opacity: 85%;
        }

        .skills-tooltip-container {
            position: relative;
            display: inline-block;
        }

        .skills-tooltip-container[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 4px;
            color: ${colors.textPrimary};
            font-size: 0.7em;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
            z-index: 1000;
            transition: opacity 0.2s ease;
        }

        .skills-tooltip-container[data-tooltip]:hover::after {
            opacity: 0.8;
            visibility: visible;
        }

        .info-display-stats {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .stat-display-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .stat-label {
            font-size: 0.75em;
            font-weight: 500;
            color: ${colors.textMuted};
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-family: ${fonts.ui};
            width: 80px;
            flex-shrink: 0;
        }

        .stat-bar-container {
            position: relative;
            height: 4px;
            background: #91664822;
            border-radius: 2px;
            overflow: hidden;
            flex: 1;
            max-width: 150px;
            margin-left: 20px;
        }

        .stat-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: ${colors.linkColor};
            border-radius: 2px;
            transition: width 0.3s ease;
        }

        .info-display-skills-container {
            margin-top: auto;
            padding: 8px 0 0 0;
            border-top: 1px solid ${colors.textMuted}11;
        }
        `;

        case 'cyberpunk':
            return `
        /* Info-Display Container */
        .character-info-display {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 0;
            background: linear-gradient(135deg, ${colors.headerBg}22 0%, ${colors.containerBg} 100%);
            border: 2px solid ${colors.linkColor}44;
            border-radius: 0;
            box-shadow: 0 0 20px ${colors.linkColor}22, inset 0 0 20px ${colors.linkColor}11;
            height: 360px;
            overflow: hidden;
            position: relative;
        }

        .character-info-display::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, ${colors.linkColor}, transparent);
            animation: scanline 3s linear infinite;
        }

        @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .info-display-header {
            background: linear-gradient(90deg, ${colors.linkColor}22 0%, transparent 100%);
            border-bottom: 2px solid ${colors.linkColor};
            padding: 10px 16px;
            margin: 0;
            color: ${colors.linkColor};
            font-size: 1.1em;
            font-weight: 700;
            font-family: ${fonts.ui};
            text-transform: uppercase;
            letter-spacing: 2px;
            flex-shrink: 0;
            text-shadow: 0 0 10px ${colors.linkColor}66;
            margin-bottom: 10px;
        }

        .info-display-content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            padding: 5px;
            overflow-y: auto;
            flex: 1;
            height: 100%;
        }

        .info-display-left {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .info-display-right {
            background: ${colors.headerBg}33;
            border: 1px solid ${colors.linkColor}33;
            border-radius: 0;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 22px;
            box-shadow: inset 0 0 10px ${colors.linkColor}11;
            height: fit-content;
        }

        .info-display-row {
            display: flex;
            align-items: center;
            gap: 25px;
            min-height: 28px;
            padding: 4px 0;
            border-bottom: 1px solid ${colors.linkColor}22;
        }

        .info-display-label {
            font-weight: 700;
            background: transparent;
            color: ${colors.linkColor};
            width: 120px;
            flex-shrink: 0;
            font-family: ${fonts.ui};
            font-size: 0.7em;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 0 5px ${colors.linkColor}44;
        }

        .info-display-label::before {
            content: '▸ ';
            color: ${colors.linkColor};
            margin-right: 4px;
        }

        .info-display-value {
            color: ${colors.textPrimary};
            font-family: ${fonts.body};
            flex: 1;
            font-size: 0.9em;
            line-height: 1.3;
        }

        .character-display-name {
            font-weight: 700;
            font-size: 1.4em;
            background: linear-gradient(180deg, ${colors.linkColor} 0%, ${colors.linkHover || colors.linkColor} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            filter: drop-shadow(0 0 8px ${colors.linkColor}66);
            text-shadow: 0 0 10px ${colors.linkColor};
        }

        .info-display-link {
            color: ${colors.linkColor} !important;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
            text-shadow: 0 0 5px ${colors.linkColor}33;
        }

        .info-display-link:hover {
            border-bottom-color: ${colors.linkColor};
            text-shadow: 0 0 8px ${colors.linkColor}66;
        }

        .info-display-icons {
            display: flex;
            flex-wrap: nowrap;
            gap: 6px;
            align-items: center;
            max-width: 152px;
            overflow: hidden;
            position: relative;
            scroll-behavior: smooth;
        }

        .info-display-icon {
            width: 24px !important;
            height: 24px !important;
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 0;
            background: ${colors.headerBg}44;
            position: relative;
            flex-shrink: 0;
            border: 1px solid ${colors.linkColor}44 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 80%;
            box-shadow: 0 0 5px ${colors.linkColor}22;
        }

        .info-display-icon:hover {
            opacity: 100%;
            box-shadow: 0 0 10px ${colors.linkColor}44;
            border-color: ${colors.linkColor} !important;
        }

        .icons-carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: ${colors.linkColor}22;
            color: ${colors.linkColor};
            border: 1px solid ${colors.linkColor}44;
            width: 20px;
            height: 20px;
            border-radius: 0;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            z-index: 10;
            transition: all 0.2s ease;
        }

        .icons-carousel-nav:hover {
            background: ${colors.linkColor}44;
            box-shadow: 0 0 8px ${colors.linkColor}66;
        }

        .icons-carousel-nav.visible {
            display: flex;
        }

        .info-display-row.info-display-items .icons-carousel-nav.prev {
            left: 120px;
        }

        .info-display-row.info-display-items .icons-carousel-nav.next {
            right: -7px;
        }

        .info-display-row.info-display-items {
            position: relative;
        }

        .item-tooltip-container {
            position: relative;
            display: inline-block;
        }

        .info-display-skills-icon {
            width: 32px;
            height: 32px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 0;
            background: ${colors.headerBg}44;
            position: relative;
            flex-shrink: 0;
            border: 1px solid ${colors.linkColor}44 !important;
            box-shadow: 0 0 5px ${colors.linkColor}22;
        }

        .info-display-skills-icons {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
            justify-content: center;
            flex: 1;
        }

        .icon-corners-wrapper {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }

        /* Cyberpunk corner style */
        .info-display-skills-icon::before,
        .info-display-skills-icon::after,
        .icon-corners-wrapper::before,
        .icon-corners-wrapper::after {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            border-color: ${colors.linkColor};
            border-style: solid;
            border-width: 0;
            transition: all 0.2s ease;
            box-shadow: 0 0 5px ${colors.linkColor}44;
        }

        .info-display-skills-icon::before {
            top: -2px;
            left: -2px;
            border-top-width: 2px;
            border-left-width: 2px;
        }

        .info-display-skills-icon::after {
            bottom: -2px;
            right: -2px;
            border-bottom-width: 2px;
            border-right-width: 2px;
        }

        .icon-corners-wrapper::before {
            top: -2px;
            right: -2px;
            border-top-width: 2px;
            border-right-width: 2px;
        }

        .icon-corners-wrapper::after {
            bottom: -2px;
            left: -2px;
            border-bottom-width: 2px;
            border-left-width: 2px;
        }

        .info-display-skills-icon:hover::before,
        .info-display-skills-icon:hover::after,
        .info-display-skills-icon:hover .icon-corners-wrapper::before,
        .info-display-skills-icon:hover .icon-corners-wrapper::after {
            width: 10px;
            height: 10px;
            box-shadow: 0 0 10px ${colors.linkColor}66;
        }

        .skills-tooltip-container {
            position: relative;
            display: inline-block;
        }

        .skills-tooltip-container[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 4px;
            color: ${colors.linkColor};
            font-size: 0.7em;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
            z-index: 1000;
            transition: opacity 0.2s ease;
            text-shadow: 0 0 8px ${colors.linkColor}66;
        }

        .skills-tooltip-container[data-tooltip]:hover::after {
            opacity: 1;
            visibility: visible;
        }

        .info-display-stats {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .stat-display-row {
            display: flex;
            align-items: center;
            gap: 30px;
        }

        .stat-label {
            font-size: 0.7em;
            font-weight: 600;
            color: ${colors.linkColor};
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: ${fonts.ui};
            width: 80px;
            flex-shrink: 0;
            text-shadow: 0 0 5px ${colors.linkColor}44;
        }

        .stat-bar-container {
            position: relative;
            height: 8px;
            background: ${colors.headerBg}66;
            border: 1px solid ${colors.linkColor}33;
            border-radius: 0;
            overflow: visible;
            flex: 1;
        }

        .stat-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: linear-gradient(90deg, ${colors.linkColor}, ${colors.linkHover || colors.linkColor});
            border-radius: 0;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px ${colors.linkColor}66;
        }

        .info-display-skills-container {
            margin-top: auto;
            padding: 8px 0 0 0;
            border-top: 2px solid ${colors.linkColor}33;
        }
        `;

        case 'compact':
            return `
        /* Info-Display Container */
        .character-info-display {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 0;
            background: ${colors.headerBg}66;
            border: 1px solid ${colors.textMuted}33;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            height: 360px;
            overflow: hidden;
        }

        .info-display-header {
            background: ${colors.headerBg};
            border-bottom: 1px solid ${colors.textMuted}44;
            padding: 8px 12px;
            margin: 0;
            color: ${colors.textTitle};
            font-size: 0.9em;
            font-weight: 600;
            font-family: ${fonts.ui};
            text-transform: uppercase;
            letter-spacing: 0.3px;
            flex-shrink: 0;
            margin-bottom: 12px;
        }

        .info-display-content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            padding: 10px;
            overflow-y: auto;
            flex: 1;
            height: 100%;
        }

        .info-display-left {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        .info-display-right {
            background: ${colors.containerBg}66;
            border-radius: 4px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 32px;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
            height: fit-content;
        }

        .info-display-row {
            display: flex;
            align-items: center;
            gap: 20px;
            min-height: 20px;
        }

        .info-display-label {
            font-weight: 600;
            background: transparent;
            color: ${colors.textMuted};
            width: 100px;
            flex-shrink: 0;
            font-family: ${fonts.ui};
            font-size: 0.6em;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .info-display-label::before {
            content: '· ';
            color: ${colors.textMuted};
            margin-right: 2px;
        }

        .info-display-value {
            color: ${colors.textPrimary};
            font-family: ${fonts.body};
            flex: 1;
            font-size: 0.85em;
            line-height: 1.3;
        }

        .character-display-name {
            font-weight: 700;
            font-size: 1.2em;
            background: none;
            -webkit-text-fill-color: ${colors.textPrimary};
            color: ${colors.textPrimary};
            filter: none;
        }

        .info-display-link {
            color: ${colors.linkColor} !important;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px dotted ${colors.linkColor}66;
            transition: border-bottom 0.2s ease;
        }

        .info-display-link:hover {
            border-bottom-style: solid;
        }

        .info-display-icons {
            display: flex;
            flex-wrap: nowrap;
            gap: 4px;
            align-items: center;
            max-width: 152px;
            overflow: hidden;
            position: relative;
            scroll-behavior: smooth;
        }

        .info-display-icon {
            width: 24px !important;
            height: 24px !important;
            cursor: pointer;
            transition: transform 0.2s ease;
            border-radius: 3px;
            background: ${colors.containerBg}44;
            position: relative;
            flex-shrink: 0;
            border: 1px solid ${colors.textMuted}22 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 70%;
        }

        .info-display-icon:hover {
            opacity: 100%;
            transform: scale(1.05);
        }

        .icons-carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: ${colors.headerBg}cc;
            color: ${colors.textSecondary};
            border: 1px solid ${colors.textMuted}33;
            width: 14px;
            height: 14px;
            border-radius: 2px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            z-index: 10;
            transition: all 0.2s ease;
        }

        .icons-carousel-nav:hover {
            background: ${colors.headerBg};
            color: ${colors.textPrimary};
        }

        .icons-carousel-nav.visible {
            display: flex;
        }

        .info-display-row.info-display-items .icons-carousel-nav.prev {
            left: 105px;
        }

        .info-display-row.info-display-items .icons-carousel-nav.next {
            right: 20px;
        }

        .info-display-row.info-display-items {
            position: relative;
        }

        .item-tooltip-container {
            position: relative;
            display: inline-block;
        }

        .info-display-skills-icon {
            width: 34px !important;
            height: 34px !important;
            cursor: pointer;
            transition: transform 0.2s ease;
            border-radius: 3px;
            background: ${colors.containerBg}44;
            position: relative;
            flex-shrink: 0;
            border: 1px solid ${colors.textMuted}22 !important;
        }

        .info-display-skills-icons {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-items: center;
            justify-content: center;
            flex: 1;
        }

        .icon-corners-wrapper {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }

        /* Simple dots for compact style */
        .info-display-skills-icon::before,
        .info-display-skills-icon::after,
        .icon-corners-wrapper::before,
        .icon-corners-wrapper::after {
            content: '';
            position: absolute;
            width: 3px;
            height: 3px;
            background: ${colors.linkColor}66;
            border-radius: 50%;
            border: none;
            transition: all 0.2s ease;
        }

        .info-display-skills-icon::before {
            top: 2px;
            left: 2px;
        }

        .info-display-skills-icon::after {
            bottom: 2px;
            right: 2px;
        }

        .icon-corners-wrapper::before {
            top: 2px;
            right: 2px;
        }

        .icon-corners-wrapper::after {
            bottom: 2px;
            left: 2px;
        }

        .info-display-skills-icon:hover::before,
        .info-display-skills-icon:hover::after,
        .info-display-skills-icon:hover .icon-corners-wrapper::before,
        .info-display-skills-icon:hover .icon-corners-wrapper::after {
            background: ${colors.linkColor};
            width: 4px;
            height: 4px;
        }

        .skills-tooltip-container {
            position: relative;
            display: inline-block;
        }

        .skills-tooltip-container[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 3px;
            color: ${colors.textPrimary};
            font-size: 0.65em;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
            z-index: 1000;
            transition: opacity 0.2s ease;
        }

        .skills-tooltip-container[data-tooltip]:hover::after {
            opacity: 0.9;
            visibility: visible;
        }

        .info-display-stats {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .stat-display-row {
            display: flex;
            align-items: center;
            gap: 38px;
        }

        .stat-label {
            font-size: 0.7em;
            font-weight: 600;
            color: ${colors.textSecondary};
            text-transform: uppercase;
            letter-spacing: 0.3px;
            font-family: ${fonts.ui};
            width: 70px;
            flex-shrink: 0;
        }

        .stat-bar-container {
            position: relative;
            height: 6px;
            background: ${colors.headerBg}88;
            border-radius: 3px;
            overflow: hidden;
            flex: 1;
        }

        .stat-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: ${colors.linkColor};
            border-radius: 3px;
            transition: width 0.3s ease;
        }

        .info-display-skills-container {
            margin-top: auto;
            padding: 6px 0 0 0;
        }
        `;

        case 'ornate':
            return `
        /* Info-Display Container */
        .character-info-display {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 0;
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.headerBg} 100%);
            border: 3px double ${colors.textMuted}66;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12), inset 0 0 20px ${colors.headerBg}44;
            height: 360px;
            overflow: hidden;
            position: relative;
        }

        .character-info-display::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${colors.textMuted}08 2px,
                ${colors.textMuted}08 4px
            );
            pointer-events: none;
        }

        .info-display-header {
            background: linear-gradient(90deg, ${colors.textMuted}33 0%, ${colors.textMuted}11 100%);
            border-bottom: 2px solid ${colors.textMuted}66;
            border-top: 1px solid ${colors.textMuted}22;
            padding: 12px 16px;
            margin: 0;
            color: ${colors.textTitle};
            font-size: 1em;
            font-weight: 600;
            font-family: ${fonts.secondary};
            text-transform: uppercase;
            letter-spacing: 1.5px;
            flex-shrink: 0;
            position: relative;
            z-index: 2;
            margin-bottom: 10px;
        }

        .info-display-header::before,
        .info-display-header::after {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: ${colors.textMuted};
            font-size: 0.8em;
        }

        .info-display-header::before {
            left: 8px;
        }

        .info-display-header::after {
            right: 8px;
        }

        .info-display-content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            padding: 8px;
            overflow-y: auto;
            flex: 1;
            height: 100%;
            position: relative;
            z-index: 2;
        }

        .info-display-left {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .info-display-right {
            background: ${colors.containerBg}cc;
            border: 2px solid ${colors.textMuted}33;
            border-radius: 6px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.08);
            height: fit-content;
        }

        .info-display-row {
            display: flex;
            align-items: center;
            gap: 24px;
            min-height: 26px;
            padding: 4px 8px;
            background: ${colors.headerBg}44;
            border-left: 3px solid ${colors.textMuted}44;
            border-radius: 0 4px 4px 0;
        }

        .info-display-label {
            font-weight: 600;
            background: transparent;
            color: ${colors.textSecondary};
            width: 120px;
            flex-shrink: 0;
            font-family: ${fonts.primary};
            font-size: 0.65em;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        .info-display-label::before {
            content: '❖ ';
            color: ${colors.textMuted};
            margin-right: 4px;
        }

        .info-display-value {
            color: ${colors.textPrimary};
            font-family: ${fonts.primary};
            flex: 1;
            font-size: 0.9em;
            line-height: 1.4;
        }

        .character-display-name {
            font-weight: 700;
            font-size: 1.3em;
            background: linear-gradient(180deg, ${colors.textTitle} 0%, ${colors.textSecondary} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
            font-family: ${fonts.primary};
        }

        .info-display-link {
            color: ${colors.linkColor} !important;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px solid ${colors.linkColor}44;
            transition: all 0.2s ease;
        }

        .info-display-link:hover {
            border-bottom-color: ${colors.linkColor};
        }

        .info-display-icons {
            display: flex;
            flex-wrap: nowrap;
            gap: 2px;
            align-items: center;
            max-width: 148px;
            overflow: hidden;
            position: relative;
            scroll-behavior: smooth;
        }

        .info-display-icon {
            width: 32px;
            height: 32px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 4px;
            background: ${colors.containerBg}88;
            position: relative;
            flex-shrink: 0;
            border: 2px solid ${colors.textMuted}33 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 85%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }

        .info-display-icon:hover {
            opacity: 100%;
            border-color: ${colors.linkColor}66 !important;
            box-shadow: 0 3px 6px rgba(0,0,0,0.12);
        }

        .icons-carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: #ccbea4ee;
            color: #4D3626;
            border: 2px solid #91664844;
            width: 18px;
            height: 18px;
            border-radius: 2px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            z-index: 10;
            transition: all 0.2s ease;
        }

        .icons-carousel-nav:hover {
            background: ${colors.headerBg};
            border-color: ${colors.linkColor}66;
        }

        .icons-carousel-nav.visible {
            display: flex;
        }

        .info-display-row.info-display-items .icons-carousel-nav.prev {
            left: 125px;
        }

        .info-display-row.info-display-items .icons-carousel-nav.next {
            right: -7px;
        }

        .info-display-row.info-display-items {
            position: relative;
        }

        .item-tooltip-container {
            position: relative;
            display: inline-block;
        }

        .info-display-skills-icon {
            width: 32px;
            height: 32px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 4px;
            background: ${colors.containerBg}88;
            position: relative;
            flex-shrink: 0;
            border: 2px solid ${colors.textMuted}33 !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }

        .info-display-skills-icons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            justify-content: center;
            flex: 1;
        }

        .icon-corners-wrapper {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }

        /* Ornate flourish corners */
        .info-display-skills-icon::before,
        .info-display-skills-icon::after,
        .icon-corners-wrapper::before,
        .icon-corners-wrapper::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            border-color: ${colors.linkColor}88;
            border-style: solid;
            border-width: 0;
            transition: all 0.2s ease;
        }

        .info-display-skills-icon::before {
            top: -3px;
            left: -3px;
            border-top-width: 2px;
            border-left-width: 2px;
            border-top-left-radius: 2px;
        }

        .info-display-skills-icon::after {
            bottom: -3px;
            right: -3px;
            border-bottom-width: 2px;
            border-right-width: 2px;
            border-bottom-right-radius: 2px;
        }

        .icon-corners-wrapper::before {
            top: -3px;
            right: -3px;
            border-top-width: 2px;
            border-right-width: 2px;
            border-top-right-radius: 2px;
        }

        .icon-corners-wrapper::after {
            bottom: -3px;
            left: -3px;
            border-bottom-width: 2px;
            border-left-width: 2px;
            border-bottom-left-radius: 2px;
        }

        .info-display-skills-icon:hover::before,
        .info-display-skills-icon:hover::after,
        .info-display-skills-icon:hover .icon-corners-wrapper::before,
        .info-display-skills-icon:hover .icon-corners-wrapper::after {
            border-color: ${colors.linkColor};
            width: 11px;
            height: 11px;
        }

        .skills-tooltip-container {
            position: relative;
            display: inline-block;
        }

        .skills-tooltip-container[data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 4px;
            color: ${colors.textPrimary};
            font-size: 0.7em;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
            z-index: 1000;
            transition: opacity 0.2s ease;
        }

        .skills-tooltip-container[data-tooltip]:hover::after {
            opacity: 0.9;
            visibility: visible;
        }

        .info-display-stats {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .stat-display-row {
            display: flex;
            align-items: center;
            gap: 50px;
        }

        .stat-label {
            font-size: 0.75em;
            font-weight: 600;
            color: ${colors.textSecondary};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: ${fonts.primary};
            width: 80px;
            flex-shrink: 0;
        }

        .stat-bar-container {
            position: relative;
            height: 10px;
            background: ${colors.headerBg}66;
            border: 1px solid ${colors.textMuted}33;
            border-radius: 5px;
            overflow: hidden;
            flex: 1;
        }

        .stat-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: linear-gradient(90deg, ${colors.linkColor}cc, ${colors.linkColor});
            border-radius: 5px;
            transition: width 0.3s ease;
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.3);
        }

        .info-display-skills-container {
            margin-top: auto;
            padding: 10px 0 0 0;
            border-top: 2px solid ${colors.textMuted}33;
        }
        `;
    }
}

// Make globally available
export default infodisplayStyles;
export { generateInfodisplayStyles };