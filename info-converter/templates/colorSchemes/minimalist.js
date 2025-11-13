const minimalistScheme = {
    name: 'Minimalist',
    description: 'Neutral colors throughout, very clean',
    colors: {
        // Background and base colors
        bodyBg: '#fafafa',
        containerBg: 'white',
        headerBg: '#f5f5f5',
        bannerBorder: 'rgba(200, 200, 200, 0.8)',
        
        // Navigation
        navBg: '#6c757d',
        navText: '#dee2e6',
        navActive: 'white',
        navActiveText: '#495057',
        navHover: '#A6A5A5',
        
        // Content colors
        textPrimary: '#212529',
        textSecondary: '#6c757d',
        textMuted: '#adb5bd',
        textTitle: '#343a40',      // Darker for titles
        textContent: '#6c757d',    // Lighter for content
        
        // World item backgrounds (all neutral)
        general: '#f8f9fa',
        locations: '#f8f9fa',
        factions: '#f8f9fa',
        concepts: '#f8f9fa',
        events: '#f8f9fa',
        creatures: '#f8f9fa',
        plants: '#f8f9fa',
        items: '#f8f9fa',
        culture: '#f8f9fa',
        cultivation: '#f8f9fa',
        magic: '#f8f9fa',
        itemName: '#383838', 

        //Character profile item colors
        physical: '#6c757d',
        personality: '#adb5bd',
        sexuality: '#868e96',
        fighting: '#495057',
        background: '#adb5bd',
        weapons: '#343a40',
        hobbies: '#6c757d',
        quirks: '#868e96',
        relationships: '#495057',

        // NEW: Link colors (neutral theme)
        linkColor: '#6c757d',           
        linkHover: '#495057', 
        linkColorSecondary: '#8e9aaf',  
        linkHoverSecondary: '#7a8699',
        
        // Status badge colors (neutral)
        statusIdea: '#6c757d',
        statusDraft: '#adb5bd',
        statusCanon: '#495057',
        statusArchived: '#868e96',

        seasonal: {
            winter: '#F8FAFA',    
            spring: '#F8FAF8',    
            summer: '#FAFAF8',   
            autumn: '#FAF8F8'     
        },

        softBg: '#f8f9fa',  // Same neutral light

        kawaiiPink: '#d1bcc2',      
        kawaiiPurple: '#b8adc7',    
        kawaiiBlue: '#a8c5d1',     
        kawaiiGold: '#d4c5a0',    
        kawaiiGreen: '#b5c7a8',    
        kawaiiOrange: '#d1b5a8',   

        wuxiaAccent: '#9ca3af',        // Neutral gray-green
        wuxiaAccentLight: '#d1d5db',   
        wuxiaGlow: 'rgba(156,163,175,0.4)', // Subtle glow

        journalAccent: '#B9B9B9'
    }
};

export default minimalistScheme;