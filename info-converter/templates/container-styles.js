// Generate container-specific styles for main containers (world items)
// Container style definitions (affects main world item containers)
const containerStyles = {
    'left-border': {
        name: 'Left Border',
        description: 'Colored left border, different colors per category'
    },
    'outlined': {
        name: 'Outlined',
        description: 'Border around entire container, different colors per category'
    },
    'cards': {
        name: 'Cards',
        description: 'Drop shadows with thick top borders, different colors per category'
    },
    'solid-bg': {
        name: 'Solid Background',
        description: 'Subtle solid color backgrounds with sharp corners'
    },
    'outlined-bg': {
        name: 'Outlined Background',
        description: 'Subtle solid color backgrounds with matching outlines and rounded corners'
    },
    'boxed': {
        name: 'Boxed',
        description: 'Clean boxes with subtle shadows and rounded corners'
    },
    'tabs': {
        name: 'Tabs', 
        description: 'File folder style with colored tabs at the top'
    },
    'rounded': {
        name: 'Rounded',
        description: 'Modern rounded design with soft shadows and category accents'
    },
    'kawaii': {
        name: 'Kawaii',
        description: 'Adorable pastel containers with rounded corners, soft shadows, and cute emoji accents'
    },
    'candyPop': {
        name: 'Candy Pop',
        description: 'Sweet candy-colored containers with bubbly borders and playful gradients'
    },
    'magicalGirl': {
        name: 'Magical Girl',
        description: 'Sparkly containers with star decorations, gradient borders, and magical shimmer effects'
    },
    'industrial': {
        name: 'Industrial',
        description: 'Just background color differences and colored category headers'
    },
    'wuxia': {
        name: 'Wuxia',
        description: 'Refined containers with subtle gradients, traditional patterns, and jade-colored category accents'
    },
    'playersHandbook': {
        name: 'Player\'s Handbook',
        description: 'Ornate D&D handbook entries with burgundy borders, corner decorations, and illuminated category headers'
    },
    'adventurersTome': {
        name: 'Adventurer\'s Tome',
        description: ''
    },
    'horrific': {
        name: 'Horrific',
        description: 'Cursed relics with occult symbols and blood-red seals'
    },
    'parchment': {
        name: 'Parchment&Quill',
        description: 'Elegant aged parchment documents with ink accents and regency styling'
    },
    'minimal': {
        name: 'Minimal',
        description: 'Just background color differences and colored category headers'
    }
};

// Subcontainer style definitions (affects info sections within world items)
const subcontainerStyles = {
    'soft-bg': {
        name: 'Soft Background',
        description: 'Light background with subtle borders'
    },
    'outlined': {
        name: 'Outlined',
        description: 'Alternating solid and dashed borders'
    },
    'pills': {
        name: 'Pills',
        description: 'Rounded sections with shadows'
    },
    'stripes': {
        name: 'Stripes',
        description: 'Alternating colors with thick left borders'
    },
    'boxed': {
        name: 'Boxed',
        description: 'Simple contained sections with subtle borders'
    },
    'headers': {
        name: 'Headers',
        description: 'Clean section headers with colored backgrounds'
    },
    'rounded': {
        name: 'Rounded',
        description: 'Soft rounded sections to match rounded containers'
    },
    'kawaii': {
        name: 'Kawaii',
        description: 'Soft pastel info sections with rounded bubbles and gentle shadows'
    },
    'candyPop': {
        name: 'Candy Pop', 
        description: 'Sweet candy-themed sections with colorful borders and bubbly styling'
    },
    'magicalGirl': {
        name: 'Magical Girl',
        description: 'Enchanted info sections with sparkle effects and magical gradient backgrounds'
    },
    'industrial': {
        name: 'Industrial',
        description: 'Hard edges with a clipped corner, thick left border'
    },
    'wuxia': {
        name: 'Wuxia',
        description: 'Elegant sections with scholarly patterns and refined jade-tinted borders'
    },
    'playersHandbook': {
        name: 'Player\'s Handbook',
        description: 'Medieval manuscript sections with corner flourishes, illuminated headers, and parchment textures'
    },
    'adventurersTome': {
        name: 'Adventurer\'s Tome',
        description: ''
    },
    'horrific': {
        name: 'Horrific', 
        description: 'Forbidden scrolls with ancient parchment texture and wax seals'
    },
    'parchment': {
        name: 'Parchment&Quill',
        description: 'Refined letter sections with quill pen flourishes and watermark textures'
    },
    'minimal': {
        name: 'Minimal',
        description: 'Clean text with dotted separators'
    }

};

function generateContainerStyles(containerStyle, colors) {
    switch (containerStyle) {
        case 'left-border':
            return `
                .world-item {
                    border-radius: 8px;
                    border-left: 4px solid ${colors.textMuted};
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.textContent} !important; }

                /* Different border colors for each category */
                .world-item.general { 
                    border-left-color: ${colors.general};
                }
                .world-item.locations { 
                    border-left-color: ${colors.locations};
                }
                .world-item.factions { 
                    border-left-color: ${colors.factions};
                }
                .world-item.concepts { 
                    border-left-color: ${colors.concepts};
                }
                .world-item.events { 
                    border-left-color: ${colors.events};
                }
                .world-item.creatures { 
                    border-left-color: ${colors.creatures};
                }
                .world-item.plants { 
                    border-left-color: ${colors.plants};
                }
                .world-item.items { 
                    border-left-color: ${colors.items};
                }
                .world-item.culture { 
                    border-left-color: ${colors.culture};
                }
                .world-item.cultivation { 
                    border-left-color: ${colors.cultivation};
                }
                .world-item.magic { 
                    border-left-color: ${colors.magic};
                }`;

        case 'outlined':
            return `
                .world-item {
                    border-radius: 8px;
                    border: 2px solid ${colors.textMuted};
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.linkColor} !important; }

                .world-item.general { 
                    border-color: ${colors.general};
                }
                .world-item.locations { 
                    border-color: ${colors.locations};
                }
                .world-item.factions { 
                    border-color: ${colors.factions};
                }
                .world-item.concepts { 
                    border-color: ${colors.concepts};
                }
                .world-item.events { 
                    border-color: ${colors.events};
                }
                .world-item.creatures { 
                    border-color: ${colors.creatures};
                }
                .world-item.plants { 
                    border-color: ${colors.plants};
                }
                .world-item.items { 
                    border-color: ${colors.items};
                }
                .world-item.culture { 
                    border-color: ${colors.culture};
                }
                .world-item.cultivation { 
                    border-color: ${colors.cultivation};
                }
                .world-item.magic { 
                    border-color: ${colors.magic};
                }`;

        case 'cards':
            return `
                .world-item {
                    border-radius: 0;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, ${colors.bodyBg === '#1a1a1a' ? '0.3' : '0.12'});
                    border: 1px solid ${colors.textMuted}33;
                    border-top: 5px solid ${colors.textMuted};
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.statusCanon} !important; }

                .world-item.general { 
                    border-top-color: ${colors.general};
                }
                .world-item.locations { 
                    border-top-color: ${colors.locations};
                }
                .world-item.factions { 
                    border-top-color: ${colors.factions};
                }
                .world-item.concepts { 
                    border-top-color: ${colors.concepts};
                }
                .world-item.events { 
                    border-top-color: ${colors.events};
                }
                .world-item.creatures { 
                    border-top-color: ${colors.creatures};
                }
                .world-item.plants { 
                    border-top-color: ${colors.plants};
                }
                .world-item.items { 
                    border-top-color: ${colors.items};
                }
                .world-item.culture { 
                    border-top-color: ${colors.culture};
                }
                .world-item.cultivation { 
                    border-top-color: ${colors.cultivation};
                }
                .world-item.magic { 
                    border-top-color: ${colors.magic};
                }`;

        case 'solid-bg':
            return `
                .world-item {
                    border-radius: 0;
                    border: none;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.textTitle} !important; }

                .world-item.general { 
                    background: ${colors.general};
                }
                .world-item.locations { 
                    background: ${colors.locations};
                }
                .world-item.factions { 
                    background: ${colors.factions};
                }
                .world-item.concepts { 
                    background: ${colors.concepts};
                }
                .world-item.events { 
                    background: ${colors.events};
                }
                .world-item.creatures { 
                    background: ${colors.creatures};
                }
                .world-item.plants { 
                    background: ${colors.plants};
                }
                .world-item.items { 
                    background: ${colors.items};
                }
                .world-item.culture { 
                    background: ${colors.culture};
                }
                .world-item.cultivation { 
                    background: ${colors.cultivation};
                }
                .world-item.magic { 
                    background: ${colors.magic};
                }`;

        case 'outlined-bg':
            return `
                .world-item {
                    border-radius: 8px;
                    border: 2px solid ${colors.textMuted};
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.containerBg} !important; }

                .world-item.general { 
                    background: ${colors.general};
                    border-color: ${colors.general};
                }
                .world-item.locations { 
                    background: ${colors.locations};
                    border-color: ${colors.locations};
                }
                .world-item.factions { 
                    background: ${colors.factions};
                    border-color: ${colors.factions};
                }
                .world-item.concepts { 
                    background: ${colors.concepts};
                    border-color: ${colors.concepts};
                }
                .world-item.events { 
                    background: ${colors.events};
                    border-color: ${colors.events};
                }
                .world-item.creatures { 
                    background: ${colors.creatures};
                    border-color: ${colors.creatures};
                }
                .world-item.plants { 
                    background: ${colors.plants};
                    border-color: ${colors.plants};
                }
                .world-item.items { 
                    background: ${colors.items};
                    border-color: ${colors.items};
                }
                .world-item.culture { 
                    background: ${colors.culture};
                    border-color: ${colors.culture};
                }
                .world-item.cultivation { 
                    background: ${colors.cultivation};
                    border-color: ${colors.cultivation};
                }
                .world-item.magic { 
                    background: ${colors.magic};
                    border-color: ${colors.magic};
                }`;

        case 'boxed':
            return `
                .world-item {
                    background: ${colors.containerBg};
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,${colors.bodyBg === '#1a1a1a' ? '0.15' : '0.08'});
                    position: relative;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.linkColorSecondary} !important; }

                /* Category color accent on top-right corner */
                .world-item::before {
                    content: '';
                    position: absolute;
                    top: 0; right: 0;
                    width: 40px; height: 6px;
                    border-radius: 0 8px 0 8px;
                }

                .world-item.general::before { background: ${colors.general}; }
                .world-item.locations::before { background: ${colors.locations}; }
                .world-item.factions::before { background: ${colors.factions}; }
                .world-item.concepts::before { background: ${colors.concepts}; }
                .world-item.events::before { background: ${colors.events}; }
                .world-item.creatures::before { background: ${colors.creatures}; }
                .world-item.plants::before { background: ${colors.plants}; }
                .world-item.items::before { background: ${colors.items}; }
                .world-item.culture::before { background: ${colors.culture}; }
                .world-item.cultivation::before { background: ${colors.cultivation}; }
                .world-item.magic::before { background: ${colors.magic}; }`;

        case 'tabs':
            return `
                .world-item {
                    background: ${colors.containerBg};
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 0 6px 6px 6px;
                    position: relative;
                    margin-top: 8px;
                }

                 .world-item .world-item-content .item-name .image-indicator { background: ${colors.statusDraft} !important; }

                /* Tab at the top */
                .world-item::before {
                    content: '';
                    position: absolute;
                    top: -8px; left: 15px;
                    width: 80px; height: 8px;
                    border-radius: 4px 4px 0 0;
                    border: 1px solid ${colors.textMuted}33;
                    border-bottom: none;
                }

                .world-item.general::before { background: ${colors.general}; }
                .world-item.locations::before { background: ${colors.locations}; }
                .world-item.factions::before { background: ${colors.factions}; }
                .world-item.concepts::before { background: ${colors.concepts}; }
                .world-item.events::before { background: ${colors.events}; }
                .world-item.creatures::before { background: ${colors.creatures}; }
                .world-item.plants::before { background: ${colors.plants}; }
                .world-item.items::before { background: ${colors.items}; }
                .world-item.culture::before { background: ${colors.culture}; }
                .world-item.cultivation::before { background: ${colors.cultivation}; }
                .world-item.magic::before { background: ${colors.magic}; }`;

        case 'rounded':
            return `
                .world-item {
                    background: ${colors.containerBg};
                    border: 2px solid transparent;
                    border-radius: 12px;
                    box-shadow: 0 3px 12px rgba(0,0,0,${colors.bodyBg === '#1a1a1a' ? '0.2' : '0.1'});
                    position: relative;
                    overflow: hidden;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.physical} !important; }

                /* Subtle gradient overlay with category color */
                .world-item::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    opacity: 0.03;
                    pointer-events: none;
                }

                .world-item.general::before { background: linear-gradient(135deg, ${colors.general} 0%, transparent 60%); }
                .world-item.locations::before { background: linear-gradient(135deg, ${colors.locations} 0%, transparent 60%); }
                .world-item.factions::before { background: linear-gradient(135deg, ${colors.factions} 0%, transparent 60%); }
                .world-item.concepts::before { background: linear-gradient(135deg, ${colors.concepts} 0%, transparent 60%); }
                .world-item.events::before { background: linear-gradient(135deg, ${colors.events} 0%, transparent 60%); }
                .world-item.creatures::before { background: linear-gradient(135deg, ${colors.creatures} 0%, transparent 60%); }
                .world-item.plants::before { background: linear-gradient(135deg, ${colors.plants} 0%, transparent 60%); }
                .world-item.items::before { background: linear-gradient(135deg, ${colors.items} 0%, transparent 60%); }
                .world-item.culture::before { background: linear-gradient(135deg, ${colors.culture} 0%, transparent 60%); }
                .world-item.cultivation::before { background: linear-gradient(135deg, ${colors.cultivation} 0%, transparent 60%); }
                .world-item.magic::before { background: linear-gradient(135deg, ${colors.magic} 0%, transparent 60%); }

                /* Content positioning */
                .world-item-content {
                    position: relative;
                    z-index: 2;
                }`;

        case 'kawaii':
            return `
                /* Kawaii - Adorable Pastel Containers */
                .world-item {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.softBg} 100%);
                    border: 2px solid ${colors.textMuted}33;
                    border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    position: relative;
                    overflow: hidden;
                }

                /* FontAwesome icons in top corners */
                .world-item::before {
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 8px; right: 12px;
                    font-size: 14px;
                    opacity: 0.5;
                    z-index: 3;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.kawaiiPink} !important; }

                .world-item.general::before { content: "\\f005"; color: ${colors.general}; } 
                .world-item.locations::before { content: "\\f015"; color: ${colors.locations}; }
                .world-item.factions::before { content: "\\f0c0"; color: ${colors.factions}; }
                .world-item.concepts::before { content: "\\f0eb"; color: ${colors.concepts}; }
                .world-item.events::before { content: "\\f005"; color: ${colors.events}; }
                .world-item.creatures::before { content: "\\f1b0"; color: ${colors.creatures}; }
                .world-item.plants::before { content: "\\f06c"; color: ${colors.plants}; }
                .world-item.items::before { content: "\\f3a5"; color: ${colors.items}; }
                .world-item.culture::before { content: "\\f630"; color: ${colors.culture}; }
                .world-item.cultivation::before { content: "\\f0d0"; color: ${colors.cultivation}; }
                .world-item.magic::before { content: "\\f0d0"; color: ${colors.magic}; }

                /* Soft colored borders */
                .world-item.general { border-color: ${colors.general}66; }
                .world-item.locations { border-color: ${colors.locations}66; }
                .world-item.factions { border-color: ${colors.factions}66; }
                .world-item.concepts { border-color: ${colors.concepts}66; }
                .world-item.events { border-color: ${colors.events}66; }
                .world-item.creatures { border-color: ${colors.creatures}66; }
                .world-item.plants { border-color: ${colors.plants}66; }
                .world-item.items { border-color: ${colors.items}66; }
                .world-item.culture { border-color: ${colors.culture}66; }
                .world-item.cultivation { border-color: ${colors.cultivation}66; }
                .world-item.magic { border-color: ${colors.magic}66; }`;

        case 'candyPop':
            return `
                /* Candy Pop - Sweet Bubbly Containers */
                .world-item {
                    background: radial-gradient(circle at 30% 20%, 
                        ${colors.containerBg} 0%, 
                        ${colors.softBg} 60%);
                    border: 3px solid;
                    border-radius: 25px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 6px 20px rgba(0,0,0,0.1),
                        inset 0 1px 0 rgba(255,255,255,0.6);
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.kawaiiPurple} !important; }

                /* Candy-colored borders with category colors */
                .world-item.general { 
                    border-color: ${colors.general};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.general}20 0%, transparent 50%);
                }
                .world-item.locations { 
                    border-color: ${colors.locations};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.locations}20 0%, transparent 50%);
                }
                .world-item.factions { 
                    border-color: ${colors.factions};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.factions}20 0%, transparent 50%);
                }
                .world-item.concepts { 
                    border-color: ${colors.concepts};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.concepts}20 0%, transparent 50%);
                }
                .world-item.events { 
                    border-color: ${colors.events};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.events}20 0%, transparent 50%);
                }
                .world-item.creatures { 
                    border-color: ${colors.creatures};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.creatures}20 0%, transparent 50%);
                }
                .world-item.plants { 
                    border-color: ${colors.plants};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.plants}20 0%, transparent 50%);
                }
                .world-item.items { 
                    border-color: ${colors.items};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.items}20 0%, transparent 50%);
                }
                .world-item.culture { 
                    border-color: ${colors.culture};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.culture}20 0%, transparent 50%);
                }
                .world-item.cultivation { 
                    border-color: ${colors.cultivation};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.cultivation}20 0%, transparent 50%);
                }
                .world-item.magic { 
                    border-color: ${colors.magic};
                    background-image: radial-gradient(circle at 20% 30%, ${colors.magic}20 0%, transparent 50%);
                }`;

        case 'magicalGirl':
            return `
                /* Magical Girl - Sparkly Enchanted Containers */
                .world-item {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.softBg} 50%, 
                        ${colors.containerBg} 100%);
                    border: 2px solid ${colors.textMuted}40;
                    border-radius: 15px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                }

                /* Star decorations using FontAwesome */
                .world-item::after {
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 10px; left: 10px;
                    font-size: 12px;
                    opacity: 0.6;
                    z-index: 3;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.kawaiiGold} !important; }

                .world-item.general::after { content: "\\f005"; color: ${colors.general}; }
                .world-item.locations::after { content: "\\f005"; color: ${colors.locations}; }
                .world-item.factions::after { content: "\\f0d0"; color: ${colors.factions}; }
                .world-item.concepts::after { content: "\\f005"; color: ${colors.concepts}; }
                .world-item.events::after { content: "\\f0d0"; color: ${colors.events}; }
                .world-item.creatures::after { content: "\\f005"; color: ${colors.creatures}; }
                .world-item.plants::after { content: "\\f0d0"; color: ${colors.plants}; }
                .world-item.items::after { content: "\\f3a5"; color: ${colors.items}; }
                .world-item.culture::after { content: "\\f005"; color: ${colors.culture}; }
                .world-item.cultivation::after { content: "\\f0d0"; color: ${colors.cultivation}; }
                .world-item.magic::after { content: "\\f0d0"; color: ${colors.magic}; }

                /* Subtle magical border glow */
                .world-item.general { border-color: ${colors.general}80; }
                .world-item.locations { border-color: ${colors.locations}80; }
                .world-item.factions { border-color: ${colors.factions}80; }
                .world-item.concepts { border-color: ${colors.concepts}80; }
                .world-item.events { border-color: ${colors.events}80; }
                .world-item.creatures { border-color: ${colors.creatures}80; }
                .world-item.plants { border-color: ${colors.plants}80; }
                .world-item.items { border-color: ${colors.items}80; }
                .world-item.culture { border-color: ${colors.culture}80; }
                .world-item.cultivation { border-color: ${colors.cultivation}80; }
                .world-item.magic { border-color: ${colors.magic}80; }`;

        case 'industrial':
            return `
                /* Industrial dossier/panel style for main containers */
                .world-item {
                    border-radius: 0 !important;
                    border: 1px solid ${colors.bannerBorder};
                    background: ${colors.containerBg};
                    overflow: hidden;
                    box-shadow: none;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.statusIdea} !important; }

                /* Apply category colors to the border */
                .world-item.general { 
                    border-color: ${colors.general};
                }
                .world-item.locations { 
                    border-color: ${colors.locations};
                }
                .world-item.factions { 
                    border-color: ${colors.factions};
                }
                .world-item.concepts { 
                    border-color: ${colors.concepts};
                }
                .world-item.events { 
                    border-color: ${colors.events};
                }
                .world-item.creatures { 
                    border-color: ${colors.creatures};
                }
                .world-item.plants { 
                    border-color: ${colors.plants};
                }
                .world-item.items { 
                    border-color: ${colors.items};
                }
                .world-item.culture { 
                    border-color: ${colors.culture};
                }
                .world-item.cultivation { 
                    border-color: ${colors.cultivation};
                }
                .world-item.magic { 
                    border-color: ${colors.magic};
                }`;

        case 'wuxia':
            return `
                /* --- Wuxia Container Style: Cloud Recesses Elegance --- */
                .world-item {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.wuxiaGlow} 100%);
                    border: none;
                    border-radius: 8px;
                    padding: 25px;
                    margin-bottom: 20px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 2px 12px rgba(0,0,0,0.05),
                        0 1px 3px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                }

                /* Chinese cloud pattern overlay */
                .world-item::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: url('images/styles/cloudrecesses.png') center/cover no-repeat;
                    opacity: 0.15;
                    pointer-events: none;
                    z-index: 1;
                    background-blend-mode: soft-light;
                }

                /* Gentle hover enhancement */
                .world-item:hover {
                    box-shadow: 
                        0 4px 20px rgba(0,0,0,0.08),
                        0 2px 6px rgba(0,0,0,0.1);
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.wuxiaAccentLight}80 100%);
                }

                .world-item:hover::before {
                    opacity: 0.15;
                }

                /* Ensure content stays above overlay */
                .world-item-content {
                    position: relative;
                    z-index: 2;
                }

                 .world-item .world-item-content .item-name .image-indicator { background: ${colors.wuxiaAccent} !important; }

                /* Elegant category color accents */
                .world-item .item-name {
                    padding: 25px 20px 10px 0;
                    margin: -25px -25px 5px -25px;
                    position: relative;
                    z-index: 2;
                    border-bottom: 1px solid ${colors.wuxiaAccent}50;
                }

                /* Category-specific jade accents */
                .world-item.general .item-name { 
                    border-left: 4px solid ${colors.general};
                    background: linear-gradient(90deg, 
                        ${colors.general}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.locations .item-name { 
                    border-left: 4px solid ${colors.locations};
                    background: linear-gradient(90deg, 
                        ${colors.locations}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.factions .item-name { 
                    border-left: 4px solid ${colors.factions};
                    background: linear-gradient(90deg, 
                        ${colors.factions}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.concepts .item-name { 
                    border-left: 4px solid ${colors.concepts};
                    background: linear-gradient(90deg, 
                        ${colors.concepts}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.events .item-name { 
                    border-left: 4px solid ${colors.events};
                    background: linear-gradient(90deg, 
                        ${colors.events}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.creatures .item-name { 
                    border-left: 4px solid ${colors.creatures};
                    background: linear-gradient(90deg, 
                        ${colors.creatures}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.plants .item-name { 
                    border-left: 4px solid ${colors.plants};
                    background: linear-gradient(90deg, 
                        ${colors.plants}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.items .item-name { 
                    border-left: 4px solid ${colors.items};
                    background: linear-gradient(90deg, 
                        ${colors.items}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.culture .item-name { 
                    border-left: 4px solid ${colors.culture};
                    background: linear-gradient(90deg, 
                        ${colors.culture}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.cultivation .item-name { 
                    border-left: 4px solid ${colors.cultivation};
                    background: linear-gradient(90deg, 
                        ${colors.cultivation}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }
                .world-item.magic .item-name { 
                    border-left: 4px solid ${colors.magic};
                    background: linear-gradient(90deg, 
                        ${colors.magic}08 0%, 
                        transparent 100%);
                    padding-left: 25px;
                }`;

        case 'playersHandbook':
            return `
                /* Player's Handbook - Main World Items as Manuscript Pages */
                .world-item {
                    background: ${colors.containerBg};
                    border: 2px dashed ${colors.journalAccent}60;
                    border-radius: 0;
                    position: relative;
                    overflow: visible;
                    padding: 15px 12px 2px 12px;
                    margin: 12px 0;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.fighting} !important; }

                /* Ornate header ribbon that spans full width */
                .world-item .item-name {
                    background: linear-gradient(135deg, 
                        ${colors.sexuality} 0%, 
                        ${colors.journalAccent} 75%, 
                        ${colors.fighting} 100%);
                    color: ${colors.navActiveText};
                    padding: 18px 12px 16px 12px;
                    margin: -5px -12px 12px -2px;
                    position: relative;
                    z-index: 3;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-size: 1.2em;
                    border-bottom: 2px solid ${colors.fighting};
                    box-shadow: 0 3px 6px ${colors.textPrimary}33;
                    line-height: 1.1;
                    display: flex;
                    align-items: center;
                    height: 50px;
                    box-sizing: border-box;
                }

                /* Clean content area */
                .world-item .world-item-content {
                    position: relative;
                    z-index: 2;
                    background: transparent;
                    padding: 0;
                    border: none;
                }
            `;

        case 'adventurersTome':
            return `
                /* --- Adventurer's Tome Main Container --- */
                
                /* Each world item is a simple page in the tome */
                .world-item {
                    background: ${colors.navHover};
                    border: 2px solid ${colors.navBg};
                    border-radius: 4px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }

                /* Simple item names without the fancy header styling */
                .world-item .item-name {
                    background: transparent;
                    color: ${colors.itemName};
                    padding: 0 0 10px 0;
                    margin: 0 0 15px 0;
                    border: none;
                    border-bottom: 1px solid ${colors.textPrimary}66;
                    text-shadow: none;
                    box-shadow: none;
                    font-weight: 600;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.kawaiiGold} !important;}

                /* The category color as a simple left border accent */
                .world-item.general { border-left: 4px solid ${colors.general}; }
                .world-item.locations { border-left: 4px solid ${colors.locations}; }
                .world-item.factions { border-left: 4px solid ${colors.factions}; }
                .world-item.concepts { border-left: 4px solid ${colors.concepts}; }
                .world-item.events { border-left: 4px solid ${colors.events}; }
                .world-item.creatures { border-left: 4px solid ${colors.creatures}; }
                .world-item.plants { border-left: 4px solid ${colors.plants}; }
                .world-item.items { border-left: 4px solid ${colors.items}; }
                .world-item.culture { border-left: 4px solid ${colors.culture}; }
                .world-item.cultivation { border-left: 4px solid ${colors.cultivation}; }
                .world-item.magic { border-left: 4px solid ${colors.magic}; }
            `;

        case 'horrific':
            return `
                /* Horrific - Main World Items as Cursed Relics */
                .world-item {
                    background: ${colors.containerBg};
                    border: 2px solid ${colors.headerBg};
                    border-radius: 0;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 4px 20px rgba(0,0,0,0.6),
                        inset 0 1px 3px ${colors.journalAccent}33;
                    transition: all 0.3s ease;
                }

                /* Ominous texture overlay on each container */
                .world-item::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        radial-gradient(circle at 15% 85%, ${colors.journalAccent}08 0%, transparent 30%),
                        radial-gradient(circle at 85% 15%, rgba(0,0,0,0.05) 0%, transparent 40%);
                    pointer-events: none;
                    z-index: 1;
                }

                /* Ensure content stays above overlay */
                .world-item-content {
                    position: relative;
                    z-index: 2;
                }

                /* Hover effect - like awakening something dormant */
                .world-item:hover {
                    border-color: ${colors.journalAccent}66;
                    box-shadow: 
                        0 6px 25px rgba(0,0,0,0.7),
                        0 0 15px ${colors.journalAccent}33,
                        inset 0 1px 3px ${colors.journalAccent}40;
                    
                }

                .world-item:hover::before {
                    background: 
                        radial-gradient(circle at 15% 85%, ${colors.journalAccent}20 0%, transparent 30%),
                        radial-gradient(circle at 85% 15%, rgba(0,0,0,0.08) 0%, transparent 40%);
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.journalAccent} !important; }

                /* Category-specific cursed seals (dark colored left borders with symbols) */
                .world-item.general { 
                    border-left: 6px solid ${colors.general};
                }
                .world-item.general::after {
                    content: "\\f3c5";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.general};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.locations { 
                    border-left: 6px solid ${colors.locations};
                }
                .world-item.locations::after {
                    content: "\\f3c5";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.locations};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.factions { 
                    border-left: 6px solid ${colors.factions};
                }
                .world-item.factions::after {
                    content: "\\f3ed";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.factions};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.concepts { 
                    border-left: 6px solid ${colors.concepts};
                }
                .world-item.concepts::after {
                    content: "\\f5dc";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.concepts};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.events { 
                    border-left: 6px solid ${colors.events};
                }
                .world-item.events::after {
                    content: "\\f017";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.events};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.creatures { 
                    border-left: 6px solid ${colors.creatures};
                }
                .world-item.creatures::after {
                    content: "\\f6d5";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.creatures};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.plants { 
                    border-left: 6px solid ${colors.plants};
                }
                .world-item.plants::after {
                    content: "\\f4d8";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.plants};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.items { 
                    border-left: 6px solid ${colors.items};
                }
                .world-item.items::after {
                    content: "\\f3a5";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.items};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.culture { 
                    border-left: 6px solid ${colors.culture};
                }
                .world-item.culture::after {
                    content: "\\f630";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.culture};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.cultivation { 
                    border-left: 6px solid ${colors.cultivation};
                }
                .world-item.cultivation::after {
                    content: "\\f0d0";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.cultivation};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                .world-item.magic { 
                    border-left: 6px solid ${colors.magic};
                }
                .world-item.magic::after {
                    content: "\\f0d0";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 15px; left: -12px;
                    color: ${colors.magic};
                    font-size: 16px;
                    text-shadow: 0 0 8px ${colors.journalAccent}50;
                    z-index: 3;
                }

                /* Item names get a subtle blood-stain background */
                .world-item .item-name {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}20 0%, 
                        rgba(0,0,0,0.15) 50%, 
                        ${colors.journalAccent}12 100%);
                    border-bottom: 1px solid ${colors.journalAccent}50;
                    padding: 12px 20px 12px 35px;
                    margin: -20px -20px 15px -20px;
                    position: relative;
                    z-index: 2;
                }
            `;

        case 'parchment':
            return `
                /* Parchment&Quill - Main World Items as Elegant Documents */
                .world-item {
                    background: linear-gradient(135deg, 
                        #fefcf8 0%, 
                        #f8f5f0 30%, 
                        #faf7f2 70%, 
                        #f5f2ed 100%);
                    border: 1px solid ${colors.bannerBorder};
                    border-radius: 8px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 3px 12px ${colors.bannerBorder}20,
                        inset 0 1px 3px rgba(255,255,255,0.8);
                    margin-bottom: 20px;
                }

                /* Subtle parchment paper texture */
                .world-item::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 12px,
                            ${colors.bannerBorder}04 12px,
                            ${colors.bannerBorder}04 13px
                        ),
                        radial-gradient(circle at 85% 15%, 
                            ${colors.softBg}40 0%, 
                            transparent 30%);
                    pointer-events: none;
                    z-index: 1;
                }

                /* Ensure content stays above texture */
                .world-item-content {
                    position: relative;
                    z-index: 2;
                }

                /* Item names styled like document headers with ink accents */
                .world-item .item-name {
                    background: linear-gradient(135deg, 
                        ${colors.softBg}66 0%, 
                        ${colors.headerBg}33 100%);
                    border-bottom: 2px solid ${colors.bannerBorder}40;
                    padding: 15px 20px 12px;
                    margin: 0 0 15px 0;
                    position: relative;
                    z-index: 2;
                    border-radius: 8px 8px 0 0;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.textContent} !important; }

                /* Category-specific ink stamp effects */
                .world-item.general {
                    border-left: 4px solid ${colors.general};
                }
                .world-item.general .item-name::after {
                    content: "\\f005";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.locations {
                    border-left: 4px solid ${colors.locations};
                }
                .world-item.locations .item-name::after {
                    content: "\\f015";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.factions {
                    border-left: 4px solid ${colors.factions};
                }
                .world-item.factions .item-name::after {
                    content: "\\f0c0";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.concepts {
                    border-left: 4px solid ${colors.concepts};
                }
                .world-item.concepts .item-name::after {
                    content: "\\f0eb";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.events {
                    border-left: 4px solid ${colors.events};
                }
                .world-item.events .item-name::after {
                    content: "\\f073";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.creatures {
                    border-left: 4px solid ${colors.creatures};
                }
                .world-item.creatures .item-name::after {
                    content: "\\f1b0";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.plants {
                    border-left: 4px solid ${colors.plants};
                }
                .world-item.plants .item-name::after {
                    content: "\\f06c";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.items {
                    border-left: 4px solid ${colors.items};
                }
                .world-item.items .item-name::after {
                    content: "\\f466";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.culture {
                    border-left: 4px solid ${colors.culture};
                }
                .world-item.culture .item-name::after {
                    content: "\\f66f";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.cultivation {
                    border-left: 4px solid ${colors.cultivation};
                }
                .world-item.cultivation .item-name::after {
                    content: "\\f005";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }

                .world-item.magic {
                    border-left: 4px solid ${colors.magic};
                }
                .world-item.magic .item-name::after {
                    content: "\\f0d0";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    opacity: 0.3;
                    font-size: 16px;
                }`;

        case 'minimal':
        default:
            return `
                .world-item {
                    border-radius: 0;
                    border: none;
                    background: transparent;
                    padding: 15px 0;
                    border-bottom: 1px solid ${colors.textMuted}33;
                }

                .world-item:last-child {
                    border-bottom: none;
                }

                .world-item .world-item-content .item-name .image-indicator { background: ${colors.textMuted} !important; }

                .world-item .item-name {
                    padding: 8px 12px;
                    margin: -8px -12px 8px -12px;
                    border-radius: 0;
                }

                .world-item.general .item-name { 
                    background: ${colors.general}22;
                    border-left: 3px solid ${colors.general};
                }
                .world-item.locations .item-name { 
                    background: ${colors.locations}22;
                    border-left: 3px solid ${colors.locations};
                }
                .world-item.factions .item-name { 
                    background: ${colors.factions}22;
                    border-left: 3px solid ${colors.factions};
                }
                .world-item.concepts .item-name { 
                    background: ${colors.concepts}22;
                    border-left: 3px solid ${colors.concepts};
                }
                .world-item.events .item-name { 
                    background: ${colors.events}22;
                    border-left: 3px solid ${colors.events};
                }
                .world-item.creatures .item-name { 
                    background: ${colors.creatures}22;
                    border-left: 3px solid ${colors.creatures};
                }
                .world-item.plants .item-name { 
                    background: ${colors.plants}22;
                    border-left: 3px solid ${colors.plants};
                }
                .world-item.items .item-name { 
                    background: ${colors.items}22;
                    border-left: 3px solid ${colors.items};
                }
                .world-item.culture .item-name { 
                    background: ${colors.culture}22;
                    border-left: 3px solid ${colors.culture};
                }
                .world-item.cultivation .item-name { 
                    background: ${colors.cultivation}22;
                    border-left: 3px solid ${colors.cultivation};
                }
                .world-item.magic .item-name { 
                    background: ${colors.magic}22;
                    border-left: 3px solid ${colors.magic};
                }`;
    }
}

function generateSubcontainerStyles(subcontainerStyle, colors) {
    const categoryColors = colors;
    
    switch (subcontainerStyle) {
        case 'soft-bg':
            return `
                .info-section {
                    background: ${colors.softBg} !important;
                    padding: 12px;
                    border-radius: 6px !important;
                    border: 1px solid ${colors.textMuted}33;
                }`;

        case 'outlined':
            return `
                .info-section {
                    background: transparent;
                    padding: 15px;
                    border-radius: 6px;
                    border: 2px solid ${colors.textMuted};
                }
                
                .info-section:nth-child(odd) {
                    border-style: solid;
                }
                .info-section:nth-child(even) {
                    border-style: dashed;
                }`;

        case 'pills':
            return `
                .info-section {
                    background: ${colors.containerBg};
                    padding: 18px 24px;
                    border-radius: 30px;
                    box-shadow: 0 4px 12px ${colors.bodyBg === '#1a1a1a' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
                    border: 2px solid ${colors.textMuted}33;
                    margin: 12px 0;
                }`;

        case 'stripes':
            return `
                .info-section {
                    padding: 15px;
                    margin: 2px 0;
                    border-radius: 0;
                    position: relative;
                    border-left: 8px solid ${colors.textMuted};
                    border-right: 2px solid ${colors.textMuted};
                }
                
                .info-section:nth-child(1) {
                    background: ${colors.headerBg};
                    border-left-color: ${categoryColors.concepts};
                    border-right-color: ${categoryColors.concepts};
                }
                
                .info-section:nth-child(2) {
                    background: ${colors.bodyBg === '#1a1a1a' ? colors.containerBg : colors.headerBg};
                    border-left-color: ${categoryColors.creatures};
                    border-right-color: ${categoryColors.creatures};
                }`;

        case 'boxed':
            return `
                .info-section {
                    background: ${colors.headerBg};
                    padding: 15px 18px;
                    margin: 10px 0;
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 6px;
                    box-shadow: 0 1px 4px rgba(0,0,0,${colors.bodyBg === '#1a1a1a' ? '0.1' : '0.05'});
                }`;

        case 'headers':
            return `
                .info-section {
                    background: ${colors.containerBg};
                    padding: 0;
                    margin: 12px 0;
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 6px;
                    overflow: hidden;
                }

                .info-section .info-title {
                    background: ${colors.headerBg} !important;
                    border: none !important;
                    border-radius: 0 !important;
                    padding: 10px 18px !important;
                    margin: 0 0 15px 0 !important;
                    font-weight: 600 !important;
                    color: ${colors.textPrimary} !important;
                }

                .info-section .info-content {
                    padding: 0 18px 18px 18px;
                }`;

        case 'rounded':
            return `
                .info-section {
                    background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
                    padding: 16px 20px;
                    margin: 15px 0;
                    border: 1px solid ${colors.textMuted}20;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,${colors.bodyBg === '#1a1a1a' ? '0.1' : '0.05'});
                }

                .info-section .info-title {
                    background: transparent !important;
                    border: none !important;
                    border-bottom: 2px solid ${colors.textMuted}40 !important;
                    border-radius: 0 !important;
                    padding: 0 0 8px 0 !important;
                    margin: 0 0 15px 0 !important;
                    font-weight: 600 !important;
                }`;

        case 'kawaii':
            return `
                /* Kawaii - Soft Pastel Info Sections */
                .info-section {
                    background: linear-gradient(135deg, 
                        ${colors.softBg} 0%, 
                        ${colors.headerBg} 100%);
                    padding: 16px 20px;
                    margin: 12px 0;
                    border: 2px solid ${colors.textMuted}30;
                    border-radius: 18px;
                    box-shadow: 0 3px 12px rgba(0,0,0,0.06);
                    position: relative;
                }

                /* Cute FontAwesome heart indicator */
                .info-section::before {
                    content: "\\f004";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 8px; right: 12px;
                    font-size: 12px;
                    opacity: 0.3;
                    color: ${colors.textMuted};
                }

                .info-section .info-title {
                    background: ${colors.headerBg};
                    border: 1px solid ${colors.textMuted}40;
                    border-radius: 12px;
                    padding: 8px 15px !important;
                    margin: -8px -12px 12px -12px !important;
                    font-weight: 600 !important;
                    color: ${colors.textTitle};
                }`;

        case 'candyPop':
            return `
                /* Candy Pop - Sweet Bubbly Info Sections */
                .info-section {
                    background: radial-gradient(circle at 30% 30%, 
                        ${colors.containerBg} 0%, 
                        ${colors.softBg} 60%);
                    padding: 18px 22px;
                    margin: 15px 0;
                    border: 3px solid ${colors.textMuted}60;
                    border-radius: 22px;
                    box-shadow: 
                        0 4px 15px rgba(0,0,0,0.08),
                        inset 0 2px 0 rgba(255,255,255,0.4);
                }

                .info-section:nth-child(odd) {
                    border-color: ${colors.textMuted}60;
                    background-image: radial-gradient(circle at 20% 20%, ${colors.headerBg}40 0%, transparent 40%);
                }

                .info-section:nth-child(even) {
                    border-color: ${colors.textSecondary}60;
                    background-image: radial-gradient(circle at 20% 20%, ${colors.softBg}60 0%, transparent 40%);
                }

                .info-section .info-title {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.softBg} 100%);
                    border: 2px solid ${colors.textMuted}50;
                    border-radius: 15px;
                    padding: 10px 18px !important;
                    margin: -10px -15px 15px -15px !important;
                    font-weight: 700 !important;
                    color: ${colors.textTitle};
                }`;

        case 'magicalGirl':
            return `
                /* Magical Girl - Enchanted Sparkly Info Sections */
                .info-section {
                    background: linear-gradient(135deg, 
                        ${colors.softBg} 0%, 
                        ${colors.headerBg} 50%, 
                        ${colors.containerBg} 100%);
                    padding: 18px 20px;
                    margin: 15px 0;
                    border: 2px solid ${colors.textMuted}40;
                    border-radius: 12px;
                    position: relative;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                }

                /* Magical star sparkles */
                .info-section::after {
                    content: "\\f005";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    top: 6px; right: 8px;
                    font-size: 10px;
                    opacity: 0.4;
                    color: ${colors.textMuted};
                }

                .info-section .info-title {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.softBg} 100%);
                    border: 1px solid ${colors.textMuted}40;
                    border-radius: 8px;
                    padding: 10px 16px !important;
                    margin: -10px -12px 15px -12px !important;
                    font-weight: 600 !important;
                    color: ${colors.textTitle};
                    position: relative;
                }

                .info-section .info-title::before {
                    content: "\\f005";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    left: 8px; top: 50%;
                    transform: translateY(-50%);
                    font-size: 8px;
                    opacity: 0.5;
                    color: ${colors.textMuted};
                }`;

        case 'industrial':
            return `
                /* Industrial panel/dossier style */
                .info-section {
                    background: ${colors.headerBg};
                    padding: 15px 20px !important;
                    margin: 10px 0;
                    border-radius: 0 !important;
                    position: relative;
                    /* A thick left border for categorization, like a file tab color */
                    border-left: 8px solid ${colors.textMuted};
                    /* A subtle main border */
                    border-top: 1px solid ${colors.bannerBorder} !important;
                    border-right: 1px solid ${colors.bannerBorder} !important;
                    border-bottom: 1px solid ${colors.bannerBorder} !important;
                    /* Clipped top-right corner for a high-tech, manufactured look */
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%) !important;
                }
            `;


        case 'wuxia':
            return `
                /* --- Wuxia Subcontainer Style: Refined Scholarly Sections --- */
                .info-section {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.wuxiaGlow}40 100%);
                    padding: 18px 20px;
                    margin: 12px 0;
                    border-radius: 6px;
                    border: 1px solid ${colors.bannerBorder};
                    border-left: 3px solid ${colors.wuxiaAccent};
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 1px 8px rgba(0,0,0,0.03),
                        inset 0 1px 2px ${colors.containerBg}80;
                }

                /* Mist pattern overlay */
                .info-section::before {
                    content: '';
                    position: absolute;
                    top: 0; right: 0;
                    width: 50px; height: 100%;
                    background: url('images/styles/mist.png') center/cover no-repeat;
                    opacity: 0.1;
                    pointer-events: none;
                    z-index: 1;
                    background-blend-mode: soft-light;
                }

                /* Info titles styled like elegant letter headings */
                .info-section .info-title {
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid ${colors.wuxiaAccent}40;
                    padding: 0 0 8px 0 !important;
                    margin: 0 0 15px 0 !important;
                    position: relative;
                    z-index: 2;
                    font-weight: 500 !important;
                    text-transform: lowercase !important;
                    font-variant: small-caps !important;
                    letter-spacing: 0.8px;
                    font-size: 1.1em !important;
                    color: ${colors.textTitle || colors.textPrimary};
                }

                /* Subtle quill flourish after each title */
                .info-section .info-title::after {
                    content: "✒";
                    position: absolute;
                    top: 50%; right: 0;
                    transform: translateY(-50%);
                    color: ${colors.wuxiaAccent}40;
                    font-size: 14px;
                }

                /* Content positioning */
                .info-section .info-content {
                    position: relative;
                    z-index: 2;
                    line-height: 1.7;
                    color: ${colors.textPrimary};
                }
            `;

        case 'playersHandbook':
            return `
                /* Player's Handbook - Info Sections as Manuscript Entries */
                .info-section {
                    background: linear-gradient(135deg, 
                        ${colors.softBg}99 0%, 
                        ${colors.headerBg}66 100%);
                    padding: 18px 20px !important;
                    margin: 15px 0;
                    border: 2px solid ${colors.journalAccent};
                    border-radius: 0 !important;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 2px 8px ${colors.textPrimary}33,
                        inset 0 1px 2px rgba(255, 255, 255, 0.5);
                }

                /* Medieval manuscript corner flourishes */
                .info-section::before {
                    content: '';
                    position: absolute;
                    top: 5px; left: 5px;
                    width: 12px; height: 12px;
                    border-top: 1px solid ${colors.journalAccent};
                    border-left: 1px solid ${colors.journalAccent};
                    z-index: 1;
                }

                .info-section::after {
                    content: '';
                    position: absolute;
                    bottom: 5px; right: 5px;
                    width: 12px; height: 12px;
                    border-bottom: 1px solid ${colors.journalAccent};
                    border-right: 1px solid ${colors.journalAccent};
                    z-index: 1;
                }

                /* Manuscript paper texture */
                .info-section {
                    background-image: 
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 16px,
                            ${colors.textMuted}0D 16px,
                            ${colors.textMuted}0D 17px
                        ),
                        radial-gradient(circle at 90% 10%, 
                            ${colors.journalAccent}08 0%, 
                            transparent 20%);
                }

                /* Info titles styled like illuminated manuscript headers */
                .info-section .info-title {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent} 0%, 
                        ${colors.sexuality} 100%);
                    color: ${colors.containerBg};
                    border: none !important;
                    border-radius: 0 !important;
                    padding: 8px 16px !important;
                    margin: -18px -20px 15px -20px !important;
                    position: relative;
                    z-index: 2;
                    font-weight: 600 !important;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                    font-size: 1.0em !important;
                }

                /* Decorative underline for titles */
                .info-section .info-title::after {
                    content: '';
                    position: absolute;
                    bottom: -2px; left: 20%;
                    width: 60%; height: 1px;
                    background: linear-gradient(to right, 
                        transparent 0%, 
                        ${colors.containerBg}CC 20%, 
                        ${colors.containerBg} 50%, 
                        ${colors.containerBg}CC 80%, 
                        transparent 100%);
                }

                /* Content positioning and styling */
                .info-section .info-content {
                    position: relative;
                    z-index: 2;
                    line-height: 1.7;
                    color: ${colors.textPrimary};
                }
            `;

        case 'adventurersTome':
            return `
                /* --- Adventurer's Tome Subcontainer (Stitched Leather Panel Style) --- */
                
                .info-section {
                    /* A subtle background tint to differentiate the panel from the main page */
                    background: rgba(0,0,0,0.03);
                    
                    /* The "stitching" effect using a dashed border */
                    border: 2px dashed ${colors.navActiveText}BF; /* Dark color for the stitches, with some transparency */
                    
                    /* Spacing and Shape */
                    padding: 18px 20px;
                    margin: 15px 20px; /* Indent from the container edges and separate sections */
                    border-radius: 6px; /* Rounded corners like a piece of cut leather */
                    
                    /* A subtle inner shadow to make it feel slightly pressed into the page */
                    box-shadow: inset 0 0 8px rgba(0,0,0,0.1);
                }
            `;

        case 'horrific':
            return `
                /* Horrific - Info Sections as Forbidden Scrolls */
                .info-section {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.journalAccent}12 50%, 
                        ${colors.headerBg} 100%);
                    padding: 18px 20px !important;
                    margin: 15px 0;
                    border: 1px solid ${colors.headerBg};
                    border-left: 3px solid ${colors.journalAccent};
                    border-radius: 0 !important;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 3px 12px rgba(0,0,0,0.4),
                        inset 0 1px 2px ${colors.journalAccent}25;
                }

                /* Ancient scroll texture */
                .info-section::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 45px,
                            ${colors.journalAccent}04 45px,
                            ${colors.journalAccent}04 47px
                        ),
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 20px,
                            rgba(0,0,0,0.02) 20px,
                            rgba(0,0,0,0.02) 21px
                        );
                    pointer-events: none;
                    z-index: 1;
                }

                /* Info titles get a blood-drip effect */
                .info-section .info-title {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}40 0%, 
                        ${colors.journalAccent}20 100%);
                    border: 1px solid ${colors.journalAccent}50;
                    border-radius: 0 !important;
                    padding: 8px 15px !important;
                    margin: -18px -20px 15px -20px !important;
                    position: relative;
                    z-index: 2;
                    font-weight: 600 !important;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
                }

                /* Subtle drip effect under titles */
                .info-section .info-title::after {
                    content: '';
                    position: absolute;
                    bottom: -2px; left: 20%;
                    width: 60%; height: 2px;
                    background: linear-gradient(to right, 
                        transparent 0%, 
                        ${colors.journalAccent}66 20%, 
                        ${colors.journalAccent}99 50%, 
                        ${colors.journalAccent}66 80%, 
                        transparent 100%);
                    border-radius: 0 0 50% 50%;
                }

                /* Content area positioning */
                .info-section .info-content {
                    position: relative;
                    z-index: 2;
                    line-height: 1.7;
                }
            `;

        case 'parchment':
            return `
                /* Parchment&Quill - Info Sections as Elegant Letter Content */
                .info-section {
                    background: linear-gradient(135deg, 
                        rgba(255,255,255,0.6) 0%, 
                        rgba(245,245,220,0.3) 50%, 
                        rgba(250,240,230,0.2) 100%);
                    padding: 16px 20px !important;
                    margin: 12px 0;
                    border: 1px solid rgba(139,69,19,0.12);
                    border-left: 3px solid rgba(139,69,19,0.25);
                    border-radius: 6px !important;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 2px 8px rgba(139,69,19,0.04),
                        inset 0 1px 2px rgba(255,255,255,0.7);
                }

                /* Delicate paper texture for info sections */
                .info-section::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        /* Fine paper grain */
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 8px,
                            rgba(139,69,19,0.008) 8px,
                            rgba(139,69,19,0.008) 9px
                        ),
                        /* Subtle ink blot in corner */
                        radial-gradient(circle at 95% 8%, 
                            rgba(139,69,19,0.02) 0%, 
                            transparent 15%);
                    pointer-events: none;
                    z-index: 1;
                }

                /* Info titles styled like elegant letter headings */
                .info-section .info-title {
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(139,69,19,0.2);
                    padding: 0 0 8px 0 !important;
                    margin: 0 0 15px 0 !important;
                    position: relative;
                    z-index: 2;
                    font-weight: 500 !important;
                    text-transform: lowercase !important;
                    font-variant: small-caps !important;
                    letter-spacing: 0.8px;
                    font-size: 1.1em !important;
                    color: ${colors.textTitle || colors.textPrimary};
                }

                /* Subtle quill flourish after each title */
                .info-section .info-title::after {
                    content: "✒";
                    position: absolute;
                    top: 50%; right: 0;
                    transform: translateY(-50%);
                    color: rgba(139,69,19,0.25);
                    font-size: 14px;
                }

                /* Content positioning */
                .info-section .info-content {
                    position: relative;
                    z-index: 2;
                    line-height: 1.7;
                }
            `;

        case 'minimal':
        default:
            return `
                .info-section {
                    background: transparent;
                    padding: 12px 0;
                    border-radius: 0;
                    border-bottom: 1px dotted ${colors.textMuted};
                }
                
                .info-section:last-child {
                    border-bottom: none;
                }`;
    }
}

function generateCharacterSubcontainerStyles(subcontainerStyle, colors) {
    switch (subcontainerStyle) {
        case 'soft-bg':
            return `
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: ${colors.softBg} !important;
                    padding: 20px;
                    border-radius: 12px !important;
                    border: none;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
                    margin: 15px 0;
                }

                .character-info .info-section:first-child {
                    margin-top: 0;
                }

                .character-info .info-section:last-child {
                    margin-bottom: 0;
                }`;

        case 'outlined':
            return `
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: ${colors.headerBg}60;
                    padding: 18px;
                    border-radius: 8px;
                    border: 2px solid ${colors.textMuted};
                }

                .character-info .info-section:nth-child(1) { border-color: ${colors.physical}; }
                .character-info .info-section:nth-child(2) { border-color: ${colors.personality}; }
                .character-info .info-section:nth-child(3) { border-color: ${colors.sexuality}; }
                .character-info .info-section:nth-child(4) { border-color: ${colors.fighting}; }
                .character-info .info-section:nth-child(5) { border-color: ${colors.background}; }
                .character-info .info-section:nth-child(6) { border-color: ${colors.weapons}; }
                .character-info .info-section:nth-child(7) { border-color: ${colors.hobbies}; }
                .character-info .info-section:nth-child(8) { border-color: ${colors.quirks}; }
                .character-info .info-section:nth-child(9) { border-color: ${colors.relationships}; }
                .character-info .info-section:nth-child(10) { border-color: ${colors.events}; }
                `;

        case 'pills':
            return `
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: ${colors.containerBg};
                    padding: 20px 28px;
                    border-radius: 30px;
                    box-shadow: 0 4px 12px ${colors.bodyBg === '#1a1a1a' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
                    border: 2px solid ${colors.textMuted}33;
                    margin: 12px 0;
                }

                .character-info .info-section:nth-child(1) { border-color: ${colors.physical}66; }
                .character-info .info-section:nth-child(2) { border-color: ${colors.personality}66; }
                .character-info .info-section:nth-child(3) { border-color: ${colors.sexuality}66; }
                .character-info .info-section:nth-child(4) { border-color: ${colors.fighting}66; }
                .character-info .info-section:nth-child(5) { border-color: ${colors.background}66; }
                .character-info .info-section:nth-child(6) { border-color: ${colors.weapons}66; }
                .character-info .info-section:nth-child(7) { border-color: ${colors.hobbies}66; }
                .character-info .info-section:nth-child(8) { border-color: ${colors.quirks}66; }
                .character-info .info-section:nth-child(9) { border-color: ${colors.relationships}66; }
                .character-info .info-section:nth-child(10) { border-color: ${colors.events}66; }`;

        case 'stripes':
            return `
                .character-info .info-section,
                .character-basic-info .info-section {
                    padding: 18px;
                    border-radius: 4px;
                    border-left: 8px solid ${colors.textSecondary};
                    border-right: 2px solid ${colors.textSecondary};
                }

                .character-info .info-section:nth-child(1) { 
                    background: ${colors.headerBg}; 
                    border-left-color: ${colors.physical}; 
                    border-right-color: ${colors.physical}; 
                }
                .character-info .info-section:nth-child(2) { 
                    background: ${colors.bodyBg === '#1a1a1a' ? colors.containerBg : colors.headerBg}; 
                    border-left-color: ${colors.personality}; 
                    border-right-color: ${colors.personality}; 
                }
                .character-info .info-section:nth-child(3) { 
                    background: ${colors.headerBg}; 
                    border-left-color: ${colors.sexuality}; 
                    border-right-color: ${colors.sexuality}; 
                }
                .character-info .info-section:nth-child(4) { 
                    background: ${colors.bodyBg === '#1a1a1a' ? colors.containerBg : colors.headerBg}; 
                    border-left-color: ${colors.fighting}; 
                    border-right-color: ${colors.fighting}; 
                }
                .character-info .info-section:nth-child(5) { 
                    background: ${colors.headerBg}; 
                    border-left-color: ${colors.background}; 
                    border-right-color: ${colors.background}; 
                }
                .character-info .info-section:nth-child(6) { 
                    background: ${colors.bodyBg === '#1a1a1a' ? colors.containerBg : colors.headerBg}; 
                    border-left-color: ${colors.weapons}; 
                    border-right-color: ${colors.weapons}; 
                }
                .character-info .info-section:nth-child(7) { 
                    background: ${colors.headerBg}; 
                    border-left-color: ${colors.hobbies}; 
                    border-right-color: ${colors.hobbies}; 
                }
                .character-info .info-section:nth-child(8) { 
                    background: ${colors.bodyBg === '#1a1a1a' ? colors.containerBg : colors.headerBg}; 
                    border-left-color: ${colors.quirks}; 
                    border-right-color: ${colors.quirks}; 
                }
                .character-info .info-section:nth-child(9) { 
                    background: ${colors.headerBg}; 
                    border-left-color: ${colors.relationships}; 
                    border-right-color: ${colors.relationships}; 
                }
                .character-info .info-section:nth-child(10) { 
                    background: ${colors.bodyBg === '#1a1a1a' ? colors.containerBg : colors.headerBg}; 
                    border-left-color: ${colors.events}; 
                    border-right-color: ${colors.events}; 
                }`;

        case 'boxed':
            return `
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: ${colors.headerBg};
                    padding: 18px 20px;
                    margin: 12px 0;
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0,0,0,${colors.bodyBg === '#1a1a1a' ? '0.1' : '0.05'});
                }`;

        case 'headers':
            return `
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: ${colors.containerBg};
                    padding: 0;
                    margin: 15px 0;
                    border: 1px solid ${colors.textMuted}33;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .character-info .info-section .info-title,
                .character-basic-info .info-section .info-title {
                    background: ${colors.headerBg} !important;
                    padding: 12px 20px !important;
                    margin: 0 0 18px 0 !important;
                    font-weight: 600 !important;
                }

                .character-info .info-section .info-content,
                .character-basic-info .info-section .info-content {
                    padding: 0 20px 20px 20px;
                }`;

        case 'rounded':
            return `
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
                    padding: 20px 22px;
                    margin: 18px 0;
                    border: 1px solid ${colors.textMuted}20;
                    border-radius: 15px;
                    box-shadow: 0 3px 10px rgba(0,0,0,${colors.bodyBg === '#1a1a1a' ? '0.1' : '0.05'});
                }`;

        case 'minimal':
        default:
            return `
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: transparent;
                    padding: 18px 0;
                    border-radius: 0;
                    border-bottom: 1px dotted ${colors.textMuted};
                }
                
                .character-info .info-section:last-child {
                    border-bottom: none;
                }`;

        case 'kawaii':
            return `
                /* Kawaii - Soft Pastel Character Sections */
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: linear-gradient(135deg, 
                        ${colors.softBg} 0%, 
                        ${colors.headerBg} 100%);
                    padding: 18px 22px;
                    margin: 15px 0;
                    border: 2px solid ${colors.textMuted}30;
                    border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.06);
                    position: relative;
                }

                /* Character section colored borders */
                .character-basic-info .info-section {
                    border-color: ${colors.physical}60;
                }
                
                .character-info .info-section:nth-child(1) { border-color: ${colors.physical}60; }
                .character-info .info-section:nth-child(2) { border-color: ${colors.personality}60; }
                .character-info .info-section:nth-child(3) { border-color: ${colors.sexuality}60; }
                .character-info .info-section:nth-child(4) { border-color: ${colors.fighting}60; }
                .character-info .info-section:nth-child(5) { border-color: ${colors.background}60; }
                .character-info .info-section:nth-child(6) { border-color: ${colors.weapons}60; }
                .character-info .info-section:nth-child(7) { border-color: ${colors.hobbies}60; }
                .character-info .info-section:nth-child(8) { border-color: ${colors.quirks}60; }
                .character-info .info-section:nth-child(9) { border-color: ${colors.relationships}60; }
                .character-info .info-section:nth-child(10) { border-color: ${colors.events}60; }

                .character-info .info-section .info-title,
                .character-basic-info .info-section .info-title {
                    background: ${colors.headerBg};
                    border: 1px solid ${colors.textMuted}40;
                    border-radius: 15px;
                    padding: 10px 18px !important;
                    margin: -10px -15px 15px -15px !important;
                    font-weight: 600 !important;
                    color: ${colors.textTitle};
                }`;

        case 'candyPop':
            return `
                /* Candy Pop - Sweet Character Sections */
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: radial-gradient(circle at 30% 30%, 
                        ${colors.containerBg} 0%, 
                        ${colors.softBg} 60%);
                    padding: 20px 24px;
                    margin: 18px 0;
                    border: 3px solid;
                    border-radius: 25px;
                    box-shadow: 
                        0 6px 18px rgba(0,0,0,0.08),
                        inset 0 2px 0 rgba(255,255,255,0.4);
                }

                /* Character section candy colors */
                .character-basic-info .info-section {
                    border-color: ${colors.physical};
                    background-image: radial-gradient(circle at 20% 20%, ${colors.physical}15 0%, transparent 40%);
                }
                
                .character-info .info-section:nth-child(1) { 
                    border-color: ${colors.physical}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.physical}15 0%, transparent 40%);
                }
                .character-info .info-section:nth-child(2) { 
                    border-color: ${colors.personality}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.personality}15 0%, transparent 40%);
                }
                .character-info .info-section:nth-child(3) { 
                    border-color: ${colors.sexuality}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.sexuality}15 0%, transparent 40%);
                }
                .character-info .info-section:nth-child(4) { 
                    border-color: ${colors.fighting}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.fighting}15 0%, transparent 40%);
                }
                .character-info .info-section:nth-child(5) { 
                    border-color: ${colors.background}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.background}15 0%, transparent 40%);
                }
                .character-info .info-section:nth-child(6) { 
                    border-color: ${colors.weapons}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.weapons}15 0%, transparent 40%);
                }
                .character-info .info-section:nth-child(7) { 
                    border-color: ${colors.hobbies}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.hobbies}15 0%, transparent 40%);
                }
                .character-info .info-section:nth-child(8) { 
                    border-color: ${colors.quirks}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.quirks}15 0%, transparent 40%);
                }
                .character-info .info-section:nth-child(9) { 
                    border-color: ${colors.relationships}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.relationships}15 0%, transparent 40%);
                }
                .character-info .info-section:nth-child(10) { 
                    border-color: ${colors.events}; 
                    background-image: radial-gradient(circle at 20% 20%, ${colors.events}15 0%, transparent 40%);
                }

                .character-info .info-section .info-title,
                .character-basic-info .info-section .info-title {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.softBg} 100%);
                    border: 2px solid ${colors.textMuted}50;
                    border-radius: 18px;
                    padding: 12px 20px !important;
                    margin: -12px -18px 18px -18px !important;
                    font-weight: 700 !important;
                    color: ${colors.textTitle};
                }`;

        case 'magicalGirl':
            return `
                /* Magical Girl - Enchanted Character Sections */
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: linear-gradient(135deg, 
                        ${colors.softBg} 0%, 
                        ${colors.headerBg} 50%, 
                        ${colors.containerBg} 100%);
                    padding: 20px 22px;
                    margin: 18px 0;
                    border: 2px solid ${colors.textMuted}40;
                    border-radius: 15px;
                    position: relative;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                }

                /* Character section magical borders */
                .character-basic-info .info-section {
                    border-color: ${colors.physical}70;
                }
                
                .character-info .info-section:nth-child(1) { border-color: ${colors.physical}70; }
                .character-info .info-section:nth-child(2) { border-color: ${colors.personality}70; }
                .character-info .info-section:nth-child(3) { border-color: ${colors.sexuality}70; }
                .character-info .info-section:nth-child(4) { border-color: ${colors.fighting}70; }
                .character-info .info-section:nth-child(5) { border-color: ${colors.background}70; }
                .character-info .info-section:nth-child(6) { border-color: ${colors.weapons}70; }
                .character-info .info-section:nth-child(7) { border-color: ${colors.hobbies}70; }
                .character-info .info-section:nth-child(8) { border-color: ${colors.quirks}70; }
                .character-info .info-section:nth-child(9) { border-color: ${colors.relationships}70; }
                .character-info .info-section:nth-child(10) { border-color: ${colors.events}70; }

                .character-info .info-section .info-title,
                .character-basic-info .info-section .info-title {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.softBg} 100%);
                    border: 1px solid ${colors.textMuted}50;
                    border-radius: 10px;
                    padding: 12px 18px !important;
                    margin: -12px -15px 18px -15px !important;
                    font-weight: 600 !important;
                    color: ${colors.textTitle};
                    position: relative;
                }

                .character-info .info-section .info-title::before,
                .character-basic-info .info-section .info-title::before {
                    content: "\\f005";
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    position: absolute;
                    left: 5px; top: 50%;
                    transform: translateY(-50%);
                    font-size: 10px;
                    opacity: 0.5;
                    color: ${colors.textMuted};
                }`;

        case 'industrial':
            return `
                /* Industrial dossier/file style for character sections */
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: ${colors.headerBg};
                    padding: 18px 22px !important;
                    margin: 12px 0;
                    border-radius: 0 !important;
                    position: relative;
                    /* Thick left border for section categorization */
                    border-left: 8px solid ${colors.textMuted};
                    /* Subtle main borders */
                    border-top: 1px solid ${colors.bannerBorder};
                    border-right: 1px solid ${colors.bannerBorder};
                    border-bottom: 1px solid ${colors.bannerBorder};
                    /* Clipped corner for high-tech, manufactured look */
                    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
                }
                
                /* Basic Information gets physical color */
                .character-basic-info .info-section {
                    border-left-color: ${colors.physical || colors.journalAccent};
                }
                
                /* Assign unique colors to each character section */
                .character-info .info-section:nth-child(1) { /* Physical Description */
                    border-left-color: ${colors.physical || colors.journalAccent};
                }
                .character-info .info-section:nth-child(2) { /* Personality */
                    border-left-color: ${colors.personality || colors.linkColorSecondary};
                }
                .character-info .info-section:nth-child(3) { /* Sexuality */
                    border-left-color: ${colors.sexuality || colors.textSecondary};
                }
                .character-info .info-section:nth-child(4) { /* Fighting Style */
                    border-left-color: ${colors.fighting || colors.statusArchived};
                }
                .character-info .info-section:nth-child(5) { /* Background */
                    border-left-color: ${colors.background || colors.navActive};
                }
                .character-info .info-section:nth-child(6) { /* Equipment */
                    border-left-color: ${colors.weapons || colors.textMuted};
                }
                .character-info .info-section:nth-child(7) { /* Hobbies */
                    border-left-color: ${colors.hobbies || colors.concepts};
                }
                .character-info .info-section:nth-child(8) { /* Quirks */
                    border-left-color: ${colors.quirks || colors.creatures};
                }
                .character-info .info-section:nth-child(9) { /* Relationships */
                    border-left-color: ${colors.relationships || colors.events};
                }
                .character-info .info-section:nth-child(10) { /* Additional sections */
                    border-left-color: ${colors.items || colors.plants};
                }
            `;

        case 'wuxia':
            return `
                /* --- Wuxia Character Subcontainer Style: Elegant Profile Sections --- */
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: linear-gradient(135deg, 
                        ${colors.containerBg} 0%, 
                        ${colors.wuxiaGlow}60 100%);
                    padding: 20px 22px;
                    margin: 15px 0;
                    border-radius: 8px;
                    border: 1px solid ${colors.bannerBorder};
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 2px 12px rgba(0,0,0,0.04),
                        inset 0 1px 3px ${colors.containerBg}90;
                }

                /* Delicate mist pattern overlay */
                .character-info .info-section::before,
                .character-basic-info .info-section::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: url('images/styles/mist.png') center/cover no-repeat;
                    opacity: 0.06;
                    pointer-events: none;
                    z-index: 1;
                    background-blend-mode: soft-light;
                }

                /* Refined section titles */
                .character-info .info-section .info-title,
                .character-basic-info .info-section .info-title {
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid ${colors.wuxiaAccent}60;
                    padding: 0 0 10px 0 !important;
                    margin: 0 0 16px 0 !important;
                    position: relative;
                    z-index: 2;
                    font-weight: 600 !important;
                    text-transform: lowercase !important;
                    font-variant: small-caps !important;
                    letter-spacing: 1px;
                    font-size: 1.15em !important;
                    color: ${colors.textTitle || colors.textPrimary};
                }

                /* Elegant brush stroke accent after titles */
                .character-info .info-section .info-title::after,
                .character-basic-info .info-section .info-title::after {
                    content: "❋";
                    position: absolute;
                    top: 50%; right: 0;
                    transform: translateY(-50%);
                    color: ${colors.wuxiaAccent}50;
                    font-size: 16px;
                }

                /* Content positioning and styling */
                .character-info .info-section .info-content,
                .character-basic-info .info-section .info-content {
                    position: relative;
                    z-index: 2;
                    line-height: 1.8;
                    color: ${colors.textPrimary};
                }

                /* Assign unique colors to each character section */
                .character-info .info-section:nth-child(1) { /* Physical Description */
                    border-left: 3px solid ${colors.physical || colors.journalAccent};
                }
                .character-info .info-section:nth-child(2) { /* Personality */
                    border-left: 3px solid ${colors.personality || colors.linkColorSecondary};
                }
                .character-info .info-section:nth-child(3) { /* Sexuality */
                    border-left: 3px solid ${colors.sexuality || colors.textSecondary};
                }
                .character-info .info-section:nth-child(4) { /* Fighting Style */
                    border-left: 3px solid ${colors.fighting || colors.statusArchived};
                }
                .character-info .info-section:nth-child(5) { /* Background */
                    border-left: 3px solid ${colors.background || colors.navActive};
                }
                .character-info .info-section:nth-child(6) { /* Equipment */
                    border-left: 3px solid ${colors.weapons || colors.textMuted};
                }
                .character-info .info-section:nth-child(7) { /* Hobbies */
                    border-left: 3px solid ${colors.hobbies || colors.concepts};
                }
                .character-info .info-section:nth-child(8) { /* Quirks */
                    border-left: 3px solid ${colors.quirks || colors.creatures};
                }
                .character-info .info-section:nth-child(9) { /* Relationships */
                    border-left: 3px solid ${colors.relationships || colors.events};
                }
                .character-info .info-section:nth-child(10) { /* Additional sections */
                    border-left: 3px solid ${colors.items || colors.plants};
                }
            `;

        case 'playersHandbook':
            return `
                /* Player's Handbook - Character Modal Sections as Character Sheet Fields */
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: transparent;
                    padding: 15px 0 !important;
                    margin: 12px 0;
                    border: none;
                    border-left: 4px solid ${colors.journalAccent};
                    border-radius: 0 !important;
                    position: relative;
                    overflow: visible;
                    padding-left: 20px !important;
                }

                /* Character section colored borders */
                .character-basic-info .info-section {
                    border-left-color: ${colors.physical};
                }
                
                .character-info .info-section:nth-child(1) { /* Physical */
                    border-left-color: ${colors.physical};
                }
                .character-info .info-section:nth-child(2) { /* Personality */
                    border-left-color: ${colors.personality};
                }
                .character-info .info-section:nth-child(3) { /* Sexuality */
                    border-left-color: ${colors.sexuality};
                }
                .character-info .info-section:nth-child(4) { /* Fighting */
                    border-left-color: ${colors.fighting};
                }
                .character-info .info-section:nth-child(5) { /* Background */
                    border-left-color: ${colors.background};
                }
                .character-info .info-section:nth-child(6) { /* Equipment */
                    border-left-color: ${colors.weapons};
                }
                .character-info .info-section:nth-child(7) { /* Hobbies */
                    border-left-color: ${colors.hobbies};
                }
                .character-info .info-section:nth-child(8) { /* Quirks */
                    border-left-color: ${colors.quirks};
                }
                .character-info .info-section:nth-child(9) { /* Relationships */
                    border-left-color: ${colors.relationships};
                }
                .character-info .info-section:nth-child(10) { /* Additional */
                    border-left-color: ${colors.events};
                }

                /* Character sheet style titles */
                .character-info .info-section .info-title,
                .character-basic-info .info-section .info-title {
                    background: transparent;
                    color: ${colors.journalAccent};
                    border: none !important;
                    border-radius: 0 !important;
                    padding: 0 !important;
                    margin: 0 0 10px 0 !important;
                    position: relative;
                    z-index: 2;
                    font-weight: 600 !important;
                    text-transform: capitalize;
                    letter-spacing: 0.8px;
                    font-size: 1.2em !important;
                }

                /* Small character sheet icon */
                .character-info .info-section .info-title::before,
                .character-basic-info .info-section .info-title::before {
                    content: "◆";
                    position: absolute;
                    top: 50%; left: -15px;
                    transform: translateY(-50%);
                    color: ${colors.journalAccent};
                    font-size: 12px;
                }

                /* Subtle underline */
                .character-info .info-section .info-title::after,
                .character-basic-info .info-section .info-title::after {
                    content: '';
                    position: absolute;
                    bottom: -2px; left: 0;
                    width: 40%; height: 1px;
                    background: ${colors.journalAccent}40;
                }

                /* Content positioning for character sections */
                .character-info .info-section .info-content,
                .character-basic-info .info-section .info-content {
                    position: relative;
                    z-index: 2;
                    line-height: 1.7;
                    padding-left: 0;
                }
            `;

        case 'adventurersTome':
            return `
                /* --- Adventurer's Tome Character Subcontainers (Color-Coded Stitched Panels) --- */
                
                /* Base style for all character info panels */
                .character-info .info-section,
                .character-basic-info .info-section {
                    /* A slightly tinted background to lift it off the main page */
                    background: rgba(0,0,0,0.03);
                    
                    /* Spacing and Shape */
                    padding: 18px 22px;
                    margin: 15px 0;
                    border-radius: 6px; /* Soft leather corners */
                    
                    /* The "stitching" effect will be applied with color below */
                    border-top: 2px dashed;
                    border-right: 2px dashed;
                    border-bottom: 2px dashed;
                    
                    /* The "color tab" effect on the left */
                    border-left: 5px solid;
                    
                    /* A subtle inner shadow for a pressed-in look */
                    box-shadow: inset 0 0 8px rgba(0,0,0,0.1);
                }

                /* --- Assign unique border colors to each section --- */
                /* This colors both the "stitching" and the left "tab" at the same time. */
                
                .character-basic-info .info-section {
                    border-color: ${colors.physical};
                }
                
                .character-info .info-section:nth-child(1) { border-color: ${colors.physical}; }
                .character-info .info-section:nth-child(2) { border-color: ${colors.personality}; }
                .character-info .info-section:nth-child(3) { border-color: ${colors.sexuality}; }
                .character-info .info-section:nth-child(4) { border-color: ${colors.fighting}; }
                .character-info .info-section:nth-child(5) { border-color: ${colors.background}; }
                .character-info .info-section:nth-child(6) { border-color: ${colors.weapons}; }
                .character-info .info-section:nth-child(7) { border-color: ${colors.hobbies}; }
                .character-info .info-section:nth-child(8) { border-color: ${colors.quirks}; }
                .character-info .info-section:nth-child(9) { border-color: ${colors.relationships}; }
                .character-info .info-section:nth-child(10) { border-color: ${colors.events}; }
            `;

        case 'horrific':
            return `
                /* Horrific - Character Modal Sections as Dark Manuscripts */
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: linear-gradient(135deg, 
                        ${colors.headerBg} 0%, 
                        ${colors.journalAccent}15 50%, 
                        ${colors.headerBg} 100%);
                    padding: 20px 22px !important;
                    margin: 18px 0;
                    border: 1px solid ${colors.headerBg};
                    border-radius: 0 !important;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 3px 15px rgba(0,0,0,0.5),
                        inset 0 1px 3px ${colors.journalAccent}20;
                }

                /* Ancient parchment texture for character sections */
                .character-info .info-section::before,
                .character-basic-info .info-section::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 40px,
                            ${colors.journalAccent}04 40px,
                            ${colors.journalAccent}04 42px
                        ),
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 18px,
                            rgba(0,0,0,0.02) 18px,
                            rgba(0,0,0,0.02) 19px
                        );
                    pointer-events: none;
                    z-index: 1;
                }

                /* Character section titles with blood seal effect */
                .character-info .info-section .info-title,
                .character-basic-info .info-section .info-title {
                    background: linear-gradient(135deg, 
                        ${colors.journalAccent}30 0%, 
                        ${colors.journalAccent}15 100%);
                    border: 1px solid ${colors.journalAccent}66;
                    border-radius: 0 !important;
                    padding: 10px 18px !important;
                    margin: -20px -22px 18px -22px !important;
                    position: relative;
                    z-index: 2;
                    font-weight: 600 !important;
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
                    font-size: 1.1em !important;
                }

                /* Wax seal effect on character titles */
                .character-info .info-section .info-title::before,
                .character-basic-info .info-section .info-title::before {
                    content: "◉";
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    color: ${colors.journalAccent}99;
                    font-size: 12px;
                    text-shadow: 0 0 6px ${colors.journalAccent}50;
                }

                /* Different colored left borders for each character section type */
                .character-basic-info .info-section {
                    border-left: 4px solid ${colors.physical || colors.journalAccent};
                }
                
                .character-info .info-section:nth-child(1) { /* Physical */
                    border-left: 4px solid ${colors.physical || colors.journalAccent};
                }
                .character-info .info-section:nth-child(2) { /* Personality */
                    border-left: 4px solid ${colors.personality || colors.textSecondary};
                }
                .character-info .info-section:nth-child(3) { /* Sexuality */
                    border-left: 4px solid ${colors.sexuality || colors.linkColor};
                }
                .character-info .info-section:nth-child(4) { /* Fighting */
                    border-left: 4px solid ${colors.fighting || colors.textMuted};
                }
                .character-info .info-section:nth-child(5) { /* Background */
                    border-left: 4px solid ${colors.background || colors.navActive};
                }
                .character-info .info-section:nth-child(6) { /* Equipment */
                    border-left: 4px solid ${colors.weapons || colors.headerBg};
                }
                .character-info .info-section:nth-child(7) { /* Hobbies */
                    border-left: 4px solid ${colors.hobbies || colors.concepts};
                }
                .character-info .info-section:nth-child(8) { /* Quirks */
                    border-left: 4px solid ${colors.quirks || colors.creatures};
                }
                .character-info .info-section:nth-child(9) { /* Relationships */
                    border-left: 4px solid ${colors.relationships || colors.events};
                }
                .character-info .info-section:nth-child(10) { /* Additional */
                    border-left: 4px solid ${colors.items || colors.plants};
                }

                /* Content positioning for all character sections */
                .character-info .info-section .info-content,
                .character-basic-info .info-section .info-content {
                    position: relative;
                    z-index: 2;
                    line-height: 1.7;
                }
            `;

        case 'parchment':
            return `
                /* Parchment&Quill - Character Modal Sections as Personal Letters */
                .character-info .info-section,
                .character-basic-info .info-section {
                    background: linear-gradient(135deg, 
                        #fefcf8 0%, 
                        #f8f5f0 30%, 
                        #faf7f2 70%, 
                        #f5f2ed 100%);
                    padding: 20px 22px !important;
                    margin: 18px 0;
                    border: 1px solid rgba(139,69,19,0.15);
                    border-radius: 8px !important;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 2px 10px rgba(139,69,19,0.06),
                        inset 0 1px 3px rgba(255,255,255,0.8);
                }

                /* Elegant parchment texture for character sections */
                .character-info .info-section::before,
                .character-basic-info .info-section::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: 
                        /* Fine paper texture */
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 15px,
                            rgba(139,69,19,0.01) 15px,
                            rgba(139,69,19,0.01) 16px
                        ),
                        /* Watermark flourish in corner */
                        radial-gradient(circle at 90% 10%, 
                            rgba(245,245,220,0.15) 0%, 
                            transparent 25%);
                    pointer-events: none;
                    z-index: 1;
                }

                /* Character section titles with ink pen styling */
                .character-info .info-section .info-title,
                .character-basic-info .info-section .info-title {
                    background: linear-gradient(135deg, 
                        rgba(245,245,220,0.3) 0%, 
                        rgba(250,240,230,0.2) 100%);
                    border: none;
                    border-bottom: 2px solid rgba(139,69,19,0.2);
                    border-radius: 0 !important;
                    padding: 12px 18px 10px !important;
                    margin: -20px -22px 18px -22px !important;
                    position: relative;
                    z-index: 2;
                    font-weight: 500 !important;
                    text-transform: lowercase !important;
                    font-variant: small-caps !important;
                    letter-spacing: 1px;
                    font-size: 1.2em !important;
                    color: ${colors.textTitle || colors.textPrimary};
                }

                /* Elegant ink stroke decoration */
                .character-info .info-section .info-title::before,
                .character-basic-info .info-section .info-title::before {
                    content: "";
                    position: absolute;
                    top: 50%; left: -2px;
                    transform: translateY(-50%);
                    width: 3px; height: 60%;
                    background: linear-gradient(to bottom, 
                        transparent 0%, 
                        rgba(139,69,19,0.3) 30%, 
                        rgba(139,69,19,0.5) 50%, 
                        rgba(139,69,19,0.3) 70%, 
                        transparent 100%);
                    border-radius: 2px;
                }

                /* Quill pen flourish after each title */
                .character-info .info-section .info-title::after,
                .character-basic-info .info-section .info-title::after {
                    content: "✒";
                    position: absolute;
                    top: 50%; right: 15px;
                    transform: translateY(-50%);
                    color: rgba(139,69,19,0.3);
                    font-size: 16px;
                }

                /* Different colored left accents for each character section */
                .character-basic-info .info-section {
                    border-left: 3px solid ${colors.physical || colors.concepts};
                }
                
                .character-info .info-section:nth-child(1) { /* Physical */
                    border-left: 3px solid ${colors.physical || '#d4a574'};
                }
                .character-info .info-section:nth-child(2) { /* Personality */
                    border-left: 3px solid ${colors.personality || '#c7a882'};
                }
                .character-info .info-section:nth-child(3) { /* Sexuality */
                    border-left: 3px solid ${colors.sexuality || '#d2a075'};
                }
                .character-info .info-section:nth-child(4) { /* Fighting */
                    border-left: 3px solid ${colors.fighting || '#ba9d7a'};
                }
                .character-info .info-section:nth-child(5) { /* Background */
                    border-left: 3px solid ${colors.background || '#c5a678'};
                }
                .character-info .info-section:nth-child(6) { /* Equipment */
                    border-left: 3px solid ${colors.weapons || '#ad9b7c'};
                }
                .character-info .info-section:nth-child(7) { /* Hobbies */
                    border-left: 3px solid ${colors.hobbies || '#d1a373'};
                }
                .character-info .info-section:nth-child(8) { /* Quirks */
                    border-left: 3px solid ${colors.quirks || '#b8a079'};
                }
                .character-info .info-section:nth-child(9) { /* Relationships */
                    border-left: 3px solid ${colors.relationships || '#cfa476'};
                }
                .character-info .info-section:nth-child(10) { /* Additional */
                    border-left: 3px solid ${colors.events || '#bb9e7b'};
                }

                /* Content positioning for readability */
                .character-info .info-section .info-content,
                .character-basic-info .info-section .info-content {
                    position: relative;
                    z-index: 2;
                    line-height: 1.7;
                }`;
    }
}

// Make globally available
export { generateCharacterSubcontainerStyles, generateContainerStyles, generateSubcontainerStyles, containerStyles, subcontainerStyles };
