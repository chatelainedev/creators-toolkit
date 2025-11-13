const urbanGraveyardScheme = {
    name: 'Urban Graveyard',
    description: 'A modern, urban ghost-hunting theme with dark grays and a vibrant digital-ghost green.',
    colors: {
        // Background and base colors
        bodyBg: '#1e1e1e',          // Very dark charcoal
        containerBg: '#2c2c2e',     // Dark, cool gray container
        headerBg: '#1e1e1e',        // Match body for a seamless look
        bannerBorder: 'rgba(0, 255, 156, 0.6)', // Digital ghost green border
        
        // Navigation
        navBg: '#1e1e1e',           // Dark base
        navText: '#cccccc',         // Light gray text
        navActive: '#00ff9c',       // Bright Digital Ghost Green
        navActiveText: '#1a1a1a',   // Black text on green
        navHover: '#444444',        // Medium gray for hover
        
        // Content colors
        textPrimary: '#e0e0e0',      // High-contrast off-white
        textSecondary: '#999999',    // Medium gray
        textMuted: '#666666',        // Darker, muted gray
        textTitle: '#ffffff',        // Pure white for titles
        textContent: '#e0e0e0',      // Off-white for readability
        
        // World item backgrounds (utilitarian, concrete grays)
        general: '#333333',
        locations: '#333333',
        factions: '#333333',
        concepts: '#333333',
        events: '#333333',
        creatures: '#333333',
        plants: '#333333',
        items: '#333333',
        culture: '#333333',
        cultivation: '#333333',
        magic: '#1f2a1f',
        itemName: '#00ff9c',         // Accent green text for contrast
        
        //Character profile item colors (shades of green and gray)
        physical: '#00ff9c',         // Main Accent Green
        personality: '#00b36e',      // Muted, thoughtful cyan
        sexuality: '#d0d0d0',       // Bright, clean gray
        fighting: '#008a63',         // Deep, serious teal
        background: '#777777',       // Medium gray
        weapons: '#555555',          // Steely dark gray
        hobbies: '#00ff9c',         // Main Accent Green
        quirks: '#00b36e',           // Muted cyan
        relationships: '#008a63',      // Deep teal

        // Link colors - make them pop!
        linkColor: '#00ff9c',           // Bright Digital Ghost Green
        linkHover: '#66ffd5',          // Lighter green on hover
        linkColorSecondary: '#bbbbbb',  // Technical light gray
        linkHoverSecondary: '#ffffff', // White on hover
        
        // Status badge colors (themed for an investigation)
        statusIdea: '#00b36e',        // "New Lead" muted cyan
        statusDraft: '#4df2b2',       // "Analyzing" light cyan
        statusCanon: '#00ff9c',       // "Confirmed" bright green
        statusArchived: '#4a4a4a',     // "Case Closed" gray

        seasonal: {
            winter: '#2a2c30',       // Cold, blue-tinted dark gray
            spring: '#2c302a',       // Subtle green-tinted dark gray
            summer: '#2e2e2e',       // Neutral dark gray
            autumn: '#302c2a'        // Warmer, brown-tinted dark gray
        },

        softBg: '#3a3a3c',  // Slightly lighter dark gray

        kawaiiPink: '#ff6b9d',      // Digital pink
        kawaiiPurple: '#9d6bff',    // Digital purple
        kawaiiBlue: '#6b9dff',      // Digital blue
        kawaiiGold: '#ffd700',      // Digital gold
        kawaiiGreen: '#00ff9c',     // Digital ghost green (existing)
        kawaiiOrange: '#ff9d6b',    // Digital orange

        wuxiaAccent: '#00ff9c',        // Thematic ghost green
        wuxiaAccentLight: '#66ffd5',   // Brighter green
        wuxiaGlow: 'rgba(0, 255, 156, 0.7)', // Ectoplasm glow

        journalAccent: '#00ff9c'     // Thematic ghost green
    }
};

export default urbanGraveyardScheme;