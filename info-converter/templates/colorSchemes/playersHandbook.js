const playersHandbookScheme = {
    name: "Player's Handbook",
    description: 'Authentic D&D handbook colors with rich browns, burgundy accents, and aged parchment',
    colors: {
        // Background and base colors - authentic parchment
        bodyBg: '#2a1c0f',          // Dark brown background
        containerBg: '#f4ebe1',     // Parchment main
        headerBg: '#f0e6dc',        // Aged parchment
        bannerBorder: 'rgba(125, 109, 95, 0.8)', // Border color with transparency
        
        // Navigation - handbook style
        navBg: '#f4ebe1',           // Parchment main
        navText: '#2a1c0f',         // Dark brown text
        navActive: '#722f37',       // Burgundy active
        navActiveText: '#f4ebe1',   // Light text on burgundy
        navHover: '#ebe0d6',        // Parchment dark
        
        // Content colors - readable browns
        textPrimary: '#2a1c0f',     // Dark brown primary text
        textSecondary: '#3d2914',   // Medium brown secondary
        textMuted: '#4a3d32',       // Muted brown
        textTitle: '#2a1c0f',       // Dark brown for titles
        textContent: '#3d2914',     // Dialog brown for content
        
        // World item backgrounds - subtle parchment variations
        general: '#f0e6dc',   
        locations: '#f0e6dc',       // Aged parchment (places)
        factions: '#ebe0d6',        // Parchment dark (groups)
        concepts: '#e6dbd0',        // Parchment darker (knowledge)
        events: '#f4ebe1',          // Parchment main (happenings)
        creatures: '#ebe0d6',       // Parchment dark (beings)
        plants: '#e6dbd0',          // Parchment darker (flora)
        items: '#f0e6dc',           // Aged parchment (objects)
        culture: '#f4ebe1',         // Parchment main (traditions)
        cultivation: '#ebe0d6',     // Parchment dark (practices)
        magic: '#e6dbd0',
        itemName: '#2a1c0f',        // Dark brown for item names
        
        // Character profile item colors - handbook browns and burgundy
        physical: '#722f37',        // Burgundy (appearance)
        personality: '#5d4037',     // Accent brown (character)
        sexuality: '#5c252b',       // Dark burgundy (passion)
        fighting: '#461c20',        // Darker burgundy (combat)
        background: '#4a2c20',      // Dark accent brown (history)
        weapons: '#3d2914',         // Primary dark (implements)
        hobbies: '#7d6d5f',         // Gray light (leisure)
        quirks: '#8d7d6f',          // Gray lighter (traits)
        relationships: '#6d5d4f',   // Gray medium (connections)

        // Link colors - burgundy theme
        linkColor: '#722f37',           // Burgundy
        linkHover: '#5c252b',           // Dark burgundy on hover
        linkColorSecondary: '#5d4037',  // Accent brown
        linkHoverSecondary: '#4a2c20',  // Dark accent brown on hover
        
        // Status badge colors - handbook themed
        statusIdea: '#8d7d6f',      // Gray lighter (new ideas)
        statusDraft: '#7d6d5f',     // Gray light (in progress)
        statusCanon: '#722f37',     // Burgundy (established)
        statusArchived: '#5d4e42',  // Gray dark (archived)

        // Seasonal colors - parchment variations
        seasonal: {
            winter: '#f0e6dc',      // Cool aged parchment
            spring: '#f4ebe1',      // Fresh parchment
            summer: '#f0e6dc',      // Warm aged parchment
            autumn: '#ebe0d6'       // Rich parchment dark
        },

        softBg: '#f0e6dc',  // Aged parchment

        kawaiiPink: '#d4a394',      // Parchment rose
        kawaiiPurple: '#b894d4',    // Parchment lavender
        kawaiiBlue: '#94b8d4',      // Parchment blue
        kawaiiGold: '#d4c494',      // Parchment gold
        kawaiiGreen: '#a8d494',     // Parchment sage
        kawaiiOrange: '#d4a875',    // Parchment amber

        wuxiaAccent: '#5d4037',        // Accent brown for jade theme
        wuxiaAccentLight: '#7d6d5f',   // Gray light
        wuxiaGlow: 'rgba(93,64,55,0.4)', // Brown glow

        journalAccent: '#722f37'    // Burgundy journal accent
    }
};

export default playersHandbookScheme;