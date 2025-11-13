const staticDreadScheme = {
    name: 'Static Dread',
    description: 'The decaying green glow of a CRT screen and the ominous red of a recording light against a deep, static-filled black. Perfect for analog and digital horror.',
    colors: {
        // Background and base colors
        bodyBg: '#0A0A0A',
        containerBg: '#121212',
        headerBg: '#1a1a1a',
        bannerBorder: '#333333',
        
        // Navigation
        navBg: '#050505',
        navText: '#999999',
        navActive: '#222222',
        navActiveText: '#e0e0e0',
        navHover: '#1f1f1f',
        
        // Content colors
        textPrimary: '#c2c2c2',
        textSecondary: '#7d7d7d',
        textMuted: '#444444',
        textTitle: '#e0e0e0',
        textContent: '#999999',
        
        // World item backgrounds - grimy, desaturated horror tints
        general: '#1a1a1a',
        locations: '#8b6f5a',      // Dusty, decaying brown
        factions: '#3a6e71',       // Muted, murky teal
        concepts: '#798a67',       // Sickly yellow-green
        events: '#7a6555',         // Dark rust
        creatures: '#5a6e5a',      // Swampy dark green
        plants: '#4f614a',         // Dark, swampy green
        items: '#6e5a6e',          // Dull purple-gray
        culture: '#7a5a5a',        // Dried blood brown
        cultivation: '#5a6e61',    // Murky teal-green
        magic: '#3a4e3a',          // Dark mossy green
        itemName: '#c2c2c2',
        
        // Character profile item colors - desaturated horror palette
        physical: '#6e7a6e',       // Gray-green
        personality: '#7a6e7a',    // Gray-purple
        sexuality: '#7a5a5a',      // Dusty rose-brown
        fighting: '#5a5a5a',       // Dark gray
        background: '#6e6e5a',     // Olive-gray
        weapons: '#5a6e6e',        // Teal-gray
        hobbies: '#7a7a6e',        // Warm gray
        quirks: '#6e6e7a',         // Cool gray
        relationships: '#6e7a5a',  // Moss gray
        
        // Link colors
        linkColor: '#798a67',      // Sickly green
        linkHover: '#8b9b77',      // Lighter sickly green
        linkColorSecondary: '#ff0000',  // Warning red
        linkHoverSecondary: '#cc0000',  // Darker red
        
        // Status badge colors
        statusIdea: '#798a67',     // Sickly green (new)
        statusDraft: '#8b6f5a',    // Dusty brown (processing)
        statusCanon: '#3a6e71',    // Murky teal (confirmed)
        statusArchived: '#444444', // Dark gray (archived)
        
        // Seasonal colors
        seasonal: {
            winter: '#0f1214',     // Cold black-blue
            spring: '#12140f',     // Decayed green-black
            summer: '#14120f',     // Warm decay-black
            autumn: '#14100f'      // Rust-black
        },
        
        softBg: '#1a1a1a',
        
        // Kawaii colors - all desaturated/grimy
        kawaiiPink: '#7a5a6e',     // Grimy mauve
        kawaiiPurple: '#6e5a7a',   // Grimy purple
        kawaiiBlue: '#5a6e7a',     // Grimy slate blue
        kawaiiGold: '#7a6e5a',     // Grimy tan
        kawaiiGreen: '#5a7a6e',    // Grimy teal
        kawaiiOrange: '#7a655a',   // Grimy rust
        
        wuxiaAccent: '#6e0000',        // Deep, dried blood red
        wuxiaAccentLight: '#8a4b4b',
        wuxiaGlow: 'rgba(255, 0, 0, 0.4)',
        
        journalAccent: '#ff0000'   // Ominous red REC light
    }
};

export default staticDreadScheme;