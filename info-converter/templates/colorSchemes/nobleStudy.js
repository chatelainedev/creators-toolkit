const nobleStudyScheme = {
    name: "Noble's Study",
    description: 'A rich, dark theme inspired by leather-bound tomes, aged brass, and deep jewel tones.',
    colors: {
        // Background and base colors - dark wood and candlelight
        bodyBg: '#1a140f',          // Deep, dark espresso brown
        containerBg: '#2b211a',     // Rich, dark leather
        headerBg: '#211a14',        // Slightly darker, polished wood
        bannerBorder: 'rgba(204, 164, 94, 0.5)', // Muted aged brass border
        
        // Navigation - leather and gold leaf
        navBg: '#2b211a',           // Match the container for a seamless look
        navText: '#d4c2b4',          // Warm, parchment-like text
        navActive: '#5c252b',        // Deep, noble burgundy
        navActiveText: '#f2e8dc',   // Creamy white text on burgundy
        navHover: '#3c2e25',         // Worn leather hover
        
        // Content colors - high-contrast and readable
        textPrimary: '#eae0d5',      // Soft parchment/cream for main text
        textSecondary: '#a8998a',   // Muted, warm taupe
        textMuted: '#7d6d5f',       // Faded ink gray
        textTitle: '#cca45e',       // Aged brass/gold for titles
        textContent: '#c4b5a5',     // Slightly darker, readable parchment
        
        // World item backgrounds - subtle variations in wood grain/stain
        general: '#31261f',
        locations: '#31261f',
        factions: '#2b242a',        // Hint of royal purple
        concepts: '#262a29',        // Hint of forest green
        events: '#33291e',          // Hint of warm amber
        creatures: '#302121',       // Hint of deep crimson
        plants: '#222922',          // Hint of moss green
        items: '#292230',           // Hint of deep blue
        culture: '#31261f',
        cultivation: '#222922',
        magic: '#262a29',
        itemName: '#cca45e',        // Gold for item names
        
        // Character profile item colors - rich, deep jewel tones
        physical: '#4a6d8c',        // Deep Sapphire Blue
        personality: '#3a5f3a',     // Rich Forest Green
        sexuality: '#8b1538',        // Deep, passionate Burgundy
        fighting: '#4a4a4a',        // Forged Steel Gray
        background: '#5d3c5d',      // Royal Amethyst Purple
        weapons: '#795c34',         // Burnished Bronze
        hobbies: '#4a6d8c',
        quirks: '#5d3c5d',
        relationships: '#3a5f3a',

        // Link colors - aged brass and sapphire
        linkColor: '#cca45e',           // Aged brass for primary links
        linkHover: '#e0c28A',          // Brighter, polished brass on hover
        linkColorSecondary: '#4a6d8c',  // Sapphire blue for secondary links
        linkHoverSecondary: '#6a8db0', // Lighter sapphire on hover
        
        // Status badge colors - representing stages of lore
        statusIdea: '#5d3c5d',      // Amethyst Purple (a magical idea)
        statusDraft: '#4a6d8c',     // Sapphire Blue (refining the details)
        statusCanon: '#3a5f3a',     // Forest Green (grounded in the world)
        statusArchived: '#63544a',  // Stone Gray (ancient history)

        // Seasonal colors - very subtle shifts in the dark ambience
        seasonal: {
            winter: '#242a2e',      // A hint of cold blue in the dark
            spring: '#2a2e24',      // A hint of new green
            summer: '#2e2a24',      // A hint of warm gold
            autumn: '#2e2424'       // A hint of dying crimson
        },

        softBg: '#3c2e25',  // A lighter, worn leather color

        // Mapped colors for other themes
        kawaiiPink: '#a66981',      // Muted, dusty rose
        kawaiiPurple: '#8169a6',    // Muted amethyst
        kawaiiBlue: '#6981a6',      // Muted sapphire
        kawaiiGold: '#a69469',      // Muted brass
        kawaiiGreen: '#69a669',     // Muted sage
        kawaiiOrange: '#a68169',    // Muted terracotta

        wuxiaAccent: '#3a5f3a',        // A deep, jade-like Forest Green
        wuxiaAccentLight: '#5f8c5f',   // Lighter jade
        wuxiaGlow: 'rgba(58, 95, 58, 0.6)', // Subtle magical glow

        journalAccent: '#8b1538'    // Deep Burgundy for accents
    }
};

export default nobleStudyScheme;