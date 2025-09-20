// Helper function to extract image information from HTML
function extractImageInfo(htmlContent) {
    const imageInfo = {
        backgroundImage: null,
        bannerImage: null,
        storyImages: []
    };
    
    try {
        // Extract background image from CSS - improved to handle body::before
        let backgroundMatch = htmlContent.match(/body::before\s*{[\s\S]*?background-image:\s*url\(['"]([^'"]+)['"]\)/);
        if (!backgroundMatch) {
            // Fallback patterns
            backgroundMatch = htmlContent.match(/background-image:\s*url\(['"]([^'"]+)['"]\)/);
        }
        if (!backgroundMatch) {
            backgroundMatch = htmlContent.match(/background-image:\s*url\(([^)]+)\)/);
        }
        if (backgroundMatch) {
            imageInfo.backgroundImage = backgroundMatch[1].replace(/['"]/g, '');
            console.log('Found background image:', imageInfo.backgroundImage);
        }
        
        // Extract banner image from header CSS - improved to handle multiline
        let headerBgMatch = htmlContent.match(/header\s*{[\s\S]*?background-image:\s*url\(['"]([^'"]+)['"]\)/);
        if (!headerBgMatch) {
            // Try without quotes
            headerBgMatch = htmlContent.match(/header\s*{[\s\S]*?background-image:\s*url\(([^)]+)\)/);
        }
        if (headerBgMatch) {
            imageInfo.bannerImage = headerBgMatch[1].replace(/['"]/g, '');
            console.log('Found banner image:', imageInfo.bannerImage);
        }
        
        // Extract story images from gallery section
        const storyImageRegex = /<img[^>]+src="([^"]+)"[^>]*alt="Story Image"[^>]*>/g;
        let match;
        while ((match = storyImageRegex.exec(htmlContent)) !== null) {
            imageInfo.storyImages.push(match[1]);
            console.log('Found story image:', match[1]);
        }
        
    } catch (error) {
        console.error('Error extracting image info:', error);
    }
    
    return imageInfo;
}

// Helper function to check images and display results
async function checkImagesExistAndDisplay(universe, imageInfo, allImagePaths) {
    try {
        const userContext = window.userSessionManager ? window.userSessionManager.getUserContext() : { isGuest: true };
        
        console.log('Checking images with userContext:', userContext);
        
        const imageExistenceData = await checkImagesExist(universe, allImagePaths, userContext);
        
        console.log('Image existence check result:', imageExistenceData);
        
        // Display images in the UI with existence info - UPDATE this call
        displayExistingImages(imageInfo.backgroundImage, imageInfo.bannerImage, imageInfo.storyImages, imageExistenceData);
        
    } catch (error) {
        console.error('Error checking image existence:', error);
        // Fallback - assume all images are missing
        const fallbackData = { existingImages: [], missingImages: allImagePaths };
        displayExistingImages(imageInfo.backgroundImage, imageInfo.bannerImage, imageInfo.storyImages, fallbackData);
    }
}

// Helper function to check if images exist on server
async function checkImagesExist(universe, imagePaths, userContext) {
    try {
        const response = await fetch('/api/roleplay/check-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                universe: universe,
                imagePaths: imagePaths,
                userContext: userContext
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            // Ensure result has required properties
            return {
                existingImages: result.existingImages || [],
                missingImages: result.missingImages || imagePaths
            };
        }
        console.warn('API response not ok:', response.status);
        return { existingImages: [], missingImages: imagePaths || [] };
    } catch (error) {
        console.warn('Could not check image existence:', error);
        return { existingImages: [], missingImages: imagePaths || [] };
    }
}

// Helper function to display existing images in the new UI
function displayExistingImages(backgroundImage, bannerImage, storyImages, imageExistenceData) {
    // Safety check for undefined imageExistenceData
    if (!imageExistenceData) {
        console.warn('imageExistenceData is undefined, using fallback');
        imageExistenceData = { existingImages: [], missingImages: [] };
    }
    
    const backgroundContainer = document.getElementById('background-image-display');
    const bannerContainer = document.getElementById('banner-image-display');
    const storyContainer = document.getElementById('images-container');
    
    // Clear containers
    backgroundContainer.innerHTML = '';
    bannerContainer.innerHTML = '';      // ADD this
    storyContainer.innerHTML = '';
    
    // Handle background image
    if (backgroundImage) {
        const exists = imageExistenceData.existingImages.includes(backgroundImage);
        displayImagePlaceholder(backgroundContainer, backgroundImage, exists, true);
        if (exists) {
            backgroundContainer.classList.add('has-file');
        }
    } else {
        backgroundContainer.innerHTML = '<div class="file-display-empty">No background image selected</div>';
    }
    
    // Handle banner image - ADD this entire block
    if (bannerImage) {
        const exists = imageExistenceData.existingImages.includes(bannerImage);
        displayBannerImagePlaceholder(bannerImage, exists);
        if (exists) {
            bannerContainer.classList.add('has-file');
        }
    } else {
        bannerContainer.innerHTML = '<div class="file-display-empty">No banner image selected</div>';
    }
    
    // Handle story images (unchanged)
    if (storyImages.length > 0) {
        storyImages.forEach(imagePath => {
            const exists = imageExistenceData.existingImages.includes(imagePath);
            displayImagePlaceholder(storyContainer, imagePath, exists, false);
        });
    } else {
        storyContainer.innerHTML = '<div class="file-display-empty">No story images selected</div>';
    }
}

// Helper function to create image placeholders for existing images
function displayImagePlaceholder(container, imagePath, exists, isBackground) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item' + (exists ? '' : ' missing-file');
    
    const filename = imagePath.split('/').pop();
    const statusText = exists ? 'Existing file' : 'Missing file - will be removed on save';
    
    fileItem.innerHTML = `
        <div class="file-info">
            <div class="file-name">${filename}</div>
            <div class="file-size">${statusText}</div>
        </div>
        <button type="button" class="file-remove" title="Remove image">×</button>
    `;
    
    // Store image path info on the element
    fileItem._imagePath = imagePath;
    fileItem._exists = exists;
    
    // Add remove functionality
    const removeBtn = fileItem.querySelector('.file-remove');
    removeBtn.addEventListener('click', function() {
        fileItem.remove();
        if (isBackground) {
            container.classList.remove('has-file');
            container.innerHTML = '<div class="file-display-empty">No background image selected</div>';
        }
        if (container.children.length === 0 && !isBackground) {
            container.innerHTML = '<div class="file-display-empty">No story images selected</div>';
        }
    });
    
    container.appendChild(fileItem);
}

// Helper function to extract template information from imported HTML
function extractTemplateInfo(htmlContent) {
    let detectedTemplate = 'generated.css'; // default
    
    console.log('🔍 Extracting template info from HTML...');
    
    try {
        // Look for the meta tag we added - try multiple patterns anywhere in the document
        const patterns = [
            /<meta\s+name="rp-archiver-template"\s+content="([^"]+)"/i,
            /<meta\s+content="([^"]+)"\s+name="rp-archiver-template"/i,
            /<meta[^>]*rp-archiver-template[^>]*content="([^"]+)"/i
        ];
        
        for (const pattern of patterns) {
            const match = htmlContent.match(pattern);
            if (match) {
                detectedTemplate = match[1];
                console.log('📋 Found template marker with pattern:', pattern.source);
                console.log('📋 Detected template:', detectedTemplate);
                return detectedTemplate;
            }
        }
        
        console.log('📋 No template marker found, using default');
        
        // Debug: Show first part of document to see structure
        console.log('📄 Document start preview:', htmlContent.substring(0, 500) + '...');
        
    } catch (error) {
        console.warn('Error extracting template info:', error);
    }
    
    return detectedTemplate;
}

// Function to handle file import
function importHTML() {
    const fileInput = document.getElementById('import-file');
    if (!fileInput.files || fileInput.files.length === 0) {
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const htmlContent = e.target.result;
        parseImportedHTML(htmlContent);
    };
    
    reader.readAsText(file);
}

// Function to parse imported HTML and extract data
function parseImportedHTML(htmlContent) {
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    

    // Extract title and universe from document title (format: "Title - Universe")
    const documentTitle = doc.title || '';
    const titleParts = documentTitle.split(' - ');
    const title = titleParts[0] || '';
    const universe = titleParts[1] || '';

    document.getElementById('title').value = title;
    document.getElementById('universe').value = universe;
    
    // Extract story info from the .story-info section
    const storyInfoParagraphs = doc.querySelectorAll('.story-info p');
    
    // Initialize variables
    let pairing = '';
    let date = '';
    let status = '';
    
    // Parse each paragraph to extract the correct information
    storyInfoParagraphs.forEach(p => {
        const text = p.textContent.trim();
        if (text.startsWith('Pairing:')) {
            pairing = text.replace('Pairing:', '').trim();
        } else if (text.startsWith('Last Updated:')) {
            date = text.replace('Last Updated:', '').trim();
        } else if (text.startsWith('Status:')) {
            status = text.replace('Status:', '').trim();
        }
    });
    
    // Set the extracted values
    document.getElementById('pairing').value = pairing;
    document.getElementById('date').value = date;
    
    // Set the status dropdown to the correct value
    const statusSelect = document.getElementById('status');
    // Check if the status value exists in the dropdown options
    const statusOptions = Array.from(statusSelect.options).map(option => option.value);
    if (statusOptions.includes(status)) {
        statusSelect.value = status;
    } else {
        // If the exact status isn't found, try to match common variations
        const statusLower = status.toLowerCase();
        if (statusLower.includes('complete') || statusLower.includes('finished')) {
            statusSelect.value = 'Complete';
        } else if (statusLower.includes('ongoing') || statusLower.includes('in progress')) {
            statusSelect.value = 'Ongoing';
        } else if (statusLower.includes('hiatus') || statusLower.includes('paused')) {
            statusSelect.value = 'Hiatus';
        }
    }
    
    // Extract description
    const descriptionElement = doc.querySelector('.story-description p');
    if (descriptionElement) {
        const descriptionText = descriptionElement.textContent;
        const description = descriptionText.replace('Description:', '').trim();
        document.getElementById('description').value = description;
    }
    
    // Extract navigation links
    const navLinks = doc.querySelectorAll('nav a');
    const navigationContainer = document.getElementById('navigation-container');
    navigationContainer.innerHTML = ''; // Clear existing navigation
    
    navLinks.forEach(link => {
        const label = link.textContent.trim();
        const url = link.getAttribute('href');
        if (label && url) {
            addNavigation(label, url);
        }
    });
    
    // Extract images using new system
    const imageInfo = extractImageInfo(htmlContent);
    const allImagePaths = [
        ...(imageInfo.backgroundImage ? [imageInfo.backgroundImage] : []),
        ...(imageInfo.bannerImage ? [imageInfo.bannerImage] : []),  // ADD this
        ...imageInfo.storyImages
    ];

    console.log('Extracted image info:', imageInfo);
    console.log('All image paths:', allImagePaths);

    // Check which images actually exist on the server
    if (allImagePaths.length > 0) {
        // Use the universe that was already extracted from document title
        const universeFromForm = document.getElementById('universe').value || 'Universe';
        
        console.log('Detected universe:', universeFromForm);
        
        // Actually check if images exist
        checkImagesExistAndDisplay(universeFromForm, imageInfo, allImagePaths);
    }

    // Clear the old images container and remove the old add button functionality
    const oldImagesContainer = document.getElementById('images-container');
    const oldAddImageBtn = document.getElementById('add-image');
    if (oldAddImageBtn) {
        oldAddImageBtn.style.display = 'none'; // Hide old button if it exists
    }
    
    // Extract parts and detect single story mode
    const partHeaders = doc.querySelectorAll('.part-header h2');
    const tableOfContents = doc.querySelector('.table-of-contents');
    const partsContainer = document.getElementById('parts-container');
    partsContainer.innerHTML = ''; // Clear existing parts
    
    // Detect if this was generated as a single story (no parts, no TOC)
    const isSingleStory = partHeaders.length === 0 && !tableOfContents;
    const singleStoryCheckbox = document.getElementById('single-story');
    const usePartMarkersCheckbox = document.getElementById('use-part-markers');
    
    if (isSingleStory) {
        singleStoryCheckbox.checked = true;
        usePartMarkersCheckbox.checked = false;
        usePartMarkersCheckbox.disabled = true;
    } else {
        singleStoryCheckbox.checked = false;
        usePartMarkersCheckbox.checked = true;  // This was missing!
        usePartMarkersCheckbox.disabled = false;
        
        partHeaders.forEach(header => {
            const partTitle = header.textContent.trim();
            addPart(partTitle);
        });
    }
    
    // Check if this was generated with "No Characters" mode and set checkbox accordingly
    const hasCharacterNames = doc.querySelector('.character-name') !== null;
    const noCharactersCheckbox = document.getElementById('no-characters');
    const charactersContainer = document.getElementById('characters-container');
    const addCharacterBtn = document.getElementById('add-character');
    
    if (!hasCharacterNames) {
        // This file was generated with "No Characters" mode
        noCharactersCheckbox.checked = true;
        charactersContainer.style.display = 'none';
        addCharacterBtn.style.display = 'none';
    } else {
        // This file has character names
        noCharactersCheckbox.checked = false;
        charactersContainer.style.display = 'block';
        addCharacterBtn.style.display = 'inline-block';
    }
    
    // Extract character names and colors from CSS
    const styleElement = doc.querySelector('style');
    if (styleElement) {
        const styleText = styleElement.textContent;
        const characterStyles = styleText.match(/\.[a-z0-9-]+\s*\{\s*color:\s*#[0-9a-fA-F]+;\s*\}/g) || [];
        
        // Extract background image settings (note: actual background image extraction is handled elsewhere now)
        const backgroundOpacityMatch = styleText.match(/opacity:\s*([\d.]+)/);
        const backgroundBlurMatch = styleText.match(/filter:\s*blur\((\d+)px\)/);
        
        // Handle background image opacity and blur settings (values only, image itself handled by new system)
        if (backgroundOpacityMatch) {
            const opacityPercent = Math.round(parseFloat(backgroundOpacityMatch[1]) * 100);
            document.getElementById('background-opacity').value = opacityPercent;
            document.getElementById('opacity-value').textContent = opacityPercent + '%';
        }
        if (backgroundBlurMatch) {
            document.getElementById('background-blur').value = backgroundBlurMatch[1];
            document.getElementById('blur-value').textContent = backgroundBlurMatch[1] + 'px';
        }

        // Extract banner settings - ONLY if banner section exists
        const bannerSizeSelect = document.getElementById('banner-size');
        if (bannerSizeSelect) {
            // Extract banner size
            const bannerHeightMatch = styleText.match(/header\s*{[^}]*height:\s*(\d+)px/);
            if (bannerHeightMatch) {
                const height = parseInt(bannerHeightMatch[1]);
                if (height <= 90) {
                    bannerSizeSelect.value = 'small';
                } else if (height <= 140) {
                    bannerSizeSelect.value = 'medium';
                } else {
                    bannerSizeSelect.value = 'large';
                }
            }
            
            // Extract title display settings
            const titleDisplayMatch = styleText.match(/header h1\s*{[^}]*display:\s*none/);
            const showTitleCheckbox = document.getElementById('show-title');
            if (showTitleCheckbox) {
                showTitleCheckbox.checked = !titleDisplayMatch;
            }
            
            const subtitleDisplayMatch = styleText.match(/header h2\s*{[^}]*display:\s*none/);
            const showSubtitleCheckbox = document.getElementById('show-subtitle');
            if (showSubtitleCheckbox) {
                showSubtitleCheckbox.checked = !subtitleDisplayMatch;
            }
            
            // Extract title color
            const titleColorMatch = styleText.match(/header\s+h1\s*{[^}]*color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/);
            if (titleColorMatch) {
                const titleColorInput = document.getElementById('title-font-color');
                if (titleColorInput) {
                    titleColorInput.value = titleColorMatch[1];
                }
            }
            
            // Extract subtitle color
            const subtitleColorMatch = styleText.match(/header\s+h2\s*{[^}]*color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/);
            if (subtitleColorMatch) {
                const subtitleColorInput = document.getElementById('subtitle-font-color');
                if (subtitleColorInput) {
                    subtitleColorInput.value = subtitleColorMatch[1];
                }
            }
        } else {
            console.log('Banner section not found - skipping banner import settings');
        }

        // Extract title font size - try multiple patterns (KEEP THIS DECLARATION!)
        let titleFontSizeMatch = styleText.match(/header\s+h1\s*\{\s*font-size:\s*(\d+)px\s*;?\s*\}/);
        if (!titleFontSizeMatch) {
            // Try alternative patterns
            titleFontSizeMatch = styleText.match(/header\s+h1[^}]*font-size:\s*(\d+)px/);
        }
        if (!titleFontSizeMatch) {
            // Try even more flexible pattern
            titleFontSizeMatch = styleText.match(/h1[^}]*font-size:\s*(\d+)px/);
        }

        // Handle the title font size (UPDATED to use banner inputs)
        if (titleFontSizeMatch) {
            const fontSize = titleFontSizeMatch[1];
            
            // Try new banner location first
            const bannerFontSizeInput = document.getElementById('title-font-size-banner');
            const bannerFontSizeValue = document.getElementById('title-font-size-banner-value');
            
            if (bannerFontSizeInput && bannerFontSizeValue) {
                // Banner section exists - use it
                bannerFontSizeInput.value = fontSize;
                bannerFontSizeValue.textContent = fontSize + 'px';
            } else {
                // Fallback to old location if it still exists
                const oldFontSizeInput = document.getElementById('title-font-size');
                const oldFontSizeValue = document.getElementById('title-font-size-value');
                
                if (oldFontSizeInput && oldFontSizeValue) {
                    oldFontSizeInput.value = fontSize;
                    oldFontSizeValue.textContent = fontSize + 'px';
                }
            }
        } else {
            // Reset to default if no custom font size found
            const bannerFontSizeInput = document.getElementById('title-font-size-banner');
            const bannerFontSizeValue = document.getElementById('title-font-size-banner-value');
            
            if (bannerFontSizeInput && bannerFontSizeValue) {
                bannerFontSizeInput.value = 32;
                bannerFontSizeValue.textContent = '32px';
            } else {
                // Fallback to old elements
                const oldFontSizeInput = document.getElementById('title-font-size');
                const oldFontSizeValue = document.getElementById('title-font-size-value');
                
                if (oldFontSizeInput && oldFontSizeValue) {
                    oldFontSizeInput.value = 32;
                    oldFontSizeValue.textContent = '32px';
                }
            }
        }
        
        // Clear existing characters
        const charactersContainer = document.getElementById('characters-container');
        charactersContainer.innerHTML = '';
        
        // Only process characters if the file had character names
        if (hasCharacterNames) {
            // Create a map of character names and colors
            const characterMap = {};
            
            // Find all character entries in the HTML to get original names
            const characterElements = doc.querySelectorAll('.character-name');
            const characterNames = Array.from(characterElements).map(el => {
                const text = el.textContent.replace(':', '').trim();
                return text;
            });
            
            // Remove duplicates
            const uniqueNames = [...new Set(characterNames)];
            
            // Now match CSS styles to character names
            characterStyles.forEach(style => {
                const match = style.match(/\.([a-z0-9-]+)\s*\{\s*color:\s*(#[0-9a-fA-F]+);\s*\}/);
                if (match) {
                    const cssClass = match[1];
                    const color = match[2];
                    
                    // Find the corresponding character name
                    const characterName = uniqueNames.find(name => {
                        const expectedClass = getCharacterCSSClass(name);
                        return expectedClass === cssClass;
                    });
                    
                    if (characterName) {
                        characterMap[characterName] = color;
                    }
                }
            });
            
            // If we couldn't match CSS classes to names, try to extract from the style element differently
            if (Object.keys(characterMap).length === 0 && uniqueNames.length > 0) {
                // Fall back to using default colors for found character names
                uniqueNames.forEach((name, index) => {
                    const defaultColor = defaultColors[index % defaultColors.length];
                    characterMap[name] = defaultColor;
                });
            }
            
            // Add characters
            Object.entries(characterMap).forEach(([name, color]) => {
                addCharacter(name, color);
            });
        }
    }
    
    // Try to extract soundtrack data if the container exists
    try {
        const soundtrackContainer = document.getElementById('soundtrack-container');
        if (soundtrackContainer) {
            soundtrackContainer.innerHTML = ''; // Clear existing soundtrack entries
            
            // Find soundtrack section in imported HTML
            const soundtrackContent = doc.querySelector('.soundtrack-content');
            if (soundtrackContent) {
                // Extract sections and tracks
                const sections = soundtrackContent.querySelectorAll('.soundtrack-section');
                
                if (sections.length > 0) {
                    sections.forEach(section => {
                        // Get section title
                        const titleElement = section.querySelector('.soundtrack-section-title');
                        if (titleElement) {
                            const title = titleElement.textContent.trim();
                            addTrackHeading(title);
                        }
                        
                        // Get tracks in this section
                        const tracks = section.querySelectorAll('.soundtrack-track');
                        tracks.forEach(track => {
                            const link = track.querySelector('a');
                            if (link) {
                                const trackName = link.textContent.trim();
                                // Remove the music note emoji if present
                                const cleanName = trackName.replace(/🎵\s*/, '').trim();
                                const trackUrl = link.getAttribute('href');
                                addTrack(cleanName, trackUrl);
                            }
                        });
                    });
                } else {
                    // If we have no sections but direct tracks (possible in older files)
                    const directTracks = soundtrackContent.querySelectorAll('.soundtrack-track');
                    directTracks.forEach(track => {
                        const link = track.querySelector('a');
                        if (link) {
                            const trackName = link.textContent.trim();
                            // Remove the music note emoji if present
                            const cleanName = trackName.replace(/🎵\s*/, '').trim();
                            const trackUrl = link.getAttribute('href');
                            addTrack(cleanName, trackUrl);
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.log('Error importing soundtrack data:', error);
        // Continue with import even if soundtrack import fails
    }
    
    // Try to extract comments data if the container exists
    try {
        const commentsContainer = document.getElementById('comments-container');
        if (commentsContainer) {
            commentsContainer.innerHTML = ''; // Clear existing comment entries
            
            // Find comments section in imported HTML
            const commentsContent = doc.querySelector('.comments-content');
            if (commentsContent) {
                // Extract sections and comments
                const sections = commentsContent.querySelectorAll('.comments-section');
                
                if (sections.length > 0) {
                    sections.forEach(section => {
                        // Get section title
                        const titleElement = section.querySelector('.comments-section-title');
                        if (titleElement) {
                            const title = titleElement.textContent.trim();
                            addCommentHeading(title);
                        }
                        
                        // Get comments in this section
                        const commentBlocks = section.querySelectorAll('.comment-block');
                        commentBlocks.forEach(commentBlock => {
                            // Extract the text content and convert back to comment format
                            let commentText = commentBlock.innerHTML.trim();
                            
                            // Simple conversion from HTML back to markdown
                            commentText = commentText
                                .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
                                .replace(/<em>(.*?)<\/em>/g, '*$1*')
                                .replace(/<del>(.*?)<\/del>/g, '~~$1~~')
                                .replace(/<br\s*\/?>/g, '\n')
                                .replace(/<\/p><p>/g, '\n\n')
                                .replace(/<\/?p>/g, '');
                            
                            // Add the comment: prefix back
                            const formattedComment = 'comment: ' + commentText;
                            addComment(formattedComment);
                        });
                    });
                } else {
                    // If we have no sections but direct comments (possible in older files)
                    const directComments = commentsContent.querySelectorAll('.comment-block');
                    directComments.forEach(commentBlock => {
                        let commentText = commentBlock.innerHTML.trim();
                        
                        // Simple conversion from HTML back to markdown
                        commentText = commentText
                            .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
                            .replace(/<em>(.*?)<\/em>/g, '*$1*')
                            .replace(/<del>(.*?)<\/del>/g, '~~$1~~')
                            .replace(/<br\s*\/?>/g, '\n')
                            .replace(/<\/p><p>/g, '\n\n')
                            .replace(/<\/?p>/g, '');
                        
                        const formattedComment = 'comment: ' + commentText;
                        addComment(formattedComment);
                    });
                }
            }
        }
    } catch (error) {
        console.log('Error importing comments data:', error);
        // Continue with import even if comments import fails
    }
    
// Extract roleplay text - this is the most complex part
const rpEntries = doc.querySelectorAll('.rp-entry');
let rpText = '';

// Track if we're in a new part
let currentPartId = '';

rpEntries.forEach(entry => {
    // Check if this entry is in a different part container than the previous one
    const partContainer = entry.closest('.rp-container');
    if (partContainer) {
        const partId = partContainer.id;
        if (partId !== currentPartId) {
            // Add part marker if this isn't the first part
            if (currentPartId !== '') {
                rpText += '\n&&&PART&&&\n\n';
            }
            currentPartId = partId;
        }
    }
    
    if (hasCharacterNames) {
        // Original logic for files with character names
        const characterElement = entry.querySelector('.character-name');
        if (characterElement) {
            const character = characterElement.textContent.replace(':', '').trim();
            rpText += character + ': ';
            
            // Get all child nodes (paragraphs AND dividers) in order
            const allNodes = entry.querySelectorAll('p, .html-content, .section-divider');
            allNodes.forEach((node, index) => {
                if (node.classList.contains('section-divider')) {
                    rpText += '\n\n---\n\n';
                } else {
                    // Try to get original markdown from data attribute
                    const originalText = node.getAttribute('data-original') || node.textContent.trim();
                    rpText += originalText;
                    // Add a blank line between paragraphs if not followed by a divider
                    if (index < allNodes.length - 1 && !allNodes[index + 1].classList.contains('section-divider')) {
                        rpText += '\n\n';
                    }
                }
            });
            
            // Add two blank lines between different characters
            rpText += '\n\n';
        }
    } else {
        // Handle files generated with "No Characters" mode
        // Get all child nodes (paragraphs AND dividers) in order
        const allNodes = entry.querySelectorAll('p, .html-content, .section-divider');
        allNodes.forEach((node, index) => {
            if (node.classList.contains('section-divider')) {
                rpText += '\n\n---\n\n';
            } else {
                // Try to get original markdown from data attribute
                const originalText = node.getAttribute('data-original') || node.textContent.trim();
                rpText += originalText;
                // Add two blank lines between paragraphs if not followed by a divider
                if (index < allNodes.length - 1 && !allNodes[index + 1].classList.contains('section-divider')) {
                    rpText += '\n\n';
                }
            }
        });
        
        // Add extra spacing between entries
        rpText += '\n\n';
    }
});
    
    // Set the roleplay text
    document.getElementById('rp-text').value = rpText.trim();
    
// Extract and set CSS template
    try {
        const detectedTemplate = extractTemplateInfo(htmlContent);
        console.log('🎨 Setting CSS template to:', detectedTemplate);
        
        const cssTemplateSelect = document.getElementById('css-template');
        if (cssTemplateSelect) {
            // Set the dropdown to the detected template
            cssTemplateSelect.value = detectedTemplate;
            
            // Verify it was set correctly
            const actualValue = cssTemplateSelect.value;
            if (actualValue === detectedTemplate) {
                console.log('✅ CSS template set successfully:', actualValue);
            } else {
                console.warn('⚠️ CSS template not found in dropdown options:', detectedTemplate);
                console.log('Available options:', Array.from(cssTemplateSelect.options).map(o => o.value));
                
                // Fallback to default
                cssTemplateSelect.value = 'generated.css';
                console.log('📋 Fallback to default template');
            }
        } else {
            console.warn('CSS template dropdown not found');
        }
    } catch (templateError) {
        console.error('Error setting CSS template during import:', templateError);
    }

    // Extract subtitle separately (it's just whatever the subtitle is)
    const universeElement = doc.querySelector('header h2');
    if (universeElement) {
        const subtitle = universeElement.textContent.trim();
        document.getElementById('subtitle').value = subtitle;
    }

    // Update word count
    updateWordCount();
}