// custom-navigation-styles.js - Horizontal navigation button styles for Custom Pages

function generateHorizontalNavigationStyles(colors, fonts) {
    return `
        /* Horizontal Links Container Styles */
        .horizontal-links-container {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-md, 16px);
            margin: var(--space-xl, 24px) 0;
        }

        .horizontal-links-container.center-aligned {
            justify-content: center;
        }

        .horizontal-links-container.left-aligned {
            justify-content: flex-start;
        }

        .horizontal-links-container.right-aligned {
            justify-content: flex-end;
        }

        .horizontal-links-container.centered-spacing {
            gap: var(--space-md, 16px);
        }

        .horizontal-links-container.tight-spacing {
            gap: var(--space-sm, 8px);
        }

        .horizontal-links-container.loose-spacing {
            gap: var(--space-lg, 20px);
        }

        /* Modern Style - Flat with underlines */
        .horizontal-links-container.modern-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: ${colors.textPrimary};
            text-decoration: none;
            text-transform: uppercase;
            font-weight: 500;
            font-size: 14px;
            transition: border-color 0.2s ease;
            font-family: ${fonts.primary};
        }

        .horizontal-links-container.modern-nav .horizontal-nav-btn:hover {
            border-bottom-color: ${colors.concepts};
        }

        /* Classic Style - Bordered */
        .horizontal-links-container.classic-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: ${colors.headerBg};
            border: 1px solid ${colors.borderPrimary};
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.primary};
            transition: background-color 0.2s ease;
        }

        .horizontal-links-container.classic-nav .horizontal-nav-btn:hover {
            background: ${colors.bgSecondary};
        }

        /* Pills Style - Rounded */
        .horizontal-links-container.pills-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: ${colors.headerBg};
            border: 1px solid ${colors.borderPrimary};
            border-radius: 25px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.pills-nav .horizontal-nav-btn:hover {
            background: ${colors.textSecondary};
            color: ${colors.containerBg};
        }

        /* Underline Style - Minimal */
        .horizontal-links-container.underline-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.underline-nav .horizontal-nav-btn:hover {
            color: ${colors.textPrimary};
            border-bottom-color: ${colors.textSecondary};
        }

        /* Kawaii Style - Cute pastels */
        .horizontal-links-container.kawaii-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(135deg, ${colors.containerBg}ee 0%, ${colors.headerBg}dd 100%);
            border: 2px solid ${colors.textMuted}33;
            border-radius: 25px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            text-transform: lowercase;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 4px 12px ${colors.textMuted}22;
            position: relative;
        }

        .horizontal-links-container.kawaii-nav .horizontal-nav-btn::before {
            content: '✦';
            position: absolute;
            top: -8px; right: -5px;
            color: ${colors.textMuted}66;
            font-size: 12px;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.kawaii-nav .horizontal-nav-btn:hover {
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.concepts}44 100%);
            color: ${colors.textPrimary};
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 20px ${colors.textMuted}44;
        }

        .horizontal-links-container.kawaii-nav .horizontal-nav-btn:hover::before {
            opacity: 1;
            color: ${colors.concepts};
        }

        /* Hearts Style - Cute heart theme */
        .horizontal-links-container.hearts-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px 12px;
            background: linear-gradient(45deg, ${colors.containerBg} 0%, ${colors.headerBg}88 100%);
            border: 1px solid ${colors.textMuted}44;
            border-radius: 15px 15px 8px 8px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            text-transform: lowercase;
            transition: all 0.2s ease;
            position: relative;
        }

        .horizontal-links-container.hearts-nav .horizontal-nav-btn::after {
            content: '♡';
            position: absolute;
            top: -2px;
            right: 8px;
            color: ${colors.textMuted}55;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.hearts-nav .horizontal-nav-btn:hover {
            background: linear-gradient(45deg, ${colors.containerBg} 0%, ${colors.factions}33 100%);
            color: ${colors.textPrimary};
            border-color: ${colors.factions}66;
        }

        .horizontal-links-container.hearts-nav .horizontal-nav-btn:hover::after {
            content: '♥';
            color: ${colors.factions};
            transform: scale(1.2);
        }

        /* Industrial Style - Angular */
        .horizontal-links-container.industrial-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: ${colors.headerBg};
            border: 1px solid ${colors.borderPrimary};
            border-left: 4px solid ${colors.journalAccent};
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.accent};
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.2s ease;
            clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%);
        }

        .horizontal-links-container.industrial-nav .horizontal-nav-btn:hover {
            background: ${colors.journalAccent};
            color: ${colors.containerBg};
        }

        /* Player's Handbook Style - Ornate */
        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 50%, ${colors.headerBg} 100%);
            border: 2px solid ${colors.textMuted}44;
            border-top-color: ${colors.journalAccent}33;
            border-radius: 8px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.secondary};
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px ${colors.textMuted}33, inset 0 1px 2px ${colors.containerBg}aa;
            position: relative;
        }

        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn::before {
            content: '◆';
            position: absolute;
            top: 2px; left: 8px;
            color: ${colors.journalAccent}66;
            font-size: 10px;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn::after {
            content: '◆';
            position: absolute;
            top: 2px; right: 8px;
            color: ${colors.journalAccent}66;
            font-size: 10px;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn:hover {
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.headerBg} 50%, ${colors.containerBg} 100%);
            border-top-color: ${colors.journalAccent}66;
            box-shadow: 0 4px 12px ${colors.textMuted}44, inset 0 1px 3px ${colors.containerBg}cc;
        }

        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn:hover::before,
        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn:hover::after {
            color: ${colors.journalAccent};
            transform: scale(1.1);
        }

        /* Horrific Style - Cursed grimoire */
        .horizontal-links-container.horrific-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 15px 25px;
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
            border: 1px solid ${colors.textMuted}66;
            border-top: 2px solid transparent;
            border-radius: 8px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.secondary};
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            transition: all 0.2s ease;
            position: relative;
        }

        .horizontal-links-container.horrific-nav .horizontal-nav-btn::after {
            content: "\\f06e"; /* FontAwesome eye icon */
            font-family: "Font Awesome 5 Free", "Font Awesome 6 Free", ${fonts.ui};
            font-weight: 900;
            position: absolute;
            top: 3px; right: 8px;
            color: ${colors.journalAccent};
            font-size: 12px;
            opacity: 0.8;
            text-shadow: 0 0 6px ${colors.journalAccent}66;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.horrific-nav .horizontal-nav-btn:hover {
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.textMuted}44 100%);
            border-top-color: ${colors.journalAccent};
            text-shadow: 0 0 8px ${colors.journalAccent}77;
            box-shadow: 0 3px 12px rgba(0,0,0,0.4);
        }

        .horizontal-links-container.horrific-nav .horizontal-nav-btn:hover::after {
            opacity: 1;
            color: ${colors.journalAccent};
            text-shadow: 0 0 10px ${colors.journalAccent}88;
        }

        /* Parchment & Quill Style - Elegant */
        .horizontal-links-container.parchment-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.bodyBg} 50%, ${colors.headerBg} 100%);
            border: 1px solid ${colors.textMuted}44;
            border-radius: 12px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 400;
            letter-spacing: 0.8px;
            text-transform: lowercase;
            font-variant: small-caps;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px ${colors.textMuted}22, inset 0 1px 2px ${colors.containerBg}dd;
            position: relative;
        }

        .horizontal-links-container.parchment-nav .horizontal-nav-btn::after {
            content: '';
            position: absolute;
            top: 0; left: 30%;
            width: 40%; height: 2px;
            background: linear-gradient(90deg, transparent 0%, ${colors.textMuted}33 50%, transparent 100%);
        }

        .horizontal-links-container.parchment-nav .horizontal-nav-btn:hover {
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.containerBg}ee 50%, ${colors.bodyBg} 100%);
            color: ${colors.textPrimary};
            box-shadow: 0 6px 16px ${colors.textMuted}44, 0 4px 15px rgba(139,69,19,0.12), inset 0 1px 3px ${colors.containerBg}ee;
            border-color: ${colors.textMuted}66;
        }

        .horizontal-links-container.parchment-nav .horizontal-nav-btn:hover::after {
            background: linear-gradient(90deg, transparent 0%, ${colors.textMuted}55 50%, transparent 100%);
            height: 3px;
        }

        /* Floating Style - Modern elevated buttons */
        .horizontal-links-container.floating-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: ${colors.containerBg};
            border: none;
            border-radius: 8px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px ${colors.textMuted}33;
            transform: translateY(0);
        }

        .horizontal-links-container.floating-nav .horizontal-nav-btn:hover {
            background: ${colors.headerBg};
            transform: translateY(-2px);
            box-shadow: 0 8px 24px ${colors.textMuted}44;
        }

        /* Neon Style - Cyberpunk glowing buttons */
        .horizontal-links-container.neon-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: transparent;
            border: 2px solid ${colors.concepts};
            border-radius: 4px;
            color: ${colors.concepts};
            text-decoration: none;
            font-family: ${fonts.accent};
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px ${colors.concepts}44;
        }

        .horizontal-links-container.neon-nav .horizontal-nav-btn:hover {
            background: ${colors.concepts};
            color: ${colors.containerBg};
            box-shadow: 0 0 20px ${colors.concepts}88, inset 0 0 20px ${colors.concepts}44;
            text-shadow: 0 0 5px ${colors.containerBg};
        }

        /* Vintage Style - Classic typewriter aesthetic */
        .horizontal-links-container.vintage-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: ${colors.containerBg};
            border: 3px solid ${colors.textPrimary};
            border-radius: 0;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.secondary};
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.2s ease;
            position: relative;
        }

        .horizontal-links-container.vintage-nav .horizontal-nav-btn::before {
            content: '';
            position: absolute;
            top: 3px; left: 3px; right: -3px; bottom: -3px;
            background: ${colors.textPrimary};
            z-index: -1;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.vintage-nav .horizontal-nav-btn:hover {
            color: ${colors.containerBg};
        }

        .horizontal-links-container.vintage-nav .horizontal-nav-btn:hover::before {
            top: 0; left: 0; right: 0; bottom: 0;
        }

        /* Glassmorphism Style - Modern glass effect */
        .horizontal-links-container.glass-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: ${colors.containerBg}aa;
            backdrop-filter: blur(10px);
            border: 1px solid ${colors.textMuted}33;
            border-radius: 16px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 8px 32px ${colors.textMuted}22;
        }

        .horizontal-links-container.glass-nav .horizontal-nav-btn:hover {
            background: ${colors.headerBg}cc;
            border-color: ${colors.textMuted}55;
            transform: translateY(-1px);
            box-shadow: 0 12px 40px ${colors.textMuted}33;
        }

        /* Steampunk Style - Victorian industrial */
        .horizontal-links-container.steampunk-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(145deg, ${colors.headerBg} 0%, ${colors.containerBg} 50%, ${colors.headerBg} 100%);
            border: 2px solid ${colors.textMuted}66;
            border-radius: 0 12px 0 12px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.secondary};
            font-weight: 500;
            text-transform: capitalize;
            transition: all 0.2s ease;
            box-shadow: inset 2px 2px 4px ${colors.containerBg}aa, inset -2px -2px 4px ${colors.textMuted}44;
            position: relative;
        }

        .horizontal-links-container.steampunk-nav .horizontal-nav-btn::after {
            content: '⚙';
            position: absolute;
            top: -4px; right: -4px;
            color: ${colors.textMuted}77;
            font-size: 12px;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.steampunk-nav .horizontal-nav-btn:hover {
            background: linear-gradient(145deg, ${colors.containerBg} 0%, ${colors.headerBg} 50%, ${colors.containerBg} 100%);
            box-shadow: inset -2px -2px 4px ${colors.containerBg}aa, inset 2px 2px 4px ${colors.textMuted}44;
        }

        .horizontal-links-container.steampunk-nav .horizontal-nav-btn:hover::after {
            color: ${colors.textSecondary};
            transform: rotate(90deg);
        }

        /* Minimalist Line Style - Ultra clean */
        .horizontal-links-container.line-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: transparent;
            border: none;
            border-bottom: 1px solid transparent;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 400;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.line-nav .horizontal-nav-btn:hover {
            color: ${colors.textPrimary};
            border-bottom-color: ${colors.textPrimary};
        }

        /* Brutalist Style - Bold and geometric */
        .horizontal-links-container.brutalist-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 16px 24px;
            background: ${colors.textPrimary};
            border: none;
            border-radius: 0;
            color: ${colors.containerBg};
            text-decoration: none;
            font-family: ${fonts.accent};
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.1s ease;
            box-shadow: 4px 4px 0px ${colors.textMuted};
        }

        .horizontal-links-container.brutalist-nav .horizontal-nav-btn:hover {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px ${colors.textMuted};
}
    `;
}

// Make function globally available
export { generateHorizontalNavigationStyles };