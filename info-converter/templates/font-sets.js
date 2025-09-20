// Font set definitions
const fontSets = {
    serif: {
        name: 'Serif (system fonts)',
        description: 'Traditional serif fonts (Georgia for content)',
        primary: "'Georgia', serif",
        secondary: "'Times New Roman', serif",
        ui: "'Trebuchet MS', 'Arial', sans-serif",
        accent: "'Verdana', 'Geneva', sans-serif" // Sturdy & highly legible system font
    },
    sans: {
        name: 'Sans Serif (system fonts)',
        description: 'Modern sans-serif fonts (Helvetica/Arial)',
        primary: "'Helvetica Neue', 'Arial', sans-serif",
        secondary: "'Segoe UI', 'Roboto', sans-serif",
        ui: "'Inter', 'System UI', sans-serif",
        accent: "'Impact', 'Charcoal', sans-serif" // Bold, condensed, and high-impact system font
    },
    mixed: {
        name: 'Mixed (system fonts)',
        description: 'Sans-serif for UI, serif for content (best of both)',
        primary: "'Georgia', serif",
        secondary: "'Helvetica Neue', 'Arial', sans-serif",
        ui: "'Inter', 'System UI', sans-serif",
        accent: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif" // Friendly and clear on-screen system font
    },
    classic: {
        name: 'Classic',
        description: 'Elegant Google Fonts (Crimson Text + Playfair Display)',
        googleFonts: ['Crimson+Text:wght@400;600', 'Playfair+Display:wght@400;700', 'Inter:wght@400;500;700', 'Cinzel:wght@400;700'],
        primary: "'Crimson Text', Georgia, serif",
        secondary: "'Playfair Display', 'Times New Roman', serif", 
        ui: "'Inter', 'Helvetica Neue', sans-serif",
        accent: "'Cinzel', serif" // All-caps, Roman-inspired font for an authoritative feel
    },
    clean: {
        name: 'Clean',
        description: 'Modern Google Fonts (Source Sans Pro + Montserrat)',
        googleFonts: ['Source+Sans+Pro:wght@400;600', 'Montserrat:wght@400;700', 'Inter:wght@400;500;700', 'Roboto+Condensed:wght@700'],
        primary: "'Source Sans Pro', 'Helvetica Neue', sans-serif",
        secondary: "'Montserrat', Arial, sans-serif",
        ui: "'Inter', 'Helvetica Neue', sans-serif",
        accent: "'Roboto Condensed', sans-serif" // Highly legible and space-efficient for UI
    },
    artistic: {
        name: 'Artistic',
        description: 'Creative Google Fonts (Libre Baskerville + Oswald)',
        googleFonts: ['Libre+Baskerville:wght@400;700', 'Oswald:wght@400;600', 'Nunito+Sans:wght@400;500;700', 'Archivo+Black:wght@400'],
        primary: "'Libre Baskerville', Georgia, serif",
        secondary: "'Oswald', Arial, sans-serif",
        ui: "'Nunito Sans', 'Helvetica Neue', sans-serif",
        accent: "'Archivo Black', sans-serif" // A super bold, impactful font for strong call-to-actions
    },
    professional: {
        name: 'Professional', 
        description: 'Academic Google Fonts (Lora + Merriweather)',
        googleFonts: ['Lora:wght@400;600', 'Merriweather:wght@400;700', 'Open+Sans:wght@400;500;700', 'Roboto:wght@500;700'],
        primary: "'Lora', Georgia, serif",
        secondary: "'Merriweather', 'Times New Roman', serif",
        ui: "'Open Sans', Arial, sans-serif",
        accent: "'Roboto', sans-serif" // The standard for clean, professional, and clear UI text
    },
    editorial: {
        name: 'Editorial',
        description: 'Classic newspaper/journalism fonts for a professional, readable feel',
        googleFonts: ['PT+Serif:wght@400;700', 'Fjalla+One:wght@400', 'PT+Sans:wght@400;500;700', 'Bebas+Neue:wght@400'],
        primary: "'PT Serif', Georgia, serif",           // Newspaper-style body text
        secondary: "'Fjalla One', 'Impact', sans-serif", // Condensed headlines
        ui: "'PT Sans', 'Helvetica Neue', sans-serif",   // Clean, pairs with PT Serif
        accent: "'Bebas Neue', sans-serif"               // Classic bold headline font
    },
    artDeco: {
        name: 'Art Deco',
        description: '1920s elegance - geometric luxury with sophisticated styling',
        googleFonts: ['Spectral:wght@400;600', 'Poiret+One:wght@400', 'Mulish:wght@400;500;700', 'Righteous:wght@400'],
        primary: "'Spectral', Georgia, serif",           // Refined, elegant serif
        secondary: "'Poiret One', 'Playfair Display', serif", // Art Deco inspired display
        ui: "'Mulish', 'Helvetica Neue', sans-serif",   // Modern, clean interface
        accent: "'Righteous', sans-serif"               // Geometric, bold accent
    },
    cosmic: {
        name: 'Cosmic',
        description: 'Otherworldly sci-fi fonts - futuristic but still highly readable',
        googleFonts: ['Exo+2:wght@400;600', 'Orbitron:wght@400;700', 'Space+Grotesk:wght@400;500;700', 'Jura:wght@400;700'],
        primary: "'Exo 2', 'Helvetica Neue', sans-serif",    // Futuristic but readable
        secondary: "'Orbitron', 'Arial', sans-serif",        // Geometric, space-age
        ui: "'Space Grotesk', 'Inter', sans-serif",          // Modern, spacey sans
        accent: "'Jura', sans-serif"                         // Distinctive, alien feel
    },
    handwritten: {
        name: 'Handwritten',
        description: 'Personal, informal feel - like notes in a journal or sketchbook',
        googleFonts: ['Bitter:wght@400;600', 'Kalam:wght@400;700', 'Karla:wght@400;500;700', 'Amatic+SC:wght@400;700'],
        primary: "'Bitter', Georgia, serif",             // Friendly slab serif
        secondary: "'Kalam', 'Comic Sans MS', sans-serif", // Handwritten but readable
        ui: "'Karla', 'Helvetica Neue', sans-serif",    // Humanist, approachable
        accent: "'Amatic SC', sans-serif"               // Casual handwritten style
    },
    cozyCafe: {
        name: 'Cozy Café',
        description: 'Warm and inviting - like reading in your favorite coffee shop',
        googleFonts: ['Varela+Round:wght@400', 'Baloo+2:wght@400;600', 'Mali:wght@400;500', 'Chewy:wght@400'],
        primary: "'Mali', Georgia, serif",               // Gentle, readable handwriting
        secondary: "'Baloo 2', 'Arial', sans-serif",    // Soft, rounded headings
        ui: "'Varela Round', 'Helvetica Neue', sans-serif", // Super friendly interface
        accent: "'Chewy', sans-serif"                   // Playful and bouncy
    },

    storybook: {
        name: 'Storybook',
        description: 'Like a beloved children\'s book - whimsical and nostalgic',
        googleFonts: ['Patrick+Hand:wght@400', 'Caveat:wght@400;700', 'Pangolin:wght@400', 'Gloria+Hallelujah:wght@400'],
        primary: "'Patrick Hand', 'Comic Sans MS', sans-serif", // Friendly handwriting
        secondary: "'Caveat', cursive",                 // Flowing, expressive headings
        ui: "'Pangolin', 'Arial', sans-serif",         // Cute and approachable
        accent: "'Gloria Hallelujah', sans-serif"      // Fun and celebratory
    },

    handmade: {
        name: 'Handmade',
        description: 'Crafty and personal - like handwritten notes and doodles',
        googleFonts: ['Indie+Flower:wght@400', 'Architects+Daughter:wght@400', 'Coming+Soon:wght@400', 'Schoolbell:wght@400'],
        primary: "'Indie Flower', cursive",             // Casual, flowing handwriting
        secondary: "'Architects Daughter', cursive",    // Sketchy, creative headings
        ui: "'Coming Soon', 'Arial', sans-serif",      // Friendly and approachable
        accent: "'Schoolbell', cursive"                 // Playful and youthful
    },

    magical: {
        name: 'Magical',
        description: 'Whimsical fantasy - perfect for fairy tales and enchanted worlds',
        googleFonts: ['Kaushan+Script:wght@400', 'Fredericka+the+Great:wght@400', 'Bubblegum+Sans:wght@400', 'Cookie:wght@400'],
        primary: "'Bubblegum Sans', 'Arial', sans-serif", // Rounded and magical
        secondary: "'Fredericka the Great', cursive",   // Ornate and fantastical
        ui: "'Bubblegum Sans', 'Helvetica Neue', sans-serif", // Consistent magical feel
        accent: "'Kaushan Script', cursive"             // Elegant flowing script
    },
    wuxia: {
        name: 'Wuxia',
        description: 'Elegant, brush-like fonts inspired by Chinese fantasy.',
        googleFonts: ['ZCOOL+XiaoWei:wght@400', 'Noto+Serif:wght@400;700', 'Noto+Sans:wght@400;500;700', 'ZCOOL+KuaiLe:wght@400'],
        primary: "'Noto Serif', Georgia, serif",
        secondary: "'ZCOOL XiaoWei', 'Impact', serif",
        ui: "'Noto Sans', 'Helvetica Neue', sans-serif",
        accent: "'ZCOOL KuaiLe', sans-serif" // A bold, rounded font that feels like a maker's seal or stamp
    },
    zenBrush: {
        name: 'Zen Brush',
        description: 'Elegant, flowing fonts inspired by traditional Chinese ink brush calligraphy.',
        googleFonts: ['Noto+Serif+SC:wght@400;600', 'Ma+Shan+Zheng:wght@400', 'Noto+Sans+SC:wght@400;500;700', 'Long+Cang:wght@400'],
        primary: "'Noto Serif SC', Georgia, serif",      // An elegant and highly readable serif for body text
        secondary: "'Ma Shan Zheng', serif",               // A semi-cursive brush font for artistic headings
        ui: "'Noto Sans SC', 'Helvetica Neue', sans-serif", // A clean, corresponding sans-serif for UI
        accent: "'Long Cang', cursive"                     // A flowing, signature-like script for accents
    },
    fantasy: {
        name: 'Fantasy',
        description: 'Old-world, epic fonts for a fantasy setting (like LotR).',
        googleFonts: ['Uncial+Antiqua:wght@400', 'IM+Fell+English:wght@400', 'Raleway:wght@400;500;700', 'Alegreya+SC:wght@400;700'],
        primary: "'IM Fell English', 'Garamond', serif",
        secondary: "'Uncial Antiqua', 'Cinzel', serif",
        ui: "'Raleway', 'Helvetica Neue', sans-serif",
        accent: "'Alegreya SC', serif" // An elegant small-caps font that feels like it was engraved
    },
    urbanGrit: {
        name: 'Industrial',
        description: 'Modern, industrial fonts with a monospaced, tech-noir accent.',
        googleFonts: ['Roboto:wght@400;700', 'Oswald:wght@400;600', 'Inter:wght@400;500;700', 'Roboto+Mono:wght@400'],
        primary: "'Roboto', 'Helvetica Neue', sans-serif",          // Clean and highly readable body font
        secondary: "'Oswald', 'Impact', sans-serif",                 // Condensed, high-impact header font
        ui: "'Inter', 'System UI', sans-serif",                      // The gold standard for modern UI text
        accent: "'Roboto Mono', 'Courier New', monospace"          // A clean monospaced font for a terminal feel
    },
    horrific: {
        name: 'Horrific',
        description: 'Gothic horror fonts - elegant but ominous (Cinzel + Crimson Text)',
        googleFonts: ['Cinzel:wght@400;600;700', 'Crimson+Text:wght@400;600', 'Source+Sans+Pro:wght@400;500;700', 'Cinzel+Decorative:wght@700'],
        primary: "'Crimson Text', 'Georgia', serif",           // Body text - readable gothic
        secondary: "'Cinzel', 'Playfair Display', serif",      // Headings - carved elegance  
        ui: "'Source Sans Pro', 'Helvetica Neue', sans-serif", // Interface - clean & readable
        accent: "'Cinzel Decorative', 'Cinzel', serif"         // Special elements - ornate
    },
        unsettlingEvidence: {
        name: 'Unsettling Evidence',
        description: 'Distressed typewriter and monospaced fonts, like files from a paranormal investigation.',
        googleFonts: ['Courier+Prime:wght@400;700', 'Special+Elite:wght@400', 'Roboto+Mono:wght@400;500', 'Rock+Salt:wght@400'],
        primary: "'Courier Prime', 'Courier New', monospace",     // A clean, readable typewriter font for case files
        secondary: "'Special Elite', 'Courier New', monospace",  // A distressed typewriter font for unsettling headers
        ui: "'Roboto Mono', 'Consolas', monospace",               // A modern, clean monospace for a digital evidence feel
        accent: "'Rock Salt', cursive"                           // A frantic, handwritten scrawl for chilling notes
    },
    grindhouse: {
        name: 'Grindhouse',
        description: 'Gritty, high-impact fonts straight from a 70s slasher movie poster.',
        googleFonts: ['Bebas+Neue:wght@400', 'Metal+Mania:wght@400', 'Lato:wght@400;700', 'Anton:wght@400'],
        primary: "'Lato', 'Arial', sans-serif",                    // A clean, neutral body font that doesn't distract
        secondary: "'Metal Mania', 'Impact', fantasy",               // A sharp, aggressive font for titles
        ui: "'Bebas+Neue', 'Helvetica Neue', sans-serif",          // A condensed, bold font for UI elements
        accent: "'Anton', 'Impact', sans-serif"                    // The ultimate bold, high-impact poster font
    },
    parchment: {
        name: 'Parchment&Quill',
        description: 'Elegant regency fonts - like handwritten correspondence (Cormorant + Libre Baskerville)',
        googleFonts: ['Cormorant+Garamond:wght@300;400;600', 'Libre+Baskerville:wght@400;700', 'Crimson+Text:wght@400;600', 'Cardo:wght@400;700'],
        primary: "'Cormorant Garamond', Georgia, serif",      // Flowing, elegant for body text
        secondary: "'Libre Baskerville', 'Times New Roman', serif", // Strong, readable for headings
        ui: "'Crimson Text', 'Trebuchet MS', sans-serif",    // Clean but warm for interface elements
        accent: "'Cardo', serif"                             // Refined scholarly font for special elements
    },
    neonFuture: {
        name: 'Neon Future',
        description: 'Sleek futuristic fonts with clean geometry and sharp edges',
        googleFonts: ['Exo+2:wght@400;600;700', 'Audiowide:wght@400', 'Space+Grotesk:wght@400;500;700', 'Electrolize:wght@400'],
        primary: "'Exo 2', 'Helvetica Neue', sans-serif",            // Futuristic but readable
        secondary: "'Audiowide', 'Impact', sans-serif",              // Bold cyberpunk display
        ui: "'Space Grotesk', 'Inter', sans-serif",                  // Modern, spacey interface
        accent: "'Electrolize', 'Arial', sans-serif"                 // Electric, digital feel
    },

    digitalPunk: {
        name: 'Digital Punk',
        description: 'Edgy tech fonts mixing modern sans-serif with monospace accents',
        googleFonts: ['Rajdhani:wght@400;600;700', 'Bungee:wght@400', 'Roboto+Mono:wght@400;700', 'Saira+Condensed:wght@400;700'],
        primary: "'Rajdhani', 'Arial', sans-serif",                  // Angular, tech-inspired
        secondary: "'Bungee', 'Impact', sans-serif",                 // Bold, urban display
        ui: "'Rajdhani', 'Helvetica Neue', sans-serif",              // Consistent with primary
        accent: "'Roboto Mono', 'Courier New', monospace"           // Clean monospace for code/data
    },
    ghostInShell: {
        name: 'Ghost in Shell',
        description: 'Japanese-inspired cyberpunk with clean geometry and subtle curves',
        googleFonts: ['Saira:wght@400;600;700', 'Orbitron:wght@400;700', 'Noto+Sans:wght@400;500;700', 'Aldrich:wght@400'],
        primary: "'Saira', 'Helvetica Neue', sans-serif",            // Clean, slightly rounded
        secondary: "'Orbitron', 'Arial', sans-serif",                // Geometric futuristic
        ui: "'Noto Sans', 'Arial', sans-serif",                      // International, clean
        accent: "'Aldrich', 'Arial', sans-serif"                     // Retro-futuristic display
    }
};

export default fontSets;