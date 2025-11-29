// COMPLETE: Generate card style CSS with ALL base styles included
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
        description: 'Ornate medieval manuscript cards with illuminated portraits'
    },
    'adventurersTome': {
        name: 'Adventurer\'s Tome',
        description: 'Well-worn for the discerning adventurer'
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

function generateCardStyleCSS(appearance, colors, fonts) {
    const cardStyle = appearance.cardStyle || 'current';

    const plansGridStyles = `
        .plans-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .plan-card {
            background: ${colors.headerBg};
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            cursor: pointer;
            border: 1px solid var(--plan-border-color, ${colors.textMuted}33);
            transition: all 0.2s ease;
            
            display: flex;
            flex-direction: column;
            min-height: 220px;
        }

        .plan-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-color: ${colors.textMuted}66;
        }
    `

    const plGridStyles = `
            /* Playlists Grid Layout */
        .playlists-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
            margin-top: 20px;
        }

        /* Individual Playlist Card */
        .playlist-card {
            background: ${colors.containerBg};
            border: 1px solid ${colors.textMuted}40;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 325px;
            max-height: 400px;
            overflow: hidden;
        }

        .playlist-card:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        /* Hide filtered playlist cards */
        .playlist-card[style*="display: none"] {
            display: none !important;
        }
    `;

    // Base styles that ALL card styles need (grid layout and essential functionality)
    const baseGridStyles = `
        /* Character Grid Layout - Common to all styles */
        .characters-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
            gap: 15px !important;
            margin-top: 20px !important;
            width: 100% !important;
        }

        .character-card {
            /* Force grid item behavior */
            width: auto !important;
            max-width: none !important;
            min-width: 160px !important;
        }

        .character-card.hidden {
            display: none !important;
        }

        .character-image {
            width: 100% !important;
            height: 200px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: ${colors.textSecondary} !important;
            font-size: 12px !important;
            object-fit: cover !important;
        }

        .character-name {
            padding: 12px !important;
            text-align: center !important;
            font-size: 14px !important;
            font-weight: bold !important;
            font-family: ${fonts.ui} !important;
            color: ${colors.textPrimary} !important;
        }

        .character-card-tags {
            padding: 8px 12px 12px 12px !important;
        }

        .character-card-tag {
            display: inline-block !important;
            font-size: 10px !important;
            background: ${colors.textMuted}66 !important;
            color: ${colors.textPrimary} !important;
            padding: 2px 6px !important;
            border-radius: 3px !important;
            margin: 2px 2px 0 0 !important;
            font-weight: 500 !important;
            font-family: ${fonts.ui} !important;
        }
    `;
    
    switch (cardStyle) {
        case 'modern':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Modern Card Style */
                .character-card {
                    background: ${colors.containerBg};
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    cursor: pointer;
                    border: none;
                    transition: all 0.3s ease;
                }
                
                .character-card:hover {
                    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                }
                
                .character-card .character-image {
                    background: ${colors.headerBg}66;
                }
                
                .character-card .character-name {
                    background: transparent;
                    border-top: 1px solid ${colors.textMuted}22;
                    font-size: 15px;
                    padding: 16px;
                }
                
                .character-card .character-card-tags {
                    background: ${colors.headerBg}33;
                    border-top: 1px solid ${colors.textMuted}22;
                }
                
                .storyline-card {
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    border: none;
                    background: ${colors.containerBg};
                    transition: all 0.3s ease;
                    cursor: pointer;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    min-height: 200px;
                }
                
                .storyline-card:hover {
                    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                }
                
                .plan-card {
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    border: none;
                    background: ${colors.containerBg};
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .plan-card:hover {
                    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                }
                
                .playlist-card {
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    border: none;
                    background: ${colors.containerBg};
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .playlist-card:hover {
                    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                }`;

        case 'minimal':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Minimal Card Style */
                .character-card {
                    background: transparent;
                    border-radius: 0;
                    overflow: visible;
                    box-shadow: none;
                    cursor: pointer;
                    border: 1px solid ${colors.textMuted}44;
                    transition: all 0.2s ease;
                }
                
                .character-card:hover {
                    border-color: ${colors.textMuted}88;
                    background: ${colors.headerBg}22;
                    box-shadow: none;
                }
                
                .character-card .character-image {
                    background: ${colors.headerBg}44;
                }
                
                .character-card .character-name {
                    background: transparent;
                    border-top: 1px solid ${colors.textMuted}44;
                    font-weight: 500;
                }
                
                .character-card .character-card-tags {
                    background: transparent;
                    border-top: 1px solid ${colors.textMuted}33;
                }
                
                .storyline-card {
                    border-radius: 0;
                    box-shadow: none;
                    border: 1px solid ${colors.textMuted}44;
                    background: transparent;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    min-height: 200px;
                }
                
                .storyline-card:hover {
                    border-color: ${colors.textMuted}88;
                    background: ${colors.headerBg}33;
                    box-shadow: none;
                }
                
                .plan-card {
                    border-radius: 0;
                    box-shadow: none;
                    border: 1px solid ${colors.textMuted}44;
                    background: transparent;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                
                .plan-card:hover {
                    border-color: ${colors.textMuted}88;
                    background: ${colors.headerBg}33;
                    box-shadow: none;
                }
                
                .playlist-card {
                    border-radius: 0;
                    box-shadow: none;
                    border: 1px solid ${colors.textMuted}44;
                    background: transparent;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                
                .playlist-card:hover {
                    border-color: ${colors.textMuted}88;
                    background: ${colors.headerBg}33;
                    box-shadow: none;
                }`;

        case 'detailed':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Detailed Card Style */
                .character-card {
                    background: linear-gradient(145deg, ${colors.containerBg}, ${colors.headerBg});
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1);
                    cursor: pointer;
                    border: 2px solid ${colors.textMuted}33;
                    transition: all 0.3s ease;
                }
                
                .character-card:hover {
                    box-shadow: 0 6px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2);
                    border-color: ${colors.textMuted}66;
                }
                
                .character-card .character-image {
                    background: ${colors.headerBg}88;
                    border-bottom: 2px solid ${colors.textMuted}33;
                }
                
                .character-card .character-name {
                    background: linear-gradient(135deg, ${colors.headerBg}, ${colors.containerBg});
                    border-top: 1px solid ${colors.textMuted}55;
                    font-weight: 700;
                    padding: 14px;
                }
                
                .character-card .character-card-tags {
                    background: linear-gradient(135deg, ${colors.containerBg}, ${colors.headerBg});
                    border-top: 2px solid ${colors.textMuted}44;
                    padding: 10px 14px 14px 14px;
                }
                
                .storyline-card {
                    border-radius: 8px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1);
                    border: 2px solid ${colors.textMuted}33;
                    background: linear-gradient(145deg, ${colors.containerBg}, ${colors.headerBg});
                    transition: all 0.3s ease;
                    cursor: pointer;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    min-height: 200px;
                }
                
                .storyline-card:hover {
                    box-shadow: 0 6px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2);
                    border-color: ${colors.textMuted}66;
                }
                
                .plan-card {
                    border-radius: 8px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1);
                    border: 2px solid ${colors.textMuted}33;
                    background: linear-gradient(145deg, ${colors.containerBg}, ${colors.headerBg});
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .plan-card:hover {
                    box-shadow: 0 6px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2);
                    border-color: ${colors.textMuted}66;
                }
                
                .playlist-card {
                    border-radius: 8px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1);
                    border: 2px solid ${colors.textMuted}33;
                    background: linear-gradient(145deg, ${colors.containerBg}, ${colors.headerBg});
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .playlist-card:hover {
                    box-shadow: 0 6px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2);
                    border-color: ${colors.textMuted}66;
                }`;

        case 'current':
        default:
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Current/Default Card Style */
                .character-card {
                    background: ${colors.headerBg};
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    cursor: pointer;
                    border: 1px solid ${colors.textMuted}33;
                    transition: all 0.2s ease;
                }
                
                .character-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border-color: ${colors.textMuted}66;
                }
                
                .character-card .character-image {
                    background: ${colors.headerBg};
                }
                
                .character-card .character-name {
                    background: ${colors.headerBg};
                }
                
                .character-card .character-card-tags {
                    background: ${colors.headerBg};
                    border-top: 1px solid ${colors.textMuted}33;
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
                }
                
                .plan-card {
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
                
                .plan-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border-color: ${colors.textMuted}66;
                }
                
                .playlist-card {
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
                
                .playlist-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border-color: ${colors.textMuted}66;
                }`;

        case 'corporate':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Corporate Card Style - Professional and clean */
                .character-card, .storyline-card, .plan-card, .playlist-card {
                    background: ${colors.containerBg};
                    border: 2px solid ${colors.textMuted}22;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
                    cursor: pointer;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .character-card:hover, .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    border-color: ${colors.textSecondary};
                    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
                }

                .character-card .character-image {
                    background: ${colors.headerBg} !important;
                    border-bottom: 2px solid ${colors.textMuted}22 !important;
                }

                .character-card .character-name {
                    background: ${colors.headerBg}44 !important;
                    border-top: 1px solid ${colors.textMuted}33 !important;
                    font-family: ${fonts.ui} !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    padding: 16px 12px !important;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .character-card .character-card-tags {
                    background: ${colors.headerBg}22 !important;
                    border-top: 1px solid ${colors.textMuted}22 !important;
                    padding: 12px !important;
                }

                .character-card .character-card-tag {
                    background: ${colors.textSecondary}22 !important;
                    color: ${colors.textPrimary} !important;
                    border: 1px solid ${colors.textMuted}44 !important;
                    border-radius: 2px !important;
                    padding: 3px 6px !important;
                    margin: 2px 3px 0 0 !important;
                    font-weight: 600 !important;
                    font-size: 9px !important;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .storyline-card, .plan-card {
                    min-height: 200px;
                    padding: 20px;
                    border-left: 4px solid ${colors.textMuted}66;
                }

                .storyline-card:hover, .plan-card:hover {
                    border-left-color: ${colors.textSecondary};
                }

                .playlist-card {
                    padding: 18px;
                    border-top: 4px solid ${colors.textMuted}66;
                }

                .playlist-card:hover {
                    border-top-color: ${colors.textSecondary};
                }
            `;

        case 'vintage':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Vintage Card Style - Retro feel without being too themey */
                .character-card, .storyline-card, .plan-card, .playlist-card {
                    background: ${colors.containerBg};
                    border: 1px solid ${colors.textMuted}44;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.6);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .character-card:hover, .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    border-color: ${colors.textMuted}77;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.16), inset 0 1px 3px rgba(255,255,255,0.8);
                    background: ${colors.headerBg}11;
                }

                .character-card .character-image {
                    background: ${colors.headerBg}77 !important;
                    border-bottom: 2px solid ${colors.textMuted}33 !important;
                    filter: sepia(0.1) contrast(1.1);
                }

                .character-card .character-name {
                    background: linear-gradient(135deg, ${colors.headerBg}33, ${colors.containerBg}) !important;
                    border-top: 1px solid ${colors.textMuted}44 !important;
                    font-family: ${fonts.secondary} !important;
                    font-weight: 500 !important;
                    font-size: 14px !important;
                    padding: 15px 12px !important;
                }

                .character-card .character-card-tags {
                    background: ${colors.headerBg}22 !important;
                    border-top: 1px solid ${colors.textMuted}33 !important;
                    padding: 12px !important;
                }

                .character-card .character-card-tag {
                    background: ${colors.textMuted}55 !important;
                    color: ${colors.containerBg} !important;
                    border: 1px solid ${colors.textMuted}77 !important;
                    border-radius: 4px !important;
                    padding: 3px 7px !important;
                    margin: 2px 3px 0 0 !important;
                    font-weight: 500 !important;
                    font-size: 10px !important;
                    box-shadow: inset 0 1px 1px rgba(255,255,255,0.2);
                }

                .storyline-card, .plan-card {
                    min-height: 200px;
                    padding: 22px;
                }

                .playlist-card {
                    padding: 18px;
                }
            `;

        case 'frost':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Frost Card Style - Clean with subtle transparency effects */
                .character-card, .storyline-card, .plan-card, .playlist-card {
                    background: linear-gradient(135deg, ${colors.containerBg}ee, ${colors.headerBg}cc);
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    backdrop-filter: blur(1px);
                }

                .character-card:hover, .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    border-color: ${colors.textMuted}55;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
                    background: linear-gradient(135deg, ${colors.containerBg}, ${colors.headerBg}dd);
                }

                .character-card .character-image {
                    background: ${colors.headerBg}88 !important;
                    border-bottom: 1px solid ${colors.textMuted}33 !important;
                }

                .character-card .character-name {
                    background: rgba(255,255,255,0.4) !important;
                    border-top: 1px solid ${colors.textMuted}33 !important;
                    font-family: ${fonts.ui} !important;
                    font-weight: 500 !important;
                    font-size: 14px !important;
                    padding: 16px 12px !important;
                    backdrop-filter: blur(2px);
                }

                .character-card .character-card-tags {
                    background: rgba(255,255,255,0.2) !important;
                    border-top: 1px solid ${colors.textMuted}22 !important;
                    padding: 12px !important;
                }

                .character-card .character-card-tag {
                    background: ${colors.textMuted}66 !important;
                    color: ${colors.textPrimary} !important;
                    border: 1px solid ${colors.textMuted}33 !important;
                    border-radius: 5px !important;
                    padding: 3px 8px !important;
                    margin: 2px 3px 0 0 !important;
                    font-weight: 500 !important;
                    font-size: 10px !important;
                    backdrop-filter: blur(1px);
                }

                .storyline-card, .plan-card {
                    min-height: 200px;
                    padding: 22px;
                }

                .playlist-card {
                    padding: 18px;
                }
            `;

        case 'slate':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Slate Card Style - Modern flat design with good contrast */
                .character-card, .storyline-card, .plan-card, .playlist-card {
                    background: ${colors.containerBg};
                    border: none;
                    border-radius: 0;
                    overflow: hidden;
                    box-shadow: 0 0 0 1px ${colors.textMuted}44, 0 2px 8px rgba(0,0,0,0.06);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .character-card:hover, .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    box-shadow: 0 0 0 2px ${colors.textSecondary}, 0 4px 16px rgba(0,0,0,0.1);
                    background: ${colors.headerBg}33;
                }

                .character-card .character-image {
                    background: ${colors.textMuted}22 !important;
                    border-bottom: 3px solid ${colors.textMuted}66 !important;
                }

                .character-card .character-name {
                    background: ${colors.textMuted}11 !important;
                    border: none !important;
                    font-family: ${fonts.ui} !important;
                    font-weight: 600 !important;
                    font-size: 15px !important;
                    padding: 18px 14px !important;
                    color: ${colors.textPrimary} !important;
                }

                .character-card .character-card-tags {
                    background: transparent !important;
                    border: none !important;
                    padding: 14px !important;
                }

                .character-card .character-card-tag {
                    background: ${colors.textSecondary} !important;
                    color: ${colors.containerBg} !important;
                    border: none !important;
                    border-radius: 0 !important;
                    padding: 4px 8px !important;
                    margin: 2px 4px 0 0 !important;
                    font-weight: 600 !important;
                    font-size: 10px !important;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .storyline-card, .plan-card {
                    min-height: 200px;
                    padding: 24px;
                    border-left: 6px solid ${colors.textMuted}66;
                }

                .storyline-card:hover, .plan-card:hover {
                    border-left-color: ${colors.textSecondary};
                }

                .playlist-card {
                    padding: 20px;
                    border-bottom: 6px solid ${colors.textMuted}66;
                }

                .playlist-card:hover {
                    border-bottom-color: ${colors.textSecondary};
                }
            `;

        case 'kawaii':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Kawaii Card Style - Basic Cute */
                .character-card {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.headerBg}44 100%);
                    border-radius: 20px !important;
                    overflow: hidden;
                    box-shadow: 
                        0 4px 20px rgba(0,0,0,0.06),
                        0 1px 4px rgba(0,0,0,0.04);
                    cursor: pointer;
                    border: 2px solid ${colors.textMuted}22;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .character-card::before {
                    content: '♡';
                    position: absolute;
                    top: 8px; right: 12px;
                    color: ${colors.textMuted}33;
                    font-size: 16px;
                    z-index: 5;
                    transition: all 0.2s ease;
                }

                .character-card:hover {
                    border-color: ${colors.textMuted}66;
                    box-shadow: 
                        0 6px 25px rgba(0,0,0,0.08),
                        0 2px 8px rgba(0,0,0,0.06);
                }

                .character-card:hover::before {
                    content: '♥';
                    color: ${colors.linkColor}88;
                }
                
                .character-card .character-image {
                    background: ${colors.headerBg}66 !important;
                    border-bottom: none !important;
                    border-radius: 18px 18px 0 0 !important;
                    position: relative;
                    z-index: 2;
                }
                
                .character-card .character-name {
                    background: ${colors.containerBg} !important;
                    border-top: none !important;
                    font-family: ${fonts.secondary} !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    padding: 14px 12px !important;
                    position: relative;
                    z-index: 2;
                    text-align: center !important;
                }
                
                .character-card .character-card-tags {
                    background: ${colors.headerBg}22 !important;
                    border-top: none !important;
                    padding: 12px !important;
                    position: relative;
                    z-index: 2;
                    border-radius: 0 0 18px 18px;
                }

                .character-card .character-card-tag {
                    background: ${colors.linkColor}44 !important;
                    color: ${colors.textPrimary} !important;
                    border: none !important;
                    border-radius: 12px !important;
                    padding: 4px 10px !important;
                    margin: 3px 3px 0 0 !important;
                    font-weight: 500 !important;
                    font-size: 10px !important;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
                }

                .storyline-card, .plan-card, .playlist-card {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.headerBg}44 100%);
                    border-radius: 16px;
                    border: 2px solid ${colors.textMuted}22;
                    box-shadow: 
                        0 4px 20px rgba(0,0,0,0.06),
                        0 1px 4px rgba(0,0,0,0.04);
                    cursor: pointer;
                    padding: 20px;
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                }

                .storyline-card::before {
                    content: '✧';
                    position: absolute;
                    top: 15px; right: 18px;
                    color: ${colors.textMuted}44;
                    font-size: 18px;
                    z-index: 1;
                }

                .plan-card::before {
                    content: '☆';
                    position: absolute;
                    top: 15px; right: 18px;
                    color: ${colors.textMuted}44;
                    font-size: 18px;
                    z-index: 1;
                }

                .playlist-card::before {
                    content: '♪';
                    position: absolute;
                    top: 15px; right: 18px;
                    color: ${colors.textMuted}44;
                    font-size: 18px;
                    z-index: 1;
                }

                .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    border-color: ${colors.textMuted}66;
                    box-shadow: 
                        0 6px 25px rgba(0,0,0,0.08),
                        0 2px 8px rgba(0,0,0,0.06);
                }

                .storyline-card:hover::before,
                .plan-card:hover::before,
                .playlist-card:hover::before {
                    color: ${colors.linkColor}88;
                }

                .storyline-card > *, .plan-card > *, .playlist-card > * {
                    position: relative;
                    z-index: 2;
                }
            `;

        case 'pastelDream':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Pastel Dream Card Style - Ultra Soft Pastels */
                .character-card {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.headerBg}33 50%,
                        ${colors.softBg}66 100%);
                    border-radius: 24px !important;
                    overflow: hidden;
                    box-shadow: 
                        0 8px 32px rgba(0,0,0,0.04),
                        0 2px 8px rgba(0,0,0,0.02);
                    cursor: pointer;
                    border: 1px solid ${colors.textMuted}11;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .character-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: linear-gradient(
                        45deg,
                        transparent 30%,
                        rgba(255,255,255,0.1) 50%,
                        transparent 70%
                    );
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 1;
                    pointer-events: none;
                }

                .character-card:hover {
                    border-color: ${colors.linkColor}33;
                    box-shadow: 
                        0 12px 40px rgba(0,0,0,0.06),
                        0 4px 12px rgba(0,0,0,0.04);
                }

                .character-card:hover::before {
                    opacity: 1;
                }
                
                .character-card .character-image {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg}44 0%, 
                        ${colors.softBg}66 100%) !important;
                    border-bottom: none !important;
                    border-radius: 22px 22px 0 0 !important;
                    position: relative;
                    z-index: 2;
                }
                
                .character-card .character-name {
                    background: transparent !important;
                    border-top: none !important;
                    font-family: ${fonts.secondary} !important;
                    font-weight: 400 !important;
                    font-size: 15px !important;
                    padding: 16px 14px !important;
                    position: relative;
                    z-index: 2;
                    text-align: center !important;
                    letter-spacing: 0.5px;
                }
                
                .character-card .character-card-tags {
                    background: transparent !important;
                    border-top: none !important;
                    padding: 0 14px 16px 14px !important;
                    position: relative;
                    z-index: 2;
                }

                .character-card .character-card-tag {
                    background: ${colors.linkColor}22 !important;
                    color: ${colors.textSecondary} !important;
                    border: 1px solid ${colors.linkColor}33 !important;
                    border-radius: 16px !important;
                    padding: 5px 12px !important;
                    margin: 3px 3px 0 0 !important;
                    font-weight: 400 !important;
                    font-size: 11px !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
                }

                .storyline-card, .plan-card, .playlist-card {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.headerBg}33 50%,
                        ${colors.softBg}66 100%);
                    border-radius: 20px;
                    border: 1px solid ${colors.textMuted}11;
                    box-shadow: 
                        0 8px 32px rgba(0,0,0,0.04),
                        0 2px 8px rgba(0,0,0,0.02);
                    cursor: pointer;
                    padding: 24px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .storyline-card::before, .plan-card::before, .playlist-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: linear-gradient(
                        45deg,
                        transparent 30%,
                        rgba(255,255,255,0.1) 50%,
                        transparent 70%
                    );
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 1;
                    pointer-events: none;
                }

                .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    border-color: ${colors.linkColor}33;
                    box-shadow: 
                        0 12px 40px rgba(0,0,0,0.06),
                        0 4px 12px rgba(0,0,0,0.04);
                }

                .storyline-card:hover::before, .plan-card:hover::before, .playlist-card:hover::before {
                    opacity: 1;
                }

                .storyline-card > *, .plan-card > *, .playlist-card > * {
                    position: relative;
                    z-index: 2;
                }
            `;

        case 'candyPop':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Candy Pop Card Style - Sweet Bouncy Magic */
                .character-card {
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiPink}11 60%);
                    border: 3px solid ${colors.kawaiiPink}66;
                    border-radius: 25px !important;
                    overflow: hidden;
                    box-shadow: 
                        0 6px 20px ${colors.kawaiiPink}22,
                        inset 0 1px 0 rgba(255,255,255,0.6);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .character-card::before {
                    content: '';
                    position: absolute;
                    top: 5px; left: 5px; right: 5px;
                    height: 40%;
                    background: linear-gradient(135deg, 
                        rgba(255,255,255,0.4) 0%, 
                        rgba(255,255,255,0.1) 50%, 
                        transparent 100%);
                    border-radius: 20px 20px 40% 40%;
                    pointer-events: none;
                    z-index: 1;
                }

                .character-card:hover {
                    border-color: ${colors.kawaiiPink};
                    box-shadow: 
                        0 12px 35px ${colors.kawaiiPink}33,
                        inset 0 2px 0 rgba(255,255,255,0.8);
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiPink}22 60%);
                }
                
                .character-card .character-image {
                    background: ${colors.kawaiiPink}33 !important;
                    border-bottom: none !important;
                    border-radius: 22px 22px 0 0 !important;
                    position: relative;
                    z-index: 2;
                    filter: saturate(1.2) brightness(1.05);
                }
                
                .character-card .character-name {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiPink}22 100%) !important;
                    border-top: none !important;
                    font-family: ${fonts.secondary} !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    position: relative;
                    z-index: 2;
                    text-align: center !important;
                }
                
                .character-card .character-card-tags {
                    background: ${colors.kawaiiPink}11 !important;
                    border-top: none !important;
                    position: relative;
                    z-index: 2;
                    border-radius: 0 0 22px 22px;
                }

                .character-card .character-card-tag {
                    background: ${colors.kawaiiPurple}55 !important;
                    color: ${colors.containerBg} !important;
                    border: 2px solid ${colors.kawaiiPurple} !important;
                    border-radius: 15px !important;
                    padding: 4px 10px !important;
                    margin: 3px 3px 0 0 !important;
                    font-weight: 600 !important;
                    font-size: 10px !important;
                    box-shadow: 0 3px 8px ${colors.kawaiiPurple}44;
                    transition: all 0.2s ease;
                }

                .character-card:hover .character-card-tag {
                    box-shadow: 0 4px 12px ${colors.kawaiiPurple}66;
                }

                .storyline-card, .plan-card, .playlist-card {
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiBlue}11 60%);
                    border: 3px solid ${colors.kawaiiBlue}66;
                    border-radius: 20px;
                    box-shadow: 
                        0 6px 20px ${colors.kawaiiBlue}22,
                        inset 0 1px 0 rgba(255,255,255,0.6);
                    cursor: pointer;
                    padding: 22px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .storyline-card::before, .plan-card::before, .playlist-card::before {
                    content: '';
                    position: absolute;
                    top: 5px; left: 5px; right: 5px;
                    height: 30%;
                    background: linear-gradient(135deg, 
                        rgba(255,255,255,0.3) 0%, 
                        rgba(255,255,255,0.1) 50%, 
                        transparent 100%);
                    border-radius: 15px 15px 40% 40%;
                    pointer-events: none;
                    z-index: 1;
                }

                .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    border-color: ${colors.kawaiiBlue};
                    box-shadow: 
                        0 15px 40px ${colors.kawaiiBlue}33,
                        inset 0 2px 0 rgba(255,255,255,0.8);
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiBlue}22 60%);
                }

                .plan-card {
                    border-color: ${colors.kawaiiGold}66;
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiGold}11 60%);
                }

                .plan-card:hover {
                    border-color: ${colors.kawaiiGold};
                    box-shadow: 
                        0 15px 40px ${colors.kawaiiGold}33,
                        inset 0 2px 0 rgba(255,255,255,0.8);
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiGold}22 60%);
                }

                .playlist-card {
                    border-color: ${colors.kawaiiGreen}66;
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiGreen}11 60%);
                }

                .playlist-card:hover {
                    border-color: ${colors.kawaiiGreen};
                    box-shadow: 
                        0 15px 40px ${colors.kawaiiGreen}33,
                        inset 0 2px 0 rgba(255,255,255,0.8);
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.kawaiiGreen}22 60%);
                }

                .storyline-card > *, .plan-card > *, .playlist-card > * {
                    position: relative;
                    z-index: 2;
                }
            `;

case 'magicalGirl':
    return baseGridStyles + plGridStyles + plansGridStyles + `
        /* Magical Girl Card Style - Soft Gradients with Elegant Stars */
        .character-card {
            background: linear-gradient(135deg, 
                ${colors.containerBg} 0%, 
                ${colors.softBg} 50%, 
                ${colors.containerBg} 100%);
            border: 2px solid ${colors.textMuted}40;
            border-radius: 15px !important;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }

        .character-card::after {
            content: "\\f005";
            font-family: "Font Awesome 5 Free";
            font-weight: 900;
            position: absolute;
            top: 8px; right: 12px;
            font-size: 14px;
            opacity: 0.6;
            z-index: 3;
            color: ${colors.textMuted};
            transition: all 0.3s ease;
        }

        .character-card:hover {
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
            border-color: ${colors.textMuted}70;
        }

        .character-card:hover::after {
            opacity: 1;
            color: ${colors.textSecondary};
        }
        
        .character-card .character-image {
            background: ${colors.headerBg};
            background-image: linear-gradient(135deg, 
                ${colors.headerBg} 0%, 
                ${colors.softBg}66 100%);
            border-bottom: 1px solid ${colors.textMuted}33 !important;
            border-radius: 13px 13px 0 0 !important;
            position: relative;
            z-index: 2;
        }
        
        .character-card .character-name {
            background: linear-gradient(135deg, 
                ${colors.headerBg} 0%, 
                ${colors.softBg} 100%);
            border-top: none !important;
            font-family: ${fonts.secondary} !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            position: relative;
            z-index: 2;
            text-align: center !important;
        }
        
        .character-card .character-card-tags {
            background: linear-gradient(135deg, 
                ${colors.softBg} 0%, 
                ${colors.headerBg} 100%);
            border-top: none !important;
            position: relative;
            z-index: 2;
            border-radius: 0 0 13px 13px;
        }

        .character-card .character-card-tag {
            background: ${colors.textMuted}44 !important;
            color: ${colors.textPrimary} !important;
            border: 1px solid ${colors.textMuted}66 !important;
            border-radius: 8px !important;
            padding: 3px 8px !important;
            margin: 3px 3px 0 0 !important;
            font-weight: 500 !important;
            font-size: 10px !important;
            box-shadow: 0 2px 6px ${colors.textMuted}22;
        }

        .storyline-card, .plan-card, .playlist-card {
            background: linear-gradient(135deg, 
                ${colors.containerBg} 0%, 
                ${colors.softBg} 50%, 
                ${colors.containerBg} 100%);
            border: 2px solid ${colors.textMuted}40;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            cursor: pointer;
            padding: 24px;
            transition: all 0.3s ease;
            position: relative;
        }

        .storyline-card::before, .plan-card::before, .playlist-card::before {
            content: '';
            position: absolute;
            top: -2px; left: -2px; right: -2px; bottom: -2px;
            border-radius: 15px;
            padding: 2px;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: source-out;
            z-index: 1;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .storyline-card::before {
            background: linear-gradient(45deg, ${colors.factions}, ${colors.concepts}, ${colors.factions});
        }
        .plan-card::before {
            background: linear-gradient(45deg, ${colors.events}, ${colors.creatures}, ${colors.events});
        }
        .playlist-card::before {
            background: linear-gradient(45deg, ${colors.plants}, ${colors.concepts}, ${colors.plants});
        }

        .storyline-card::after, .plan-card::after, .playlist-card::after {
            font-family: "Font Awesome 5 Free";
            font-weight: 900;
            position: absolute;
            font-size: 8px;
            opacity: 0.25;
            z-index: 3;
            color: ${colors.textMuted};
            transition: opacity 0.3s ease;
        }
        .storyline-card::after { content: "\\f005"; top: 10px; right: 15px; }
        .plan-card::after { content: "\\f0d0"; top: 10px; right: 15px; }
        .playlist-card::after { content: "\\f001"; top: 10px; right: 15px; }

        .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .storyline-card:hover::before, .plan-card:hover::before, .playlist-card:hover::before {
            opacity: 1;
        }

        .storyline-card:hover::after, .plan-card:hover::after, .playlist-card:hover::after {
            opacity: 0.5;
        }

        .storyline-card, .plan-card {
            display: flex;
            flex-direction: column;
            min-height: 200px;
        }
        .plan-card { min-height: 220px; }
        .playlist-card {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .storyline-card > *, .plan-card > *, .playlist-card > * {
            position: relative;
            z-index: 2;
        }
    `;

        case 'industrial':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* --- Industrial Card Style: Gritty Urban --- */
                .character-card, .storyline-card, .plan-card, .playlist-card {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.containerBg} 100%);
                    border-radius: 0;
                    border: 2px solid rgba(0,0,0,0.3);
                    box-shadow: 
                        0 2px 8px rgba(0,0,0,0.4),
                        inset 0 1px 0 rgba(255,255,255,0.1),
                        inset 0 -1px 0 rgba(0,0,0,0.2);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }

                .character-card::before, .storyline-card::before, .plan-card::before, .playlist-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        radial-gradient(circle at 8px 8px, rgba(0,0,0,0.3) 2px, transparent 3px),
                        radial-gradient(circle at calc(100% - 8px) 8px, rgba(0,0,0,0.3) 2px, transparent 3px),
                        radial-gradient(circle at 8px calc(100% - 8px), rgba(0,0,0,0.3) 2px, transparent 3px),
                        radial-gradient(circle at calc(100% - 8px) calc(100% - 8px), rgba(0,0,0,0.3) 2px, transparent 3px),
                        repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px);
                    pointer-events: none;
                    z-index: 1;
                    transition: background 0.3s ease;
                }

                .character-card:hover, .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    border-color: ${colors.journalAccent || colors.textSecondary};
                    box-shadow: 
                        0 2px 8px rgba(0,0,0,0.6),
                        0 0 15px ${colors.journalAccent || colors.textSecondary}33,
                        inset 0 1px 0 rgba(255,255,255,0.2),
                        inset 0 -1px 0 rgba(0,0,0,0.3);
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.headerBg} 100%);
                }

                .character-card:hover::before, .storyline-card:hover::before, .plan-card:hover::before, .playlist-card:hover::before {
                    background: 
                        radial-gradient(circle at 8px 8px, rgba(0,0,0,0.4) 2px, transparent 3px),
                        radial-gradient(circle at calc(100% - 8px) 8px, rgba(0,0,0,0.4) 2px, transparent 3px),
                        radial-gradient(circle at 8px calc(100% - 8px), rgba(0,0,0,0.4) 2px, transparent 3px),
                        radial-gradient(circle at calc(100% - 8px) calc(100% - 8px), rgba(0,0,0,0.4) 2px, transparent 3px),
                        repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0.04) 2px);
                }

                .character-card .character-image {
                    background: ${colors.bodyBg} !important;
                    border-bottom: 2px solid rgba(0,0,0,0.3) !important;
                    filter: saturate(0.8) contrast(1.1);
                }

                .character-card .character-name {
                    background: linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%) !important;
                    border-top: 1px solid rgba(0,0,0,0.3) !important;
                    border-bottom: 1px solid rgba(0,0,0,0.2) !important;
                    font-family: ${fonts.headings || fonts.ui}, 'Courier New', monospace !important;
                    font-size: 12px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 1px !important;
                    color: ${colors.journalAccent || colors.textPrimary} !important;
                    padding: 12px !important;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
                }

                .character-card .character-name::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px);
                    pointer-events: none;
                }

                .character-card .character-card-tags {
                    background: rgba(0,0,0,0.15) !important;
                    border-top: 1px solid rgba(0,0,0,0.3) !important;
                    padding: 12px !important;
                }

                .character-card .character-card-tag {
                    background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%) !important;
                    color: ${colors.textSecondary} !important;
                    border: 1px solid rgba(255,255,255,0.2) !important;
                    border-radius: 0 !important;
                    padding: 3px 8px !important;
                    margin: 3px 3px 0 0 !important;
                    font-weight: 600 !important;
                    font-size: 9px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.8) !important;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2) !important;
                }

                .storyline-card, .plan-card {
                    min-height: 200px;
                    padding: 22px;
                }
                .plan-card { min-height: 220px; }

                .storyline-card::after {
                    content: '#' counter(storyline-counter, decimal-leading-zero);
                    position: absolute; top: 8px; right: 15px; font-family: 'Courier New', monospace; font-size: 11px;
                    font-weight: bold; color: rgba(0,0,0,0.4); letter-spacing: 1px;
                }

                .plan-card::after {
                    content: ''; position: absolute; top: 15px; right: 15px; width: 25px; height: 25px;
                    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 5px),
                                repeating-linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 5px);
                    opacity: 0.6;
                }

                .playlist-card {
                    border-right: 4px solid ${colors.journalAccent || colors.textSecondary};
                    border-top: 2px solid rgba(0,0,0,0.3);
                    padding: 18px;
                }

                .playlist-card::after {
                    content: ''; position: absolute; bottom: 12px; right: 12px; width: 20px; height: 15px;
                    background: 
                        linear-gradient(to top, ${colors.journalAccent || colors.textSecondary}66 0%, ${colors.journalAccent || colors.textSecondary}66 20%, transparent 20%),
                        linear-gradient(to top, ${colors.journalAccent || colors.textSecondary}44 0%, ${colors.journalAccent || colors.textSecondary}44 40%, transparent 40%) 4px 0,
                        linear-gradient(to top, ${colors.journalAccent || colors.textSecondary}88 0%, ${colors.journalAccent || colors.textSecondary}88 60%, transparent 60%) 8px 0,
                        linear-gradient(to top, ${colors.journalAccent || colors.textSecondary}33 0%, ${colors.journalAccent || colors.textSecondary}33 30%, transparent 30%) 12px 0,
                        linear-gradient(to top, ${colors.journalAccent || colors.textSecondary}77 0%, ${colors.journalAccent || colors.textSecondary}77 80%, transparent 80%) 16px 0;
                    background-size: 3px 100%; background-repeat: no-repeat; opacity: 0.7;
                }

                .character-card > *, .storyline-card > *, .plan-card > *, .playlist-card > * {
                    position: relative; z-index: 2;
                }

                .storylines-grid { counter-reset: storyline-counter; }
                .storyline-card { counter-increment: storyline-counter; }
            `;
        case 'wuxia':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* --- Wuxia Card Style: Cloud Recesses Elegance --- */
                .character-card, .storyline-card, .plan-card, .playlist-card {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.wuxiaGlow} 50%,
                        ${colors.containerBg} 100%);
                    border-radius: 8px;
                    box-shadow: 
                        0 3px 15px rgba(0,0,0,0.06),
                        0 1px 4px rgba(0,0,0,0.08),
                        inset 0 1px 2px rgba(255,255,255,0.8);
                    cursor: pointer;
                    border: 1px solid ${colors.wuxiaAccent}66;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }

                .character-card::before, .storyline-card::before, .plan-card::before, .playlist-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: 
                        repeating-linear-gradient(45deg, transparent, transparent 15px, ${colors.wuxiaAccent}11 15px, ${colors.wuxiaAccent}11 17px),
                        repeating-linear-gradient(-45deg, transparent, transparent 15px, ${colors.wuxiaAccent}08 15px, ${colors.wuxiaAccent}08 17px);
                    pointer-events: none; z-index: 1; opacity: 0.6; transition: all 0.3s ease;
                }

                .character-card:hover, .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    border-color: ${colors.wuxiaAccent}aa;
                    box-shadow: 
                        0 6px 25px rgba(0,0,0,0.08),
                        0 2px 8px rgba(0,0,0,0.1),
                        inset 0 1px 3px rgba(255,255,255,0.9);
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.wuxiaAccentLight}44 50%, ${colors.containerBg} 100%);
                }

                .character-card:hover::before, .storyline-card:hover::before, .plan-card:hover::before, .playlist-card:hover::before {
                    opacity: 1;
                    background: 
                        repeating-linear-gradient(45deg, transparent, transparent 15px, ${colors.wuxiaAccent}22 15px, ${colors.wuxiaAccent}22 17px),
                        repeating-linear-gradient(-45deg, transparent, transparent 15px, ${colors.wuxiaAccent}11 15px, ${colors.wuxiaAccent}11 17px);
                }
                
                .character-card .character-image {
                    background: ${colors.wuxiaAccent}22;
                    border-bottom: 2px solid ${colors.wuxiaAccent}55;
                }
                
                .character-card .character-name {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.wuxiaAccent}22 100%);
                    border-top: 1px solid ${colors.wuxiaAccent}55;
                    font-family: ${fonts.secondary} !important;
                    font-weight: 500 !important;
                    font-size: 15px !important;
                    text-align: center !important;
                    padding: 16px 12px !important;
                    letter-spacing: 0.3px;
                }

                .character-card .character-name::after {
                    content: ''; position: absolute; bottom: 0; left: 25%;
                    width: 50%; height: 1px;
                    background: linear-gradient(to right, transparent, ${colors.wuxiaAccent}cc, transparent);
                }
                
                .character-card .character-card-tags {
                    background: ${colors.wuxiaAccent}11;
                    border-top: 1px solid ${colors.wuxiaAccent}33;
                    padding: 12px !important;
                }

                .character-card .character-card-tag {
                    background: ${colors.wuxiaAccent}33 !important;
                    color: ${colors.textSecondary} !important;
                    border: 1px solid ${colors.wuxiaAccent}66 !important;
                    border-radius: 4px !important;
                    padding: 3px 8px !important;
                    margin: 3px 3px 0 0 !important;
                    font-weight: 400 !important;
                    font-size: 10px !important;
                    letter-spacing: 0.2px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .storyline-card, .plan-card {
                    min-height: 200px;
                    padding: 22px;
                }
                .storyline-card { border-top: 3px solid ${colors.wuxiaAccent}aa; }
                .plan-card { border-left: 3px solid ${colors.wuxiaAccent}aa; }
                .playlist-card { padding: 18px; border-right: 3px solid ${colors.wuxiaAccent}aa; }

                .plan-card::after {
                    content: 'ç­–'; position: absolute; top: 15px; right: 20px;
                    font-size: 20px; color: ${colors.wuxiaAccent}33; font-weight: bold; pointer-events: none;
                }
                .playlist-card::after {
                    content: '\\f001'; position: absolute; top: 12px; right: 15px;
                    font-size: 16px; color: ${colors.wuxiaAccent}44; pointer-events: none;
                }

                .character-card > *, .storyline-card > *, .plan-card > *, .playlist-card > * {
                    position: relative; z-index: 2;
                }
            `;

        case 'playersHandbook':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Player's Handbook Card Style - Ornate Medieval Manuscript */                
                .character-card {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.headerBg} 30%, ${colors.containerBg} 100%);
                    border: 3px solid ${colors.journalAccent};
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 3px ${colors.containerBg}aa, inset 0 0 0 1px ${colors.journalAccent}33;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .character-card::before {
                    content: ''; position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px;
                    border: 2px solid ${colors.journalAccent}44; border-radius: 8px;
                    background: 
                        radial-gradient(circle at 0% 0%, ${colors.journalAccent}66 0%, transparent 25%) top left,
                        radial-gradient(circle at 100% 0%, ${colors.journalAccent}66 0%, transparent 25%) top right,
                        radial-gradient(circle at 0% 100%, ${colors.journalAccent}66 0%, transparent 25%) bottom left,
                        radial-gradient(circle at 100% 100%, ${colors.journalAccent}66 0%, transparent 25%) bottom right;
                    background-size: 20px 20px; background-repeat: no-repeat;
                    pointer-events: none; z-index: 1; opacity: 0.6; transition: all 0.3s ease;
                }

                .character-card:hover {
                    box-shadow: 0 8px 30px rgba(0,0,0,0.2), 0 4px 15px rgba(0,0,0,0.15), inset 0 1px 4px ${colors.containerBg}cc, inset 0 0 0 1px ${colors.journalAccent}55;
                    border-color: ${colors.journalAccent}cc;
                }

                .character-card:hover::before {
                    opacity: 1; border-color: ${colors.journalAccent}66;
                }
                
                .character-card .character-image {
                    background: ${colors.headerBg}88 !important;
                    border-bottom: 3px double ${colors.journalAccent}88 !important;
                    box-shadow: inset 0 0 30px rgba(0,0,0,0.1);
                }
                
                .character-card .character-name {
                    background: linear-gradient(135deg, ${colors.journalAccent}22 0%, ${colors.headerBg} 50%, ${colors.journalAccent}22 100%) !important;
                    border-top: 2px solid ${colors.journalAccent}66 !important;
                    border-bottom: 1px solid ${colors.journalAccent}44 !important;
                    font-family: ${fonts.secondary} !important;
                    font-weight: 700 !important;
                    font-size: 14px !important;
                    text-align: center !important;
                    padding: 14px 12px !important;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-shadow: 0 1px 2px ${colors.containerBg}bb;
                }

                .character-card .character-name::first-letter {
                    font-size: 1.4em; color: ${colors.journalAccent}; font-weight: 900;
                    text-shadow: 1px 1px 2px ${colors.journalAccent}44;
                }
                
                .character-card .character-card-tags {
                    background: ${colors.headerBg}44 !important;
                    border-top: 1px solid ${colors.journalAccent}44 !important;
                    padding: 12px !important;
                }

                .character-card .character-card-tag {
                    background: linear-gradient(135deg, ${colors.journalAccent}88 0%, ${colors.journalAccent}66 100%) !important;
                    color: ${colors.navActiveText} !important;
                    border: 2px solid ${colors.journalAccent} !important;
                    border-radius: 6px !important;
                    padding: 4px 8px !important;
                    margin: 3px 3px 0 0 !important;
                    font-weight: 600 !important;
                    font-size: 9px !important;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px ${colors.containerBg}33;
                }

                .storyline-card, .plan-card, .playlist-card {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.headerBg} 50%, ${colors.containerBg} 100%);
                    border: 2px solid ${colors.journalAccent}88;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 3px ${colors.containerBg}aa;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    box-shadow: 0 6px 24px rgba(0,0,0,0.18), inset 0 1px 4px ${colors.containerBg}cc;
                }
                .storyline-card:hover { border-left-color: ${colors.journalAccent}cc; }
                .plan-card:hover { border-top-color: ${colors.journalAccent}cc; }
                .playlist-card:hover { border-bottom-color: ${colors.journalAccent}; }

                .storyline-card {
                    border-left: 6px solid ${colors.journalAccent};
                    border-radius: 8px;
                    padding: 24px;
                    display: flex; flex-direction: column; min-height: 200px;
                }

                .storyline-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: 
                        repeating-linear-gradient(0deg, transparent, transparent 22px, ${colors.textMuted}11 22px, ${colors.textMuted}11 23px),
                        linear-gradient(90deg, transparent 40px, ${colors.journalAccent}22 40px, ${colors.journalAccent}22 42px, transparent 42px);
                    pointer-events: none; z-index: 1;
                }
                
                .plan-card {
                    border: 3px solid ${colors.journalAccent}66; border-top: 5px solid ${colors.journalAccent};
                    border-radius: 6px; box-shadow: 0 4px 18px rgba(0,0,0,0.15), inset 0 2px 6px ${colors.containerBg}88;
                    padding: 22px; display: flex; flex-direction: column; min-height: 220px;
                }

                .plan-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: repeating-linear-gradient(0deg, transparent, transparent 19px, ${colors.journalAccent}11 19px, ${colors.journalAccent}11 20px),
                                repeating-linear-gradient(90deg, transparent, transparent 19px, ${colors.journalAccent}11 19px, ${colors.journalAccent}11 20px);
                    pointer-events: none; z-index: 1; opacity: 0.4; transition: opacity 0.3s ease;
                }
                .plan-card:hover::before { opacity: 0.6; }

                .plan-card::after {
                    content: '✦'; position: absolute; top: 12px; right: 15px; font-size: 20px;
                    color: ${colors.journalAccent}55; text-shadow: 0 0 8px ${colors.journalAccent}33;
                    pointer-events: none; z-index: 1; transition: all 0.3s ease;
                }
                .plan-card:hover::after {
                    color: ${colors.journalAccent}88; text-shadow: 0 0 12px ${colors.journalAccent}55;
                }
                
                .playlist-card {
                    border: 2px solid ${colors.journalAccent}66; border-bottom: 4px solid ${colors.journalAccent}88;
                    border-radius: 8px; box-shadow: 0 3px 12px rgba(0,0,0,0.1), inset 0 1px 3px ${colors.containerBg}aa;
                    padding: 20px; display: flex; flex-direction: column; gap: 12px;
                }

                .playlist-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: repeating-linear-gradient(0deg, transparent, transparent 15px, ${colors.journalAccent}22 15px, ${colors.journalAccent}22 16px, transparent 16px, transparent 19px, ${colors.journalAccent}11 19px, ${colors.journalAccent}11 20px);
                    pointer-events: none; z-index: 1; opacity: 0.5; transition: opacity 0.3s ease;
                }
                .playlist-card:hover::before { opacity: 0.8; }

                .playlist-card::after {
                    content: '𝄞'; position: absolute; bottom: 8px; right: 12px; font-size: 24px;
                    color: ${colors.journalAccent}44; pointer-events: none; z-index: 1; transition: all 0.3s ease;
                }
                .playlist-card:hover::after { color: ${colors.journalAccent}66; }

                .character-card > *, .storyline-card > *, .plan-card > *, .playlist-card > * {
                    position: relative; z-index: 2;
                }
            `;

        case 'adventurersTome':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* --- Adventurer's Tome Card Style --- */
                .character-card, .storyline-card, .plan-card, .playlist-card {
                    background: ${colors.navHover};
                    border-radius: 4px;
                    border: 1px solid ${colors.textSecondary};
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .character-card:hover, .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    border-color: ${colors.textPrimary};
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transform: none;
                    opacity: 0.8;
                }
                
                .character-card .character-image {
                    background: ${colors.navBg};
                    border-bottom: 2px solid ${colors.textPrimary};
                    box-shadow: inset 0 3px 6px rgba(0,0,0,0.25);
                }
                
                .character-card .character-name {
                    background: transparent;
                    font-family: ${fonts.accent}, serif;
                    font-size: 15px !important;
                    font-weight: 600 !important;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                    padding: 14px 12px 10px !important;
                    position: relative;
                }

                .character-card .character-name::after {
                    content: ''; display: block; width: 40%; height: 1px;
                    background: linear-gradient(to right, transparent, rgba(0,0,0,0.2), transparent);
                    margin: 10px auto -2px;
                }
                
                .character-card .character-card-tags {
                    background: transparent;
                    padding-top: 10px !important;
                }

                .character-card .character-card-tag {
                    background: ${colors.statusArchived} !important;
                    color: ${colors.navText} !important;
                    border: 1px solid rgba(0,0,0,0.4) !important;
                    border-radius: 3px !important;
                    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
                    font-weight: 600 !important;
                }

                .plan-character-tags .character-tag {
                    background: ${colors.statusCanon} !important;
                    color: ${colors.navText} !important;
                    border: 1px solid rgba(0,0,0,0.4) !important;
                    border-radius: 3px !important;
                    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
                    font-weight: 600 !important;
                }
                
                .storyline-card, .plan-card {
                    min-height: 200px; padding: 20px;
                }
                .playlist-card {
                    padding: 16px;
                }
                .playlist-card:hover {
                    transform: none;
                }
            `;

        case 'horrific':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Horrific Card Style - Cursed Portraits & Forbidden Tomes */
                .character-card {
                    background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.statusIdea}22 50%, ${colors.headerBg} 100%);
                    border-radius: 0 !important;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px ${colors.statusIdea}22;
                    cursor: pointer;
                    border: 2px solid ${colors.navText};
                    transition: all 0.4s ease;
                    position: relative;
                }

                .character-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: 
                        radial-gradient(circle at 30% 70%, ${colors.statusIdea}11 0%, transparent 40%),
                        radial-gradient(circle at 70% 30%, rgba(0,0,0,0.06) 0%, transparent 35%),
                        repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(0,0,0,0.01) 80px, rgba(0,0,0,0.01) 82px);
                    pointer-events: none; z-index: 1; transition: background 0.4s ease;
                }

                .character-card:hover {
                    box-shadow: 0 8px 30px rgba(0,0,0,0.8), 0 0 25px ${colors.statusIdea}44, inset 0 0 20px rgba(0,0,0,0.2), inset 0 1px 3px ${colors.statusIdea}33;
                    border-color: ${colors.statusIdea}66;
                }

                .character-card:hover::before {
                    background: 
                        radial-gradient(circle at 30% 70%, ${colors.statusIdea}22 0%, transparent 40%),
                        radial-gradient(circle at 70% 30%, rgba(0,0,0,0.08) 0%, transparent 35%),
                        repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(0,0,0,0.02) 80px, rgba(0,0,0,0.02) 82px);
                }
                
                .character-card .character-image {
                    background: ${colors.navBg} !important;
                    border-bottom: 2px solid ${colors.statusIdea}55 !important;
                    filter: saturate(0.8) contrast(1.1) brightness(0.9);
                    transition: filter 0.3s ease;
                }
                .character-card:hover .character-image {
                    filter: saturate(0.9) contrast(1.2) brightness(1);
                }
                
                .character-card .character-name {
                    background: linear-gradient(135deg, ${colors.statusIdea}33 0%, rgba(0,0,0,0.2) 100%) !important;
                    border-top: 1px solid ${colors.statusIdea}66 !important;
                    border-bottom: 1px solid ${colors.navText} !important;
                    font-family: ${fonts.accent} !important;
                    font-weight: 600 !important; font-size: 13px !important;
                    text-transform: uppercase; letter-spacing: 1px;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
                    padding: 14px 12px !important;
                }

                .character-card .character-name::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px);
                    pointer-events: none;
                }
                
                .character-card .character-card-tags {
                    background: rgba(0,0,0,0.15) !important;
                    border-top: 1px solid ${colors.navText} !important;
                    padding: 12px !important;
                }

                .character-card .character-card-tag {
                    background: linear-gradient(135deg, ${colors.statusIdea}44 0%, ${colors.statusIdea}22 100%) !important;
                    color: ${colors.textSecondary} !important;
                    border: 1px solid ${colors.statusIdea}55 !important;
                    border-radius: 0 !important;
                    padding: 3px 8px !important; margin: 3px 3px 0 0 !important;
                    font-weight: 500 !important; font-size: 10px !important;
                    text-transform: uppercase; letter-spacing: 0.5px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
                }

                .storyline-card, .plan-card, .playlist-card {
                    border-radius: 0;
                    border: 2px solid ${colors.navText};
                    box-shadow: 0 4px 20px rgba(0,0,0,0.6), inset 0 2px 6px rgba(0,0,0,0.2);
                    cursor: pointer;
                    transition: all 0.4s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .storyline-card:hover, .plan-card:hover, .playlist-card:hover {
                    box-shadow: 0 8px 35px rgba(0,0,0,0.8), 0 0 20px ${colors.statusIdea}55, inset 0 2px 6px rgba(0,0,0,0.15);
                    border-color: ${colors.statusIdea}88;
                }

                .storyline-card {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.statusIdea}11 50%, ${colors.headerBg} 100%);
                    border-top: 3px solid ${colors.statusIdea}aa;
                    padding: 25px;
                    display: flex; flex-direction: column; min-height: 200px;
                }

                .storyline-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: 
                        repeating-linear-gradient(90deg, transparent, transparent 35px, ${colors.statusIdea}05 35px, ${colors.statusIdea}05 37px),
                        repeating-linear-gradient(0deg, transparent, transparent 25px, rgba(0,0,0,0.02) 25px, rgba(0,0,0,0.02) 26px);
                    pointer-events: none; z-index: 1; transition: background 0.4s ease;
                }
                .storyline-card:hover::before {
                    background: 
                        repeating-linear-gradient(90deg, transparent, transparent 35px, ${colors.statusIdea}11 35px, ${colors.statusIdea}11 37px),
                        repeating-linear-gradient(0deg, transparent, transparent 25px, rgba(0,0,0,0.03) 25px, rgba(0,0,0,0.03) 26px);
                }
                
                .plan-card {
                    background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.statusIdea}16 30%, ${colors.containerBg} 100%);
                    border-left: 4px solid ${colors.statusIdea}cc;
                    padding: 22px;
                    display: flex; flex-direction: column; min-height: 220px;
                }
                .plan-card:hover { border-left-color: ${colors.statusIdea}; }
                
                .plan-card::before {
                    content: ''; position: absolute; top: 0; right: 0; width: 60px; height: 60px;
                    background: radial-gradient(circle, transparent 25%, ${colors.statusIdea}22 26%, ${colors.statusIdea}22 28%, transparent 29%),
                                radial-gradient(circle, transparent 35%, ${colors.statusIdea}11 36%, ${colors.statusIdea}11 38%, transparent 39%);
                    opacity: 0.6; pointer-events: none; z-index: 1; transition: opacity 0.4s ease;
                }
                .plan-card:hover::before { opacity: 1; }
                
                .playlist-card {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.statusIdea}08 50%, ${colors.headerBg} 100%);
                    border-top: 2px solid ${colors.statusIdea}88; border-bottom: 3px solid ${colors.statusIdea}55;
                    padding: 18px; display: flex; flex-direction: column; gap: 12px;
                }
                .playlist-card:hover { border-top-color: ${colors.statusIdea}cc; border-bottom-color: ${colors.statusIdea}aa; }
                
                .playlist-card::before {
                    content: '\\f001'; position: absolute; top: 8px; right: 12px;
                    color: ${colors.statusIdea}33; font-size: 24px; text-shadow: 0 0 8px ${colors.statusIdea}22;
                    pointer-events: none; z-index: 1; transition: all 0.3s ease;
                }
                .playlist-card:hover::before {
                    color: ${colors.statusIdea}55; text-shadow: 0 0 12px ${colors.statusIdea}44;
                }

                .characters-grid { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)) !important; gap: 20px !important; margin-top: 25px !important; }
                .character-card { min-width: 170px !important; }
                .character-image { height: 220px !important; }

                .character-card > *, .storyline-card > *, .plan-card > *, .playlist-card > * {
                    position: relative; z-index: 2;
                }
            `;

        case 'parchment':
            return baseGridStyles + plGridStyles + plansGridStyles + `
                /* Parchment&Quill Card Style - Elegant Regency Calling Cards */                
                .character-card, .storyline-card, .plan-card, .playlist-card {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.headerBg} 30%, 
                        ${colors.softBg} 70%, 
                        ${colors.headerBg} 100%);
                    border: 1px solid ${colors.textSecondary}44;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 
                        0 3px 12px ${colors.textSecondary}22,
                        inset 0 1px 3px rgba(255,255,255,0.8);
                    cursor: pointer;
                    transition: none; /* No hover effects for this style */
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .character-card::before, .storyline-card::before, .plan-card::before, .playlist-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        repeating-linear-gradient(45deg, transparent, transparent 10px, ${colors.textSecondary}03 10px, ${colors.textSecondary}03 11px),
                        radial-gradient(circle at 85% 15%, ${colors.headerBg}33 0%, transparent 25%);
                    pointer-events: none; z-index: 1; opacity: 0.7;
                }

                .character-card {
                    border-top: 3px solid ${colors.textSecondary}55;
                }

                .character-card .character-image {
                    background: ${colors.headerBg}44 !important;
                    border-bottom: 2px solid ${colors.textSecondary}33 !important;
                }

                .character-card .character-name {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.headerBg}44 100%) !important;
                    border-top: 1px solid ${colors.textSecondary}44 !important;
                    font-family: ${fonts.secondary} !important;
                    font-weight: 500 !important;
                    font-size: 15px !important;
                    text-align: center !important;
                    padding: 16px 12px !important;
                    letter-spacing: 0.5px;
                    text-transform: lowercase;
                    font-variant: small-caps;
                }

                .character-card .character-name::after {
                    content: ''; position: absolute; bottom: 6px; left: 25%;
                    width: 50%; height: 1px;
                    background: linear-gradient(to right, transparent, ${colors.textSecondary}66, transparent);
                }

                .character-card .character-card-tags {
                    background: ${colors.headerBg}33 !important;
                    border-top: 1px solid ${colors.textSecondary}33 !important;
                    padding: 12px !important;
                }

                .character-card .character-card-tag {
                    background: ${colors.textSecondary}22 !important;
                    color: ${colors.textSecondary} !important;
                    border: 1px solid ${colors.textSecondary}44 !important;
                    border-radius: 4px !important;
                    padding: 3px 8px !important; margin: 3px 3px 0 0 !important;
                    font-weight: 400 !important; font-size: 10px !important;
                    letter-spacing: 0.3px;
                    box-shadow: 0 1px 3px ${colors.textSecondary}16, inset 0 1px 1px rgba(255,255,255,0.5);
                }

                .storyline-card, .plan-card {
                    border-left: 3px solid ${colors.textSecondary}55;
                    min-height: 200px;
                    padding: 22px;
                }
                .plan-card { min-height: 220px; }
                
                .playlist-card {
                    border-bottom: 3px solid ${colors.textSecondary}55;
                    padding: 18px;
                }

                .playlist-card::after {
                    content: "\\f001"; position: absolute; bottom: 8px; right: 12px;
                    font-size: 14px; color: ${colors.textSecondary}55; z-index: 1;
                }

                .character-card > *, .storyline-card > *, .plan-card > *, .playlist-card > * {
                    position: relative; z-index: 2;
                }
            `;
    }
}

// Make globally available
export { generateCardStyleCSS };
export default cardStyles;