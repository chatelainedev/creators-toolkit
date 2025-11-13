const dungeonMasterScheme = {
    name: "Dungeon Master",
    description: 'Dark leather-bound tome with aged brass fittings and deep jewel accents',
    colors: {
        // Background and base colors - deep dark leather
        bodyBg: '#0f0a08',          // Very dark brown/black
        containerBg: '#2a1810',     // Dark leather brown
        headerBg: '#1d1208',        // Darker leather
        bannerBorder: 'rgba(101, 67, 33, 0.8)', // Dark brass border
        
        // Navigation - aged brass theme
        navBg: '#2a1810',           // Dark leather
        navText: '#c9a876',         // Aged brass text
        navActive: '#654321',       // Dark brass active
        navActiveText: '#f4e4bc',   // Light on brass
        navHover: '#1d1208',        // Darker leather hover
        
        // Content colors - muted brass on dark leather
        textPrimary: '#d4c4a8',     // Light leather/parchment text
        textSecondary: '#b8a082',   // Medium leather text
        textMuted: '#8b7355',       // Muted brown
        textTitle: '#c9a876',       // Aged brass for titles
        textContent: '#b8a082',     // Medium leather for content
        
        // World item backgrounds - subtle leather variations
        general: '#2a1810',  
        locations: '#2a1810',       // Dark leather (places)
        factions: '#1d1208',        // Darker leather (groups)
        concepts: '#3d2a1a',        // Medium leather (knowledge)
        events: '#2a1810',          // Dark leather (happenings)
        creatures: '#1d1208',       // Darker leather (beings)
        plants: '#3d2a1a',          // Medium leather (flora)
        items: '#2a1810',           // Dark leather (objects)
        culture: '#1d1208',         // Darker leather (traditions)
        cultivation: '#3d2a1a',     // Medium leather (practices)
        magic: '#3d2a1a',
        itemName: '#c9a876',        // Aged brass for item names
        
        // Character profile item colors - deep muted jewel tones
        physical: '#8b1538',        // Deep burgundy (appearance)
        personality: '#2e4184',     // Deep sapphire (character)
        sexuality: '#8b3a3a ',       // Deep amethyst (passion)
        fighting: '#611f1f',        // Dark burgundy (combat)
        background: '#654321',      // Dark brass (history)
        weapons: '#8b4513',         // Saddle brown (implements)
        hobbies: '#2d5930',         // Deep emerald (leisure)
        quirks: '#5d2a62',          // Dark red (traits)
        relationships: '#5d3c5d',   // Deep orchid (connections)

        // Link colors - muted brass theme
        linkColor: '#c9a876',           // Aged brass
        linkHover: '#d4c4a8',           // Light brass on hover
        linkColorSecondary: '#8b7355',  // Muted brown
        linkHoverSecondary: '#b8a082',  // Medium leather on hover
        
        // Status badge colors - deep muted tones
        statusIdea: '#5d2a62',      // Deep amethyst (new ideas)
        statusDraft: '#8b3a3a',     // Dark red (in progress)
        statusCanon: '#2d5930',     // Deep emerald (established)
        statusArchived: '#4a4a4a',  // Dark gray (archived)

        // Seasonal colors - dark leather variations
        seasonal: {
            winter: '#1d1208',      // Darkest leather (winter)
            spring: '#2a1810',      // Dark leather (spring)
            summer: '#3d2a1a',      // Medium leather (summer)
            autumn: '#2a1810'       // Dark leather (autumn)
        },

        softBg: '#1d1208',  // Darker leather

        kawaiiPink: '#a67c8f',      // Dark leather rose
        kawaiiPurple: '#8f7ca6',    // Dark leather purple
        kawaiiBlue: '#7c8fa6',      // Dark leather blue
        kawaiiGold: '#a6947c',      // Dark brass (similar to existing)
        kawaiiGreen: '#8fa67c',     // Dark leather sage
        kawaiiOrange: '#a6847c',    // Dark leather copper

        wuxiaAccent: '#654321',        // Dark brass for accents
        wuxiaAccentLight: '#8b7355',   // Muted brown
        wuxiaGlow: 'rgba(101,67,33,0.4)', // Dark brass glow

        journalAccent: '#5e1212'    // Deep burgundy journal accent
    }
};

export default dungeonMasterScheme;