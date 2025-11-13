// Helper function to resolve custom page image paths
function resolveCustomPageImagePath(imagePath, pageId) {
    if (!imagePath || !imagePath.trim()) return imagePath;
    
    const trimmedPath = imagePath.trim();
    
    // External URLs - use as-is
    if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
        return trimmedPath;
    }
    
    // Already full project paths - use as-is
    if (trimmedPath.startsWith('assets/') || trimmedPath.startsWith('pages/')) {
        return trimmedPath;
    }
    
    // Simple paths - resolve to current page folder
    if (pageId) {
        // Remove leading slash if present
        const cleanPath = trimmedPath.startsWith('/') ? trimmedPath.substring(1) : trimmedPath;
        return `pages/${pageId}/${cleanPath}`;
    }
    
    // Fallback - use as-is
    return trimmedPath;
}

// Helper function to generate CSS for ONLY the selected horizontal navigation style
function generateSelectedHorizontalNavigationStyle(style, colors, fonts) {
    // Base container styles (always needed)
    let css = `
        /* Horizontal Links Container Styles */
        .horizontal-links-container {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-md, 16px);
            margin: var(--space-xl, 24px) 0;
        }

        .horizontal-links-container.center-aligned {
            justify-content: center;
        }

        .horizontal-links-container.left-aligned {
            justify-content: flex-start;
        }

        .horizontal-links-container.right-aligned {
            justify-content: flex-end;
        }

        .horizontal-links-container.centered-spacing {
            gap: var(--space-md, 16px);
        }

        .horizontal-links-container.tight-spacing {
            gap: var(--space-sm, 8px);
        }

        .horizontal-links-container.loose-spacing {
            gap: var(--space-lg, 20px);
        }
    `;

    // Generate ONLY the selected style's CSS
    switch(style) {
        case 'modern':
            css += `
        /* Modern Style - Flat with underlines */
        .horizontal-links-container.modern-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: ${colors.textPrimary};
            text-decoration: none;
            text-transform: uppercase;
            font-weight: 500;
            font-size: 14px;
            transition: border-color 0.2s ease;
            font-family: ${fonts.primary};
        }

        .horizontal-links-container.modern-nav .horizontal-nav-btn:hover {
            border-bottom-color: ${colors.concepts};
        }`;
            break;

        case 'classic':
            css += `
        /* Classic Style - Bordered */
        .horizontal-links-container.classic-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: ${colors.headerBg};
            border: 1px solid ${colors.borderPrimary};
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.primary};
            transition: background-color 0.2s ease;
        }

        .horizontal-links-container.classic-nav .horizontal-nav-btn:hover {
            background: ${colors.bgSecondary};
        }`;
            break;

        case 'pills':
            css += `
        /* Pills Style - Rounded */
        .horizontal-links-container.pills-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: ${colors.headerBg};
            border: 1px solid ${colors.borderPrimary};
            border-radius: 25px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.pills-nav .horizontal-nav-btn:hover {
            background: ${colors.textSecondary};
            color: ${colors.containerBg};
        }`;
            break;

        case 'underline':
            css += `
        /* Underline Style - Minimal */
        .horizontal-links-container.underline-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.underline-nav .horizontal-nav-btn:hover {
            color: ${colors.textPrimary};
            border-bottom-color: ${colors.textSecondary};
        }`;
            break;

        case 'kawaii':
            css += `
        /* Kawaii Style - Cute pastels */
        .horizontal-links-container.kawaii-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(135deg, ${colors.containerBg}ee 0%, ${colors.headerBg}dd 100%);
            border: 2px solid ${colors.textMuted}33;
            border-radius: 25px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            text-transform: lowercase;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 4px 12px ${colors.textMuted}22;
            position: relative;
        }

        .horizontal-links-container.kawaii-nav .horizontal-nav-btn::before {
            content: '✦';
            position: absolute;
            top: -8px; right: -5px;
            color: ${colors.textMuted}66;
            font-size: 12px;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.kawaii-nav .horizontal-nav-btn:hover {
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.concepts}44 100%);
            color: ${colors.textPrimary};
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 20px ${colors.textMuted}44;
        }

        .horizontal-links-container.kawaii-nav .horizontal-nav-btn:hover::before {
            opacity: 1;
            color: ${colors.concepts};
        }`;
            break;

        case 'hearts':
            css += `
        /* Hearts Style - Cute heart theme */
        .horizontal-links-container.hearts-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px 12px;
            background: linear-gradient(45deg, ${colors.containerBg} 0%, ${colors.headerBg}88 100%);
            border: 1px solid ${colors.textMuted}44;
            border-radius: 15px 15px 8px 8px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            text-transform: lowercase;
            transition: all 0.2s ease;
            position: relative;
        }

        .horizontal-links-container.hearts-nav .horizontal-nav-btn::after {
            content: '♡';
            position: absolute;
            top: -2px;
            right: 8px;
            color: ${colors.textMuted}55;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.hearts-nav .horizontal-nav-btn:hover {
            background: linear-gradient(45deg, ${colors.containerBg} 0%, ${colors.factions}33 100%);
            color: ${colors.textPrimary};
            border-color: ${colors.factions}66;
        }

        .horizontal-links-container.hearts-nav .horizontal-nav-btn:hover::after {
            content: '♥';
            color: ${colors.factions};
            transform: scale(1.2);
        }`;
            break;

        case 'industrial':
            css += `
        /* Industrial Style - Angular */
        .horizontal-links-container.industrial-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: ${colors.headerBg};
            border: 1px solid ${colors.borderPrimary};
            border-left: 4px solid ${colors.journalAccent};
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.accent};
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.2s ease;
            clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%);
        }

        .horizontal-links-container.industrial-nav .horizontal-nav-btn:hover {
            background: ${colors.journalAccent};
            color: ${colors.containerBg};
        }`;
            break;

        case 'playersHandbook':
            css += `
        /* Player's Handbook Style - Ornate */
        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 50%, ${colors.headerBg} 100%);
            border: 2px solid ${colors.textMuted}44;
            border-top-color: ${colors.journalAccent}33;
            border-radius: 8px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.secondary};
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px ${colors.textMuted}33, inset 0 1px 2px ${colors.containerBg}aa;
            position: relative;
        }

        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn::before {
            content: '◆';
            position: absolute;
            top: 2px; left: 8px;
            color: ${colors.journalAccent}66;
            font-size: 10px;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn::after {
            content: '◆';
            position: absolute;
            top: 2px; right: 8px;
            color: ${colors.journalAccent}66;
            font-size: 10px;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn:hover {
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.headerBg} 50%, ${colors.containerBg} 100%);
            border-top-color: ${colors.journalAccent}66;
            box-shadow: 0 4px 12px ${colors.textMuted}44, inset 0 1px 3px ${colors.containerBg}cc;
        }

        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn:hover::before,
        .horizontal-links-container.playersHandbook-nav .horizontal-nav-btn:hover::after {
            color: ${colors.journalAccent};
            transform: scale(1.1);
        }`;
            break;

        case 'horrific':
            css += `
        /* Horrific Style - Cursed grimoire */
        .horizontal-links-container.horrific-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 15px 25px;
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.containerBg} 100%);
            border: 1px solid ${colors.textMuted}66;
            border-top: 2px solid transparent;
            border-radius: 8px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.secondary};
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            transition: all 0.2s ease;
            position: relative;
        }

        .horizontal-links-container.horrific-nav .horizontal-nav-btn::after {
            content: "\\f06e";
            font-family: "Font Awesome 5 Free", "Font Awesome 6 Free", ${fonts.ui};
            font-weight: 900;
            position: absolute;
            top: 3px; right: 8px;
            color: ${colors.journalAccent};
            font-size: 12px;
            opacity: 0.8;
            text-shadow: 0 0 6px ${colors.journalAccent}66;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.horrific-nav .horizontal-nav-btn:hover {
            background: linear-gradient(135deg, ${colors.headerBg} 0%, ${colors.textMuted}44 100%);
            border-top-color: ${colors.journalAccent};
            text-shadow: 0 0 8px ${colors.journalAccent}77;
            box-shadow: 0 3px 12px rgba(0,0,0,0.4);
        }

        .horizontal-links-container.horrific-nav .horizontal-nav-btn:hover::after {
            opacity: 1;
            color: ${colors.journalAccent};
            text-shadow: 0 0 10px ${colors.journalAccent}88;
        }`;
            break;

        case 'parchment':
            css += `
        /* Parchment & Quill Style - Elegant */
        .horizontal-links-container.parchment-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.bodyBg} 50%, ${colors.headerBg} 100%);
            border: 1px solid ${colors.textMuted}44;
            border-radius: 12px;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 400;
            letter-spacing: 0.8px;
            text-transform: lowercase;
            font-variant: small-caps;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px ${colors.textMuted}22, inset 0 1px 2px ${colors.containerBg}dd;
            position: relative;
        }

        .horizontal-links-container.parchment-nav .horizontal-nav-btn::after {
            content: '';
            position: absolute;
            top: 0; left: 30%;
            width: 40%; height: 2px;
            background: linear-gradient(90deg, transparent 0%, ${colors.textMuted}33 50%, transparent 100%);
        }

        .horizontal-links-container.parchment-nav .horizontal-nav-btn:hover {
            background: linear-gradient(135deg, ${colors.containerBg} 0%, ${colors.containerBg}ee 50%, ${colors.bodyBg} 100%);
            color: ${colors.textPrimary};
            box-shadow: 0 6px 16px ${colors.textMuted}44, 0 4px 15px rgba(139,69,19,0.12), inset 0 1px 3px ${colors.containerBg}ee;
            border-color: ${colors.textMuted}66;
        }

        .horizontal-links-container.parchment-nav .horizontal-nav-btn:hover::after {
            background: linear-gradient(90deg, transparent 0%, ${colors.textMuted}55 50%, transparent 100%);
            height: 3px;
        }`;
            break;

        case 'floating':
            css += `
        /* Floating Style - Modern elevated buttons */
        .horizontal-links-container.floating-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: ${colors.containerBg};
            border: none;
            border-radius: 8px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px ${colors.textMuted}33;
            transform: translateY(0);
        }

        .horizontal-links-container.floating-nav .horizontal-nav-btn:hover {
            background: ${colors.headerBg};
            transform: translateY(-2px);
            box-shadow: 0 8px 24px ${colors.textMuted}44;
        }`;
            break;

        case 'neon':
            css += `
        /* Neon Style - Cyberpunk glowing buttons */
        .horizontal-links-container.neon-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: transparent;
            border: 2px solid ${colors.concepts};
            border-radius: 4px;
            color: ${colors.concepts};
            text-decoration: none;
            font-family: ${fonts.accent};
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px ${colors.concepts}44;
        }

        .horizontal-links-container.neon-nav .horizontal-nav-btn:hover {
            background: ${colors.concepts};
            color: ${colors.containerBg};
            box-shadow: 0 0 20px ${colors.concepts}88, inset 0 0 20px ${colors.concepts}44;
            text-shadow: 0 0 5px ${colors.containerBg};
        }`;
            break;

        case 'vintage':
            css += `
        /* Vintage Style - Classic typewriter aesthetic */
        .horizontal-links-container.vintage-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: ${colors.containerBg};
            border: 3px solid ${colors.textPrimary};
            border-radius: 0;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.secondary};
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.2s ease;
            position: relative;
        }

        .horizontal-links-container.vintage-nav .horizontal-nav-btn::before {
            content: '';
            position: absolute;
            top: 3px; left: 3px; right: -3px; bottom: -3px;
            background: ${colors.textPrimary};
            z-index: -1;
            transition: all 0.2s ease;
        }

        .horizontal-links-container.vintage-nav .horizontal-nav-btn:hover {
            color: ${colors.containerBg};
        }

        .horizontal-links-container.vintage-nav .horizontal-nav-btn:hover::before {
            top: 0; left: 0; right: 0; bottom: 0;
        }`;
            break;

        case 'glass':
            css += `
        /* Glassmorphism Style - Modern glass effect */
        .horizontal-links-container.glass-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: ${colors.containerBg}aa;
            backdrop-filter: blur(10px);
            border: 1px solid ${colors.textMuted}33;
            border-radius: 16px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 8px 32px ${colors.textMuted}22;
        }

        .horizontal-links-container.glass-nav .horizontal-nav-btn:hover {
            background: ${colors.headerBg}cc;
            border-color: ${colors.textMuted}55;
            transform: translateY(-1px);
            box-shadow: 0 12px 40px ${colors.textMuted}33;
        }`;
            break;

        case 'steampunk':
            css += `
        /* Steampunk Style - Victorian industrial */
        .horizontal-links-container.steampunk-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(145deg, ${colors.headerBg} 0%, ${colors.containerBg} 50%, ${colors.headerBg} 100%);
            border: 2px solid ${colors.textMuted}66;
            border-radius: 0 12px 0 12px;
            color: ${colors.textPrimary};
            text-decoration: none;
            font-family: ${fonts.secondary};
            font-weight: 500;
            text-transform: capitalize;
            transition: all 0.2s ease;
            box-shadow: inset 2px 2px 4px ${colors.containerBg}aa, inset -2px -2px 4px ${colors.textMuted}44;
            position: relative;
        }

        .horizontal-links-container.steampunk-nav .horizontal-nav-btn::after {
            content: '⚙';
            position: absolute;
            top: -4px; right: -4px;
            color: ${colors.textMuted}77;
            font-size: 12px;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.steampunk-nav .horizontal-nav-btn:hover {
            background: linear-gradient(145deg, ${colors.containerBg} 0%, ${colors.headerBg} 50%, ${colors.containerBg} 100%);
            box-shadow: inset -2px -2px 4px ${colors.containerBg}aa, inset 2px 2px 4px ${colors.textMuted}44;
        }

        .horizontal-links-container.steampunk-nav .horizontal-nav-btn:hover::after {
            color: ${colors.textSecondary};
            transform: rotate(90deg);
        }`;
            break;

        case 'line':
            css += `
        /* Minimalist Line Style - Ultra clean */
        .horizontal-links-container.line-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: transparent;
            border: none;
            border-bottom: 1px solid transparent;
            color: ${colors.textSecondary};
            text-decoration: none;
            font-family: ${fonts.primary};
            font-weight: 400;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .horizontal-links-container.line-nav .horizontal-nav-btn:hover {
            color: ${colors.textPrimary};
            border-bottom-color: ${colors.textPrimary};
        }`;
            break;

        case 'brutalist':
            css += `
        /* Brutalist Style - Bold and geometric */
        .horizontal-links-container.brutalist-nav .horizontal-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 16px 24px;
            background: ${colors.textPrimary};
            border: none;
            border-radius: 0;
            color: ${colors.containerBg};
            text-decoration: none;
            font-family: ${fonts.accent};
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.1s ease;
            box-shadow: 4px 4px 0px ${colors.textMuted};
        }

        .horizontal-links-container.brutalist-nav .horizontal-nav-btn:hover {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px ${colors.textMuted};
        }`;
            break;

        default:
            // If no valid style or 'rounded' (which doesn't have horizontal nav styling)
            // Just include the base container styles (already added above)
            break;
    }

    return css;
}

// Universal Template - All element types in one flexible template
const universalTemplate = {
    id: 'universal',
    name: 'Universal Template',
    description: 'Flexible template supporting all element types - mix and match as needed',
    layoutType: 'universal',
    maxElements: 25,
    availableElements: [
        { 
            type: 'title', 
            max: 1, 
            name: 'Page Title',
            description: 'Main heading for the page'
        },
        { 
            type: 'single-image', 
            max: -1, 
            name: 'Single Image',
            description: 'Individual image with alignment options'
        },
        { 
            type: 'image-set', 
            max: -1, 
            name: 'Image Set',
            description: 'Up to 3 images displayed horizontally'
        },
        { 
            type: 'image-text-right', 
            max: -1, 
            name: 'Image/Text (Right)',
            description: 'Image on right, text on left'
        },
        { 
            type: 'image-text-left', 
            max: -1, 
            name: 'Image/Text (Left)',
            description: 'Image on left, text on right'
        },
        { 
            type: 'gallery', 
            max: -1, 
            name: 'Image Gallery',
            description: 'Grid of images with configurable columns and click-to-expand'
        },
        { 
            type: 'paragraph', 
            max: -1, 
            name: 'Paragraph',
            description: 'Text content with markdown support'
        },
        { 
            type: 'two-column-paragraph', 
            max: -1, 
            name: 'Two-Column Paragraph',
            description: 'Text content in two side-by-side columns with markdown support'
        },
        { 
            type: 'subcontainer', 
            max: -1, 
            name: 'Subcontainer',
            description: 'Styled text block with subcontainer formatting'
        },
        { 
            type: 'horizontal-links', 
            max: -1, 
            name: 'Horizontal Link Container',
            description: 'Up to 5 links in a horizontal row that match your navigation style'
        }
    ],
    
    // Generate HTML for this template
    generateHTML: function(page, data) {
        if (!page.elements || page.elements.length === 0) {
            return `<div id="${page.name}" class="custom-page-content universal-template">
                        <p>No content added yet.</p>
                    </div>`;
        }

        let html = `<div id="${page.name}" class="custom-page-content universal-template">`;
        
        // Sort elements by order
        const sortedElements = [...page.elements].sort((a, b) => a.order - b.order);
        
        sortedElements.forEach(element => {
            switch(element.type) {
                case 'title':
                    if (element.content && element.content.trim()) {
                        html += `<h2 class="section-title">${escapeHtml(element.content)}</h2>`;
                    }
                    break;
                    
                case 'single-image':
                    if (element.image && element.image.trim()) {
                        const alignment = element.alignment || 'center';
                        html += `<div class="single-image-container ${alignment}-aligned">`;
                        html += `<img src="${element.image}" alt="Custom page image" class="single-image">`;
                        html += `</div>`;
                    }
                    break;
                    
                case 'image-set':
                    if (element.images && element.images.length > 0) {
                        const validImages = element.images.filter(img => img && img.trim());
                        if (validImages.length > 0) {
                            html += `<div class="custom-image-set">`;
                            validImages.slice(0, 3).forEach(img => {
                                html += `<img src="${img}" alt="Custom page image" class="custom-image">`;
                            });
                            html += `</div>`;
                        }
                    }
                    break;

                case 'gallery':
                    if (element.images && element.images.length > 0) {
                        const validImages = element.images.filter(img => img && img.trim());
                        if (validImages.length > 0) {
                            const columns = element.columns || 5;
                            const alignment = element.alignment || 'center';
                            html += `<div class="custom-gallery ${alignment}-aligned" data-columns="${columns}" data-element-id="${element.id}">`;
                            
                            // Resolve image paths for this page
                            const resolvedImages = validImages.map(img => resolveCustomPageImagePath(img, page.id));
                            
                            resolvedImages.forEach((img, index) => {
                                html += `<img src="${img}" alt="Gallery image" class="custom-gallery-image" onclick="openCustomPageGalleryImage('${element.id}', ${index})">`;
                            });
                            html += `</div>`;
                            
                            // Also store resolved images for the gallery modal functionality
                            html += `<script>
                                if (typeof registerCustomPageGallery === 'function') {
                                    registerCustomPageGallery('${element.id}', ${JSON.stringify(resolvedImages)});
                                }
                            </script>`;
                        }
                    }
                    break;
                    
                case 'image-text-right':
                    if (element.content || (element.image && element.image.trim())) {
                        html += `<div class="image-text-pair right-aligned">`;
                        if (element.content && element.content.trim()) {
                            const htmlContent = processCustomTags(markdownToHtml(element.content));
                            const bgStyle = element.backgroundColor && element.backgroundColor.trim() ? 
                                ` style="background-color: ${element.backgroundColor}; padding: var(--space-md, 16px); border-radius: var(--radius-md, 8px);"` : '';
                            html += `<div class="pair-text"${bgStyle}>${htmlContent}</div>`;
                        }
                        if (element.image && element.image.trim()) {
                            html += `<div class="pair-image">
                                        <img src="${element.image}" alt="Custom page image" class="custom-image">
                                     </div>`;
                        }
                        html += `</div>`;
                    }
                    break;
                    
                case 'image-text-left':
                    if (element.content || (element.image && element.image.trim())) {
                        html += `<div class="image-text-pair left-aligned">`;
                        if (element.content && element.content.trim()) {
                            const htmlContent = processCustomTags(markdownToHtml(element.content));
                            const bgStyle = element.backgroundColor && element.backgroundColor.trim() ? 
                                ` style="background-color: ${element.backgroundColor}; padding: var(--space-md, 16px); border-radius: var(--radius-md, 8px);"` : '';
                            html += `<div class="pair-text"${bgStyle}>${htmlContent}</div>`;
                        }
                        if (element.image && element.image.trim()) {
                            html += `<div class="pair-image">
                                        <img src="${element.image}" alt="Custom page image" class="custom-image">
                                     </div>`;
                        }
                        html += `</div>`;
                    }
                    break;
                    
                case 'paragraph':
                    if (element.content && element.content.trim()) {
                        const htmlContent = processCustomTags(element.content);
                        const bgStyle = element.backgroundColor && element.backgroundColor.trim() ? 
                            ` style="background-color: ${element.backgroundColor}; padding: var(--space-md, 16px); border-radius: var(--radius-md, 8px);"` : '';
                        html += `<div class="custom-paragraph"${bgStyle}>${htmlContent}</div>`;
                    }
                    break;

                case 'two-column-paragraph':
                    if ((element.leftContent && element.leftContent.trim()) || (element.rightContent && element.rightContent.trim())) {
                        const bgStyle = element.backgroundColor && element.backgroundColor.trim() ? 
                            ` style="background-color: ${element.backgroundColor}; padding: var(--space-lg, 20px); border-radius: var(--radius-md, 8px);"` : '';
                        html += `<div class="two-column-paragraph"${bgStyle}>`;
                        html += `<div class="column-left">`;
                        if (element.leftContent && element.leftContent.trim()) {
                            const leftHtml = processCustomTags(element.leftContent);
                            html += leftHtml;
                        }
                        html += `</div>`;
                        html += `<div class="column-right">`;
                        if (element.rightContent && element.rightContent.trim()) {
                            const rightHtml = processCustomTags(element.rightContent);
                            html += rightHtml;
                        }
                        html += `</div>`;
                        html += `</div>`;
                    }
                    break;
                    
                case 'subcontainer':
                    if (element.content && element.content.trim()) {
                        const htmlContent = processCustomTags(element.content);
                        html += `<div class="info-section">${htmlContent}</div>`;
                    }
                    break;

                case 'horizontal-links':
                    if (element.links && element.links.length > 0) {
                        const validLinks = element.links.filter(link => 
                            (link.text && link.text.trim()) || link.icon || (link.url && link.url.trim())
                        );
                        if (validLinks.length > 0) {
                            const alignment = element.alignment || 'center';
                            const spacing = element.spacing || 'centered';
                            const style = element.style || 'modern';
                            html += `<div class="horizontal-links-container ${style}-nav ${alignment}-aligned ${spacing}-spacing">`;
                            validLinks.forEach(link => {
                                const linkText = link.text && link.text.trim() ? link.text : '';
                                const iconHTML = link.icon ? `<i class="fas fa-${link.icon}"></i>` : '';
                                const content = linkText ? `${iconHTML}${linkText}` : iconHTML;
                                html += `<a href="${link.url}" class="horizontal-nav-btn">${content}</a>`;
                            });
                            html += `</div>`;
                        }
                    }
                    break;
            }
        });

        html += `
            <button id="custom-page-back-to-top-${page.name}" class="back-to-top-btn" title="Back to top"></button>
        `;
        
        html += `</div>`;

        // Add JavaScript for gallery functionality at the end of the HTML
        html += `
        <script>
        // Gallery functionality for custom pages
        let customPageGalleries = {};

        function registerCustomPageGallery(elementId, images) {
            customPageGalleries[elementId] = images;
        }

        function openCustomPageGalleryImage(elementId, imageIndex) {
            const images = customPageGalleries[elementId];
            if (!images || !images[imageIndex]) {
                console.error('Gallery image not found:', elementId, imageIndex);
                return;
            }
            
            // Use the existing image modal system
            if (typeof openImageModal === 'function') {
                openImageModal(images[imageIndex], 'Gallery Image ' + (imageIndex + 1), images, imageIndex);
            }
        }

        function initializeCustomPageGalleries() {
            document.querySelectorAll('.custom-gallery').forEach(function(gallery) {
                const elementId = gallery.getAttribute('data-element-id');
                const images = Array.from(gallery.querySelectorAll('.custom-gallery-image')).map(function(img) { return img.src; });
                
                if (elementId && images.length > 0) {
                    registerCustomPageGallery(elementId, images);
                }
            });
        }

        // Initialize galleries when page loads
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.custom-gallery').forEach(function(gallery) {
                const elementId = gallery.getAttribute('data-element-id');
                const images = Array.from(gallery.querySelectorAll('.custom-gallery-image')).map(function(img) { return img.src; });
                
                if (elementId && images.length > 0) {
                    registerCustomPageGallery(elementId, images);
                }
            });
        });
        </script>`;
        return html;
    },
    
    // Generate CSS for this template
    generateCSS: function(appearance, colors, fonts) {
        // Get the selected custom navigation button style from appearance settings
        const customNavStyle = appearance.customNavButtonStyle || 'rounded';
        
        return `
        /* Universal Template Styles */
        .custom-page-content.universal-template {
            max-width: 900px;
            margin: 0 auto;
            padding: var(--space-xl, 24px);
        }
        
        /* Single Image Styles */
        .single-image-container {
            margin: var(--space-xl, 24px) 0;
        }
        
        .single-image-container.center-aligned {
            text-align: center;
        }
        
        .single-image-container.left-aligned {
            text-align: left;
        }
        
        .single-image-container.right-aligned {
            text-align: right;
        }
        
        .single-image {
            max-width: 100%;
            max-height: 500px;
            height: auto;
            object-fit: contain;
            border-radius: var(--radius-md, 8px);
            box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1));
        }
        
        /* Image Set Styles */
        .custom-image-set {
            display: flex;
            gap: var(--space-md, 16px);
            justify-content: center;
            margin: var(--space-xl, 24px) 0;
            flex-wrap: wrap;
        }
        
        .custom-image {
            max-width: 300px;
            max-height: 300px;
            object-fit: cover;
            border-radius: var(--radius-md, 8px);
            box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1));
        }

        /* Custom Gallery Styles */
        .custom-gallery {
            display: grid;
            gap: var(--space-md, 16px);
            margin: var(--space-xl, 24px) 0;
            grid-template-columns: repeat(5, 1fr); /* default */
        }

        .custom-gallery[data-columns="3"] {
            grid-template-columns: repeat(3, 1fr);
        }

        .custom-gallery[data-columns="4"] {
            grid-template-columns: repeat(4, 1fr);
        }

        .custom-gallery[data-columns="5"] {
            grid-template-columns: repeat(5, 1fr);
        }

        .custom-gallery[data-columns="6"] {
            grid-template-columns: repeat(6, 1fr);
        }

        .custom-gallery.center-aligned {
            justify-items: center;
        }

        .custom-gallery.left-aligned {
            justify-items: start;
        }

        .custom-gallery.right-aligned {
            justify-items: end;
        }

        .custom-gallery-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: var(--radius-md, 8px);
            box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1));
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .custom-gallery-image:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg, 0 8px 16px rgba(0,0,0,0.15));
        }

        /* Responsive gallery */
        @media (max-width: 768px) {
            .custom-gallery[data-columns="5"],
            .custom-gallery[data-columns="6"] {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .custom-gallery[data-columns="4"] {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 480px) {
            .custom-gallery {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }
        
        /* Image-Text Pair Styles */
        .image-text-pair {
            display: flex;
            gap: var(--space-xl, 24px);
            align-items: flex-start;
            margin: var(--space-xl, 24px) 0;
        }
        
        .image-text-pair.right-aligned {
            flex-direction: row;
        }
        
        .image-text-pair.left-aligned {
            flex-direction: row;
        }
        
        .pair-text {
            flex: 2;
            font-family: ${fonts.primary};
            font-size: var(--font-size-base, 16px);
            line-height: 1.6;
            color: ${colors.textPrimary};
        }
        
        .pair-image {
            flex: 1;
            min-width: 200px;
        }
        
        .pair-image .custom-image {
            width: 100%;
            max-width: 300px;
            height: auto;
            object-fit: cover;
        }
        
        /* Paragraph Styles */
        .custom-paragraph {
            font-family: ${fonts.primary};
            font-size: var(--font-size-base, 16px);
            line-height: 1.6;
            color: ${colors.textPrimary};
            margin: var(--space-lg, 20px) 0;
        }

        /* Two-Column Paragraph Styles */
        .two-column-paragraph {
            display: flex;
            gap: var(--space-xl, 24px);
            margin: var(--space-lg, 20px) 0;
            font-family: ${fonts.primary};
            font-size: var(--font-size-base, 16px);
            line-height: 1.6;
            color: ${colors.textPrimary};
        }

        .two-column-paragraph .column-left,
        .two-column-paragraph .column-right {
            flex: 1;
        }

        .two-column-paragraph p:first-child {
            margin-top: 0;
        }

        .two-column-paragraph p:last-child {
            margin-bottom: 0;
        }

        /* Responsive: stack columns on mobile */
        @media (max-width: 768px) {
            .two-column-paragraph {
                flex-direction: column;
                gap: var(--space-lg, 20px);
            }
        }
        
        /* Subcontainer Styles */
        .custom-subcontainer {
            background-color: ${colors.subcontainerBg || colors.bgSecondary};
            border: 1px solid ${colors.borderPrimary};
            border-radius: var(--radius-md, 8px);
            padding: var(--space-lg, 20px);
            margin: var(--space-lg, 20px) 0;
            font-family: ${fonts.primary};
            font-size: var(--font-size-base, 16px);
            line-height: 1.6;
            color: ${colors.textPrimary};
        }

        /* Horizontal Links Styles - ONLY the selected style */
        ${generateSelectedHorizontalNavigationStyle(customNavStyle, colors, fonts)}
        
        /* Common Text Styles */
        .custom-paragraph p:first-child,
        .custom-subcontainer p:first-child,
        .pair-text p:first-child {
            margin-top: 0;
        }
        
        .custom-paragraph p:last-child,
        .custom-subcontainer p:last-child,
        .pair-text p:last-child {
            margin-bottom: 0;
        }
        
        /* Custom Tag Styles */
        .center-text {
            text-align: center;
        }
        
        .left-text {
            text-align: left;
        }
        
        .right-text {
            text-align: right;
        }
        
        .highlight-text {
            background-color: ${colors.highlightBg || '#ffff99'};
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        .small-text {
            font-size: 0.8em;
        }
        
        .big-text {
            font-size: 1.2em;
            font-weight: 600;
        }
        
        /* Responsive design for smaller screens */
        @media (max-width: 768px) {
            .image-text-pair {
                flex-direction: column !important;
                gap: var(--space-lg, 20px);
            }
            
            .pair-image {
                min-width: unset;
            }
            
            .pair-image .custom-image {
                max-width: 100%;
            }
            
            .custom-image-set {
                flex-direction: column;
                align-items: center;
            }
        }
        `;
    }
};

export { universalTemplate };