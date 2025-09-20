// Color scheme definitions
const colorSchemes = {
    current: {
        name: 'Current',
        description: 'Vibrant accent colors',
        colors: {
            // Background and base colors
            bodyBg: '#f5f5f5',
            containerBg: 'white',
            headerBg: '#e8e8e8',
            bannerBorder: 'rgba(235 233 233 / 0.8)',
            
            // Navigation
            navBg: '#444',
            navText: '#ccc',
            navActive: 'white',
            navActiveText: '#333',
            navHover: '#807F7F',
            
            // Content colors
            textPrimary: '#333',
            textSecondary: '#696969',
            textMuted: '#999999',
            textTitle: '#2c3e50',      // Darker for titles
            textContent: '#555',       // Lighter for content
            
            // World item backgrounds (vibrant)
            general: '#B9D8F9',
            locations: '#B9D8F9',
            factions: '#AB9DC9',
            concepts: '#85B490',
            events: '#F1C5A1',
            creatures: '#E6AEC8',
            plants: '#98D8C5',
            items: '#94BEC5',
            culture: '#DDA8AD',        // Red for culture
            cultivation: '#8AB193',
            itemName: '#282626', 
            
            //Character profile item colors
            physical: '#007bff',
            personality: '#6f42c1',
            sexuality: ' #dc3545',
            fighting: ' #28a745',
            background: '#e83e8c',
            weapons: '#20c997',
            hobbies: '#17a2b8',
            quirks: '#fd7e14',        
            relationships: '#28a745',

            // NEW: Link colors for arc and storyline links
            linkColor: '#85AB97',           
            linkHover: '#4A5D70',  
            linkColorSecondary: '#6c9bd1',  // Softer, muted blue
            linkHoverSecondary: '#5a7ba8',
            
            // Status badge colors (vibrant)
            statusIdea: '#dc3545',
            statusDraft: '#ffc107',
            statusCanon: '#28a745',
            statusArchived: '#6c757d',

            seasonal: {
                winter: '#E8F4F8',    // Icy blue-white
                spring: '#F0F8E8',    // Fresh green-white  
                summer: '#FFF8E8',    // Warm golden-white
                autumn: '#F8F0E8'     // Rich orange-white
            },

            softBg: '#f8f9fa',

            kawaiiPink: '#ff69b4',      // Hot pink (vibrant)
            kawaiiPurple: '#9370db',    // Medium slate blue  
            kawaiiBlue: '#00bfff',      // Deep sky blue
            kawaiiGold: '#ffd700',      // Gold
            kawaiiGreen: '#32cd32',     // Lime green
            kawaiiOrange: '#ff6347',    // Tomato

            wuxiaAccent: '#85AB97',        // Use your existing green
            wuxiaAccentLight: '#A3C2AB',   // Lighter version
            wuxiaGlow: 'rgba(133,171,151,0.6)', // Glow effect

            journalAccent: '#DC3D35'
        }
    },
    minimalist: {
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
            linkColor: '#6c757d',           // Muted gray
            linkHover: '#495057', 
            linkColorSecondary: '#8e9aaf',  // Slightly blue-tinted gray
            linkHoverSecondary: '#7a8699',
            
            // Status badge colors (neutral)
            statusIdea: '#6c757d',
            statusDraft: '#adb5bd',
            statusCanon: '#495057',
            statusArchived: '#868e96',

            seasonal: {
                winter: '#F8FAFA',    // Very subtle blue tint
                spring: '#F8FAF8',    // Very subtle green tint  
                summer: '#FAFAF8',    // Very subtle warm tint
                autumn: '#FAF8F8'     // Very subtle orange tint
            },

            softBg: '#f8f9fa',  // Same neutral light

            kawaiiPink: '#d1bcc2',      // Muted rose
            kawaiiPurple: '#b8adc7',    // Muted lavender
            kawaiiBlue: '#a8c5d1',     // Muted sky blue
            kawaiiGold: '#d4c5a0',     // Muted gold
            kawaiiGreen: '#b5c7a8',    // Muted sage
            kawaiiOrange: '#d1b5a8',   // Muted peach

            wuxiaAccent: '#9ca3af',        // Neutral gray-green
            wuxiaAccentLight: '#d1d5db',   // Light gray
            wuxiaGlow: 'rgba(156,163,175,0.4)', // Subtle glow

            journalAccent: '#B9B9B9'
        }
    },
    professional: {
        name: 'Professional',
        description: 'Conservative business palette with muted grays and navy accents for formal documentation',
        colors: {
            // Background and base colors - conservative business feel
            bodyBg: '#fafafa',          // Very light neutral gray
            containerBg: '#ffffff',     // Pure white for content
            headerBg: '#f5f5f5',        // Light neutral gray header
            bannerBorder: 'rgba(55, 65, 81, 0.2)', // Muted dark gray border
            
            // Navigation - conservative and understated
            navBg: '#fafafa',           // Match body for seamless look
            navText: '#374151',         // Dark gray
            navActive: '#1f2937',       // Dark charcoal active
            navActiveText: '#ffffff',   // White text on dark
            navHover: '#B3B4B6',        // Very light gray hover
            
            // Content colors - conservative and highly readable
            textPrimary: '#111827',     // Nearly black
            textSecondary: '#374151',   // Dark gray
            textMuted: '#6b7280',       // Medium gray
            textTitle: '#000000',       // Pure black for titles
            textContent: '#1f2937',     // Dark charcoal for reading
            
            // World item backgrounds - very subtle neutral variations
            general: '#f9fafb', 
            locations: '#f9fafb',       // Barely tinted gray (places)
            factions: '#f8f9fa',        // Subtle cool gray (groups)
            concepts: '#fafbfc',        // Nearly white (knowledge)
            events: '#fffef7',          // Hint of warm (happenings)
            creatures: '#fafbfa',       // Hint of green (beings)
            plants: '#f9fbf9',          // Very subtle green (flora)
            items: '#f8f9fb',           // Hint of blue (objects)
            culture: '#faf9fb',         // Hint of purple (traditions)
            cultivation: '#f8fafb',     // Subtle blue (practices)
            itemName: '#000000',        // Pure black for item names
            
            // Character profile item colors - muted professional palette
            physical: '#1e40af',        // Navy blue (appearance)
            personality: '#374151',     // Dark gray (character)
            sexuality: '#be185d',       // Muted rose (passion)
            fighting: '#991b1b',        // Dark red (combat)
            background: '#581c87',      // Dark purple (history)
            weapons: '#1f2937',         // Charcoal (implements)
            hobbies: '#0f766e',         // Dark teal (leisure)
            quirks: '#92400e',          // Dark amber (traits)
            relationships: '#166534',   // Dark green (connections)

            // Link colors - conservative and professional
            linkColor: '#1e40af',           // Navy blue
            linkHover: '#1e3a8a',           // Darker navy on hover
            linkColorSecondary: '#374151',  // Dark gray for variety
            linkHoverSecondary: '#1f2937',  // Darker gray on hover
            
            // Status badge colors - conservative business indicators
            statusIdea: '#6b7280',      // Gray (preliminary)
            statusDraft: '#1e40af',     // Navy (in review)
            statusCanon: '#166534',     // Dark green (approved)
            statusArchived: '#4b5563',  // Medium gray (archived)

            // Seasonal colors - barely perceptible professional variations
            seasonal: {
                winter: '#f8f9fb',      // Barely cool tinted
                spring: '#f9fbf9',      // Barely green tinted
                summer: '#fffef9',      // Barely warm tinted
                autumn: '#fffef7'       // Barely amber tinted
            },

            softBg: '#f9fafb',  // Very subtle gray

            kawaiiPink: '#c4a4a7',      // Professional rose
            kawaiiPurple: '#a294b8',    // Professional lavender
            kawaiiBlue: '#6b9bd1',      // Professional blue
            kawaiiGold: '#b8a876',      // Professional gold
            kawaiiGreen: '#8ba67c',     // Professional sage
            kawaiiOrange: '#c49a7c',    // Professional bronze

            wuxiaAccent: '#374151',        // Professional dark gray
            wuxiaAccentLight: '#6b7280',   // Medium gray
            wuxiaGlow: 'rgba(55,65,81,0.3)', // Subtle gray glow

            journalAccent: '#1e40af'    // Navy blue journal accent
        }
    },
    modernBlue: {
        name: 'Modern Blue',
        description: 'Clean contemporary design with cool grays and vibrant blue accents',
        colors: {
            // Background and base colors 
            bodyBg: '#f8f9fb',          // Very light cool gray
            containerBg: '#ffffff',      // Pure white for content
            headerBg: '#e8ebf0',        // Light blue-gray header
            bannerBorder: 'rgba(71, 85, 105, 0.3)', // Professional slate border
            
            // Navigation
            navBg: '#f8f9fb',           // Match body for seamless look
            navText: '#475569',         // Slate gray
            navActive: '#3b82f6',       // Professional blue active
            navActiveText: '#ffffff',   // White text on blue
            navHover: '#C4CBD4',        // Light gray hover
            
            // Content colors
            textPrimary: '#1e293b',     // Dark slate
            textSecondary: '#475569',   // Medium slate
            textMuted: '#94a3b8',       // Light slate
            textTitle: '#0f172a',       // Darkest slate for titles
            textContent: '#334155',     // Reading slate
            
            // World item backgrounds 
            general: '#f1f5f9', 
            locations: '#f1f5f9',       // Cool blue-white (places)
            factions: '#f0f4f8',        // Neutral blue-white (groups)
            concepts: '#f8fafc',        // Pure cool white (knowledge)
            events: '#fef3c7',          // Subtle amber (happenings)
            creatures: '#ecfdf5',       // Subtle green (beings)
            plants: '#f0fdf4',          // Fresh green-white (flora)
            items: '#eff6ff',           // Professional blue (objects)
            culture: '#faf5ff',         // Subtle purple (traditions)
            cultivation: '#f0f9ff',     // Light blue (practices)
            itemName: '#0f172a',        // Dark slate for item names
            
            // Character profile item colors 
            physical: '#3b82f6',        // Professional blue (appearance)
            personality: '#6366f1',     // Indigo (character)
            sexuality: '#ec4899',       // Pink (passion)
            fighting: '#ef4444',        // Red (combat)
            background: '#8b5cf6',      // Purple (history)
            weapons: '#64748b',         // Slate (implements)
            hobbies: '#06b6d4',         // Cyan (leisure)
            quirks: '#f59e0b',          // Amber (traits)
            relationships: '#10b981',   // Emerald (connections)

            // Link colors
            linkColor: '#3b82f6',           // Professional blue
            linkHover: '#2563eb',           // Darker blue on hover
            linkColorSecondary: '#6366f1',  // Indigo for variety
            linkHoverSecondary: '#4f46e5',  // Darker indigo on hover
            
            // Status badge colors 
            statusIdea: '#f59e0b',      // Amber (brainstorming)
            statusDraft: '#3b82f6',     // Blue (in progress)
            statusCanon: '#10b981',     // Green (approved)
            statusArchived: '#6b7280',  // Gray (archived)

            // Seasonal colors 
            seasonal: {
                winter: '#f1f5f9',      // Cool professional blue-white
                spring: '#f0fdf4',      // Fresh professional green-white
                summer: '#fffbeb',      // Warm professional cream
                autumn: '#fef3c7'       // Professional amber-white
            },

            softBg: '#f8fafc',  // Very light cool gray

            kawaiiPink: '#ec8bb7',      // Cool pink
            kawaiiPurple: '#a78bfa',    // Cool purple
            kawaiiBlue: '#3b82f6',      // Professional blue (existing)
            kawaiiGold: '#fbbf24',      // Cool gold
            kawaiiGreen: '#34d399',     // Cool emerald
            kawaiiOrange: '#fb923c',    // Cool orange

            wuxiaAccent: '#10b981',        // Professional emerald
            wuxiaAccentLight: '#34d399',   // Light emerald
            wuxiaGlow: 'rgba(16,185,129,0.4)', // Professional emerald glow

            journalAccent: '#3b82f6'    
        }
    },
    dark: {
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
            linkColorSecondary: '#a8c5e8', // Softer light blue
            linkHoverSecondary: '#bdd4f0',   // Even lighter on hover          
            
            // Status badge colors (muted cool tones for dark theme)
            statusIdea: '#8a7a70',
            statusDraft: '#a67c65',
            statusCanon: '#6b7a65',
            statusArchived: '#6b6b6b',

            seasonal: {
                winter: '#2A3F4F',    // Deep blue-gray
                spring: '#2F4A3A',    // Dark forest green
                summer: '#4A3F2A',    // Warm dark brown
                autumn: '#4A322A'     // Rich dark auburn
            },

            softBg: '#404040',  // Lighter than containerBg but still dark

            kawaiiPink: '#c4829e',      // Dark rose
            kawaiiPurple: '#9a7fb8',    // Dark lavender
            kawaiiBlue: '#7a9ec4',      // Dark sky blue
            kawaiiGold: '#c4b87a',      // Dark gold
            kawaiiGreen: '#7bc49a',     // Dark mint
            kawaiiOrange: '#c4997a',    // Dark peach

            wuxiaAccent: '#6b7a65',        // Dark jade from your existing statusCanon
            wuxiaAccentLight: '#8a9690',   // Lighter dark jade
            wuxiaGlow: 'rgba(107,122,101,0.6)', // Dark jade glow

            journalAccent: '#56141B'
        }
    },
    elegant: {
        name: 'Elegant',
        description: 'Sophisticated grays with pale pink and jade accents',
        colors: {
            // Background and base colors
            bodyBg: '#f8f9fa',
            containerBg: 'white',
            headerBg: '#e9ecef',
            bannerBorder: 'rgba(220, 220, 230, 0.8)',
            
            // Navigation
            navBg: '#495057',
            navText: '#ced4da',
            navActive: 'white',
            navActiveText: '#495057',
            navHover: '#495057',
            
            // Content colors
            textPrimary: '#343a40',
            textSecondary: '#6c757d',
            textMuted: '#adb5bd',
            textTitle: '#495057',      // Darker for titles
            textContent: '#6c757d',    // Lighter for content
            
            // World item backgrounds (elegant with subtle accents)
            general: '#f1f3f4',
            locations: '#f1f3f4',
            factions: '#F7F5F3', 
            concepts: '#F2F4F0', 
            events: '#f1f3f4',
            creatures: '#F7F8F0', 
            plants: '#f0f4f1', 
            items: '#f1f3f4',
            culture: '#F8F4F0', 
            cultivation: '#F2F0F4', 
            itemName: '#282C29', // World item text

            //Character profile item colors
            physical: '#93B086',
            personality: '#988EB7',
            sexuality: '#D1A3AC',
            fighting: '#8B8E89',
            background: '#C3B08A',
            weapons: '#6c757d',
            hobbies: '#A3AEB7',
            quirks: '#C3B08A',
            relationships: '#93B086',

            // Link colors
            linkColor: '#BDBFBC',           
            linkHover: '#8B8E89',  
            linkColorSecondary: '#A3AEB7 ',           
            linkHoverSecondary: '#9AA3AB ',             
            
            // Status badge colors (elegant, muted)
            statusIdea: '#988EB7',
            statusDraft: '#C3B08A',
            statusCanon: '#93B086',
            statusArchived: '#9ca3af',

            seasonal: {
                winter: '#E5EDF3',    // Sophisticated ice blue
                spring: '#EBF4EB',    // Refined sage green
                summer: '#EEEAE1',    // Elegant warm cream
                autumn: '#F2EBE9',     // Refined warm rose            
            },

            softBg: '#f6f7f8',  // Softer than headerBg

            kawaiiPink: '#d4a8b8',      // Elegant rose
            kawaiiPurple: '#b8a8d4',    // Elegant lavender
            kawaiiBlue: '#a8c4d4',      // Elegant sky
            kawaiiGold: '#d4c8a8',      // Elegant champagne
            kawaiiGreen: '#a8d4b8',     // Elegant jade
            kawaiiOrange: '#d4b8a8',    // Elegant coral

            wuxiaAccent: '#93B086',        // Use your existing physical color
            wuxiaAccentLight: '#A3AEB7',   // Use your existing hobbies color
            wuxiaGlow: 'rgba(147,176,134,0.5)', // Elegant jade glow

            journalAccent: '#dc3545'
        }
    },
    imperialAutumn: {
        name: 'Imperial Autumn',
        description: 'A rich, warm take on the Elegant theme with crimson, gold, and terracotta accents.',
        colors: {
            // Background and base colors
            bodyBg: '#F9F5F0',          // Warm parchment
            containerBg: '#FFFBF5',      // Creamy white
            headerBg: '#EFEAE4',        // Soft warm gray
            bannerBorder: 'rgba(140, 80, 60, 0.8)', // Muted crimson border
            
            // Navigation
            navBg: '#4D382D',           // Deep, dark brown
            navText: '#D4C2B4',          // Warm beige text
            navActive: '#A8A39A',        // Cream active background
            navActiveText: '#4D382D',    // Dark brown text
            navHover: '#6A5546',         // Lighter warm brown
            
            // Content colors
            textPrimary: '#3B2E26',      // Dark espresso brown
            textSecondary: '#6A5546',    // Warm mid-brown
            textMuted: '#9A8478',        // Soft taupe
            textTitle: '#3B2E26',        // Darkest brown for titles
            textContent: '#6A5546',      // Warm brown for content
            
            // World item backgrounds (subtle warm tones)
            general: '#F7F2EC',
            locations: '#F7F2EC',        // Very light warm cream
            factions: '#F5F0E8', 
            concepts: '#F8F4EF', 
            events: '#F7F2EC',
            creatures: '#F5F0E8', 
            plants: '#F8F4EF', 
            items: '#F7F2EC',
            culture: '#F5F0E8', 
            cultivation: '#F8F4EF', 
            itemName: '#4D382D',         // World item text

            //Character profile item colors
            physical: '#9A453D',         // Deep crimson
            personality: '#4A5D43',      // Deep, muted forest green
            sexuality: '#C77B57',        // Burnt orange / Terracotta
            fighting: '#6A5546',         // Strong warm brown
            background: '#B59461',       // Muted gold / Ochre
            weapons: '#3B2E26',          // Darkest brown
            hobbies: '#C77B57',        // Burnt orange
            quirks: '#B59461',           // Muted gold
            relationships: '#4A5D43',      // Deep green

            // Link colors
            linkColor: '#C77B57',         // Burnt orange
            linkHover: '#9A453D',        // Deep crimson on hover
            linkColorSecondary: '#B59461', // Muted gold
            linkHoverSecondary: '#9C7E52', // Darker gold on hover          
            
            // Status badge colors (rich autumn tones)
            statusIdea: '#C77B57',       // Burnt orange
            statusDraft: '#B59461',      // Muted gold
            statusCanon: '#9A453D',      // Deep crimson
            statusArchived: '#8D7B70',   // Muted brown-gray

            seasonal: {
                winter: '#F0EBE4',       // Cooler, muted cream
                spring: '#F3F5EB',       // Hint of green
                summer: '#FFF4E0',       // Warmer, golden cream
                autumn: '#F9F0E5',       // Richer autumn cream         
            },

            softBg: '#FAF7F2',  // Warm cream, lighter than containerBg

            kawaiiPink: '#d4857a',      // Autumn rose
            kawaiiPurple: '#a67c8f',    // Autumn plum
            kawaiiBlue: '#7a8fb8',      // Autumn steel blue
            kawaiiGold: '#d4af5d',      // Rich autumn gold
            kawaiiGreen: '#8fb87a',     // Autumn sage
            kawaiiOrange: '#d49a5d',    // Rich autumn orange

            wuxiaAccent: '#8AB193',        // Muted autumn jade
            wuxiaAccentLight: '#A3C2AB',   // Lighter autumn jade
            wuxiaGlow: 'rgba(138,177,147,0.5)', // Warm jade glow

            journalAccent: '#9A453D'     // Deep crimson
        }
    },
    cloudRecesses: {
        name: 'Cloud Recesses',
        description: 'Elegant jade and ivory palette inspired by Mo Dao Zu Shi',
        colors: {
            // Background and base colors - serene whites with jade hints
            bodyBg: '#f8faf9',          // Soft jade-tinted white
            containerBg: '#ffffff',      // Pure white for content
            headerBg: '#f0f4f1',        // Very light jade
            bannerBorder: 'rgba(160, 190, 170, 0.6)', // Soft jade border
            
            // Navigation - like polished jade and ivory
            navBg: '#f8faf9',           // Match body for seamless look
            navText: '#4a5d4f',         // Deep jade-gray
            navActive: '#a0beaa',       // Soft jade active
            navActiveText: '#2d3d32',   // Dark jade text
            navHover: '#e8f0ea',        // Very light jade hover
            
            // Content colors - refined and readable
            textPrimary: '#2d3d32',     // Deep jade-black
            textSecondary: '#4a5d4f',   // Medium jade-gray
            textMuted: '#7a8d7f',       // Light jade-gray
            textTitle: '#2d3d32',       // Deep jade for titles
            textContent: '#4a5d4f',     // Medium jade for content
            
            // World item backgrounds - subtle jade variations like different types of jade
            general: '#f5f8f6',   
            locations: '#f5f8f6',       // Pale jade (places)
            factions: '#f3f7f4',        // Slightly deeper jade (groups)
            concepts: '#f0f6f2',        // Soft jade (knowledge)
            events: '#f7f5f0',          // Warm jade-gold (happenings)
            creatures: '#f2f6f3',       // Cool jade (beings)
            plants: '#f0f8f2',          // Fresh jade (flora)
            items: '#f4f6f5',           // Neutral jade (objects)
            culture: '#f6f4f0',         // Warm ivory-jade (traditions)
            cultivation: '#f0f7f3',     // Pure jade (spiritual practices)
            itemName: '#2d3d32',        // Deep jade for item names
            
            // Character profile item colors - refined jade palette
            physical: '#7ba885',        // Soft jade green
            personality: '#6b9470',     // Medium jade
            sexuality: '#d4a574',       // Warm gold (for passion/desire)
            fighting: '#5d7864',        // Deeper jade (martial arts)
            background: '#8fb197',      // Light jade (past/history)
            weapons: '#4a5d4f',         // Dark jade (implements)
            hobbies: '#a3c2ab',         // Bright jade (leisure)
            quirks: '#c4a876',          // Soft gold (unique traits)
            relationships: '#7ba885',   // Jade (connections)

            // Link colors - like flowing silk ribbons
            linkColor: '#7ba885',           // Soft jade
            linkHover: '#5d7864',           // Deeper jade on hover
            linkColorSecondary: '#c4a876',  // Warm gold for variety
            linkHoverSecondary: '#b8995f',  // Deeper gold on hover
            
            // Status badge colors - like traditional seals
            statusIdea: '#a3c2ab',      // Light jade (new ideas)
            statusDraft: '#c4a876',     // Gold (in progress)
            statusCanon: '#7ba885',     // Jade (established)
            statusArchived: '#8a9690',  // Muted jade-gray (stored)

            // Seasonal colors - subtle jade variations
            seasonal: {
                winter: '#f2f6f4',      // Cool jade-white
                spring: '#f0f8f2',      // Fresh jade-white
                summer: '#f7f6f0',      // Warm jade-gold
                autumn: '#f4f3f0'       // Muted jade-ivory
            },

            softBg: '#f5f8f6',  // Very pale jade-tinted

            kawaiiPink: '#c4a8b1',      // Jade-tinted rose
            kawaiiPurple: '#a8b8c4',    // Jade-tinted lavender
            kawaiiBlue: '#8fb8a8',      // Jade-tinted blue
            kawaiiGold: '#c4b88f',      // Jade-tinted gold
            kawaiiGreen: '#8fb197',     // Cloud recesses jade (existing)
            kawaiiOrange: '#b8a48f',    // Jade-tinted coral

            wuxiaAccent: '#7ba885',        // Main jade color for wuxia theme
            wuxiaAccentLight: '#a3c2ab',   // Lighter jade for hover effects
            wuxiaGlow: 'rgba(240,249,240,0.6)', // Jade glow effect

            journalAccent: '#7ba885'    // Elegant jade accent
        }
    },
    coffee: {
        name: 'Coffee',
        description: 'Warm coffee and cream tones with rich brown accents',
        colors: {
            // Background and base colors
            bodyBg: '#F5F1EB',      // Cream base
            containerBg: '#F8F4EC', // Light cream instead of pure white
            headerBg: '#E8DDD0',    // Light tan
            bannerBorder: 'rgba(175, 127, 93, 0.9)', // Tan brown border
            
            // Navigation  
            navBg: '#6F4E37',       // Coffee brown
            navText: '#C09A7F',     // Light tan text
            navActive: '#b39b7b',   // Cream active
            navActiveText: '#2B1E15', // Dark text on cream
            navHover: '#8D6B52',
            
            // Content colors
            textPrimary: '#2B1E15', // Dark coffee brown
            textSecondary: '#4D3626', // Medium coffee brown
            textMuted: '#916648',   // Light coffee brown
            textTitle: '#2B1E15',   // Dark coffee for titles
            textContent: '#4D3626', // Medium coffee for content
            
            // World item backgrounds (cream variations)
            general: '#AF7F5D', 
            locations: '#AF7F5D',     // Tan brown
            factions: '#6F4E37',      // Coffee brown
            concepts: '#916648',      // Light coffee
            events: '#8B7865',        // Muted coffee
            creatures: '#A67C52',     // Medium coffee
            plants: '#9A6B47',        // Rich coffee
            items: '#7D5A42',         // Dark coffee
            culture: '#B8956A',       // Light tan brown
            cultivation: '#8A6F50',    // Deep coffee brown
            itemName: '#453425', // World item text

            //Character profile item colors
            physical: '#AF7F5D',
            personality: '#8B7865',
            sexuality: '#956B50',
            fighting: '#6F4E37',
            background: '#8A6F50',
            weapons: '#4D3626',
            hobbies: '#C4A484',
            quirks: '#B8956A',
            relationships: '#9A6B47',

            linkColor: '#AF7F5D',           // Tan brown
            linkHover: '#6F4E37',
            linkColorSecondary: '#C4A484',  // Softer, lighter tan
            linkHoverSecondary: '#B08968',
            
            // Status badge colors (coffee themed)
            statusIdea: '#916648',    // Light coffee
            statusDraft: '#AF7F5D',   // Medium coffee
            statusCanon: '#6F4E37',   // Dark coffee
            statusArchived: '#8B7865', // Muted coffee

            seasonal: {
                winter: '#c7c0b5',    // Cool coffee cream
                spring: '#bbc7c4',    // Fresh coffee cream (lighter)
                summer: '#e5d0c2',    // Warm coffee cream  
                autumn: '#E8D9C1'     // Rich coffee cream
            },

            softBg: '#FAF6F0',  // Light cream

            kawaiiPink: '#d4a08f',      // Coffee rose
            kawaiiPurple: '#b88fa8',    // Coffee lavender
            kawaiiBlue: '#8fa8b8',      // Coffee blue
            kawaiiGold: '#d4b88f',      // Coffee cream gold
            kawaiiGreen: '#a8b88f',     // Coffee sage
            kawaiiOrange: '#d4a875',    // Coffee caramel

            wuxiaAccent: '#9A6B47',        // Rich coffee-jade blend
            wuxiaAccentLight: '#B8956A',   // Light coffee-jade
            wuxiaGlow: 'rgba(154,107,71,0.5)', // Warm coffee-jade glow

            journalAccent: '#956B50'
        }
    },
    lavender: {
        name: 'Lavender',
        description: 'Soothing lavender and purple tones',
        colors: {
            // Background and base colors
            bodyBg: '#faf5ff',         // Very light lavender
            containerBg: '#ffffff',     // Clean white
            headerBg: '#f3e8ff',       // Light lavender header
            bannerBorder: 'rgba(139, 92, 246, 0.3)',
            
            // Navigation
            navBg: '#faf5ff',
            navText: '#581c87',         // Deep purple
            navActive: '#ede9fe',
            navActiveText: '#6b21a8',
            navHover: '#f3e8ff',
            
            // Content colors
            textPrimary: '#581c87',     // Deep purple
            textSecondary: '#7c3aed',   // Medium purple
            textMuted: '#8b5cf6',       // Bright purple
            textTitle: '#581c87',       // Deep purple for titles
            textContent: '#7c3aed',     // Medium purple for content
            
            // World item backgrounds (lavender variations)
            general: '#fefbff', 
            locations: '#fefbff',       // Nearly white with hint of purple
            factions: '#faf5ff',        // Very light lavender
            concepts: '#f3e8ff',        // Light lavender
            events: '#ede9fe',          // Soft lavender
            creatures: '#ddd6fe',       // Medium lavender
            plants: '#c4b5fd',          // Bright lavender
            items: '#a78bfa',           // Vibrant purple
            culture: '#8b5cf6',         // Medium purple
            cultivation: '#7c3aed',     // Deep purple

            //Character profile item colors
            physical: '#7c3aed',
            personality: '#6b21a8',
            sexuality: '#8b5cf6',
            fighting: '#581c87',
            background: '#a78bfa',
            weapons: '#6d28d9',
            hobbies: '#c4b5fd',
            quirks: '#ddd6fe',
            relationships: '#7c3aed',

            linkColor: '#8b5cf6',       // Bright purple
            linkHover: '#7c3aed',       // Deeper on hover
            linkColorSecondary: '#a78bfa', // Softer purple
            linkHoverSecondary: '#8b5cf6', // Brighter on hover
            
            // Status badge colors
            statusIdea: '#c4b5fd',
            statusDraft: '#a78bfa',
            statusCanon: '#8b5cf6',
            statusArchived: '#6d28d9',

            seasonal: {
                winter: '#faf5ff',      // Very light lavender
                spring: '#f3e8ff',      // Light lavender
                summer: '#ede9fe',      // Soft lavender
                autumn: '#ddd6fe'       // Medium lavender
            },

            kawaiiPink: '#f9a8d4',      // Bright lavender pink
            kawaiiPurple: '#c4b5fd',    // Bright lavender (existing style)
            kawaiiBlue: '#a8c5f9',      // Lavender blue
            kawaiiGold: '#f9d4a8',      // Lavender gold
            kawaiiGreen: '#a8f9c5',     // Lavender mint
            kawaiiOrange: '#f9c5a8',    // Lavender peach

            wuxiaAccent: '#B39FBC',        // Blue-green jade (complements purple)
            wuxiaAccentLight: '#C9BFCF',   // Light blue-jade
            wuxiaGlow: 'rgba(178 159 188 / 0.6)', // Cool jade glow

            softBg: '#faf5ff',  // Very light lavender

            journalAccent: '#7c3aed'
        }
    },
    pink: {
        name: 'Rose Pink',
        description: 'Soft pink palette with warm rose accents',
        colors: {
            // Background and base colors
            bodyBg: '#fdf2f8',         // Very light pink
            containerBg: '#ffffff',     // Clean white
            headerBg: '#fce7f3',       // Light pink header
            bannerBorder: 'rgba(236, 72, 153, 0.3)',
            
            // Navigation
            navBg: '#fdf2f8',
            navText: '#831843',         // Deep pink
            navActive: '#f3e8ff',
            navActiveText: '#86198f',
            navHover: '#fce7f3',
            
            // Content colors
            textPrimary: '#831843',     // Deep rose
            textSecondary: '#be185d',   // Medium pink
            textMuted: '#ec4899',       // Bright pink
            textTitle: '#831843',       // Deep rose for titles
            textContent: '#be185d',     // Medium pink for content
            
            // World item backgrounds (pink variations)
            general: '#fef7ff', 
            locations: '#fef7ff',       // Lightest pink
            factions: '#fae8ff',        // Light purple-pink
            concepts: '#f5d0fe',        // Soft pink
            events: '#f0abfc',          // Medium pink
            creatures: '#e879f9',       // Bright pink
            plants: '#d946ef',          // Vibrant pink
            items: '#c026d3',           // Deep pink
            culture: '#a21caf',         // Rich pink
            cultivation: '#86198f',     // Purple-pink

            //Character profile item colors
            physical: '#be185d',
            personality: '#a21caf',
            sexuality: '#ec4899',
            fighting: '#831843',
            background: '#c026d3',
            weapons: '#9f1239',
            hobbies: '#f472b6',
            quirks: '#f9a8d4',
            relationships: '#be185d',

            linkColor: '#ec4899',       // Bright pink
            linkHover: '#be185d',       // Deeper on hover
            linkColorSecondary: '#f472b6',  // Softer pink
            linkHoverSecondary: '#ec4899',  // Brighter on hover
            
            // Status badge colors
            statusIdea: '#f9a8d4',
            statusDraft: '#ec4899',
            statusCanon: '#be185d',
            statusArchived: '#9f1239',

            seasonal: {
                winter: '#fdf2f8',      // Very light pink
                spring: '#fce7f3',      // Light pink
                summer: '#fbcfe8',      // Soft pink
                autumn: '#f9a8d4'       // Medium pink
            },

            softBg: '#fef7ff',  // Very light pink

            kawaiiPink: '#f472b6',      // Hot pink (existing style)
            kawaiiPurple: '#c084fc',    // Pink purple
            kawaiiBlue: '#7dd3fc',      // Pink blue
            kawaiiGold: '#fde047',      // Pink gold
            kawaiiGreen: '#4ade80',     // Pink green
            kawaiiOrange: '#fb7185',    // Pink coral

            wuxiaAccent: '#D898BB',        // Powder blue-jade (complements pink)
            wuxiaAccentLight: '#E8B8E0',   // Light powder jade
            wuxiaGlow: 'rgba(216 152 193 / 0.6)', // Cool jade glow

            journalAccent: '#be185d'
        }
    },
    mintCream: {
        name: 'Mint Cream',
        description: 'Soft mint green and cream pastels with gentle aqua accents',
        colors: {
            // Background and base colors
            bodyBg: '#f0fdf4',         // Very light mint
            containerBg: '#ffffff',     // Clean white
            headerBg: '#ecfdf5',       // Light mint header
            bannerBorder: 'rgba(52, 211, 153, 0.3)',
            
            // Navigation
            navBg: '#f0fdf4',
            navText: '#047857',         // Deep green
            navActive: '#d1fae5',
            navActiveText: '#065f46',
            navHover: '#ecfdf5',
            
            // Content colors
            textPrimary: '#065f46',     // Deep forest green
            textSecondary: '#047857',   // Medium green
            textMuted: '#10b981',       // Bright mint
            textTitle: '#064e3b',       // Darkest green for titles
            textContent: '#047857',     // Medium green for content
            
            // World item backgrounds (mint variations)
            general: '#f0fdf4', 
            locations: '#f0fdf4',       // Lightest mint
            factions: '#dcfce7',        // Light mint
            concepts: '#bbf7d0',        // Soft mint
            events: '#86efac',          // Medium mint
            creatures: '#4ade80',       // Bright mint
            plants: '#22c55e',          // Vibrant green
            items: '#16a34a',           // Deep green
            culture: '#15803d',         // Rich green
            cultivation: '#166534',     // Forest green
            itemName: '#064e3b',

            //Character profile item colors
            physical: '#10b981',
            personality: '#047857',
            sexuality: '#f472b6',       // Soft pink accent
            fighting: '#065f46',
            background: '#22c55e',
            weapons: '#064e3b',
            hobbies: '#6ee7b7',
            quirks: '#a7f3d0',
            relationships: '#34d399',

            linkColor: '#10b981',       // Bright mint
            linkHover: '#047857',       // Deeper on hover
            linkColorSecondary: '#f472b6', // Soft pink
            linkHoverSecondary: '#ec4899', // Brighter pink on hover
            
            // Status badge colors
            statusIdea: '#a7f3d0',
            statusDraft: '#6ee7b7',
            statusCanon: '#34d399',
            statusArchived: '#047857',

            seasonal: {
                winter: '#f0fdf4',      // Very light mint
                spring: '#ecfdf5',      // Light mint
                summer: '#d1fae5',      // Soft mint
                autumn: '#bbf7d0'       // Medium mint
            },

            softBg: '#f0fdf4',

            kawaiiPink: '#f9a8c5',      // Mint pink
            kawaiiPurple: '#c5a8f9',    // Mint purple
            kawaiiBlue: '#a8c5f9',      // Mint blue
            kawaiiGold: '#f9d4a8',      // Mint gold
            kawaiiGreen: '#6ee7b7',     // Bright mint (existing style)
            kawaiiOrange: '#f9c5a8',    // Mint peach

            wuxiaAccent: '#34d399',        // Bright mint jade
            wuxiaAccentLight: '#6ee7b7',   // Light mint jade
            wuxiaGlow: 'rgba(52, 211, 153, 0.6)',

            journalAccent: '#10b981'
        }
    },
    peachBlossom: {
        name: 'Peach Blossom',
        description: 'Warm peach and coral tones with soft orange accents',
        colors: {
            // Background and base colors
            bodyBg: '#fff7ed',         // Very light peach
            containerBg: '#ffffff',     // Clean white
            headerBg: '#ffedd5',       // Light peach header
            bannerBorder: 'rgba(251, 146, 60, 0.3)',
            
            // Navigation
            navBg: '#fff7ed',
            navText: '#c2410c',         // Deep orange
            navActive: '#fed7aa',
            navActiveText: '#9a3412',
            navHover: '#ffedd5',
            
            // Content colors
            textPrimary: '#9a3412',     // Deep orange-brown
            textSecondary: '#c2410c',   // Medium orange
            textMuted: '#fb923c',       // Bright peach
            textTitle: '#7c2d12',       // Darkest orange for titles
            textContent: '#c2410c',     // Medium orange for content
            
            // World item backgrounds (peach variations)
            general: '#fff7ed',   
            locations: '#fff7ed',       // Lightest peach
            factions: '#ffedd5',        // Light peach
            concepts: '#fed7aa',        // Soft peach
            events: '#fdba74',          // Medium peach
            creatures: '#fb923c',       // Bright peach
            plants: '#f97316',          // Vibrant orange
            items: '#ea580c',           // Deep orange
            culture: '#dc2626',         // Rich red-orange
            cultivation: '#b91c1c',     // Deep red
            itemName: '#7c2d12',

            //Character profile item colors
            physical: '#fb923c',
            personality: '#c2410c',
            sexuality: '#f472b6',       // Pink accent
            fighting: '#9a3412',
            background: '#f97316',
            weapons: '#7c2d12',
            hobbies: '#fed7aa',
            quirks: '#fde68a',          // Soft yellow
            relationships: '#fdba74',

            linkColor: '#fb923c',       // Bright peach
            linkHover: '#c2410c',       // Deeper on hover
            linkColorSecondary: '#fde68a', // Soft yellow
            linkHoverSecondary: '#fbbf24', // Brighter yellow on hover
            
            // Status badge colors
            statusIdea: '#fed7aa',
            statusDraft: '#fdba74',
            statusCanon: '#fb923c',
            statusArchived: '#c2410c',

            seasonal: {
                winter: '#fff7ed',      // Very light peach
                spring: '#ffedd5',      // Light peach
                summer: '#fed7aa',      // Soft peach
                autumn: '#fdba74'       // Medium peach
            },

            softBg: '#fff7ed',

            kawaiiPink: '#fdba74',      // Peach pink (existing style)
            kawaiiPurple: '#c084fc',    // Peach purple
            kawaiiBlue: '#7dd3fc',      // Peach blue
            kawaiiGold: '#fde047',      // Peach gold (existing style)
            kawaiiGreen: '#4ade80',     // Peach green
            kawaiiOrange: '#fb923c',    // Bright peach (existing)

            wuxiaAccent: '#fb923c',        // Bright peach jade
            wuxiaAccentLight: '#fed7aa',   // Light peach jade
            wuxiaGlow: 'rgba(251, 146, 60, 0.6)',

            journalAccent: '#fb923c'
        }
    },
    skyBlue: {
        name: 'Sky Blue',
        description: 'Gentle sky blues and clouds with soft cyan accents',
        colors: {
            // Background and base colors
            bodyBg: '#f0f9ff',         // Very light sky blue
            containerBg: '#ffffff',     // Clean white
            headerBg: '#e0f2fe',       // Light sky blue header
            bannerBorder: 'rgba(14, 165, 233, 0.3)',
            
            // Navigation
            navBg: '#f0f9ff',
            navText: '#0c4a6e',         // Deep blue
            navActive: '#bae6fd',
            navActiveText: '#0369a1',
            navHover: '#e0f2fe',
            
            // Content colors
            textPrimary: '#0c4a6e',     // Deep ocean blue
            textSecondary: '#0369a1',   // Medium blue
            textMuted: '#0ea5e9',       // Bright sky blue
            textTitle: '#082f49',       // Darkest blue for titles
            textContent: '#0369a1',     // Medium blue for content
            
            // World item backgrounds (sky blue variations)
            general: '#f0f9ff',    
            locations: '#f0f9ff',       // Lightest sky
            factions: '#e0f2fe',        // Light sky
            concepts: '#bae6fd',        // Soft sky
            events: '#7dd3fc',          // Medium sky
            creatures: '#38bdf8',       // Bright sky
            plants: '#0ea5e9',          // Vibrant blue
            items: '#0284c7',           // Deep blue
            culture: '#0369a1',         // Rich blue
            cultivation: '#075985',     // Ocean blue
            itemName: '#082f49',

            //Character profile item colors
            physical: '#0ea5e9',
            personality: '#0369a1',
            sexuality: '#f472b6',       // Pink accent
            fighting: '#0c4a6e',
            background: '#0284c7',
            weapons: '#082f49',
            hobbies: '#7dd3fc',
            quirks: '#bae6fd',
            relationships: '#38bdf8',

            linkColor: '#0ea5e9',       // Bright sky blue
            linkHover: '#0369a1',       // Deeper on hover
            linkColorSecondary: '#f472b6', // Soft pink
            linkHoverSecondary: '#ec4899', // Brighter pink on hover
            
            // Status badge colors
            statusIdea: '#bae6fd',
            statusDraft: '#7dd3fc',
            statusCanon: '#38bdf8',
            statusArchived: '#0369a1',

            seasonal: {
                winter: '#f0f9ff',      // Very light sky
                spring: '#e0f2fe',      // Light sky
                summer: '#bae6fd',      // Soft sky
                autumn: '#7dd3fc'       // Medium sky
            },

            softBg: '#f0f9ff',

            kawaiiPink: '#f9a8d4',      // Sky pink
            kawaiiPurple: '#c4a8f9',    // Sky purple
            kawaiiBlue: '#38bdf8',      // Bright sky (existing style)
            kawaiiGold: '#fbbf24',      // Sky gold
            kawaiiGreen: '#34d399',     // Sky green
            kawaiiOrange: '#fb923c',    // Sky orange

            wuxiaAccent: '#38bdf8',        // Bright sky jade
            wuxiaAccentLight: '#7dd3fc',   // Light sky jade
            wuxiaGlow: 'rgba(56, 189, 248, 0.6)',

            journalAccent: '#0ea5e9'
        }
    },
    bubblegum: {
        name: 'Bubblegum',
        description: 'Ultra-soft pastel bubble colors with barely-there tints and whisper-light accents',
        colors: {
            // Background and base colors - like soap bubbles
            bodyBg: '#fdfcfd',          // Almost white with hint of pink
            containerBg: '#ffffff',      // Pure white
            headerBg: '#faf9fb',        // Barely perceptible lilac
            bannerBorder: 'rgba(240, 230, 245, 0.6)', // Ultra-soft border
            
            // Navigation - whisper soft
            navBg: '#fdfcfd',
            navText: '#8b7d8c',         // Muted lavender-gray
            navActive: '#f5f0f7',       // Barely there lavender
            navActiveText: '#6b5b6e',   // Soft purple-gray
            navHover: '#f8f5fa',
            
            // Content colors - gentle and readable
            textPrimary: '#5d4f60',     // Soft purple-gray
            textSecondary: '#7a6b7d',   // Medium purple-gray
            textMuted: '#a394a7',       // Light purple-gray
            textTitle: '#4a3d4f',       // Deeper purple-gray for titles
            textContent: '#6b5c70',     // Reading purple-gray
            
            // World item backgrounds - ultra-soft bubble pastels
            general: '#fefaff',  
            locations: '#fefaff',       // Whisper pink
            factions: '#fafbfe',        // Whisper blue
            concepts: '#fbfffe',        // Whisper mint
            events: '#fffefa',          // Whisper cream
            creatures: '#fefbfd',       // Whisper rose
            plants: '#fbfefe',          // Whisper sage
            items: '#fafeff',           // Whisper sky
            culture: '#fefffe',         // Whisper lavender
            cultivation: '#fdfffe',     // Whisper mint
            itemName: '#4a3d4f',
            
            // Character profile item colors - soft bubble pastels
            physical: '#e8d5f0',        // Soft lavender
            personality: '#d5e8f0',     // Soft powder blue
            sexuality: '#f0d5e8',       // Soft rose
            fighting: '#e8e0d5',        // Soft beige
            background: '#d5f0e8',      // Soft mint
            weapons: '#f0e8d5',         // Soft cream
            hobbies: '#e0d5f0',         // Soft violet
            quirks: '#d5f0e0',          // Soft sage
            relationships: '#f0e0d5',   // Soft peach

            // Link colors - gentle and soft
            linkColor: '#b8a5c4',       // Soft lavender
            linkHover: '#a091af',       // Deeper lavender on hover
            linkColorSecondary: '#a5b8c4', // Soft blue
            linkHoverSecondary: '#91a4af', // Deeper blue on hover
            
            // Status badge colors - soft bubble themed
            statusIdea: '#f2e8f5',      // Ultra-soft lavender
            statusDraft: '#e8f2f5',     // Ultra-soft blue
            statusCanon: '#e8f5f2',     // Ultra-soft mint
            statusArchived: '#f0f0f0',  // Ultra-soft gray

            seasonal: {
                winter: '#fafbfe',      // Whisper winter blue
                spring: '#fbfefe',      // Whisper spring mint
                summer: '#fffefa',      // Whisper summer cream
                autumn: '#fefbfd'       // Whisper autumn rose
            },

            softBg: '#fcfafd',  // Very soft tinted background

            // Kawaii colors - soft bubble versions
            kawaiiPink: '#f0d5e8',      // Soft bubble pink
            kawaiiPurple: '#e8d5f0',    // Soft bubble purple
            kawaiiBlue: '#d5e8f0',      // Soft bubble blue
            kawaiiGold: '#f0e8d5',      // Soft bubble cream
            kawaiiGreen: '#d5f0e8',     // Soft bubble mint
            kawaiiOrange: '#f0e0d5',    // Soft bubble peach

            wuxiaAccent: '#d5f0e8',        // Soft mint jade
            wuxiaAccentLight: '#e8f5f2',   // Ultra-light mint
            wuxiaGlow: 'rgba(213, 240, 232, 0.6)', // Gentle mint glow

            journalAccent: '#b8a5c4'    // Soft lavender accent
        }
    },
    candyKawaii: {
        name: 'Candy Kawaii',
        description: 'Bright candy colors with magical pastels for the ultimate cute aesthetic',
        colors: {
            // Background and base colors
            bodyBg: '#fef7ff',          // Very light magical pink
            containerBg: '#ffffff',      // Pure white
            headerBg: '#fef2f7',        // Soft pink header
            bannerBorder: 'rgba(255, 105, 180, 0.4)',
            
            // Navigation
            navBg: '#fef7ff',
            navText: '#7c3aed',         // Purple
            navActive: '#ff69b4',       // Hot pink
            navActiveText: '#ffffff',
            navHover: '#f3e8ff',
            
            // Content colors
            textPrimary: '#701a75',     // Deep purple
            textSecondary: '#a855f7',   // Medium purple
            textMuted: '#c084fc',       // Light purple
            textTitle: '#701a75',       // Deep purple for titles
            textContent: '#a855f7',     // Medium purple for content
            
            // World item backgrounds (bright candy colors)
            general: '#ffb6c1',  
            locations: '#ffb6c1',       // Light pink
            factions: '#dda0dd',        // Plum
            concepts: '#87ceeb',        // Sky blue
            events: '#ffd700',          // Gold
            creatures: '#ff6347',       // Tomato
            plants: '#98fb98',          // Pale green
            items: '#dda0dd',           // Plum
            culture: '#ffb6c1',         // Light pink
            cultivation: '#98fb98',     // Pale green
            itemName: '#701a75',
            
            // Character profile colors (magical girl themed)
            physical: '#ff69b4',        // Hot pink
            personality: '#9370db',     // Medium slate blue
            sexuality: '#ff1493',       // Deep pink
            fighting: '#da70d6',        // Orchid
            background: '#ba55d3',      // Medium orchid
            weapons: '#8a2be2',         // Blue violet
            hobbies: '#7b68ee',         // Medium slate blue
            quirks: '#dda0dd',          // Plum
            relationships: '#ff69b4',   // Hot pink

            // Link colors - bright and fun
            linkColor: '#ff69b4',           // Hot pink
            linkHover: '#ff1493',           // Deep pink on hover
            linkColorSecondary: '#9370db',  // Medium slate blue
            linkHoverSecondary: '#8a2be2',  // Blue violet on hover
            
            // Status badge colors (candy themed)
            statusIdea: '#ffd700',      // Gold
            statusDraft: '#ff69b4',     // Hot pink
            statusCanon: '#32cd32',     // Lime green
            statusArchived: '#9370db',  // Medium slate blue

            // Seasonal colors (magical pastels)
            seasonal: {
                winter: '#f0f8ff',      // Alice blue
                spring: '#f0fff0',      // Honeydew
                summer: '#fff8dc',      // Cornsilk
                autumn: '#ffe4e1'       // Misty rose
            },

            softBg: '#fef2f7',  // Soft pink

            // Special kawaii colors
            kawaiiPink: '#ff69b4',      // Hot pink
            kawaiiPurple: '#9370db',    // Medium slate blue
            kawaiiBlue: '#00bfff',      // Deep sky blue
            kawaiiGold: '#ffd700',      // Gold
            kawaiiGreen: '#32cd32',     // Lime green
            kawaiiOrange: '#ff6347',    // Tomato

            wuxiaAccent: '#ff69b4',        // Hot pink
            wuxiaAccentLight: '#ffb6c1',   // Light pink
            wuxiaGlow: 'rgba(255, 105, 180, 0.6)',

            journalAccent: '#ff69b4'
        }
    },
    classTrial: {
        name: 'Class Trial',
        description: 'Dark, quirky theme with neon pink and cyan accents.',
        colors: {
            // Background and base colors
            bodyBg: '#1c1824',          // Very dark desaturated purple
            containerBg: '#2a2536',     // Dark purple-gray container
            headerBg: '#1c1824',        // Match body for a seamless look
            bannerBorder: 'rgba(255, 0, 127, 0.5)', // Neon pink border
            
            // Navigation
            navBg: '#1c1824',           // Dark base
            navText: '#b5b5d5',          // Muted lavender-gray text
            navActive: '#ff007f',        // Hot pink!
            navActiveText: '#ffffff',    // White text on pink
            navHover: '#d6006b',         // Darker pink for hover
            
            // Content colors
            textPrimary: '#e5e5e5',      // High-contrast off-white
            textSecondary: '#8a8a9e',    // Cool, muted gray
            textMuted: '#6a6a7e',        // Darker, muted gray
            textTitle: '#ffffff',        // Pure white for titles
            textContent: '#e5e5e5',      // Off-white for readability
            
            // World item backgrounds (dark with accent borders/headers in mind)
            general: '#3e2c3c',  
            locations: '#3e2c3c',        // Dark magenta tint
            factions: '#2c3e3e',         // Dark cyan tint
            concepts: '#3a2c3e',         // Dark purple tint
            events: '#3e3a2c',           // Dark gold/warning tint
            creatures: '#3e2c3c',        // Dark magenta tint
            plants: '#2c3e3e',           // Dark cyan tint
            items: '#3a2c3e',            // Dark purple tint
            culture: '#3e2c3c',          // Dark magenta tint
            cultivation: '#2c3e3e',      // Dark cyan tint
            itemName: '#ffffff',         // White text for contrast
            
            //Character profile item colors (vibrant accents)
            physical: '#ff007f',         // Hot Pink
            personality: '#00f6ff',      // Electric Cyan
            sexuality: '#f43f8e',        // Slightly softer pink
            fighting: '#d6006b',         // Aggressive darker pink
            background: '#00c4cc',       // Darker cyan
            weapons: '#ff007f',          // Hot Pink
            hobbies: '#00f6ff',          // Electric Cyan
            quirks: '#f43f8e',           // Softer pink
            relationships: '#00c4cc',      // Darker cyan

            // Link colors - make them pop!
            linkColor: '#ff007f',           // Hot Pink
            linkHover: '#ff4da6',          // Lighter pink on hover
            linkColorSecondary: '#00f6ff',  // Electric Cyan
            linkHoverSecondary: '#7dffff', // Lighter cyan on hover
            
            // Status badge colors (themed for a "trial")
            statusIdea: '#00f6ff',        // Cyan for "new evidence"
            statusDraft: '#ffd700',       // Gold/Yellow for "under investigation"
            statusCanon: '#ff007f',        // Pink for "TRUTH" / confirmed
            statusArchived: '#4a4a5e',     // "Case closed" gray

            seasonal: {
                winter: '#1a2538',       // Deep, cold midnight blue
                spring: '#1a3832',       // Dark, digital teal
                summer: '#381a2f',       // Hot, dark magenta
                autumn: '#332a38'        // Muted, decaying purple
            },

            softBg: '#3e2c3c',  // Slightly lighter dark with magenta tint

            kawaiiPink: '#ff007f',      // Neon hot pink (existing)
            kawaiiPurple: '#d946ef',    // Neon purple
            kawaiiBlue: '#00f6ff',      // Electric cyan (existing)
            kawaiiGold: '#ffd700',      // Neon gold
            kawaiiGreen: '#00ff9f',     // Neon green
            kawaiiOrange: '#ff6b35',    // Neon orange

            wuxiaAccent: '#00f6ff',        // Electric cyan (matches your neon aesthetic)
            wuxiaAccentLight: '#7dffff',   // Bright cyan
            wuxiaGlow: 'rgba(0,246,255,0.8)', // Bright neon glow

            journalAccent: '#ff007f'     // Thematic hot pink
        }
    },
    urbanGrit: {
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
    },
    urbanGraveyard: {
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
    },
    playersHandbook: {
        name: "Player's Handbook",
        description: 'Authentic D&D handbook colors with rich browns, burgundy accents, and aged parchment',
        colors: {
            // Background and base colors - authentic parchment
            bodyBg: '#2a1c0f',          // Dark brown background
            containerBg: '#f4ebe1',     // Parchment main
            headerBg: '#f0e6dc',        // Aged parchment
            bannerBorder: 'rgba(125, 109, 95, 0.8)', // Border color with transparency
            
            // Navigation - handbook style
            navBg: '#f4ebe1',           // Parchment main
            navText: '#2a1c0f',         // Dark brown text
            navActive: '#722f37',       // Burgundy active
            navActiveText: '#f4ebe1',   // Light text on burgundy
            navHover: '#ebe0d6',        // Parchment dark
            
            // Content colors - readable browns
            textPrimary: '#2a1c0f',     // Dark brown primary text
            textSecondary: '#3d2914',   // Medium brown secondary
            textMuted: '#4a3d32',       // Muted brown
            textTitle: '#2a1c0f',       // Dark brown for titles
            textContent: '#3d2914',     // Dialog brown for content
            
            // World item backgrounds - subtle parchment variations
            general: '#f0e6dc',   
            locations: '#f0e6dc',       // Aged parchment (places)
            factions: '#ebe0d6',        // Parchment dark (groups)
            concepts: '#e6dbd0',        // Parchment darker (knowledge)
            events: '#f4ebe1',          // Parchment main (happenings)
            creatures: '#ebe0d6',       // Parchment dark (beings)
            plants: '#e6dbd0',          // Parchment darker (flora)
            items: '#f0e6dc',           // Aged parchment (objects)
            culture: '#f4ebe1',         // Parchment main (traditions)
            cultivation: '#ebe0d6',     // Parchment dark (practices)
            itemName: '#2a1c0f',        // Dark brown for item names
            
            // Character profile item colors - handbook browns and burgundy
            physical: '#722f37',        // Burgundy (appearance)
            personality: '#5d4037',     // Accent brown (character)
            sexuality: '#5c252b',       // Dark burgundy (passion)
            fighting: '#461c20',        // Darker burgundy (combat)
            background: '#4a2c20',      // Dark accent brown (history)
            weapons: '#3d2914',         // Primary dark (implements)
            hobbies: '#7d6d5f',         // Gray light (leisure)
            quirks: '#8d7d6f',          // Gray lighter (traits)
            relationships: '#6d5d4f',   // Gray medium (connections)

            // Link colors - burgundy theme
            linkColor: '#722f37',           // Burgundy
            linkHover: '#5c252b',           // Dark burgundy on hover
            linkColorSecondary: '#5d4037',  // Accent brown
            linkHoverSecondary: '#4a2c20',  // Dark accent brown on hover
            
            // Status badge colors - handbook themed
            statusIdea: '#8d7d6f',      // Gray lighter (new ideas)
            statusDraft: '#7d6d5f',     // Gray light (in progress)
            statusCanon: '#722f37',     // Burgundy (established)
            statusArchived: '#5d4e42',  // Gray dark (archived)

            // Seasonal colors - parchment variations
            seasonal: {
                winter: '#f0e6dc',      // Cool aged parchment
                spring: '#f4ebe1',      // Fresh parchment
                summer: '#f0e6dc',      // Warm aged parchment
                autumn: '#ebe0d6'       // Rich parchment dark
            },

            softBg: '#f0e6dc',  // Aged parchment

            kawaiiPink: '#d4a394',      // Parchment rose
            kawaiiPurple: '#b894d4',    // Parchment lavender
            kawaiiBlue: '#94b8d4',      // Parchment blue
            kawaiiGold: '#d4c494',      // Parchment gold
            kawaiiGreen: '#a8d494',     // Parchment sage
            kawaiiOrange: '#d4a875',    // Parchment amber

            wuxiaAccent: '#5d4037',        // Accent brown for jade theme
            wuxiaAccentLight: '#7d6d5f',   // Gray light
            wuxiaGlow: 'rgba(93,64,55,0.4)', // Brown glow

            journalAccent: '#722f37'    // Burgundy journal accent
        }
    },
    dungeonMaster: {
        name: "Dungeon Master",
        description: 'Dark leather-bound tome with aged brass fittings and deep jewel accents',
        colors: {
            // Background and base colors - deep dark leather
            bodyBg: '#0f0a08',          // Very dark brown/black
            containerBg: '#2a1810',     // Dark leather brown
            headerBg: '#1d1208',        // Darker leather
            bannerBorder: 'rgba(101, 67, 33, 0.8)', // Dark brass border
            
            // Navigation - aged brass theme
            navBg: '#2a1810',           // Dark leather
            navText: '#c9a876',         // Aged brass text
            navActive: '#654321',       // Dark brass active
            navActiveText: '#f4e4bc',   // Light on brass
            navHover: '#1d1208',        // Darker leather hover
            
            // Content colors - muted brass on dark leather
            textPrimary: '#d4c4a8',     // Light leather/parchment text
            textSecondary: '#b8a082',   // Medium leather text
            textMuted: '#8b7355',       // Muted brown
            textTitle: '#c9a876',       // Aged brass for titles
            textContent: '#b8a082',     // Medium leather for content
            
            // World item backgrounds - subtle leather variations
            general: '#2a1810',  
            locations: '#2a1810',       // Dark leather (places)
            factions: '#1d1208',        // Darker leather (groups)
            concepts: '#3d2a1a',        // Medium leather (knowledge)
            events: '#2a1810',          // Dark leather (happenings)
            creatures: '#1d1208',       // Darker leather (beings)
            plants: '#3d2a1a',          // Medium leather (flora)
            items: '#2a1810',           // Dark leather (objects)
            culture: '#1d1208',         // Darker leather (traditions)
            cultivation: '#3d2a1a',     // Medium leather (practices)
            itemName: '#c9a876',        // Aged brass for item names
            
            // Character profile item colors - deep muted jewel tones
            physical: '#8b1538',        // Deep burgundy (appearance)
            personality: '#2e4184',     // Deep sapphire (character)
            sexuality: '#8b3a3a ',       // Deep amethyst (passion)
            fighting: '#611f1f',        // Dark burgundy (combat)
            background: '#654321',      // Dark brass (history)
            weapons: '#8b4513',         // Saddle brown (implements)
            hobbies: '#2d5930',         // Deep emerald (leisure)
            quirks: '#5d2a62',          // Dark red (traits)
            relationships: '#5d3c5d',   // Deep orchid (connections)

            // Link colors - muted brass theme
            linkColor: '#c9a876',           // Aged brass
            linkHover: '#d4c4a8',           // Light brass on hover
            linkColorSecondary: '#8b7355',  // Muted brown
            linkHoverSecondary: '#b8a082',  // Medium leather on hover
            
            // Status badge colors - deep muted tones
            statusIdea: '#5d2a62',      // Deep amethyst (new ideas)
            statusDraft: '#8b3a3a',     // Dark red (in progress)
            statusCanon: '#2d5930',     // Deep emerald (established)
            statusArchived: '#4a4a4a',  // Dark gray (archived)

            // Seasonal colors - dark leather variations
            seasonal: {
                winter: '#1d1208',      // Darkest leather (winter)
                spring: '#2a1810',      // Dark leather (spring)
                summer: '#3d2a1a',      // Medium leather (summer)
                autumn: '#2a1810'       // Dark leather (autumn)
            },

            softBg: '#1d1208',  // Darker leather

            kawaiiPink: '#a67c8f',      // Dark leather rose
            kawaiiPurple: '#8f7ca6',    // Dark leather purple
            kawaiiBlue: '#7c8fa6',      // Dark leather blue
            kawaiiGold: '#a6947c',      // Dark brass (similar to existing)
            kawaiiGreen: '#8fa67c',     // Dark leather sage
            kawaiiOrange: '#a6847c',    // Dark leather copper

            wuxiaAccent: '#654321',        // Dark brass for accents
            wuxiaAccentLight: '#8b7355',   // Muted brown
            wuxiaGlow: 'rgba(101,67,33,0.4)', // Dark brass glow

            journalAccent: '#5e1212'    // Deep burgundy journal accent
        }
    },    
    nobleStudy: {
        name: "Noble's Study",
        description: 'A rich, dark theme inspired by leather-bound tomes, aged brass, and deep jewel tones.',
        colors: {
            // Background and base colors - dark wood and candlelight
            bodyBg: '#1a140f',          // Deep, dark espresso brown
            containerBg: '#2b211a',     // Rich, dark leather
            headerBg: '#211a14',        // Slightly darker, polished wood
            bannerBorder: 'rgba(204, 164, 94, 0.5)', // Muted aged brass border
            
            // Navigation - leather and gold leaf
            navBg: '#2b211a',           // Match the container for a seamless look
            navText: '#d4c2b4',          // Warm, parchment-like text
            navActive: '#5c252b',        // Deep, noble burgundy
            navActiveText: '#f2e8dc',   // Creamy white text on burgundy
            navHover: '#3c2e25',         // Worn leather hover
            
            // Content colors - high-contrast and readable
            textPrimary: '#eae0d5',      // Soft parchment/cream for main text
            textSecondary: '#a8998a',   // Muted, warm taupe
            textMuted: '#7d6d5f',       // Faded ink gray
            textTitle: '#cca45e',       // Aged brass/gold for titles
            textContent: '#c4b5a5',     // Slightly darker, readable parchment
            
            // World item backgrounds - subtle variations in wood grain/stain
            general: '#31261f',
            locations: '#31261f',
            factions: '#2b242a',        // Hint of royal purple
            concepts: '#262a29',        // Hint of forest green
            events: '#33291e',          // Hint of warm amber
            creatures: '#302121',       // Hint of deep crimson
            plants: '#222922',          // Hint of moss green
            items: '#292230',           // Hint of deep blue
            culture: '#31261f',
            cultivation: '#222922',
            itemName: '#cca45e',        // Gold for item names
            
            // Character profile item colors - rich, deep jewel tones
            physical: '#4a6d8c',        // Deep Sapphire Blue
            personality: '#3a5f3a',     // Rich Forest Green
            sexuality: '#8b1538',        // Deep, passionate Burgundy
            fighting: '#4a4a4a',        // Forged Steel Gray
            background: '#5d3c5d',      // Royal Amethyst Purple
            weapons: '#795c34',         // Burnished Bronze
            hobbies: '#4a6d8c',
            quirks: '#5d3c5d',
            relationships: '#3a5f3a',

            // Link colors - aged brass and sapphire
            linkColor: '#cca45e',           // Aged brass for primary links
            linkHover: '#e0c28A',          // Brighter, polished brass on hover
            linkColorSecondary: '#4a6d8c',  // Sapphire blue for secondary links
            linkHoverSecondary: '#6a8db0', // Lighter sapphire on hover
            
            // Status badge colors - representing stages of lore
            statusIdea: '#5d3c5d',      // Amethyst Purple (a magical idea)
            statusDraft: '#4a6d8c',     // Sapphire Blue (refining the details)
            statusCanon: '#3a5f3a',     // Forest Green (grounded in the world)
            statusArchived: '#63544a',  // Stone Gray (ancient history)

            // Seasonal colors - very subtle shifts in the dark ambience
            seasonal: {
                winter: '#242a2e',      // A hint of cold blue in the dark
                spring: '#2a2e24',      // A hint of new green
                summer: '#2e2a24',      // A hint of warm gold
                autumn: '#2e2424'       // A hint of dying crimson
            },

            softBg: '#3c2e25',  // A lighter, worn leather color

            // Mapped colors for other themes
            kawaiiPink: '#a66981',      // Muted, dusty rose
            kawaiiPurple: '#8169a6',    // Muted amethyst
            kawaiiBlue: '#6981a6',      // Muted sapphire
            kawaiiGold: '#a69469',      // Muted brass
            kawaiiGreen: '#69a669',     // Muted sage
            kawaiiOrange: '#a68169',    // Muted terracotta

            wuxiaAccent: '#3a5f3a',        // A deep, jade-like Forest Green
            wuxiaAccentLight: '#5f8c5f',   // Lighter jade
            wuxiaGlow: 'rgba(58, 95, 58, 0.6)', // Subtle magical glow

            journalAccent: '#8b1538'    // Deep Burgundy for accents
        }
    },
    shireGreen: {
        name: 'Shire Green',
        description: 'A warm and gentle palette inspired by rolling hills, cozy hearths, and sunny gardens. Perfect for pastoral and sweet fantasy.',
        colors: {
            // Background and base colors - like a sunlit cottage
            bodyBg: '#fdfaf4',          // Warm, creamy ivory
            containerBg: '#fefdfa',     // Softer than pure white, like clean linen
            headerBg: '#f5f1e9',        // Aged plaster or light, warm stone
            bannerBorder: 'rgba(110, 85, 60, 0.7)', // Muted, earthy brown border

            // Navigation - like a polished wooden mantlepiece
            navBg: '#5a452d',           // Rich, warm oak brown
            navText: '#d4c2a9',          // Soft, warm beige text
            navActive: '#4a6d45',       // Deep, welcoming moss green
            navActiveText: '#fdfaf4',    // Creamy text on the active green
            navHover: '#735b3a',         // A slightly lighter, inviting brown

            // Content colors - RICH, DARK, and READABLE
            textPrimary: '#3d3222',     // Deep, dark earth brown (not black)
            textSecondary: '#5a452d',   // Warm, readable mid-brown
            textMuted: '#8a7d6c',        // Soft, gentle taupe
            textTitle: '#3d3222',       // Darkest brown for titles
            textContent: '#5a452d',     // Warm brown for content (now on a light bg)

            // World item backgrounds - VERY LIGHT, sun-bleached tints for readability
            general: '#f7f2ea',
            locations: '#f7f2ea',        // Pale parchment
            factions: '#f5ede4',         // Lightest tan (community)
            concepts: '#fcf6e4',         // Pale buttercup yellow (lore, stories)
            events: '#f0f5ee',           // Faint clover green (festivals)
            creatures: '#f2eae3',        // Soft, friendly clay (animals)
            plants: '#eaf2e9',           // Pale new leaf green
            items: '#ede8e1',            // Sun-bleached wood
            culture: '#f5e8e8',          // Faded berry red (traditions, painted doors)
            cultivation: '#e9f0e8',      // Well-tended garden green
            itemName: '#3d3222',         // Darkest earth for item names, for max contrast

            // Character profile item colors - like a colorful hobbit's waistcoat
            physical: '#5a8255',         // Healthy forest green
            personality: '#b57d4c',      // Warm, friendly russet
            sexuality: '#c75d5d',        // Rich raspberry red (passion)
            fighting: '#735b3a',         // Sturdy, practical brown
            background: '#c2a15b',       // Marigold gold (history, family)
            weapons: '#5a452d',          // Dark oak/leather
            hobbies: '#e6b450',          // Cheerful sunflower yellow (gardening)
            quirks: '#7aa2b8',           // Cornflower blue (a surprising quirk)
            relationships: '#5a8255',      // The green of kinship

            // Link colors - natural and inviting
            linkColor: '#5a8255',           // The main forest green
            linkHover: '#4a6d45',          // A deeper moss green on hover
            linkColorSecondary: '#b57d4c',  // Warm russet for variety
            linkHoverSecondary: '#9d6b42',  // Deeper russet on hover

            // Status badge colors - stages of a story or plan
            statusIdea: '#e6b450',       // "A new idea!" - Sunflower yellow
            statusDraft: '#b57d4c',      // "Working on it" - Warm russet
            statusCanon: '#5a8255',      // "It's settled" - Forest green
            statusArchived: '#8a7d6c',   // "An old tale" - Muted taupe

            // Seasonal colors - the Shire through the year
            seasonal: {
                winter: '#f0ebe4',      // Crisp, cool cream for a frosty morning
                spring: '#eaf2e9',      // Fresh new green shoots
                summer: '#fff9e6',      // Warm, golden summer sun
                autumn: '#f5e7d5'       // Rich harvest-time russet
            },

            softBg: '#faf9f6',  // Very soft, pale green-tinted cream

            // Kawaii colors - countryside cute
            kawaiiPink: '#d4a3a3',      // Dusty rose
            kawaiiPurple: '#b3a3d4',    // Wild thistle
            kawaiiBlue: '#a3c2d4',      // Summer sky blue
            kawaiiGold: '#d4c4a3',      // Golden straw
            kawaiiGreen: '#a3d4ae',     // Tender leaf green
            kawaiiOrange: '#d4b3a3',    // Ripe peach

            wuxiaAccent: '#5a8255',        // A deep, earthy jade green
            wuxiaAccentLight: '#8cb388',   // Lighter jade
            wuxiaGlow: 'rgba(90,130,85,0.5)', // Gentle, natural glow

            journalAccent: '#c75d5d'     // A warm, berry-red for margin lines
        }
    },
    horrific: {
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
    },
    staticDread: {
        name: 'Static Dread',
        description: 'The decaying green glow of a CRT screen and the ominous red of a recording light against a deep, static-filled black. Perfect for analog and digital horror.',
        colors: {
            bodyBg: '#0A0A0A',
            containerBg: '#121212',
            headerBg: '#1a1a1a',
            navBg: '#050505',
            navActive: '#222222',
            navHover: '#1f1f1f',
            
            textPrimary: '#c2c2c2',
            textSecondary: '#7d7d7d',
            textMuted: '#444444',
            
            navText: '#999999',
            navActiveText: '#e0e0e0',
            
            journalAccent: '#ff0000', // The ominous red REC light
            bannerBorder: '#333333',
            
            // Desaturated, "grimy" category colors
            concepts: '#798a67',     // Sickly yellow-green
            factions: '#3a6e71',     // Muted, murky teal
            locations: '#8b6f5a',    // Dusty, decaying brown
            plants: '#4f614a',       // Dark, swampy green
            
            // Wuxia specific (re-themed for horror)
            wuxiaAccent: '#6e0000',      // Deep, dried blood red
            wuxiaAccentLight: '#8a4b4b',
            wuxiaGlow: 'rgba(255, 0, 0, 0.4)'
        }
    },
    quietEcho: {
        name: 'Quiet Echo',
        description: 'The inky, bottomless dark of a supernatural void, pierced by a cold, spectral cyan glow. Creates an atmosphere of quiet, ethereal dread.',
        colors: {
            bodyBg: '#0d101e',
            containerBg: '#14182b',
            headerBg: '#1a1f36',
            navBg: '#080a14',
            navActive: '#222a4a',
            navHover: '#1c223b',
            
            textPrimary: '#d0efff',    // A very light, cold blue
            textSecondary: '#7c89b3',  // Desaturated slate blue
            textMuted: '#3e4766',
            
            navText: '#8a99c2',
            navActiveText: '#ffffff',
            
            journalAccent: '#00ffff', // The spectral cyan glow
            bannerBorder: '#2a3150',
            
            // Muted, ghostly category colors
            concepts: '#6a5e93',     // Muted lavender
            factions: '#935e76',     // Dusty, faded rose
            locations: '#3b8085',    // Deep, cold teal
            plants: '#628b7a',       // Ghostly, grayish green
            
            // Wuxia specific (re-themed for the abyss)
            wuxiaAccent: '#00a1a1',      // Deeper version of the spectral cyan
            wuxiaAccentLight: '#4bb8b8',
            wuxiaGlow: 'rgba(0, 255, 255, 0.3)'
        }
    },
    parchment: {
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
    },
    regencyRomance: {
        name: 'Regency Romance',
        description: 'Soft regency colors - sage greens, dusty roses, and gentle pastels',
        colors: {
            // Background and base colors - like an elegant drawing room
            bodyBg: '#fbfaf8',          // Warm ivory background
            containerBg: '#ffffff',     // Pure white for content
            headerBg: '#f6f4f1',        // Soft cream header
            bannerBorder: 'rgba(106, 90, 77, 0.3)', // Muted brown border
            
            // Navigation - like silk-lined letter box
            navBg: '#fbfaf8',           // Match body for seamless look
            navText: '#6a5a4d',         // Warm taupe
            navActive: '#a8998a',       // Soft mushroom brown
            navActiveText: '#ffffff',   // White text on brown
            navHover: '#9d8b7a',        // Medium taupe hover
            
            // Content colors - like quality ink
            textPrimary: '#4a3f37',     // Deep warm brown
            textSecondary: '#6a5a4d',   // Medium brown
            textMuted: '#a8998a',       // Light taupe
            textTitle: '#3d342c',       // Dark brown for titles
            textContent: '#5d4f42',     // Reading brown
            
            // World item backgrounds - regency pastel palette
            general: '#f0f4f2',  
            locations: '#f0f4f2',       // Sage green tint (places)
            factions: '#f4f0f4',        // Lavender tint (groups) 
            concepts: '#f2f4f0',        // Mint tint (knowledge)
            events: '#f4f2f0',          // Dusty rose tint (happenings)
            creatures: '#f0f2f4',       // Periwinkle tint (beings)
            plants: '#f1f4f1',          // Fresh sage tint (flora)
            items: '#f3f1f4',           // Soft lilac tint (objects)
            culture: '#f4f1f0',         // Warm coral tint (traditions)
            cultivation: '#f0f3f2',     // Pale jade tint (practices)
            itemName: '#3d342c',        // Deep brown for item names
            
            // Character profile item colors - elegant regency palette
            physical: '#8fbc8f',        // Sage green (appearance)
            personality: '#dda0dd',     // Soft plum (character)
            sexuality: '#f0a0a0',       // Dusty rose (passion)
            fighting: '#708090',        // Slate gray (combat)
            background: '#d2b48c',      // Warm tan (history)
            weapons: '#778899',         // Light slate (implements)
            hobbies: '#98d8d8',         // Powder blue (leisure)
            quirks: '#f5deb3',          // Wheat gold (traits)
            relationships: '#f0e68c',   // Soft yellow (connections)

            // Link colors - like gold leaf and sealing wax
            linkColor: '#8fbc8f',           // Sage green
            linkHover: '#76a476',           // Deeper sage on hover
            linkColorSecondary: '#dda0dd',  // Soft plum
            linkHoverSecondary: '#c78fc7',  // Deeper plum on hover
            
            // Status badge colors - like different colored wax seals
            statusIdea: '#f0a0a0',      // Dusty rose (new ideas)
            statusDraft: '#f5deb3',     // Wheat gold (in progress)
            statusCanon: '#8fbc8f',     // Sage green (established)
            statusArchived: '#d2b48c',  // Warm tan (archived)

            // Seasonal colors - soft regency variations
            seasonal: {
                winter: '#f2f4f6',      // Cool blue-white
                spring: '#f0f4f2',      // Fresh sage-white
                summer: '#f6f4f0',      // Warm peachy-white
                autumn: '#f4f2f0'       // Soft coral-white
            },

            softBg: '#faf9f7',  // Very soft ivory

            kawaiiPink: '#f0a0a0',      // Regency rose (existing)
            kawaiiPurple: '#dda0dd',    // Regency plum (existing)
            kawaiiBlue: '#98d8d8',      // Regency blue (existing)
            kawaiiGold: '#f0e68c',      // Regency yellow (existing)
            kawaiiGreen: '#8fbc8f',     // Regency sage (existing)
            kawaiiOrange: '#f5deb3',    // Regency wheat (existing)

            wuxiaAccent: '#8fbc8f',        // Use your existing sage green
            wuxiaAccentLight: '#a8c5a8',   // Lighter sage
            wuxiaGlow: 'rgba(143,188,143,0.5)', // Sage glow

            journalAccent: '#8fbc8f'    // Sage green journal accent
        }
    }, 
    neonNights: {
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
    },
    digitalSunrise: {
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
    }
};

export default colorSchemes;