// Title font definitions - specialized for headers and display text
const titleFonts = {
    theme: {
        name: 'Use Theme Default',
        description: 'Uses the current theme\'s font settings',
        titleFont: 'theme', // Special flag to use theme font
        subtitleFont: 'theme'
    },
    elegant: {
        name: 'Elegant',
        description: 'Classic serif pairing - sophisticated and readable',
        googleFonts: ['Playfair+Display:wght@400;700', 'Crimson+Text:wght@400;600'],
        titleFont: "'Playfair Display', 'Times New Roman', serif",
        subtitleFont: "'Crimson Text', Georgia, serif"
    },
    modern: {
        name: 'Modern',
        description: 'Clean sans-serif pairing - contemporary and sleek',
        googleFonts: ['Montserrat:wght@600;700', 'Open+Sans:wght@400;600'],
        titleFont: "'Montserrat', 'Helvetica Neue', sans-serif",
        subtitleFont: "'Open Sans', Arial, sans-serif"
    },
    dramatic: {
        name: 'Dramatic',
        description: 'High-contrast pairing - bold and eye-catching',
        googleFonts: ['Oswald:wght@600;700', 'Lora:wght@400;600'],
        titleFont: "'Oswald', Impact, sans-serif",
        subtitleFont: "'Lora', Georgia, serif"
    },
    vintage: {
        name: 'Vintage',
        description: 'Classic American typewriter and signage - nostalgic and warm',
        googleFonts: ['Abril+Fatface:wght@400', 'Vollkorn:wght@400;600'],
        titleFont: "'Abril Fatface', 'Impact', serif",
        subtitleFont: "'Vollkorn', Georgia, serif"
    },
    script: {
        name: 'Script',
        description: 'Elegant handwritten style - romantic and personal',
        googleFonts: ['Dancing+Script:wght@700', 'Cormorant+Garamond:wght@400;600'],
        titleFont: "'Dancing Script', cursive",
        subtitleFont: "'Cormorant Garamond', Georgia, serif"
    },
    geometric: {
        name: 'Geometric',
        description: 'Clean minimalist design - modern and architectural',
        googleFonts: ['Raleway:wght@700', 'Source+Sans+Pro:wght@400;600'],
        titleFont: "'Raleway', 'Helvetica Neue', sans-serif",
        subtitleFont: "'Source Sans Pro', Arial, sans-serif"
    },
    typewriter: {
        name: 'Typewriter',
        description: 'Monospace mechanical feel - authentic and documentary-style',
        googleFonts: ['Special+Elite:wght@400', 'Merriweather:wght@400;700'],
        titleFont: "'Special Elite', 'Courier New', monospace",
        subtitleFont: "'Merriweather', Georgia, serif"
    },
    steampunk: {
        name: 'Steampunk',
        description: 'Victorian industrial elegance - ornate yet mechanical',
        googleFonts: ['UnifrakturMaguntia:wght@400', 'Alegreya:wght@400;700'],
        titleFont: "'UnifrakturMaguntia', 'Times New Roman', serif",
        subtitleFont: "'Alegreya', Georgia, serif"
    },
    cyberpunk: {
        name: 'Cyberpunk',
        description: 'Digital dystopian edge - futuristic with attitude',
        googleFonts: ['Audiowide:wght@400', 'Electrolize:wght@400'],
        titleFont: "'Audiowide', 'Impact', sans-serif",
        subtitleFont: "'Electrolize', 'Arial', sans-serif"
    },
    scholarly: {
        name: 'Scholarly',
        description: 'Academic and intellectual - perfect for research or historical content',
        googleFonts: ['Cardo:wght@400;700', 'Gentium+Basic:wght@400;700'],
        titleFont: "'Cardo', 'Times New Roman', serif",
        subtitleFont: "'Gentium Basic', Georgia, serif"
    },
    bubbly: {
        name: 'Bubbly',
        description: 'Super rounded and cheerful - perfect for cozy or magical settings',
        googleFonts: ['Fredoka+One:wght@400', 'Quicksand:wght@400;600'],
        titleFont: "'Fredoka One', 'Arial', sans-serif",
        subtitleFont: "'Quicksand', 'Helvetica Neue', sans-serif"
    },

    playful: {
        name: 'Playful',
        description: 'Bouncy and fun - great for whimsical adventures or comedy',
        googleFonts: ['Bungee:wght@400', 'Nunito:wght@400;600'],
        titleFont: "'Bungee', 'Impact', sans-serif",
        subtitleFont: "'Nunito', Arial, sans-serif"
    },

    cozy: {
        name: 'Cozy',
        description: 'Warm and friendly - like a children\'s storybook come to life',
        googleFonts: ['Comfortaa:wght@700', 'Poppins:wght@400;600'],
        titleFont: "'Comfortaa', 'Arial', sans-serif",
        subtitleFont: "'Poppins', 'Helvetica Neue', sans-serif"
    },

    whimsical: {
        name: 'Whimsical',
        description: 'Casual and flowing - perfect for fairy tales or slice-of-life stories',
        googleFonts: ['Pacifico:wght@400', 'Rubik:wght@400;500'],
        titleFont: "'Pacifico', cursive",
        subtitleFont: "'Rubik', Arial, sans-serif"
    },
    industrial: {
        name: 'Industrial',
        description: 'Bold mechanical feel - perfect for steampunk or dystopian settings',
        googleFonts: ['Anton:wght@400', 'Roboto+Slab:wght@400;700'],
        titleFont: "'Anton', 'Impact', sans-serif",
        subtitleFont: "'Roboto Slab', Georgia, serif"
    },
    fantasy: {
        name: 'Fantasy',
        description: 'Mystical pairing - perfect for fantasy worlds',
        googleFonts: ['Cinzel:wght@600;700', 'Libre+Baskerville:wght@400;600'],
        titleFont: "'Cinzel', 'Times New Roman', serif",
        subtitleFont: "'Libre Baskerville', Georgia, serif"
    },
    wuxia: {
        name: 'Wuxia',
        description: 'Eastern-inspired pairing - elegant and flowing',
        googleFonts: ['ZCOOL+XiaoWei:wght@400', 'Noto+Serif:wght@400;600'],
        titleFont: "'ZCOOL XiaoWei', 'Impact', serif",
        subtitleFont: "'Noto Serif', Georgia, serif"
    },
    horror: {
        name: 'Horror',
        description: 'Gothic pairing - ominous and atmospheric',
        googleFonts: ['Creepster:wght@400', 'Crimson+Text:wght@400;600'],
        titleFont: "'Creepster', 'Impact', serif",
        subtitleFont: "'Crimson Text', Georgia, serif"
    },
    slasherFlick: {
        name: 'Slasher Flick',
        description: 'Bold, distressed fonts straight from an 80s horror movie poster.',
        googleFonts: ['Metal+Mania:wght@400', 'Bebas+Neue:wght@400'],
        titleFont: "'Metal Mania', 'Impact', fantasy",
        subtitleFont: "'Bebas Neue', 'Arial Narrow', sans-serif"
    },
    videoNasty: {
        name: 'Video Nasty',
        description: 'A gritty, low-fi pairing reminiscent of old VHS tapes and camcorder footage.',
        googleFonts: ['Rubik+Glitch:wght@400', 'VT323:wght@400'],
        titleFont: "'Rubik Glitch', 'Impact', sans-serif",
        subtitleFont: "'VT323', 'Courier New', monospace"
    },
    digitalDisplay: {
        name: 'Digital Display',
        description: 'Sharp tech fonts perfect for holographic interfaces',
        googleFonts: ['Electrolize:wght@400', 'Rajdhani:wght@600'],
        titleFont: "'Electrolize', 'Arial', sans-serif",             // Electric, digital
        subtitleFont: "'Rajdhani', 'Arial', sans-serif"              // Angular, tech-inspired
    },
    matrixVision: {
        name: 'Matrix Vision',
        description: 'Bold cyberpunk display with clean supporting text',
        googleFonts: ['Bungee:wght@400', 'Space+Grotesk:wght@500'],
        titleFont: "'Bungee', 'Impact', sans-serif",                 // Bold, urban energy
        subtitleFont: "'Space Grotesk', 'Inter', sans-serif"        // Modern, spacey clean
    },

    ghostProtocol: {
        name: 'Ghost Protocol',
        description: 'Sleek Japanese cyberpunk aesthetic with geometric precision',
        googleFonts: ['Aldrich:wght@400', 'Saira:wght@600'],
        titleFont: "'Aldrich', 'Arial', sans-serif",                 // Retro-futuristic
        subtitleFont: "'Saira', 'Helvetica Neue', sans-serif"       // Clean, slightly rounded
    }
};

export default titleFonts;