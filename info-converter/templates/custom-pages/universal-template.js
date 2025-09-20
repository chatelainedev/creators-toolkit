import { generateHorizontalNavigationStyles } from './custom-navigation-styles.js';
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

        /* Horizontal Links Styles */
        ${generateHorizontalNavigationStyles(colors, fonts)}
        
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