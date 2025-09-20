// category-styles.js - World Category Header Styles

function generateCategoryStyles(style, colors, fonts) {
    if (!style || style === 'default') {
        return ''; // Use base CSS from generator
    }

    switch (style) {
        case 'hidden':
            return `
                /* World Category Headers - Hidden */
                .world-category-title,
                h3.world-category-title {
                    display: none;
                }
            `;

        case 'enhanced':
            return `
                /* World Category Headers - Enhanced */
                .world-category-title,
                h3.world-category-title {
                    border-bottom: 3px solid ${colors.textContent};
                    padding-bottom: 8px;
                    margin-bottom: 25px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: ${colors.textTitle};
                }
            `;

        case 'boxed':
            return `
                /* World Category Headers - Boxed */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.navHover};
                    border: 2px solid ${colors.navBg};
                    padding: 12px 20px;
                    margin-bottom: 20px;
                    border-radius: 6px;
                    text-align: center;
                    color: ${colors.navText};
                }
            `;

        case 'accent':
            return `
                /* World Category Headers - Accent Bar */
                .world-category-title,
                h3.world-category-title {
                    border-left: 6px solid ${colors.textContent};
                    padding-left: 15px;
                    margin-bottom: 20px;
                    background: linear-gradient(90deg, ${colors.navHover}15 0%, transparent 100%);
                    padding-top: 8px;
                    padding-bottom: 8px;
                    color: ${colors.textTitle}
                }
            `;

        case 'underlined':
            return `
                /* World Category Headers - Underlined */
                .world-category-title,
                h3.world-category-title {
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid ${colors.textContent};
                    border-radius: 0;
                    padding: 8px 0 12px 0;
                    margin-bottom: 20px;
                    color: ${colors.textTitle};
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                }
            `;

        case 'simple':
            return `
                /* World Category Headers - Simple */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.headerBg};
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 4px;
                    padding: 10px 15px;
                    margin-bottom: 18px;
                    color: ${colors.textTitle};
                    font-weight: 600;
                }
            `;

        case 'bordered':
            return `
                /* World Category Headers - Bordered */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.containerBg};
                    border: 2px solid ${colors.textContent};
                    border-radius: 0;
                    padding: 12px 18px;
                    margin-bottom: 20px;
                    color: ${colors.textTitle};
                    text-align: center;
                    font-weight: 600;
                }
            `;

        case 'minimal':
            return `
                /* World Category Headers - Minimal */
                .world-category-title,
                h3.world-category-title {
                    background: transparent;
                    border: none;
                    border-radius: 0;
                    padding: 5px 0;
                    margin-bottom: 15px;
                    color: ${colors.textMuted};
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 0.9em;
                    font-weight: 400;
                }
            `;

        case 'clean':
            return `
                /* World Category Headers - Clean */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.softBg};
                    border: none;
                    border-left: 3px solid ${colors.textContent};
                    border-radius: 0;
                    padding: 12px 20px;
                    margin-bottom: 20px;
                    color: ${colors.textTitle};
                    font-weight: 500;
                }
            `;

        case 'kawaii':
            return `
                /* World Category Headers - Kawaii */
                .world-category-title,
                h3.world-category-title {
                    background: linear-gradient(135deg, 
                        ${colors.kawaiiPink}20 0%, 
                        ${colors.kawaiiPurple}15 50%, 
                        ${colors.kawaiiBlue}20 100%);
                    border: 2px solid ${colors.kawaiiPink}60;
                    border-radius: 20px;
                    padding: 12px 20px 12px 35px;
                    margin-bottom: 20px;
                    text-align: center;
                    color: ${colors.textTitle};
                    position: relative;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .world-category-title::before,
                h3.world-category-title::before {
                    content: "♡";
                    position: absolute;
                    left: 15px; top: 50%;
                    transform: translateY(-50%);
                    color: ${colors.kawaiiPink};
                    font-size: 16px;
                }
            `;

        case 'candyPop':
            return `
                /* World Category Headers - Candy Pop */
                .world-category-title,
                h3.world-category-title {
                    background: linear-gradient(135deg, 
                        rgba(255,255,255,0.8) 0%, 
                        rgba(255,255,255,0.4) 30%,
                        rgba(255,255,255,0.6) 70%,
                        rgba(255,255,255,0.9) 100%);
                    border: 3px solid ${colors.textContent}80;
                    border-radius: 25px;
                    padding: 15px 25px;
                    margin-bottom: 25px;
                    text-align: center;
                    color: ${colors.textTitle};
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 700;
                    backdrop-filter: blur(2px);
                    box-shadow: 
                        0 8px 32px rgba(0,0,0,0.1),
                        inset 0 4px 8px rgba(255,255,255,0.9),
                        inset 0 -2px 4px rgba(0,0,0,0.1);
                }
            `;

        case 'magicalGirl':
            return `
                /* World Category Headers - Magical Girl */
                .world-category-title,
                h3.world-category-title {
                    background: linear-gradient(135deg, 
                        ${colors.softBg} 0%, 
                        ${colors.headerBg} 50%, 
                        ${colors.containerBg} 100%);
                    border: 2px solid ${colors.textContent}50;
                    border-radius: 15px;
                    padding: 15px 20px 15px 40px;
                    margin-bottom: 25px;
                    color: ${colors.textTitle};
                    text-transform: lowercase;
                    font-variant: small-caps;
                    letter-spacing: 1px;
                    position: relative;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                }

                .world-category-title::before,
                h3.world-category-title::before {
                    content: "\\2605";
                    position: absolute;
                    left: 15px; top: 50%;
                    transform: translateY(-50%);
                    color: ${colors.textContent}80;
                    font-size: 18px;
                }

                .world-category-title::after,
                h3.world-category-title::after {
                    content: "\\2605";
                    position: absolute;
                    right: 15px; top: 50%;
                    transform: translateY(-50%);
                    color: ${colors.textContent}60;
                    font-size: 12px;
                }
            `;

        case 'industrial':
            return `
                /* World Category Headers - Industrial */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.headerBg};
                    border: none;
                    border-left: 8px solid ${colors.textContent};
                    border-top: 1px solid ${colors.bannerBorder};
                    border-right: 1px solid ${colors.bannerBorder};
                    border-bottom: 1px solid ${colors.bannerBorder};
                    border-radius: 0;
                    padding: 12px 20px;
                    margin-bottom: 20px;
                    color: ${colors.textTitle};
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 600;
                    clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);
                }
            `;

        case 'wuxia':
            return `
                /* World Category Headers - Wuxia */
                .world-category-title,
                h3.world-category-title {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.wuxiaGlow}30 100%);
                    border: 1px solid ${colors.bannerBorder};
                    border-left: 4px solid ${colors.wuxiaAccent};
                    border-radius: 8px;
                    padding: 15px 20px 15px 25px;
                    margin-bottom: 25px;
                    color: ${colors.textTitle};
                    text-transform: lowercase;
                    font-variant: small-caps;
                    letter-spacing: 1px;
                    position: relative;
                    box-shadow: 
                        0 2px 12px rgba(0,0,0,0.04),
                        inset 0 1px 3px ${colors.containerBg}80;
                }

                .world-category-title::after,
                h3.world-category-title::after {
                    content: "⋄";
                    position: absolute;
                    right: 15px; top: 50%;
                    transform: translateY(-50%);
                    color: ${colors.wuxiaAccent}50;
                    font-size: 16px;
                }
            `;

        case 'playersHandbook':
            return `
                /* World Category Headers - Player's Handbook */
                .world-category-title,
                h3.world-category-title {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent} 0%, 
                        ${colors.sexuality} 75%, 
                        ${colors.fighting} 100%);
                    color: ${colors.containerBg};
                    border: 2px solid ${colors.fighting};
                    border-radius: 0;
                    padding: 18px 25px;
                    margin-bottom: 25px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 700;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
                    text-align: center;
                    position: relative;
                    box-shadow: 0 4px 8px ${colors.textPrimary}33;
                }

                .world-category-title::before,
                h3.world-category-title::before {
                    content: '';
                    position: absolute;
                    top: 5px; left: 5px;
                    width: 12px; height: 12px;
                    border-top: 2px solid ${colors.containerBg};
                    border-left: 2px solid ${colors.containerBg};
                }

                .world-category-title::after,
                h3.world-category-title::after {
                    content: '';
                    position: absolute;
                    bottom: 5px; right: 5px;
                    width: 12px; height: 12px;
                    border-bottom: 2px solid ${colors.containerBg};
                    border-right: 2px solid ${colors.containerBg};
                }
            `;

        case 'adventurersTome':
            return `
                /* World Category Headers - Adventurer's Tome */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.navBg};
                    color: ${colors.navText};
                    border: none;
                    border-left: 5px solid ${colors.locations};
                    border-bottom: 3px solid #3d2a1c;
                    border-radius: 0;
                    padding: 12px 20px;
                    margin-bottom: 15px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                    box-shadow: inset 0 -2px 5px rgba(0,0,0,0.3);
                }
            `;

        case 'horrific':
            return `
                /* World Category Headers - Horrific */
                .world-category-title,
                h3.world-category-title {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}25 0%, 
                        rgba(0,0,0,0.15) 50%, 
                        ${colors.journalAccent}15 100%);
                    border: 1px solid ${colors.journalAccent}60;
                    border-left: 6px solid ${colors.journalAccent};
                    border-radius: 0;
                    padding: 15px 20px 15px 35px;
                    margin-bottom: 25px;
                    color: ${colors.textTitle};
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 600;
                    position: relative;
                    box-shadow: 
                        0 4px 20px rgba(0,0,0,0.6),
                        inset 0 1px 3px ${colors.journalAccent}33;
                }

                .world-category-title::before,
                h3.world-category-title::before {
                    content: "◉";
                    position: absolute;
                    left: 12px; top: 50%;
                    transform: translateY(-50%);
                    color: ${colors.journalAccent}99;
                    font-size: 14px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                }
            `;

        case 'parchmentQuill':
            return `
                /* World Category Headers - Parchment&Quill */
                .world-category-title,
                h3.world-category-title {
                    background: linear-gradient(135deg, 
                        rgba(245,245,220,0.4) 0%, 
                        rgba(250,240,230,0.3) 100%);
                    border: 1px solid rgba(139,69,19,0.2);
                    border-left: 4px solid rgba(139,69,19,0.4);
                    border-radius: 6px;
                    padding: 15px 20px 15px 25px;
                    margin-bottom: 20px;
                    color: ${colors.textTitle};
                    text-transform: lowercase;
                    font-variant: small-caps;
                    letter-spacing: 1px;
                    position: relative;
                    box-shadow: 
                        0 2px 8px rgba(139,69,19,0.06),
                        inset 0 1px 2px rgba(255,255,255,0.7);
                }

                .world-category-title::after,
                h3.world-category-title::after {
                    content: "✒";
                    position: absolute;
                    right: 15px; top: 50%;
                    transform: translateY(-50%);
                    color: rgba(139,69,19,0.3);
                    font-size: 16px;
                }
            `;

        case 'cyberpunk':
            return `
                /* World Category Headers - Cyberpunk: Simple neon terminal headers */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.navBg};
                    border: 1px solid ${colors.journalAccent}66;
                    border-left: 4px solid ${colors.journalAccent};
                    border-radius: 0;
                    padding: 10px 20px;
                    margin-bottom: 15px;
                    color: ${colors.journalAccent};
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 700;
                    text-shadow: 0 0 8px ${colors.journalAccent}66;
                }
            `;

        case 'holographic':
            return `
                /* World Category Headers - Holographic: Subtle iridescent headers */
                .world-category-title,
                h3.world-category-title {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.containerBg} 100%);
                    border: 2px solid ${colors.journalAccent}44;
                    border-radius: 6px;
                    padding: 12px 20px;
                    margin-bottom: 18px;
                    color: ${colors.journalAccent};
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                    text-shadow: 0 0 5px ${colors.journalAccent}88;
                }
            `;

        case 'digitalMinimal':
            return `
                /* World Category Headers - Digital Minimal: Clean tech headers */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.headerBg};
                    border: none;
                    border-bottom: 2px solid ${colors.journalAccent};
                    border-radius: 0;
                    padding: 5px 5px 5px 8px;
                    margin-bottom: 15px;
                    color: ${colors.journalAccent};
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    font-weight: 700;
                    font-size: 0.9em;
                }
            `;

        case 'neonBoxed':
            return `
                /* World Category Headers - Neon Boxed: Simple bordered headers */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.containerBg};
                    border: 2px solid ${colors.journalAccent};
                    border-radius: 0;
                    padding: 12px 18px;
                    margin-bottom: 20px;
                    color: ${colors.journalAccent};
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                    text-align: center;
                    box-shadow: 0 0 10px ${colors.journalAccent}33;
                }
            `;

        case 'dataLabel':
            return `
                /* World Category Headers - Data Label: File system style headers */
                .world-category-title,
                h3.world-category-title {
                    background: ${colors.navBg}88;
                    border: 1px solid ${colors.journalAccent}44;
                    border-radius: 4px;
                    padding: 8px 15px;
                    margin-bottom: 15px;
                    color: ${colors.journalAccent};
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                    font-size: 0.85em;
                    font-family: 'Courier New', monospace;
                }

                .world-category-title::before,
                h3.world-category-title::before {
                    content: '// ';
                    color: ${colors.journalAccent}77;
                }
            `;

        default:
            return '';
    }
}

// Make function globally available
export { generateCategoryStyles };