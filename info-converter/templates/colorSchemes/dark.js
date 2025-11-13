const darkScheme = {
    name: 'Dark',
    description: 'Dark theme with cool brown accents',
    colors: {
        // Background and base colors
        bodyBg: '#1a1a1a',
        containerBg: '#2d2d2d',
        headerBg: '#404040',
        bannerBorder: 'rgba(100, 100, 100, 0.8)',
        
        // Navigation
        navBg: '#1a1a1a',
        navText: '#c5c5c5',
        navActive: '#5a5a5a',
        navActiveText: '#f0f0f0',
        navHover: '#454545',
        
        // Content colors
        textPrimary: '#f0f0f0',
        textSecondary: '#c5c5c5',
        textMuted: '#8a8a8a',
        textTitle: '#e0e0e0',    // Slightly dimmed for titles
        textContent: '#c5c5c5',  // Different from titles
        
        // World item backgrounds (dark variants with cool browns)
        general: '#3a3a3a',
        locations: '#3a3a3a',
        factions: '#3a3a3a',
        concepts: '#3a3a3a',
        events: '#3a3a3a',
        creatures: '#3a3a3a',
        plants: '#3a3a3a',
        items: '#3a3a3a',
        culture: '#3a3a3a',
        cultivation: '#3a3a3a',
        magic: '#3a2c3e',
        itemName: '#BCBABA', 

        //Character profile item colors
        physical: '#8a7a70',
        personality: '#a67c65',
        sexuality: '#7a6b60',
        fighting: '#9a8575',
        background: '#856b5a',
        weapons: '#7a6555',
        hobbies: '#6b5a4f',
        quirks: '#947d72',
        relationships: '#7e6b5f',

        // NEW: Link colors (dark theme)
        linkColor: '#C8D3C0',           
        linkHover: '#A3AB9D', 
        linkColorSecondary: '#a8c5e8', 
        linkHoverSecondary: '#bdd4f0',   // Even lighter on hover          
        
        // Status badge colors (muted cool tones for dark theme)
        statusIdea: '#8a7a70',
        statusDraft: '#a67c65',
        statusCanon: '#6b7a65',
        statusArchived: '#6b6b6b',

        seasonal: {
            winter: '#2A3F4F',    
            spring: '#2F4A3A',    
            summer: '#4A3F2A',    
            autumn: '#4A322A'     
        },

        softBg: '#404040',  // Lighter than containerBg but still dark

        kawaiiPink: '#c4829e',      
        kawaiiPurple: '#9a7fb8',    
        kawaiiBlue: '#7a9ec4',     
        kawaiiGold: '#c4b87a',      
        kawaiiGreen: '#7bc49a',     // Dark mint
        kawaiiOrange: '#c4997a',    

        wuxiaAccent: '#6b7a65',        // Dark jade from your existing statusCanon
        wuxiaAccentLight: '#8a9690',   // Lighter dark jade
        wuxiaGlow: 'rgba(107,122,101,0.6)', // Dark jade glow

        journalAccent: '#56141B'
    }
};

export default darkScheme;