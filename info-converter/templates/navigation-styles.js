// 4. ADD: New generateNavigationStyles() function:
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

function generateNavigationStyles(navigationStyle, colors, fonts) {
    switch (navigationStyle) {
        case 'hidden':
            return `
                /* Navigation - Hidden: Completely hide navigation */
                .nav-tabs {
                    display: none !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                    opacity: 0 !important;
                }

                .nav-tab {
                    display: none !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                    cursor: default !important;
                }
            `;
        case 'journal':
            return `
                /* Navigation - Notebook style tabs attached to the container */
                .nav-container {
                    position: relative;
                }

                .nav-tabs {
                    position: absolute;
                    left: -25px;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    background: transparent;
                    margin: 0;
                    width: auto;
                    z-index: 200;
                }

                .nav-tab {
                    flex: none;
                    padding: 20px 8px;
                    text-align: center;
                    color: ${colors.textSecondary};
                    cursor: pointer;
                    border: none;
                    background: ${colors.headerBg};
                    font-family: 'Trebuchet MS', 'Arial', sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    border-radius: 6px 0 0 6px;
                    border-left: 2px solid ${colors.textMuted};
                    border-top: 1px solid ${colors.textMuted};
                    border-bottom: 1px solid ${colors.textMuted};
                    border-right: none;
                    box-shadow: -2px 0 4px rgba(0,0,0,0.1);
                    transition: none;
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    height: 80px;
                    width: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: transparent;
                    position: relative;
                }

                .nav-tab::before {
                    content: "Overview";
                    position: absolute;
                    color: ${colors.textSecondary};
                    transform: rotate(180deg);
                    white-space: nowrap;
                }

                .nav-tab[data-page="overview"]::before { content: "Overview"; }
                .nav-tab[data-page="world"]::before { content: "World"; }
                .nav-tab[data-page="characters"]::before { content: "Characters"; }
                .nav-tab[data-page="storylines"]::before { content: "Storylines"; }
                .nav-tab[data-page="plans"]::before { content: "Plans"; }
                .nav-tab[data-page="playlists"]::before { content: "Playlists"; }

                .nav-tab.active {
                    background: ${colors.containerBg};
                    font-size: 0 !important;
                    border-left-color: ${colors.journalAccent};
                    box-shadow: -3px 0 6px rgba(0,0,0,0.15);
                    transform: translateX(-3px);
                    width: 28px;
                }

                .nav-tab.active::before {
                    color: ${colors.textPrimary};
                    font-size: 12px;
                }

                button.nav-tab.active {
                    font-size: 0 !important;
                }

                .nav-tab:hover:not(.active) {
                    background: ${colors.textSecondary};
                    font-size: 0 !important;
                }

                .nav-tab:hover:not(.active)::before {
                    color: ${colors.containerBg};
                    font-size: 12px;
                }
            `;

        case 'modern':
            return `
                /* Navigation - Modern flat style */
                .nav-tabs {
                    background: transparent;
                    border-bottom: 1px solid ${colors.textMuted}33;
                }

                .nav-tab {
                    background: transparent;
                    color: ${colors.textSecondary};
                    border: none;
                    border-bottom: 3px solid transparent;
                    border-radius: 0;
                    padding: 20px 25px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: none;
                }

                .nav-tab.active {
                    background: transparent;
                    color: ${colors.textPrimary};
                    border-bottom-color: ${colors.concepts};
                }
            `;

        case 'classic':
            return `
                /* Navigation - Classic formal style */
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
                    transition: none;
                }

                .nav-tab:last-child {
                    border-right: none;
                }

                .nav-tab.active {
                    background: ${colors.navActive};
                    color: ${colors.navActiveText};
                }
            `;

        case 'circular':
            return `
                /* Navigation - Circular: Round tabs on the left */
                .nav-container {
                    position: relative;
                }

                .nav-tabs {
                    position: absolute;
                    left: -50px;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    background: transparent;
                    margin: 0;
                    width: auto;
                    z-index: 200;
                    gap: 12px;
                    padding: 20px 0;
                }

                .nav-tab {
                    flex: none;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: 2px solid ${colors.textMuted};
                    background: ${colors.navBg};
                    color: transparent;
                    cursor: pointer;
                    font-family: ${fonts.ui};
                    font-size: 0;
                    transition: all 0.3s ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                /* Tab icons */
                .nav-tab::before {
                    content: "\\f015";
                    font-family: "Font Awesome 5 Free", "Font Awesome 6 Free", ${fonts.ui};
                    font-weight: 900;
                    position: absolute;
                    color: ${colors.navText};
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .nav-tab[data-page="overview"]::before { content: "\\f06e"; } /* Overview - eye icon */
                .nav-tab[data-page="world"]::before { content: "\\f0ac"; } /* World - globe icon */
                .nav-tab[data-page="characters"]::before { content: "\\f0c0"; } /* Characters - users icon */
                .nav-tab[data-page="storylines"]::before { content: "\\f02d"; } /* Storylines - book icon */
                .nav-tab[data-page="plans"]::before { content: "\\f0ae"; } /* Plans - tasks icon */
                .nav-tab[data-page="playlists"]::before { content: "\\f001"; } /* Playlists - music icon */

                .nav-tab:hover:not(.active) {
                    background: ${colors.navHover};
                    border-color: ${colors.textSecondary};
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .nav-tab:hover:not(.active)::before {
                    color: ${colors.navText};
                }

                .nav-tab.active {
                    background: ${colors.navActive};
                    border-color: ${colors.navActive};
                    transform: scale(1.15);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
                }

                .nav-tab.active::before {
                    color: ${colors.navActiveText};
                    font-weight: 900;
                }
            `;

        case 'squares':
            return `
                /* Navigation - Squares: Square tabs on the left */
                .nav-container {
                    position: relative;
                }

                .nav-tabs {
                    position: absolute;
                    left: -50px;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    background: transparent;
                    margin: 0;
                    width: auto;
                    z-index: 200;
                    gap: 12px;
                    padding: 20px 0;
                }

                .nav-tab {
                    flex: none;
                    width: 45px;
                    height: 45px;
                    border-radius: 4px; /* Small rounded corners instead of 50% */
                    border: 2px solid ${colors.textMuted};
                    background: ${colors.navBg};
                    color: transparent;
                    cursor: pointer;
                    font-family: ${fonts.ui};
                    font-size: 0;
                    transition: all 0.3s ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                /* Tab icons */
                .nav-tab::before {
                    content: "\\f015";
                    font-family: "Font Awesome 5 Free", "Font Awesome 6 Free", ${fonts.ui};
                    font-weight: 900;
                    position: absolute;
                    color: ${colors.navText};
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .nav-tab[data-page="overview"]::before { content: "\\f06e"; } /* Overview - eye icon */
                .nav-tab[data-page="world"]::before { content: "\\f0ac"; } /* World - globe icon */
                .nav-tab[data-page="characters"]::before { content: "\\f0c0"; } /* Characters - users icon */
                .nav-tab[data-page="storylines"]::before { content: "\\f02d"; } /* Storylines - book icon */
                .nav-tab[data-page="plans"]::before { content: "\\f0ae"; } /* Plans - tasks icon */
                .nav-tab[data-page="playlists"]::before { content: "\\f001"; } /* Playlists - music icon */

                .nav-tab:hover:not(.active) {
                    background: ${colors.navHover};
                    border-color: ${colors.textSecondary};
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .nav-tab:hover:not(.active)::before {
                    color: ${colors.navText};
                }

                .nav-tab.active {
                    background: ${colors.navActive};
                    border-color: ${colors.navActive};
                    transform: scale(1.15);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
                }

                .nav-tab.active::before {
                    color: ${colors.navActiveText};
                    font-weight: 900;
                }
            `;

        case 'pills':
            return `
                /* Navigation - Pills: Rounded pill-shaped tabs */
                .nav-tabs {
                    background: transparent;
                    padding: 20px;
                    margin: 0;
                    border-bottom: 1px solid ${colors.textMuted}22;
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                }

                .nav-tab {
                    background: ${colors.headerBg};
                    color: ${colors.textSecondary};
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 25px;
                    padding: 12px 24px;
                    margin: 0;
                    
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    font-size: 14px;
                    
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .nav-tab:hover:not(.active) {
                    background: ${colors.navHover};
                    color: ${colors.textPrimary};
                    border-color: ${colors.textMuted}55;
                }

                .nav-tab.active {
                    background: ${colors.textSecondary};
                    color: ${colors.containerBg};
                    border-color: ${colors.textSecondary};
                }
            `;

        case 'underline':
            return `
                /* Navigation - Underline: Clean minimal tabs with animated underlines */
                .nav-tabs {
                    background: transparent;
                    padding: 0 30px;
                    margin: 0;
                    border-bottom: 1px solid ${colors.textMuted}33;
                    display: flex;
                    gap: 40px;
                }

                .nav-tab {
                    background: transparent;
                    color: ${colors.textSecondary};
                    border: none;
                    border-bottom: 3px solid transparent;
                    border-radius: 0;
                    padding: 20px 0;
                    margin: 0;
                    position: relative;
                    
                    font-family: ${fonts.ui};
                    font-weight: 500;
                    font-size: 15px;
                    
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .nav-tab:hover:not(.active) {
                    background: transparent;
                    color: ${colors.textPrimary};
                    border-bottom-color: ${colors.textMuted}66;
                }

                .nav-tab.active {
                    background: transparent;
                    color: ${colors.textPrimary};
                    border-bottom-color: ${colors.textSecondary};
                    font-weight: 600;
                }
            `;

        case 'kawaii':
            return `
                /* Navigation - Kawaii: Cute pastel bubbles */
                .nav-tabs {
                    background: transparent;
                    padding: 20px;
                    margin: 0;
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    border-bottom: 2px dotted ${colors.textMuted}44;
                }

                .nav-tab {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg}ee 0%, 
                        ${colors.headerBg}dd 100%);
                    color: ${colors.textSecondary};
                    border: 2px solid ${colors.textMuted}33;
                    border-radius: 25px;
                    padding: 12px 20px;
                    margin: 0;
                    position: relative;
                    
                    font-family: ${fonts.ui};
                    font-weight: 500;
                    font-size: 13px;
                    text-transform: lowercase;
                    letter-spacing: 0.5px;
                    
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    box-shadow: 0 4px 12px ${colors.textMuted}22;
                }

                /* Cute sparkle effects */
                .nav-tab::before {
                    content: '✦';
                    position: absolute;
                    top: -8px; right: -5px;
                    color: ${colors.textMuted}66;
                    font-size: 12px;
                    opacity: 0;
                    transition: all 0.3s ease;
                    animation: twinkle 2s infinite;
                }

                .nav-tab:hover:not(.active) {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.concepts}44 100%);
                    color: ${colors.textPrimary};
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 20px ${colors.textMuted}44;
                    border-color: ${colors.concepts}66;
                }

                .nav-tab:hover:not(.active)::before {
                    opacity: 1;
                    color: ${colors.concepts};
                }

                .nav-tab.active {
                    background: linear-gradient(135deg, 
                        ${colors.concepts}aa 0%, 
                        ${colors.containerBg} 50%,
                        ${colors.concepts}66 100%);
                    color: ${colors.textPrimary};
                    border-color: ${colors.concepts};
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px ${colors.concepts}44;
                    font-weight: 600;
                }

                .nav-tab.active::before {
                    opacity: 1;
                    color: ${colors.concepts};
                    animation: sparkle 1.5s infinite;
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }

                @keyframes sparkle {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    25% { transform: rotate(90deg) scale(1.3); }
                    50% { transform: rotate(180deg) scale(1); }
                    75% { transform: rotate(270deg) scale(1.3); }
                }
            `;

        case 'hearts':
            return `
                /* Navigation - Hearts: Cute heart-themed tabs */
                .nav-tabs {
                    background: transparent;
                    padding: 15px 20px;
                    margin: 0;
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                    border-bottom: 3px double ${colors.textMuted}33;
                }

                .nav-tab {
                    background: linear-gradient(45deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.headerBg}88 100%);
                    color: ${colors.textSecondary};
                    border: 1px solid ${colors.textMuted}44;
                    border-radius: 15px 15px 8px 8px;
                    padding: 10px 18px 12px;
                    margin: 0;
                    position: relative;
                    
                    font-family: ${fonts.ui};
                    font-weight: 500;
                    font-size: 12px;
                    text-transform: lowercase;
                    
                    cursor: pointer;
                    transition: all 0.2s ease;
                    overflow: hidden;
                }

                /* Heart decoration */
                .nav-tab::after {
                    content: '♡';
                    position: absolute;
                    top: -2px; right: 8px;
                    color: ${colors.textMuted}55;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .nav-tab:hover:not(.active) {
                    background: linear-gradient(45deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.factions}33 100%);
                    color: ${colors.textPrimary};
                    border-color: ${colors.factions}66;
                    transform: translateY(-1px);
                }

                .nav-tab:hover:not(.active)::after {
                    content: '♥';
                    color: ${colors.factions};
                    transform: scale(1.2);
                }

                .nav-tab.active {
                    background: linear-gradient(45deg, 
                        ${colors.factions}77 0%, 
                        ${colors.containerBg} 100%);
                    color: ${colors.textPrimary};
                    border-color: ${colors.factions};
                    font-weight: 600;
                }

                .nav-tab.active::after {
                    content: '♥';
                    color: ${colors.factions};
                    animation: heartbeat 1.5s infinite;
                }

                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                }
            `;

        case 'candy':
            return `
                /* Navigation - Candy: Sweet candy-themed tabs */
                .nav-container {
                    position: relative;
                }

                .nav-tabs {
                    position: absolute;
                    left: -40px;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    background: transparent;
                    margin: 0;
                    width: auto;
                    z-index: 200;
                    gap: 8px;
                }

                .nav-tab {
                    flex: none;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    border: 2px solid ${colors.textMuted}33;
                    background: linear-gradient(135deg, 
                        ${colors.containerBg}dd 0%, 
                        ${colors.headerBg}77 100%);
                    color: transparent;
                    cursor: pointer;
                    font-size: 0;
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 
                        0 2px 8px ${colors.textMuted}22,
                        inset 0 1px 3px ${colors.containerBg}88;
                }

                /* FontAwesome icons for each tab */
                .nav-tab::before {
                    content: "\\f06e";
                    font-family: "Font Awesome 5 Free", "Font Awesome 6 Free", ${fonts.ui};
                    font-weight: 900;
                    position: absolute;
                    color: ${colors.textSecondary}aa;
                    font-size: 13px;
                    transition: all 0.4s ease;
                    filter: drop-shadow(0 1px 2px ${colors.containerBg}66);
                }

                .nav-tab[data-page="overview"]::before { content: "\\f06e"; } /* Overview - eye icon */
                .nav-tab[data-page="world"]::before { content: "\\f0ac"; } /* World - globe icon */
                .nav-tab[data-page="characters"]::before { content: "\\f0c0"; } /* Characters - users icon */
                .nav-tab[data-page="storylines"]::before { content: "\\f02d"; } /* Storylines - book icon */
                .nav-tab[data-page="plans"]::before { content: "\\f0ae"; } /* Plans - tasks icon */
                .nav-tab[data-page="playlists"]::before { content: "\\f001"; } /* Playlists - music icon */

                .nav-tab:hover:not(.active) {
                    background: linear-gradient(135deg, 
                        ${colors.locations}55 0%, 
                        ${colors.containerBg}bb 100%);
                    border-color: ${colors.locations}55;
                    transform: scale(1.1);
                    box-shadow: 
                        0 4px 12px ${colors.locations}33,
                        inset 0 1px 4px ${colors.containerBg}aa;
                }

                .nav-tab:hover:not(.active)::before {
                    color: ${colors.textPrimary}dd;
                    transform: scale(1.05) rotate(3deg);
                    filter: drop-shadow(0 1px 3px ${colors.locations}44);
                }

                .nav-tab.active {
                    background: linear-gradient(135deg, 
                        ${colors.locations}77 0%, 
                        ${colors.containerBg}aa 100%);
                    border-color: ${colors.locations}77;
                    transform: scale(1.15);
                    box-shadow: 
                        0 6px 16px ${colors.locations}44,
                        inset 0 1px 4px ${colors.containerBg}bb;
                }

                .nav-tab.active::before {
                    color: ${colors.textPrimary};
                    transform: scale(1.1);
                    filter: drop-shadow(0 1px 4px ${colors.locations}66);
                }

            `;

        case 'flowers':
            return `
                /* Navigation - Flowers: Cute flower petal tabs */
                .nav-tabs {
                    background: transparent;
                    padding: 20px;
                    margin: 0;
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    border-bottom: none;
                }

                .nav-tab {
                    background: ${colors.plants}33; /* FIXED: Solid background first */
                    background-image: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.plants}33 100%); /* Then gradient on top */
                    color: ${colors.textSecondary};
                    border: 2px solid ${colors.plants}44;
                    border-radius: 50% 50% 50% 0;
                    padding: 15px 20px;
                    margin: 0;
                    position: relative;
                    
                    font-family: ${fonts.ui};
                    font-weight: 500;
                    font-size: 12px;
                    text-transform: lowercase;
                    
                    cursor: pointer;
                    transition: all 0.3s ease;
                    transform: rotate(-5deg);
                    overflow: hidden; /* FIXED: Prevent any background bleed */
                }

                /* Add a subtle inner shadow to blend edges better */
                .nav-tab::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    border-radius: inherit;
                    box-shadow: inset 0 0 8px ${colors.plants}22; /* FIXED: Inner glow */
                    pointer-events: none;
                    z-index: 1;
                }

                /* Flower center - moved to top-right corner */
                .nav-tab::before {
                    content: '●';
                    position: absolute;
                    top: 4px; 
                    right: 6px;
                    color: ${colors.plants}66;
                    font-size: 8px;
                    z-index: 2; /* FIXED: Above the inner shadow */
                }

                .nav-tab:nth-child(odd) {
                    transform: rotate(5deg);
                }

                .nav-tab:hover:not(.active) {
                    background: ${colors.plants}55; /* FIXED: Solid background */
                    background-image: linear-gradient(135deg, 
                        ${colors.plants}55 0%, 
                        ${colors.containerBg} 100%);
                    color: ${colors.textPrimary};
                    border-color: ${colors.plants};
                    transform: rotate(0deg) scale(1.1);
                    box-shadow: 0 4px 12px ${colors.plants}44;
                }

                .nav-tab:hover:not(.active)::before {
                    color: ${colors.plants};
                    font-size: 10px;
                }

                .nav-tab.active {
                    background: ${colors.plants}; /* FIXED: Solid background */
                    background-image: linear-gradient(135deg, 
                        ${colors.plants} 0%, 
                        ${colors.containerBg} 100%);
                    color: ${colors.textPrimary};
                    border-color: ${colors.plants};
                    transform: rotate(0deg) scale(1.05);
                    font-weight: 600;
                    box-shadow: 0 6px 16px ${colors.plants}66;
                }

                .nav-tab.active::before {
                    color: ${colors.containerBg};
                    font-size: 12px;
                    animation: bloom 2s infinite;
                }

                @keyframes bloom {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.5); }
                }
            `;

        case 'industrial':
            return `
                /* Navigation - Industrial dossier tabs */
                .nav-tabs {
                    border-bottom: 3px solid ${colors.bannerBorder};
                    background: transparent;
                    padding-left: 10px;
                }

                .nav-tab {
                    background: transparent;
                    color: ${colors.textSecondary};
                    border: 1px solid ${colors.bannerBorder};
                    border-bottom: none;
                    border-radius: 4px 4px 0 0;
                    padding: 12px 20px 12px;
                    margin-right: 4px;
                    margin-bottom: -1px; /* Key for connecting active tab to container */
                    font-family: ${fonts.accent};
                    font-weight: 400;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    position: relative;
                    top: 1px;
                    transition: none;
                }

                .nav-tab.active {
                    background: ${colors.containerBg};
                    color: ${colors.journalAccent};
                    border-top: 3px solid ${colors.journalAccent};
                    border-bottom: 1px solid ${colors.containerBg}; /* Hides the container border underneath */
                    padding-top: 10px; /* Adjust padding to account for thicker border */
                }

                .nav-tab:hover:not(.active) {
                    background: ${colors.headerBg};
                    color: ${colors.textPrimary};
                }
            `;

        case 'wuxia':
            return `
                /* Navigation - Wuxia: Elegant Hanging Scrolls */
                .nav-container {
                    position: relative;
                }

                .nav-tabs {
                    position: absolute;
                    left: -30px;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    background: transparent;
                    margin: 0;
                    width: auto;
                    z-index: 200;
                    gap: 6px;
                }

                .nav-tab {
                    flex: none;
                    padding: 25px 10px;
                    text-align: center;
                    color: ${colors.textSecondary};
                    cursor: pointer;
                    border: none;
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.containerBg}f5 100%);
                    font-family: ${fonts.ui};
                    font-size: 12px;
                    font-weight: 500;
                    border-radius: 8px 0 0 8px;
                    border-left: 1px solid ${colors.textMuted}33;
                    border-top: 1px solid ${colors.textMuted}22;
                    border-bottom: 1px solid ${colors.textMuted}22;
                    border-right: none;
                    box-shadow: 
                        -3px 3px 12px rgba(0,0,0,0.1),
                        inset 0 1px 2px ${colors.containerBg}cc;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    height: 90px;
                    width: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: transparent;
                    position: relative;
                    overflow: hidden;
                }

                .nav-tab::before {
                    content: "Overview";
                    position: absolute;
                    color: ${colors.textSecondary};
                    transform: rotate(180deg);
                    white-space: nowrap;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    z-index: 2;
                    transition: all 0.4s ease;
                }

                .nav-tab[data-page="overview"]::before { content: "Overview"; }
                .nav-tab[data-page="world"]::before { content: "World"; }
                .nav-tab[data-page="characters"]::before { content: "Characters"; }
                .nav-tab[data-page="storylines"]::before { content: "Storylines"; }
                .nav-tab[data-page="plans"]::before { content: "Plans"; }
                .nav-tab[data-page="playlists"]::before { content: "Playlists"; }

                .nav-tab::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: linear-gradient(45deg, 
                        transparent 0%, 
                        ${colors.containerBg}1a 50%, 
                        transparent 100%);
                    opacity: 0;
                    transition: all 0.6s ease;
                    z-index: 1;
                }

                .nav-tab:hover:not(.active) {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg}fa 0%, 
                        ${colors.wuxiaAccentLight || colors.concepts}44 100%);
                    color: ${colors.textPrimary};
                    transform: translateX(-1px);
                    width: 33px;
                    font-size: 0 !important;
                    box-shadow: 
                        -5px 5px 20px rgba(0,0,0,0.15),
                        inset 0 1px 3px ${colors.containerBg}e6;
                }

                .nav-tab:hover:not(.active)::after {
                    opacity: 1;
                    animation: gentleFlow 2s ease-in-out infinite;
                }

                .nav-tab:hover:not(.active)::before {
                    color: ${colors.textPrimary};
                    font-weight: 600;
                    font-size: 12px;
                }

                .nav-tab.active {
                    background: linear-gradient(135deg, 
                        ${colors.wuxiaAccent || colors.concepts} 0%, 
                        ${colors.containerBg}f5 50%,
                        ${colors.wuxiaAccent || colors.concepts}88 100%);
                    color: ${colors.textPrimary};
                    border-left-color: ${colors.wuxiaAccent || colors.concepts};
                    border-top-color: ${colors.wuxiaAccent || colors.concepts}88;
                    border-bottom-color: ${colors.wuxiaAccent || colors.concepts}88;
                    transform: translateX(-3px);
                    width: 35px;
                    font-size: 0 !important;
                    box-shadow: 
                        -8px 8px 25px rgba(0,0,0,0.2),
                        0 0 15px ${colors.wuxiaGlow || colors.concepts + '99'},
                        inset 0 1px 4px ${colors.containerBg}e6;
                }

                .nav-tab.active::after {
                    opacity: 0.8;
                    background: linear-gradient(45deg, 
                        ${colors.wuxiaAccent || colors.concepts}4d 0%, 
                        ${colors.containerBg}33 50%, 
                        ${colors.wuxiaAccent || colors.concepts}4d 100%);
                    animation: gentleGlow 4s ease-in-out infinite;
                }

                .nav-tab.active::before {
                    color: ${colors.textPrimary};
                    font-weight: 600;
                    font-size: 12px;
                    text-shadow: 0 0 8px ${colors.wuxiaGlow || colors.concepts + '80'};
                }

                button.nav-tab.active {
                    font-size: 0 !important;
                }

                @keyframes gentleFlow {
                    0%, 100% { 
                        transform: translateY(-100%) skewX(0deg);
                        opacity: 0.3;
                    }
                    50% { 
                        transform: translateY(100%) skewX(2deg);
                        opacity: 0.7;
                    }
                }

                @keyframes gentleGlow {
                    0%, 100% { 
                        opacity: 0.6;
                        background: linear-gradient(45deg, 
                            ${colors.wuxiaAccent || colors.concepts}33 0%, 
                            ${colors.containerBg}1a 50%, 
                            ${colors.wuxiaAccent || colors.concepts}33 100%);
                    }
                    50% { 
                        opacity: 1;
                        background: linear-gradient(45deg, 
                            ${colors.wuxiaAccent || colors.concepts}66 0%, 
                            ${colors.containerBg}4d 50%, 
                            ${colors.wuxiaAccent || colors.concepts}66 100%);
                    }
                }
            `;

case 'playersHandbook':
    return `
        /* Navigation - Player's Handbook: Ornate chapter dividers */
        .nav-tabs {
            background: linear-gradient(135deg, 
                ${colors.navBg} 0%, 
                ${colors.headerBg} 50%, 
                ${colors.navBg} 100%);
            border-bottom: 3px double ${colors.journalAccent};
            padding: 0;
            position: relative;
            box-shadow: 
                0 2px 8px rgba(0,0,0,0.1),
                inset 0 1px 3px ${colors.containerBg}88;
        }

        /* Ornate border pattern on navigation bar */
        .nav-tabs::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: 
                /* Corner flourishes pattern */
                radial-gradient(circle at 10% 50%, ${colors.journalAccent}44 0%, transparent 15%),
                radial-gradient(circle at 90% 50%, ${colors.journalAccent}44 0%, transparent 15%),
                /* Decorative center ornament */
                radial-gradient(ellipse at 50% 50%, ${colors.journalAccent}22 0%, transparent 30%),
                /* Parchment fiber texture */
                repeating-linear-gradient(
                    47deg,
                    transparent,
                    transparent 3px,
                    ${colors.textMuted}11 3px,
                    ${colors.textMuted}11 4px
                ),
                repeating-linear-gradient(
                    133deg,
                    transparent,
                    transparent 2px,
                    ${colors.textMuted}08 2px,
                    ${colors.textMuted}08 3px
                );
            pointer-events: none;
            z-index: 1;
        }

        /* Individual chapter tabs */
        .nav-tab {
            background: linear-gradient(135deg, 
                ${colors.headerBg} 0%, 
                ${colors.navBg} 50%, 
                ${colors.headerBg} 100%);
            color: ${colors.navText};
            border: 2px solid ${colors.textMuted}44;
            border-bottom: none;
            border-top-color: ${colors.journalAccent}33;
            border-radius: 8px 8px 0 0;
            padding: 12px 24px 16px;
            margin: 0 4px 0px 0;
            position: relative;
            top: 2px;
            z-index: 2;
            
            font-family: ${fonts.secondary};
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            
            cursor: pointer;
            transition: all 0.2s ease;
            overflow: hidden;
            box-shadow: 
                0 2px 6px ${colors.textMuted}33,
                inset 0 1px 2px ${colors.containerBg}aa;
        }

        /* Ornate corner decorations on each tab */
        .nav-tab::before {
            content: '';
            position: absolute;
            top: 2px; left: 8px;
            color: ${colors.journalAccent}66;
            font-size: 10px;
            z-index: 3;
            transition: all 0.2s ease;
        }

        .nav-tab::after {
            content: '❖';
            position: absolute;
            top: 2px; right: 8px;
            color: ${colors.journalAccent}66;
            font-size: 10px;
            z-index: 3;
            transition: all 0.2s ease;
        }

        /* Hover state - like turning to a chapter */
        .nav-tab:hover:not(.active) {
            background: linear-gradient(135deg, 
                ${colors.navBg} 0%, 
                ${colors.containerBg} 50%, 
                ${colors.headerBg} 100%);
            color: ${colors.textPrimary};
            border-top-color: ${colors.journalAccent}66;
            border-left-color: ${colors.journalAccent}44;
            border-right-color: ${colors.journalAccent}44;
            box-shadow: 
                0 4px 12px ${colors.textMuted}44,
                inset 0 1px 3px ${colors.containerBg}cc;
        }

        .nav-tab:hover:not(.active)::before,
        .nav-tab:hover:not(.active)::after {
            color: ${colors.journalAccent};
            transform: scale(1.1);
        }

        /* Active state - like the current open chapter */
        .nav-tab.active {
            background: linear-gradient(135deg, 
                ${colors.containerBg} 0%, 
                ${colors.navBg} 30%, 
                ${colors.containerBg} 100%);
            color: ${colors.textPrimary};
            border-top-color: ${colors.journalAccent};
            border-left-color: ${colors.journalAccent};
            border-right-color: ${colors.journalAccent};
            border-bottom: 2px solid ${colors.containerBg};
            margin-bottom: 0px;
            
            font-weight: 700;
            text-shadow: 0 1px 2px ${colors.containerBg}bb;
            box-shadow: 
                0 -2px 8px ${colors.journalAccent}44,
                0 4px 16px ${colors.textMuted}55,
                inset 0 1px 4px ${colors.containerBg}dd,
                inset 0 -1px 2px ${colors.journalAccent}33;
        }

        .nav-tab.active::before,
        .nav-tab.active::after {
            color: ${colors.journalAccent};
            text-shadow: 0 0 4px ${colors.journalAccent}88;
            transform: scale(1.2);
        }

        /* Illuminated manuscript style underline for active tab */
        .nav-tab.active {
            position: relative;
        }

        .nav-tab.active::before {
            content: '◆❖◆';
            position: absolute;
            bottom: -8px; left: 50%;
            transform: translateX(-50%) scale(1);
            color: ${colors.journalAccent};
            font-size: 8px;
            text-shadow: 0 0 6px ${colors.journalAccent}66;
            z-index: 4;
        }
    `;

        case 'adventurersTome':
            return `
                /* Navigation - Classic Fantasy, Adventurer's Tome style (v7 - Final) */

                /* The main navigation bar has the wood texture */
                .nav-tabs {
                    /* --- WOOD TEXTURE EFFECT --- */
                    background:
                        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 3px),
                        linear-gradient(88deg, rgba(0,0,0,0.15) 50%, transparent 50%),
                        linear-gradient(92deg, rgba(255,255,255,0.05) 50%, transparent 50%),
                        linear-gradient(to right, ${colors.navHover}, ${colors.navBg});
                    background-size: 100% 100%, 50px 100%, 70px 100%, 100% 100%;

                    padding: 10px 15px 0;
                    border-bottom: 2px solid ${colors.textMuted};
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                }

                /* Default Tab Style: Worn leather button */
                .nav-tab {
                    background: linear-gradient(to bottom, ${colors.navHover}, ${colors.navBg});
                    color: ${colors.navText};
                    border: 1px solid rgba(0,0,0,0.5);
                    border-bottom: none;
                    border-radius: 6px 6px 0 0;
                    padding: 10px 20px;
                    margin: 0 4px 0 0;
                    position: relative;
                    top: 1px;
                    
                    font-family: ${fonts.accent}, serif;
                    font-weight: 600;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
                    box-shadow: inset 0 1px 2px rgba(255,255,255,0.1);

                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                }

                /* Hover on Non-Active Tab: Darkens slightly using a flicker-free gradient */
                .nav-tab:hover:not(.active) {
                    background: linear-gradient(to bottom, ${colors.navBg}, ${colors.textMuted});
                }

                /* Active Tab: Lightens and connects to the page */
                .nav-tab.active {
                    /* --- THE FINAL FIX IS HERE --- */
                    /* Using a gradient of the same color prevents the animation flicker. */
                    background: linear-gradient(to bottom, ${colors.navActive}, ${colors.navActive});
                    
                    color: ${colors.textMuted};
                    text-shadow: none;
                    
                    border-color: ${colors.textMuted};
                    border-bottom-color: ${colors.navActive};
                    margin-bottom: -2px;
                }
            `;

        case 'cartographersTable':
            return `
                /* Navigation - Cartographer's Table */
                .nav-tabs {
                    background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), ${colors.navBg};
                    padding: 10px 20px 0;
                    border-bottom: 3px solid ${colors.bodyBg};
                    box-shadow: inset 0 2px 8px rgba(0,0,0,0.4);
                    display: flex;
                    gap: 15px;
                    align-items: flex-end;
                }

                .nav-tab {
                    background: ${colors.containerBg};
                    color: ${colors.textSecondary};
                    border: 1px solid ${colors.textMuted}66;
                    border-bottom: none;
                    padding: 12px 22px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s ease-out;
                    font-family: ${fonts.secondary};
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 2px 0 8px rgba(0,0,0,0.3);
                    /* Torn paper effect */
                    border-radius: 4px 6px 0 0;
                    clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 100%);
                }

                .nav-tab:hover:not(.active) {
                    transform: translateY(-3px);
                    background: ${colors.headerBg};
                    color: ${colors.textPrimary};
                    border-color: ${colors.textMuted};
                    box-shadow: 4px -2px 12px rgba(0,0,0,0.3);
                }

                .nav-tab.active {
                    background: ${colors.containerBg};
                    color: ${colors.journalAccent};
                    border-color: ${colors.journalAccent};
                    border-top: 3px solid ${colors.journalAccent};
                    padding-top: 10px;
                    transform: translateY(1px);
                }

                /* Dotted path leading to the active tab */
                .nav-tab.active::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 0;
                    right: 0;
                    height: 5px;
                    background-image: radial-gradient(${colors.journalAccent} 30%, transparent 40%);
                    background-size: 8px 8px;
                    background-position: center;
                    opacity: 0.8;
                }
            `;

        case 'royalBanner':
            return `
                /* Navigation - Royal Banner */
                .nav-tabs {
                    background: transparent;
                    border-bottom: 2px solid ${colors.textMuted}44;
                    padding: 15px 20px 0;
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }

                .nav-tab {
                    background: ${colors.headerBg};
                    color: ${colors.textSecondary};
                    border: 1px solid ${colors.textMuted}33;
                    border-bottom: none;
                    padding: 15px 30px 25px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    font-size: 14px;
                    /* Banner Shape */
                    clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }

                .nav-tab:hover:not(.active) {
                    background: ${colors.containerBg};
                    color: ${colors.textPrimary};
                    border-color: ${colors.textMuted}66;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }

                .nav-tab.active {
                    background: ${colors.navActive};
                    color: ${colors.navActiveText};
                    border-color: ${colors.journalAccent};
                    border-top: 2px solid ${colors.journalAccent};
                    padding-top: 13px;
                }

                /* UPDATED: Base style for the Royal Seal / Crest */
                .nav-tab.active::after {
                    font-family: "Font Awesome 5 Free", "Font Awesome 6 Free", sans-serif;
                    font-weight: 900;
                    position: absolute;
                    bottom: 3px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 20px;
                    background: ${colors.journalAccent};
                    border-radius: 50%;
                    color: ${colors.navActiveText};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    line-height: 1;
                    box-shadow: 1px 1px 3px rgba(0,0,0,0.4), inset 0 0 2px ${colors.containerBg}44;
                    border: 1px solid ${colors.journalAccent};
                    z-index: 1;
                }

                /* UPDATED: Unique crest for each active banner */
                .nav-tab[data-page="overview"].active::after { content: "\\f521"; }
                .nav-tab[data-page="world"].active::after { content: "\\f14e"; } 
                .nav-tab[data-page="characters"].active::after { content: "\\f132"; } 
                .nav-tab[data-page="storylines"].active::after { content: "\\f02d"; }
                .nav-tab[data-page="plans"].active::after { content: "\\f441"; } 
                .nav-tab[data-page="playlists"].active::after { content: "\\f569"; } 
            `;

        case 'steppingStones':
            return `
                /* Navigation - Whispering Stones */
                .nav-container {
                    position: relative;
                }

                .nav-tabs {
                    position: absolute;
                    left: -40px;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    background: transparent;
                    z-index: 200;
                    gap: 15px;
                }

                .nav-tab {
                    width: 50px;
                    height: 50px;
                    background: ${colors.navBg};
                    color: transparent; /* Hide button text */
                    border: 2px solid ${colors.textMuted}55;
                    cursor: pointer;
                    transition: all 0.4s ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /* Irregular stone shape */
                    border-radius: 40% 60% 45% 55% / 50% 55% 45% 50%;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
                }

                /* Rune Icons */
                .nav-tab::before {
                    font-family: "Font Awesome 5 Free", "Font Awesome 6 Free", sans-serif;
                    font-weight: 900;
                    font-size: 18px;
                    color: ${colors.textMuted};
                    transition: all 0.4s ease;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                }
                
                .nav-tab[data-page="overview"]::before { content: "\\f06e"; } /* Eye */
                .nav-tab[data-page="world"]::before { content: "\\f57d"; } /* Mountain */
                .nav-tab[data-page="characters"]::before { content: "\\f0c0"; } /* Users */
                .nav-tab[data-page="storylines"]::before { content: "\\f518"; } /* Feather */
                .nav-tab[data-page="plans"]::before { content: "\\f185"; } /* Sun */
                .nav-tab[data-page="playlists"]::before { content: "\\f7a6"; } /* Leaf */

                .nav-tab:hover:not(.active) {
                    border-color: ${colors.navText};
                    transform: translateX(-5px) rotate(-5deg) scale(1.1);
                }
                
                .nav-tab:hover:not(.active)::before {
                    color: ${colors.navText};
                }

                .nav-tab.active {
                    background: ${colors.navHover};
                    color: ${colors.navText};
                    border-color: ${colors.concepts};
                    transform: translateX(-2px) scale(1.05);
                    /* Inner glow effect */
                    box-shadow: inset 0 0 15px ${colors.concepts}aa, 0 0 20px ${colors.concepts}88;
                }

                .nav-tab.active::before {
                    color: ${colors.concepts};
                    text-shadow: 0 0 10px ${colors.concepts};
                }
            `;

        case 'starforged':
            return `
                /* Navigation - Starforged Path */
                .nav-tabs {
                    background: transparent;
                    border-bottom: 1px solid ${colors.journalAccent}33;
                    padding: 20px 30px;
                    display: flex;
                    justify-content: center;
                    gap: 50px;
                    position: relative;
                }

                /* Faint starfield background */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-image: radial-gradient(${colors.textMuted}22 1px, transparent 1px);
                    background-size: 25px 25px;
                    opacity: 0.5;
                }

                .nav-tab {
                    background: transparent;
                    border: none;
                    color: ${colors.textSecondary};
                    font-family: ${fonts.accent};
                    font-size: 15px;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    padding: 10px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s ease;
                }

                /* The star/node */
                .nav-tab::before {
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: -15px;
                    transform: translateX(-50%);
                    width: 8px;
                    height: 8px;
                    background: ${colors.textMuted}88;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                /* The connecting constellation line */
                .nav-tab:not(:last-child)::after {
                    content: '';
                    position: absolute;
                    right: -50px; /* gap distance */
                    bottom: -11px;
                    height: 2px;
                    width: 50px; /* gap distance */
                    background: ${colors.journalAccent}55;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }

                .nav-tab:hover:not(.active) {
                    color: ${colors.textPrimary};
                }

                /* When any tab is active, show all constellation lines */
                .nav-tab.active ~ .nav-tab::after,
                .nav-tab.active::after {
                    opacity: 1;
                }
                
                .nav-tab.active {
                    color: ${colors.journalAccent};
                    text-shadow: 0 0 12px ${colors.journalAccent}88;
                }

                /* Make the active star glow brightly */
                .nav-tab.active::before {
                    background: ${colors.journalAccent};
                    box-shadow: 0 0 12px 4px ${colors.journalAccent}66;
                    transform: translateX(-50%) scale(1.5);
                }
            `;
        case 'horrific':
            return `
                /* Navigation - Horrific: Cursed Grimoire Tabs */
                .nav-tabs {
                    background: linear-gradient(135deg, ${colors.navBg} 0%, ${colors.headerBg} 100%);
                    border-bottom: 3px solid ${colors.journalAccent};
                    padding: 0;
                    position: relative;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.6), 
                                inset 0 -2px 6px ${colors.journalAccent}44;
                }

                /* Ominous texture overlay on navigation bar */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        radial-gradient(circle at 20% 30%, ${colors.journalAccent}22 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, ${colors.journalAccent}18 0%, transparent 40%),
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 25px,
                            rgba(0,0,0,0.05) 25px,
                            rgba(0,0,0,0.05) 26px
                        );
                    pointer-events: none;
                    z-index: 1;
                }

                /* Individual tabs - like torn grimoire pages */
                .nav-tab {
                    background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.navBg} 100%) !important;
                    color: ${colors.navText} !important;
                    border: 1px solid ${colors.textMuted}66;
                    border-bottom: none;
                    border-top: 2px solid transparent;
                    border-radius: 8px 8px 0 0;
                    padding: 15px 25px 18px;
                    margin: 0 3px 0 0;
                    position: relative;
                    top: 2px;
                    z-index: 2;
                    
                    font-family: ${fonts.secondary};
                    font-weight: 500;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
                    
                    cursor: pointer;
                    transition: all 0.2s ease; /* Reduced from 0.3s to reduce jumpiness */
                    overflow: hidden;
                    opacity: 1 !important;
                }

                /* Torn paper effect on tabs */
                .nav-tab::before {
                    content: '';
                    position: absolute;
                    bottom: -2px; left: 0;
                    width: 100%; height: 4px;
                    background: repeating-linear-gradient(
                        90deg,
                        transparent 0px,
                        transparent 3px,
                        ${colors.navBg} 3px,
                        ${colors.navBg} 6px,
                        transparent 6px,
                        transparent 9px,
                        ${colors.navBg} 9px,
                        ${colors.navBg} 12px
                    );
                    z-index: 3;
                }

                /* FontAwesome horror icons for each tab */
                .nav-tab::after {
                    content: "\\f06e"; /* Default eye icon */
                    font-family: "Font Awesome 5 Free", "Font Awesome 6 Free", ${fonts.ui};
                    font-weight: 900;
                    position: absolute;
                    top: 3px; right: 8px;
                    color: ${colors.journalAccent};
                    font-size: 12px;
                    opacity: 0.8; /* More visible than before */
                    text-shadow: 0 0 6px ${colors.journalAccent}66;
                    z-index: 4;
                    transition: all 0.2s ease;
                }

                /* Different horror icons for each tab */
                .nav-tab:nth-child(1)::after { content: "\\f06e"; } /* Overview - eye */
                .nav-tab:nth-child(2)::after { content: "\\f571"; } /* World - skull crossbones */
                .nav-tab:nth-child(3)::after { content: "\\f714"; } /* Characters - user injured */
                .nav-tab:nth-child(4)::after { content: "\\f5fc"; } /* Storylines - book dead */
                .nav-tab:nth-child(5)::after { content: "\\f728"; } /* Plans - clipboard check (with horror theme) */
                .nav-tab:nth-child(6)::after { content: "\\f001"; } /* Playlists - music note (haunting melodies) */

                /* Hover state - like flickering candlelight */
                .nav-tab:hover:not(.active) {
                    background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.textMuted}44 100%) !important;
                    color: ${colors.textSecondary} !important;
                    border-top-color: ${colors.journalAccent};
                    text-shadow: 0 0 8px ${colors.journalAccent}77;
                    transform: translateY(0px);
                    box-shadow: 0 3px 12px rgba(0,0,0,0.4);
                    opacity: 1 !important;
                }

                .nav-tab:hover:not(.active)::after {
                    opacity: 1;
                    color: ${colors.journalAccent};
                    text-shadow: 0 0 10px ${colors.journalAccent}88;
                    animation: subtleFlicker 1.5s infinite alternate; /* Slower, less jumpy */
                }

                /* Active tab - like a burning page */
                .nav-tab.active {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.headerBg} 100%);
                    color: ${colors.textPrimary};
                    border-top-color: ${colors.journalAccent};
                    border-left-color: ${colors.journalAccent};
                    border-right-color: ${colors.journalAccent};
                    margin-bottom: -3px;
                    transform: translateY(-2px);
                    
                    text-shadow: 0 0 6px ${colors.textPrimary}55;
                    box-shadow: 
                        0 -3px 15px ${colors.journalAccent}55,
                        0 5px 20px rgba(0,0,0,0.5),
                        inset 0 1px 3px ${colors.textPrimary}22;
                }

                .nav-tab.active::before {
                    background: ${colors.containerBg}; /* Hide torn effect on active */
                }

                .nav-tab.active::after {
                    color: ${colors.journalAccent};
                    opacity: 1;
                    text-shadow: 0 0 15px ${colors.journalAccent}cc; /* More visible glow */
                    animation: gentlePulse 2s ease-in-out infinite; /* Smoother animation */
                }

                /* Subtle flickering animation for hover symbols - less jumpy */
                @keyframes subtleFlicker {
                    0% { opacity: 0.7; text-shadow: 0 0 6px ${colors.journalAccent}66; }
                    50% { opacity: 1; text-shadow: 0 0 12px ${colors.journalAccent}88; }
                    100% { opacity: 0.9; text-shadow: 0 0 8px ${colors.journalAccent}77; }
                }

                /* Gentle pulsing glow for active tab symbol - smoother */
                @keyframes gentlePulse {
                    0%, 100% { 
                        text-shadow: 0 0 10px ${colors.journalAccent}88;
                        transform: scale(1);
                    }
                    50% { 
                        text-shadow: 0 0 18px ${colors.journalAccent}cc;
                        transform: scale(1.05); /* Less dramatic scaling */
                    }
                }
            `;

        case 'foundFootage':
            return `
                /* Navigation - Found Footage: Glitchy camcorder UI */
                .nav-tabs {
                    background: ${colors.nagBg}; /* Black for camcorder screen */
                    border-bottom: none;
                    padding: 5px 15px;
                    position: relative;
                    overflow: hidden;
                    border-top: 1px solid ${colors.textMuted}44;
                    border-bottom: 1px solid ${colors.textMuted}44;
                }

                /* Scanline Overlay */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: repeating-linear-gradient(0deg, transparent, transparent 2px, ${colors.navBg}99 2px, ${colors.navBg}99 3px);
                    opacity: 0.3;
                    pointer-events: none;
                    z-index: 1;
                }

                .nav-tab {
                    background: transparent;
                    color: ${colors.textSecondary};
                    border: none;
                    padding: 10px 15px;
                    margin: 0;
                    position: relative;
                    z-index: 2;
                    
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    font-size: 14px;
                    text-transform: uppercase;
                    
                    cursor: pointer;
                    transition: none; /* No smooth transition for this style */
                    white-space: nowrap; /* THE FIX: Prevents text from wrapping on longer tab labels */
                }

                /* PLAY icon on inactive tabs */
                .nav-tab::before {
                    content: '▶';
                    margin-right: 8px;
                    color: ${colors.textMuted};
                    transition: all 0.2s ease;
                }

                .nav-tab:hover:not(.active) {
                    color: ${colors.textPrimary};
                    animation: textFlicker 0.2s infinite;
                }

                .nav-tab:hover:not(.active)::before {
                    color: ${colors.textPrimary};
                }

                .nav-tab.active {
                    color: ${colors.navActiveText};
                }

                /* REC icon on active tab */
                .nav-tab.active::before {
                    content: '● REC';
                    color: ${colors.journalAccent};
                    text-shadow: 0 0 8px ${colors.journalAccent}aa;
                    animation: recBlink 1.5s infinite;
                }

                @keyframes recBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }

                @keyframes textFlicker {
                    0% { opacity: 1; }
                    50% { opacity: 0.8; transform: translate(1px, -1px); }
                    100% { opacity: 1; }
                }
            `;

        case 'cursedVHS':
            return `
                /* Navigation - Cursed V/H/S: Analog horror tape */
                .nav-tabs {
                    background: ${colors.navBg};
                    border-bottom: 2px solid ${colors.textMuted}44;
                    padding: 15px 20px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    animation: bgFlicker 8s infinite linear;
                }

                /* Analog static/noise overlay */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: -10%; left: -10%;
                    width: 120%; height: 120%;
                    background: 
                        repeating-linear-gradient(0deg, ${colors.textMuted}11, ${colors.textMuted}11 1px, transparent 1px, transparent 4px),
                        repeating-linear-gradient(90deg, ${colors.textMuted}22, ${colors.textMuted}22 1px, transparent 1px, transparent 3px);
                    opacity: 0.3;
                    animation: vhsStatic 0.15s infinite;
                    pointer-events: none;
                }

                .nav-tab {
                    background: transparent;
                    color: ${colors.textSecondary};
                    border: 1px solid ${colors.textMuted}33;
                    padding: 10px 20px;
                    position: relative;
                    
                    font-family: ${fonts.accent}, sans-serif;
                    font-weight: 400;
                    font-size: 15px;
                    text-transform: uppercase;
                    
                    cursor: pointer;
                    transition: all 0.3s ease;
                    animation: textWarp 5s infinite alternate;
                }

                .nav-tab:hover:not(.active) {
                    color: ${colors.textPrimary};
                    background: ${colors.headerBg}44;
                    border-color: ${colors.textPrimary};
                }

                .nav-tab.active {
                    color: ${colors.journalAccent};
                    border-color: ${colors.journalAccent};
                    background: ${colors.journalAccent}11;
                    text-shadow: 0 0 10px ${colors.journalAccent}88;
                    animation: textWarpActive 3s infinite alternate;
                    /* Unsettling "hair" shadow */
                    box-shadow: 
                        0 0 1px 1px ${colors.journalAccent}44,
                        0 0 1px 3px ${colors.navBg},
                        0 0 1px 4px ${colors.journalAccent}44;
                }

                @keyframes bgFlicker {
                    0%, 49%, 51%, 100% { filter: brightness(1); }
                    50% { filter: brightness(0.8); }
                }

                @keyframes vhsStatic {
                    0% { transform: translate(0,0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(2px, -2px); }
                    60% { transform: translate(-2px, -2px); }
                    80% { transform: translate(2px, 2px); }
                    100% { transform: translate(0,0); }
                }

                @keyframes textWarp {
                    0%, 100% { transform: skewX(-2deg) scale(1.0); letter-spacing: 0px; }
                    50% { transform: skewX(2deg) scale(1.01); letter-spacing: 0.5px; }
                }
                @keyframes textWarpActive {
                    0%, 100% { transform: skewX(-3deg) scale(1.02); letter-spacing: 0.5px; }
                    33% { transform: skewX(3deg) scale(1.0); letter-spacing: 0px; }
                    66% { transform: skewX(-1deg) scale(1.03); letter-spacing: 1px; }
                }
            `;

        case 'theFurther':
            return `
                /* Navigation - The Further: Ethereal, ghostly tabs */
                .nav-tabs {
                    background: transparent;
                    border-bottom: 1px solid ${colors.textMuted}22;
                    padding: 25px;
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    position: relative;
                }

                /* Smoky/foggy background effect */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: radial-gradient(ellipse at 50% 50%, ${colors.navBg}99 0%, transparent 70%);
                    opacity: 0.5;
                    animation: slowFog 15s infinite alternate ease-in-out;
                    pointer-events: none;
                }

                .nav-tab {
                    background: transparent;
                    color: ${colors.textSecondary};
                    border: none;
                    padding: 10px;
                    position: relative;
                    
                    font-family: ${fonts.primary};
                    font-weight: 300;
                    font-size: 16px;
                    
                    cursor: pointer;
                    transition: all 0.5s ease-in-out;
                    opacity: 0.8;
                    text-shadow: 0 0 5px ${colors.navBg};
                }

                .nav-tab:hover:not(.active) {
                    color: ${colors.textPrimary};
                    opacity: 1;
                    transform: translateY(-3px) scale(1.03);
                    text-shadow: 0 0 8px ${colors.textPrimary}66;
                }

                .nav-tab.active {
                    color: ${colors.journalAccent};
                    opacity: 1;
                    transform: scale(1.05);
                    text-shadow: 
                        0 0 8px ${colors.journalAccent},
                        0 0 15px ${colors.journalAccent},
                        0 0 25px ${colors.journalAccent}88;
                    animation: ghostGlow 4s infinite alternate ease-in-out;
                }

                /* Fading line under active tab */
                .nav-tab.active::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, ${colors.journalAccent}, transparent);
                    animation: fadeIn 2s ease-in-out;
                }


                @keyframes slowFog {
                    from { transform: scale(1); opacity: 0.5; }
                    to { transform: scale(1.2); opacity: 0.8; }
                }

                @keyframes ghostGlow {
                    from {
                        text-shadow: 
                            0 0 8px ${colors.journalAccent},
                            0 0 15px ${colors.journalAccent},
                            0 0 25px ${colors.journalAccent}88;
                    }
                    to {
                        text-shadow: 
                            0 0 12px ${colors.journalAccent},
                            0 0 25px ${colors.journalAccent},
                            0 0 40px ${colors.journalAccent}aa;
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;            

        case 'parchment':
            return `
                /* Navigation - Parchment&Quill: Elegant Regency Letters */
                .nav-tabs {
                    background: transparent;
                    padding: 15px 20px 0;
                    border-bottom: none;
                    position: relative;
                    margin-bottom: 0px;
                }

                /* Add a subtle parchment texture to the navigation area */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        /* Subtle paper fiber texture */
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 1px,
                            ${colors.textMuted}33 1px,
                            ${colors.textMuted}33 2px
                        ),
                        /* Gentle aging gradient */
                        linear-gradient(135deg, 
                            ${colors.bodyBg}55 0%, 
                            ${colors.headerBg}44 50%,
                            ${colors.bodyBg}22 100%);
                    pointer-events: none;
                    z-index: 1;
                }

                .nav-tab {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.bodyBg} 50%, 
                        ${colors.headerBg} 100%);
                    color: ${colors.textSecondary};
                    border: 1px solid ${colors.textMuted}44;
                    border-bottom: 1px solid ${colors.textMuted}44; /* CHANGE: Always have bottom border */
                    border-radius: 12px 12px 0 0;
                    padding: 12px 24px 16px;
                    margin: 0 6px 0 0;
                    position: relative;
                    top: 0;
                    z-index: 2;
                    
                    font-family: ${fonts.primary};
                    font-weight: 400;
                    font-size: 14px;
                    letter-spacing: 0.8px;
                    text-transform: lowercase;
                    font-variant: small-caps;
                    
                    cursor: pointer;
                    transition: background 0.2s ease, color 0.2s ease; /* CHANGE: Only transition safe properties */
                    box-shadow: 
                        0 2px 6px ${colors.textMuted}22,    /* SIMPLIFIED: Less complex shadow */
                        inset 0 1px 2px ${colors.containerBg}dd;
                    overflow: hidden;
                }

                /* Letter fold crease effect */
                .nav-tab::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 30%;
                    width: 40%; height: 2px;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        ${colors.textMuted}33 50%, 
                        transparent 100%);
                    z-index: 1;
                }

                /* Hover state - like lifting a letter delicately */
                /* Hover state - like lifting a letter delicately */
                .nav-tab:hover:not(.active) {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.containerBg}ee 50%, 
                        ${colors.bodyBg} 100%);
                    color: ${colors.textPrimary};
                    box-shadow: 
                        0 6px 16px ${colors.textMuted}44,
                        0 4px 15px rgba(139,69,19,0.12),    /* ADD THIS LINE - the glow effect */
                        inset 0 1px 3px ${colors.containerBg}ee;
                    border-color: ${colors.textMuted}66;
                }

                /* Active state - like an opened, important letter */
                .nav-tab.active {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%,           /* CHANGE: Back to containerBg for consistency */
                        ${colors.containerBg}ee 30%,        /* CHANGE: Back to containerBg */
                        ${colors.headerBg}dd 100%);         /* Keep some headerBg for depth */
                    color: ${colors.textPrimary};
                    border-color: ${colors.textMuted}77;
                    border-bottom: 1px solid ${colors.containerBg}; /* CHANGE: Match container exactly */
                    /* REMOVE: margin-bottom: -1px; */     /* ← Remove this line completely */
                    /* REMOVE: transform: translateY(-1px); */ /* ← Remove this line completely */
                    
                    font-weight: 500;
                    text-shadow: 0 1px 2px ${colors.containerBg}dd;
                    box-shadow: 
                        0 2px 8px ${colors.textMuted}33,    /* SIMPLIFIED: Reduce complexity */
                        inset 0 1px 3px ${colors.containerBg}ee; /* SIMPLIFIED: Remove multiple shadows */
                }

                /* More pronounced fold crease on active tab */
                .nav-tab.active::after {
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        ${colors.textMuted}55 50%, 
                        transparent 100%);
                    height: 3px;
                }

                /* Elegant paper shadow beneath all tabs */
                .nav-tabs::after {
                    content: '';
                    position: absolute;
                    bottom: -5px; left: 10px;
                    right: 10px; height: 3px;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        ${colors.textMuted}22 50%, 
                        transparent 100%);
                    border-radius: 50%;
                    z-index: 0;
                }
            `;

        case 'cyberpunk':
            return `
                /* Navigation - Cyberpunk: Neon holographic terminal tabs */
                .nav-tabs {
                    background: linear-gradient(135deg, 
                        ${colors.navBg} 0%, 
                        ${colors.headerBg} 100%);
                    border-bottom: 2px solid ${colors.journalAccent};
                    padding: 0;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 0 20px ${colors.journalAccent}33;
                }

                /* Animated scanning line effect */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        ${colors.journalAccent}44 50%, 
                        transparent 100%);
                    animation: scanLine 3s infinite;
                    pointer-events: none;
                    z-index: 1;
                }

                .nav-tab {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.navBg} 100%);
                    color: ${colors.navText};
                    border: 1px solid ${colors.journalAccent}66;
                    border-bottom: none;
                    border-radius: 0;
                    padding: 15px 25px;
                    margin: 0 2px 0 0;
                    position: relative;
                    z-index: 2;
                    
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    
                    cursor: pointer;
                    transition: all 0.3s ease;
                    overflow: hidden;
                    
                    /* Neon text glow */
                    text-shadow: 0 0 10px ${colors.journalAccent}66;
                    
                    /* Circuit pattern overlay */
                    background-image: 
                        repeating-linear-gradient(45deg, 
                            transparent, 
                            transparent 2px, 
                            ${colors.journalAccent}11 2px, 
                            ${colors.journalAccent}11 4px);
                }

                /* Holographic corner brackets */
                .nav-tab::before {
                    content: '◤';
                    position: absolute;
                    top: 2px; left: 4px;
                    color: ${colors.journalAccent};
                    font-size: 12px;
                    opacity: 0.7;
                    transition: all 0.3s ease;
                }

                .nav-tab::after {
                    content: '◥';
                    position: absolute;
                    top: 2px; right: 4px;
                    color: ${colors.journalAccent};
                    font-size: 12px;
                    opacity: 0.7;
                    transition: all 0.3s ease;
                }

                .nav-tab:hover:not(.active) {
                    background: linear-gradient(135deg, 
                        ${colors.navBg} 0%, 
                        ${colors.headerBg} 100%);
                    color: ${colors.textPrimary};
                    border-color: ${colors.journalAccent};
                    
                    /* Enhanced neon glow on hover */
                    text-shadow: 0 0 15px ${colors.journalAccent}aa;
                    box-shadow: 
                        0 0 15px ${colors.journalAccent}44,
                        inset 0 0 15px ${colors.journalAccent}22;
                }

                .nav-tab:hover:not(.active)::before,
                .nav-tab:hover:not(.active)::after {
                    color: ${colors.journalAccent};
                    opacity: 1;
                    text-shadow: 0 0 8px ${colors.journalAccent};
                }

                .nav-tab.active {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}22 0%, 
                        ${colors.navActive} 100%);
                    color: ${colors.navActiveText};
                    border-color: ${colors.journalAccent};
                    
                    /* Strong neon glow for active state */
                    text-shadow: 0 0 20px ${colors.journalAccent}cc;
                    box-shadow: 
                        0 0 25px ${colors.journalAccent}66,
                        inset 0 0 20px ${colors.journalAccent}33,
                        0 4px 15px rgba(0,0,0,0.3);
                }

                .nav-tab.active::before,
                .nav-tab.active::after {
                    color: ${colors.journalAccent};
                    opacity: 1;
                    text-shadow: 0 0 12px ${colors.journalAccent};
                    animation: hologramFlicker 2s infinite alternate;
                }

                @keyframes scanLine {
                    0% { left: -100%; }
                    50% { left: 100%; }
                    100% { left: -100%; }
                }

                @keyframes hologramFlicker {
                    0% { opacity: 0.8; }
                    50% { opacity: 1; }
                    100% { opacity: 0.9; }
                }
            `;

        case 'holographic':
            return `
                /* Navigation - Holographic: Iridescent shifting tabs */
                .nav-tabs {
                    background: linear-gradient(135deg, 
                        ${colors.navBg} 0%, 
                        ${colors.headerBg} 100%);
                    border-bottom: 1px solid ${colors.textMuted}44;
                    padding: 10px 20px 0;
                    position: relative;
                }

                .nav-tab {
                    background: linear-gradient(45deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.headerBg} 25%, 
                        ${colors.containerBg} 50%, 
                        ${colors.headerBg} 75%, 
                        ${colors.containerBg} 100%);
                    background-size: 200% 200%;
                    color: ${colors.navText};
                    border: 2px solid transparent;
                    border-radius: 12px 12px 0 0;
                    padding: 12px 24px;
                    margin: 0 4px 0 0;
                    position: relative;
                    
                    font-family: ${fonts.ui};
                    font-weight: 500;
                    font-size: 14px;
                    
                    cursor: pointer;
                    transition: all 0.4s ease;
                    overflow: hidden;
                    
                    /* Holographic border gradient */
                    background-clip: padding-box;
                    border-image: linear-gradient(45deg, 
                        ${colors.journalAccent} 0%, 
                        ${colors.textSecondary} 25%, 
                        ${colors.concepts} 50%, 
                        ${colors.factions} 75%, 
                        ${colors.journalAccent} 100%) 1;
                }

                /* Prismatic shimmer effect */
                .nav-tab::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(255,255,255,0.3) 50%, 
                        transparent 100%);
                    transition: left 0.6s ease;
                    z-index: 1;
                }

                .nav-tab:hover:not(.active) {
                    background-position: 100% 100%;
                    color: ${colors.textPrimary};
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px ${colors.textMuted}44;
                    
                    /* Shift the holographic colors */
                    border-image: linear-gradient(45deg, 
                        ${colors.concepts} 0%, 
                        ${colors.factions} 25%, 
                        ${colors.journalAccent} 50%, 
                        ${colors.textSecondary} 75%, 
                        ${colors.concepts} 100%) 1;
                }

                .nav-tab:hover:not(.active)::before {
                    left: 100%;
                }

                .nav-tab.active {
                    background: linear-gradient(45deg, 
                        ${colors.navActive} 0%, 
                        ${colors.containerBg} 50%, 
                        ${colors.navActive} 100%);
                    background-size: 150% 150%;
                    color: ${colors.navActiveText};
                    transform: translateY(-1px);
                    
                    /* Active holographic border */
                    border-image: linear-gradient(45deg, 
                        ${colors.journalAccent} 0%, 
                        ${colors.concepts} 50%, 
                        ${colors.journalAccent} 100%) 1;
                    
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}33,
                        0 5px 15px ${colors.textMuted}66;
                    
                    animation: holographicShift 4s ease-in-out infinite;
                }

                .nav-tab.active::before {
                    animation: prismShimmer 3s ease-in-out infinite;
                }

                @keyframes holographicShift {
                    0%, 100% { 
                        background-position: 0% 50%;
                        border-image: linear-gradient(45deg, 
                            ${colors.journalAccent} 0%, 
                            ${colors.concepts} 50%, 
                            ${colors.journalAccent} 100%) 1;
                    }
                    50% { 
                        background-position: 100% 50%;
                        border-image: linear-gradient(45deg, 
                            ${colors.concepts} 0%, 
                            ${colors.factions} 50%, 
                            ${colors.concepts} 100%) 1;
                    }
                }

                @keyframes prismShimmer {
                    0% { left: -100%; }
                    50% { left: 100%; }
                    100% { left: -100%; }
                }
            `;

        case 'matrix':
            return `
                /* Navigation - Matrix: Digital rain terminal interface */
                .nav-container {
                    position: relative;
                }

                .nav-tabs {
                    position: absolute;
                    left: -60px;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    background: ${colors.navBg}ee;
                    margin: 0;
                    width: auto;
                    z-index: 200;
                    border: 2px solid ${colors.journalAccent}66;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 0 30px ${colors.journalAccent}44;
                }

                /* Digital rain background effect */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: repeating-linear-gradient(
                        180deg,
                        transparent 0px,
                        ${colors.journalAccent}22 1px,
                        transparent 2px,
                        transparent 10px
                    );
                    animation: digitalRain 2s linear infinite;
                    pointer-events: none;
                    z-index: 1;
                }

                .nav-tab {
                    flex: none;
                    padding: 15px 8px;
                    text-align: center;
                    color: transparent;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    font-family: 'Courier New', monospace;
                    font-size: 11px;
                    font-weight: 700;
                    margin-bottom: 2px;
                    position: relative;
                    z-index: 2;
                    
                    height: 90px;
                    width: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    
                    border-bottom: 1px solid ${colors.journalAccent}33;
                    transition: all 0.2s ease;
                    
                    /* Terminal scanlines */
                    background-image: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        ${colors.navBg}99 2px,
                        ${colors.navBg}99 4px
                    );
                }

                .nav-tab::before {
                    content: "OVERVIEW";
                    position: absolute;
                    color: ${colors.journalAccent};
                    transform: rotate(-90deg); /* FIXED: Changed from 180deg to -90deg */
                    white-space: nowrap;
                    font-family: 'Courier New', monospace;
                    font-size: 9px; /* Slightly smaller for better fit */
                    text-shadow: 0 0 10px ${colors.journalAccent}88;
                    z-index: 3;
                    letter-spacing: 1px;
                }

                .nav-tab[data-page="overview"]::before { content: "OVERVIEW"; }
                .nav-tab[data-page="world"]::before { content: "WORLD"; }
                .nav-tab[data-page="characters"]::before { content: "CHARS"; }
                .nav-tab[data-page="storylines"]::before { content: "PLOTS"; }
                .nav-tab[data-page="plans"]::before { content: "PLANS"; }
                .nav-tab[data-page="playlists"]::before { content: "MUSIC"; }

                .nav-tab:hover:not(.active) {
                    background: ${colors.journalAccent}22;
                    color: ${colors.textPrimary};
                    box-shadow: inset 0 0 20px ${colors.journalAccent}33;
                }

                .nav-tab:hover:not(.active)::before {
                    color: ${colors.textPrimary};
                    text-shadow: 0 0 15px ${colors.journalAccent}cc;
                }

                .nav-tab.active {
                    background: ${colors.journalAccent}44;
                    color: ${colors.textPrimary};
                    border-left: 4px solid ${colors.journalAccent};
                    box-shadow: 
                        inset 0 0 25px ${colors.journalAccent}44,
                        0 0 20px ${colors.journalAccent}66;
                }

                .nav-tab.active::before {
                    color: ${colors.containerBg};
                    text-shadow: 0 0 20px ${colors.journalAccent};
                    animation: terminalBlink 1.5s infinite;
                }

                @keyframes digitalRain {
                    0% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                @keyframes terminalBlink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.7; }
                }
            `;

        case 'neuralNetwork':
            return `
                /* Navigation - Neural Network: Connected node-based interface */
                .nav-tabs {
                    background: ${colors.navBg};
                    border-bottom: none;
                    padding: 30px 20px;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                }

                /* Connection lines between tabs */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 20%;
                    right: 20%;
                    height: 2px;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        ${colors.journalAccent}66 20%, 
                        ${colors.journalAccent}66 80%, 
                        transparent 100%);
                    z-index: 1;
                    animation: dataFlow 3s ease-in-out infinite;
                }

                .nav-tab {
                    background: radial-gradient(circle, 
                        ${colors.containerBg} 0%, 
                        ${colors.headerBg} 70%, 
                        ${colors.journalAccent}44 100%);
                    color: ${colors.navText};
                    border: 3px solid ${colors.journalAccent}66;
                    border-radius: 50%;
                    padding: 0;
                    margin: 0;
                    position: relative;
                    z-index: 2;
                    
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    text-align: center;
                    line-height: 1.2;
                    
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    
                    /* Neural pulse effect */
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}33,
                        inset 0 0 20px ${colors.containerBg}88;
                }

                /* Neural connection points */
                .nav-tab::before {
                    content: '';
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background: ${colors.journalAccent};
                    border-radius: 50%;
                    top: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0.7;
                    animation: neuralPulse 2s ease-in-out infinite;
                }

                .nav-tab::after {
                    content: '';
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: ${colors.journalAccent}99;
                    border-radius: 50%;
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0.5;
                    animation: neuralPulse 2s ease-in-out infinite 0.5s;
                }

                .nav-tab:hover:not(.active) {
                    background: radial-gradient(circle, 
                        ${colors.journalAccent}22 0%, 
                        ${colors.containerBg} 50%, 
                        ${colors.journalAccent}66 100%);
                    color: ${colors.textPrimary};
                    border-color: ${colors.journalAccent};
                    transform: scale(1.1);
                    
                    box-shadow: 
                        0 0 40px ${colors.journalAccent}66,
                        inset 0 0 30px ${colors.journalAccent}22;
                }

                .nav-tab:hover:not(.active)::before,
                .nav-tab:hover:not(.active)::after {
                    background: ${colors.journalAccent};
                    opacity: 1;
                    animation-duration: 1s;
                }

                .nav-tab.active {
                    background: radial-gradient(circle, 
                        ${colors.journalAccent} 0%, 
                        ${colors.journalAccent}88 30%, 
                        ${colors.containerBg} 70%, 
                        ${colors.journalAccent}44 100%);
                    color: ${colors.navActiveText};
                    border-color: ${colors.journalAccent};
                    transform: scale(1.15);
                    
                    box-shadow: 
                        0 0 50px ${colors.journalAccent}88,
                        0 0 100px ${colors.journalAccent}44,
                        inset 0 0 30px ${colors.journalAccent}33;
                    
                    animation: activeNode 3s ease-in-out infinite;
                }

                .nav-tab.active::before,
                .nav-tab.active::after {
                    background: ${colors.containerBg};
                    opacity: 1;
                    box-shadow: 0 0 10px ${colors.journalAccent};
                    animation: activeConnection 1.5s ease-in-out infinite;
                }

                @keyframes dataFlow {
                    0%, 100% { 
                        opacity: 0.3;
                        transform: scaleX(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scaleX(1.1);
                    }
                }

                @keyframes neuralPulse {
                    0%, 100% { 
                        transform: translateX(-50%) scale(1);
                        opacity: 0.5;
                    }
                    50% { 
                        transform: translateX(-50%) scale(1.3);
                        opacity: 1;
                    }
                }

                @keyframes activeNode {
                    0%, 100% { 
                        box-shadow: 
                            0 0 50px ${colors.journalAccent}88,
                            0 0 100px ${colors.journalAccent}44,
                            inset 0 0 30px ${colors.journalAccent}33;
                    }
                    50% { 
                        box-shadow: 
                            0 0 80px ${colors.journalAccent}cc,
                            0 0 150px ${colors.journalAccent}66,
                            inset 0 0 50px ${colors.journalAccent}44;
                    }
                }

                @keyframes activeConnection {
                    0%, 100% { 
                        transform: translateX(-50%) scale(1);
                        box-shadow: 0 0 10px ${colors.journalAccent};
                    }
                    50% { 
                        transform: translateX(-50%) scale(1.5);
                        box-shadow: 0 0 20px ${colors.journalAccent};
                    }
                }
            `;

        case 'glitch':
            return `
                /* Navigation - Glitch: Digital distortion and data corruption effects */
                .nav-tabs {
                    background: ${colors.navBg};
                    border-bottom: 2px solid ${colors.journalAccent}88;
                    padding: 15px 20px 0;
                    position: relative;
                    overflow: hidden;
                }

                /* Static noise background */
                .nav-tabs::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background-image: 
                        radial-gradient(circle at 25% 25%, ${colors.journalAccent}22 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, ${colors.textSecondary}11 0%, transparent 50%);
                    animation: staticNoise 0.1s infinite;
                    pointer-events: none;
                    z-index: 1;
                }

                .nav-tab {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.containerBg} 100%);
                    color: ${colors.navText};
                    border: 1px solid ${colors.textMuted}66;
                    border-bottom: none;
                    border-radius: 0;
                    padding: 12px 20px;
                    margin: 0 3px 0 0;
                    position: relative;
                    z-index: 2;
                    
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    
                    cursor: pointer;
                    transition: none; /* No smooth transitions for glitch effect */
                    overflow: hidden;
                }

                /* Glitch text effect */
                .nav-tab::before {
                    content: attr(data-page);
                    position: absolute;
                    top: 12px; left: 20px;
                    color: ${colors.journalAccent};
                    text-transform: uppercase;
                    clip: rect(0, 0, 0, 0);
                    animation: glitchTop 2s infinite linear alternate-reverse;
                }

                .nav-tab::after {
                    content: attr(data-page);
                    position: absolute;
                    top: 12px; left: 20px;
                    color: ${colors.textSecondary};
                    text-transform: uppercase;
                    clip: rect(0, 0, 0, 0);
                    animation: glitchBottom 1.5s infinite linear alternate-reverse;
                }

                .nav-tab:hover:not(.active) {
                    background: ${colors.headerBg};
                    color: ${colors.textPrimary};
                    border-color: ${colors.journalAccent}88;
                    
                    /* Intense glitch on hover */
                    animation: tabGlitch 0.3s infinite;
                }

                .nav-tab:hover:not(.active)::before {
                    animation: glitchTopIntense 0.2s infinite;
                }

                .nav-tab:hover:not(.active)::after {
                    animation: glitchBottomIntense 0.15s infinite;
                }

                .nav-tab.active {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}33 0%, 
                        ${colors.navActive} 100%);
                    color: ${colors.navActiveText};
                    border-color: ${colors.journalAccent};
                    
                    /* Persistent glitch for active tab */
                    animation: activeGlitch 3s infinite;
                }

                .nav-tab.active::before {
                    animation: glitchActiveTop 1s infinite;
                }

                .nav-tab.active::after {
                    animation: glitchActiveBottom 0.8s infinite;
                }

                @keyframes staticNoise {
                    0% { opacity: 0.03; }
                    10% { opacity: 0.08; }
                    20% { opacity: 0.02; }
                    30% { opacity: 0.1; }
                    40% { opacity: 0.01; }
                    50% { opacity: 0.06; }
                    60% { opacity: 0.04; }
                    70% { opacity: 0.09; }
                    80% { opacity: 0.03; }
                    90% { opacity: 0.07; }
                    100% { opacity: 0.02; }
                }

                @keyframes glitchTop {
                    2%, 64% { clip: rect(0, 9999px, 0, 0); }
                    4%, 60% { clip: rect(0, 9999px, 0, 0); }
                    6%, 58% { clip: rect(0, 9999px, 0, 0); }
                    8%, 56% { clip: rect(0, 9999px, 0, 0); }
                    10%, 54% { clip: rect(0, 9999px, 0, 0); }
                    12%, 52% { clip: rect(0, 9999px, 0, 0); }
                    14%, 50% { clip: rect(0, 9999px, 0, 0); }
                    16%, 48% { clip: rect(0, 9999px, 0, 0); }
                    18%, 46% { clip: rect(0, 9999px, 0, 0); }
                    20%, 44% { clip: rect(0, 9999px, 0, 0); }
                    22%, 42% { clip: rect(0, 9999px, 15px, 0); }
                }

                @keyframes glitchBottom {
                    2%, 64% { clip: rect(0, 9999px, 0, 0); }
                    4%, 60% { clip: rect(0, 9999px, 0, 0); }
                    6%, 58% { clip: rect(0, 9999px, 0, 0); }
                    8%, 56% { clip: rect(0, 9999px, 0, 0); }
                    10%, 54% { clip: rect(0, 9999px, 0, 0); }
                    12%, 52% { clip: rect(0, 9999px, 0, 0); }
                    14%, 50% { clip: rect(0, 9999px, 0, 0); }
                    16%, 48% { clip: rect(0, 9999px, 0, 0); }
                    18%, 46% { clip: rect(0, 9999px, 0, 0); }
                    20%, 44% { clip: rect(15px, 9999px, 9999px, 0); }
                    22%, 42% { clip: rect(0, 9999px, 0, 0); }
                }

                @keyframes tabGlitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }

                @keyframes glitchTopIntense {
                    0% { clip: rect(0, 9999px, 0, 0); }
                    25% { clip: rect(0, 9999px, 15px, 0); }
                    50% { clip: rect(0, 9999px, 0, 0); }
                    75% { clip: rect(10px, 9999px, 20px, 0); }
                    100% { clip: rect(0, 9999px, 0, 0); }
                }

                @keyframes glitchBottomIntense {
                    0% { clip: rect(0, 9999px, 0, 0); }
                    33% { clip: rect(15px, 9999px, 9999px, 0); }
                    66% { clip: rect(0, 9999px, 0, 0); }
                    100% { clip: rect(8px, 9999px, 9999px, 0); }
                }

                @keyframes activeGlitch {
                    0%, 90% { transform: translate(0); }
                    92% { transform: translate(-1px, 1px); }
                    94% { transform: translate(1px, -1px); }
                    96% { transform: translate(-1px, -1px); }
                    98% { transform: translate(1px, 1px); }
                    100% { transform: translate(0); }
                }

                @keyframes glitchActiveTop {
                    0%, 80% { clip: rect(0, 9999px, 0, 0); }
                    85% { clip: rect(0, 9999px, 12px, 0); }
                    90% { clip: rect(0, 9999px, 0, 0); }
                    95% { clip: rect(0, 9999px, 18px, 0); }
                    100% { clip: rect(0, 9999px, 0, 0); }
                }

                @keyframes glitchActiveBottom {
                    0%, 75% { clip: rect(0, 9999px, 0, 0); }
                    80% { clip: rect(12px, 9999px, 9999px, 0); }
                    85% { clip: rect(0, 9999px, 0, 0); }
                    90% { clip: rect(8px, 9999px, 9999px, 0); }
                    95% { clip: rect(0, 9999px, 0, 0); }
                    100% { clip: rect(15px, 9999px, 9999px, 0); }
                }
            `;

        default:
            return '';
    }
}

// Make functions globally available
export { generateNavigationStyles };
export default navigationStyles;