// Button Styles CSS Generation - Refactored with shared styling
// Overview Links + Custom Navigation CSS functions
// Button styles
const buttonStyles = {
    'rounded': {
        name: 'Rounded',
        description: 'Buttons with soft rounded corners'
    },
    'sharp': {
        name: 'Sharp', 
        description: 'Buttons with square corners'
    },
    'pill': {
        name: 'Pill',
        description: 'Buttons with fully rounded edges'
    },
    'subtle': {
        name: 'Subtle',
        description: 'Buttons with minimal rounded corners'
    },
    'text-only': {
        name: 'Text Only',
        description: 'Minimal text-only buttons with subtle underline on hover'
    },
    'neon': {
        name: 'Neon',
        description: 'Cyberpunk glowing neon buttons with electric effects'
    },
    'glassmorphism': {
        name: 'Glassmorphism', 
        description: 'Modern frosted glass effect with subtle transparency'
    },
    'origami': {
        name: 'Origami',
        description: 'Folded paper effect with crisp angular shadows'
    },
    'holographic': {
        name: 'Holographic',
        description: 'Iridescent rainbow shimmer effects that shift with hover'
    },
    'sketch': {
        name: 'Sketch',
        description: 'Hand-drawn artistic style with rough, sketchy borders'
    },
    'crystal': {
        name: 'Crystal',
        description: 'Faceted gem-like appearance with prismatic reflections'
    },
    'typewriter': {
        name: 'Typewriter',
        description: 'Vintage typewriter key styling with mechanical click effects'
    },
    'liquid': {
        name: 'Liquid',
        description: 'Organic flowing blob shapes that morph on hover'
    },
    'kawaii': {
        name: 'Kawaii',
        description: 'Cute rounded buttons with soft shadows and heart decorations'
    },
    'candyPop': {
        name: 'Candy Pop',
        description: 'Glossy 3D candy buttons with shine effects and gentle scaling'
    },
    'magicalGirl': {
        name: 'Magical Girl', 
        description: 'Sparkly buttons with star decorations and magical glow effects'
    },
    'industrial': {
        name: 'Industrial',
        description: 'Angular buttons with clipped corners and metal-like styling'
    },
    'wuxia': {
        name: 'Wuxia',
        description: 'Elegant jade-inspired buttons with traditional patterns'
    },
    'horrific': {
        name: 'Horrific',
        description: 'Dark gothic buttons with blood-drip effects and ominous shadows'
    },
    'glitchSignal': {
        name: 'Glitch Signal',
        description: 'An analog horror button that flickers and distorts with corrupted data and RGB-shifting text.'
    },
    'ectoplasm': {
        name: 'Ectoplasm',
        description: 'A semi-transparent, ghostly button with a wispy, morphing shape and an ethereal glow.'
    },
    'runicCarving': {
        name: 'Runic Carving',
        description: 'Looks like a symbol carved into ancient stone, with inset text and a faint, ominous energy.'
    },
    'parchment': {
        name: 'Parchment',
        description: 'Aged paper buttons with ink-stain effects and quill flourishes'
    }
};
// SHARED FUNCTION: Generate button styles for any class name
function generateSharedButtonStyles(buttonStyle, className, colors, fonts, shouldFillSpace = false) {
    // Generate button styles based on theme
    switch (buttonStyle) {
        case 'text-only':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 12px;
                    background: transparent !important;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 0 !important;
                    border: none !important;
                    font-family: ${fonts.ui};
                    font-size: 18px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    position: relative;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}::after {
                    content: '';
                    position: absolute;
                    bottom: 2px;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background: currentColor;
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }
                
                .${className}:hover {
                    color: ${colors.textSecondary};
                    transform: none;
                    box-shadow: none;
                    background: transparent !important;
                }
                
                .${className}:hover::after {
                    width: 100%;
                }
                
                .${className}[style*="color"]:hover {
                    filter: brightness(1.2);
                }
            `;
        case 'neon':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 20px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 6px !important;
                    border: 1px solid ${colors.linkColor};
                    font-family: ${fonts.ui};
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: rgba(0,0,0,0.8);
                    color: ${colors.linkColor};
                    text-shadow: 0 0 10px ${colors.linkColor};
                    box-shadow: 
                        0 0 10px ${colors.linkColor}40,
                        inset 0 0 10px ${colors.linkColor}10;
                }
                
                .${className}[style*="background-color"] {
                    background: rgba(0,0,0,0.8) !important;
                    border-color: currentColor;
                    text-shadow: 0 0 10px currentColor;
                    box-shadow: 
                        0 0 10px currentColor,
                        inset 0 0 10px currentColor;
                }
                
                .${className}:hover {
                    transform: translateY(-2px);
                    text-shadow: 0 0 15px currentColor;
                }
                
                .${className}:not([style*="background-color"]):hover {
                    box-shadow: 
                        0 0 20px ${colors.linkColor}60,
                        0 0 40px ${colors.linkColor}20,
                        inset 0 0 15px ${colors.linkColor}20;
                }
                
                .${className}[style*="background-color"]:hover {
                    box-shadow: 
                        0 0 20px currentColor,
                        0 0 40px currentColor,
                        inset 0 0 15px currentColor;
                }
            `;

        case 'glassmorphism':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px 24px;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 16px !important;
                    border: 1px solid ${colors.textMuted}30;
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    box-shadow: 
                        0 8px 32px rgba(0,0,0,0.1),
                        inset 0 1px 0 rgba(255,255,255,0.5);
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: rgba(255,255,255,0.15);
                }
                
                .${className}[style*="background-color"] {
                    opacity: 0.85;
                }
                
                .${className}::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
                    border-radius: 16px;
                    pointer-events: none;
                }
                
                .${className}:hover {
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    transform: translateY(-3px);
                    border-color: ${colors.linkColor}40;
                    box-shadow: 
                        0 12px 40px rgba(0,0,0,0.15),
                        inset 0 2px 0 rgba(255,255,255,0.6);
                }
                
                .${className}:not([style*="background-color"]):hover {
                    background: rgba(255,255,255,0.25);
                }
                
                .${className}[style*="background-color"]:hover {
                    opacity: 0.95;
                }
            `;

        case 'origami':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 18px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 0 !important;
                    border: none;
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: ${colors.containerBg};
                    box-shadow: 
                        4px 4px 8px ${colors.textMuted}30,
                        -2px -2px 4px ${colors.softBg},
                        inset 2px 2px 4px ${colors.textMuted}10;
                }
                
                .${className}[style*="background-color"] {
                    box-shadow: 4px 4px 8px rgba(0,0,0,0.2);
                }
                
                .${className}:hover {
                    transform: translateY(-1px) translateX(-1px);
                }
                
                .${className}:not([style*="background-color"]):hover {
                    box-shadow: 
                        6px 6px 12px ${colors.textMuted}40,
                        -3px -3px 6px ${colors.softBg},
                        inset 3px 3px 6px ${colors.textMuted}15;
                }
                
                .${className}[style*="background-color"]:hover {
                    box-shadow: 6px 6px 12px rgba(0,0,0,0.3);
                }
            `;

        case 'holographic':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 20px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 12px !important;
                    border: 2px solid ${colors.textMuted}30;
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.4s ease;
                    white-space: nowrap;
                    position: relative;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: linear-gradient(45deg, ${colors.kawaiiPink}, ${colors.kawaiiGold}, ${colors.kawaiiBlue}, ${colors.kawaiiPink}, ${colors.kawaiiGold}, ${colors.kawaiiBlue});
                    background-size: 400% 400%;
                    color: white;
                    text-shadow: 0 0 10px rgba(0,0,0,0.5);
                    animation: hologramShift 6s ease-in-out infinite;
                }
                
                @keyframes hologramShift {
                    0%, 100% { background-position: 0% 50%; }
                    25% { background-position: 100% 0%; }
                    50% { background-position: 100% 100%; }
                    75% { background-position: 0% 100%; }
                }
                
                .${className}[style*="background-color"] {
                    border: 3px solid;
                    border-image: linear-gradient(45deg, ${colors.kawaiiPink}, ${colors.kawaiiGold}, ${colors.kawaiiBlue}, ${colors.kawaiiPink}) 1;
                }
                
                .${className}:hover {
                    transform: translateY(-3px) scale(1.05);
                }
                
                .${className}:not([style*="background-color"]):hover {
                    animation-duration: 2s;
                    box-shadow: 0 10px 30px ${colors.kawaiiPink}30;
                }
                
                .${className}[style*="background-color"]:hover {
                    border-image: linear-gradient(45deg, ${colors.kawaiiPink}, ${colors.kawaiiGold}, ${colors.kawaiiBlue}, ${colors.kawaiiPink}) 1;
                    filter: brightness(1.1);
                }
            `;

        case 'sketch':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 16px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 8px !important;
                    border: 2px solid ${colors.textPrimary};
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: ${colors.containerBg};
                }
                
                .${className}::before {
                    content: '';
                    position: absolute;
                    top: -2px; left: -2px; right: -2px; bottom: -2px;
                    border: 1px dashed ${colors.textMuted};
                    border-radius: 8px;
                    opacity: 0.5;
                }
                
                .${className}:hover {
                    transform: translateY(-1px) rotate(0.5deg);
                    border-style: dashed;
                }
                
                .${className}:hover::before {
                    opacity: 0.8;
                }
                
                .${className}[style*="color"]::before {
                    border-color: currentColor;
                }
            `;

        case 'crystal':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 18px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 0 !important;
                    border: 1px solid ${colors.textMuted}60;
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
                    box-shadow: 
                        0 0 15px ${colors.textMuted}20,
                        inset 0 1px 0 rgba(255,255,255,0.6),
                        inset 0 -1px 0 ${colors.textMuted}10;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.softBg} 50%, ${colors.containerBg} 100%);
                }
                
                .${className}::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 20%;
                    width: 60%; height: 100%;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
                    animation: crystalShine 3s ease-in-out infinite;
                }
                
                @keyframes crystalShine {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
                
                .${className}:hover {
                    transform: translateY(-2px);
                    border-color: ${colors.linkColor}40;
                    box-shadow: 
                        0 5px 25px ${colors.linkColor}20,
                        inset 0 2px 0 rgba(255,255,255,0.8),
                        inset 0 -2px 0 ${colors.textMuted}20;
                }
                
                .${className}:hover::before {
                    animation-duration: 1s;
                }
            `;

        case 'typewriter':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 14px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 4px !important;
                    border: 2px solid ${colors.textMuted};
                    border-bottom-width: 4px;
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.1s ease;
                    white-space: nowrap;
                    position: relative;
                    box-shadow: 
                        0 2px 0 ${colors.textMuted}80,
                        0 3px 5px rgba(0,0,0,0.2);
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.softBg} 100%);
                }
                
                .${className}:hover {
                    transform: translateY(1px);
                    border-bottom-width: 2px;
                    box-shadow: 
                        0 1px 0 ${colors.textMuted}80,
                        0 2px 3px rgba(0,0,0,0.3);
                }
                
                .${className}:active {
                    transform: translateY(2px);
                    border-bottom-width: 1px;
                    box-shadow: 
                        0 0 0 ${colors.textMuted}80,
                        0 1px 2px rgba(0,0,0,0.4);
                }
                
                .${className}[style*="background-color"] {
                    border-color: currentColor !important;
                    box-shadow: 
                        0 2px 0 currentColor,
                        0 3px 5px rgba(0,0,0,0.2);
                }
                
                .${className}[style*="background-color"]:hover {
                    box-shadow: 
                        0 1px 0 currentColor,
                        0 2px 3px rgba(0,0,0,0.3);
                }
                
                .${className}[style*="background-color"]:active {
                    box-shadow: 
                        0 0 0 currentColor,
                        0 1px 2px rgba(0,0,0,0.4);
                }
            `;

        case 'liquid':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 20px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 30px !important;
                    border: 2px solid ${colors.textMuted}40;
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.4s ease;
                    white-space: nowrap;
                    position: relative;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: ${colors.containerBg};
                }
                
                .${className}:hover {
                    border-radius: 15px !important;
                    transform: scale(1.1);
                    border-color: ${colors.linkColor}60;
                }
                
                .${className}:not([style*="background-color"]):hover {
                    background: ${colors.softBg};
                }
                
                .${className}:active {
                    border-radius: 50px !important;
                    transform: scale(0.95);
                    transition: all 0.1s ease;
                }
                
                .${className}::before {
                    content: '';
                    position: absolute;
                    width: 6px; height: 6px;
                    background: ${colors.linkColor}40;
                    border-radius: 50%;
                    top: -3px; right: 10%;
                    transition: all 0.4s ease;
                    opacity: 0;
                }
                
                .${className}:hover::before {
                    opacity: 1;
                    top: -8px;
                    border-radius: 30%;
                }
                
                .${className}[style*="background-color"]::before {
                    background: currentColor;
                }
            `;

        case 'kawaii':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 16px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 20px !important;
                    border: 2px solid ${colors.textMuted}30;
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.softBg} 100%);
                }
                
                .${className}[style*="background-color"] {
                    position: relative;
                }
                .${className}[style*="background-color"]::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
                    border-radius: 20px;
                    pointer-events: none;
                }
                
                .${className}:not([style*="background-color"])::before {
                    content: "♡";
                    position: absolute;
                    top: -2px; right: -2px;
                    font-size: 10px;
                    opacity: 0.6;
                    color: ${colors.kawaiiPink};
                }
                
                .${className}:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                    border-color: ${colors.kawaiiPink}60;
                }
            `;
            
        case 'candyPop':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 18px;
                    background: rgba(255,255,255,0.2);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 25px !important;
                    border: 3px solid rgba(255,255,255,0.3);
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    position: relative;
                    box-shadow: 
                        0 6px 15px rgba(0,0,0,0.1),
                        inset 0 2px 0 rgba(255,255,255,0.6);
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:hover {
                    transform: translateY(-1px) scale(1.08);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    box-shadow: 
                        0 8px 20px rgba(0,0,0,0.15),
                        inset 0 2px 0 rgba(255,255,255,0.8);
                }
            `;
            
        case 'magicalGirl':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 16px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 15px !important;
                    border: 2px solid ${colors.textMuted}40;
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.softBg} 50%, ${colors.containerBg} 100%);
                }
                
                .${className}[style*="background-color"] {
                    position: relative;
                }
                .${className}[style*="background-color"]::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
                    border-radius: 15px;
                    pointer-events: none;
                }
                
                .${className}:not([style*="background-color"])::after {
                    content: "✦";
                    position: absolute;
                    top: -3px; right: -3px;
                    font-size: 12px;
                    opacity: 0.5;
                    color: ${colors.kawaiiGold};
                    animation: sparkle 2s infinite;
                }
                
                @keyframes sparkle {
                    0%, 100% { opacity: 0.5; transform: rotate(0deg); }
                    50% { opacity: 1; transform: rotate(180deg); }
                }
                
                .${className}:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                    border-color: ${colors.kawaiiGold}70;
                }
            `;
            
        case 'industrial':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 14px;
                    background: ${colors.containerBg};
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 0 !important;
                    border: 1px solid ${colors.bannerBorder};
                    font-family: ${fonts.ui};
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    position: relative;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:hover {
                    border-color: ${colors.linkColor};
                    transform: translateX(2px);
                }
                
                .${className}:not([style*="background-color"]):hover {
                    background: ${colors.headerBg};
                }
            `;
            
        case 'wuxia':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 18px;
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.wuxiaGlow}40 100%);
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 8px !important;
                    border: 1px solid ${colors.wuxiaAccent}40;
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"])::before {
                    content: "◆";
                    position: absolute;
                    top: 50%; left: 4px;
                    transform: translateY(-50%);
                    font-size: 8px;
                    opacity: 0.4;
                    color: ${colors.wuxiaAccent};
                }
                
                .${className}:hover {
                    border-color: ${colors.wuxiaAccent}80;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                
                .${className}:not([style*="background-color"]):hover {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.wuxiaAccentLight}60 100%);
                }
            `;
            
        case 'horrific':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 16px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 0 !important;
                    border: 1px solid ${colors.journalAccent}50;
                    font-family: ${fonts.accent};
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.journalAccent}15 100%);
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                }
                
                .${className}[style*="background-color"] {
                    position: relative;
                }
                .${className}[style*="background-color"]::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.4) 100%);
                    pointer-events: none;
                    z-index: 1;
                }
                
                .${className}[style*="background-color"] {
                    z-index: 2;
                }
                .${className}[style*="background-color"] * {
                    position: relative;
                    z-index: 3;
                }
                
                .${className}:not([style*="background-color"])::after {
                    content: '';
                    position: absolute;
                    bottom: -2px; left: 20%;
                    width: 60%; height: 2px;
                    background: linear-gradient(to right, transparent 0%, ${colors.journalAccent}66 50%, transparent 100%);
                    border-radius: 0 0 50% 50%;
                }
                
                .${className}:hover {
                    border-color: ${colors.journalAccent}80;
                    box-shadow: 
                        0 4px 15px rgba(0,0,0,0.4),
                        0 0 10px ${colors.journalAccent}30;
                }
                
                .${className}[style*="background-color"]:hover::before {
                    background: linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.6) 100%);
                }
                
                .${className}:not([style*="background-color"]):hover {
                    background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.journalAccent}25 100%);
                }
            `;

        case 'glitchSignal':
            return `
                /* Glitch Signal - Analog/Digital Horror */
                @keyframes textGlitch {
                    0% { text-shadow: 1px 0 0 ${colors.journalAccent}, -1px 0 0 ${colors.linkColor}90; }
                    25% { text-shadow: -1px 0 0 ${colors.journalAccent}, 1px 0 0 ${colors.linkColor}90; }
                    50% { text-shadow: 1px 0 0 ${colors.journalAccent}, -1px 0 0 ${colors.linkColor}90; opacity: 0.9; }
                    74% { opacity: 1; }
                    75% { text-shadow: none; opacity: 0.4; }
                    100% { text-shadow: 1px 0 0 ${colors.journalAccent}, -1px 0 0 ${colors.linkColor}90; opacity: 1; }
                }
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 20px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 0 !important;
                    border: 1px solid ${colors.textMuted}40;
                    font-family: ${fonts.ui}, monospace;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    transition: all 0.1s ease;
                    white-space: nowrap;
                    position: relative;
                    animation: textGlitch 3s infinite linear;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: ${colors.headerBg};
                }

                .${className}::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: repeating-linear-gradient(0deg, ${colors.bodyBg}33 0px, transparent 1px, transparent 3px);
                    opacity: 0.5;
                    pointer-events: none;
                }
                
                .${className}:hover {
                    animation-duration: 0.5s;
                    background: ${colors.bodyBg};
                    border-color: ${colors.journalAccent};
                }
            `;

        case 'ectoplasm':
            return `
                /* Ectoplasm - Supernatural Horror */
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 22px;
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border: 1px solid ${colors.linkColor}30;
                    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50% !important;
                    font-family: ${fonts.primary};
                    font-size: 15px;
                    transition: all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
                    white-space: nowrap;
                    position: relative;
                    text-shadow: 0 0 10px ${colors.wuxiaGlow}80;
                    box-shadow: 0 0 15px ${colors.wuxiaGlow}30, inset 0 0 10px ${colors.wuxiaGlow}20;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"]) {
                    background: ${colors.wuxiaGlow}1A;
                    backdrop-filter: blur(2px);
                    -webkit-backdrop-filter: blur(2px);
                }
                
                .${className}[style*="background-color"] {
                    opacity: 0.7;
                    border-color: currentColor;
                    text-shadow: 0 0 10px currentColor;
                    box-shadow: 0 0 15px currentColor, inset 0 0 10px currentColor;
                }

                .${className}:hover {
                    border-radius: 70% 30% 50% 50% / 60% 70% 30% 40% !important;
                    transform: translateY(-2px) scale(1.03);
                    box-shadow: 0 0 25px ${colors.wuxiaGlow}50, inset 0 0 15px ${colors.wuxiaGlow}30;
                }

                .${className}[style*="background-color"]:hover {
                    opacity: 0.9;
                }
            `;
            
        case 'runicCarving':
            return `
                /* Runic Carving - Folk/Ancient Horror */
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 18px;
                    color: ${colors.textMuted};
                    text-decoration: none;
                    border-radius: 2px !important;
                    border: 1px solid ${colors.bodyBg};
                    font-family: ${fonts.secondary};
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    clip-path: polygon(0 5px, 5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px));
                    box-shadow: inset 0 2px 4px ${colors.bodyBg}99;
                    text-shadow: 1px 1px 0 ${colors.softBg}60;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }

                .${className}:not([style*="background-color"]) {
                    background: ${colors.containerBg};
                }

                .${className}[style*="background-color"] {
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
                    text-shadow: 1px 1px 0 rgba(255,255,255,0.2);
                }
                
                .${className}:hover {
                    color: ${colors.journalAccent};
                    text-shadow: 0 0 8px ${colors.journalAccent}99, 1px 1px 0 ${colors.softBg}60;
                    border-color: ${colors.bodyBg};
                }

                .${className}[style*="background-color"]:hover {
                    text-shadow: 0 0 8px currentColor, 1px 1px 0 rgba(255,255,255,0.2);
                    filter: brightness(1.1);
                }
            `;
            
        case 'parchment':
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 16px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(245,245,220,0.4) 100%);
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: 6px !important;
                    border: 1px solid rgba(139,69,19,0.2);
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    position: relative;
                    box-shadow: 0 2px 6px rgba(139,69,19,0.1);
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:not([style*="background-color"])::before {
                    content: "✒";
                    position: absolute;
                    top: -2px; right: -2px;
                    font-size: 10px;
                    opacity: 0.3;
                    color: rgba(139,69,19,0.6);
                }
                
                .${className}:hover {
                    border-color: rgba(139,69,19,0.4);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 10px rgba(139,69,19,0.15);
                }
                
                .${className}:not([style*="background-color"]):hover {
                    background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,220,0.6) 100%);
                }
            `;
            
        default: // rounded, sharp, pill, subtle
            let borderRadius;
            switch (buttonStyle) {
                case 'sharp': borderRadius = '0px'; break;
                case 'pill': borderRadius = '20px'; break;
                case 'subtle': borderRadius = '2px'; break;
                case 'rounded':
                default: borderRadius = '4px'; break;
            }
            
            return `
                .${className} {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 12px;
                    background: ${colors.containerBg};
                    color: ${colors.textPrimary};
                    text-decoration: none;
                    border-radius: ${borderRadius} !important;
                    border: 1px solid ${colors.textMuted}20;
                    font-family: ${fonts.accent};
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    ${shouldFillSpace ? 'flex: 1;' : ''}
                }
                
                .${className}:hover {
                    background: ${colors.textMuted}15;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
            `;
    }
}

// UPDATED: Generate Overview Links CSS using shared function
function generateOverviewLinksCSS(colors, fonts, alignment = 'left', spacing = 'centered', buttonStyle = 'rounded') {
    // Determine justify-content based on alignment
    let justifyContent = 'flex-start';
    if (alignment === 'center') {
        justifyContent = 'center';
    } else if (alignment === 'right') {
        justifyContent = 'flex-end';
    }
    
    const shouldFillSpace = spacing === 'flex';
    
    // Base container styles
    let css = `
        .overview-links-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: -10px 0px -5px 0px;
            padding: 0;
            justify-content: ${justifyContent};
        }
    `;
    
    // Add button styles using shared function
    css += generateSharedButtonStyles(buttonStyle, 'overview-link-btn', colors, fonts, shouldFillSpace);
    
    // Add common custom color handling
    css += `
        .overview-link-btn[style*="background-color"]:hover {
            filter: brightness(1.1);
        }
    `;
    
    return css;
}

// UPDATED: Generate Custom Navigation CSS using shared function
function generateCustomNavigationCSS(colors, fonts, customNavSettings, buttonStyle = 'rounded', customNavButtonStyle = 'rounded', siteWidth) {
    console.log('🔍 Custom nav CSS generation:');
    console.log('- customNavButtonStyle:', customNavButtonStyle);
    
    if (!customNavSettings || !customNavSettings.location) {
        return '/* No custom navigation configured */';
    }
    
    const { location, alignment, spacing, position, sticky } = customNavSettings;
    const shouldFillSpace = spacing === 'flex';

    // Base container styles
    let css = `
        /* Custom Navigation Buttons - Base Styles */
        .custom-nav-container {
            position: ${sticky ? 'fixed' : 'absolute'}${sticky ? ' !important' : ''};
            z-index: 1000;
            pointer-events: none; /* Allow clicks to pass through container */
        }
        
        .custom-nav-container .custom-nav-btn {
            pointer-events: auto; /* Re-enable clicks on buttons themselves */
            cursor: pointer;
            margin: 4px;
        }`;
    
    // Add button styles using shared function
    css += generateSharedButtonStyles(customNavButtonStyle, 'custom-nav-btn', colors, fonts, shouldFillSpace);
    
    // Add common custom color handling
    css += `
        .custom-nav-btn[style*="background-color"]:hover {
            filter: brightness(1.1);
        }
    `;
    
    // Location-specific positioning
    switch (location) {
        case 'banner':
            css += generateBannerNavigationCSS(alignment, spacing, position);
            break;
        case 'site-right':
            css += generateSiteRightNavigationCSS(alignment, spacing, position, siteWidth);
            break;
        case 'site-left':
            css += generateSiteLeftNavigationCSS(alignment, spacing, position, siteWidth);
            break;
    }
    console.log('📝 Final custom nav CSS length:', css.length);
    return css;
}

// Generate Banner Navigation CSS
// Replace the generateBannerNavigationCSS function:
function generateBannerNavigationCSS(alignment, spacing, position) {
    let justifyContent = 'flex-start';
    if (alignment === 'center') justifyContent = 'center';
    if (alignment === 'right') justifyContent = 'flex-end';
    
    let alignItems = 'flex-end'; // bottom
    if (position === 'top') alignItems = 'flex-start';
    if (position === 'center') alignItems = 'center';
    
    // Adjust padding based on position
    let paddingTop = '30px';
    let paddingBottom = '30px';
    
    if (position === 'top') {
        paddingTop = '15px'; // Less top padding = higher position
    } else if (position === 'bottom') {
        paddingBottom = '10px'; // You already set this to 10px
    }
    
    const shouldFillSpace = spacing === 'flex';
    
    return `
        /* Custom Navigation - Banner Location */
        .custom-nav-container.banner-nav {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: ${alignItems};
            justify-content: ${justifyContent};
            padding: ${paddingTop} 30px ${paddingBottom} 30px;
            pointer-events: none;
            z-index: 10; /* Above banner image but below title overlay */
        }
        
        .custom-nav-container.banner-nav .custom-nav-btn {
            ${shouldFillSpace ? 'flex: 1; margin: 0 4px;' : ''}
            z-index: 11;
        }
    `;
}

function generateSiteRightNavigationCSS(alignment, spacing, position, siteWidth = 'standard') {
    console.log('🔧 generateSiteRightNavigationCSS called with:', { alignment, spacing, position, siteWidth });
    
    // Calculate container half-width based on site width setting
    const containerHalfWidths = {
        narrow: '400px',   // 800px / 2
        standard: '450px', // 900px / 2  
        wide: '500px'      // 1000px / 2
    };
    const halfWidth = containerHalfWidths[siteWidth];
    console.log('🔧 halfWidth calculated as:', halfWidth);
    
    // Better positioning relative to container - more breathing room
    let rightPosition = '15px'; // close to edge (default)
    // NEW - use actual site width:
    const containerWidths = {
        narrow: '400px',   // half of 800px
        standard: '450px', // half of 900px  
        wide: '500px'      // half of 1000px
    };
    const halfContainerWidth = containerWidths[siteWidth] || '450px';

    if (alignment === 'center') {
        rightPosition = `calc(50vw - ${halfContainerWidth} - 180px)`; // Halfway between container and edge
    }
    if (alignment === 'left') {
        rightPosition = `calc(50vw - ${halfContainerWidth} - 130px)`; // Close but not overlapping (better gap)
    }
    
    // Calculate top position based on position setting
    let topPosition = '40px'; // high
    if (position === 'medium') topPosition = '240px'; // below banner
    if (position === 'low') topPosition = '320px';
    
    // Calculate gap based on spacing
    let gap = '8px'; // small
    if (spacing === 'medium') gap = '12px';
    if (spacing === 'large') gap = '20px';
    
    return `
        /* Custom Navigation - Site Right Location */
        .custom-nav-container.site-right-nav {
            top: ${topPosition};
            right: ${rightPosition};
            display: flex;
            flex-direction: column;
            gap: ${gap};
        }
        
        /* Responsive adjustments for site right nav */
        @media (max-width: 1200px) {
            .custom-nav-container.site-right-nav {
                right: ${alignment === 'left' ? '20px' : alignment === 'center' ? '50px' : '20px'};
            }
        }
    `;
}

// Replace the generateSiteLeftNavigationCSS function:
function generateSiteLeftNavigationCSS(alignment, spacing, position, siteWidth = 'standard') {
    // Calculate container half-width based on site width setting
    const containerHalfWidths = {
        narrow: '400px',   // 800px / 2
        standard: '450px', // 900px / 2  
        wide: '500px'      // 1000px / 2
    };
    const halfWidth = containerHalfWidths[siteWidth];
    
    // Better positioning relative to container - more breathing room
    let leftPosition = '15px'; // close to edge (default)
    // NEW:
    const containerWidths = {
        narrow: '400px',   // half of 800px
        standard: '450px', // half of 900px  
        wide: '500px'      // half of 1000px
    };
    const halfContainerWidth = containerWidths[siteWidth] || '450px';

    if (alignment === 'center') {
        leftPosition = `calc(50vw - ${halfContainerWidth} - 180px)`; // Halfway between container and edge
    }
    if (alignment === 'right') {
        leftPosition = `calc(50vw - ${halfContainerWidth} - 130px)`; // Close but not overlapping (better gap)
    }
    
    // Calculate top position based on position setting
    let topPosition = '40px'; // high
    if (position === 'medium') topPosition = '240px'; // below banner
    if (position === 'low') topPosition = '320px';
    
    // Calculate gap based on spacing
    let gap = '8px'; // small
    if (spacing === 'medium') gap = '12px';
    if (spacing === 'large') gap = '20px';
    
    return `
        /* Custom Navigation - Site Left Location */
        .custom-nav-container.site-left-nav {
            top: ${topPosition};
            left: ${leftPosition};
            display: flex;
            flex-direction: column;
            gap: ${gap};
        }
        
        /* Responsive adjustments for site left nav */
        @media (max-width: 1200px) {
            .custom-nav-container.site-left-nav {
                left: ${alignment === 'right' ? '20px' : alignment === 'center' ? '50px' : '20px'};
            }
        }
    `;
}

// Export functions for global access
export { generateSharedButtonStyles, generateOverviewLinksCSS, generateCustomNavigationCSS };
export default buttonStyles;