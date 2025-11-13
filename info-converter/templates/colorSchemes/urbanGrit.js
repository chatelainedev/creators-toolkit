const urbanGritScheme = {
    name: 'Industrial',
    description: 'A dark, industrial theme with muted bronze and steel blue accents.',
    colors: {
        // Background and base colors from the CSS
        bodyBg: '#1a1a1b',          // --background-main
        containerBg: '#2b2d31',     // --white (content background)
        headerBg: '#1e2025',        // --primary-darker
        bannerBorder: 'rgba(176, 136, 60, 0.5)', // Semi-transparent accent
        
        // Navigation
        navBg: '#2b2d31',           // Same as container
        navText: '#d1d5db',          // --text-main
        navActive: '#3a3d44',        // --primary-medium
        navActiveText: '#B0883C',    // --accent-main
        navHover: '#3a3d44',         // --primary-medium
        
        // Content colors
        textPrimary: '#d1d5db',      // --text-main
        textSecondary: '#8a8d93',    // --gray-dark
        textMuted: '#888888',        // --text-muted
        textTitle: '#ffffff',        // Brighter for titles
        textContent: '#d1d5db',      // --text-main
        
        // World item backgrounds (Subtle, desaturated industrial tints)
        general: '#2c3238',  
        locations: '#2c3238',     
        factions: '#38322c',      
        concepts: '#2a2d34',      
        events: '#3a2c2c',        
        creatures: '#2c3a38',     
        plants: '#363a2c',        
        items: '#33333a',         
        culture: '#3a342c',      
        cultivation: '#313a2c',   
        magic: '#33313a',
        itemName: '#d1d5db',      // World item text
        
        //Character profile item colors (bronze, grays, and steel)
        physical: '#B0883C',         // Muted Bronze (Main Accent)
        personality: '#6a6d73',      // Cool Industrial Gray
        sexuality: '#9D8139',        // Darker Bronze
        fighting: '#5a5d63',         // Strong Medium Gray
        background: '#7A6735',       // Darkest Bronze
        weapons: '#3a3d44',          // Charcoal Gray
        hobbies: '#B0883C',         // Muted Bronze
        quirks: '#9D8139',           // Darker Bronze
        relationships: '#5f8b9e',      // Contrasting Steel Blue

        // Link colors
        linkColor: '#B0883C',           // Main Accent (Muted Bronze)
        linkHover: '#c89e4f',          // Slightly brighter on hover
        linkColorSecondary: '#5f8b9e',  // Cool Steel Blue for contrast
        linkHoverSecondary: '#7faac1', // Lighter Steel Blue on hover
        
        // Status badge colors (themed for a gritty investigation)
        statusIdea: '#5f8b9e',        // "Blueprint" Steel Blue
        statusDraft: '#B0883C',       // "In Progress" Bronze
        statusCanon: '#9D8139',      // "Confirmed" Dark Bronze
        statusArchived: '#5a5d63',     // "Filed Away" Gray

        seasonal: {
            winter: '#2a2d34',       // Cold, blue-tinted dark gray
            spring: '#2d342a',       // Subtle green-tinted dark gray
            summer: '#34312a',       // Subtle warm/bronze-tinted dark gray
            autumn: '#342d2a',       // Richer warm-tinted dark gray
        },

        softBg: '#3a3d44',  // Slightly lighter than containerBg

        kawaiiPink: '#d4a8b8',      // Industrial rose
        kawaiiPurple: '#b8a8d4',    // Industrial lavender
        kawaiiBlue: '#5f8b9e',      // Steel blue (existing)
        kawaiiGold: '#B0883C',      // Muted bronze (existing)
        kawaiiGreen: '#8fb8a8',     // Industrial sage
        kawaiiOrange: '#c49a7c',    // Industrial copper

        wuxiaAccent: '#5f8b9e',        // Your existing steel blue
        wuxiaAccentLight: '#7faac1',   // Lighter steel blue
        wuxiaGlow: 'rgba(95,139,158,0.5)', // Industrial jade glow

        journalAccent: '#B0883C'     // Thematic Muted Bronze
    }
};

export default urbanGritScheme;