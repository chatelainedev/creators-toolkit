// Banner Styles for Lore Codex
// Provides visual effects for banner images

const bannerStyles = {
    none: {
        name: 'None',
        description: 'Clean banner with no effects applied'
    },
    'soft-blur': {
        name: 'Soft Blur',
        description: 'Gentle blur overlay for a dreamy effect'
    },
    vintage: {
        name: 'Vintage',
        description: 'Sepia tone with subtle grain for aged look'
    },
    'film-grain': {
        name: 'Film Grain',
        description: 'Adds texture and film-like grain'
    },
    glitch: {
        name: 'Glitch',
        description: 'Digital distortion effect with color shifts'
    },
    parallax: {
        name: 'Parallax',
        description: 'Subtle movement effect on scroll'
    },
    watercolor: {
        name: 'Watercolor',
        description: 'Soft painted look with blended colors'
    },
    'comic-book': {
        name: 'Comic Book',
        description: 'Bold outlines and saturated colors'
    },
    monochrome: {
        name: 'Monochrome',
        description: 'Black and white with selective color accent'
    }
};

// Generate CSS for banner styles
function generateBannerStyleCSS(bannerStyle) {
    if (!bannerStyle || bannerStyle === 'none') {
        return '';
    }

    switch (bannerStyle) {
        case 'soft-blur':
            return `
                .banner-image {
                    filter: blur(1px);
                }
                
                .header::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    backdrop-filter: blur(2px);
                    pointer-events: none;
                }
            `;

        case 'vintage':
            return `
                .banner-image {
                    filter: sepia(0.8) contrast(1.2) brightness(0.9);
                }
                
                .header::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 80%, transparent 50%, rgba(120, 80, 30, 0.1) 100%),
                        repeating-conic-gradient(from 0deg, transparent 0deg, rgba(0,0,0,0.03) 1deg, transparent 2deg);
                    mix-blend-mode: multiply;
                    pointer-events: none;
                }
            `;

        case 'film-grain':
            return `
                .header::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: 
                        radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
                        radial-gradient(circle at 2px 3px, rgba(0,0,0,0.1) 1px, transparent 0);
                    background-size: 4px 4px, 6px 6px;
                    opacity: 0.6;
                    mix-blend-mode: overlay;
                    pointer-events: none;
                }
            `;

        case 'glitch':
            return `
                .banner-image {
                    animation: glitch-effect 3s infinite;
                }
                
                .header::before,
                .header::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: inherit;
                    background-size: inherit;
                    background-position: inherit;
                    pointer-events: none;
                }
                
                .header::before {
                    animation: glitch-red 3s infinite;
                    mix-blend-mode: screen;
                }
                
                .header::after {
                    animation: glitch-blue 3s infinite;
                    mix-blend-mode: screen;
                }
                
                @keyframes glitch-effect {
                    0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
                    10% { transform: translate(-2px, 1px); filter: hue-rotate(90deg); }
                    20% { transform: translate(-1px, -1px); filter: hue-rotate(180deg); }
                    30% { transform: translate(1px, 2px); filter: hue-rotate(270deg); }
                    40% { transform: translate(1px, -1px); filter: hue-rotate(360deg); }
                    50% { transform: translate(-1px, 2px); filter: hue-rotate(90deg); }
                    60% { transform: translate(-1px, 1px); filter: hue-rotate(180deg); }
                    70% { transform: translate(0px, 1px); filter: hue-rotate(270deg); }
                    80% { transform: translate(1px, 0px); filter: hue-rotate(360deg); }
                    90% { transform: translate(0px, -1px); filter: hue-rotate(90deg); }
                }
                
                @keyframes glitch-red {
                    0%, 100% { transform: translate(0); background-color: transparent; }
                    10% { transform: translate(2px, 0); background-color: rgba(255, 0, 0, 0.1); }
                    20% { transform: translate(0); background-color: transparent; }
                    30% { transform: translate(-2px, 0); background-color: rgba(255, 0, 0, 0.1); }
                    40% { transform: translate(0); background-color: transparent; }
                }
                
                @keyframes glitch-blue {
                    0%, 100% { transform: translate(0); background-color: transparent; }
                    15% { transform: translate(-1px, 0); background-color: rgba(0, 255, 255, 0.1); }
                    25% { transform: translate(0); background-color: transparent; }
                    35% { transform: translate(1px, 0); background-color: rgba(0, 255, 255, 0.1); }
                    45% { transform: translate(0); background-color: transparent; }
                }
            `;

        case 'parallax':
            return `
                .header {
                    overflow: hidden;
                }
                
                .banner-image {
                    transform: scale(1.1);
                    transition: transform 0.5s ease-out;
                }
                
                .header:hover .banner-image {
                    transform: scale(1.05) translateY(-5px);
                }
                
                @media (prefers-reduced-motion: no-preference) {
                    .banner-image {
                        animation: subtle-float 6s ease-in-out infinite;
                    }
                }
                
                @keyframes subtle-float {
                    0%, 100% { transform: scale(1.1) translateY(0px); }
                    50% { transform: scale(1.1) translateY(-3px); }
                }
            `;

        case 'watercolor':
            return `
                .banner-image {
                    filter: blur(0.5px) saturate(1.3) contrast(0.9);
                }
                
                .header::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(ellipse at top left, rgba(255, 200, 200, 0.2) 0%, transparent 50%),
                        radial-gradient(ellipse at top right, rgba(200, 255, 200, 0.2) 0%, transparent 50%),
                        radial-gradient(ellipse at bottom left, rgba(200, 200, 255, 0.2) 0%, transparent 50%),
                        radial-gradient(ellipse at bottom right, rgba(255, 255, 200, 0.2) 0%, transparent 50%);
                    mix-blend-mode: soft-light;
                    pointer-events: none;
                }
            `;

        case 'comic-book':
            return `
                .banner-image {
                    filter: contrast(1.4) saturate(1.6) brightness(1.1);
                }
                
                .header {
                    border: 3px solid #000;
                    box-shadow: 
                        inset 0 0 0 2px #fff,
                        inset 0 0 0 4px #000,
                        0 0 0 2px #000;
                }
                
                .header::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 1px,
                            rgba(0, 0, 0, 0.03) 1px,
                            rgba(0, 0, 0, 0.03) 2px
                        );
                    pointer-events: none;
                }
            `;

        case 'monochrome':
            return `
                .banner-image {
                    filter: grayscale(1) contrast(1.2);
                }
                
                .header::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        linear-gradient(
                            135deg, 
                            rgba(255, 50, 50, 0.15) 0%, 
                            transparent 30%, 
                            transparent 70%, 
                            rgba(50, 50, 255, 0.15) 100%
                        );
                    mix-blend-mode: color;
                    pointer-events: none;
                }
            `;

        default:
            return '';
    }
}

// Export both the styles object and the generation function
export default bannerStyles;
export { generateBannerStyleCSS };