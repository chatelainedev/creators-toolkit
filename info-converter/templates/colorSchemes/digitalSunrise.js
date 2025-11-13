const digitalSunriseScheme = {
    name: 'Digital Sunrise',
    description: 'Modern cyberpunk with electric oranges, deep purples, and golden accents in a high-tech atmosphere',
    colors: {
        // Background and base colors - dawn in the digital city
        bodyBg: '#0f0a0a',          // Deep warm black
        containerBg: '#1f1517',     // Dark warm gray container
        headerBg: '#1a0f14',        // Dark burgundy for headers
        bannerBorder: 'rgba(255, 140, 0, 0.7)', // Orange border
        
        // Navigation - sunrise terminal
        navBg: '#0f0a0a',           // Match body
        navText: '#ffb347',         // Warm orange text
        navActive: '#9932cc',       // Deep purple active
        navActiveText: '#ffd700',   // Gold text on purple
        navHover: '#2a1a0f',        // Dark orange hover
        
        // Content colors - warm cyberpunk
        textPrimary: '#fff0e6',     // Warm white
        textSecondary: '#ffcc99',   // Light orange
        textMuted: '#cc9966',       // Muted orange
        textTitle: '#ff8c00',       // Dark orange for titles
        textContent: '#ffd4b3',     // Soft orange for reading
        
        // World item backgrounds - digital metropolis sectors
        general: '#2a1f0f',  
        locations: '#2a1f0f',       // Amber commercial district
        factions: '#2a0f2a',        // Purple corporate zone
        concepts: '#1f2a0f',        // Green data farms
        events: '#2a2a0f',          // Yellow alert zones
        creatures: '#2a0f0f',       // Red security zones
        plants: '#0f2a1f',          // Teal bio-labs
        items: '#1f0f2a',           // Indigo tech quarters
        culture: '#2a0f1f',         // Rose entertainment hubs
        cultivation: '#0f1f2a',     // Blue training facilities
        magic: '#1f0f2a',
        itemName: '#ff8c00',        // Orange item names
        
        // Character profile item colors - enhanced human categories
        physical: '#ff8c00',        // Dark orange (body mods)
        personality: '#9932cc',     // Deep purple (mind patterns)
        sexuality: '#dc143c',       // Crimson (passion drives)
        fighting: '#ff4500',        // Red-orange (combat protocols)
        background: '#228b22',      // Forest green (life data)
        weapons: '#4169e1',         // Royal blue (equipment)
        hobbies: '#daa520',         // Goldenrod (recreation)
        quirks: '#ffd700',          // Gold (unique traits)
        relationships: '#ff69b4',   // Hot pink (social networks)

        // Link colors - data highways
        linkColor: '#ff8c00',           // Dark orange
        linkHover: '#9932cc',           // Purple on hover
        linkColorSecondary: '#ffd700', // Gold
        linkHoverSecondary: '#dc143c', // Crimson on hover
        
        // Status badge colors - system status lights
        statusIdea: '#ffd700',      // Gold (new concept)
        statusDraft: '#ff8c00',     // Orange (in development)
        statusCanon: '#228b22',     // Forest green (approved)
        statusArchived: '#9932cc',  // Purple (archived)

        // Seasonal colors - digital atmosphere variations
        seasonal: {
            winter: '#1a0f1f',      // Cool purple morning
            spring: '#0f1a0f',      // Fresh green dawn
            summer: '#1f1a0f',      // Warm golden sunrise
            autumn: '#1f0f0f'       // Deep orange sunset
        },

        softBg: '#2a1f0f',  // Warm amber tint

        // Kawaii colors - cyberpunk warm cute
        kawaiiPink: '#ff69b4',      // Hot pink
        kawaiiPurple: '#9932cc',    // Deep purple
        kawaiiBlue: '#4169e1',      // Royal blue
        kawaiiGold: '#ffd700',      // Gold
        kawaiiGreen: '#228b22',     // Forest green
        kawaiiOrange: '#ff8c00',    // Dark orange

        wuxiaAccent: '#ffd700',        // Gold for wuxia theme
        wuxiaAccentLight: '#ffeb99',   // Light gold
        wuxiaGlow: 'rgba(255,215,0,0.7)', // Golden glow

        journalAccent: '#ff8c00'    // Dark orange journal accent
    }
};

export default digitalSunriseScheme;