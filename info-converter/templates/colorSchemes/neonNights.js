const neonNightsScheme = {
    name: 'Neon Nights',
    description: 'Classic cyberpunk with electric blues, hot magentas, and neon cyans against dark backgrounds',
    colors: {
        // Background and base colors - dark cyberpunk streets
        bodyBg: '#0a0a0f',          // Deep night black
        containerBg: '#1a1a24',     // Dark purple-black container
        headerBg: '#0f1419',        // Darker slate for headers
        bannerBorder: 'rgba(0, 255, 255, 0.6)', // Cyan border
        
        // Navigation - neon terminal
        navBg: '#0a0a0f',           // Match body
        navText: '#00d4ff',         // Electric cyan text
        navActive: '#ff0080',       // Hot magenta active
        navActiveText: '#ffffff',   // White text on magenta
        navHover: '#1a1a2e',        // Dark blue hover
        
        // Content colors - high contrast neon
        textPrimary: '#e0e6ff',     // Cool white
        textSecondary: '#9bb5ff',   // Light blue
        textMuted: '#6b7db8',       // Muted blue
        textTitle: '#00ffff',       // Pure cyan for titles
        textContent: '#c4d1ff',     // Soft blue for reading
        
        // World item backgrounds - cyberpunk neighborhood districts
        general: '#1a1a2e',  
        locations: '#1a1a2e',       // Electric blue district
        factions: '#2e1a2e',        // Magenta corp zone
        concepts: '#1a2e1a',        // Green data district
        events: '#2e2e1a',          // Yellow warning zone
        creatures: '#2e1a1a',       // Red danger zone
        plants: '#1a2e2e',          // Cyan bio zone
        items: '#2a1a2e',           // Purple tech district
        culture: '#2e1a24',         // Pink entertainment zone
        cultivation: '#1a242e',     // Blue-gray training zone
        magic: '#2a1a2e',
        itemName: '#00ffff',        // Cyan item names
        
        // Character profile item colors - cyberpunk enhancement categories
        physical: '#00d4ff',        // Electric cyan (cybernetic mods)
        personality: '#8a2be2',     // Electric purple (neural patterns)
        sexuality: '#ff1493',       // Hot pink (desire protocols)
        fighting: '#ff4500',        // Electric orange (combat systems)
        background: '#32cd32',      // Neon green (data history)
        weapons: '#ff00ff',         // Electric magenta (gear)
        hobbies: '#00bfff',         // Deep sky blue (leisure programs)
        quirks: '#ffd700',          // Electric gold (glitches)
        relationships: '#ff6347',   // Electric coral (connections)

        // Link colors - neon data streams
        linkColor: '#00d4ff',           // Electric cyan
        linkHover: '#ff00ff',           // Magenta on hover
        linkColorSecondary: '#32cd32',  // Neon green
        linkHoverSecondary: '#ffd700',  // Gold on hover
        
        // Status badge colors - system states
        statusIdea: '#ffd700',      // Gold (new data)
        statusDraft: '#00bfff',     // Deep sky blue (processing)
        statusCanon: '#32cd32',     // Neon green (verified)
        statusArchived: '#8a2be2',  // Purple (stored)

        // Seasonal colors - cyberpunk weather moods
        seasonal: {
            winter: '#0f1824',      // Cold steel blue
            spring: '#0f2418',      // Acid rain green
            summer: '#24180f',      // Heat haze orange
            autumn: '#240f18'       // Neon red twilight
        },

        softBg: '#1a1a2e',  // Electric blue tint

        // Kawaii colors - cyberpunk cute
        kawaiiPink: '#ff1493',      // Hot pink
        kawaiiPurple: '#8a2be2',    // Electric purple
        kawaiiBlue: '#00d4ff',      // Electric cyan
        kawaiiGold: '#ffd700',      // Electric gold
        kawaiiGreen: '#32cd32',     // Neon green
        kawaiiOrange: '#ff4500',    // Electric orange

        wuxiaAccent: '#00ffff',        // Pure cyan for wuxia theme
        wuxiaAccentLight: '#66ffff',   // Light cyan
        wuxiaGlow: 'rgba(0,255,255,0.8)', // Bright cyan glow

        journalAccent: '#00d4ff'    // Electric cyan journal accent
    }
};

export default neonNightsScheme;