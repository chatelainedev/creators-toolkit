const horrificScheme = {
    name: 'Horrific',
    description: 'Horror-themed palette with deep shadows and blood red accents',
    colors: {
        // Background and base colors - deep void blacks
        bodyBg: '#0a0508',          // Deepest shadow void
        containerBg: '#1a1013',     // Dark container background  
        headerBg: '#1e1419',        // Slightly lighter header
        bannerBorder: 'rgba(139, 21, 56, 0.6)', // Blood red border with transparency
        
        // Navigation - like ancient tome bindings
        navBg: '#0d0a0f',           // Deep shadow
        navText: '#8a7a85',         // Muted ashen text
        navActive: '#8b1538',       // Blood red active state
        navActiveText: '#f4f1eb',   // Bone white text on red
        navHover: '#4a0b1c',        // Dark blood red hover
        
        // Content colors - high contrast for readability
        textPrimary: '#e8dfe3',     // Pale bone white
        textSecondary: '#c4b5bf',   // Lighter ash gray
        textMuted: '#8a7a85',       // Muted ash gray
        textTitle: '#f4f1eb',       // Pure bone white for titles
        textContent: '#d4c7cf',     // Slightly warmer reading text
        
        // World item backgrounds - different horror tints for categories
        general: '#2a1d24',  
        locations: '#2a1d24',       // Dark burgundy (places of dread)
        factions: '#1d1f2a',        // Dark blue-gray (mysterious groups)
        concepts: '#1f2a1d',        // Dark green-gray (forbidden knowledge)
        events: '#2a251d',          // Dark amber (ominous happenings)
        creatures: '#2a1d1f',       // Dark crimson (monsters)
        plants: '#1d2a1f',          // Dark forest (twisted flora)
        items: '#241d2a',           // Dark purple (cursed objects)
        culture: '#2a1f1d',         // Dark copper (corrupted traditions)
        cultivation: '#1f241d',     // Dark olive (dark practices)
        magic: '#241d2a',
        itemName: '#f4f1eb',        // Bone white item names for contrast
        
        // Character profile item colors - horror-themed personality aspects
        physical: '#8b1538',        // Blood red (physical form)
        personality: '#6b1a47',     // Dark magenta (inner darkness)
        sexuality: '#a61e42',       // Deeper red (passion/desire)
        fighting: '#4a0b1c',        // Darkest red (violence)
        background: '#6d1029',      // Medium blood red (past sins)
        weapons: '#2d0814',         // Nearly black red (instruments of death)
        hobbies: '#5a1a3d',         // Dark rose (twisted interests)
        quirks: '#7a1f35',          // Medium crimson (strange habits)
        relationships: '#4d1528',   // Dark burgundy (bonds of terror)

        // Link colors - like glowing runes or sigils
        linkColor: '#a61e42',           // Bright blood red
        linkHover: '#c92952',          // Brighter on hover (like fresh blood)
        linkColorSecondary: '#8a7a85', // Muted ash for secondary links
        linkHoverSecondary: '#b59aa8', // Warmer ash on hover
        
        // Status badge colors - stages of corruption
        statusIdea: '#6b1a47',      // Dark magenta (nascent evil)
        statusDraft: '#8b1538',     // Blood red (taking shape)
        statusCanon: '#a61e42',     // Bright red (fully manifest)
        statusArchived: '#4a3d47',  // Ash gray (forgotten horrors)

        // Seasonal colors - all variations of darkness
        seasonal: {
            winter: '#141218',      // Frozen darkness
            spring: '#181214',      // Awakening shadows  
            summer: '#1c1014',      // Heated darkness
            autumn: '#1a0f14'       // Dying light
        },

        softBg: '#2a1d24',  // Dark burgundy, lighter than containerBg

        kawaiiPink: '#a64269',      // Gothic rose
        kawaiiPurple: '#7a4269',    // Gothic purple
        kawaiiBlue: '#4d6b85',      // Gothic blue
        kawaiiGold: '#a69442',      // Gothic gold
        kawaiiGreen: '#5a8542',     // Gothic sage
        kawaiiOrange: '#a66942',    // Gothic copper

        wuxiaAccent: '#4a3d47',        // Dark corrupted jade
        wuxiaAccentLight: '#6b5a60',   // Lighter corrupted jade
        wuxiaGlow: 'rgba(74,61,71,0.7)', // Dark cursed glow

        journalAccent: '#8b1538'    // Blood red accent for journal style
    }
};

export default horrificScheme;