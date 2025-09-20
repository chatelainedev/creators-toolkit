// custom-page-utils.js - Shared utilities for Custom Page templates

// Helper function for basic markdown to HTML conversion
function markdownToHtml(markdown) {
    if (!markdown) return '';
    
    return markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\* (.+)$/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/^\d+\. (.+)$/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/---/g, '<hr>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/, '<p>$1</p>')
        .replace(/\n/g, '<br>');
}

// Process custom HTML-like tags for additional styling
function processCustomTags(content) {
    if (!content) return '';
    
    // Stage 1: Handle alignment tags that need their own markdown processing
    let html = content;
    
    // Process alignment tags - extract content, process markdown, then wrap
    html = html.replace(/<center>(.*?)<\/center>/gs, (match, innerContent) => {
        const processedContent = markdownToHtml(innerContent.trim());
        return `<div class="center-text">${processedContent}</div>`;
    });
    
    html = html.replace(/<left>(.*?)<\/left>/gs, (match, innerContent) => {
        const processedContent = markdownToHtml(innerContent.trim());
        return `<div class="left-text">${processedContent}</div>`;
    });
    
    html = html.replace(/<right>(.*?)<\/right>/gs, (match, innerContent) => {
        const processedContent = markdownToHtml(innerContent.trim());
        return `<div class="right-text">${processedContent}</div>`;
    });
    
    // Stage 2: Process remaining content through markdown
    html = markdownToHtml(html);
    
    // Stage 3: Handle inline tags that work on processed HTML
    html = html.replace(/<spoiler>(.*?)<\/spoiler>/gs, '<span class="spoiler" onclick="toggleSpoiler(this)">$1</span>');
    html = html.replace(/<highlight>(.*?)<\/highlight>/gs, '<span class="highlight-text">$1</span>');
    html = html.replace(/<small>(.*?)<\/small>/gs, '<span class="small-text">$1</span>');
    html = html.replace(/<big>(.*?)<\/big>/gs, '<span class="big-text">$1</span>');
    
    // Color tags
    html = html.replace(/<color=(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})>(.*?)<\/color>/gs, '<span style="color: $1;">$2</span>');
    html = html.replace(/<color=([a-zA-Z]+)>(.*?)<\/color>/gs, '<span style="color: $1;">$2</span>');
    
    return html;
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Custom Pages Gallery Functionality
// Handles click-to-expand functionality for gallery images

// Store gallery data for modal access
let customPageGalleries = {};

// Function to register gallery data when page loads
function registerCustomPageGallery(elementId, images) {
    customPageGalleries[elementId] = images;
}

// Function to open gallery image in modal
function openCustomPageGalleryImage(elementId, imageIndex) {
    const images = customPageGalleries[elementId];
    if (!images || !images[imageIndex]) {
        console.error('Gallery image not found:', elementId, imageIndex);
        return;
    }
    
    // Use the existing image modal system
    if (typeof openImageModal === 'function') {
        openImageModal(images[imageIndex], `Gallery Image ${imageIndex + 1}`, images, imageIndex);
    }
}

// Initialize galleries on page load
function initializeCustomPageGalleries() {
    document.querySelectorAll('.custom-gallery').forEach(gallery => {
        const elementId = gallery.getAttribute('data-element-id');
        const images = Array.from(gallery.querySelectorAll('.custom-gallery-image')).map(img => img.src);
        
        if (elementId && images.length > 0) {
            registerCustomPageGallery(elementId, images);
        }
    });
}

// Initialize color picker synchronization for custom page elements
function initializeCustomPageElementColorPickers() {
    // Paragraph element background color
    const paragraphColorText = document.getElementById('element-paragraph-bg-color');
    const paragraphColorPicker = document.getElementById('element-paragraph-bg-color-picker');
    
    if (paragraphColorText && paragraphColorPicker) {
        paragraphColorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && window.isValidHexColor(color)) {
                paragraphColorPicker.value = color;
            }
        });
        
        paragraphColorPicker.addEventListener('input', function() {
            paragraphColorText.value = this.value;
        });
    }
    
    // Two-column paragraph element background color
    const twocolumnColorText = document.getElementById('element-twocolumn-bg-color');
    const twocolumnColorPicker = document.getElementById('element-twocolumn-bg-color-picker');
    
    if (twocolumnColorText && twocolumnColorPicker) {
        twocolumnColorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && window.isValidHexColor(color)) {
                twocolumnColorPicker.value = color;
            }
        });
        
        twocolumnColorPicker.addEventListener('input', function() {
            twocolumnColorText.value = this.value;
        });
    }
    
    // Subcontainer element background color
    const subcontainerColorText = document.getElementById('element-subcontainer-bg-color');
    const subcontainerColorPicker = document.getElementById('element-subcontainer-bg-color-picker');
    
    if (subcontainerColorText && subcontainerColorPicker) {
        subcontainerColorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && window.isValidHexColor(color)) {
                subcontainerColorPicker.value = color;
            }
        });
        
        subcontainerColorPicker.addEventListener('input', function() {
            subcontainerColorText.value = this.value;
        });
    }
    
    // Image-text right element background color
    const imageTextRightColorText = document.getElementById('element-imagetext-right-bg-color');
    const imageTextRightColorPicker = document.getElementById('element-imagetext-right-bg-color-picker');
    
    if (imageTextRightColorText && imageTextRightColorPicker) {
        imageTextRightColorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && window.isValidHexColor(color)) {
                imageTextRightColorPicker.value = color;
            }
        });
        
        imageTextRightColorPicker.addEventListener('input', function() {
            imageTextRightColorText.value = this.value;
        });
    }
    
    // Image-text left element background color
    const imageTextLeftColorText = document.getElementById('element-imagetext-left-bg-color');
    const imageTextLeftColorPicker = document.getElementById('element-imagetext-left-bg-color-picker');
    
    if (imageTextLeftColorText && imageTextLeftColorPicker) {
        imageTextLeftColorText.addEventListener('input', function() {
            const color = this.value.trim();
            if (color && window.isValidHexColor(color)) {
                imageTextLeftColorPicker.value = color;
            }
        });
        
        imageTextLeftColorPicker.addEventListener('input', function() {
            imageTextLeftColorText.value = this.value;
        });
    }
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.openCustomPageGalleryImage = openCustomPageGalleryImage;
    window.initializeCustomPageGalleries = initializeCustomPageGalleries;
}

