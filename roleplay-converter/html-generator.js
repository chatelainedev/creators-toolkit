// Function to generate HTML content for the roleplay with collapsible parts
function generateRPContent(entries, parts, characterData) {
    let content = '';
    
    // Check if single story mode is enabled
    const singleStory = document.getElementById('single-story').checked;
    const noCharacters = document.getElementById('no-characters').checked;
    
    // Variables to track current state
    let currentPartIndex = 0;
    let isFirstContainer = true;
    let openContainer = false;
    
    // If we aren't using part markers, just use the first part title for everything
    const usePartMarkers = document.getElementById('use-part-markers').checked;
    
    // Also generate part IDs and titles for table of contents
    const tocParts = [];
    
    if (!usePartMarkers || singleStory) {
        // Just use the first part title or default title
        let partTitle = 'Story';
        if (!singleStory && parts.length > 0) {
            partTitle = parts[0];
        }
        const partId = 'part-1';
        
        // Add to TOC only if not in single story mode
        if (!singleStory) {
            tocParts.push({ id: partId, title: partTitle });
        }
        
        // Generate content without part headers if single story mode
        if (singleStory) {
            content += '\n        <div class="rp-container">';
        } else {
            // Generate part header with toggle button
            content += `\n        <div id="header-${partId}" class="part-header" onclick="togglePart('${partId}')">
            <h2>${partTitle}</h2>
            <span class="part-toggle">▼</span>
        </div>
        
        <div id="${partId}-content" class="rp-container">`;
        }
        
        // Add all entries to this one part
        entries.forEach((entry) => {
            if (entry.type === 'character') {
                content += '\n            <div class="rp-entry">';
                
                // Add character name only if not in no-characters mode
                if (!noCharacters) {
                    content += '\n                <div class="' + 
                            createCharClass(entry.character, characterData) + '">' + entry.character + ':</div>';
                }
                
                // Add paragraphs with markdown support
                entry.paragraphs.forEach(paragraph => {
                    // Check if this paragraph is just a divider
                    const trimmedParagraph = paragraph.trim();
                    if (trimmedParagraph.match(/^-{3,}$|^\*{3,}$/)) {
                        // It's a divider - output the styled span directly
                        content += '\n                <span class="section-divider"></span>';
                    } else if (containsHTML(paragraph)) {
                        // For HTML content, use div with class html-content and serialize with innerHTML
                        content += '\n                <div class="html-content" data-original="' + 
                                paragraph.replace(/"/g, '&quot;') + '">' + paragraph + '</div>';
                    } else {
                        // For non-HTML content, proceed with normal markdown processing
                        content += '\n                <p data-original="' + 
                                paragraph.replace(/"/g, '&quot;') + '">' + 
                                parseMarkdown(paragraph) + '</p>';
                    }
                });
                
                content += '\n            </div>';
            }
        });
        
        // Close the container
        content += '\n        </div>';
        
        return { content, tocParts };
    }
    
    // Using part markers - process parts normally
    // Process entries
    entries.forEach((entry, index) => {
        // Handle part breaks
        if (entry.type === 'partBreak') {
            // Close previous container if open
            if (openContainer) {
                content += '\n        </div>';
                openContainer = false;
            }
            
            // Get part title - make sure we don't go beyond the number of defined parts
            let partTitle = currentPartIndex < parts.length 
                ? parts[currentPartIndex] 
                : `Part ${currentPartIndex + 1}`;
            
            const partId = `part-${currentPartIndex + 1}`;
            
            // Add to TOC
            tocParts.push({ id: partId, title: partTitle });
            
            // Add part header with toggle button
            content += `\n        <div id="header-${partId}" class="part-header" onclick="togglePart('${partId}')">
            <h2>${partTitle}</h2>
            <span class="part-toggle">▼</span>
        </div>
        
        <div id="${partId}-content" class="rp-container">`;
            
            openContainer = true;
            currentPartIndex++;
            return;
        }
        
        // Character entry
        if (entry.type === 'character') {
            // If this is the first entry and no container is open yet
            if (isFirstContainer && !openContainer) {
                // Get the first part title
                let partTitle = parts.length > 0 ? parts[0] : 'Part One';
                const partId = 'part-1';
                
                // Add to TOC
                tocParts.push({ id: partId, title: partTitle });
                
                // Add part header with toggle button
                content += `\n        <div id="header-${partId}" class="part-header" onclick="togglePart('${partId}')">
            <h2>${partTitle}</h2>
            <span class="part-toggle">▼</span>
        </div>
        
        <div id="${partId}-content" class="rp-container">`;
                
                openContainer = true;
                isFirstContainer = false;
                currentPartIndex = 1;
            }
            
            // Add character entry
            content += '\n            <div class="rp-entry">';
            
            // Add character name only if not in no-characters mode
            if (!noCharacters) {
                content += '\n                <div class="' + 
                        createCharClass(entry.character, characterData) + '">' + entry.character + ':</div>';
            }
            
            // Add paragraphs with markdown support
            entry.paragraphs.forEach(paragraph => {
                // Check if this paragraph is just a divider
                const trimmedParagraph = paragraph.trim();
                if (trimmedParagraph.match(/^-{3,}$|^\*{3,}$/)) {
                    // It's a divider - output the styled span directly
                    content += '\n                <span class="section-divider"></span>';
                } else if (containsHTML(paragraph)) {
                    // For HTML content, use div with class html-content and serialize with innerHTML
                    content += '\n                <div class="html-content" data-original="' + 
                            paragraph.replace(/"/g, '&quot;') + '">' + paragraph + '</div>';
                } else {
                    // For non-HTML content, proceed with normal markdown processing
                    content += '\n                <p data-original="' + 
                            paragraph.replace(/"/g, '&quot;') + '">' + 
                            parseMarkdown(paragraph) + '</p>';
                }
            });
            
            content += '\n            </div>';
        }
    });
    
    // Close any open container
    if (openContainer) {
        content += '\n        </div>';
    }
    
    return { content, tocParts };
}

// Function to generate images HTML
// Replace your generateImagesHTML() function in html-generator.js with this fixed version
function generateImagesHTML() {
    const { storyFiles, storyPaths } = getSelectedImageFiles();
    
    console.log('generateImagesHTML called with storyFiles:', storyFiles.length, 'storyPaths:', storyPaths.length);
    
    let imagesHTML = '';
    
    // FIXED: Always include existing images first
    if (storyPaths.length > 0) {
        storyPaths.forEach((imagePath, index) => {
            console.log(`Using existing image path ${index}:`, imagePath);
            imagesHTML += `\n        <img src="${imagePath}" width="300" height="200" alt="Story Image">`;
        });
    }
    
    // FIXED: Then add new uploaded files (not mutually exclusive)
    if (storyFiles.length > 0) {
        storyFiles.forEach((file, index) => {
            const imagePath = `images/${getCleanTitle()}-image-${index + 1}.${getFileExtension(file.name)}`;
            console.log(`Generated image path for new file ${index}:`, imagePath);
            imagesHTML += `\n        <img src="${imagePath}" width="300" height="200" alt="Story Image">`;
        });
    }
    
    console.log('Final images HTML:', imagesHTML);
    return imagesHTML;
}

// Helper function to get clean title for image naming
function getCleanTitle() {
    const title = document.getElementById('title').value || 'untitled';
    return title.trim()
        .replace(/[<>:"/\\|?*',.()[\]{}]/g, '-')  // Replace problematic characters with hyphens
        .replace(/-+/g, '-')                       // Replace multiple consecutive hyphens with single hyphen
        .replace(/^-|-$/g, '')                     // Remove leading/trailing hyphens
        .toLowerCase();
}

// Helper function to get file extension
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

// Function to generate navigation HTML
function generateNavigationHTML() {
    const navElements = document.querySelectorAll('.nav-entry');
    if (navElements.length === 0) {
        // Return default navigation if no custom nav is defined
        return '<a href="../index.html">Home</a>';
    }
    
    let navHTML = '';
    navElements.forEach(entry => {
        const label = entry.querySelector('.nav-label').value.trim();
        const url = entry.querySelector('.nav-url').value.trim();
        
        if (label && url) {
            navHTML += `\n        <a href="${url}">${label}</a>`;
        }
    });
    
    // Always include at least a home link if nothing was provided
    if (navHTML === '') {
        navHTML = '<a href="../index.html">Home</a>';
    }
    
    return navHTML;
}

// Function to generate final HTML
function generateHTML() {
    // Get input values with safe access
    const title = document.getElementById('title')?.value || 'Untitled Story';
    const subtitle = document.getElementById('subtitle')?.value || 'A Universe Story';
    const description = document.getElementById('description')?.value || '';
    const universe = document.getElementById('universe')?.value || 'Universe';
    const pairing = document.getElementById('pairing')?.value || 'Character/Character';
    const date = document.getElementById('date')?.value || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const status = document.getElementById('status')?.value || 'Ongoing';
    
    // Handle title font size (check both old and new locations)
    let titleFontSize = '32'; // default
    const bannerTitleFontSizeEl = document.getElementById('title-font-size-banner');
    const oldTitleFontSizeEl = document.getElementById('title-font-size');
    
    if (bannerTitleFontSizeEl) {
        titleFontSize = bannerTitleFontSizeEl.value;
    } else if (oldTitleFontSizeEl) {
        titleFontSize = oldTitleFontSizeEl.value;
    }

    // Generate fallback title styles and logic
    let fallbackTitleStyles = '';
    let showFallbackTitle = false;

    // Check if banner title is hidden
    const showTitleEl = document.getElementById('show-title');
    if (showTitleEl && !showTitleEl.checked) {
        showFallbackTitle = true;
        fallbackTitleStyles = `
            /* Fallback Title Styles */
            .fallback-title {
                font-size: 1.4em;
                font-weight: bold;
                background-color: rgba(240, 240, 240, 0.7);
                padding: 8px 12px;
                border-radius: 4px;
                margin-bottom: 12px;
                text-align: center;
            }`;
    }
    
    // Get background image settings with safe access
    let backgroundFile = null;
    let backgroundPath = null;
    let backgroundExists = false;
    let bannerFile = null;
    let bannerPath = null;
    let bannerExists = false;
    
    // Safely get image files
    try {
        const imageData = getSelectedImageFiles();
        if (imageData) {
            backgroundFile = imageData.backgroundFile;
            backgroundPath = imageData.backgroundPath;
            backgroundExists = imageData.backgroundExists;
            bannerFile = imageData.bannerFile || null;
            bannerPath = imageData.bannerPath || null;
            bannerExists = imageData.bannerExists || false;
        }
    } catch (error) {
        console.log('getSelectedImageFiles not available or failed:', error);
    }
    
    const backgroundOpacity = document.getElementById('background-opacity')?.value || '20';
    const backgroundBlur = document.getElementById('background-blur')?.value || '5';

    // Determine background image path for HTML generation
    let backgroundImagePath = null;
    if (backgroundFile) {
        // New file selected - use the naming convention that will be applied by server
        const cleanTitle = getCleanTitle();
        const ext = getFileExtension(backgroundFile.name);
        backgroundImagePath = `images/${cleanTitle}-background.${ext}`;
    } else if (backgroundPath && backgroundExists) {
        // Existing file from import
        backgroundImagePath = backgroundPath;
    }
    
    // Get character data
    const characterData = [];
    const characterDivs = document.querySelectorAll('.character-info');
    characterDivs.forEach((div, index) => {
        const name = div.querySelector('.char-name').value;
        const color = div.querySelector('.char-color').value;
        
        if (name.trim() !== '') {
            characterData.push({
                name: name,
                color: color
            });
        }
    });
    
    // Get parts
    const partElements = document.querySelectorAll('.part-title');
    const parts = Array.from(partElements).map(el => el.value).filter(part => part.trim() !== '');
    
    // Generate character styles with fixed CSS class names for multi-word names
    let characterStyles = '';
    characterData.forEach(char => {
        const cssClass = getCharacterCSSClass(char.name);
        characterStyles += `\n        .${cssClass} {\n            color: ${char.color};\n        }`;
    });
    
    // Generate title font size styles
    let titleStyles = '';
    if (titleFontSize && titleFontSize !== '32') {
        titleStyles = `
        /* Custom Title Font Size */
        header h1 {
            font-size: ${titleFontSize}px;
        }`;
    }
    
    // Generate background image styles
    let backgroundStyles = '';
    if (backgroundImagePath) {
        backgroundStyles = `
            /* Background Image Styles */
            html {
                background-color: transparent;
            }
            
            body::before {
                content: '';
                position: fixed;
                top: -20px;           /* Extend beyond viewport */
                left: -20px;          /* Extend beyond viewport */
                width: calc(100% + 40px);  /* Make wider to compensate */
                height: calc(100% + 40px); /* Make taller to compensate */
                background-image: url('${backgroundImagePath}');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                filter: blur(${backgroundBlur}px);
                opacity: ${backgroundOpacity / 100};
                z-index: -2;
            }
            
            body {
                background-color: transparent;
            }
            
            /* Ensure content containers have proper background for readability */
            .content-wrapper,
            .rp-container {
                background-color: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(2px);
            }
            
            /* Keep header with its original dark styling but add slight transparency */
            header {
                background-color: rgba(51, 51, 51, 0.95);
                backdrop-filter: blur(2px);
            }
            
            /* Style the navigation breadcrumbs for better visibility */
            nav {
                background-color: rgba(51, 51, 51, 0.8);
                padding: 10px 20px;
                border-radius: 5px;
                backdrop-filter: blur(2px);
                margin-bottom: 20px;
            }
            
            nav a {
                color: rgba(255, 255, 255, 0.9);
                text-decoration: none;
                margin-right: 15px;
                transition: color 0.2s ease;
            }
            
            nav a:hover {
                color: #ffffff;
                text-decoration: underline;
            }
            
            .story-info {
                background-color: rgba(224, 240, 255, 0.95);
                backdrop-filter: blur(2px);
            }
            
            .soundtrack-panel, .comments-panel {
                background-color: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(3px);
            }`;
    }
    
    // Generate the content section and table of contents
    const { content, tocParts } = generateRPContent(parsedEntries, parts, characterData);
    
    // Generate table of contents if we have more than 1 part and not in single story mode
    let tableOfContents = '';
    const singleStory = document.getElementById('single-story').checked;
    if (tocParts.length > 1 && !singleStory) {
        tableOfContents = '<div class="table-of-contents">\n        <h3>Table of Contents</h3>\n        <ul>';
        tocParts.forEach(part => {
            // Fix the TOC links to point to the header elements
            tableOfContents += `\n            <li><a href="#header-${part.id}">${part.title}</a></li>`;
        });
        tableOfContents += '\n        </ul>\n    </div>';
    }
    
    // Generate images HTML
    const imagesHTML = generateImagesHTML();
    
    // Generate navigation HTML
    const navigationHTML = generateNavigationHTML();
    
    // Generate soundtrack HTML
    const soundtrackHTML = generateSoundtrackHTML();
    
    // Generate comments HTML
    const commentsHTML = generateCommentsHTML();
    
    // Get word count and page count
    const rpText = document.getElementById('rp-text').value;
    const wordCount = countWords(rpText);
    const pageCount = calculatePageCount(wordCount);
    
    // Get the HTML template
    const templateElement = document.getElementById('html-template');
    let template = templateElement.innerHTML;

    // Fix missing DOCTYPE and opening tags (innerHTML doesn't include these)
    if (!template.startsWith('<!DOCTYPE')) {
        template = `<!DOCTYPE html>
    <html lang="en">
    <head>
    ` + template;
    }

    // Process conditional sections for description, images, soundtrack, and comments
// Process conditional sections for description, images, soundtrack, and comments
let processedTemplate = template;

// Process description section
if (description) {
    const descRegex = /{{#if DESCRIPTION}}([\s\S]*?){{\/if}}/;
    processedTemplate = processedTemplate.replace(descRegex, '$1');
} else {
    // Remove the description section if no description
    const descRegex = /{{#if DESCRIPTION}}[\s\S]*?{{\/if}}/;
    processedTemplate = processedTemplate.replace(descRegex, '');
}

// Process fallback title section
if (showFallbackTitle) {
    const fallbackTitleRegex = /{{#if FALLBACK_TITLE}}([\s\S]*?){{\/if}}/;
    processedTemplate = processedTemplate.replace(fallbackTitleRegex, '$1');
} else {
    const fallbackTitleRegex = /{{#if FALLBACK_TITLE}}[\s\S]*?{{\/if}}/;
    processedTemplate = processedTemplate.replace(fallbackTitleRegex, '');
}

// Process images section
if (imagesHTML) {
    const imgRegex = /{{#if IMAGES}}([\s\S]*?){{\/if}}/;
    processedTemplate = processedTemplate.replace(imgRegex, '$1');
} else {
    // Remove the images section if no images
    const imgRegex = /{{#if IMAGES}}[\s\S]*?{{\/if}}/;
    processedTemplate = processedTemplate.replace(imgRegex, '');
}

// Process soundtrack section
if (soundtrackHTML) {
    const soundtrackRegex = /{{#if SOUNDTRACK}}([\s\S]*?){{\/if}}/;
    processedTemplate = processedTemplate.replace(soundtrackRegex, '$1');
} else {
    // Remove the soundtrack section if no soundtrack
    const soundtrackRegex = /{{#if SOUNDTRACK}}[\s\S]*?{{\/if}}/;
    processedTemplate = processedTemplate.replace(soundtrackRegex, '');
}

// Process comments section
if (commentsHTML) {
    const commentsRegex = /{{#if COMMENTS}}([\s\S]*?){{\/if}}/;
    processedTemplate = processedTemplate.replace(commentsRegex, '$1');
} else {
    // Remove the comments section if no comments
    const commentsRegex = /{{#if COMMENTS}}[\s\S]*?{{\/if}}/;
    processedTemplate = processedTemplate.replace(commentsRegex, '');
}
    
    // Replace placeholders
    let html = processedTemplate
        .replace(/{{TITLE}}/g, title)
        .replace(/{{SUBTITLE}}/g, subtitle)
        .replace('{{FALLBACK_TITLE_STYLES}}', fallbackTitleStyles)
        .replace(/{{DESCRIPTION}}/g, description)
        .replace(/{{UNIVERSE}}/g, universe)
        .replace(/{{PAIRING}}/g, pairing)
        .replace(/{{DATE}}/g, date)
        .replace(/{{STATUS}}/g, status)
        .replace('{{NAVIGATION}}', navigationHTML)
        .replace('{{IMAGES}}', imagesHTML)
        .replace('{{SOUNDTRACK}}', soundtrackHTML)
        .replace('{{COMMENTS}}', commentsHTML)
        .replace('{{WORD_COUNT}}', wordCount)
        .replace('{{PAGE_COUNT}}', pageCount)
        .replace('{{CHARACTER_STYLES}}', characterStyles)
        .replace('{{BACKGROUND_STYLES}}', backgroundStyles)
        .replace('{{TITLE_STYLES}}', titleStyles)
        .replace('{{BANNER_STYLES}}', generateBannerStyles())
        .replace('{{TABLE_OF_CONTENTS}}', tableOfContents)
        .replace('{{CONTENT}}', content);
    
    return html;
}

// Function to update the preview
// Function to update the preview
function updatePreview(html) {
    const iframe = document.getElementById('preview-frame');
    const previewContainer = document.querySelector('.preview-container');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    
    // Add 'has-content' class to hide the empty state placeholder
    if (previewContainer && html && html.trim()) {
        previewContainer.classList.add('has-content');
    } else if (previewContainer) {
        previewContainer.classList.remove('has-content');
    }
}

// Status message helper functions for RP Archiver
function showStatusMessage(message, type = 'info', duration = 5000) {
    const statusContainer = document.getElementById('status-container');
    if (!statusContainer) return;
    
    // Clear existing classes
    statusContainer.className = 'status-container';
    statusContainer.innerHTML = '';
    
    // Add appropriate class and message
    statusContainer.classList.add(type);
    statusContainer.textContent = message;
    
    // Auto-clear after duration (except for errors, keep them longer)
    if (type !== 'error') {
        setTimeout(() => {
            clearStatusMessage();
        }, duration);
    }
}

function clearStatusMessage() {
    const statusContainer = document.getElementById('status-container');
    if (statusContainer) {
        statusContainer.className = 'status-container';
        statusContainer.innerHTML = '';
    }
}

// Function to copy HTML to clipboard
function copyHTML() {
    const htmlOutput = document.getElementById('html-output');
    if (!htmlOutput.value) {
        showStatusMessage('Please generate HTML first', 'error');
        return;
    }
    
    htmlOutput.select();
    document.execCommand('copy');
    showStatusMessage('✅ HTML copied to clipboard!', 'success');
}

// Function to download HTML as a file
// Load available CSS templates
async function loadCSSTemplates() {
    try {
        const response = await fetch('/api/roleplay/templates');
        const templates = await response.json();
        
        const templateSelect = document.getElementById('css-template');
        if (templateSelect) {
            // Clear existing options except the first (default)
            templateSelect.innerHTML = '';
            
            // Add all templates
            templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.value;
                option.textContent = template.label;
                templateSelect.appendChild(option);
            });
            
            console.log(`🎨 Loaded ${templates.length} CSS templates`);
        }
    } catch (error) {
        console.error('Error loading CSS templates:', error);
        // If loading fails, just keep the default option
    }
}

// MODIFY the downloadHTML function in html-generator.js to include the selected template:
async function downloadHTML() {
    const html = document.getElementById('html-output').value;
    if (!html) {
        showStatusMessage('Please generate HTML first', 'error');
        return;
    }
    
    const title = document.getElementById('title').value || 'untitled';
    const cleanTitle = getCleanTitle(); // Add this line
    const universe = document.getElementById('universe').value || 'Universe';
    const cssTemplate = document.getElementById('css-template').value || 'generated.css';
    
    // Get selected image files - this now includes banner files
    const { backgroundFile, backgroundPath, backgroundExists, 
            bannerFile, bannerPath, bannerExists,           // ADD these
            storyFiles, storyPaths } = getSelectedImageFiles();
    
    // Show loading status
    showStatusMessage('💾 Saving to folder...', 'info');
    
    // Check if we have user session manager and are in local environment
    if (typeof userSessionManager !== 'undefined' && userSessionManager) {
        try {
            // Get user context
            const userContext = userSessionManager.getUserContext();

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('html', html);
            formData.append('title', title);
            formData.append('cleanTitle', cleanTitle); // Add this line
            formData.append('universe', universe);
            formData.append('cssTemplate', cssTemplate);
            formData.append('userContext', JSON.stringify(userContext));

            // Send existing image paths so server can avoid filename conflicts
            if (backgroundPath && backgroundExists) {
                formData.append('existingBackgroundPath', backgroundPath);
            }
            
            // ADD banner path handling
            if (bannerPath && bannerExists) {
                formData.append('existingBannerPath', bannerPath);
            }
            
            if (storyPaths.length > 0) {
                formData.append('existingStoryPaths', JSON.stringify(storyPaths));
                formData.append('existingImageCount', storyPaths.length.toString());
            }

            // Add new background image if selected
            if (backgroundFile) {
                formData.append('backgroundImage', backgroundFile);
            }

            // ADD new banner image if selected
            if (bannerFile) {
                formData.append('bannerImage', bannerFile);
            }

            // Add new story images if selected
            storyFiles.forEach((file, index) => {
                formData.append(`storyImage_${index}`, file);
            });
            
            // Make API call to save file with images
            const response = await fetch('/api/roleplay/save', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                const templateName = cssTemplate === 'generated.css' ? 'Default' : cssTemplate;
                let message = `✅ Saved "${title}" to ${universe} universe! Template: ${templateName}`;
                
                if (result.imagesUploaded > 0) {
                    message += ` | 🖼️ ${result.imagesUploaded} image(s) uploaded`;
                }
                
                if (result.conflictsAvoided) {
                    message += ` | ✅ Filename conflicts avoided`;
                }
                
                showStatusMessage(message, 'success', 7000);
                console.log('File saved to:', result.filepath);
                console.log('CSS template used:', result.cssTemplate);
                console.log('Images uploaded:', result.imagesUploaded);
            } else {
                throw new Error(result.error || 'Failed to save file');
            }
            
        } catch (error) {
            console.error('Error saving to user folder:', error);
            showStatusMessage('❌ Error saving file: ' + error.message + ' - Falling back to download...', 'error');
            
            // Fallback to regular download if save fails
            setTimeout(() => {
                fallbackDownload(html, title);
                showStatusMessage('📥 Downloaded as fallback', 'info');
            }, 2000);
        }
    } else {
        // Fallback to regular download if no user session
        console.log('No user session available, falling back to download');
        fallbackDownload(html, title);
        showStatusMessage('📥 Downloaded to your computer', 'info');
    }
}

// Fallback function for regular download
function fallbackDownload(html, title) {
    const filename = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.html';
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Function to convert roleplay text to HTML
function convertToHTML() {
    showStatusMessage('🔄 Generating HTML...', 'info');
    
    // Get character data
    const characterData = [];
    const characterDivs = document.querySelectorAll('.character-info');
    characterDivs.forEach((div, index) => {
        const name = div.querySelector('.char-name').value;
        const color = div.querySelector('.char-color').value;
        
        if (name.trim() !== '') {
            characterData.push({
                name: name,
                color: color
            });
        }
    });
    
    // Parse roleplay text
    const rpText = document.getElementById('rp-text').value;
    
    if (!rpText.trim()) {
        showStatusMessage('❌ Please enter some roleplay text first', 'error');
        return;
    }

    parsedEntries = parseRoleplayText(rpText, characterData);
    
    updateWordCount();

    // Generate HTML
    const html = generateHTML();
    
    // Display HTML
    document.getElementById('html-output').value = html;
    
    // If on preview tab, update preview
    if (document.querySelector('.tab[data-tab="preview"]').classList.contains('active')) {
        updatePreview(html);
    }
    
    showStatusMessage('✅ HTML generated successfully!', 'success');
}

// BANNER stuff
function generateBannerStyles() {
    // Check if banner elements exist - if not, return empty styles
    const showTitleEl = document.getElementById('show-title');
    const showSubtitleEl = document.getElementById('show-subtitle');
    const titleFontSizeEl = document.getElementById('title-font-size-banner');
    const titleFontColorEl = document.getElementById('title-font-color');
    const subtitleFontColorEl = document.getElementById('subtitle-font-color');
    const bannerSizeEl = document.getElementById('banner-size');
    
    // If banner elements don't exist, return empty styles
    if (!showTitleEl || !showSubtitleEl || !titleFontSizeEl || !titleFontColorEl || !subtitleFontColorEl || !bannerSizeEl) {
        console.log('Banner elements not found - returning empty banner styles');
        return '';
    }
    
    const showTitle = showTitleEl.checked;
    const showSubtitle = showSubtitleEl.checked;
    const titleFontSize = titleFontSizeEl.value;
    const titleFontColor = titleFontColorEl.value;
    const subtitleFontColor = subtitleFontColorEl.value;
    const bannerSize = bannerSizeEl.value;
    
    // Get banner image info (with null check)
    const bannerImageData = getSelectedBannerImageFile ? getSelectedBannerImageFile() : { bannerFile: null, bannerPath: null, bannerExists: false };
    const { bannerFile, bannerPath, bannerExists } = bannerImageData;
    
    // Determine banner image path for HTML generation
    let bannerImagePath = null;
    if (bannerFile) {
        // New file selected - use the naming convention
        const cleanTitle = getCleanTitle();
        const ext = getFileExtension(bannerFile.name);
        bannerImagePath = `images/${cleanTitle}-banner.${ext}`;
    } else if (bannerPath && bannerExists) {
        // Existing file from import
        bannerImagePath = bannerPath;
    }
    
    // Banner height mapping
    const bannerHeights = {
        'small': '80px',
        'medium': '120px', 
        'large': '160px'
    };
    const bannerHeight = bannerHeights[bannerSize] || '120px';
    
    let bannerStyles = `
        /* Banner Styles */
        header {
            height: ${bannerHeight};
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            overflow: hidden;`;
    
    // Add background image if available
    if (bannerImagePath) {
        bannerStyles += `
            background-image: url('${bannerImagePath}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;`;
    }
    
    bannerStyles += `
        }`;
    
    // Add title styles
    if (showTitle) {
        bannerStyles += `
        
        header h1 {
            font-size: ${titleFontSize}px;
            color: ${titleFontColor};
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
            margin: 0 0 8px 0;
            z-index: 2;
            position: relative;
        }`;
    } else {
        bannerStyles += `
        
        header h1 {
            display: none;
        }`;
    }
    
    // Add subtitle styles  
    if (showSubtitle) {
        bannerStyles += `
        
        header h2 {
            color: ${subtitleFontColor};
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
            margin: 0;
            z-index: 2;
            position: relative;
        }`;
    } else {
        bannerStyles += `
        
        header h2 {
            display: none;
        }`;
    }
    
    // Add overlay for better text readability if banner image exists
    if (bannerImagePath) {
        bannerStyles += `
        
        header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2));
            z-index: 1;
        }`;
    }
    
    return bannerStyles;
}