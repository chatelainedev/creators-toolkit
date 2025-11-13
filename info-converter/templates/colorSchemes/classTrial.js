const classTrialScheme = {
    name: 'Class Trial',
    description: 'Dark, quirky theme with neon pink and cyan accents.',
    colors: {
        // Background and base colors
        bodyBg: '#1c1824',          // Very dark desaturated purple
        containerBg: '#2a2536',     // Dark purple-gray container
        headerBg: '#1c1824',        // Match body for a seamless look
        bannerBorder: 'rgba(255, 0, 127, 0.5)', // Neon pink border
        
        // Navigation
        navBg: '#1c1824',           // Dark base
        navText: '#b5b5d5',          // Muted lavender-gray text
        navActive: '#ff007f',        // Hot pink!
        navActiveText: '#ffffff',    // White text on pink
        navHover: '#d6006b',         // Darker pink for hover
        
        // Content colors
        textPrimary: '#e5e5e5',      // High-contrast off-white
        textSecondary: '#8a8a9e',    // Cool, muted gray
        textMuted: '#6a6a7e',        // Darker, muted gray
        textTitle: '#ffffff',        // Pure white for titles
        textContent: '#e5e5e5',      // Off-white for readability
        
        // World item backgrounds (dark with accent borders/headers in mind)
        general: '#3e2c3c',  
        locations: '#3e2c3c',        // Dark magenta tint
        factions: '#2c3e3e',         // Dark cyan tint
        concepts: '#3a2c3e',         // Dark purple tint
        events: '#3e3a2c',           // Dark gold/warning tint
        creatures: '#3e2c3c',        // Dark magenta tint
        plants: '#2c3e3e',           // Dark cyan tint
        items: '#3a2c3e',            // Dark purple tint
        culture: '#3e2c3c',          // Dark magenta tint
        cultivation: '#2c3e3e',      // Dark cyan tint
        magic: '#2c1e3a',
        itemName: '#ffffff',         // White text for contrast
        
        //Character profile item colors (vibrant accents)
        physical: '#ff007f',         // Hot Pink
        personality: '#00f6ff',      // Electric Cyan
        sexuality: '#f43f8e',        // Slightly softer pink
        fighting: '#d6006b',         // Aggressive darker pink
        background: '#00c4cc',       // Darker cyan
        weapons: '#ff007f',          // Hot Pink
        hobbies: '#00f6ff',          // Electric Cyan
        quirks: '#f43f8e',           // Softer pink
        relationships: '#00c4cc',      // Darker cyan

        // Link colors - make them pop!
        linkColor: '#ff007f',           // Hot Pink
        linkHover: '#ff4da6',          // Lighter pink on hover
        linkColorSecondary: '#00f6ff',  // Electric Cyan
        linkHoverSecondary: '#7dffff', // Lighter cyan on hover
        
        // Status badge colors (themed for a "trial")
        statusIdea: '#00f6ff',        // Cyan for "new evidence"
        statusDraft: '#ffd700',       // Gold/Yellow for "under investigation"
        statusCanon: '#ff007f',        // Pink for "TRUTH" / confirmed
        statusArchived: '#4a4a5e',     // "Case closed" gray

        seasonal: {
            winter: '#1a2538',       // Deep, cold midnight blue
            spring: '#1a3832',       // Dark, digital teal
            summer: '#381a2f',       // Hot, dark magenta
            autumn: '#332a38'        // Muted, decaying purple
        },

        softBg: '#3e2c3c',  // Slightly lighter dark with magenta tint

        kawaiiPink: '#ff007f',      // Neon hot pink (existing)
        kawaiiPurple: '#d946ef',    // Neon purple
        kawaiiBlue: '#00f6ff',      // Electric cyan (existing)
        kawaiiGold: '#ffd700',      // Neon gold
        kawaiiGreen: '#00ff9f',     // Neon green
        kawaiiOrange: '#ff6b35',    // Neon orange

        wuxiaAccent: '#00f6ff',        // Electric cyan (matches your neon aesthetic)
        wuxiaAccentLight: '#7dffff',   // Bright cyan
        wuxiaGlow: 'rgba(0,246,255,0.8)', // Bright neon glow

        journalAccent: '#6fe7f5'     // Thematic hot pink
    }
};

export default classTrialScheme;