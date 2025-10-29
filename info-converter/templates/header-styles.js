// Page Header Styles Generation - Fixed
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

function generatePageHeaderStyles(pageHeaderStyle, colors, fonts) {
    switch (pageHeaderStyle) {
        case 'minimal':
            return `
                /* Minimal Page Headers - Clean and understated */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.secondary};
                    font-weight: 400;
                    font-size: 1.3em;
                    color: ${colors.textSecondary};
                    border: none;
                    padding-bottom: 6px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid ${colors.textMuted}40;
                    scroll-margin-top: 120px;
                }

                /* Minimal Section Headers with Tabs */
                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid ${colors.textMuted}30;
                    padding-bottom: 6px;
                }

                /* Remove border from section-title in minimal headers */
                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    border: none;
                    padding-bottom: 0;
                    margin-bottom: 0;
                    flex: 1;
                    font-size: 1.3em;
                    color: ${colors.textSecondary};
                }

                /* Minimal Tab Container Styling */
                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: transparent;
                    border-radius: 0;
                    padding: 0;
                    gap: 4px;
                    width: fit-content;
                }

                /* Minimal Tab Button Styling */
                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    padding: 4px 8px;
                    font-size: 0.75em;
                    background: transparent;
                    border: none;
                    border-radius: 0;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: ${colors.textMuted};
                    font-family: ${fonts.ui};
                    font-weight: 400;
                    white-space: nowrap;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    border-bottom: 1px solid transparent;
                }

                /* Minimal Active Tab Styling */
                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: transparent;
                    color: ${colors.textPrimary};
                    border-bottom: 1px solid ${colors.textPrimary};
                    box-shadow: none;
                }

                /* Minimal Tab Hover Styling */
                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: transparent;
                    color: ${colors.textSecondary};
                    border-bottom: 1px solid ${colors.textMuted}60;
                }

                /* Smaller word count for minimal style */
                .section-title .wordcount-display-small {
                    background: transparent;
                    border: 1px solid ${colors.textMuted}30;
                    border-radius: 2px;
                    padding: 1px 4px;
                    font-size: 0.4em;
                    font-weight: 400;
                    color: ${colors.textMuted};
                    font-family: ${fonts.ui};
                    opacity: 0.7;
                }
            `;

        case 'banner':
            return `
                /* Banner Page Headers - Bold and prominent */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.secondary};
                    font-weight: 700;
                    font-size: 2.0em;
                    color: ${colors.textPrimary} !important;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                    border: none;
                    padding: 12px 20px;
                    margin-bottom: 25px;
                    border-radius: 6px;
                    text-align: center;
                    scroll-margin-top: 120px;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.15);
                }

                /* Banner Section Headers with Tabs */
                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                    background: linear-gradient(135deg, ${colors.statusCanon} 0%, ${colors.navBg} 100%);
                    border: 1px solid ${colors.bannerBorder}30;
                    padding: 12px 18px;
                    border-radius: 6px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                }

                /* Banner section titles styling */
                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    color: ${colors.textPrimary};
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    text-align: left;
                    font-size: 1.6em;
                    box-shadow: none;
                    text-shadow: none;
                }

                /* Banner Tab Container Styling */
                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.navActive}40;
                    border-radius: 6px;
                    padding: 3px;
                    gap: 2px;
                    width: fit-content;
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid ${colors.textMuted}20;
                }

                /* Banner Tab Button Styling */
                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    padding: 6px 12px;
                    font-size: 0.8em;
                    background: transparent;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: ${colors.textSecondary};
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    white-space: nowrap;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }

                /* Banner Active Tab Styling */
                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: linear-gradient(135deg, ${colors.locations} 0%, ${colors.concepts} 100%);
                    color: ${colors.textPrimary};
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                    font-weight: 700;
                }

                /* Banner Tab Hover Styling */
                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.textMuted}15;
                    color: ${colors.textPrimary};
                    transform: translateY(-1px);
                }

                /* Banner word count styling */
                .section-title .wordcount-display-small {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 3px;
                    padding: 2px 6px;
                    vertical-align: middle;
                    font-size: 0.4em;
                    font-weight: 600;
                    color: ${colors.mavActive};
                    font-family: ${fonts.ui};
                    text-shadow: 0 1px 1px rgba(0,0,0,0.2);
                }
            `;

        case 'compact':
            return `
                /* Compact Page Headers - Space-efficient */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.secondary};
                    font-weight: 600;
                    font-size: 1.2em;
                    color: ${colors.textPrimary};
                    border-bottom: 1px solid ${colors.locations};
                    padding-bottom: 3px;
                    margin-bottom: 15px;
                    scroll-margin-top: 120px;
                }

                /* Compact Section Headers with Tabs */
                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 15px;
                    border-bottom: 1px solid ${colors.locations};
                    padding-bottom: 3px;
                    padding: 6px 12px;
                    border-radius: 3px;
                }

                /* Compact section titles styling */
                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    border: none;
                    padding-bottom: 0;
                    margin-bottom: 0;
                    flex: 1;
                    font-size: 1.1em;
                    color: ${colors.textPrimary};
                }

                /* Compact Tab Container Styling */
                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.containerBg};
                    border-radius: 3px;
                    padding: 2px;
                    gap: 1px;
                    width: fit-content;
                    border: 1px solid ${colors.textMuted}25;
                }

                /* Compact Tab Button Styling */
                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    padding: 4px 8px;
                    font-size: 0.7em;
                    background: transparent;
                    border: none;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: ${colors.textSecondary};
                    font-family: ${fonts.ui};
                    font-weight: 500;
                    white-space: nowrap;
                    text-transform: uppercase;
                    letter-spacing: 0.2px;
                }

                /* Compact Active Tab Styling */
                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: ${colors.locations};
                    color: ${colors.textPrimary};
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    font-weight: 600;
                }

                /* Compact Tab Hover Styling */
                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.textMuted}20;
                    color: ${colors.textPrimary};
                }

                /* Compact word count styling */
                .section-title .wordcount-display-small {
                    background: ${colors.containerBg};
                    border: 1px solid ${colors.textMuted}30;
                    border-radius: 2px;
                    padding: 1px 4px;
                    font-size: 0.6em;
                    font-weight: 500;
                    color: ${colors.textMuted};
                    font-family: ${fonts.ui};
                    opacity: 0.8;
                }
            `;

        case 'standard':
        default:
            return `
                /* Standard Page Headers */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.secondary};
                    font-weight: 600;
                    font-size: 1.8em;
                    color: ${colors.textPrimary};
                    border-bottom: 2px solid ${colors.locations};
                    padding-bottom: 8px;
                    margin-bottom: 20px;
                    scroll-margin-top: 120px;
                }

                /* Unified Section Headers with Tabs */
                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                    border-bottom: 2px solid ${colors.locations};
                    padding-bottom: 8px;
                }

                /* Remove border from section-title when inside headers with tabs */
                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    border-bottom: none;
                    padding-bottom: 0;
                    margin-bottom: 0;
                    flex: 1;
                }

                /* Unified Tab Container Styling */
                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.textMuted}15;
                    border-radius: 6px;
                    padding: 4px;
                    gap: 2px;
                    width: fit-content;
                }

                /* Unified Tab Button Styling */
                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    padding: 8px 16px;
                    font-size: 0.9em;
                    background: transparent;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: ${colors.textSecondary};
                    font-family: ${fonts.ui};
                    font-weight: 500;
                    white-space: nowrap;
                }

                /* Unified Active Tab Styling */
                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: ${colors.statusDraft};
                    color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* Unified Tab Hover Styling */
                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.textMuted}20;
                    color: ${colors.textPrimary};
                }

                /* Smaller, less bulky wordcount display */
                .section-title .wordcount-display-small {
                    background: ${colors.headerBg};
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 3px;
                    padding: 2px 6px;
                    font-size: 0.45em;
                    font-weight: 500;
                    color: ${colors.textMuted};
                    font-family: ${fonts.ui};
                    white-space: nowrap;
                    text-align: center;
                    cursor: help;
                    margin-left: 8px;
                    display: inline-block;
                    vertical-align: middle;
                    opacity: 0.8;
                }

                .section-title .wordcount-display-small:hover {
                    opacity: 1;
                    color: ${colors.textSecondary};
                }
            `;

        case 'cards':
            return `
                /* Cards - Elevated card-like headers */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.secondary};
                    font-weight: 600;
                    font-size: 1.8em;
                    color: ${colors.textPrimary};
                    background: ${colors.headerBg};
                    border: none;
                    padding: 16px 20px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px ${colors.textMuted}20;
                    border-left: 4px solid ${colors.locations};
                    scroll-margin-top: 120px;
                }

                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                    padding: 16px 20px;
                    background: ${colors.headerBg};
                    border-radius: 8px;
                    box-shadow: 0 2px 8px ${colors.textMuted}20;
                    border-left: 4px solid ${colors.locations};
                }

                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    box-shadow: none;
                }

                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.containerBg};
                    border-radius: 6px;
                    padding: 4px;
                    gap: 3px;
                    width: fit-content;
                    box-shadow: inset 0 1px 3px ${colors.textMuted}20;
                }

                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    padding: 7px 13px;
                    font-size: 0.8em;
                    background: transparent;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: ${colors.textSecondary};
                    font-family: ${fonts.ui};
                    font-weight: 500;
                    white-space: nowrap;
                }

                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: ${colors.locations};
                    color: ${colors.textPrimary};
                    box-shadow: 0 1px 3px ${colors.textMuted}30;
                    font-weight: 600;
                }

                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.textMuted}15;
                    color: ${colors.textPrimary};
                }

                .section-title .wordcount-display-small {
                    background: ${colors.containerBg};
                    border: 1px solid ${colors.textMuted}30;
                    border-radius: 4px;
                    padding: 3px 7px;
                    font-size: 0.45em;
                    font-weight: 500;
                    color: ${colors.textMuted};
                    font-family: ${fonts.ui};
                    margin-left: 8px;
                    margin-bottom: 2px;
                    box-shadow: 0 1px 2px ${colors.textMuted}20;
                }
            `;

        case 'kawaii':
            return `
                /* Kawaii - Cute and rounded */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.secondary};
                    font-weight: 500;
                    font-size: 1.7em;
                    color: ${colors.textPrimary};
                    background: linear-gradient(135deg, ${colors.kawaiiPink}20 0%, ${colors.kawaiiPurple}20 100%);
                    border: none;
                    padding: 16px 24px;
                    margin-bottom: 25px;
                    border-radius: 20px;
                    text-align: center;
                    scroll-margin-top: 120px;
                    box-shadow: 0 4px 12px ${colors.kawaiiPink}20;
                    position: relative;
                }

                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                    padding: 16px 24px;
                    background: linear-gradient(135deg, ${colors.kawaiiPink}15 0%, ${colors.kawaiiPurple}15 100%);
                    border-radius: 20px;
                    box-shadow: 0 4px 12px ${colors.kawaiiPink}20;
                    border: 2px solid ${colors.kawaiiPink}30;
                }

                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    text-align: left;
                    box-shadow: none;
                }

                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.containerBg};
                    border-radius: 15px;
                    padding: 5px;
                    gap: 3px;
                    width: fit-content;
                    box-shadow: inset 0 2px 4px ${colors.kawaiiPink}20;
                    border: 1px solid ${colors.kawaiiPink}30;
                }

                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    padding: 6px 12px;
                    font-size: 0.75em;
                    background: transparent;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    color: ${colors.textSecondary};
                    font-family: ${fonts.ui};
                    font-weight: 500;
                    white-space: nowrap;
                    text-transform: lowercase;
                }

                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: linear-gradient(135deg, ${colors.kawaiiPink} 0%, ${colors.kawaiiPurple} 100%);
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 2px 6px ${colors.kawaiiPink}40;
                    transform: translateY(-1px);
                }

                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.kawaiiPink}20;
                    color: ${colors.textPrimary};
                    transform: scale(1.05);
                }

                .section-title .wordcount-display-small {
                    background: white;
                    border: 2px solid ${colors.kawaiiPink}40;
                    border-radius: 10px;
                    padding: 3px 8px;
                    font-size: 0.4em;
                    font-weight: 600;
                    color: ${colors.kawaiiPink};
                    font-family: ${fonts.ui};
                    vertical-align: middle;
                    box-shadow: 0 2px 4px ${colors.kawaiiPink}20;
                }
            `;

        case 'industrial':
            return `
                /* Industrial - Technical and angular */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.ui};
                    font-weight: 700;
                    font-size: 1.6em;
                    color: ${colors.textPrimary};
                    background: linear-gradient(90deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
                    border: none;
                    border-left: 4px solid ${colors.journalAccent};
                    padding: 12px 20px;
                    margin-bottom: 20px;
                    clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 100%, 0 100%);
                    scroll-margin-top: 120px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                    padding: 12px 20px;
                    background: linear-gradient(90deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
                    border-left: 4px solid ${colors.journalAccent};
                    clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 100%, 0 100%);
                }

                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    clip-path: none;
                }

                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: transparent;
                    border-radius: 0;
                    padding: 0;
                    gap: 2px;
                    width: fit-content;
                }

                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    padding: 6px 12px;
                    font-size: 0.75em;
                    background: ${colors.textMuted}20;
                    border: none;
                    border-radius: 0;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: ${colors.textSecondary};
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    white-space: nowrap;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%);
                }

                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: ${colors.journalAccent};
                    color: ${colors.containerBg};
                    font-weight: 700;
                }

                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.textMuted}40;
                    color: ${colors.textPrimary};
                }

                .section-title .wordcount-display-small {
                    background: ${colors.containerBg};
                    border: 1px solid ${colors.journalAccent};
                    border-radius: 0;
                    padding: 2px 6px;
                    font-size: 0.45em;
                    font-weight: 700;
                    color: ${colors.journalAccent};
                    font-family: ${fonts.ui};
                    margin-left: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
            `;

        case 'manuscript':
            return `
                /* Manuscript - Elegant parchment style */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.secondary};
                    font-weight: 600;
                    font-size: 1.8em;
                    color: ${colors.textPrimary};
                    background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 50%, ${colors.headerBg} 100%);
                    border: 2px solid ${colors.textMuted}40;
                    border-top: 3px solid ${colors.journalAccent};
                    padding: 16px 24px;
                    margin-bottom: 25px;
                    border-radius: 8px;
                    scroll-margin-top: 120px;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 3px 10px ${colors.textMuted}20;
                }

                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                    padding: 16px 24px;
                    background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 50%, ${colors.headerBg} 100%);
                    border: 2px solid ${colors.textMuted}40;
                    border-top: 3px solid ${colors.journalAccent};
                    border-radius: 8px;
                    box-shadow: 0 3px 10px ${colors.textMuted}20;
                    position: relative;
                }

                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    text-align: left;
                    box-shadow: none;
                }

                .world-header .section-title::before,
                .storylines-header .section-title::before,
                .plans-header-with-tabs .section-title::before,
                .characters-header .section-title::before,
                .playlists-header .section-title::before,
                .world-header .section-title::after,
                .storylines-header .section-title::after,
                .plans-header-with-tabs .section-title::after,
                .characters-header .section-title::after,
                .playlists-header .section-title::after {
                    display: none;
                }

                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.containerBg};
                    border-radius: 6px;
                    padding: 3px;
                    gap: 2px;
                    width: fit-content;
                    border: 1px solid ${colors.textMuted}30;
                    box-shadow: inset 0 1px 3px ${colors.textMuted}20;
                }

                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    padding: 6px 12px;
                    font-size: 0.8em;
                    background: transparent;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: ${colors.textSecondary};
                    white-space: nowrap;
                    font-variant: small-caps;
                }

                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: ${colors.journalAccent};
                    color: ${colors.containerBg};
                    font-weight: 600;
                    box-shadow: 0 1px 3px ${colors.textMuted}40;
                }

                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.textMuted}20;
                    color: ${colors.textPrimary};
                }

                .section-title .wordcount-display-small {
                    background: ${colors.containerBg};
                    border: 1px solid ${colors.journalAccent}60;
                    border-radius: 3px;
                    padding: 3px 7px;
                    font-size: 0.4em;
                    font-weight: 500;
                    color: ${colors.journalAccent};
                    font-family: ${fonts.ui};
                    margin-left: 8px;
                    vertical-align: middle;
                    font-variant: small-caps;
                }
            `;

        case 'neon':
            return `
                /* Neon - Cyberpunk glow effects */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.ui};
                    font-weight: 700;
                    font-size: 1.7em;
                    color: ${colors.journalAccent};
                    background: ${colors.headerBg};
                    border: none;
                    padding: 16px 24px;
                    margin-bottom: 25px;
                    border-radius: 4px;
                    scroll-margin-top: 120px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 0 10px ${colors.journalAccent}80;
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}40,
                        inset 0 1px 0 ${colors.journalAccent}20;
                    border: 1px solid ${colors.journalAccent}60;
                }

                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                    padding: 16px 24px;
                    background: ${colors.headerBg};
                    border-radius: 4px;
                    border: 1px solid ${colors.journalAccent}60;
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}40,
                        inset 0 1px 0 ${colors.journalAccent}20;
                }

                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    box-shadow: none;
                    text-shadow: 0 0 8px ${colors.journalAccent}60;
                }

                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.containerBg}80;
                    border-radius: 4px;
                    padding: 4px;
                    gap: 2px;
                    width: fit-content;
                    border: 1px solid ${colors.journalAccent}40;
                    box-shadow: inset 0 0 10px ${colors.journalAccent}20;
                }

                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    padding: 6px 12px;
                    font-size: 0.75em;
                    background: transparent;
                    border: none;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: ${colors.textSecondary};
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    white-space: nowrap;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: ${colors.journalAccent}20;
                    color: ${colors.journalAccent};
                    font-weight: 700;
                    text-shadow: 0 0 6px ${colors.journalAccent}80;
                    box-shadow: 
                        0 0 15px ${colors.journalAccent}60,
                        inset 0 0 10px ${colors.journalAccent}20;
                    border: 1px solid ${colors.journalAccent}80;
                }

                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.journalAccent}10;
                    color: ${colors.journalAccent}cc;
                    text-shadow: 0 0 4px ${colors.journalAccent}60;
                    box-shadow: 0 0 8px ${colors.journalAccent}40;
                }

                .section-title .wordcount-display-small {
                    background: ${colors.containerBg}80;
                    border: 1px solid ${colors.journalAccent}60;
                    border-radius: 2px;
                    padding: 3px 7px;
                    font-size: 0.4em;
                    font-weight: 700;
                    color: ${colors.journalAccent};
                    font-family: ${fonts.ui};
                    margin-left: 8px;
                    vertical-align: middle;
                    text-transform: uppercase;
                    text-shadow: 0 0 4px ${colors.journalAccent}60;
                    box-shadow: 0 0 8px ${colors.journalAccent}30;
                }
            `;

        case 'cyberpunk':
            return `
                /* Cyberpunk Page Headers - Neon terminal section headers and view buttons */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.ui};
                    font-weight: 700;
                    font-size: 1.8em;
                    color: ${colors.journalAccent};
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.navBg} 100%);
                    border: 2px solid ${colors.journalAccent}66;
                    border-left: 6px solid ${colors.journalAccent};
                    padding: 15px 25px;
                    margin-bottom: 25px;
                    border-radius: 0;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 0 15px ${colors.journalAccent}88;
                    position: relative;
                    overflow: hidden;
                    scroll-margin-top: 120px;
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}33,
                        inset 0 0 10px ${colors.journalAccent}22;
                }

                /* Scanning line animation on section headers */
                .section-title::before,
                h2.section-title::before {
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
                }

                /* Holographic corner brackets */
                .section-title::after,
                h2.section-title::after {
                    content: ' ◥';
                    position: absolute;
                    top: 8px; right: 15px;
                    color: ${colors.journalAccent};
                    font-size: 14px;
                    opacity: 0.7;
                    animation: hologramFlicker 2s infinite alternate;
                }

                /* Section Headers with Tabs */
                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.navBg} 100%);
                    border: 2px solid ${colors.journalAccent}66;
                    border-left: 6px solid ${colors.journalAccent};
                    padding: 15px 25px;
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}33,
                        inset 0 0 10px ${colors.journalAccent}22;
                    position: relative;
                    overflow: hidden;
                }

                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    box-shadow: none;
                    text-shadow: 0 0 15px ${colors.journalAccent}88;
                }

                /* Tab Container Styling */
                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.navBg}ee;
                    border: 1px solid ${colors.journalAccent}66;
                    border-radius: 0;
                    padding: 4px;
                    gap: 2px;
                    width: fit-content;
                    box-shadow: inset 0 0 10px ${colors.journalAccent}22;
                }

                /* Tab Button Styling */
                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.navBg} 100%);
                    color: ${colors.navText};
                    border: 1px solid ${colors.journalAccent}66;
                    border-radius: 0;
                    padding: 12px 20px;
                    margin: 0 2px;
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    
                    /* Circuit pattern overlay */
                    background-image: 
                        repeating-linear-gradient(45deg, 
                            transparent, 
                            transparent 3px, 
                            ${colors.journalAccent}11 3px, 
                            ${colors.journalAccent}11 5px);
                }

                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: linear-gradient(135deg, 
                        ${colors.navBg} 0%, 
                        ${colors.headerBg} 100%);
                    color: ${colors.textPrimary};
                    border-color: ${colors.journalAccent};
                    text-shadow: 0 0 10px ${colors.journalAccent}66;
                    box-shadow: 
                        0 0 15px ${colors.journalAccent}44,
                        inset 0 0 10px ${colors.journalAccent}22;
                }

                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}33 0%, 
                        ${colors.navActive} 100%);
                    color: ${colors.navActiveText};
                    border-color: ${colors.journalAccent};
                    text-shadow: 0 0 15px ${colors.journalAccent}aa;
                    box-shadow: 
                        0 0 25px ${colors.journalAccent}66,
                        inset 0 0 15px ${colors.journalAccent}33;
                }

                /* Search and filter controls */
                .search-filter-container,
                .character-filter-container {
                    background: ${colors.navBg}ee;
                    border: 2px solid ${colors.journalAccent}44;
                    border-radius: 4px;
                    padding: 15px;
                    margin: 15px 0;
                    box-shadow: 
                        0 0 15px ${colors.journalAccent}22,
                        inset 0 0 10px ${colors.journalAccent}11;
                }

                .search-filter-container input,
                .character-filter-container input {
                    background: ${colors.headerBg};
                    border: 1px solid ${colors.journalAccent}66;
                    color: ${colors.textPrimary};
                    padding: 8px 12px;
                    font-family: ${fonts.ui};
                    border-radius: 0;
                    box-shadow: inset 0 0 5px ${colors.journalAccent}22;
                }

                .search-filter-container input:focus,
                .character-filter-container input:focus {
                    border-color: ${colors.journalAccent};
                    box-shadow: 
                        0 0 10px ${colors.journalAccent}44,
                        inset 0 0 8px ${colors.journalAccent}33;
                    outline: none;
                }

                /* Back to top buttons */
                .back-to-top {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}88 0%, 
                        ${colors.navBg} 100%);
                    border: 2px solid ${colors.journalAccent};
                    color: ${colors.containerBg};
                    font-family: ${fonts.ui};
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-shadow: 0 0 10px ${colors.journalAccent}88;
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}44,
                        inset 0 0 10px ${colors.journalAccent}33;
                }

                .back-to-top:hover {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent} 0%, 
                        ${colors.navActive} 100%);
                    box-shadow: 
                        0 0 30px ${colors.journalAccent}66,
                        inset 0 0 15px ${colors.journalAccent}44;
                    transform: translateY(-2px);
                }

                /* Word count styling */
                .section-title .wordcount-display-small {
                    background: ${colors.navBg}88;
                    border: 1px solid ${colors.journalAccent}66;
                    border-radius: 0;
                    padding: 3px 8px;
                    font-size: 0.4em;
                    font-weight: 700;
                    color: ${colors.journalAccent};
                    font-family: ${fonts.ui};
                    margin-left: 8px;
                    vertical-align: middle;
                    text-transform: uppercase;
                    text-shadow: 0 0 8px ${colors.journalAccent}66;
                    box-shadow: 0 0 10px ${colors.journalAccent}33;
                }

                @keyframes scanLine {
                    0% { left: -100%; }
                    50% { left: 100%; }
                    100% { left: -100%; }
                }

                @keyframes hologramFlicker {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.8; }
                }
            `;

        case 'matrix':
            return `
                /* Matrix Page Headers - Digital terminal section headers */
                .section-title,
                h2.section-title {
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    font-size: 1.6em;
                    color: ${colors.journalAccent};
                    background: ${colors.navBg}ee;
                    border: 1px solid ${colors.journalAccent}66;
                    border-left: 4px solid ${colors.journalAccent};
                    padding: 12px 20px;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    position: relative;
                    scroll-margin-top: 120px;
                    box-shadow: 0 0 15px ${colors.journalAccent}33;
                }

                /* Terminal prompt prefix */
                .section-title::before,
                h2.section-title::before {
                    content: '> ';
                    color: ${colors.journalAccent};
                    text-shadow: 0 0 10px ${colors.journalAccent}88;
                    animation: terminalBlink 1.5s infinite;
                }

                /* Terminal status in corner */
                .section-title::after,
                h2.section-title::after {
                    content: 'ACCESSING DATABASE... ████████████ 100%';
                    position: absolute;
                    bottom: -25px; right: 0;
                    color: ${colors.journalAccent}88;
                    font-family: 'Courier New', monospace;
                    font-size: 9px;
                    font-weight: 400;
                    letter-spacing: 1px;
                    animation: terminalType 4s infinite;
                    pointer-events: none;
                }

                /* Section Headers with Tabs */
                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                    background: ${colors.navBg}ee;
                    border: 1px solid ${colors.journalAccent}66;
                    border-left: 4px solid ${colors.journalAccent};
                    padding: 12px 20px;
                    box-shadow: 0 0 15px ${colors.journalAccent}33;
                }

                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    box-shadow: none;
                }

                /* Tab Container Styling */
                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.headerBg};
                    border: 1px solid ${colors.journalAccent}66;
                    border-radius: 0;
                    padding: 4px;
                    gap: 2px;
                    width: fit-content;
                    /* Terminal scanlines */
                    background-image: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        ${colors.navBg}99 2px,
                        ${colors.navBg}99 4px
                    );
                }

                /* Tab Button Styling */
                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    background: ${colors.headerBg};
                    color: ${colors.journalAccent};
                    border: 1px solid ${colors.journalAccent}66;
                    border-radius: 0;
                    padding: 10px 18px;
                    margin: 0 2px;
                    font-family: 'Courier New', monospace;
                    font-weight: 700;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .world-tab::before,
                .storylines-tab::before,
                .plans-tab::before,
                .characters-tab::before,
                .playlists-tab::before {
                    content: '> ';
                    color: ${colors.journalAccent}88;
                }

                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.journalAccent}22;
                    color: ${colors.textPrimary};
                    border-color: ${colors.journalAccent};
                    text-shadow: 0 0 10px ${colors.journalAccent}66;
                }

                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: ${colors.journalAccent}44;
                    color: ${colors.containerBg};
                    border-color: ${colors.journalAccent};
                    text-shadow: 0 0 15px ${colors.journalAccent};
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}66,
                        inset 0 0 10px ${colors.journalAccent}33;
                }

                .world-tab.active::before,
                .storylines-tab.active::before,
                .plans-tab.active::before,
                .characters-tab.active::before,
                .playlists-tab.active::before {
                    color: ${colors.containerBg};
                    animation: terminalBlink 1s infinite;
                }

                /* Search and filter controls */
                .search-filter-container,
                .character-filter-container {
                    background: ${colors.navBg}ee;
                    border: 1px solid ${colors.journalAccent}44;
                    padding: 15px;
                    margin: 15px 0;
                    position: relative;
                }

                .search-filter-container::before {
                    content: '> SEARCH_QUERY: ';
                    position: absolute;
                    top: -12px; left: 10px;
                    background: ${colors.navBg};
                    color: ${colors.journalAccent};
                    font-family: 'Courier New', monospace;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 2px 8px;
                    letter-spacing: 1px;
                }

                .search-filter-container input,
                .character-filter-container input {
                    background: ${colors.headerBg};
                    border: 1px solid ${colors.journalAccent}66;
                    color: ${colors.textPrimary};
                    padding: 8px 12px;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    border-radius: 0;
                }

                .search-filter-container input:focus,
                .character-filter-container input:focus {
                    border-color: ${colors.journalAccent};
                    box-shadow: 0 0 10px ${colors.journalAccent}44;
                    outline: none;
                }

                /* Word count styling */
                .section-title .wordcount-display-small {
                    background: ${colors.headerBg};
                    border: 1px solid ${colors.journalAccent}66;
                    border-radius: 0;
                    padding: 2px 6px;
                    font-size: 0.4em;
                    font-weight: 700;
                    color: ${colors.journalAccent};
                    font-family: 'Courier New', monospace;
                    margin-left: 8px;
                    vertical-align: middle;
                    text-transform: uppercase;
                }

                @keyframes terminalBlink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.3; }
                }

                @keyframes terminalType {
                    0% { content: 'ACCESSING DATABASE...'; }
                    25% { content: 'ACCESSING DATABASE... ███'; }
                    50% { content: 'ACCESSING DATABASE... ██████'; }
                    75% { content: 'ACCESSING DATABASE... █████████'; }
                    100% { content: 'ACCESSING DATABASE... ████████████ 100%'; }
                }
            `;

        case 'glitch':
            return `
                /* Glitch Page Headers - Digital corruption for section headers */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.ui};
                    font-weight: 700;
                    font-size: 1.8em;
                    color: ${colors.journalAccent};
                    background: ${colors.headerBg};
                    border: 2px solid ${colors.journalAccent}66;
                    padding: 15px 25px;
                    margin-bottom: 25px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    position: relative;
                    scroll-margin-top: 120px;
                    animation: headerGlitch 8s infinite;
                    overflow: hidden;
                }

                /* RGB split text effect on headers */
                .section-title::before,
                h2.section-title::before {
                    content: attr(data-text);
                    position: absolute;
                    top: 15px; left: 25px;
                    color: cyan;
                    animation: glitchTextRed 2s infinite;
                    z-index: -1;
                }

                .section-title::after,
                h2.section-title::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 15px; left: 25px;
                    color: magenta;
                    animation: glitchTextBlue 2.5s infinite;
                    z-index: -2;
                }

                /* Section Headers with Tabs */
                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                    background: ${colors.headerBg};
                    border: 2px solid ${colors.journalAccent}66;
                    padding: 15px 25px;
                    animation: containerGlitch 10s infinite;
                }

                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    animation: none;
                }

                /* Tab Container Styling */
                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.headerBg};
                    border: 2px solid ${colors.journalAccent}44;
                    border-radius: 0;
                    padding: 4px;
                    gap: 2px;
                    width: fit-content;
                    position: relative;
                    animation: containerGlitch 10s infinite;
                }

                /* Static noise on tab containers */
                .world-tabs::before,
                .storylines-tabs::before,
                .plans-tabs::before,
                .characters-tabs::before,
                .playlists-tabs::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        radial-gradient(circle at 25% 25%, ${colors.journalAccent}22 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, ${colors.textSecondary}11 0%, transparent 50%);
                    animation: staticNoise 0.1s infinite;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Tab Button Styling */
                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    background: ${colors.headerBg};
                    color: ${colors.navText};
                    border: 1px solid ${colors.journalAccent}44;
                    border-radius: 0;
                    padding: 12px 20px;
                    margin: 0 2px;
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: none; /* No smooth transitions for glitch effect */
                    position: relative;
                    z-index: 2;
                }

                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: ${colors.headerBg};
                    color: ${colors.textPrimary};
                    border-color: ${colors.journalAccent}88;
                    animation: tabGlitch 0.3s infinite;
                }

                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: ${colors.journalAccent}33;
                    color: ${colors.navActiveText};
                    border-color: ${colors.journalAccent};
                    animation: activeTabGlitch 6s infinite;
                }

                /* Search and filter controls with static */
                .search-filter-container,
                .character-filter-container {
                    background: ${colors.headerBg};
                    border: 2px solid ${colors.journalAccent}44;
                    padding: 15px;
                    margin: 15px 0;
                    position: relative;
                    animation: containerGlitch 10s infinite;
                }

                .search-filter-container::before,
                .character-filter-container::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        radial-gradient(circle at 25% 25%, ${colors.journalAccent}22 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, ${colors.textSecondary}11 0%, transparent 50%);
                    animation: staticNoise 0.1s infinite;
                    pointer-events: none;
                    z-index: 1;
                }

                .search-filter-container input,
                .character-filter-container input {
                    background: ${colors.navBg};
                    border: 1px solid ${colors.journalAccent}66;
                    color: ${colors.textPrimary};
                    padding: 8px 12px;
                    font-family: ${fonts.ui};
                    border-radius: 0;
                    position: relative;
                    z-index: 2;
                }

                .search-filter-container input:focus,
                .character-filter-container input:focus {
                    border-color: ${colors.journalAccent};
                    animation: inputGlitch 0.5s infinite;
                    outline: none;
                }

                /* Back to top with corruption */
                .back-to-top {
                    background: ${colors.headerBg};
                    border: 2px solid ${colors.journalAccent}66;
                    color: ${colors.journalAccent};
                    font-family: ${fonts.ui};
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    animation: buttonGlitch 7s infinite;
                }

                .back-to-top:hover {
                    background: ${colors.journalAccent}44;
                    color: ${colors.navActiveText};
                    animation: buttonGlitchIntense 0.3s infinite;
                }

                /* Word count styling */
                .section-title .wordcount-display-small {
                    background: ${colors.headerBg};
                    border: 1px solid ${colors.journalAccent}66;
                    border-radius: 0;
                    padding: 3px 7px;
                    font-size: 0.4em;
                    font-weight: 700;
                    color: ${colors.journalAccent};
                    font-family: ${fonts.ui};
                    margin-left: 8px;
                    vertical-align: middle;
                    text-transform: uppercase;
                }

                @keyframes headerGlitch {
                    0%, 92% { transform: translate(0); }
                    93% { transform: translate(-2px, 1px); }
                    94% { transform: translate(2px, -1px); }
                    95% { transform: translate(-1px, 2px); }
                    96% { transform: translate(1px, -2px); }
                    97%, 100% { transform: translate(0); }
                }

                @keyframes glitchTextRed {
                    0% { transform: translate(0); clip: rect(0, 9999px, 0, 0); }
                    20% { transform: translate(-2px, 1px); clip: rect(0, 9999px, 0, 0); }
                    40% { transform: translate(2px, -1px); clip: rect(0, 9999px, 15px, 0); }
                    60% { transform: translate(-1px, 2px); clip: rect(0, 9999px, 0, 0); }
                    80% { transform: translate(1px, -2px); clip: rect(10px, 9999px, 20px, 0); }
                    100% { transform: translate(0); clip: rect(0, 9999px, 0, 0); }
                }

                @keyframes glitchTextBlue {
                    0% { transform: translate(0); clip: rect(0, 9999px, 0, 0); }
                    25% { transform: translate(2px, -1px); clip: rect(15px, 9999px, 9999px, 0); }
                    50% { transform: translate(-2px, 1px); clip: rect(0, 9999px, 0, 0); }
                    75% { transform: translate(1px, -2px); clip: rect(8px, 9999px, 9999px, 0); }
                    100% { transform: translate(0); clip: rect(0, 9999px, 0, 0); }
                }

                @keyframes staticNoise {
                    0% { opacity: 0.02; }
                    10% { opacity: 0.08; }
                    20% { opacity: 0.03; }
                    30% { opacity: 0.1; }
                    40% { opacity: 0.01; }
                    50% { opacity: 0.06; }
                    60% { opacity: 0.04; }
                    70% { opacity: 0.09; }
                    80% { opacity: 0.02; }
                    90% { opacity: 0.07; }
                    100% { opacity: 0.03; }
                }

                @keyframes tabGlitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-1px, 1px); }
                    40% { transform: translate(1px, -1px); }
                    60% { transform: translate(-1px, -1px); }
                    80% { transform: translate(1px, 1px); }
                    100% { transform: translate(0); }
                }

                @keyframes activeTabGlitch {
                    0%, 90% { 
                        background: ${colors.journalAccent}33; 
                        border-color: ${colors.journalAccent};
                    }
                    91% { 
                        background: ${colors.journalAccent}66; 
                        border-color: ${colors.textSecondary}88;
                    }
                    92% { 
                        background: ${colors.textSecondary}33; 
                        border-color: ${colors.journalAccent}99;
                    }
                    93%, 100% { 
                        background: ${colors.journalAccent}33; 
                        border-color: ${colors.journalAccent};
                    }
                }

                @keyframes containerGlitch {
                    0%, 95% { 
                        background: ${colors.headerBg}; 
                        border-color: ${colors.journalAccent}44;
                    }
                    96% { 
                        background: ${colors.journalAccent}22; 
                        border-color: ${colors.textSecondary}66;
                    }
                    97% { 
                        background: ${colors.textSecondary}11; 
                        border-color: ${colors.journalAccent}88;
                    }
                    98%, 100% { 
                        background: ${colors.headerBg}; 
                        border-color: ${colors.journalAccent}44;
                    }
                }

                @keyframes inputGlitch {
                    0% { transform: translate(0); }
                    25% { transform: translate(-1px, 0); }
                    50% { transform: translate(1px, 0); }
                    75% { transform: translate(0, -1px); }
                    100% { transform: translate(0); }
                }

                @keyframes buttonGlitch {
                    0%, 85% { transform: translate(0); }
                    86% { transform: translate(-1px, 1px); }
                    87% { transform: translate(1px, -1px); }
                    88%, 100% { transform: translate(0); }
                }

                @keyframes buttonGlitchIntense {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 1px); }
                    40% { transform: translate(2px, -1px); }
                    60% { transform: translate(-1px, 2px); }
                    80% { transform: translate(1px, -2px); }
                    100% { transform: translate(0); }
                }
            `;

        case 'neuralInterface':
            return `
                /* Neural Interface Page Headers - Connected network headers */
                .section-title,
                h2.section-title {
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    font-size: 1.8em;
                    color: ${colors.journalAccent};
                    background: radial-gradient(circle, 
                        ${colors.headerBg} 0%, 
                        ${colors.navBg} 70%, 
                        ${colors.headerBg} 100%);
                    border: 2px solid ${colors.journalAccent}55;
                    border-radius: 8px;
                    padding: 15px 25px;
                    margin-bottom: 25px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    position: relative;
                    scroll-margin-top: 120px;
                    text-shadow: 0 0 15px ${colors.journalAccent}88;
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}33,
                        inset 0 0 15px ${colors.journalAccent}22;
                    animation: nodeConnection 5s ease-in-out infinite;
                }

                /* Connection points on headers */
                .section-title::before,
                h2.section-title::before {
                    content: '●';
                    position: absolute;
                    top: -8px; left: 20px;
                    color: ${colors.journalAccent};
                    font-size: 16px;
                    animation: connectionPulse 2s ease-in-out infinite;
                }

                .section-title::after,
                h2.section-title::after {
                    content: '●';
                    position: absolute;
                    top: -8px; right: 20px;
                    color: ${colors.journalAccent};
                    font-size: 12px;
                    opacity: 0.7;
                    animation: connectionPulse 2s ease-in-out infinite 0.5s;
                }

                /* Section Headers with Tabs */
                .world-header,
                .storylines-header, 
                .plans-header-with-tabs,
                .characters-header,
                .playlists-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 25px;
                    background: radial-gradient(ellipse at 50% 50%, 
                        ${colors.headerBg} 0%, 
                        ${colors.navBg} 70%);
                    border: 2px solid ${colors.journalAccent}44;
                    border-radius: 12px;
                    padding: 15px 25px;
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}22,
                        inset 0 0 15px ${colors.journalAccent}11;
                }

                .world-header .section-title,
                .storylines-header .section-title,
                .plans-header-with-tabs .section-title,
                .characters-header .section-title,
                .playlists-header .section-title {
                    background: none;
                    border: none;
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    box-shadow: none;
                    animation: none;
                }

                /* Tab Container Styling */
                .world-tabs,
                .storylines-tabs,
                .plans-tabs,
                .characters-tabs,
                .playlists-tabs {
                    display: flex;
                    background: ${colors.containerBg};
                    border: 2px solid ${colors.journalAccent}55;
                    border-radius: 25px;
                    padding: 5px;
                    gap: 3px;
                    width: fit-content;
                    box-shadow: 
                        0 0 15px ${colors.journalAccent}22,
                        inset 0 0 10px ${colors.containerBg}66;
                    position: relative;
                }

                /* Neural connection lines between tabs */
                .world-tabs::before,
                .storylines-tabs::before,
                .plans-tabs::before,
                .characters-tabs::before,
                .playlists-tabs::before {
                    content: '';
                    position: absolute;
                    top: 50%; left: 20%;
                    right: 20%; height: 2px;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        ${colors.journalAccent}44 20%, 
                        ${colors.journalAccent}44 80%, 
                        transparent 100%);
                    z-index: 1;
                    animation: dataFlow 3s ease-in-out infinite;
                }

                /* Tab Button Styling */
                .world-tab,
                .storylines-tab,
                .plans-tab,
                .characters-tab,
                .playlists-tab {
                    background: radial-gradient(circle, 
                        ${colors.containerBg} 0%, 
                        ${colors.headerBg} 60%, 
                        ${colors.journalAccent}33 100%);
                    color: ${colors.navText};
                    border: 2px solid ${colors.journalAccent}44;
                    border-radius: 20px;
                    padding: 8px 16px;
                    margin: 0 4px;
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position: relative;
                    z-index: 2;
                    box-shadow: 
                        0 0 15px ${colors.journalAccent}22,
                        inset 0 0 10px ${colors.containerBg}66;
                }

                .world-tab:hover:not(.active),
                .storylines-tab:hover:not(.active),
                .plans-tab:hover:not(.active),
                .characters-tab:hover:not(.active),
                .playlists-tab:hover:not(.active) {
                    background: radial-gradient(circle, 
                        ${colors.journalAccent}22 0%, 
                        ${colors.containerBg} 50%, 
                        ${colors.journalAccent}55 100%);
                    color: ${colors.textPrimary};
                    border-color: ${colors.journalAccent}77;
                    transform: scale(1.05);
                    box-shadow: 
                        0 0 25px ${colors.journalAccent}44,
                        inset 0 0 15px ${colors.journalAccent}22;
                }

                .world-tab.active,
                .storylines-tab.active,
                .plans-tab.active,
                .characters-tab.active,
                .playlists-tab.active {
                    background: radial-gradient(circle, 
                        ${colors.journalAccent} 0%, 
                        ${colors.journalAccent}88 30%, 
                        ${colors.containerBg} 70%, 
                        ${colors.journalAccent}44 100%);
                    color: ${colors.navActiveText};
                    border-color: ${colors.journalAccent};
                    transform: scale(1.1);
                    box-shadow: 
                        0 0 35px ${colors.journalAccent}66,
                        0 0 60px ${colors.journalAccent}33,
                        inset 0 0 20px ${colors.journalAccent}44;
                    animation: activeNode 4s ease-in-out infinite;
                }

                /* Search and filter as data input nodes */
                .search-filter-container,
                .character-filter-container {
                    background: radial-gradient(ellipse at 50% 50%, 
                        ${colors.headerBg} 0%, 
                        ${colors.navBg} 70%);
                    border: 2px solid ${colors.journalAccent}44;
                    border-radius: 12px;
                    padding: 15px;
                    margin: 15px 0;
                    position: relative;
                    box-shadow: 
                        0 0 20px ${colors.journalAccent}22,
                        inset 0 0 15px ${colors.journalAccent}11;
                }

                /* Input connection points */
                .search-filter-container::before,
                .character-filter-container::before {
                    content: '◉';
                    position: absolute;
                    top: -8px; left: 15px;
                    color: ${colors.journalAccent};
                    font-size: 16px;
                    animation: inputConnection 3s ease-in-out infinite;
                }

                .search-filter-container input,
                .character-filter-container input {
                    background: ${colors.containerBg};
                    border: 2px solid ${colors.journalAccent}55;
                    border-radius: 25px;
                    color: ${colors.textPrimary};
                    padding: 8px 15px;
                    font-family: ${fonts.ui};
                    box-shadow: inset 0 0 10px ${colors.journalAccent}22;
                }

                .search-filter-container input:focus,
                .character-filter-container input:focus {
                    border-color: ${colors.journalAccent};
                    box-shadow: 
                        0 0 15px ${colors.journalAccent}44,
                        inset 0 0 15px ${colors.journalAccent}33;
                    outline: none;
                }

                /* Back to top as exit node */
                .back-to-top {
                    background: radial-gradient(circle, 
                        ${colors.journalAccent}88 0%, 
                        ${colors.navBg} 70%, 
                        ${colors.journalAccent}44 100%);
                    border: 2px solid ${colors.journalAccent};
                    border-radius: 25px;
                    color: ${colors.containerBg};
                    font-family: ${fonts.ui};
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    padding: 10px 20px;
                    box-shadow: 
                        0 0 25px ${colors.journalAccent}44,
                        inset 0 0 15px ${colors.journalAccent}33;
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                }

                .back-to-top:hover {
                    background: radial-gradient(circle, 
                        ${colors.journalAccent} 0%, 
                        ${colors.journalAccent}99 50%, 
                        ${colors.navBg} 100%);
                    transform: scale(1.1);
                    box-shadow: 
                        0 0 40px ${colors.journalAccent}66,
                        0 0 70px ${colors.journalAccent}33,
                        inset 0 0 20px ${colors.journalAccent}44;
                }

                /* Word count styling */
                .section-title .wordcount-display-small {
                    background: ${colors.containerBg};
                    border: 2px solid ${colors.journalAccent}55;
                    border-radius: 15px;
                    padding: 3px 8px;
                    font-size: 0.4em;
                    font-weight: 600;
                    color: ${colors.journalAccent};
                    font-family: ${fonts.ui};
                    margin-left: 8px;
                    vertical-align: middle;
                    box-shadow: 0 0 10px ${colors.journalAccent}33;
                }

                @keyframes nodeConnection {
                    0%, 100% { 
                        box-shadow: 
                            0 0 20px ${colors.journalAccent}33,
                            inset 0 0 15px ${colors.journalAccent}22;
                    }
                    50% { 
                        box-shadow: 
                            0 0 30px ${colors.journalAccent}44,
                            inset 0 0 25px ${colors.journalAccent}33;
                    }
                }

                @keyframes connectionPulse {
                    0%, 100% { 
                        transform: scale(1);
                        opacity: 0.7;
                    }
                    50% { 
                        transform: scale(1.3);
                        opacity: 1;
                    }
                }

                @keyframes dataFlow {
                    0%, 100% { 
                        opacity: 0.3;
                        transform: scaleX(1);
                    }
                    50% { 
                        opacity: 0.8;
                        transform: scaleX(1.1);
                    }
                }

                @keyframes activeNode {
                    0%, 100% { 
                        box-shadow: 
                            0 0 35px ${colors.journalAccent}66,
                            0 0 60px ${colors.journalAccent}33,
                            inset 0 0 20px ${colors.journalAccent}44;
                    }
                    50% { 
                        box-shadow: 
                            0 0 50px ${colors.journalAccent}88,
                            0 0 90px ${colors.journalAccent}44,
                            inset 0 0 30px ${colors.journalAccent}55;
                    }
                }

                @keyframes inputConnection {
                    0%, 100% { 
                        transform: scale(1);
                        color: ${colors.journalAccent};
                    }
                    33% { 
                        transform: scale(1.2);
                        color: ${colors.journalAccent}cc;
                    }
                    66% { 
                        transform: scale(0.9);
                        color: ${colors.journalAccent}88;
                    }
                }
            `;
    }
}

// Export functions
export default worldCategoriesHeaderStyles;
export { generatePageHeaderStyles };