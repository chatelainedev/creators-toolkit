const parchmentScheme = {
    name: 'Parchment&Quill',
    description: 'Warm aged parchment with rich ink browns and subtle gold accents',
    colors: {
        // Background and base colors - like aged letter paper
        bodyBg: '#f7f4f0',          // Warm parchment background
        containerBg: '#fefcf8',     // Clean letter paper
        headerBg: '#f2ede6',        // Aged parchment header
        bannerBorder: 'rgba(139, 69, 19, 0.4)', // Rich brown border
        
        // Navigation - like leather-bound letter organizer
        navBg: '#f7f4f0',           // Match body for seamless look
        navText: '#5d4037',         // Rich brown ink
        navActive: '#8d6e63',       // Warm brown active state
        navActiveText: '#fefcf8',   // Cream text on brown
        navHover: '#6d4c41',        // Medium brown hover
        
        // Content colors - like quill pen ink
        textPrimary: '#3e2723',     // Deep brown ink
        textSecondary: '#5d4037',   // Medium brown ink
        textMuted: '#8d6e63',       // Light brown ink
        textTitle: '#2e1a16',       // Darkest brown for titles
        textContent: '#4e342e',     // Rich reading brown
        
        // World item backgrounds - subtle parchment variations
        general: '#f9f7f3', 
        locations: '#f9f7f3',       // Pale cream (places)
        factions: '#f7f4f0',        // Warm cream (groups)
        concepts: '#f5f2ee',        // Soft cream (knowledge)
        events: '#f8f5f1',          // Light cream (happenings)
        creatures: '#f6f3ef',       // Natural cream (beings)
        plants: '#f4f1ed',          // Earthy cream (flora)
        items: '#f7f4f0',           // Neutral cream (objects)
        culture: '#f9f6f2',         // Rich cream (traditions)
        cultivation: '#f5f2ee',     // Scholarly cream (practices)
        magic: '#f5f2ee',
        itemName: '#2e1a16',        // Deep brown for item names
        
        // Character profile item colors - refined browns and golds
        physical: '#8d6e63',        // Warm brown (appearance)
        personality: '#a1887f',     // Light brown (character)
        sexuality: '#d4af37',       // Elegant gold (passion)
        fighting: '#6d4c41',        // Strong brown (combat)
        background: '#795548',      // Medium brown (history)
        weapons: '#5d4037',         // Dark brown (implements)
        hobbies: '#bcaaa4',         // Soft brown (leisure)
        quirks: '#cd853f',          // Peru gold (traits)
        relationships: '#8d6e63',   // Warm brown (connections)

        // Link colors - like golden ink and wax seals
        linkColor: '#8d6e63',           // Warm brown
        linkHover: '#6d4c41',           // Darker brown on hover
        linkColorSecondary: '#d4af37',  // Elegant gold
        linkHoverSecondary: '#b8941f',  // Deeper gold on hover
        
        // Status badge colors - like different ink colors and seals
        statusIdea: '#cd853f',      // Peru gold (new thoughts)
        statusDraft: '#d4af37',     // Bright gold (in progress)
        statusCanon: '#8d6e63',     // Brown (established)
        statusArchived: '#a1887f',  // Light brown (stored)

        // Seasonal colors - warm parchment variations
        seasonal: {
            winter: '#f5f2ee',      // Cool parchment
            spring: '#f7f4f0',      // Fresh parchment
            summer: '#f9f6f2',      // Warm parchment
            autumn: '#f8f5f1'       // Golden parchment
        },

        softBg: '#f9f7f3',  // Pale cream

        kawaiiPink: '#d4a394',      // Quill rose
        kawaiiPurple: '#b894c4',    // Quill lavender
        kawaiiBlue: '#94a8c4',      // Quill blue
        kawaiiGold: '#d4af37',      // Elegant gold (existing)
        kawaiiGreen: '#a8c494',     // Quill sage
        kawaiiOrange: '#c4a875',    // Quill amber

        wuxiaAccent: '#8fbc8f',        // Elegant sage jade
        wuxiaAccentLight: '#a8c5a8',   // Light elegant jade
        wuxiaGlow: 'rgba(143,188,143,0.5)', // Refined jade glow

        journalAccent: '#8d6e63'    // Warm brown journal accent
    }
};

export default parchmentScheme;