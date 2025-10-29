// Background Styles for Site Background Effects
const backgroundStyles = {
    'none': {
        name: 'None',
        description: 'No special effects applied to the background'
    },
    'subtle-grain': {
        name: 'Subtle Grain',
        description: 'Light paper-like texture overlay'
    },
    'parchment': {
        name: 'Parchment',
        description: 'Aged paper texture with subtle staining'
    },
    'fabric': {
        name: 'Fabric',
        description: 'Linen-like woven texture'
    },
    'marble': {
        name: 'Marble',
        description: 'Elegant marble stone pattern'
    },
    'wood-grain': {
        name: 'Wood Grain',
        description: 'Natural wood texture overlay'
    },
    'noise': {
        name: 'Digital Noise',
        description: 'Subtle static-like texture'
    },    
    // HORROR/GRUNGE EFFECTS
    'horror-grunge': {
        name: 'Horror Grunge',
        description: 'Heavy distressed texture with scratches and wear'
    },
    'blood-splatter': {
        name: 'Blood Splatter',
        description: 'Scattered stain patterns for horror themes'
    },
    'rust-decay': {
        name: 'Rust & Decay',
        description: 'Corroded metal and decay texture'
    },
    'torn-edges': {
        name: 'Torn Edges',
        description: 'Ripped and damaged surface effect'
    },

    // KAWAII/CUTE EFFECTS  
    'sparkles': {
        name: 'Sparkles',
        description: 'Magical twinkling sparkle effect'
    },
    'heart-pattern': {
        name: 'Heart Pattern',
        description: 'Cute scattered heart shapes'
    },
    'star-dust': {
        name: 'Star Dust',
        description: 'Dreamy scattered stars and glitter'
    },
    'soft-bokeh': {
        name: 'Soft Bokeh',
        description: 'Gentle blurred light circles'
    },

    // DIGITAL/CYBERPUNK EFFECTS
    'cyber-grid': {
        name: 'Cyber Grid',
        description: 'Digital grid pattern for tech themes'
    },
    'scan-lines': {
        name: 'Scan Lines',
        description: 'Retro CRT monitor effect'
    },
    'circuit-board': {
        name: 'Circuit Board',
        description: 'Electronic circuit pattern'
    },
    'glitch-static': {
        name: 'Glitch Static',
        description: 'Digital noise and interference'
    },

    // ATMOSPHERIC EFFECTS
    'misty-clouds': {
        name: 'Misty Clouds',
        description: 'Soft flowing mist for mystical atmospheres'
    },
    'mountain-mist': {
        name: 'Mountain Mist',
        description: 'Layered fog effect perfect for wuxia settings'
    },

    // GOTHIC EFFECTS
    'lace-pattern': {
        name: 'Lace Pattern',
        description: 'Delicate Victorian lace texture'
    },
    'gothic-filigree': {
        name: 'Gothic Filigree',
        description: 'Ornate decorative scrollwork'
    },
    'damask': {
        name: 'Damask',
        description: 'Elegant baroque damask pattern'
    }
};

// Background Color Overlays
const backgroundColorOverlays = {
    'none': {
        name: 'None',
        description: 'No color overlay applied'
    },
    'subtle-dark': {
        name: 'Subtle Dark',
        description: 'Very light black overlay for subtle depth'
    },
    'gothic-black': {
        name: 'Gothic Black',
        description: 'Medium black overlay for dramatic effect'
    },
    'deep-shadow': {
        name: 'Deep Shadow', 
        description: 'Heavy black overlay for maximum drama'
    },
    'horror-red': {
        name: 'Horror Red',
        description: 'Blood-like red tint for horror themes'
    },
    'vintage-sepia': {
        name: 'Vintage Sepia',
        description: 'Warm brown tint for aged, vintage feel'
    },
    'cold-blue': {
        name: 'Cold Blue',
        description: 'Cool blue tint for digital/winter atmosphere'
    },
    'sickly-green': {
        name: 'Sickly Green',
        description: 'Toxic green tint for decay/poison themes'
    },
    'dreamy-pink': {
        name: 'Dreamy Pink',
        description: 'Soft pink overlay for romantic, dreamy aesthetics'
    },
    'lavender-mist': {
        name: 'Lavender Mist',
        description: 'Gentle purple overlay for mystical, ethereal feel'
    },
    'rose-gold': {
        name: 'Rose Gold',
        description: 'Warm pink-gold tint for luxurious, elegant themes'
    },
    'sunset-purple': {
        name: 'Sunset Purple',
        description: 'Rich purple overlay for dramatic, magical atmosphere'
    },
    // ADDITIONAL DARK/GOTHIC OPTIONS
    'midnight-purple': {
        name: 'Midnight Purple',
        description: 'Deep dark purple for mystical gothic themes'
    },
    'shadow-blue': {
        name: 'Shadow Blue',
        description: 'Dark blue overlay for cold, somber atmospheres'
    },
    'deep-crimson': {
        name: 'Deep Crimson',
        description: 'Rich dark red for dramatic vampire/gothic themes'
    },
    'charcoal-mist': {
        name: 'Charcoal Mist',
        description: 'Warm dark gray for sophisticated darkness'
    },

    // MORE HORROR/INTENSE OPTIONS
    'poison-green': {
        name: 'Poison Green',
        description: 'Intense toxic green for plague/poison themes'
    },
    'blood-orange': {
        name: 'Blood Orange',
        description: 'Dark reddish-orange for apocalyptic themes'
    },
    'bruise-purple': {
        name: 'Bruise Purple',
        description: 'Sickly purple-brown for decay themes'
    },

    // DREAMY/SOFT OPTIONS
    'soft-peach': {
        name: 'Soft Peach',
        description: 'Gentle peachy-pink for warm, cozy aesthetics'
    },
    'mint-cream': {
        name: 'Mint Cream',
        description: 'Very light mint green for fresh, clean feel'
    },
    'sky-blue': {
        name: 'Sky Blue',
        description: 'Light blue overlay for airy, peaceful themes'
    },
    'vanilla-cream': {
        name: 'Vanilla Cream',
        description: 'Warm off-white for vintage, cozy atmospheres'
    },
    'coral-blush': {
        name: 'Coral Blush',
        description: 'Warm coral-pink for tropical, cheerful themes'
    },
    'lilac-dream': {
        name: 'Lilac Dream',
        description: 'Soft light purple for whimsical, fairy-tale feel'
    },

    // NATURE/ATMOSPHERIC
    'forest-green': {
        name: 'Forest Green',
        description: 'Deep green overlay for woodland, nature themes'
    },
    'ocean-depths': {
        name: 'Ocean Depths',
        description: 'Rich teal-blue for underwater, oceanic themes'
    },
    'sunset-orange': {
        name: 'Sunset Orange',
        description: 'Warm orange glow for desert, fire themes'
    },
    'dawn-gold': {
        name: 'Dawn Gold',
        description: 'Gentle golden overlay for elegant, warm themes'
    },
    'stormy-gray': {
        name: 'Stormy Gray',
        description: 'Cool gray for overcast, melancholy atmospheres'
    },

    // MYSTICAL/FANTASY
    'mystic-teal': {
        name: 'Mystic Teal',
        description: 'Ethereal blue-green for magical, otherworldly themes'
    },
    'fairy-purple': {
        name: 'Fairy Purple',
        description: 'Bright magical purple for fantasy, enchanted themes'
    },
    'moonlight-silver': {
        name: 'Moonlight Silver',
        description: 'Cool silvery overlay for lunar, ethereal themes'
    },
    'crystal-blue': {
        name: 'Crystal Blue',
        description: 'Clear bright blue for ice, crystal, pure themes'
    },

    // WARM/RICH TONES
    'amber-glow': {
        name: 'Amber Glow',
        description: 'Rich golden-brown for ancient, mystical themes'
    },
    'copper-shine': {
        name: 'Copper Shine',
        description: 'Metallic orange-brown for steampunk, industrial themes'
    },
    'burgundy-wine': {
        name: 'Burgundy Wine',
        description: 'Deep red-purple for royal, luxurious themes'
    },
    'ember-orange': {
        name: 'Ember Orange',
        description: 'Glowing orange-red for fire, passion themes'
    }
};

// Generate CSS for background styles
function generateBackgroundStyleCSS(styleName) {
    switch (styleName) {
        case 'subtle-grain':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0);
                    background-size: 4px 4px;
                    opacity: 0.3;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'parchment':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 20% 80%, rgba(120, 80, 30, 0.05) 40%, transparent 70%),
                        radial-gradient(circle at 80% 20%, rgba(120, 80, 30, 0.03) 40%, transparent 70%),
                        radial-gradient(circle at 40% 40%, rgba(120, 80, 30, 0.02) 40%, transparent 70%),
                        linear-gradient(90deg, rgba(120, 80, 30, 0.01) 0%, transparent 50%, rgba(120, 80, 30, 0.01) 100%);
                    opacity: 0.6;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'fabric':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 1px,
                            rgba(0, 0, 0, 0.02) 1px,
                            rgba(0, 0, 0, 0.02) 2px
                        ),
                        repeating-linear-gradient(
                            -45deg,
                            transparent,
                            transparent 1px,
                            rgba(0, 0, 0, 0.01) 1px,
                            rgba(0, 0, 0, 0.01) 2px
                        );
                    opacity: 0.4;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'marble':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        linear-gradient(110deg, transparent 40%, rgba(0,0,0,0.02) 45%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.02) 55%, transparent 60%),
                        linear-gradient(70deg, transparent 30%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.02) 45%, transparent 50%);
                    opacity: 0.5;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'wood-grain':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        repeating-linear-gradient(
                            90deg,
                            rgba(101, 67, 33, 0.02) 0px,
                            rgba(101, 67, 33, 0.03) 2px,
                            rgba(101, 67, 33, 0.02) 4px,
                            rgba(101, 67, 33, 0.01) 6px,
                            rgba(101, 67, 33, 0.02) 8px
                        );
                    opacity: 0.4;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'noise':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
                        radial-gradient(circle at 2px 3px, rgba(0,0,0,0.1) 1px, transparent 0);
                    background-size: 3px 3px, 5px 5px;
                    opacity: 0.1;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // HORROR/GRUNGE EFFECTS
        case 'torn-edges':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        polygon(0 0, 95% 0, 98% 5%, 100% 8%, 97% 12%, 100% 15%, 96% 20%, 100% 100%, 0 100%),
                        radial-gradient(circle at 5% 15%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 20%, transparent 40%),
                        radial-gradient(circle at 95% 25%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 25%, transparent 50%),
                        linear-gradient(45deg, transparent 48%, rgba(0,0,0,0.15) 49%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 51%, transparent 52%),
                        linear-gradient(-30deg, transparent 70%, rgba(0,0,0,0.2) 72%, transparent 74%);
                    clip-path: polygon(
                        0% 0%, 
                        3% 2%, 
                        8% 0%, 
                        12% 3%, 
                        18% 1%, 
                        25% 4%, 
                        32% 2%, 
                        40% 5%, 
                        48% 1%, 
                        55% 3%, 
                        65% 0%, 
                        72% 2%, 
                        80% 0%, 
                        88% 3%, 
                        95% 1%, 
                        100% 0%, 
                        100% 100%, 
                        0% 100%
                    );
                    opacity: 0.7;
                    pointer-events: none;
                    z-index: -1;
                }
            `;
        
        case 'horror-grunge':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    /* 
                     * This is a multi-layered effect to simulate weathered concrete.
                     * We stack different gradients from fine detail to large splotches.
                    */
                    background-image:
                        /* 1. Small Pits & Pockmarks (top layer) */
                        radial-gradient(circle 2px, rgba(0,0,0,0.5) 0%, transparent 100%),
                        
                        /* 2. Fine Grainy Noise */
                        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.25) 1px, transparent 0),
                        
                        /* 3. Medium Splotches and Water Stains */
                        radial-gradient(ellipse 30% 20% at 85% 25%, rgba(0,0,0,0.4) 0%, transparent 80%),
                        radial-gradient(ellipse 25% 15% at 10% 80%, rgba(0,0,0,0.5) 0%, transparent 70%),

                        /* 4. Large, soft light/dark areas (base layer) */
                        radial-gradient(ellipse 50% 70% at 15% 40%, rgba(0,0,0,0.6) 0%, transparent 100%);

                    /* Define sizes and repetition for each layer */
                    background-size:
                        150px 200px,  /* Pits */
                        3px 3px,      /* Noise */
                        100% 100%,    /* Medium Splotch 1 */
                        100% 100%,    /* Medium Splotch 2 */
                        100% 100%;    /* Large Base Splotch */

                    background-repeat:
                        repeat,       /* Pits */
                        repeat,       /* Noise */
                        no-repeat,    /* Medium Splotch 1 */
                        no-repeat,    /* Medium Splotch 2 */
                        no-repeat;    /* Large Base Splotch */

                    /* Overlay blends the texture with the background color for a more realistic effect */
                    mix-blend-mode: overlay;
                    opacity: 0.75;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'blood-splatter':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background:
                        /* Main Splat */
                        radial-gradient(ellipse 50% 30% at 20% 25%, rgba(120, 0, 0, 0.4) 0%, transparent 100%),
                        /* Secondary Splat */
                        radial-gradient(ellipse 40% 20% at 85% 65%, rgba(120, 0, 0, 0.3) 0%, transparent 100%),
                        /* Small Drips/Speckles */
                        radial-gradient(circle 2px at 18% 22%, rgba(120,0,0,0.5) 0%, transparent 100%),
                        radial-gradient(circle 3px at 25% 28%, rgba(120,0,0,0.4) 0%, transparent 100%),
                        radial-gradient(circle 1px at 83% 68%, rgba(120,0,0,0.5) 0%, transparent 100%),
                        radial-gradient(circle 2px at 70% 20%, rgba(120,0,0,0.3) 0%, transparent 100%);
                    background-size: 300px 300px, 400px 400px, 300px 300px, 300px 300px, 400px 400px, 500px 500px;
                    background-repeat: no-repeat;
                    opacity: 0.7;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'rust-decay':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 25% 40%, rgba(139, 69, 19, 0.2) 0%, transparent 60%),
                        radial-gradient(circle at 75% 20%, rgba(160, 82, 45, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 60% 80%, rgba(139, 69, 19, 0.18) 0%, transparent 70%),
                        linear-gradient(120deg, transparent 20%, rgba(139, 69, 19, 0.1) 25%, transparent 30%),
                        repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(139, 69, 19, 0.05) 15deg, transparent 30deg);
                    opacity: 0.5;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // KAWAII/CUTE EFFECTS
        case 'sparkles':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle 4px at 20% 30%, rgba(255, 182, 193, 0.7) 0%, rgba(255, 182, 193, 0.4) 30%, transparent 60%),
                        radial-gradient(circle 3px at 40% 70%, rgba(255, 218, 185, 0.6) 0%, rgba(255, 218, 185, 0.3) 40%, transparent 70%),
                        radial-gradient(circle 5px at 90% 40%, rgba(221, 160, 221, 0.8) 0%, rgba(221, 160, 221, 0.4) 25%, transparent 50%),
                        radial-gradient(circle 2px at 70% 10%, rgba(173, 216, 230, 0.7) 0%, rgba(173, 216, 230, 0.4) 50%, transparent 80%),
                        radial-gradient(circle 3px at 10% 90%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 40%, transparent 70%),
                        radial-gradient(circle 4px at 80% 80%, rgba(255, 240, 245, 0.6) 0%, rgba(255, 240, 245, 0.3) 35%, transparent 65%),
                        radial-gradient(circle 2px at 30% 15%, rgba(230, 230, 250, 0.7) 0%, rgba(230, 230, 250, 0.4) 50%, transparent 80%),
                        radial-gradient(circle 3px at 60% 85%, rgba(240, 255, 240, 0.6) 0%, rgba(240, 255, 240, 0.3) 40%, transparent 70%),
                        radial-gradient(circle 2px at 85% 25%, rgba(255, 192, 203, 0.7) 0%, rgba(255, 192, 203, 0.4) 50%, transparent 80%),
                        radial-gradient(circle 4px at 25% 60%, rgba(255, 228, 181, 0.6) 0%, rgba(255, 228, 181, 0.3) 30%, transparent 60%);
                    background-size: 80px 80px, 120px 120px, 100px 100px, 90px 90px, 110px 110px, 95px 95px, 85px 85px, 105px 105px, 75px 75px, 115px 115px;
                    animation: 
                        glitter-1 1.5s ease-in-out infinite,
                        glitter-2 2s ease-in-out infinite 0.3s,
                        glitter-3 1.8s ease-in-out infinite 0.7s;
                    opacity: 0.8;
                    pointer-events: none;
                    z-index: -1;
                }
                
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.6) 50%, transparent 52%),
                        linear-gradient(-45deg, transparent 48%, rgba(255, 255, 255, 0.6) 50%, transparent 52%),
                        linear-gradient(45deg, transparent 48%, rgba(255, 182, 193, 0.4) 50%, transparent 52%),
                        linear-gradient(-45deg, transparent 48%, rgba(255, 182, 193, 0.4) 50%, transparent 52%);
                    background-size: 12px 12px, 12px 12px, 8px 8px, 8px 8px;
                    background-position: 
                        15% 25%, 15% 25%,
                        60% 70%, 60% 70%,
                        85% 15%, 85% 15%,
                        30% 80%, 30% 80%;
                    animation: sparkle-cross 2.5s linear infinite;
                    opacity: 0.5;
                    pointer-events: none;
                    z-index: -2;
                }
                
                @keyframes glitter-1 {
                    0% { opacity: 0.3; }
                    10% { opacity: 0.8; } /* gentle flash */
                    20% { opacity: 0.4; }
                    30% { opacity: 0.7; }
                    40% { opacity: 0.2; }
                    50% { opacity: 0.6; }
                    60% { opacity: 0.9; } /* gentle flash */
                    70% { opacity: 0.3; }
                    80% { opacity: 0.6; }
                    90% { opacity: 0.2; }
                    100% { opacity: 0.3; }
                }
                
                @keyframes glitter-2 {
                    0% { opacity: 0.4; }
                    15% { opacity: 0.2; }
                    25% { opacity: 0.8; } /* gentle flash */
                    35% { opacity: 0.5; }
                    45% { opacity: 0.3; }
                    55% { opacity: 0.7; }
                    65% { opacity: 0.2; }
                    75% { opacity: 0.9; } /* gentle flash */
                    85% { opacity: 0.4; }
                    100% { opacity: 0.4; }
                }
                
                @keyframes glitter-3 {
                    0% { opacity: 0.5; }
                    20% { opacity: 0.7; }
                    30% { opacity: 0.3; }
                    40% { opacity: 0.8; } /* gentle flash */
                    50% { opacity: 0.2; }
                    60% { opacity: 0.6; }
                    70% { opacity: 0.3; }
                    80% { opacity: 0.9; } /* gentle flash */
                    90% { opacity: 0.4; }
                    100% { opacity: 0.5; }
                }
                
                @keyframes sparkle-cross {
                    0% { 
                        background-position: 15% 25%, 15% 25%, 60% 70%, 60% 70%;
                        opacity: 0.5;
                    }
                    25% { 
                        background-position: 45% 55%, 45% 55%, 20% 20%, 20% 20%;
                        opacity: 0.7;
                    }
                    50% { 
                        background-position: 75% 15%, 75% 15%, 80% 90%, 80% 90%;
                        opacity: 0.4;
                    }
                    75% { 
                        background-position: 25% 85%, 25% 85%, 70% 40%, 70% 40%;
                        opacity: 0.6;
                    }
                    100% { 
                        background-position: 15% 25%, 15% 25%, 60% 70%, 60% 70%;
                        opacity: 0.5;
                    }
                }
            `;

        case 'heart-pattern':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 105, 180, 0.15); /* Hot Pink with low alpha */
                    /* An SVG heart shape, URL-encoded, used as a mask */
                    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
                    mask-size: 50px 50px;
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
                    -webkit-mask-size: 50px 50px;
                    animation: hearts-float 15s ease-in-out infinite;
                    pointer-events: none;
                    z-index: -1;
                }

                @keyframes hearts-float {
                    0% { mask-position: 0 0; }
                    50% { mask-position: 25px 50px; }
                    100% { mask-position: 0 0; }
                }
            `;

        case 'star-dust':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle 3px at 25% 25%, #fff 0%, rgba(255,255,255,0.8) 40%, transparent 70%),
                        radial-gradient(circle 4px at 75% 75%, rgba(255, 215, 0, 1) 0%, rgba(255, 215, 0, 0.6) 30%, transparent 60%),
                        radial-gradient(circle 2px at 50% 10%, #fff 0%, rgba(255,255,255,0.9) 50%, transparent 80%),
                        radial-gradient(circle 3px at 10% 60%, rgba(173, 216, 230, 1) 0%, rgba(173, 216, 230, 0.5) 40%, transparent 70%),
                        radial-gradient(circle 4px at 90% 30%, rgba(255, 192, 203, 1) 0%, rgba(255, 192, 203, 0.6) 35%, transparent 65%),
                        radial-gradient(circle 2px at 30% 80%, #fff 0%, rgba(255,255,255,0.8) 50%, transparent 80%),
                        radial-gradient(circle 3px at 80% 15%, rgba(230, 230, 250, 1) 0%, rgba(230, 230, 250, 0.6) 40%, transparent 70%),
                        radial-gradient(circle 2px at 15% 85%, rgba(255, 215, 0, 1) 0%, rgba(255, 215, 0, 0.7) 50%, transparent 80%),
                        radial-gradient(circle 1px at 60% 40%, #fff 0%, rgba(255,255,255,0.9) 60%, transparent 90%),
                        radial-gradient(circle 2px at 40% 65%, rgba(255, 182, 193, 1) 0%, rgba(255, 182, 193, 0.6) 45%, transparent 75%);
                    background-size: 120px 120px, 180px 180px, 100px 100px, 150px 150px, 200px 200px, 140px 140px, 160px 160px, 130px 130px, 90px 90px, 110px 110px;
                    animation: 
                        twinkle-1 2s ease-in-out infinite,
                        twinkle-2 3s ease-in-out infinite 0.5s,
                        twinkle-3 2.5s ease-in-out infinite 1s;
                    opacity: 0.9;
                    pointer-events: none;
                    z-index: -1;
                }
                
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.8) 50%, transparent 51%),
                        linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.8) 50%, transparent 51%);
                    background-size: 6px 6px;
                    background-position: 
                        25% 25%, 75% 75%, 
                        60% 10%, 15% 90%,
                        85% 40%, 35% 70%;
                    animation: star-shimmer 3s linear infinite;
                    opacity: 0.7;
                    pointer-events: none;
                    z-index: -2;
                }
                
                @keyframes twinkle-1 {
                    0% { opacity: 0.3; }
                    10% { opacity: 0.6; }
                    20% { opacity: 0.4; }
                    30% { opacity: 0.8; }
                    40% { opacity: 0.5; }
                    50% { opacity: 1; } /* bright twinkle */
                    60% { opacity: 0.4; }
                    70% { opacity: 0.7; }
                    80% { opacity: 0.3; }
                    90% { opacity: 0.6; }
                    100% { opacity: 0.3; }
                }
                
                @keyframes twinkle-2 {
                    0% { opacity: 0.4; }
                    15% { opacity: 0.2; }
                    30% { opacity: 0.8; }
                    45% { opacity: 0.3; }
                    60% { opacity: 0.9; } /* bright twinkle */
                    75% { opacity: 0.5; }
                    90% { opacity: 0.2; }
                    100% { opacity: 0.4; }
                }
                
                @keyframes twinkle-3 {
                    0% { opacity: 0.5; }
                    20% { opacity: 0.8; }
                    35% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                    65% { opacity: 0.2; }
                    80% { opacity: 1; } /* bright twinkle */
                    95% { opacity: 0.4; }
                    100% { opacity: 0.5; }
                }
                
                @keyframes star-shimmer {
                    0% { background-position: 0% 0%, 100% 100%; }
                    25% { background-position: 25% 25%, 75% 75%; }
                    50% { background-position: 50% 50%, 50% 50%; }
                    75% { background-position: 75% 25%, 25% 75%; }
                    100% { background-position: 100% 0%, 0% 100%; }
                }
            `;

        case 'soft-bokeh':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image:
                        radial-gradient(circle 150px at 20% 80%, rgba(255, 182, 193, 0.2) 0%, transparent 100%),
                        radial-gradient(circle 100px at 80% 90%, rgba(173, 216, 230, 0.2) 0%, transparent 100%),
                        radial-gradient(circle 200px at 50% 20%, rgba(255, 255, 224, 0.15) 0%, transparent 100%),
                        radial-gradient(circle 80px at 90% 30%, rgba(230, 230, 250, 0.2) 0%, transparent 100%),
                        radial-gradient(circle 120px at 10% 15%, rgba(255, 218, 185, 0.18) 0%, transparent 100%);
                    background-repeat: no-repeat;
                    animation: bokeh-drift 30s ease-in-out infinite;
                    pointer-events: none;
                    z-index: -1;
                }

                @keyframes bokeh-drift {
                    0% {
                        background-position: 20% 80%, 80% 90%, 50% 20%, 90% 30%, 10% 15%;
                        opacity: 1;
                    }
                    50% {
                        background-position: 30% 70%, 70% 80%, 60% 30%, 80% 40%, 20% 25%;
                        opacity: 0.7;
                    }
                    100% {
                        background-position: 20% 80%, 80% 90%, 50% 20%, 90% 30%, 10% 15%;
                        opacity: 1;
                    }
                }
            `;


        // DIGITAL/CYBERPUNK EFFECTS
        case 'cyber-grid':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        linear-gradient(rgba(0, 255, 255, 0.2) 2px, transparent 2px),
                        linear-gradient(90deg, rgba(0, 255, 255, 0.2) 2px, transparent 2px),
                        linear-gradient(rgba(0, 150, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 150, 255, 0.05) 1px, transparent 1px);
                    background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
                    background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
                    transform: perspective(300px) rotateX(45deg);
                    transform-origin: 50% 100%;
                    opacity: 0.25;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'glitch-static':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        repeating-linear-gradient(0deg, rgba(255,0,255, 0.15), rgba(255,0,255, 0.05) 1px, transparent 1px, transparent 2px),
                        repeating-linear-gradient(90deg, rgba(0,255,255, 0.15), rgba(0,255,255, 0.05) 1px, transparent 1px, transparent 2px);
                    animation: glitch-anim 0.1s infinite steps(2);
                    opacity: 0.2;
                    pointer-events: none;
                    z-index: -1;
                }
                
                @keyframes glitch-anim {
                    0% {
                        transform: translate(0, 0);
                        clip-path: polygon(0 2%, 100% 2%, 100% 40%, 0 40%);
                    }
                    100% {
                        transform: translate(-2px, 2px);
                        clip-path: polygon(0 60%, 100% 60%, 100% 95%, 0 95%);
                    }
                }
            `;

        case 'scan-lines':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(
                        0deg,
                        transparent 0px,
                        transparent 2px,
                        rgba(0, 0, 0, 0.15) 2px,
                        rgba(0, 0, 0, 0.15) 3px,
                        transparent 3px,
                        transparent 4px,
                        rgba(0, 0, 0, 0.08) 4px,
                        rgba(0, 0, 0, 0.08) 5px,
                        transparent 5px,
                        transparent 8px
                    );
                    animation: scanline-move 3s linear infinite;
                    opacity: 0.7;
                    pointer-events: none;
                    z-index: -1;
                }
                
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(
                        0deg,
                        rgba(0, 255, 0, 0.02) 0px,
                        rgba(0, 255, 0, 0.02) 1px,
                        transparent 1px,
                        transparent 3px,
                        rgba(0, 255, 0, 0.04) 3px,
                        rgba(0, 255, 0, 0.04) 4px,
                        transparent 4px,
                        transparent 7px
                    );
                    animation: scanline-flicker 0.2s ease-in-out infinite;
                    opacity: 0.5;
                    pointer-events: none;
                    z-index: -2;
                }
                
                @keyframes scanline-move {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(8px); }
                }
                
                @keyframes scanline-flicker {
                    0% { opacity: 0.5; }
                    50% { opacity: 0.6; }
                    100% { opacity: 0.5; }
                }
            `;

        case 'circuit-board':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        linear-gradient(90deg, transparent 40%, rgba(0, 255, 0, 0.1) 42%, rgba(0, 255, 0, 0.1) 44%, transparent 46%),
                        linear-gradient(0deg, transparent 60%, rgba(0, 255, 0, 0.08) 62%, rgba(0, 255, 0, 0.08) 64%, transparent 66%),
                        radial-gradient(circle 3px at 25% 25%, rgba(0, 255, 0, 0.3) 0%, rgba(0, 255, 0, 0.1) 70%, transparent 100%),
                        radial-gradient(circle 2px at 75% 75%, rgba(0, 255, 0, 0.4) 0%, rgba(0, 255, 0, 0.1) 80%, transparent 100%),
                        radial-gradient(circle 4px at 50% 50%, rgba(0, 255, 0, 0.2) 0%, rgba(0, 255, 0, 0.05) 60%, transparent 100%);
                    background-size: 80px 80px, 80px 80px, 40px 40px, 60px 60px, 100px 100px;
                    opacity: 0.4;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // ATMOSPHERIC EFFECTS
        case 'misty-clouds':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(ellipse 800px 400px at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 70%),
                        radial-gradient(ellipse 600px 300px at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 60%),
                        radial-gradient(ellipse 400px 200px at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 80%);
                    opacity: 0.6;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'mountain-mist':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0.08) 80%, transparent 100%),
                        radial-gradient(ellipse 1200px 200px at 30% 70%, rgba(255, 255, 255, 0.12) 0%, transparent 70%),
                        radial-gradient(ellipse 800px 150px at 80% 60%, rgba(255, 255, 255, 0.08) 0%, transparent 60%);
                    opacity: 0.7;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // GOTHIC EFFECTS
        case 'gothic-filigree':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(ellipse 60px 20px at 30% 30%, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.03) 50%, transparent 80%),
                        radial-gradient(ellipse 20px 60px at 70% 70%, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.02) 50%, transparent 80%),
                        radial-gradient(ellipse 40px 15px at 50% 20%, rgba(0, 0, 0, 0.05) 0%, transparent 70%),
                        radial-gradient(ellipse 15px 40px at 20% 50%, rgba(0, 0, 0, 0.04) 0%, transparent 70%),
                        radial-gradient(ellipse 25px 10px at 80% 40%, rgba(0, 0, 0, 0.03) 0%, transparent 60%),
                        repeating-linear-gradient(30deg, transparent, transparent 40px, rgba(0, 0, 0, 0.01) 41px, transparent 42px),
                        repeating-linear-gradient(-30deg, transparent, transparent 35px, rgba(0, 0, 0, 0.015) 36px, transparent 37px);
                    background-size: 120px 120px, 120px 120px, 80px 80px, 80px 80px, 60px 60px, 100px 100px, 90px 90px;
                    opacity: 0.4;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'lace-pattern':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.1);
                    /* A delicate floral SVG pattern used as a mask */
                    mask-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 15a13 13 0 1026 0 13 13 0 00-26 0zm13 22a13 13 0 100-26 13 13 0 000 26z' stroke='%23000' stroke-width='1' fill='none'/%3E%3C/svg%3E");
                    mask-size: 40px 40px;
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 15a13 13 0 1026 0 13 13 0 00-26 0zm13 22a13 13 0 100-26 13 13 0 000 26z' stroke='%23000' stroke-width='1' fill='none'/%3E%3C/svg%3E");
                    -webkit-mask-size: 40px 40px;
                    opacity: 0.3;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'damask':
            return `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.07);
                    /* A classic damask/fleur-de-lis style SVG pattern */
                    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0 C40 10, 40 20, 50 30 C60 20, 60 10, 50 0 Z M20 40 C30 50, 35 60, 30 70 S10 80, 20 90 L30 90 C20 80, 25 70, 35 60 S40 40, 30 40 Z M80 40 C70 50, 65 60, 70 70 S90 80, 80 90 L70 90 C80 80, 75 70, 65 60 S60 40, 70 40 Z'/%3E%3C/svg%3E");
                    mask-size: 100px 100px;
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0 C40 10, 40 20, 50 30 C60 20, 60 10, 50 0 Z M20 40 C30 50, 35 60, 30 70 S10 80, 20 90 L30 90 C20 80, 25 70, 35 60 S40 40, 30 40 Z M80 40 C70 50, 65 60, 70 70 S90 80, 80 90 L70 90 C80 80, 75 70, 65 60 S60 40, 70 40 Z'/%3E%3C/svg%3E");
                    -webkit-mask-size: 100px 100px;
                    opacity: 0.5;
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        default:
            return '';
    }
}

// Generate CSS for background color overlays
function generateBackgroundColorOverlayCSS(overlayName) {
    switch (overlayName) {
        case 'subtle-dark':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.08);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'gothic-black':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.25);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'deep-shadow':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.45);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'horror-red':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(139, 0, 0, 0.15);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'vintage-sepia':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(101, 67, 33, 0.12);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'cold-blue':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(70, 130, 180, 0.15);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'sickly-green':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(85, 107, 47, 0.18);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'dreamy-pink':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 182, 193, 0.12);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'lavender-mist':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(230, 230, 250, 0.15);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'rose-gold':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(183, 110, 121, 0.10);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'sunset-purple':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(138, 43, 226, 0.12);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // ADDITIONAL DARK/GOTHIC OPTIONS
        case 'midnight-purple':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(25, 25, 112, 0.35);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'shadow-blue':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(25, 42, 86, 0.28);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'deep-crimson':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(139, 0, 63, 0.22);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'charcoal-mist':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(54, 54, 54, 0.25);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // MORE HORROR/INTENSE OPTIONS
        case 'poison-green':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(50, 120, 50, 0.22);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'blood-orange':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(139, 69, 19, 0.20);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'bruise-purple':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(94, 56, 89, 0.25);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // DREAMY/SOFT OPTIONS
        case 'soft-peach':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 218, 185, 0.12);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'mint-cream':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(245, 255, 250, 0.15);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'sky-blue':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(135, 206, 235, 0.10);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'vanilla-cream':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 240, 0.12);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'coral-blush':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 127, 80, 0.08);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'lilac-dream':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(200, 162, 200, 0.10);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // NATURE/ATMOSPHERIC
        case 'forest-green':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(34, 139, 34, 0.15);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'ocean-depths':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 128, 128, 0.18);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'sunset-orange':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 140, 0, 0.12);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'dawn-gold':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 215, 0, 0.08);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'stormy-gray':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(112, 128, 144, 0.18);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // MYSTICAL/FANTASY
        case 'mystic-teal':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(64, 224, 208, 0.12);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'fairy-purple':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(147, 112, 219, 0.15);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'moonlight-silver':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(192, 192, 192, 0.10);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'crystal-blue':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(30, 144, 255, 0.12);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        // WARM/RICH TONES
        case 'amber-glow':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 191, 0, 0.10);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'copper-shine':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(184, 115, 51, 0.12);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'burgundy-wine':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(128, 0, 32, 0.18);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        case 'ember-orange':
            return `
                body::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 69, 0, 0.15);
                    pointer-events: none;
                    z-index: -1;
                }
            `;

        default:
            return '';
    }
}

export default backgroundStyles;
export { generateBackgroundStyleCSS, backgroundColorOverlays, generateBackgroundColorOverlayCSS };