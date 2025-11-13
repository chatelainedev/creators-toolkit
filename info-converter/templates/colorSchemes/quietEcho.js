const quietEchoScheme = {
    name: 'Quiet Echo',
    description: 'The inky, bottomless dark of a supernatural void, pierced by a cold, spectral cyan glow. Creates an atmosphere of quiet, ethereal dread.',
    colors: {
        // Background and base colors
        bodyBg: '#0d101e',
        containerBg: '#14182b',
        headerBg: '#1a1f36',
        bannerBorder: '#2a3150',
        
        // Navigation
        navBg: '#080a14',
        navText: '#8a99c2',
        navActive: '#222a4a',
        navActiveText: '#ffffff',
        navHover: '#1c223b',
        
        // Content colors
        textPrimary: '#d0efff',    // Very light, cold blue
        textSecondary: '#7c89b3',  // Desaturated slate blue
        textMuted: '#3e4766',
        textTitle: '#e0f4ff',      // Icy white-blue
        textContent: '#a8c5d1',    // Cool reading blue
        
        // World item backgrounds - ghostly, muted palette
        general: '#1a1f36',
        locations: '#3b8085',      // Deep, cold teal
        factions: '#935e76',       // Dusty, faded rose
        concepts: '#6a5e93',       // Muted lavender
        events: '#857a93',         // Dusty purple-gray
        creatures: '#5e7a93',      // Ghostly blue-gray
        plants: '#628b7a',         // Ghostly, grayish green
        items: '#6a7a93',          // Cool slate
        culture: '#856a7a',        // Faded mauve
        cultivation: '#5e8085',    // Deep teal-gray
        magic: '#2a2f4a',          // Deep void purple
        itemName: '#d0efff',
        
        // Character profile item colors - spectral, ethereal palette
        physical: '#3b8085',       // Cold teal
        personality: '#6a5e93',    // Ghostly lavender
        sexuality: '#935e76',      // Faded rose
        fighting: '#4a5566',       // Slate gray
        background: '#5e7a93',     // Misty blue
        weapons: '#3e4766',        // Dark void
        hobbies: '#628b7a',        // Spectral green
        quirks: '#857a93',         // Dusty purple
        relationships: '#7a8b93',  // Cool gray-blue
        
        // Link colors
        linkColor: '#00ffff',      // Spectral cyan
        linkHover: '#66ffff',      // Brighter cyan
        linkColorSecondary: '#6a5e93',  // Ghostly lavender
        linkHoverSecondary: '#8a7eb3',  // Lighter lavender
        
        // Status badge colors
        statusIdea: '#6a5e93',     // Lavender (nascent)
        statusDraft: '#3b8085',    // Teal (forming)
        statusCanon: '#00a1a1',    // Deep cyan (manifested)
        statusArchived: '#3e4766', // Void gray (forgotten)
        
        // Seasonal colors - all variations of void
        seasonal: {
            winter: '#1a2236',     // Frozen void
            spring: '#1a2e2a',     // Awakening void
            summer: '#222a36',     // Warm void
            autumn: '#2a2236'      // Dying void
        },
        
        softBg: '#1a1f36',
        
        // Kawaii colors - all spectral/ghostly
        kawaiiPink: '#b38aa3',     // Spectral rose
        kawaiiPurple: '#a38ab3',   // Spectral lavender
        kawaiiBlue: '#8aa3b3',     // Spectral blue
        kawaiiGold: '#b3a38a',     // Spectral gold
        kawaiiGreen: '#8ab393',    // Spectral mint
        kawaiiOrange: '#b3938a',   // Spectral peach
        
        wuxiaAccent: '#00a1a1',        // Deeper spectral cyan
        wuxiaAccentLight: '#4bb8b8',
        wuxiaGlow: 'rgba(0, 255, 255, 0.3)',
        
        journalAccent: '#00ffff'   // Spectral cyan
    }
};

export default quietEchoScheme;