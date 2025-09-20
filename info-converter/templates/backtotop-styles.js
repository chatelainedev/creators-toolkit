// Updated backtotop-styles.js with template literal functions

const backToTopStyles = {
    circular: {
        name: 'Circular',
        description: 'Round button with shadow',
        icon: '↑',
        containerCss: (colors) => `
            border-radius: 50%;
            width: 50px;
            height: 50px;
            background: ${colors.navActive};
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText};
        `
    },
    square: {
        name: 'Square', 
        description: 'Square button with rounded corners',
        icon: '▲',
        containerCss: (colors) => `
            border-radius: 8px;
            width: 45px;
            height: 45px;
            background: ${colors.navActive};
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText};
        `
    },
    pill: {
        name: 'Pill',
        description: 'Elongated pill-shaped button',
        icon: '⤴',
        containerCss: (colors) => `
            border-radius: 25px;
            width: 60px;
            height: 35px;
            background: ${colors.navActive};
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText};
        `
    },
    minimal: {
        name: 'Minimal',
        description: 'Simple button with subtle styling',
        icon: '^',
        containerCss: (colors) => `
            border-radius: 4px;
            width: 40px;
            height: 40px;
            background: ${colors.containerBg};
            box-shadow: none;
            border: 1px solid ${colors.bannerBorder};
        `,
        iconCss: (colors) => `
            color: ${colors.textSecondary};
        `
    },
    kawaii: {
        name: 'Kawaii Heart',
        description: 'Adorable heart-shaped button with sparkles',
        icon: '♡',
        containerCss: (colors) => `
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            width: 55px;
            height: 48px;
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
            background: linear-gradient(135deg, #ff69b4 0%, #9b59b6 100%) !important;
            border: 2px solid ${colors.navActiveText};
        `,
        iconCss: (colors) => `
            color: ${colors.journalAccent || colors.textTitle} !important;
        `
    },
    candyPop: {
        name: 'Candy Button',
        description: 'Sweet bubbly button with glossy finish',
        icon: '🠹',
        containerCss: (colors) => `
            border-radius: 20px;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle at 30% 30%, #ff69b4 0%, ${colors.sexuality || colors.textSecondary} 60%) !important;
            box-shadow: 
                0 8px 25px rgba(255, 215, 0, 0.3),
                inset 0 2px 0 ${colors.navActiveText};
            border: 3px solid #ff69b4;
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText} !important;
        `
    },
    magicalGirl: {
        name: 'Magic Star',
        description: 'Sparkly star-shaped magical button',
        icon: '☆',
        containerCss: (colors) => `
            border-radius: 50%;
            width: 52px;
            height: 52px;
            background: linear-gradient(135deg, #9b59b6 0%, ${colors.personality || colors.textTitle} 100%) !important;
            box-shadow: 
                0 0 20px rgba(255, 215, 0, 0.3),
                0 4px 15px rgba(0,0,0,0.2);
            border: 2px solid ${colors.navActiveText};
            position: relative;
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText} !important;
        `
    },
    industrial: {
        name: 'Tech Panel',
        description: 'High-tech industrial panel button',
        icon: '⇱',
        containerCss: (colors) => `
            border-radius: 0;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, ${colors.navHover || colors.textSecondary} 0%, ${colors.navBg} 100%) !important;
            box-shadow: 
                0 2px 8px rgba(0,0,0,0.3),
                inset 0 1px 0 ${colors.navText};
            border: 1px solid ${colors.textSecondary};
            clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
        `,
        iconCss: (colors) => `
            color: ${colors.navText} !important;
        `
    },
    wuxia: {
        name: 'Jade Seal',
        description: 'Elegant jade seal with Chinese styling',
        icon: '上',
        containerCss: (colors) => `
            border-radius: 12px;
            width: 52px;
            height: 52px;
            background: linear-gradient(135deg, ${colors.wuxiaAccentLight || colors.headerBg} 0%, ${colors.wuxiaAccent || colors.textTitle} 100%) !important;
            box-shadow: 
                0 4px 15px rgba(255, 215, 0, 0.3),
                inset 0 2px 0 ${colors.navActiveText};
            border: 2px solid ${colors.wuxiaAccent || colors.textTitle};
            position: relative;
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText} !important;
        `
    },
    playersHandbook: {
        name: 'Scroll Seal',
        description: 'Medieval manuscript seal with wax effect',
        icon: '❋',
        containerCss: (colors) => `
            border-radius: 50%;
            width: 55px;
            height: 55px;
            background: radial-gradient(circle at 30% 30%, ${colors.journalAccent || colors.textTitle} 0%, ${colors.fighting || colors.textPrimary} 100%) !important;
            box-shadow: 
                0 4px 12px rgba(255, 215, 0, 0.3),
                inset 0 2px 0 ${colors.navActiveText};
            border: 3px solid ${colors.fighting || colors.textPrimary};
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText} !important;
        `
    },
    adventurersTome: {
        name: 'Leather Tab',
        description: 'Stitched leather bookmark tab',
        icon: '⌘',
        containerCss: (colors) => `
            border-radius: 6px;
            width: 50px;
            height: 42px;
            background: linear-gradient(135deg, ${colors.weapons || colors.headerBg} 0%, ${colors.background || colors.bodyBg} 100%) !important;
            box-shadow: 
                0 3px 10px rgba(0,0,0,0.3),
                inset 0 1px 0 ${colors.navText};
            border: 2px dashed ${colors.navBg};
        `,
        iconCss: (colors) => `
            color: ${colors.navText} !important;
        `
    },
    horrific: {
        name: 'Cursed Rune',
        description: 'Dark cursed rune with ominous glow',
        icon: '☠',
        containerCss: (colors) => `
            border-radius: 8px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.bodyBg} 100%) !important;
            box-shadow: 
                0 0 15px rgba(255, 215, 0, 0.3),
                0 4px 20px rgba(0,0,0,0.8),
                inset 0 1px 0 ${colors.wuxiaAccent || colors.textTitle};
            border: 1px solid ${colors.wuxiaAccent || colors.textTitle};
        `,
        iconCss: (colors) => `
            color: ${colors.quirks || colors.textMuted} !important;
        `
    },
    parchment: {
        name: 'Quill Scroll',
        description: 'Elegant parchment scroll with ink accent',
        icon: '↟',
        containerCss: (colors) => `
            border-radius: 15px;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, ${colors.bodyBg} 0%, ${colors.headerBg} 100%) !important;
            box-shadow: 
                0 3px 12px rgba(0,0,0,0.15),
                inset 0 1px 0 ${colors.textPrimary};
            border: 1px solid ${colors.bannerBorder};
        `,
        iconCss: (colors) => `
            color: ${colors.textPrimary} !important;
        `
    },
    floating: {
        name: 'Floating Orb',
        description: 'Ethereal floating orb with glow effect',
        icon: '🡼',
        containerCss: (colors) => `
            border-radius: 50%;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle at 30% 30%, ${colors.softBg} 0%, #3498db 100%) !important;
            box-shadow: 
                0 0 25px rgba(255, 215, 0, 0.3),
                0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid ${colors.navActiveText};
            backdrop-filter: blur(10px);
        `,
        iconCss: (colors) => `
            color: ${colors.textPrimary} !important;
        `
    },
    neon: {
        name: 'Neon Glow',
        description: 'Cyberpunk neon button with electric glow',
        icon: '⇪',
        containerCss: (colors) => `
            border-radius: 4px;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, ${colors.bodyBg} 0%, ${colors.containerBg} 100%) !important;
            box-shadow: 
                0 0 20px ${colors.journalAccent || colors.textTitle},
                0 0 40px rgba(255, 215, 0, 0.3),
                inset 0 0 10px rgba(255, 215, 0, 0.3);
            border: 1px solid ${colors.journalAccent || colors.textTitle};
        `,
        iconCss: (colors) => `
            color: ${colors.journalAccent || colors.textTitle} !important;
        `
    },
    crystal: {
        name: 'Crystal Gem',
        description: 'Crystalline gem button with prismatic effect',
        icon: '⭶',
        containerCss: (colors) => `
            border-radius: 8px;
            width: 46px;
            height: 46px;
            background: linear-gradient(135deg, ${colors.softBg} 0%, ${colors.kawaiiPurple} 50%, ${colors.personality || colors.textTitle} 100%) !important;
            box-shadow: 
                0 6px 20px ${colors.wuxiaGlow || 'rgba(255, 215, 0, 0.3)'},
                inset 0 2px 0 ${colors.navActiveText},
                inset 0 -2px 0 rgba(0,0,0,0.1);
            border: 1px solid ${colors.navActiveText};
            transform: rotate(45deg);
        `,
        iconCss: (colors) => `
            color: ${colors.textPrimary} !important;
        `
    },
    dragonScale: {
        name: 'Dragon Scale',
        description: 'Mythical dragon scale with flame glow',
        icon: '◈',
        containerCss: (colors) => `
            border-radius: 60% 40% 60% 40% / 70% 30% 70% 30%;
            width: 50px;
            height: 50px;
            background: radial-gradient(ellipse at 30% 30%, ${colors.kawaiiOrange} 0%, ${colors.fighting || colors.textPrimary} 70%) !important;
            box-shadow: 
                0 0 25px ${colors.wuxiaGlow || 'rgba(255, 107, 53, 0.6)'},
                0 4px 15px rgba(0,0,0,0.3),
                inset 0 2px 0 rgba(255, 255, 255, 0.2);
            border: 2px solid ${colors.fighting || colors.textPrimary};
        `,
        iconCss: (colors) => `
            color: ${colors.kawaiiGold} !important;
            text-shadow: 0 0 8px ${colors.wuxiaGlow || 'rgba(255, 255, 153, 0.8)'};
        `
    },
    elvishLeaf: {
        name: 'Elvish Leaf',
        description: 'Elegant elven leaf with nature magic',
        icon: '♦',
        containerCss: (colors) => `
            border-radius: 0 100% 0 100%;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, ${colors.plants || colors.kawaiiGreen} 0%, ${colors.cultivation || colors.textTitle} 100%) !important;
            box-shadow: 
                0 0 20px ${colors.wuxiaGlow || 'rgba(34, 139, 34, 0.5)'},
                0 4px 12px rgba(0,0,0,0.2);
            border: 2px solid ${colors.cultivation || colors.textTitle};
            transform: rotate(45deg);
        `,
        iconCss: (colors) => `
            color: ${colors.kawaiiGreen} !important;
            transform: rotate(-45deg);
            text-shadow: 0 0 6px ${colors.wuxiaGlow || 'rgba(144, 238, 144, 0.7)'};
        `
    },
    royalCrown: {
        name: 'Royal Crown',
        description: 'Majestic crown for noble houses',
        icon: '♔',
        containerCss: (colors) => `
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            width: 52px;
            height: 45px;
            background: linear-gradient(135deg, ${colors.kawaiiGold} 0%, ${colors.background || colors.textTitle} 100%) !important;
            box-shadow: 
                0 6px 20px ${colors.wuxiaGlow || 'rgba(255, 215, 0, 0.4)'},
                0 2px 8px rgba(0,0,0,0.3),
                inset 0 2px 0 rgba(255, 255, 255, 0.4);
            border: 3px solid ${colors.background || colors.textTitle};
        `,
        iconCss: (colors) => `
            color: ${colors.textPrimary} !important;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
        `
    },
    steampunkGear: {
        name: 'Steampunk Gear',
        description: 'Victorian clockwork gear mechanism',
        icon: '⚙',
        containerCss: (colors) => `
            border-radius: 20%;
            width: 50px;
            height: 50px;
            background: 
                radial-gradient(circle at 25% 25%, ${colors.weapons || colors.headerBg} 0%, ${colors.background || colors.textTitle} 100%) !important;
            box-shadow: 
                0 0 15px ${colors.wuxiaGlow || 'rgba(205, 133, 63, 0.3)'},
                0 4px 12px rgba(0,0,0,0.4),
                inset 0 2px 0 rgba(255, 255, 255, 0.2),
                inset 0 -2px 0 rgba(0,0,0,0.2);
            border: 2px solid ${colors.textPrimary};
            position: relative;
        `,
        iconCss: (colors) => `
            color: ${colors.textPrimary} !important;
            animation: spin 8s linear infinite;
        `
    },
    mysticOrb: {
        name: 'Mystic Orb',
        description: 'Swirling magical orb of power',
        icon: '◉',
        containerCss: (colors) => `
            border-radius: 50%;
            width: 50px;
            height: 50px;
            background: 
                radial-gradient(circle at 30% 30%, ${colors.kawaiiPurple}CC 0%, ${colors.personality || colors.textTitle} 100%) !important;
            box-shadow: 
                0 0 30px ${colors.wuxiaGlow || 'rgba(138, 43, 226, 0.6)'},
                0 4px 15px rgba(0,0,0,0.3),
                inset 0 0 20px rgba(255, 255, 255, 0.1);
            border: 1px solid ${colors.kawaiiPurple};
            backdrop-filter: blur(1px);
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText} !important;
            animation: pulse 2s ease-in-out infinite alternate;
        `
    },
    ancientRune: {
        name: 'Ancient Rune',
        description: 'Carved stone rune with ancient power',
        icon: 'ᚦ',
        containerCss: (colors) => `
            border-radius: 15%;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.textMuted} 100%) !important;
            box-shadow: 
                0 4px 15px rgba(0,0,0,0.5),
                inset 0 2px 0 rgba(255, 255, 255, 0.1),
                inset 0 -2px 0 rgba(0,0,0,0.3);
            border: 2px solid ${colors.textPrimary};
            text-shadow: 0 0 10px ${colors.wuxiaGlow || 'rgba(173, 216, 230, 0.7)'};
        `,
        iconCss: (colors) => `
            color: ${colors.kawaiiBlue} !important;
            font-weight: bold;
            text-shadow: 0 0 8px ${colors.wuxiaGlow || 'rgba(173, 216, 230, 0.8)'};
        `
    },
    phoenixFeather: {
        name: 'Phoenix Feather',
        description: 'Blazing phoenix feather with rebirth energy',
        icon: '♠',
        containerCss: (colors) => `
            border-radius: 70% 30% 70% 30% / 60% 40% 60% 40%;
            width: 45px;
            height: 52px;
            background: linear-gradient(45deg, ${colors.fighting || colors.textPrimary} 0%, ${colors.kawaiiOrange} 50%, ${colors.kawaiiGold} 100%) !important;
            box-shadow: 
                0 0 25px ${colors.wuxiaGlow || 'rgba(255, 69, 0, 0.6)'},
                0 4px 15px rgba(0,0,0,0.3);
            border: 2px solid ${colors.fighting || colors.textPrimary};
            transform: rotate(15deg);
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText} !important;
            transform: rotate(-15deg);
            text-shadow: 0 0 8px ${colors.wuxiaGlow || 'rgba(255, 215, 0, 0.8)'};
        `
    },
    cyberpunkHex: {
        name: 'Cyberpunk Hex',
        description: 'Futuristic hexagonal data node',
        icon: '⬡',
        containerCss: (colors) => `
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, ${colors.kawaiiBlue} 0%, ${colors.textTitle} 100%) !important;
            clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%);
            box-shadow: 
                0 0 20px ${colors.wuxiaGlow || 'rgba(0, 255, 255, 0.5)'},
                0 0 40px ${colors.wuxiaGlow || 'rgba(0, 128, 255, 0.3)'};
            border: 1px solid ${colors.kawaiiBlue};
        `,
        iconCss: (colors) => `
            color: ${colors.textPrimary} !important;
            font-weight: bold;
        `
    },
    bookSpine: {
        name: 'Book Spine',
        description: 'Classic leather-bound book spine',
        icon: '▮',
        containerCss: (colors) => `
            border-radius: 4px;
            width: 38px;
            height: 52px;
            background: linear-gradient(90deg, ${colors.background || colors.textTitle} 0%, ${colors.weapons || colors.headerBg} 50%, ${colors.background || colors.textTitle} 100%) !important;
            box-shadow: 
                0 4px 12px rgba(0,0,0,0.3),
                inset 2px 0 0 rgba(255, 255, 255, 0.1),
                inset -2px 0 0 rgba(0,0,0,0.2);
            border: 1px solid ${colors.textPrimary};
            border-left: 3px solid ${colors.textPrimary};
            border-right: 3px solid ${colors.textPrimary};
        `,
        iconCss: (colors) => `
            color: ${colors.kawaiiGold} !important;
            font-size: 16px;
        `
    },
    moonPhase: {
        name: 'Moon Phase',
        description: 'Celestial moon cycle symbol',
        icon: '☽',
        containerCss: (colors) => `
            border-radius: 50%;
            width: 50px;
            height: 50px;
            background: 
                radial-gradient(circle at 70% 30%, ${colors.headerBg} 0%, ${colors.textMuted} 100%) !important;
            box-shadow: 
                0 0 20px ${colors.wuxiaGlow || 'rgba(192, 192, 192, 0.4)'},
                0 4px 15px rgba(0,0,0,0.4),
                inset -10px -10px 20px rgba(0,0,0,0.2);
            border: 1px solid ${colors.textSecondary};
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText} !important;
            text-shadow: 0 0 8px ${colors.wuxiaGlow || 'rgba(245, 245, 220, 0.6)'};
        `
    },
    scrollQuill: {
        name: 'Scroll & Quill',
        description: 'Scholar\'s writing implement',
        icon: '✒',
        containerCss: (colors) => `
            border-radius: 8px;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.kawaiiGold} 100%) !important;
            box-shadow: 
                0 4px 12px rgba(0,0,0,0.2),
                inset 0 2px 0 rgba(255, 255, 255, 0.3);
            border: 2px solid ${colors.textMuted};
            position: relative;
        `,
        iconCss: (colors) => `
            color: ${colors.textPrimary} !important;
        `
    },
    diceD20: {
        name: 'D20 Die',
        description: 'Classic twenty-sided gaming die',
        icon: '⚃',
        containerCss: (colors) => `
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, ${colors.fighting || colors.textPrimary} 0%, ${colors.sexuality || colors.textSecondary} 100%) !important;
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
            box-shadow: 
                0 4px 15px rgba(0,0,0,0.3),
                inset 0 2px 0 rgba(255, 255, 255, 0.2);
            border: 1px solid ${colors.fighting || colors.textPrimary};
        `,
        iconCss: (colors) => `
            color: ${colors.navActiveText} !important;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        `
    },
    swordHilt: {
        name: 'Sword Hilt',
        description: 'Noble blade\'s ornate crossguard',
        icon: '†',
        containerCss: (colors) => `
            border-radius: 8px;
            width: 46px;
            height: 50px;
            background: linear-gradient(180deg, ${colors.headerBg} 0%, ${colors.textMuted} 50%, ${colors.textSecondary} 100%) !important;
            box-shadow: 
                0 4px 15px rgba(0,0,0,0.4),
                inset 0 2px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0,0,0,0.3);
            border: 2px solid ${colors.textPrimary};
        `,
        iconCss: (colors) => `
            color: ${colors.kawaiiGold} !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.6);
        `
    },
    treasureChest: {
        name: 'Treasure Chest',
        description: 'Adventurer\'s bounty chest with gold trim',
        icon: '⚱',
        containerCss: (colors) => `
            border-radius: 8px 8px 12px 12px;
            width: 50px;
            height: 40px;
            background: linear-gradient(135deg, ${colors.background || colors.textTitle} 0%, ${colors.weapons || colors.textSecondary} 100%) !important;
            box-shadow: 
                0 4px 12px rgba(0,0,0,0.3),
                inset 0 2px 0 ${colors.kawaiiGold}55;
            border: 2px solid ${colors.kawaiiGold};
            border-top: 3px solid ${colors.kawaiiGold};
        `,
        iconCss: (colors) => `
            color: ${colors.kawaiiGold} !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.6);
        `
    }
};

// CSS animations for some of the special effects
export const backToTopAnimations = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes pulse {
    from { opacity: 0.6; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1.05); }
}
`;

export default backToTopStyles;